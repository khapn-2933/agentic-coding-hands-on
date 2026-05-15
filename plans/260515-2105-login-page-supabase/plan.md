# Login Page + Supabase Local — Implementation Plan

**Branch:** `feature.new.login`
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
**Screen:** Login (SAA 2025)
**Discipline:** interactive (default takumi)

## Two-Track Execution (MoMorph Protocol)

Track A and Track B run concurrently. No blocking merge point.

### Track A — UI Implementation (Background subagent)
Single background `implementer` agent owns the login UI. Builds static/presentational components matching Figma, wires mock data (Figma content as source), exposes a typed prop interface for backend integration.

- Phase A1 — `phase-01-login-ui.md` — Static `/login` page + components

### Track B — Backend (Orchestrator, main thread)
Runs in parallel with Track A. Does NOT wait for UI to finish.

- Phase B1 — `phase-02-supabase-local-init.md` — Install CLI, init project, configure Google provider
- Phase B2 — `phase-03-supabase-client-and-auth.md` — `@supabase/ssr` clients, OAuth callback route, `proxy.ts` (Next 16 middleware), session helpers, authed landing `/`

### Integration (incremental)
- Phase C — `phase-04-integration.md` — Replace UI mock handlers with real Supabase OAuth call; wire loading/error states; ensure proxy redirects work end-to-end

## Key Constraints
- **Next.js 16.2.6** — middleware is now `proxy.ts` (not `middleware.ts`)
- **React 19.2.4** — server actions, async params/searchParams
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline` in globals.css
- **Supabase local** — Docker required (confirmed); CLI not yet installed
- **Google OAuth** — placeholders only; user provides real credentials before running

## Decisions
See `clarifications.md` for resolved gaps.

## Status

| Phase | Track | Status |
|-------|-------|--------|
| 01 Login UI | A | done (background `implementer` agent, DONE_WITH_CONCERNS — build later verified clean by orchestrator) |
| 02 Supabase local init | B | done (CLI 2.98.2 installed to ~/.local/bin, `supabase start` running, Google provider configured with env-var placeholders, edge_runtime disabled due to JSR/network restriction) |
| 03 Supabase client + auth | B | done (`@supabase/ssr`, browser/server/proxy clients, `/auth/callback`, `/auth/sign-out`, `proxy.ts`, authed `/`) |
| 04 Integration | C | done (login button wired to `signInWithOAuth`, error from URL param surfaced via useEffect, loading state, smoke tests pass) |
| Inspection | — | done (reviewer agent: 1 critical open-redirect fixed, 2 high/medium fixed, 1 low (error display) fixed) |

## Verification
- `npm run build`: ✓ clean — 5 routes compile, Proxy registered as middleware-equivalent
- `npm run lint`: ✓ 0 errors in project code (`.claude/` excluded from scope)
- Smoke tests:
  - `/` (unauth) → 307 → `/login` ✓
  - `/login` → 200 ✓
  - `/auth/callback?code=invalid` → 307 → `/login?error=PKCE...` ✓
  - `/auth/sign-out` POST → 303 → `/login` ✓
- Visual: `/login` matches Figma design — see `visuals/login-actual.png` vs `visuals/login-design.png`

## Next manual steps (user)
1. Create a Google OAuth client at https://console.cloud.google.com/apis/credentials
   - Authorized redirect URI: `http://127.0.0.1:54321/auth/v1/callback`
2. Replace placeholders in `.env.local` with real `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` / `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`
3. Restart Supabase: `supabase stop && supabase start`
4. End-to-end test: visit http://localhost:3000 → redirected to /login → click "LOGIN With Google" → real OAuth flow
