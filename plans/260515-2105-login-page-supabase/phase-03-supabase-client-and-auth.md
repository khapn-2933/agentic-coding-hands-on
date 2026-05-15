# Phase 03 — Supabase Client + Auth Flow (Track B)

**Owner:** orchestrator (main thread)

## Goal

Wire Supabase Auth into Next.js 16 App Router with SSR cookies, OAuth callback, and proxy-based route protection.

## Dependencies
- `@supabase/supabase-js`
- `@supabase/ssr` (replaces deprecated `@supabase/auth-helpers-nextjs`)

## Files to create

### Supabase clients
- `lib/supabase/server-client.ts` — Server Component / Route Handler / Server Action client (reads cookies via `next/headers`)
- `lib/supabase/browser-client.ts` — Client Component client
- `lib/supabase/proxy-client.ts` — Client for use inside `proxy.ts` (refreshes session, sets cookies on the response)

### Auth flow
- `app/auth/callback/route.ts` — Route Handler for the OAuth redirect. Exchanges `code` for session, sets cookies, redirects to `/` (or `next` param).
- `app/auth/sign-out/route.ts` — POST endpoint that calls `supabase.auth.signOut()` and redirects to `/login`

### Routing protection
- `proxy.ts` (Next 16: root-level, replaces middleware.ts)
  - Reads session via `proxy-client.ts`
  - Unauthenticated + path = protected → redirect to `/login`
  - Authenticated + path = `/login` → redirect to `/`
  - Otherwise pass through, refreshing the session cookie

### Authed landing
- Overwrite `app/page.tsx` to a minimal authed landing: server component, reads `supabase.auth.getUser()`, shows email + sign-out button

## Key Next 16 details
- `proxy.ts` (NOT `middleware.ts`) — same `NextRequest`/`NextResponse` API
- Route handler imports `cookies` from `next/headers` (async in Next 15+)
- `app/page.tsx` server component must `await cookies()` if reading

## OAuth flow
1. Browser → click "LOGIN With Google" → call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '${origin}/auth/callback' } })` — Supabase returns redirect URL to Google
2. Google → user authenticates → Google redirects back to Supabase callback with code
3. Supabase → redirects to our `/auth/callback?code=...`
4. `/auth/callback` route handler exchanges code for session via `supabase.auth.exchangeCodeForSession(code)`, sets cookies, then redirects to `/`
5. Proxy reads session, allows `/` for authed user

## Success criteria
- All clients compile (TypeScript strict)
- `proxy.ts` runs on every request, refreshes session, applies redirects
- `app/page.tsx` shows authed user email or redirects to `/login` when unauth'd
- No compile errors

## Risks
- Cookie domain/secure flags may differ between dev and prod — use defaults from `@supabase/ssr`
- `proxy.ts` matcher must exclude static assets (`_next/static`, images, etc.) → use the standard exclusion regex
