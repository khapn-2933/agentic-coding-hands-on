# Code Review — /awards Page (he_thong_giai)

**Status:** DONE_WITH_CONCERNS
**Score:** 7.5 / 10
**Issues:** 0 critical · 3 major · 4 minor · 3 suggestions

---

## Scope
- Files: 7 (lib/use-scrollspy.ts, app/page-awards/{award-row,award-nav,awards-section,awards-title}.tsx, app/awards/page.tsx, app/[slug]/page.tsx) + 1-line hero-area.tsx change
- LOC: ~381 across reviewed files
- Build: PASS (Next.js 16.2.6, TypeScript clean, 0 errors)
- All 6 medal assets confirmed in /public/

---

## Overall Assessment
Solid implementation. Core correctness is good: no injection risk, no auth bypass, stable deps array, correct observer teardown. Three meaningful correctness/UX gaps need fixing before prod; none are blockers if you accept the trade-offs noted.

---

## Critical Issues

None.

---

## Major Issues

### M1 — Scrollspy never syncs hash on scroll (only on click)
**File:** `lib/use-scrollspy.ts` + `app/page-awards/awards-section.tsx`
**Severity:** Major — spec says "URL hash updates on click + scroll" (clarifications.md); plan risk note says "only update hash on scroll*spy change*".

`handleSelect` in `awards-section.tsx:96-97` writes the hash, but the IntersectionObserver callback in `use-scrollspy.ts` only calls `setActiveId` — it never calls `replaceState`. So scrolling with the keyboard/mouse updates the nav highlight but leaves the URL stale. A user copying the URL mid-scroll gets a wrong deep-link.

**Fix:** In `use-scrollspy.ts`, extend the observer callback to also update the hash (or pass an optional `onActiveChange` callback):
```ts
// inside observer callback, after setActiveId(firstInOrder):
window.history.replaceState(null, "", `#${firstInOrder}`);
```
Or expose `onActiveChange?: (id: string) => void` prop and let `awards-section.tsx` own both state + hash together.

---

### M2 — `next/Image` missing `sizes` prop — will trigger build warning and serve oversized images
**File:** `app/page-awards/award-row.tsx:43-49`
**Severity:** Major — the image is 336×336 inside a column that is `100vw` on mobile but `~half of 7xl (≈ 560px)` on desktop. Without `sizes`, the browser always downloads the full-resolution version regardless of viewport, bloating mobile LCP.

Also: none of the 6 award images have `priority`. On deep-link navigation to `/awards#mvp` (last section), the image for the top section is LCP but is lazy-loaded by default. Plan phase-01 explicitly notes "No fold loss" — the first visible row image should have `priority` at minimum.

**Fix for award-row.tsx:**
```tsx
<Image
  src={imageSrc}
  alt={title}
  width={336}
  height={336}
  sizes="(max-width: 1024px) 100vw, 336px"
  // Add priority only on first row:
  // priority={index === 0}
  className="absolute inset-0 h-full w-full object-cover"
/>
```
Pass `priority` as a prop (`index === 0` from `awards-section.tsx`).

---

### M3 — `handleSelect` uses `replaceState` instead of `pushState` — breaks back-button expectation
**File:** `app/page-awards/awards-section.tsx:96`
**Severity:** Major — the plan itself says "Replace (not push) so back-button doesn't fill with hash entries", which is a valid reason for same-page scrolling. BUT: if a user navigates from `/` → `/awards` → clicks "Top Project", the URL becomes `/awards#top-project`. Pressing Back should go to `/`, but because `replaceState` was used it goes *before* /awards — i.e., wherever they came from before the page. This is correct, actually. **However**, the issue is that if the user loads `/awards` directly (no referrer), every `replaceState` replaces the only history entry, so Back exits the app entirely (expected but surprising). This is an accepted trade-off per the plan, but it conflicts with the success criterion "Clicking a menu item smooth-scrolls to the section AND updates the URL hash". Confirm this is intentional.

**No code change needed** if trade-off is accepted — just calling it out as a deliberate decision that should be documented.

---

## Minor Issues

### m1 — Accessibility: no `aria-current` on active nav button
**File:** `app/page-awards/award-nav.tsx:27-35, 50-57`
**Severity:** Minor — `<button>` with `type="button"` is correct, but there is no `aria-current="true"` or `aria-pressed` on the active item. Screen-reader users cannot determine which section is currently highlighted.

**Fix:**
```tsx
<button
  type="button"
  aria-current={isActive ? "true" : undefined}
  onClick={() => onSelect(id)}
  ...
>
```

---

### m2 — Mobile sticky nav has no `sticky` positioning at all
**File:** `app/page-awards/award-nav.tsx:43`

The desktop `<ul>` has `lg:sticky lg:top-28` on the `<nav>` wrapper. The mobile `<ul>` (the pill bar) relies on the `<nav>` being sticky, but `lg:sticky` only activates at `≥1024px`. Below `lg`, neither the nav wrapper nor the pill bar has `position:sticky`. The pill bar will scroll away with the page on mobile.

**Fix:**
```tsx
<nav
  aria-label="Hệ thống giải thưởng"
  className="sticky top-20 z-30 bg-[#00101A] lg:static lg:top-28 lg:self-start lg:bg-transparent"
>
```
(mobile: sticky below header `h-20`; desktop: reverts to block flow since the column grid makes it sticky by the existing `lg:sticky` on nav)

