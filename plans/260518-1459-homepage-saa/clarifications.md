# Clarifications — Homepage SAA

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
Screen: Homepage SAA (SAA 2025)
Stack: Next.js 16.2.6 + React 19 + Tailwind v4 + Supabase SSR (already wired from /login)

## Session 2026-05-18

- Q: Access model for `/` (test cases ID-0/ID-1 say homepage is public, auth chrome conditional) → A: ~~Make `/` public; update `proxy.ts` to remove `/` from protected paths.~~ **OVERRIDDEN 2026-05-18:** User reversed the decision — homepage must require auth (treating test ID-0 as out of scope for this iteration). `proxy.ts` now uses the original allow-list: PUBLIC_PATHS = ["/login"], everything else gates to /login when unauth. The conditional auth-chrome path in `SaaHeader` for unauth users (Sign in CTA) becomes unreachable but stays in code as future-proofing.
- Q: Language switcher (VN/EN, tests ID-24/25/26) → A: Visual-only for now, dropdown with both options selectable, persist to localStorage. Real i18n deferred. Login screen's language selector stays as-is (visual-only).
- Q: Missing navigation targets (/awards, /sun-kudos, /profile, /admin, /about-saa, /tieu-chuan-chung) → A: Single catch-all `app/(stub)/[...slug]/page.tsx` renders "Coming soon — trang này đang được xây" placeholder. Links work, no 404s.
- Q: Floating Widget button quick-action menu → A: Visual-only chip. Click is no-op (console.log). TODO comment for future quick actions.
- Q: Event datetime → A: `NEXT_PUBLIC_EVENT_START_AT` env var, ISO-8601 format. Default `2025-12-26T18:30:00+07:00` per design content. Invalid value falls back to "00 00 00" without crash (per test ID-60).
- Q: Event info text → A: Use design content verbatim — "Thời gian: 26/12/2025  Địa điểm: Âu Cơ Art Center  Tường thuật trực tiếp qua sóng Livestream"
- Q: Award images → A: Fetch 6 composite cards from Figma (336×336 each), reuse `MM_MEDIA_Award BG` slot composites. Award titles + descriptions as DOM text below each card.
- Q: Sun* Kudos description text → A: Use design content for the long Vietnamese paragraph.
- Q: ROOT FURTHER long description (section B4) → A: Render the full Vietnamese paragraph + pull quote per design.
- Q: Footer link "Tiêu chuẩn chung" → A: Stub link via catch-all route.
- Q: Notification bell + Account menu → A: Conditional render on auth state. Click handlers stubbed (open empty dropdown). Account menu shows "Profile" + "Sign out" (real sign-out via existing `/auth/sign-out` POST). Admin Dashboard option deferred — Supabase user_metadata.role check; show only if role==='admin'.
- Q: "ABOUT AWARDS" / "ABOUT KUDOS" CTA → A: Navigate to `/awards` / `/sun-kudos` (both handled by catch-all stub).

## Assets fetched

| Asset | Source | Path |
|-------|--------|------|
| Hero key visual (3024×2784, 1.5MB) | Figma node `2167:9028` | `/public/homepage-keyvisual.png` |
| Sun* Kudos artwork (2240×1000) | Figma node `I3390:10349;313:8415` | `/public/kudos-bg.png` |
| Award card: Top Talent (696×700) | Figma node `I2167:9075;214:1019` | `/public/award-top-talent.png` |
| Award card: Top Project | Figma node `I2167:9076;214:1019` | `/public/award-top-project.png` |
| Award card: Top Project Leader | Figma node `I2167:9077;214:1019` | `/public/award-top-project-leader.png` |
| Award card: Best Manager | Figma node `I2167:9079;214:1019` | `/public/award-best-manager.png` |
| Award card: Signature 2025 - Creator | Figma node `I2167:9080;214:1019` | `/public/award-signature.png` |
| Award card: MVP | Figma node `I2167:9081;214:1019` | `/public/award-mvp.png` |
| Reused: ROOT FURTHER hero | (from /login screen) | `/public/root-further.png` |
| Reused: Sun* logo | (from /login screen) | `/public/sun-logo.png` |
