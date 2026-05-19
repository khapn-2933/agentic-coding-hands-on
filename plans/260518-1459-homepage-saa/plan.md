# Homepage SAA — Implementation Plan

**Branch:** `feature.new.login` (will continue here or branch off)
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Screen:** Homepage SAA
**Discipline:** interactive (default takumi)

## Track A — UI (background `implementer`)

Single agent owns all homepage components. Builds from real Figma assets + design tokens.

- **phase-01-homepage-ui.md** — All homepage components (header, hero+countdown, root-further-explainer, awards-grid, sun-kudos, widget, footer)

## Track B — Backend / routing (orchestrator, main thread)

Runs in parallel with Track A.

- **phase-02-routing-and-backend.md**
  - Update `proxy.ts`: remove `/` from PROTECTED, ALWAYS allow `/login` and `/`, protect future authed-only routes only
  - Add `NEXT_PUBLIC_EVENT_START_AT` env var (default `2025-12-26T18:30:00+07:00`)
  - Add catch-all stub: `app/(stub)/[...slug]/page.tsx` (or just `app/[slug]/page.tsx` for top-level fallback). Renders "Coming soon" for any non-existing route.
  - Provide a server-side helper to fetch the current user (already exists via `createSupabaseServerClient`)

## Integration

- Wire conditional auth chrome (bell + avatar) on header via server-side `getUser` → pass as prop to client header
- Sign-out form posts to `/auth/sign-out` (already exists)

## File budget (target)

```
app/page.tsx                                 # rewrite — server component, fetches user, composes
app/(stub)/[...slug]/page.tsx                # catch-all "Coming soon"
app/_components/saa-header.tsx               # shared header (used by homepage + future pages)
app/_components/saa-footer.tsx               # shared footer
app/_components/account-menu.tsx             # client, dropdown
app/_components/language-selector.tsx        # client (split from login version OR shared)
app/_components/notification-bell.tsx        # client, stub
app/_components/widget-button.tsx            # client, visual-only
app/page-home/                               # private home-specific subfolder
  hero-countdown.tsx                         # client, countdown logic
  countdown-tile.tsx                         # client, single Days/Hours/Minutes tile
  root-further-explainer.tsx                 # server, static
  awards-grid.tsx                            # server, static grid
  award-card.tsx                             # server, data-driven
  sun-kudos-block.tsx                        # server, static
lib/event-config.ts                          # parses NEXT_PUBLIC_EVENT_START_AT
proxy.ts                                     # edit
.env.local                                   # add NEXT_PUBLIC_EVENT_START_AT
.env.local.example                           # add NEXT_PUBLIC_EVENT_START_AT
```

## Status

| Phase | Track | Status |
|-------|-------|--------|
| 01 Homepage UI | A | pending — spawn background agent |
| 02 Routing + backend | B | pending — orchestrator main thread |
| Integration | C | pending |
| Inspection (reviewer) | — | pending |
