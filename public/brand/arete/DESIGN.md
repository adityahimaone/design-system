# Arête — Design System (Case 18)

**Alpine cartography · every layer is a cut.** Guided ridge traverses and hand-cut
topographic editions, made from two papers: ivory cartridge stock and ultramarine ink.

`V2.0.0` · hero **E · relation on** · footer **F2 · reversed split** · rail **A** · scopes **day + dusk**

## 3-Axis Synthesis

| Axis | Position |
| --- | --- |
| Surface | Paper & ink — ivory cartridge stock, five named paper surfaces, one 5-unit seam, hard 4px sheet shadows, zero blur inside a layer. |
| Density | Editorial cartography. 96px section rhythm, 66ch measure, route ledgers with tabular elevation data. |
| Physics | Knife-cut — 0px radius, 1px rules, 5px seam, 4px lift, 140ms. |

## Hero and footer

The hero is the range itself. `arete-panorama.webp` is full-bleed and the type is set
straight onto the paper-white sky behind a 96deg paper wash — no reading panel, no glass
card, no stats dashboard over the photograph. The four facts sit in a hairline strip below
the type, on 82% paper cells, and the plate caption is a paper bar at the very bottom.

The footer turns the same sheet over: the closing photograph on the left with the reverse
lockup at 26px, the statement and four download links on the right, one provenance bar.
Hero E pairs with F2 in Pillar VII.

## The mark

A floating ridge ribbon (10u thick) above a grounded mass, parted by one 5u seam, on
a 64-unit sheet. The 5u gap is the only detail: it is the width of the knife, and it
is the same value used for card seams and the type baseline offset.

- `mark.svg` — 64-unit master, ultramarine ink baked in.
- `mark-reverse.svg` — paper on ink.
- `mark-compact.svg` — separate 16-unit drawing, never a scaled master.
- `glyph.svg` — the massif alone, for favicons and 16px chips.
- `lockup.svg` / `lockup-reverse.svg` / `lockup-stacked.svg` — 64px cap height, 8px clearspace.
- `cast/` — six cut companion marks on the 64 grid, 6u stroke weight: boussole, cairn,
  courbe, meleze, refuge, sommet.

## Tokens

`tokens.json` → `arete-tokens.css`. Twelve primitives, seventeen semantic aliases
(`--ar-surface-page|plate|sheet|sunk`, `--ar-text-primary|secondary`, `--ar-line-strong|subtle`,
`--ar-accent`, `--ar-accent-2`, `--ar-blaze`), and a `[data-ar='dusk']` scope over the same
primitives. Legacy `--ar-bg-*` / `--ar-ink-*` aliases still resolve.

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#F2EDE3` | page ground, hero wash, caption bar |
| `vellum` | `#E9E2D5` | lifted layer, deckled band |
| `deckle` | `#D7D1C4` | torn edge, sunk well |
| `chalk` | `#FBF8F0` | highest sheet |
| `glacier` | `#8FA0D2` | dusk accent, chart tint |
| `ridge` | `#2E4CA6` | mid ink |
| `ultramarine` | `#1E3A8A` | primary ink, mark fill |
| `indigo` | `#101229` | body text, cast band ground |
| `oxide` | `#C4462B` | blaze — rules and marks only, never a label |

## Contrast ledger

Fourteen pairs measured, eleven pass, three published as fails:

| Pair | Ratio | Verdict |
| --- | --- | --- |
| indigo on paper | 15.8:1 | pass |
| ultramarine on paper | 9.2:1 | pass |
| oxide on paper | 4.3:1 | pass for marks, fails as text |
| chalk on ultramarine | 9.9:1 | pass |
| oxide on indigo | 2.9:1 | **fail — published** |
| deckle on paper | 1.2:1 | **fail — published** |
| glacier on paper | 1.9:1 | **fail — published** |

## Surfaces

Six tried, five shipped, one rejected.

| Surface | Verdict |
| --- | --- |
| Cut sheet | shipped — the page ground |
| Lifted layer | shipped — 4px hard lift, no blur |
| Vellum overlay | shipped — one 12% overlay where type crosses artwork |
| Deckle edge | shipped — four stepped rules, never a shadow |
| Register mark | shipped — 1px crosshair, 5u arms |
| Stipple field | rejected — reads as graph paper at any density |

## Files

| File | Role |
| --- | --- |
| `arete-brandkit.png` | 3000×2250 board, six panels |
| `arete-tokens.css` | generated custom properties, day + dusk |
| `tokens.json` | source of truth for the board and the page |
| `arete-panorama.webp` | hero plate, 1672×941 |
| `arete-closing.webp` | footer plate, 1672×941 |
