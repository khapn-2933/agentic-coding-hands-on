# Code Review — Homepage SAA

**Score: 7.5 / 10**

Files reviewed: `proxy.ts`, `lib/event-config.ts`, `app/page.tsx`, `app/[slug]/page.tsx`, `app/_components/*.tsx` (6), `app/page-home/*.tsx` (6), `app/layout.tsx`, `lib/supabase/proxy-client.ts`, `lib/supabase/server-client.ts`, `.env.local.example`

---

## Critical Issues

### 1. `public/.claude/` directory must NOT be served — internal AI memory exposed at runtime

**File:** `public/.claude/agent-memory/implementer/` (tracked as untracked in git status)  
**Problem:** Next.js serves everything in `/public/` at the root URL. `public/.claude/agent-memory/implementer/project-saa-homepage.md` is reachable at `https://your-domain/.claude/agent-memory/implementer/project-saa-homepage.md` in production. It contains internal project implementation notes, file paths, and TODO items — not secrets, but internal tooling state leaking to the public web. More critically, this directory must NEVER be committed to git since `.gitignore` does not exclude `/public/.claude/`.

**Fix:** Delete `public/.claude/` entirely. This directory was misplaced by the implementer agent. Agent memory lives in `.claude/`, not `public/.claude/`. Add `public/.claude` to `.gitignore` as a safeguard.

---

## High Priority

### 2. `proxy.ts` prefix match too broad — `/profilex`, `/adminfoo` would be protected

**File:** `proxy.ts:17`  
**Problem:** `PROTECTED_PREFIXES.some(p => pathname.startsWith(p))` matches `/profilex` and `/adminfoo` as protected even though no such routes exist today. Low immediate risk (they 404 anyway), but adds confusion if a future route like `/profile-setup` is intentionally public. Should match path boundaries.

**Fix:**
```ts
const isProtected = PROTECTED_PREFIXES.some(
  (p) => pathname === p || pathname.startsWith(p + "/")
);
```

### 3. `account-menu.tsx` — no keyboard dismiss / click-outside handler

**File:** `app/_components/account-menu.tsx:54`  
**Problem:** Dropdown opens on click but has no mechanism to close on: Escape key, click outside, or focus loss. Once opened, the only way to close it is to click the trigger again. This blocks all keyboard users and breaks expected UX contract for menus.

**Fix:** Add `useEffect` with `document.addEventListener('mousedown', handler)` + `ref` for the container, and `onKeyDown` on the button for Escape. Same applies to `language-selector.tsx` and `notification-bell.tsx`.

### 4. `language-selector.tsx` — `role="option"` on `<li>` with click but no keyboard handler

**File:** `app/_components/language-selector.tsx:83-98`  
**Problem:** `<li role="option" onClick={...}>` interactive elements that aren't natively focusable need `tabIndex={0}` and `onKeyDown` with Enter/Space to be keyboard accessible. As-is, keyboard users cannot select a language. Screen readers expect listbox options to be keyboard navigable.

**Fix:** Add `tabIndex={0}` and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') select(option); }}` to each `<li role="option">`.

### 5. `account-menu.tsx` — `role="menuitem"` on `<li>` is wrong; should be on the interactive child

**File:** `app/_components/account-menu.tsx:83, 94, 149`  
**Problem:** WAI-ARIA spec requires `role="menuitem"` on the interactive element, not on a container `<li>`. The `<li>` should have no role (or `role="presentation"`), and the `<a>` / `<button>` inside should carry `role="menuitem"`. Current markup creates an accessible tree where a non-interactive `<li>` is announced as a menuitem, and the actual `<a>` is a confusingly nested child.

**Fix:** Move `role="menuitem"` from `<li>` to `<a>` and `<button>` inside, or use `role="presentation"` on the `<li>`.

### 6. Layout `metadata.title` still says "SAA 2025 — Sign in" for ALL routes

**File:** `app/layout.tsx:18`  
**Problem:** `title: "SAA 2025 — Sign in"` is the root layout title shared by every page including the homepage, stub pages, and error pages. No page-level `metadata` export exists in `app/page.tsx` or `app/[slug]/page.tsx` to override it. This means the homepage tab shows "Sign in" which is both incorrect and misleading.

