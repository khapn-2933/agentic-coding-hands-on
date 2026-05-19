# Project Changelog — Sun* Annual Awards 2025 (SAA)

Entries: most recent first.

---

## 2026-05-19

**feat(awards): /awards page — Hệ thống giải**

- Sticky scrollspy sidebar nav (`lib/use-scrollspy.ts`) with URL hash sync
- Alternating-side award rows (image left / right)
- Auth-gated via existing middleware
- Reuses `SaaHeader`, `SaaFooter`, `SunKudosBlock`
- New files: `lib/use-scrollspy.ts`, `app/page-awards/award-nav.tsx`, `app/page-awards/award-row.tsx`, `app/page-awards/awards-section.tsx`, `app/page-awards/awards-title.tsx`, `app/awards/page.tsx`
- Modified: `app/[slug]/page.tsx` (removed "awards" from KNOWN_STUBS), `app/page-home/hero-area.tsx` (added `overflow-hidden` to clip keyvisual bleed)
- MoMorph ref: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD

---

## 2026-05-18

**feat(home): Homepage SAA — Phase 2**  
PR #2 merged (`feature.new.homepage_saa`)

- Hero section: keyvisual artwork, event countdown, event info block
- ROOT FURTHER explainer section (left-anchored column)
- Awards grid preview, Sun Kudos block
- All section colors and spacing aligned to Figma
- `fix(countdown)`: DSEG7 LCD font for authentic 7-segment display digits
- `fix(home)`: shared keyvisual bg between header and hero; award text colors; Kudos glow
- `fix(auth)`: homepage and all routes require auth (no public routes)

---

## 2026-05-15

**feat(auth): /login page + Supabase Google OAuth — Phase 1**  
PR #1 merged (`feature.new.login`)

- `/login` with Google OAuth via Supabase (`@supabase/ssr`)
- Supabase local dev configured; Google `redirect_uri` and env loaded
- Authentic Figma assets and design tokens applied
- Docs: login feature plan, clarifications, reviewer report added to `plans/`

---

## 2026-05-14

**chore: init project**

- Next.js 16.2.6 (App Router + Turbopack) bootstrapped
- TypeScript strict, Tailwind v4, Supabase `@supabase/ssr ^0.10.3`
