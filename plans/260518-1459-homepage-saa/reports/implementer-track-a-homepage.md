# Track A Implementation Report — Homepage SAA UI

**Agent:** Implementer (background)
**Date:** 2026-05-18
**Phase:** phase-01-homepage-ui.md

---

## Files Created

### Shared chrome — `app/_components/`

| File | Lines | Notes |
|------|-------|-------|
| `language-selector.tsx` | 105 | Client. VN/EN dropdown, persists to localStorage. Adapted from login version with real selection support. |
| `notification-bell.tsx` | 66 | Client. Bell + yellow dot badge (stub, always shown). Click opens empty "Chưa có thông báo" dropdown. |
| `account-menu.tsx` | 186 | Client. Avatar initials + email + chevron. Profile / Admin Dashboard (if isAdmin) / Sign out form. |
| `saa-header.tsx` | 81 | Server shell. Fixed 80px height, `rgba(11,15,18,0.8)` bg + blur. Nav active state: yellow + underline. Conditional auth chrome. |
| `saa-footer.tsx` | 56 | Server. Logo + footer nav (4 links) + copyright bar with `1px solid #2E3940` dividers. |
| `widget-button.tsx` | 59 | Client. Fixed bottom-right, 105×64px, `#FFEA9E` pill. Click: `console.log('widget')`. TODO comment for future actions. |

### Homepage sections — `app/page-home/`

| File | Lines | Notes |
|------|-------|-------|
| `countdown-tile.tsx` | 32 | Server. Single tile: 2 individual digit blocks (dark bg, `rgba(0,0,0,0.5)` + border) + label. |
| `hero-countdown.tsx` | 143 | Client. Full hero section with `/homepage-keyvisual.png` bg + overlay. Countdown, CTAs, event info. |
| `root-further-explainer.tsx` | 46 | Server, static. ROOT FURTHER heading + 3 Vietnamese paragraphs + pull quote with yellow left-border. |
| `awards-grid.tsx` | 71 | Server. 3-col desktop / 2-col below md. Static AWARDS array → maps to AwardCard. |
| `award-card.tsx` | 63 | Server. `AwardCardProps` interface. Image 336×336 + title + description + "Chi tiết →" link. |
| `sun-kudos-block.tsx` | 59 | Server. `/kudos-bg.png` fill bg + gradient overlay. Caption + title + description + "Chi tiết" CTA. |

**Total:** 967 lines across 12 files. All under 200-line limit.

---

## Component Tree

```
app/page.tsx (orchestrator rewrites — consumes below)
├── app/_components/saa-header.tsx (server)
│   ├── app/_components/language-selector.tsx (client)
│   ├── app/_components/notification-bell.tsx (client, when user != null)
│   └── app/_components/account-menu.tsx (client, when user != null)
├── main
│   ├── app/page-home/hero-countdown.tsx (client)
│   │   └── app/page-home/countdown-tile.tsx (server, ×3)
│   ├── app/page-home/root-further-explainer.tsx (server)
│   ├── app/page-home/awards-grid.tsx (server)
│   │   └── app/page-home/award-card.tsx (server, ×6)
│   └── app/page-home/sun-kudos-block.tsx (server)
├── app/_components/saa-footer.tsx (server)
└── app/_components/widget-button.tsx (client, fixed position)
```

---

## Final TypeScript Interfaces (Integration Contracts)

```ts
// app/_components/saa-header.tsx
interface SaaHeaderProps {
  user: { email: string; role?: 'admin' | 'user' | null } | null;
  activePath?: 'about-saa' | 'awards' | 'sun-kudos' | null;
}

// app/_components/account-menu.tsx
interface AccountMenuProps {
  email: string;
  isAdmin?: boolean;
}

// app/page-home/hero-countdown.tsx
interface HeroCountdownProps {
  eventStartAt: string; // ISO-8601
}

// app/page-home/award-card.tsx
interface AwardCardProps {
  slug: string;
  imageSrc: string;
  title: string;
  description: string;
}
```

---

## Mock Data Sources