**Fix:** Update root layout title to `"SAA 2025 — Root Further"`. Add page-specific overrides: `export const metadata: Metadata = { title: "SAA 2025 — Root Further" }` in `app/page.tsx`.

### 7. `hero-countdown.tsx` — event info text is hardcoded, will desync from env var

**File:** `app/page-home/hero-countdown.tsx:118`  
**Problem:** `"Thời gian: 26/12/2025"` is hardcoded in JSX. `eventStartAt` is already passed as a prop from the env var. If the event date changes via `NEXT_PUBLIC_EVENT_START_AT`, the countdown updates but the display text below stays wrong.

**Fix:** Parse the display date from `eventStartAt` prop:
```ts
const displayDate = new Date(eventStartAt).toLocaleDateString("vi-VN", {
  day: "2-digit", month: "2-digit", year: "numeric"
});
```
Then render `Thời gian: {displayDate}` instead of the hardcoded string.

---

## Medium Priority

### 8. `[slug]/page.tsx` stub pages have no `SaaHeader` / `SaaFooter` — chrome missing on all stubs

**File:** `app/[slug]/page.tsx:23-37`  
**Problem:** `/awards`, `/sun-kudos`, and all other stubs render a bare `<main>` with no navigation header or footer. Users land on these pages with no way to navigate except the "Về trang chủ" link. This is especially bad for `/profile` and `/admin` which authenticated users are expected to visit.

**Note:** This may be intentional for the stub phase — clarifications say "Coming soon" placeholder — but worth flagging as a UX gap. The plan spec at phase-02 also shows bare `<main>` in the stub template, so this matches spec. Flag for post-stub implementation.

### 9. `notification-bell.tsx` — unread badge always rendered (hardcoded stub)

**File:** `app/_components/notification-bell.tsx:46-49`  
**Problem:** The yellow dot badge is rendered unconditionally with `{/* Stub: always show unread badge */}`. An authenticated user with no notifications will always see a notification indicator, which is deceptive UX. Screen readers also announce "Unread notifications" on every page load.

**Fix (short-term):** Add `aria-hidden="true"` to the badge `<span>` while it's hardcoded, or pass a `hasUnread` prop from the server. Badge should only render when `hasUnread` is true.

### 10. `saa-header.tsx` — mobile nav hidden (`hidden md:flex`) with no mobile fallback

**File:** `app/_components/saa-header.tsx:39`  
**Problem:** The navigation is hidden on screens below `md` breakpoint with no hamburger menu or alternate navigation provided. Mobile users get only the logo and the right-side auth buttons. `/awards`, `/sun-kudos` are unreachable from mobile without direct URL entry. Not in clarifications — unclear if this is a design decision or an oversight.

**Fix:** Either add a hamburger menu for mobile, or document as intentional deferral. Clarifications should capture this.

### 11. `countdown-tile.tsx` — key={idx} on digit array

**File:** `app/page-home/countdown-tile.tsx:13`  
**Problem:** `key={idx}` on a static 2-element array derived from digit split. No runtime impact but violates React key best-practices; digit identity should be key (e.g., `key={`${label}-d${idx}`}`). Minor but flagged per code quality standards.

---

## Low Priority / Nice-to-have

### 12. `hero-countdown.tsx` — countdown updates every 60s but has no `aria-live` region

**File:** `app/page-home/hero-countdown.tsx:103-113`  
Screen reader users won't receive announcements when countdown values update. Low priority for a countdown (announcement every minute would be noisy), but the tiles could benefit from `aria-label` with the computed human-readable value.

### 13. `account-menu.tsx` — avatar initials from `email.slice(0, 2)` is fragile

**File:** `app/_components/account-menu.tsx:56`  
`email.slice(0, 2).toUpperCase()` gives "PH" for `pham.ngoc.kha@...` instead of meaningful initials. Works but misleading. Consider splitting on `.` or `@` and taking first chars of parts. Minor UX note.

### 14. `language-selector.tsx` — EN flag placeholder is a grey box

