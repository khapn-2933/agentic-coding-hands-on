---
report: reviewer-260527-2233-write-kudo
scope: Sun Kudos write path (backend + integration)
branch: feature.new.kudos_live_board
reviewer: Staff Engineer (Claude Sonnet 4.6)
date: 2026-05-27
score: 7.5/10
---

## Code Review Summary

### Scope
- Files: `supabase/migrations/20260527223300_sun_kudos_write.sql`, `lib/sun-kudos/actions.ts`, `lib/sun-kudos/queries.ts`, `app/page-sun-kudos/kudos-hero.tsx`, `app/page-sun-kudos/write-kudo-modal.tsx`, `app/page-sun-kudos/write-kudo-hashtags.tsx`, `app/page-sun-kudos/write-kudo-images.tsx`, `app/sun-kudos/page.tsx`
- LOC: ~600 changed/added
- Focus: backend write path, RLS security, anonymous sender privacy, correctness

### Overall Assessment
The write path is architecturally sound: anon-key SSR client keeps RLS active, server action validates inputs, DB has a `kudos_no_self_send` CHECK constraint as a final backstop. The anonymous privacy masking is correctly done at the server-side mapping layer so no raw sender data reaches the client. Two issues need attention before this goes to more users: a latent silent-failure in the seeded-profile linking path (blocked by its own RLS policy), and raw DB error messages leaking to the client.

---

## CRITICAL Issues

None.

---

## HIGH Issues

### H1 — `profiles_update_self` USING clause silently blocks seeded-profile linking

**File:** `supabase/migrations/20260527223300_sun_kudos_write.sql` + `lib/sun-kudos/actions.ts:53-58`

**Problem:** `profiles_update_self` is defined as:
```sql
FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```
The `USING` clause filters which rows the UPDATE can see. For a seeded profile with `user_id = NULL`, the expression `NULL = auth.uid()` evaluates to `NULL` (not `TRUE`), so the row is invisible to the UPDATE. Supabase returns no error — it silently updates 0 rows.