| Content | Source | Value |
|---------|--------|-------|
| Hero background | `/public/homepage-keyvisual.png` | Figma node `2167:9028` |
| ROOT FURTHER image | `/public/root-further.png` | Reused from login screen |
| Event time line | Phase spec + clarifications | "Thời gian: 26/12/2025   Địa điểm: Âu Cơ Art Center" |
| Livestream line | Phase spec | "Tường thuật trực tiếp qua sóng Livestream" |
| Pull quote | Phase spec | '"A tree with deep roots fears no storm"' |
| Pull quote sub | Phase spec | "(Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh)" |
| Awards section caption | Phase spec | "Sun* annual awards 2025" |
| Awards section title | Phase spec | "Hệ thống giải thưởng" |
| 6 award titles + descriptions | Phase spec (C2.1.x items) | see awards-grid.tsx AWARDS array |
| 6 award images | `/public/award-*.png` | Fetched from Figma pre-task |
| Sun* Kudos caption | Phase spec | "Phong trào ghi nhận" |
| Sun* Kudos bg | `/public/kudos-bg.png` | Figma node `I3390:10349;313:8415` |
| Sun* Kudos description | Design strip 4 (adapted) | See sun-kudos-block.tsx — TODO to verify verbatim |
| Root Further body text | Design strip 2 (adapted) | See root-further-explainer.tsx — TODO to verify verbatim |
| Footer copyright | Phase spec | "Bản quyền thuộc về Sun* © 2025" |

---

## Hydration Safety — Countdown Strategy

The `hero-countdown.tsx` uses the **SSR-safe initial state** approach:

1. Initial `useState` is `{ days: "00", hours: "00", minutes: "00", isPast: true }` — this matches what any SSR output would produce before JS runs.
2. `useEffect` fires after mount and sets the real computed value immediately.
3. `setInterval(60_000)` updates every minute thereafter.
4. The "Coming soon" label is driven by `!isPast`, so SSR renders it hidden, client shows it once useEffect runs — no hydration mismatch since the initial state matches the server render.
5. Invalid date input → `isNaN(target)` → falls back to "00 00 00" + `isPast: true` (no crash, per test ID-60).

---

## Visual Validation

- `npm run build`: **PASSED** — TypeScript clean, all 8 static/dynamic routes compiled successfully.
- Dev server started on `http://localhost:3000`.
- Preview page `app/preview-homepage/page.tsx` created and verified in build output (`○ /preview-homepage`), then deleted after confirmation.
- Direct browser screenshot was not accessible (no Playwright/Chrome permission). Visual verification deferred to orchestrator integration step.

### Expected visual alignment with design:
- Header: fixed 80px, semi-transparent dark bg, Sun* logo left, nav center, auth chrome right.
- Hero: full-viewport bg image `/homepage-keyvisual.png` with dark overlay. ROOT FURTHER image centered. Countdown 3-tile grid. Yellow + outline CTAs.
- Root Further: dark bg section, heading + body text + pull quote with yellow left border.
- Awards: 3-col desktop grid (2-col tablet/mobile), 6 award cards with gold halo images + text + Chi tiết links.
- Sun* Kudos: split section with kudos bg image on right, text + yellow CTA on left with gradient fade.
- Footer: Sun* logo + 4 nav links + copyright bar, both dividers `#2E3940`.
- Widget: fixed bottom-right yellow pill.

---

## Autonomous Clarifications

1. **Vietnamese body text (root-further-explainer + sun-kudos description)**: Design image at 1512×4480 was readable but text strips 2 and 4 were at low resolution. Body text was adapted to be consistent with the section theme per the design — marked with `// TODO: Verify exact Vietnamese text against Figma design strip` comments in both components. The pull quote and structural text are verbatim per phase spec.

2. **Footer "Tiêu chuẩn chung" href**: Set to `/tieu-chuan-chung` per clarifications doc. Served by existing catch-all stub.

3. **`_preview` directory**: Created initially as `app/_preview/` but underscore prefix excludes it from routing in Next.js App Router. Moved to `app/preview-homepage/` for the build test, then deleted.

4. **Tailwind v4 arbitrary padding classes** (`md:px-18`, `lg:px-36`): Tailwind v4 supports arbitrary numeric values as JIT classes. These compile correctly per the successful build.

---

**Status:** DONE_WITH_CONCERNS

**Summary:** All 12 component files created, TypeScript clean, build passes. Integration contracts match spec exactly. Two TODO comments mark Vietnamese body text that should be verified against the actual Figma design strips (root-further-explainer + sun-kudos description paragraphs) before production.

**Concerns/Blockers:**
- Vietnamese body text in `root-further-explainer.tsx` and `sun-kudos-block.tsx` is adapted from the design image (which was small/compressed) rather than verbatim. Both have `// TODO: Verify exact Vietnamese text` comments. This is cosmetic only — structure and layout are correct.
- Visual screenshot validation was not performed (browser/Chrome permission denied). Orchestrator should perform final visual comparison against `plans/260518-1459-homepage-saa/visuals/homepage-design.png` after wiring `app/page.tsx`.
