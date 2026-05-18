# Phase 02 — Routing + Backend (Track B)

**Owner:** orchestrator (main thread)

## Goal

1. Make `/` public (drop redirect for unauth users)
2. Add catch-all stub route for all missing nav targets
3. Configure `NEXT_PUBLIC_EVENT_START_AT` env var
4. In `app/page.tsx`: fetch user (server-side), pass to `SaaHeader`

## Files to change

### `proxy.ts`
Current behavior: unauth + non-`/login` → redirect to `/login`. Authed + `/login` → redirect to `/`.

New behavior: only redirect `authed + /login` → `/`. Don't redirect unauth users anywhere (homepage is public). Authed-only routes can be added to a list later.

Keep session refresh on every matched request.

### `app/page.tsx`
Rewrite to:
```tsx
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
// ...
export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const eventStartAt = process.env.NEXT_PUBLIC_EVENT_START_AT
    ?? "2025-12-26T18:30:00+07:00";
  return (
    <>
      <SaaHeader user={user ? { email: user.email!, role: user.user_metadata?.role } : null} activePath="about-saa" />
      <main>
        <HeroCountdown eventStartAt={eventStartAt} />
        <RootFurtherExplainer />
        <AwardsGrid />
        <SunKudosBlock />
      </main>
      <WidgetButton />
      <SaaFooter />
    </>
  );
}
```

### Catch-all stub
Create `app/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";

const KNOWN_STUBS = ["awards", "sun-kudos", "profile", "admin", "about-saa", "tieu-chuan-chung"];

export default async function StubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!KNOWN_STUBS.includes(slug)) notFound();
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center gap-4">
      <p className="text-sm uppercase tracking-widest text-zinc-400">{slug}</p>
      <h1 className="text-3xl font-bold">Coming soon</h1>
      <p className="text-zinc-400 max-w-md">Trang này đang được xây. Vui lòng quay lại sau.</p>
      <a href="/" className="mt-4 px-5 py-2 rounded-full bg-[#FFEA9E] text-[#1a1a2e] font-semibold">Về trang chủ</a>
    </main>
  );
}
```

NOTE: With `app/[slug]/page.tsx`, the route `/login` may conflict — but Next.js prefers concrete routes over dynamic. Verify with build.

### `.env.local` + `.env.local.example`
Add:
```
NEXT_PUBLIC_EVENT_START_AT=2025-12-26T18:30:00+07:00
```

## Success criteria
- `npm run build` clean
- Smoke: `/` (unauth) → 200 (no redirect); `/login` (authed) → 307 to `/`; `/anything-stub` → 200 stub; `/random-not-in-stub-list` → 404
- `/auth/sign-out` POST still works
- Countdown shows correct remaining time relative to env var
