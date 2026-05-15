# Phase 02 — Supabase Local Init (Track B)

**Owner:** orchestrator (main thread)

## Goal

Stand up Supabase locally in this repo. Configure Google OAuth provider with placeholder credentials.

## Steps

1. **Install Supabase CLI** (currently `supabase: command not found`)
   - Linux: download binary from GitHub releases OR `npm i -g supabase` (note: official guidance prefers the binary, but npm works)
   - Verify: `supabase --version`

2. **Initialize project**
   - `supabase init` from repo root → creates `supabase/config.toml`, `supabase/seed.sql`, `supabase/.gitignore`
   - Confirm Docker is available (already verified: Docker 29.4.3)

3. **Configure Google OAuth** in `supabase/config.toml`
   ```toml
   [auth.external.google]
   enabled = true
   client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
   secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
   redirect_uri = "http://127.0.0.1:54321/auth/v1/callback"
   skip_nonce_check = false
   ```

4. **Set `[auth]` site_url + additional_redirect_urls** for local dev
   ```toml
   [auth]
   site_url = "http://localhost:3000"
   additional_redirect_urls = ["http://localhost:3000/auth/callback"]
   ```

5. **Create `.env.local`** (gitignored) with placeholders
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret
   ```

6. **Create `.env.local.example`** committed to git (no real secrets)

7. **Update `.gitignore`** to ensure `.env.local`, `supabase/.branches`, `supabase/.temp` are ignored

8. **Run `supabase start`** to validate — capture the anon key + service role key, write anon key into `.env.local`

## Success criteria
- `supabase start` boots without error
- API at `http://127.0.0.1:54321` reachable
- Studio at `http://127.0.0.1:54323` reachable
- Google provider listed in config

## Risks
- Supabase CLI install may fail on this system → fall back to npm-based install
- Docker daemon may not be running → instruct user to start it
- Port conflicts (54321-54324) → document expected ports
