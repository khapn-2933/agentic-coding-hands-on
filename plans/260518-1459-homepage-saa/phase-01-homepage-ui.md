# Phase 01 — Homepage UI (Track A)

**Owner:** background `implementer` agent
**Skill:** `momorph-implement-design`
**Screen:** i87tDx10uM (Homepage SAA)
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Design image:** `plans/260518-1459-homepage-saa/visuals/homepage-design.png` (1512×4480, 4 strips for review)
**Clarifications:** `plans/260518-1459-homepage-saa/clarifications.md` (READ FIRST)

## Goal

Render `/` (homepage) matching the Figma design. Wire interactive widgets with stubs unless noted. Reuse base infrastructure from /login (Supabase clients, Montserrat fonts, layout).

## Project context (no breaking changes)
- Next 16: `app/page.tsx` is the homepage entry. Will be **rewritten** (currently a minimal authed landing).
- Tailwind v4 (`@import "tailwindcss"` + `@theme inline` in globals.css)
- Fonts already loaded in `app/layout.tsx`: Montserrat + Montserrat Alternates
- Bg color `#00101A` already global
- Existing assets in `/public`: `sun-logo.png`, `root-further.png`, `key-visual.png` (login bg — NOT the homepage hero), `homepage-keyvisual.png` (homepage hero), `kudos-bg.png`, `award-*.png` (6 cards)
- Existing Supabase SSR clients in `lib/supabase/*` — orchestrator handles auth fetch in `app/page.tsx`

## Integration contracts (DO NOT CHANGE — orchestrator depends on these)

```ts
// app/_components/saa-header.tsx
interface SaaHeaderProps {
  user: { email: string; role?: 'admin' | 'user' | null } | null
  activePath?: 'about-saa' | 'awards' | 'sun-kudos' | null  // for nav active state
}
```

Header renders:
- Logo (sun-logo.png) on left, links to `/`
- Nav links: "About SAA 2025" (`/`), "Award Information" (`/awards`), "Sun* Kudos" (`/sun-kudos`). Active link is yellow + underline.
- Right side **only when user != null**: Notification bell + LanguageSelector(VN) + AccountMenu
- Right side **when user == null**: LanguageSelector(VN) + "Sign in" link to `/login`

```ts
// app/_components/account-menu.tsx
interface AccountMenuProps {
  email: string
  isAdmin?: boolean  // shows Admin Dashboard option when true
}
```
Sign-out item is a `<form action="/auth/sign-out" method="post">` with a submit button styled as a menu item (already works).

```ts
// app/page-home/hero-countdown.tsx
interface HeroCountdownProps {
  eventStartAt: string  // ISO-8601 UTC, e.g. "2025-12-26T18:30:00+07:00"
}
```
Renders ROOT FURTHER + "Coming soon" + countdown tiles + event info + CTAs. Countdown logic: client-side `useEffect` with `setInterval(60_000)`, computes diff to event time. If invalid/past → "00 00 00" + hide "Coming soon".

```ts
// app/page-home/award-card.tsx
interface AwardCardProps {
  slug: string  // e.g. 'top-talent' — used in /awards#${slug} link
  imageSrc: string  // e.g. '/award-top-talent.png'
  title: string  // e.g. 'Top Talent'
  description: string
}
```

## Files to create

### Shared chrome (in `app/_components/`)
- `saa-header.tsx` — server-renderable shell; child uses client components for interactive bits (bell, language, account menu)
- `saa-footer.tsx` — server component
- `account-menu.tsx` — client, dropdown with Profile / Sign out (admin → + Admin Dashboard)
- `language-selector.tsx` — client (can copy + adapt from `app/login/_components/language-selector.tsx`)
- `notification-bell.tsx` — client, icon button + dot badge. Click → open empty dropdown (stub).
- `widget-button.tsx` — client, fixed bottom-right floating pill. Click → console.log no-op.

### Homepage-specific (in `app/page-home/`)
- `hero-countdown.tsx` — client (uses useEffect for tick)
- `countdown-tile.tsx` — server (just renders a single tile given a 2-digit number + label)
- `root-further-explainer.tsx` — server, static long Vietnamese text + pull quote
- `awards-grid.tsx` — server, renders 6 award cards via map
- `award-card.tsx` — server
- `sun-kudos-block.tsx` — server

