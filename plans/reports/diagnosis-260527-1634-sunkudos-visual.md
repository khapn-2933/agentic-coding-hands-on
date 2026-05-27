# Diagnosis — /sun-kudos visual fidelity gaps vs Figma MaZUn5xHXZ

Root cause: Track-A UI agent approximated styles with CSS (colored badge pills, solid dark backgrounds, cream text, missing icons) instead of using Figma's media assets + exact colors. Authoritative values pulled from MoMorph nodes below.

## Authoritative Figma values (verified via get_node)

| Area | Figma truth | Current (wrong) |
|------|-------------|-----------------|
| Hero bg | `MM_MEDIA_KV Background` image node `I2940:13432;2167:5141` (1440×512, colorful keyvisual) | placeholder/dark |
| Main menu nav | normal case ("About SAA 2025") | `uppercase` in saa-header.tsx |
| Hero→Highlight gap | tight | excessive margin |
| Filter btn `B.1.1` | border `1px #998C5F`, bg `rgba(255,234,158,0.10)`, radius 4px, pad 16px, gap 8px, `MM_MEDIA_Down` chevron icon | check text/chevron color |
| Badges | **media chips** `MM_MEDIA_{Rising,Legend,Super,New} Hero` (109×19), text #FFF + shadow `0 0 1.3px #FFF` | CSS colored pills |
| Spotlight count `3007:17482` | **#FFF white**, 36px/700 | cream #FFEA9E |
| Spotlight section `2940:14174` | image bg (KV-style) + `1px #998C5F` border + radius **47.14px** | solid #00070C |
| Activity log `2940:14230` | **#FFF white**, 14px/700, current user name in RED | cream time + gray text |
| Stat label `I2940:13491;256:6735` | **#FFF white**, 22px/700, right-aligned | rgba(255,255,255,0.75) 14px |
| Fire icon | stat "Số tim..." has fire icon | missing/misaligned |
| Copy Link `I3127:21871;256:5216` | has `MM_MEDIA_Link` 24px icon | text only, no icon |
| Xem chi tiết | bold arrow icon | missing |
| Heart `MM_MEDIA_Heart` 32px | icon + count layout | wrong position/color |
| Send arrow `MM_MEDIA_Send` 32px | between sender/receiver | check |
| Open Gift `MM_MEDIA_Open Gift` | button icon | check |
| Pan/zoom (fullscreen) | bottom-right, interactive | wrong position, no-op |

## Media node IDs to download → /public/sun-kudos/
- KV bg: `I2940:13432;2167:5141`
- Badges: Rising `I3127:22053;256:4858;3106:17694`, Legend `I3127:21871;256:4860;3106:17694`, Super `I3127:22375;256:4858;3106:17694`, New `I3127:21871;256:4858;3106:17694`
- Icons: Pen `I2940:13449;186:2759`, Search `I2940:13450;186:2759`, Down `I2940:13459;186:2761`, Link `I3127:21871;256:5216;186:1441`, Heart `I3127:21871;256:5171`, Send `I3127:21871;256:5147`, Open Gift `I2940:13497;186:1766`

fileKey: `9ypp4enmFmdK3YAFJLIu6C`
