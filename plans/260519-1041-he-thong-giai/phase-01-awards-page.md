# Phase 01 — Awards Page (/awards)

**Context:** [plan.md](./plan.md) · [clarifications.md](./clarifications.md)
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD

## Overview
- Priority: High
- Status: Drafting
- Build the dedicated `/awards` route end-to-end: page server component, title section, sticky scrollspy nav, six alternating-side award rows, Sun* Kudos CTA reuse, footer chrome.

## Key Insights (from specs + test cases)
- **6 awards in fixed order:** Top Talent (10 Đơn vị, 7tr), Top Project (02 Tập thể, 15tr), Top Project Leader (03 Cá nhân, 7tr), Best Manager (01 Cá nhân, 10tr), Signature 2025 - Creator (01, 5tr/8tr cá nhân/tập thể), MVP (01, 15tr).
- **Nav indicator:** yellow text + underline for active; hover highlight for others.
- **Layout:** title centered at top under keyvisual; below it, left nav (sticky) + right content (rows). Award images 336×336.
- **Smooth-scroll spec:** test case ID-9 — click each menu, page scrolls to section, active state moves.
- **Deep link:** test case ID-13 — invalid section ID must NOT throw; ignore gracefully.

## Requirements
- Auth gate (proxy enforces) — no in-page check needed.
- All 6 award rows visible without lazy load (no fold loss).
- Keyboard nav: menu items focusable; Enter triggers scroll.
- Mobile fallback: stack rows full-width, replace sticky sidebar with a horizontal pill-bar above content.

## Architecture
- **app/awards/page.tsx** — server component. Fetches Supabase user for header chrome. Renders SaaHeader (activePath="awards"), HeroArea wrapping the title section, the awards body (client), SunKudosBlock, SaaFooter.
- **app/page-awards/awards-title.tsx** — server. Renders the small label "Sun* Annual Awards 2025" + the large gold "Hệ thống giải thưởng SAA 2025" inside the keyvisual area.
- **app/page-awards/awards-section.tsx** — client. Holds the AWARDS array, manages active section via `use-scrollspy`, syncs URL hash, renders AwardNav + the column of AwardRow.
- **app/page-awards/award-nav.tsx** — client. Renders the sticky 6-item nav. Receives active id + onSelect callback.
- **app/page-awards/award-row.tsx** — client. Receives award meta + index. Alternates image left/right by index parity. Renders title (cream), description, "Số lượng giải thưởng" + count + "Đơn vị/Tập thể/Cá nhân", "Giá trị giải thưởng" + amount.
- **lib/use-scrollspy.ts** — IntersectionObserver hook. Input: array of section ids. Output: active id (or `null` initially). Also handles initial-hash → scroll-into-view on mount.

## Files to Create
- app/awards/page.tsx
- app/page-awards/awards-title.tsx
- app/page-awards/awards-section.tsx
- app/page-awards/award-nav.tsx
- app/page-awards/award-row.tsx
- lib/use-scrollspy.ts

## Files to Modify
- app/[slug]/page.tsx — remove "awards" from KNOWN_STUBS Set so the catch-all no longer matches that slug.

## Implementation Steps
1. Add `lib/use-scrollspy.ts`: hook taking `(ids: string[])`, returns `{ activeId, setActiveId }`. Uses IntersectionObserver with rootMargin tuned so a section is "active" when its title hits ~120px from viewport top. On mount, reads `window.location.hash`; if present and matches an id, scrolls that section into view and sets active.
2. Add `app/page-awards/award-row.tsx`: presentational. Props: `id, slug, imageSrc, title, description, count, countUnit, value, valueNote?, index`. Layout grid with image and content; image side toggles by `index % 2`. Title in cream (#FFEA9E), description in white, metadata block with two rows of label + value.
3. Add `app/page-awards/award-nav.tsx`: presentational client component. Props: `items: {id,label}[]`, `activeId`, `onSelect(id) => void`. Renders a sticky `<nav>` (top offset = header height). Each item is a button; active gets yellow + underline.
4. Add `app/page-awards/awards-section.tsx`: client. Defines AWARDS array (6 entries) with all metadata from specs. Renders `<section>` with grid: nav col + content col on lg+; stacked below. Uses `useScrollspy(ids)` and a click handler that scrolls smoothly + updates `history.replaceState({}, '', '#<id>')`.
5. Add `app/page-awards/awards-title.tsx`: server component. Centered title block padded under fixed header.
6. Add `app/awards/page.tsx`: server. Wires Supabase user, HeroArea + AwardsTitle, AwardsSection, SunKudosBlock, SaaHeader, SaaFooter.
7. Edit `app/[slug]/page.tsx`: remove "awards" entry from KNOWN_STUBS so the real /awards page is canonical.
8. Run `npm run build` (or `next build` typecheck) to catch breaks.
9. Boot dev server + visit /awards while authed. Verify: title parity, scrollspy active update on scroll, click each menu → smooth scroll + hash update, direct deep link to /awards#mvp scrolls on load, mobile layout collapses cleanly.

## Todo List
- [ ] lib/use-scrollspy.ts
- [ ] app/page-awards/award-row.tsx
- [ ] app/page-awards/award-nav.tsx
- [ ] app/page-awards/awards-section.tsx
- [ ] app/page-awards/awards-title.tsx
- [ ] app/awards/page.tsx
- [ ] Remove "awards" from app/[slug]/page.tsx KNOWN_STUBS
- [ ] Build check (`next build` or typecheck)
- [ ] Visual verification in browser

## Success Criteria
- /awards renders only when authed (existing proxy gate).
- Visual parity with Figma at 1440 desktop: title position, nav active styling, row layout, image side alternation, count/value formatting.
- Scrollspy active item tracks viewport; URL hash updates on click + scroll.
- Direct `/awards#<id>` deep link scrolls into view.
- No TypeScript or build errors; no console errors at runtime.

## Risk Assessment
- **Scrollspy fighting with hash sync:** writing to history on every observer fire can throttle the browser. Mitigation: only update hash on click and on scrollspy *change* (not every fire); use `replaceState` not `pushState`.
- **Mobile sticky nav:** fixed-position sticky nav can overlap content on narrow screens. Mitigation: switch to a horizontal pill bar `position: sticky; top: 80px` on `<md`.
- **Existing /awards stub conflict:** Next 16 static `app/awards/page.tsx` wins over `app/[slug]`, but stale KNOWN_STUBS entry is misleading. Mitigation: drop the entry.

## Security
- No new user input → no validation surface.
- Hash updates use `replaceState` with a hardcoded `#<id>` (not user input) — no injection risk.
- Auth gate already enforced upstream in proxy.ts.

## Next Steps After This Phase
- None mandatory. Optional: design system pass for award row at narrower breakpoints; lazy-load award medal images if LCP suffers.
