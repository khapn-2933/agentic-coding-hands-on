# Development Roadmap — Sun* Annual Awards 2025 (SAA)

**Stack:** Next.js 16.2.6 (App Router + Turbopack) · React 19.2.4 · Supabase (@supabase/ssr ^0.10.3) · Tailwind v4 · TypeScript strict

---

## Phase 1 — Login + Google OAuth
**Status:** COMPLETE

- `/login` page with Supabase Google OAuth
- Supabase local dev setup with Google redirect URI
- Auth middleware: all routes require auth
- Figma assets and tokens applied

Plan: `plans/260515-2105-login-page-supabase/`

---

## Phase 2 — Homepage SAA (`/`)
**Status:** COMPLETE

- Hero section: keyvisual, countdown (DSEG7 LCD font), event info
- ROOT FURTHER explainer section
- Awards grid preview
- Sun Kudos block
- Shared keyvisual bg across header; all colors aligned to Figma

Plan: `plans/260518-1459-homepage-saa/`

---

## Phase 3 — Hệ thống giải (`/awards`)
**Status:** COMPLETE

- Full awards listing page with sticky scrollspy sidebar nav
- Alternating-side award rows (image left/right)
- URL hash sync on scroll
- Auth-gated (same middleware)
- Reuses `SaaHeader`, `SaaFooter`, `SunKudosBlock`
- New: `lib/use-scrollspy.ts`, `app/page-awards/*`, `app/awards/page.tsx`

Plan: `plans/260519-1041-he-thong-giai/`

---

## Phase 4 — Sun Kudos (`/sun-kudos`)
**Status:** PLANNED (stub at `[slug]`)

Nomination/kudos submission flow. Details TBD.

---

## Phase 5 — Profile (`/profile`)
**Status:** PLANNED (stub)

User profile, nomination history. Details TBD.

---

## Phase 6 — Admin (`/admin`)
**Status:** PLANNED (stub)

Admin dashboard: manage awards, nominations, results. Details TBD.

---

## Phase 7 — About SAA + Tiêu chuẩn chung (`/about-saa`, `/tieu-chuan-chung`)
**Status:** PLANNED (stubs)

Informational pages. Details TBD.

---

## Stub routing

Unknown slugs → 404 via `app/[slug]/page.tsx`.
Active stubs (render "Coming soon"): `sun-kudos`, `profile`, `admin`, `about-saa`, `tieu-chuan-chung`.
