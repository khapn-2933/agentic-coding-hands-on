# Code Review: Sun* Kudos Live Board
**Date:** 2026-05-27  
**Branch:** feature.new.kudos_live_board  
**Reviewer:** reviewer agent (Claude Sonnet 4.6)

---

## Scope
- Files: 13 (2 migrations, 1 queries.ts, 1 page.tsx, 8 components, 1 mock-data.ts, 2 i18n files, 1 next.config.ts)
- LOC: ~1,400 new lines
- Focus: security, correctness, code quality

## Overall Assessment
Solid MVP scaffold. No secrets committed, no SQL injection surface, RLS is wired. Three meaningful bugs found — one crash-on-empty-state (HIGH), one misleading UI interaction (MEDIUM), one silent data mismatch (MEDIUM). The rest are low/style.

---

## CRITICAL Issues
_None._

---

## HIGH Issues

### H1 — Carousel crash when `kudos` prop is empty array
**File:** `app/page-sun-kudos/highlight-kudos-section.tsx` L10-26  
**Severity:** HIGH — runtime crash visible to all users if DB returns 0 highlight kudos.

When `kudos.length === 0`:
- `total = Math.max(0, 1) = 1`
- `currentIndex = 0`
- `indices = [0, 0, 0]` — all three positions map to `kudos[0]` which is `undefined`
- `KudosCardHighlight` receives `kudos={undefined}` → immediate crash on `kudos.isLiked` etc.

**Fix:**
```tsx
if (kudos.length === 0) {
  return (
    <section className="w-full bg-[#00101A] pt-10">
      {/* header JSX */}
      <div className="flex justify-center py-20">
        <p style={{ color: "rgba(255,255,255,0.4)" }}>{t("emptyKudos")}</p>
      </div>
    </section>
  );
}
```

---

## MEDIUM Issues

### M1 — Like toggle is client-only, misleading UX
**Files:** `kudos-card-feed.tsx` L76-87, `kudos-card-highlight.tsx` L58-67

Like state is local React state — clicking "like" updates the count visually but is not persisted. On page refresh the count reverts. For a read-only MVP this is acceptable _only if the UI makes it clear_; currently the heart icon behaves like a real toggle (turns red, count increments/decrements), which will confuse users.

**Fix options (pick one):**
- Disable the like button (`pointer-events-none`, grey out) until write API exists.
- Add a tooltip/toast: "Tính năng này sắp ra mắt".

### M2 — `getHighlightKudos` ignores `is_highlight` column
**File:** `lib/sun-kudos/queries.ts` L75-84

Function is named `getHighlightKudos` and the `kudos` table has `is_highlight boolean` but the query orders by `like_count DESC` without filtering `.eq("is_highlight", true)`. This returns the top-liked kudos regardless of editorial curation, defeating the purpose of the flag.

**Fix:**
```ts
.eq("is_highlight", true)
.order("like_count", { ascending: false })
```

### M3 — Seed data sets no `email` on profiles → `getCurrentUserStats` always returns fallback
**File:** `supabase/migrations/20260526135800_sun_kudos_seed.sql`

The seed INSERT omits the `email` column. `getCurrentUserStats` looks up the profile via `.eq("email", user.email)` — this will never match any seeded profile, so the stats sidebar always shows 0/0/0 for every logged-in user. Acceptable for demo but should be documented or the seed should include representative emails.

### M4 — `formatPostedAt` uses local server timezone, not UTC or user locale
**File:** `lib/sun-kudos/queries.ts` L27-31

`new Date(iso).getHours()` etc. uses the Node.js process timezone. In production (UTC server) `created_at = now() - interval '1 hour'` will display the correct hour only if the server TZ matches Vietnam (UTC+7). On a UTC server, times will be 7h off.

**Fix:**
```ts
const d = new Date(iso);
// Use toLocaleString with explicit timezone:
return d.toLocaleString("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"
});
```
Or format in the browser (client component) where the user's local TZ applies.

---

## LOW Issues

### L1 — Page has no auth redirect; anon users hit all 5 DB queries
**File:** `app/sun-kudos/page.tsx` + `lib/sun-kudos/queries.ts`