## Mock data sources (from design content)

- **Hero title**: "ROOT FURTHER" (use existing `/public/root-further.png` image)
- **Subtitle**: "Coming soon"
- **Event info**: "Thời gian: 26/12/2025  Địa điểm: Âu Cơ Art Center"  Note: design uses "Âu Cơ Art Center" (NOT "Nhà hát nghệ thuật quân đội" from spec). Use design text.
- **Livestream line**: "Tường thuật trực tiếp qua sóng Livestream"
- **CTAs**: "ABOUT AWARDS" (yellow `#FFEA9E`) → `/awards`; "ABOUT KUDOS" (outline) → `/sun-kudos`
- **Root Further explainer**: long Vietnamese paragraph (read from design strip 2; full text in design image — extract verbatim)
- **Pull quote**: "A tree with deep roots fears no storm" / "(Cây sâu bền rễ, bão giông chẳng nề - Ngạn ngữ Anh)"
- **Awards section caption**: "Sun* annual awards 2025"
- **Awards section title**: "Hệ thống giải thưởng"
- **6 awards**: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP (Most Valuable Person)
  - Descriptions: extract from spec C2.1.x (e.g. Top Talent → "Vinh danh top cá nhân xuất sắc trên mọi phương diện"); use mock fillers for ones without description in spec
- **Sun* Kudos block**: caption "Phong trào ghi nhận", title "Sun* Kudos", description (extract from design strip 4 — full Vietnamese paragraph), CTA "Chi tiết" → `/sun-kudos`
- **Footer links**: "About SAA 2025" (`/`), "Award Information" (`/awards`), "Sun* Kudos" (`/sun-kudos`), "Tiêu chuẩn chung" (`/tieu-chuan-chung`)
- **Copyright**: "Bản quyền thuộc về Sun* © 2025"

## Design tokens (from Figma + already in globals.css)
- bg: `#00101A`
- accent yellow (selected nav, ABOUT AWARDS CTA, widget pill): `#FFEA9E`
- text default: white
- footer divider: `1px solid #2E3940`
- header height: 80px, padding-x: 144px (desktop), bg `rgba(11, 15, 18, 0.8)`
- award card image: 336×336 (use Next Image `width=336 height=336`)
- countdown tile: stylized "LCD" digits — match design (display font, dark bg, gray-ish numbers)

## Constraints
- Each component file < 200 lines (project rule, split if needed)
- Kebab-case filenames; TypeScript strict; no `any`
- Tailwind v4 utilities (no styled-components)
- No emojis in code
- Comments only when the WHY is non-obvious

## Validation
1. `npm run build` clean (Next 16 Turbopack)
2. Visit `http://localhost:3000` — should render all sections without crashes (auth chrome will be wired by orchestrator after agent finishes — initially pass `user={null}` to header)
3. Compare visually to `plans/260518-1459-homepage-saa/visuals/homepage-design.png`

## Test cases covered

- GUI ID-7 to ID-17: layout + content + Vietnamese strings + responsive grid (3 cols desktop, 2 cols tablet/mobile)
- FUNCTION ID-39 to ID-43: countdown auto-update, 2-digit padding, zero-state hides "Coming soon"
- FUNCTION ID-30 to ID-35: dropdown toggle behaviors (visual-only OK)
- FUNCTION ID-44 to ID-52: nav buttons (links work via catch-all stub)

Deferred (tracked in clarifications):
- ID-24/25/26: real i18n switching (visual-only)
- ID-27 to ID-29: notification panel real content (empty dropdown)
- ID-36 to ID-38: account menu admin role (orchestrator will pass `isAdmin` from user_metadata)
- ID-54: widget action menu (visual-only)

## Success criteria
- `/` renders the homepage at any auth state without crashes
- Visual matches Figma design within reason
- Countdown ticks and respects env var
- Integration contract for header `user` prop is honored
- All component files under 200 lines

## Report
Write to: `plans/260518-1459-homepage-saa/reports/implementer-track-a-homepage.md`
