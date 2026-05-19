# Multi-language Support (i18n) — VN / EN

**Branch:** `feature.new.multi-langugage`
**Figma:** [Dropdown-ngôn ngữ](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2)

## Decisions (from user)
- **Scope:** Dropdown UI + real i18n
- **Stack:** `next-intl` + cookie (no URL prefix, no `[locale]` segment)
- **Placement:** Replace existing `LanguageSelector` pill in `SaaHeader`

## Phases

| # | Phase | Owner |
|---|-------|-------|
| 1 | Install `next-intl` + cookie-based config + middleware integration | inline |
| 2 | Restyle `LanguageSelector` to match Figma (110×56 rows, real flags) + wire to `setLocale` server action | inline |
| 3 | Create `messages/{vi,en}.json` covering all visible strings | inline |
| 4 | Replace hardcoded strings in pages with `useTranslations`/`getTranslations` calls | inline |
| 5 | Visual verify with Playwright + reviewer + commit | subagents |

## Files touched

**New:**
- `i18n/request.ts` — locale resolution from cookie
- `i18n/locale.ts` — constants (`LOCALES`, `DEFAULT_LOCALE`, cookie name)
- `i18n/actions.ts` — `setLocale(locale)` server action
- `messages/vi.json`, `messages/en.json`
- `app/_components/uk-flag.tsx` (or inline)

**Modified:**
- `package.json` — add `next-intl`
- `next.config.ts` — wrap with `createNextIntlPlugin`
- `app/layout.tsx` — `NextIntlClientProvider` + load messages
- `app/_components/language-selector.tsx` — Figma design + server action
- `app/_components/saa-header.tsx` — translated nav
- `app/page-home/*` (5 files), `app/page-awards/*` (3 files), `app/[slug]/page.tsx`, `app/countdown/*`, `app/_components/account-menu.tsx`

## Out of scope
- Login page strings (already mostly English)
- Email/notification translations
- Date/number locale formatting
- SEO `hreflang` tags (no URL prefix)

## Verification
- Type-check passes
- Lint passes
- Visual: header dropdown matches Figma; switching VN→EN updates copy on home + awards + sun-kudos + countdown