`resolveSenderProfileId` then returns `byEmail.data.id` (the seeded profile's ID), optimistically assuming the link succeeded. However, since `user_id` is still `NULL`, the subsequent kudos INSERT is rejected by `kudos_insert_own` (the `sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())` check returns no rows).

**Current impact:** Low — seeded profiles have no `email` column, so the email-fallback path is never reached today. This will silently break the first time an admin seeds profiles with matching real emails.

**Fix (two options):**

*Option A — use UPSERT instead of UPDATE in `resolveSenderProfileId`:*
```sql
-- Add to migration: allow update of user_id when row has user_id IS NULL
CREATE POLICY profiles_claim_unlinked ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = auth.uid());
```
Then verify the update succeeded before returning:
```ts
const { count } = await supabase
  .from("profiles")
  .update({ user_id: user.id })
  .eq("id", byEmail.data.id)
  .is("user_id", null)
  .select("id", { count: "exact", head: true });
if (!count) return null; // claim failed, fall through to create new profile
return byEmail.data.id;
```

*Option B — change the USING clause to also allow rows with `user_id IS NULL`:*
```sql
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid())
```
This is simpler but slightly broadens the UPDATE surface (any authenticated user can update any unclaimed profile). For an internal app this is acceptable but less precise than Option A.

---

### H2 — Raw DB error messages returned to client

**File:** `lib/sun-kudos/actions.ts:116`

```ts
if (error) return { ok: false, error: error.message };
```

`error.message` is the raw Postgres/PostgREST error string (e.g. `"new row violates row-level security policy for table \"kudos\""`, `"invalid input syntax for type uuid"`, constraint names). This propagates to the client via `throw new Error(res.error)` in `kudos-hero.tsx:34`, and since the modal has no `catch` block (only `finally`), it bubbles to the React error boundary — exposing schema internals in the error overlay or console.

**Fix:**
```ts
if (error) {
  console.error("[createKudos] DB error:", error.message); // server-side log only
  return { ok: false, error: "server_error" };
}
```
Map the opaque code to a user-facing string in the modal. Also add a `catch` in `handleSubmit` to surface inline UI feedback rather than crashing to the error boundary:
```ts
try {
  await onSubmit({ ... });
  onClose();
} catch (e) {
  setErrors({ submit: t("submitFailed") });
} finally {
  setSubmitting(false);
}
```

---

## MEDIUM Issues

### M1 — No server-side length limits on `content`, `title`, `anonymous_name`

**File:** `lib/sun-kudos/actions.ts`, `supabase/migrations/`

`content`, `title`, and `anonymous_name` are `text` columns with no length constraint at either the DB or action layer. A valid authenticated user can submit multi-MB payloads. No rate limiting exists.

**Fix (action layer, cheapest):**
```ts
const MAX_CONTENT = 2000;
const MAX_TITLE   = 200;
const MAX_ANON    = 100;

if (content.length > MAX_CONTENT) return { ok: false, error: "content_too_long" };
if ((input.title?.trim() ?? "").length > MAX_TITLE) return { ok: false, error: "title_too_long" };
```
Add corresponding `CHECK (char_length(content) <= 2000)` in a future migration for belt-and-suspenders.

---

### M2 — `recipientId` not validated as UUID before DB insert

**File:** `lib/sun-kudos/actions.ts:96`

`input.recipientId` is checked for truthiness but not format. A malformed string (not a UUID) results in a Postgres error propagated to the client (see H2). RLS prevents exploitation, but the raw error is still leaked.

**Fix:** Add a quick UUID regex guard before the DB call:
```ts
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!UUID_RE.test(input.recipientId)) return { ok: false, error: "invalid_recipient" };
```

---

### M3 — `getHashtagSuggestions` does in-application dedup instead of SQL DISTINCT

**File:** `lib/sun-kudos/queries.ts:266-274`

Fetches up to 200 full kudos rows (each with a `hashtags text[]`) and deduplicates in JS. As the board grows this wastes bandwidth and compute.

**Fix:**
```sql
SELECT DISTINCT unnest(hashtags) AS tag FROM kudos ORDER BY tag LIMIT 200;
```
Exposed via Supabase `.rpc()` or a SQL view.

---

### M4 — Images silently discarded

**File:** `lib/sun-kudos/actions.ts:111`

The modal's image upload UI lets users pick up to 5 images. The server action always inserts `image_urls: []`. Users see their images in the preview, submit, and the board shows nothing. This is silent data loss from the user's perspective.

The UI should either (a) disable/hide the image section with a "coming soon" label, or (b) the action should upload to Supabase Storage and pass URLs. Currently neither happens.

---

### M5 — `write-kudo-modal.tsx` is 583 lines; toolbar buttons are decorative

**File:** `app/page-sun-kudos/write-kudo-modal.tsx`

The `ToolbarBtn` row (Bold, Italic, etc.) renders but has no `onClick` handlers and no rich-text backing — they're visual fakes. Users clicking them get no feedback. Should either be wired up or marked visually as disabled/coming-soon. The file also exceeds the 200-line guideline from `development-rules.md`.

---

## LOW Issues

### L1 — Self-recipient appears in the dropdown

`getRecipientOptions()` returns all profiles including the current user. They can be selected, then the action rejects with `"self_send"`. The error is not shown inline (see H2). Filter the current user from the list at the server level or mark them in the UI.

### L2 — `handleLike` in `kudos-card-feed.tsx` is optimistic with no persistence

The like button increments local state but never calls a server action. On `router.refresh()` the count resets. This exists since the likes write path is unimplemented, but toggling the heart then seeing it revert after the post-create refresh is visible UX regression.

### L3 — `revalidatePath('/sun-kudos')` + `router.refresh()` is redundant

`revalidatePath` invalidates Next.js server cache; `router.refresh()` re-fetches RSC payload. Both do the job individually. In practice it means two reloads of the data on success. The combination is harmless but one is sufficient. Given the RSC flow, `revalidatePath` + no `router.refresh()` is the canonical pattern.

### L4 — `getRecipientOptions` has no pagination/limit

Fetches all profiles (`SELECT ... ORDER BY full_name`) with no `LIMIT`. Fine at current scale (< 100 users) but will slow the initial page load as the company grows. Add a sane default limit (e.g. 500) and document it.

---

## Security Checklist Results

| Check | Result |
|---|---|
| Kudos INSERT RLS: user can't forge sender_id | PASS — `sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())` |
| Profiles INSERT: user can only create own row | PASS — `WITH CHECK (user_id = auth.uid())` |
| Profiles UPDATE: user can only update own row | PASS for linked profiles; **LATENT BUG for unlinked seeded profiles (H1)** |
| Service-role client bypasses RLS | PASS — uses anon-key + JWT `createSupabaseServerClient` |
| Anonymous kudos: real sender not exposed to client | PASS — masking done server-side in `toEntry()`, KudosEntry has no sender_id |
| XSS: content stored/rendered as text | PASS — no `dangerouslySetInnerHTML` anywhere; JSX text nodes used |
| Self-send blocked | PASS — server check + DB `kudos_no_self_send` CHECK constraint |
| Input validation server-side (not just client) | PARTIAL — recipient/content/hashtag presence checked, no length limits (M1) |
| Raw error messages to client | FAIL — H2 |
| `recipient_id` format validation | PARTIAL — truthiness only, not UUID format (M2) |

---

## Positive Observations

- RLS architecture is correct: anon key + JWT means all writes go through RLS — no accidental service-role bypass.
- `kudos_no_self_send` DB CHECK is a solid backstop beyond the application-layer check.
- `toEntry()` anonymous masking is done server-side before data leaves the RSC boundary — the right place.
- `normalizeHashtag` handles multiple leading `#`, empty strings, and the `.slice(0, 5)` cap is applied server-side.
- `createSupabaseServerClient` uses `@supabase/ssr` cookie-based auth correctly (no custom cookie parsing).
- Error-free insert confirmed by E2E (52→53 kudos) with auto-profile creation working correctly.

---

## Recommended Actions (priority order)

1. **(H1)** Add `profiles_claim_unlinked` RLS policy (or adjust USING clause) + verify update result in `resolveSenderProfileId` before returning the profile ID.
2. **(H2)** Log DB errors server-side, return opaque error codes to client; add `catch` block in modal `handleSubmit` for inline error display.
3. **(M1)** Add server-side length limits for `content` (2000), `title` (200), `anonymous_name` (100).
4. **(M2)** Validate `recipientId` UUID format before the DB call.
5. **(M4)** Either wire up image upload to Supabase Storage or disable the UI section with a clear "coming soon" label.
6. **(M5)** Disable or stub-label the rich-text toolbar buttons so they don't mislead users.

---

## Score: 7.5 / 10

Good security foundation; the critical path (RLS, anon masking, self-send guard) is sound. Score docked primarily for the latent seeded-profile update bug (H1) which will silently break a real use case when emails are seeded, and for raw DB error exposure (H2).

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Write path is production-safe for the current seed data. Two issues should be addressed before onboarding users whose emails match manually-seeded profiles (H1) or before error messages are visible to end-users (H2).
**Concerns:** H1 (silent update failure) will surface when admins seed profiles with real employee emails — the feature appears to work but kudos inserts are silently rejected by RLS.
**Critical count:** 0 | **High count:** 2 | **Score:** 7.5/10
