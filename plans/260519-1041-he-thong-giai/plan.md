# Plan — Hệ thống giải (Awards System) — /awards

**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Clarifications:** [clarifications.md](./clarifications.md)
**Branch:** feature.new.he_thong_giai
**Status:** Drafting → Awaiting approval

## Goal
Build the `/awards` page matching the Figma "Hệ thống giải" frame: title section over keyvisual bg, sticky left nav menu with scrollspy + URL hash, vertical alternating-side award rows for 6 awards, Sun* Kudos block, footer. Auth-required (enforced by existing proxy middleware).

## Phases
1. [phase-01-awards-page.md](./phase-01-awards-page.md) — Single-phase build: route + components + scrollspy hook + chrome integration.

## Key dependencies
- Existing: saa-header, saa-footer, sun-kudos-block, HeroArea, /public/award-*.png, proxy.ts auth gate.
- New: app/awards/page.tsx, app/page-awards/awards-title.tsx, app/page-awards/award-nav.tsx, app/page-awards/award-row.tsx, app/page-awards/awards-section.tsx, lib/use-scrollspy.ts.
- Remove "awards" from app/[slug]/page.tsx KNOWN_STUBS.

## Success criteria
- Visiting /awards while authed renders the page; unauthed redirects to /login (already enforced).
- Sticky left menu highlights the currently-visible section while scrolling.
- Clicking a menu item smooth-scrolls to the section AND updates the URL hash (e.g. /awards#top-talent).
- Direct visit to /awards#mvp scrolls to that section on mount.
- Visual parity with Figma at 1440 desktop width.
