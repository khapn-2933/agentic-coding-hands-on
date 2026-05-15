# Phase 04 — Integration

**Owner:** orchestrator (main thread)

## Goal

Replace the mock handlers in Track A with real Supabase OAuth calls. End-to-end: click "LOGIN With Google" → Google → callback → `/`.

## Trigger
After Track A reports DONE AND Phase 03 is complete.

## Steps

1. **Wire login button**
   - Replace the mock `onClick` in `GoogleLoginButton` props at the page level with:
     ```ts
     const supabase = createBrowserClient()
     await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: { redirectTo: `${window.location.origin}/auth/callback` },
     })
     ```
   - Manage `loading` state with `useState` while the redirect resolves

2. **Error handling**
   - If `signInWithOAuth` returns an error → set a local error state, render an inline error message under the button

3. **Loading UI**
   - Pass `loading` into `GoogleLoginButton` → disabled + spinner (UI already supports this via the contract)

4. **End-to-end verification**
   - Start `supabase start`
   - Start `npm run dev`
   - Visit `/login` → button visible
   - Visit `/` → redirected to `/login` (unauth)
   - Click login (will fail without real Google creds — expected)
   - With placeholder creds, document the user step: add real creds to `.env.local`, restart, retry

## Success criteria
- Login button triggers Supabase OAuth call
- Loading + error states render correctly
- Proxy correctly redirects auth vs unauth users
- Build passes (`npm run build`)
- Lint passes (`npm run lint`)
