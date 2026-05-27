# Review: Kudos Like + Spotlight Search
**Branch:** feature.new.kudos_live_board  
**Score: 7.5/10**  
**Critical issues: 1**

---

## Critical

### C1 — `bonus_multiplier` read from untrusted row in SECURITY DEFINER trigger
**File:** `20260528000900_kudos_like_write.sql` lines 33, 37  
**Severity:** critical

The trigger reads `NEW.bonus_multiplier` / `OLD.bonus_multiplier` — a column the *inserting user supplies*. The INSERT policy has no `WITH CHECK` constraint on that column. A user can set `bonus_multiplier = 2147483647` on insert, causing the trigger (which runs as the table owner via SECURITY DEFINER) to add ~2B to any kudos' `like_count`. The GREATEST(0, …) guard on DELETE does nothing to cap this.

**Fix options (pick one):**
```sql
-- Option A: ignore the column in the trigger; always delta by 1
SET like_count = like_count + 1   -- INSERT
SET like_count = GREATEST(0, like_count - 1)  -- DELETE

-- Option B: add a WITH CHECK to the INSERT policy
WITH CHECK (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  AND bonus_multiplier = 1   -- <-- add this
  AND NOT EXISTS (...)
);
```

Option A is simpler and future-proof. If the special-day 2× multiplier is a planned feature, gate it server-side (action layer or a DB function that validates eligibility), never from client-supplied data.

---

## High

### H1 — TOCTOU race in `toggleLike` (check-then-act)
**File:** `lib/sun-kudos/actions.ts` lines 158–195  
**Severity:** high

Three round-trips: `getUser` → `select kudos.sender_id` → `select existing like` → `insert/delete`. Two concurrent calls from the same client (rapid double-tap on slow network) can both pass the "not exists" check and both attempt INSERT. The PK `(kudos_id, user_id)` makes the second INSERT fail with a unique violation; that error is logged as `server_error` and the optimistic state reverts correctly. However the trigger fires once (good) but the client sees an error for what was functionally a no-op. Consider wrapping the insert in an `ON CONFLICT DO NOTHING` pattern and returning the resulting state instead of treating it as an error.

```sql
-- Not directly possible via Supabase JS; use upsert:
supabase.from("kudos_likes").upsert(
  { kudos_id: kudosId, user_id: profileId },
  { onConflict: "kudos_id,user_id", ignoreDuplicates: true }
)
```

### H2 — `getLikeContext` email fallback can resolve the wrong profile
**File:** `lib/sun-kudos/queries.ts` lines 110–116  
**Severity:** high

If `user_id` lookup returns nothing, `getLikeContext` falls back to email. Unlike `resolveSenderProfileId`, it does **not** check `byEmail.data.user_id === null` before using the result. If a seeded profile has a matching email but `user_id` owned by a different auth user, this can make user A see user B's liked set and `isOwn` flags. `resolveSenderProfileId` guards this correctly (line 53–55 of actions.ts) — `getLikeContext` should mirror that guard.

**Fix:**
```typescript
if (byEmail.data && (!byEmail.data.user_id || byEmail.data.user_id === user.id)) {
  profileId = byEmail.data.id;
}
```

---

## Medium

### M1 — Optimistic reconcile math has a stale-closure edge case
**File:** `app/page-sun-kudos/use-kudos-like.ts` line 31  
**Severity:** medium

```typescript
setCount((c) => c + (res.liked ? 1 : -1) - (next ? 1 : -1));
```

