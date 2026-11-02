# public/brand/porphyry

The generated and drawn assets for Case 10. Everything here is also used by
`/design-system/porphyry`; the page is the proof, this folder is the kit.

## Marks

| File | Use | Ink |
| --- | --- | --- |
| `mark.svg` | primary, 24px+ | ink block + gold threshold |
| `mark-reverse.svg` | on the stage | marble block + gold threshold |
| `mark-compact.svg` | 16px, light | separate drawing, 24 × 9 threshold |
| `mark-compact-reverse.svg` | 16px, on the stage | marble + gold |
| `mark-mono.svg` | one-ink stamp | `currentColor` |
| `glyph.svg` / `glyph-reverse.svg` | favicon, one-ink marks | silhouette |
| `favicon.svg` | browser tab | marble on stage |

## Wordmark & lockups

`wordmark.svg` (currentColor), `wordmark-ink.svg`, `wordmark-reverse.svg` — Cinzel 500
outlined at 0.085em, 8 glyphs, no `<text>`.
`lockup.svg`, `lockup-reverse.svg`, `lockup-mono.svg` — 336 × 64.

## Type

`fonts/Cinzel.woff2`, `fonts/Jost.woff2`, `fonts/PinyonScript-Regular.woff2` — all SIL Open
Font License, self-hosted so the stage's canvas fitting and the page share one family name.
The TTF sources were compressed to WOFF2 and are not shipped.

## Cast

`cast/apollo.jpg`, `cast/hercules.jpg`, `cast/flowers.jpg`, `cast/david.jpg` — Unsplash
stock, credited on the case page. The luminance key assumes a near-black ground; the
threshold and softness are per-figure props.

## Board

`porphyry-brandkit.png` — 1500 × 1125, rendered from `brand/porphyry/brandkit.html` with
Playwright (Chrome channel). Regenerate with that HTML; do not hand-edit the PNG.

## Tokens

The source of truth is `features/porphyry/tokens.json` and
`features/porphyry/porphyry-tokens.css`. Do not hand-edit a copy here.