---

### m3 — `typeof window !== "undefined"` guard in `handleSelect` is dead code
**File:** `app/page-awards/awards-section.tsx:96`

This component is `"use client"` and `handleSelect` is only ever called by a button `onClick` — it cannot execute server-side. The guard adds noise without value.

**Fix:** Remove the `if (typeof window !== "undefined")` wrapper, keep just:
```ts
window.history.replaceState(null, "", `#${id}`);
```

---

### m4 — Empty string `valueNote` passed as `""` gets filtered to `undefined`, but `valueNote=""` already matches `false`-y
**File:** `app/page-awards/awards-section.tsx:120`

```tsx
valueNote={award.valueNote || undefined}
```

`AWARDS` is `as const`, so `award.valueNote` is typed as `"" | "(mỗi giải thưởng)" | ...`. Passing `|| undefined` for `""` is fine functionally (AwardRow checks `{valueNote && ...}`), but the prop type is `valueNote?: string` — passing `undefined` vs omitting are equivalent. This is harmless but slightly opaque.

**Cleaner:** Either strip `valueNote` from entries that have `""` in the static data, or keep the `|| undefined` and add a comment.

---

## Overflow-hidden Regression Analysis (hero-area.tsx)

**File:** `app/page-home/hero-area.tsx:5`

The outer `<div>` now has `overflow-hidden` added. On the homepage (`app/page.tsx`), `HeroArea` wraps `HeroCountdown` + `RootFurtherExplainer`. The keyvisual image container inside is `h-[1480px] absolute` — without `overflow-hidden`, the image bleeds below the div bounds and into the next section. The fix is correct.

**Risk:** `overflow-hidden` on a `relative` ancestor clips any child with `position:sticky` that tries to scroll past the parent boundary. Neither `HeroCountdown` nor `RootFurtherExplainer` uses sticky positioning, so there is no regression on the homepage. The `AwardsTitle` component (server, no sticky) also has no sticky children. **No regression risk detected.**

---

## Edge Cases Found

1. **Deep-link to unknown hash** (test case ID-13): `useScrollspy` reads `window.location.hash.slice(1)` and checks `ids.includes(initialHash)` before acting. An unknown hash is silently ignored. Correct.

2. **Rapid successive observer fires**: Multiple sections can intersect simultaneously (e.g., short viewport). The `ids.find(id => visible.includes(id))` pattern correctly picks the topmost (first in DOM order) intersecting section. No thrashing issue.

3. **`idsKey` dep array**: `NAV_IDS` and `NAV_ITEMS` are module-level constants (outside component, derived from `AWARDS as const`). They are stable references across renders. The `idsKey = ids.join(",")` primitive stabilizer is technically redundant but harmless — it does not cause extra effect runs.

4. **`requestAnimationFrame` in mount path**: The rAF ensures the DOM has fully painted before `scrollIntoView`. However, if the page has a large paint delay, the rAF fires before layout is complete (images still loading, no dimensions). On slow connections the initial hash scroll may land at the wrong position. Low likelihood but worth noting for LCP-heavy pages.

5. **`AwardRow` rendered as `<section>`**: Each award row is a `<section id="...">`. This is semantically correct for landmark-region scrollspy. No issue.

6. **`awards-section.tsx` line 104 `px-4 md:px-18`**: Tailwind default scale has no `px-18`. This works only if the project has extended the Tailwind config with custom spacing. Consistent with existing usage in `awards-title.tsx` and `root-further-explainer.tsx`, so presumably configured. Not a new issue introduced here.

---

## Positive Observations

- Observer cleanup via `observer.disconnect()` in effect return — correct, no leak.
- `ids.includes(initialHash)` whitelist prevents acting on arbitrary hashes.
- `replaceState` over `pushState` for click-nav is the right call (no back-button spam).
- `AWARDS as const` + module-level `NAV_IDS`/`NAV_ITEMS` means no per-render array allocation.
- `AwardRow` is a pure server-renderable presentational component (no `"use client"` directive needed and not added — correct).
- All 6 medal assets present in `/public/`.
- Build passes clean, TypeScript clean, 0 errors.
- Removing "awards" from `KNOWN_STUBS` is the correct cleanup; stub removal doesn't break anything since Next.js 16 static route takes priority.
- `scroll-mt-28` (112px) matches header `h-20` (80px) with breathing room — reasonable.

---

## Recommended Actions (Priority Order)

1. **(M2) Add `sizes` to `next/Image` in `award-row.tsx` + `priority` on index 0** — quick, high impact on mobile performance.
2. **(M1) Sync URL hash on scrollspy change**, not just on click — needed to meet stated success criterion.
3. **(m2) Make mobile pill bar sticky** with `sticky top-20` — UX correctness on mobile.
4. **(m1) Add `aria-current="true"` to active nav button** — accessibility gap.
5. **(m3) Remove dead `typeof window` guard** — cosmetic, 2-line change.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Build is clean and core correctness holds. Two spec gaps (hash not syncing on scroll, mobile pill bar not sticky) and one performance gap (missing `sizes`/`priority` on Image) should be fixed before merge. No security issues, no breaking changes.
**Concerns/Blockers:** M1 and m2 are functional regressions against stated success criteria. Not merge-blockers if the trade-off is accepted consciously, but the spec says both should work.
