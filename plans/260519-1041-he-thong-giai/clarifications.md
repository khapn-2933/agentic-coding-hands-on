# Clarifications — Hệ thống giải (Awards System)

MoMorph refs:
- Hệ thống giải: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
- fileKey: 9ypp4enmFmdK3YAFJLIu6C
- screenId: zFYDgyj_pD
- frameLinkId: 313:8436

## Session 2026-05-19

- Q: Route path for this screen? → A: /awards (overrides test case ID-0 which specified /he-thong-giai). Header + footer NAV_LINKS already point to /awards.
- Q: Left navigation menu behavior? → A: Sticky with scrollspy. IntersectionObserver updates active item; click smooth-scrolls.
- Q: Reuse existing shared components? → A: Reuse saa-header, saa-footer, sun-kudos-block.
- Q: URL hash sync? → A: Update hash on click + scroll. Supports deep links like /awards#top-talent.

## Implicit decisions (sensible defaults; revisit if user objects)

- Q: Keyvisual bg at top of awards page? → A: Reuse HeroArea wrapper. Design clearly shows ROOT FURTHER + tree artwork behind the title.
- Q: Award row layout? → A: New component `award-row.tsx`. Existing `award-card.tsx` is a 3x2 grid card; this page needs vertical alternating-side rows with larger medal + count/value metadata.
- Q: Award medal images? → A: Reuse /public/award-*.png (same medals already used on homepage; design shows identical artwork).
- Q: Stub at app/[slug]/page.tsx for "awards"? → A: Remove "awards" from KNOWN_STUBS once /awards/page.tsx is created. Next 16 static route wins over [slug] but cleaner to drop the stub entry.
- Q: Auth required? → A: Yes per test case ID-1 (unauthenticated redirects to /login). Already enforced by proxy.ts middleware.
- Q: Sun* Kudos block CTA target? → A: /sun-kudos (current Link target in sun-kudos-block.tsx).
- Q: Mobile responsive for left menu? → A: Below md breakpoint, left menu collapses to a horizontal scroll bar above the rows (no hamburger to keep parity with figma constraint).