The page has no middleware guard and no redirect for unauthenticated users. Because RLS is `TO authenticated`, Supabase will block all queries server-side and return empty arrays — the page renders but shows 0 data. Not a security hole (data is safe), but the UX is broken silently. The stats sidebar's `getUser()` call gracefully returns fallback, so no crash.

**If this page is intended to be public (read-only board viewable without login):** RLS policies should include `anon` role. Currently anon gets nothing.  
**If it's auth-gated:** add a redirect to `/` or login when `!user`.

### L2 — Double `auth.getUser()` per request
**Files:** `app/sun-kudos/page.tsx` L19-22, `lib/sun-kudos/queries.ts` L145-149

`page.tsx` calls `supabase.auth.getUser()` to build the header user, then `getCurrentUserStats` calls it again. Two round-trips to Supabase Auth per page load. Pass `user` down to `getCurrentUserStats` as a parameter.

### L3 — `getRecentGiftRecipients` and `getSpotlightData.names` have no ORDER BY
**File:** `lib/sun-kudos/queries.ts` L199-207 and L106-108

PostgreSQL does not guarantee row order without `ORDER BY`. These queries will return rows in arbitrary order, potentially shuffled between server restarts. Add `.order("created_at", { ascending: false })` (or any stable column) for deterministic output.

### L4 — Activity log text and gift label hardcoded in Vietnamese
**Files:** `lib/sun-kudos/queries.ts` L119, L205

```ts
text: `${receiver} đã nhận được Kudos mới`  // always Vietnamese
gift: "Nhận được 1 áo phông SAA"             // always Vietnamese
```
These strings come from the server query layer, not i18n. They bypass the locale system. For EN locale, users will see Vietnamese text in the activity log and gift panel.

**Fix:** Move these strings to i18n keys (pass locale into `getSpotlightData`/`getRecentGiftRecipients`), or return raw data and format in the component.

### L5 — `noData` i18n key is defined but never used
**Files:** `messages/en.json` L138, `messages/vi.json` L138

Key `"noData"` exists in both locales but no component calls `t("noData")`. Dead key.

### L6 — `isNew` flag never set by DB mapper → `showNewBadgeOnSender` always falsy
**File:** `lib/sun-kudos/queries.ts` `toEntry()`, `app/page-sun-kudos/all-kudos-feed.tsx` L38

`KudosEntry.isNew` is an optional field. `toEntry()` never sets it, so `entry.isNew` is always `undefined`. The `New Here` badge on the first card (`showNewBadgeOnSender={i === 0 && entry.isNew}`) will never render from live data. If intentional, remove the prop; if not, add logic to determine "new" (e.g. `created_at > now - 24h`).

### L7 — "New Here" badge text hardcoded, not translated
**File:** `app/page-sun-kudos/kudos-card-feed.tsx` L33

`"New Here"` is a hardcoded English string. Move to `t("newHereBadge")` in i18n files.

### L8 — `"Sun* Annual Awards 2025"` subtitle hardcoded in 3 components
**Files:** `all-kudos-feed.tsx` L16, `spotlight-board.tsx` L39, `highlight-kudos-section.tsx` L37

The year "2025" will require a grep-and-replace next year. Extract to a shared constant or i18n key.

### L9 — `kudos-card-feed.tsx` at 268 lines exceeds 200-line guideline
**File:** `app/page-sun-kudos/kudos-card-feed.tsx`

Exceeds project's 200-line soft limit. `PersonBlock` (shared with `kudos-card-highlight.tsx`) could be extracted to `person-block.tsx`, reducing both files. The image gallery row (~20 lines) could also be a separate component.

### L10 — `BADGE_COLORS` duplicated across two components
**Files:** `kudos-card-feed.tsx` L8-13, `kudos-card-highlight.tsx` L13-18

Identical constant. Extract to `mock-data.ts` or a `kudos-constants.ts`.

### L11 — Index as React key for static lists
**Files:** multiple components (`spotlight-board.tsx` L159, `gift-recipients-panel.tsx` L34, hashtag spans in both card components)

`key={i}` is acceptable only for truly static lists. Hashtag arrays from DB can change order between renders. Use the tag string itself as key (`key={tag}`).

### L12 — `star_rank_for` function: `SECURITY INVOKER` (default) is correct
**File:** `supabase/migrations/20260526135700_sun_kudos_schema.sql` L93-103