**File:** `app/_components/language-selector.tsx:94-96`  
EN option has `<span className="w-5 h-3.5 rounded-sm bg-white/20">` as flag — visually weak. Acceptable as stub since real i18n is deferred, but add a comment explaining the placeholder intent.

### 15. `widget-button.tsx` — `console.log` left in production path

**File:** `app/_components/widget-button.tsx:43`  
`console.log("widget")` fires on every click in production. Low severity but should be removed or replaced with a no-op until real action is implemented. The TODO comment is sufficient documentation.

---

## YAGNI / KISS Notes

- **Two `LanguageSelector` components are intentionally split** (`app/login/_components/language-selector.tsx` is visual-only/no-localStorage; `app/_components/language-selector.tsx` persists to localStorage). This is the correct design per clarifications. The visual-only login version is legitimately different. Not a DRY violation.
- **`getEventStartAt()` function in `lib/event-config.ts`** is a one-liner that wraps a `?? default`. Marginal abstraction value, but it does centralize the default and keeps the env var name in one place. Acceptable.
- **`as const` on `AWARDS` array** in `awards-grid.tsx` is good — prevents accidental mutation of the data.
- No unnecessary dependencies added to `package.json`. Clean.

---

## Test Coverage Gaps (Deferred — verify documentation)

The following test IDs from clarifications are NOT implemented and should be explicitly marked DEFERRED in the plan:

| ID | Description | Status |
|----|-------------|--------|
| ID-24/25/26 | Real i18n (VN/EN content switch) | Deferred — visual-only per clarifications |
| ID-27/28/29 | Notification panel (real data, read/unread state) | Deferred — stub per clarifications |
| ID-54 | Widget button quick-action menu | Deferred — stub per clarifications |
| Admin role | `user_metadata.role === 'admin'` plumbing end-to-end test | Deferred — no mechanism to set role in local Supabase yet |

These are acknowledged in clarifications.md but NOT documented as DEFERRED in the phase files. Should be noted in `phase-01-homepage-ui.md` or `plan.md` to prevent future agents from treating them as missing.

---

## Positive Observations

- `proxy.ts` session refresh (via `updateSession`) is preserved on every matched request. Correct.
- `hero-countdown.tsx` SSR-safe initial state (`isPast: true`) prevents hydration mismatch. Good defensive pattern.
- `computeCountdown` handles `NaN` from invalid ISO string gracefully (returns all zeros). Matches test case ID-60.
- `await params` used correctly in `[slug]/page.tsx` — Next 16 async params contract honored.
- `cookies()` awaited in `server-client.ts` — Next 16 async cookies contract honored.
- `aria-label`, `aria-expanded`, `aria-haspopup` on interactive buttons — partially complete.
- `[slug]` single-segment route (not `[...slug]`) is correct KISS choice for current stub needs.
- No new dependencies added. Dep footprint unchanged.
- Sign-out uses POST form action — correct, prevents accidental GET-based logout (no CSRF token needed; SameSite=Lax cookie provides sufficient protection for state-changing POST from same origin).

---

## Unresolved Questions

1. Is the mobile nav gap (`hidden md:flex` with no hamburger) a design decision or oversight? Clarifications don't address it.
2. `/about-saa` is in `KNOWN_STUBS` but the "About SAA 2025" nav link goes to `/` — is `/about-saa` an intended URL or dead stub? Consider removing it from `KNOWN_STUBS` or adding a redirect to `/`.
3. Default event date in `lib/event-config.ts` is `2025-12-26` (past date as of 2026-05-18). The `.env.local.example` also shows `2025-12-26`. Both should be updated to a future date or the env var should be mandatory with no default.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** 16 files reviewed. No security-critical auth bypass or injection found. Build is clean. Main concerns: `public/.claude/` directory is publicly served and must be deleted before any deployment; 3 dropdown components lack keyboard accessibility and click-outside behavior; layout metadata title is wrong for all non-login routes.
**Concerns/Blockers:** `public/.claude/` serving internal agent memory at a public URL is the only pre-deploy blocker. All other issues are high/medium priority improvements, not blockers.
