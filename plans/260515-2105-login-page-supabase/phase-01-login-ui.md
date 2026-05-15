# Phase 01 — Login UI (Track A)

**Owner:** background `implementer` subagent
**Skill:** `momorph-implement-design`
**Screen:** GzbNeVGJHz (Login)
**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
**Design image:** `plans/260515-2105-login-page-supabase/visuals/login-design.png`

## Goal

Render `/login` matching the Figma design pixel-by-pixel. Wire mock handlers for backend integration.

## Out of scope (Track B / integration)
- Supabase client, Google OAuth call, session management — those are mock no-ops here
- Real i18n routing — language switcher is visual-only
- Asset extraction — use text + CSS gradient placeholders

## Files to create
- `app/login/page.tsx` — Route entry (Client Component; whole page interactive)
- `app/login/_components/login-header.tsx` — Logo (A.1) + language selector (A.2)
- `app/login/_components/login-hero.tsx` — Key visual (B.1) + content (B.2) + Google login button (B.3)
- `app/login/_components/login-footer.tsx` — Footer (D)
- `app/login/_components/language-selector.tsx` — VN chip + chevron + decorative dropdown
- `app/login/_components/google-login-button.tsx` — Yellow pill button with Google icon
- `app/login/_components/key-visual.tsx` — CSS gradient/blob approximation of B.1 artwork

## Integration contract (props the UI exposes)

`GoogleLoginButton`:
```ts
interface Props {
  onClick: () => void | Promise<void>
  loading?: boolean
  disabled?: boolean
}
```
- When `loading=true`: button disabled, shows inline spinner, label hidden or dimmed
- Default click handler: `() => console.log('mock google login')`

`LanguageSelector`:
```ts
interface Props {
  current?: 'VN' | 'EN'  // default 'VN'
}
```
- Dropdown is decorative; clicking the chip toggles a static menu but no real state change

## Design tokens (extracted from image)
- Background: dark navy (`#0A1428`-ish — match the design)
- Hero title "ROOT FURTHER": white, large display weight, two-line stacked
- Body text: muted light blue/gray
- CTA button: amber/yellow (`#F4C430`-ish), dark text, rounded pill, Google G logo inline
- Key visual: abstract flowing shapes in orange/red/cyan/teal — approximate via radial gradients + SVG blobs

## Validation (visual loop)
After build, capture screenshot via Puppeteer or open in browser, compare to `visuals/login-design.png`. Iterate until layout matches.

## Test cases covered
- GUI: layout (header, hero, footer, button position, language selector position)
- GUI: Vietnamese default language code shown
- GUI: Flag + chevron displayed
- FUNCTION: Login button click handler invoked (mock)
- FUNCTION: Language dropdown opens on click (visual-only)
- FUNCTION: Hover states (shadow on button, highlight on selector)

## Success criteria
- `/login` renders, no console errors, no compile errors
- Visual matches Figma design (within reason for placeholder assets)
- All interactive elements have mock handlers
- Props interface ready for Track B integration
- Component files under 200 lines each