Function is `LANGUAGE sql STABLE SET search_path = public` — no `SECURITY DEFINER`, so it runs as the calling role (INVOKER). This is the safe default. The `SET search_path = public` prevents search_path injection. No issue.

---

## Schema Design Notes

- `like_count` denormalized without a trigger is a known deferred debt (comment acknowledges it). Acceptable for read-only MVP since `kudos_likes` is empty. Risk: when writes ship, `like_count` divergence is guaranteed if the trigger is missed.
- `profiles.user_id` nullable FK is intentional and documented. Correct pattern for pre-seeded users.
- `kudos_no_self_send` CHECK constraint is a good guard.
- `star_rank_for` RPC: safe, correct, no injection surface.
- PostgREST FK disambiguation syntax `profiles!sender_id(...)` is correct for supabase-js v2 — this resolves the ambiguous foreign key between `kudos.sender_id` and `kudos.receiver_id`, both referencing `profiles`.

---

## Positive Observations
- `import "server-only"` in `queries.ts` — correct, prevents accidental client bundle inclusion.
- All 4 tables have `ENABLE ROW LEVEL SECURITY` before policies — no table missed.
- No anon write path — RLS policies are SELECT-only, no INSERT/UPDATE/DELETE policies present.
- No hardcoded secrets in any committed file.
- `toEntry`/`toPerson` null-safe with `??` fallbacks throughout.
- `Promise.all` in both page and `getSpotlightData` — parallel fetches, no N+1.
- `getSpotlightData` error swallowing to empty arrays is documented behavior — fine for MVP.
- `next.config.ts` remote image pattern is correctly scoped to `i.pravatar.cc` only.
- Seed UUIDs are deterministic — reproducible across re-seeds.

---

## Recommended Actions (Priority Order)
1. **[HIGH]** Fix carousel crash on empty `kudos` array — add empty guard in `HighlightKudosSection` before carousel renders.
2. **[MEDIUM]** Add `.eq("is_highlight", true)` filter to `getHighlightKudos`.
3. **[MEDIUM]** Disable like button (or add "coming soon" hint) — do not fake interactivity that won't persist.
4. **[MEDIUM]** Fix `formatPostedAt` timezone: either use `toLocaleString` with `timeZone: "Asia/Ho_Chi_Minh"` or move formatting client-side.
5. **[LOW]** Clarify auth intent: either add anon RLS or redirect unauthenticated users.
6. **[LOW]** Move `"đã nhận được Kudos mới"` and `"Nhận được 1 áo phông SAA"` to i18n or server-side locale param.
7. **[LOW]** Add `ORDER BY` to `getRecentGiftRecipients` and `getSpotlightData.names`.
8. **[LOW]** Pass `user` into `getCurrentUserStats` to eliminate duplicate `getUser()` call.
9. **[LOW]** Extract `PersonBlock` and `BADGE_COLORS` to shared module; split `kudos-card-feed.tsx`.

---

## Metrics
- Type Coverage: ~85% (3 `as unknown as` casts; no untyped `any` flags found)
- Test Coverage: 0% (no tests added — MVP, acceptable)
- Linting Issues: 0 syntax errors found; ~6 `key={i}` antipattern warnings expected
- Critical Issues: 0
- High Issues: 1 (carousel crash)
- Medium Issues: 4
- Low Issues: 12

---

## Unresolved Questions
1. Is `/sun-kudos` intended to be publicly accessible (no login) or auth-gated? The RLS `TO authenticated` implies auth-gated, but the page has no redirect.
2. Will `like_count` denormalization trigger ship before the like-write migration? If not, `like_count` will be permanently wrong once likes are enabled.
3. `giftRecipientsTitle` says "10 LATEST GIFT RECIPIENTS" but `getRecentGiftRecipients(limit=5)` returns 5. Mismatch in copy.

---

**Score: 7.0 / 10**

**Status:** DONE_WITH_CONCERNS  
**Summary:** MVP is structurally sound with no security vulnerabilities. One HIGH bug (carousel crash on empty data) must be fixed before deploy. Three MEDIUM issues (is_highlight not filtered, misleading like toggle, timezone display bug) should be addressed in the same PR or immediately after.  
**Concerns:** H1 carousel crash will surface in production if `getHighlightKudos` ever returns 0 rows (DB reset, filter added later, etc.).