`next` is a closure over the value at the time `toggle()` ran. If a second toggle fires while the transition is in-flight (guarded by `pending`, so unlikely but not impossible due to React's concurrent batching), `next` might not reflect the current count delta. The `pending` guard protects toggle entry, but `startTransition` is interruptible — a re-render triggered externally can cause the server action callback to close over a stale `next`. Low probability but hard to debug. Passing `next` into the callback via an explicit variable captured before `startTransition` (already done) is correct; the issue is the expression itself double-adjusts relative to `c` which already absorbed the optimistic +1. In the happy path (server agrees) this branch is never reached; only the divergence branch. Verify the intent: if server says `liked=false` but client says `next=true`, the delta should be `(false?1:-1) - (true?1:-1) = -1 - 1 = -2`. That removes the optimistic +1 and flips to -1. Seems correct *only if* count `c` still holds the post-optimistic value. This is true in practice but worth a comment.

### M2 — `isOwn` false-negative for anonymous kudos with unlinked profile
**File:** `lib/sun-kudos/queries.ts` line 88  
**Severity:** medium

```typescript
isOwn: !!ctx.profileId && row.sender?.id === ctx.profileId,
```

`ctx.profileId` comes from `getLikeContext` which may resolve via email fallback to a profile that hasn't yet been claimed via `resolveSenderProfileId`. If the real auth user just signed in and hasn't triggered `resolveSenderProfileId`, `ctx.profileId` will be null (user_id lookup fails, email fallback returns unlinked profile — but if claimed already, fine). The RLS still blocks the like server-side, so this is a UX-only gap: the heart will appear enabled for their own anonymous kudos until the page re-renders after first write. Acceptable, but worth noting.

### M3 — Spotlight search: empty-result has no user feedback
**File:** `app/page-sun-kudos/spotlight-board.tsx` lines 38–46  
**Severity:** medium

When `names.length === 0` after filtering, `topNames` and `bottomRightNames` are both empty — the word cloud area goes blank with no "no results" message. A user typing a mismatched query will see a silent empty canvas. Add a conditional:

```tsx
{names.length === 0 && query && (
  <p className="text-white/50 text-sm">{t("noProfilesFound")}</p>
)}
```

---

## Low / Suggestions

### L1 — BADGE_IMAGES duplicated in both card files
Both `kudos-card-highlight.tsx` and `kudos-card-feed.tsx` define an identical `BADGE_IMAGES` object. Extract to a shared `badge-images.ts` constant.

### L2 — Heart color inconsistency
Highlight card uses `#D4271D` (brand red) for liked state; feed card uses `#e53e3e` (Chakra red). Should be unified to the design token `#D4271D`.

### L3 — `currentUserName` string-match in activity log is fragile
`spotlight-board.tsx` line 179: `entry.text.includes(currentUserName)` matches substring — a user named "An" will highlight any entry containing "An" (e.g. "Nguyễn Hoàng Linh"). Use a more precise match or structure the log with a `receiverName` field separate from display text.

### L4 — `is_anonymous` column missing from the original schema
`kudos` table was created without `is_anonymous` / `anonymous_name` columns in the base migration but the seed and queries use them. Confirm these were added in a subsequent migration (likely `20260527223300`). If not, add them.

---

## Security Checklist

| Item | Status |
|------|--------|
| User cannot forge `user_id` on insert | PASS — RLS `WITH CHECK` binds to `auth.uid()` |
| Self-like blocked | PASS — both RLS NOT EXISTS subquery and action layer guard |
| DELETE RLS blocks deleting others' likes | PASS — `user_id IN (profiles where user_id=auth.uid())` |
| SECURITY DEFINER trigger abuse | **FAIL — C1 above** |
| Server action uses RLS client (not service-role) | PASS — `createSupabaseServerClient()` uses session cookies |
| No PII/stack trace leakage to client | PASS — errors return opaque codes |

---

## Edge Cases Found (Scouting)

- `getHighlightKudos` is ordered by `like_count DESC` but `like_count` is the seeded+delta value. If the trigger fires on bulk-imported data before seeding is complete, counts can be inconsistent. Not a bug per se, but worth noting.
- `getLikeContext` fetches ALL `kudos_likes` rows for the user (`select kudos_id ... eq user_id`). If a power user liked 10k kudos, this unbounded fetch could be slow. Acceptable for current scale but no `limit` is applied.

---

**Status:** DONE_WITH_CONCERNS  
**Score: 7.5/10**  
**Critical:** 1 (bonus_multiplier injection via SECURITY DEFINER trigger)  
**High:** 2 (TOCTOU race, getLikeContext wrong-profile edge case)  
**Medium:** 3 | **Low:** 4
