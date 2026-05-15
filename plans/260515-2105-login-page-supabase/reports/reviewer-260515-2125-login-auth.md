# Login Page + Supabase Auth — Code Review

**Reviewer:** Staff Engineer (reviewer agent)
**Date:** 2026-05-15
**Score: 7.5 / 10**

---

## Scope

| | |
|---|---|
| Files reviewed | 12 (all listed in brief) |
| LOC | ~400 |
| Focus | Security, auth correctness, Next 16 conformance, YAGNI/KISS |

---

## Overall Assessment

Solid first implementation. The Supabase SSR pattern is applied correctly, Next 16 proxy conventions are followed, and the OAuth PKCE flow is structurally correct. Two issues need fixing before production: an open redirect in the callback handler, and error message reflection with no XSS sanitization. Everything else is low-risk.

---

## Critical Issues

### 1. Open Redirect in `/auth/callback/route.ts` (line 7, 22)

**File:** `app/auth/callback/route.ts`

**Problem:** `next` is read directly from the query string and used as a redirect target:

```ts
const next = url.searchParams.get("next") ?? "/";
// ...
return NextResponse.redirect(new URL(next, url.origin));
```

`new URL("//evil.com", url.origin)` → `https://evil.com/`. The `//` double-slash bypasses the base-URL anchor. An attacker crafts:

```
/auth/callback?code=valid_code&next=//evil.com
```

The user completes a real Google login, then gets redirected to `evil.com`. This is a classic post-auth open redirect for phishing.

**Fix:** Validate `next` is a relative path before using it:

```ts
const rawNext = url.searchParams.get("next") ?? "/";
// Accept only absolute-path references (start with / but not //)
const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";
```

**Severity: critical**

---

### 2. Reflected Error Message — Potential XSS (`app/login/page.tsx` line 38)

**File:** `app/login/page.tsx`

**Problem:** The `error` state is populated from `oauthError.message` (Supabase SDK strings — controlled, OK) **but also** from the URL query param `?error=...`. Looking at the full flow: `callback/route.ts` line 18 redirects to `/login?error=${encodeURIComponent(error.message)}`. The login page does NOT read the URL `?error` param currently. So the current code is safe from URL reflection **only because** no code reads `searchParams` on the login page yet.

However, the `error` param is visible in the URL and easily misread as "the page reads it." If a future developer adds `useSearchParams()` to populate `error` from the URL (a natural next step) without sanitizing, the raw string renders via `{error}` in JSX, which is injection-safe in React (auto-escaped) for text nodes. **No XSS risk** in the current React rendering path.

**Finding revised to: warning** — The URL error param is surfaced to the user indirectly (they see it in the address bar). Consider reading and displaying it so the user understands why login failed, but strip/cap it to avoid exposing internal Supabase error detail.

**Severity: warning (not critical — React escapes text node content)**

---

## High Priority

### 3. `setAll` cookie options dropped in `proxy-client.ts` (line 16)

**File:** `lib/supabase/proxy-client.ts`

```ts
setAll(cookiesToSet) {
  cookiesToSet.forEach(({ name, value }) =>   // <-- options dropped
    request.cookies.set(name, value)
  );
  response = NextResponse.next({ request });
  cookiesToSet.forEach(({ name, value, options }) =>  // options kept here
    response.cookies.set(name, value, options)
  );
}
```

The first loop (request-side) drops `options` (SameSite, Secure, HttpOnly, Max-Age, Path). This is benign for the **request** cookie jar (edge runtime reads only name/value for downstream handlers), so session propagation to route handlers is unaffected. But it is inconsistent and will confuse the next reader. The `options` object is available on the destructured binding — just add it.

```ts
cookiesToSet.forEach(({ name, value, options }) =>
  request.cookies.set(name, value)  // options not applicable to RequestCookies.set
);
```

Actually `RequestCookies.set` only accepts `(name, value)` — it has no options parameter. So the drop is not a bug but the inconsistency should be clarified with a comment:

```ts
// RequestCookies.set has no options param — only name/value propagate to downstream handlers
cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
```

**Severity: warning (code clarity, not a runtime bug)**

---

### 4. Non-null assertions on env vars — no startup guard

**Files:** `lib/supabase/browser-client.ts` line 4-5, `lib/supabase/server-client.ts` line 7-8, `lib/supabase/proxy-client.ts` line 8-9

```ts
process.env.NEXT_PUBLIC_SUPABASE_URL!
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

The `!` suppresses TypeScript's undefined warning but does not fail fast. If the env vars are missing, `createBrowserClient(undefined, undefined)` throws a cryptic SDK error at runtime instead of a clear startup error.

This is acceptable for a local dev / MVP setup — Next.js itself will warn during build if `NEXT_PUBLIC_*` vars are absent. Upgrade path if this goes to CI/CD: add an `src/lib/env.ts` validation module (e.g., using `zod` or a simple guard):

```ts
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
```

**Severity: warning (low urgency for local-only deployment)**

---

### 5. Sign-out: `signOut()` error silently swallowed

**File:** `app/auth/sign-out/route.ts` line 6

```ts
await supabase.auth.signOut();
return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
```

If `signOut()` fails (network issue, already-expired session), the error is ignored and the user is redirected to `/login` anyway. This is acceptable UX (redirect happens regardless), but silent failure means no observability. On the server side the session cookie may not be cleared.

For production, log the error:

```ts
const { error } = await supabase.auth.signOut();
if (error) console.error("[sign-out] Supabase signOut failed:", error.message);
```

**Severity: warning**

---

## Medium Priority

### 6. Proxy matcher does not exclude `/api/` routes

**File:** `proxy.ts` line 33

```ts
matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
```

There are currently no `/api/` routes, so this is harmless today. But:

- The matcher will run `updateSession` on any future `/api/` route handler, incurring a Supabase auth token refresh on every API call.
- The `AUTH_API_PREFIX = "/auth/"` short-circuit correctly bypasses auth redirect logic for `/auth/*`, but this same guard does not exist for a future `/api/*` tree.

Following the Next 16 docs example, exclude `api` from the matcher:

```ts
matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
```

**Severity: suggestion (no current routes affected)**

---

### 7. CSRF on sign-out form — analysis

**File:** `app/page.tsx` line 20-26

The sign-out is a same-origin HTML form POST. Supabase cookies are `SameSite=Lax` by default (set by the SDK). Under `SameSite=Lax`, cross-site POST requests do **not** send the session cookie — so a CSRF attack cannot forge a sign-out with the victim's credentials. Sign-out CSRF via a cross-origin form POST is neutralized by `SameSite=Lax`.

No CSRF token needed for this case. **This is correctly implemented.**

---

### 8. `window.location.origin` in `handleGoogleLogin`

**File:** `app/login/page.tsx` line 21

```ts
redirectTo: `${window.location.origin}/auth/callback`,
```

This is a Client Component (`"use client"`) so `window` is always available at call time. No SSR risk. However, hardcoding the origin from `window` means in a proxy/CDN scenario where the internal origin differs from the public URL, the redirect could be wrong. Minor concern — acceptable for current use.

**Severity: suggestion**

---

### 9. `LanguageSelector` dropdown has a11y gap

**File:** `app/login/_components/language-selector.tsx` lines 68-89

The dropdown opens/closes via `onClick` on a `<button>` with `aria-expanded`, which is correct. However:
- No `onKeyDown` / `Escape` handler to close the dropdown with keyboard
- No `onBlur`/`useEffect` click-outside handler to close it when focus moves away
- `role="option"` items are not keyboard-navigable (no `tabIndex`, no `onKeyDown`)

This is a visual-only component (per clarifications), so functional completeness is out of scope. But leaving `aria-haspopup="listbox"` without keyboard support is misleading to screen readers. Either remove the ARIA roles (pure decorative) or implement keyboard nav.

**Severity: suggestion (out of scope per clarifications, flag for future)**

---

## Low Priority / YAGNI-KISS Notes

### 10. `createSupabaseBrowserClient` called inside handler (not module scope)

**File:** `app/login/page.tsx` line 17

A new client is created on every button click. `@supabase/ssr` 0.10 `createBrowserClient` uses a singleton pattern when `isSingleton` is unset in a browser context — it reuses the existing instance. So there's no memory leak, but the factory call on each click is unnecessary ceremony. Acceptable for now; YAGNI applies.

---

### 11. `browser-client.ts` — missing singleton option explicit opt-in

`createBrowserClient` auto-singletons in browser (confirmed from source). No bug. But the implicit behavior could surprise a future developer. A comment is enough.

---

### 12. Copyright year hardcoded

**File:** `app/login/_components/login-footer.tsx` line 3 — `© 2025`. Will need manual update next year. Low priority but worth noting.

---

## OAuth/PKCE Correctness — Verdict

- `signInWithOAuth` with `redirectTo` pointing to `/auth/callback` → correct PKCE initiation. `@supabase/ssr` manages the PKCE verifier cookie automatically via `createBrowserClient`.
- `exchangeCodeForSession(code)` in the callback route → correct. This is the right call for PKCE code exchange (not `setSession`).
- `skip_nonce_check = true` in `config.toml` → required and correctly placed for local Google PKCE.
- `edge_runtime.enabled = false` → correct for corp network that blocks JSR.
- `additional_redirect_urls` includes both `localhost:3000` and `127.0.0.1:3000` → correct.

The PKCE flow is implemented correctly. The only structural issue is item #1 (open redirect on the `next` param).

---

## Cookie/Session Handling — Verdict

- `server-client.ts` `setAll` try/catch → correct Next 15+/16 idiom. Server Components legitimately cannot set cookies; the try/catch prevents a throw from crashing RSC renders while still allowing Route Handlers and proxy to set them.
- `proxy-client.ts` double-write pattern (request + response) → correct Supabase SSR pattern ensuring both the downstream route handler and the browser receive refreshed tokens.

Both patterns are correct.

---

## Environment Variables — Verdict

- `NEXT_PUBLIC_*` vars go to the browser bundle — both are Supabase publishable values (URL + anon key), intended to be public. No secret leaked to client.
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID/SECRET` are server-only env vars consumed by `supabase` CLI, never referenced in application code. Correct.
- `.env.local` is gitignored via `.env*` glob. `.env.local.example` committed with placeholders only. Correct.

---

## Recommended Actions (Prioritized)

1. **[Critical]** Fix open redirect in `app/auth/callback/route.ts` — validate `next` param starts with `/` and not `//`.
2. **[High]** Add error logging in `app/auth/sign-out/route.ts` for failed `signOut()` calls.
3. **[Medium]** Add `api` to proxy matcher exclusion list as a defensive measure for future routes.
4. **[Low]** Add comment in `proxy-client.ts` explaining why `RequestCookies.set` drops options.
5. **[Low]** Add env validation guard in `lib/supabase/` clients for fail-fast on missing vars when deploying to staging/prod.

---

## Metrics

| | |
|---|---|
| Type Coverage | ~98% (strict mode, no `any` found) |
| Test Coverage | 0% (no tests written for this feature) |
| Linting Issues | 0 (per build report) |

---

## Unresolved Questions

1. Is `/login?error=...` meant to be read and displayed by the login page? Currently the URL param is set but never consumed — users see a blank login page with the error only in the address bar after a failed OAuth exchange.
2. Should the proxy also protect future `/api/*` routes, or will API routes use separate auth middleware?

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Review complete. Implementation is structurally correct with good Next 16 and Supabase SSR conformance. One critical issue found: open redirect via `next` query param in `/auth/callback` that allows post-auth phishing redirects.
**Concerns/Blockers:** Item #1 (open redirect) must be fixed before any production or staging deployment with real Google OAuth credentials. All other findings are warnings/suggestions that do not block a dev/local deploy.
