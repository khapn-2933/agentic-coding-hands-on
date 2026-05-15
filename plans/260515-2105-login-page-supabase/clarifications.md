# Clarifications — Login Page + Supabase

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
Screen: Login (SAA 2025 — Internal Live Coding)

## Session 2026-05-15

- Q: Supabase setup approach → A: Set up fresh in this repo (install CLI if missing, `supabase init` + `supabase start`, Docker confirmed available)
- Q: Google OAuth credentials → A: Placeholders in `.env.local` (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET as placeholders; user fills before running)
- Q: Post-login redirect target → A: Overwrite scaffold `app/page.tsx` with minimal authed landing showing email + sign-out, redirect `/login` → `/`
- Q: Language switcher scope → A: Visual-only (VN flag + "VN" + chevron + decorative dropdown) — no real i18n routing
- Q: Logo + Key Visual asset source → A: Text placeholder for logo ("Sun Annual Awards 2025" as styled text), CSS gradient/blob approximation for key visual artwork
- Q: Authenticated user accessing /login → A: Proxy (Next 16 `proxy.ts`) redirects to `/`
- Q: Unauthenticated user accessing `/` → A: Proxy redirects to `/login`
- Q: Footer text → A: "Bản quyền thuộc về Sun* © 2025" (per design)
- Q: Hero title → A: "ROOT FURTHER" (per design)
- Q: Hero descriptions → A: "Bắt đầu hành trình của bạn cùng SAA 2025." / "Đăng nhập để khám phá!" (per design)
