# Huginn — brand assets v3.0

> A picture becomes cells. A name becomes cells.

Case 03 of the design-system library. One 14-unit cell on a 3-unit gap draws the painting
(ordered dither), the wordmark (22 rows) and the mark (five cells in the grid, one that has left).

- Live case: `/design-system/huginn`
- Case library: `/design-system`
- Board: `/brand/huginn/huginn-brandkit.png`
- Agent twin: `/design-system/huginn/llms.txt`
- Audit: `docs/huginn-design-system-audit.md`
- Brief: `design/brand/huginn/brief.md`

The self-contained `specimen.html` and the iframe that embedded it were removed in v3.0; the case
is a TSX route now, so there is only one copy of the specimen and it cannot drift.

## Files

| File | Use |
| --- | --- |
| `mark.svg` | Primary, 64 grid: five cells and the escapee |
| `mark-compact.svg` | 16px — three cells at 8 units |
| `mark-mono.svg` | One ink; the escapee keeps its off-grid position |
| `mark-reverse.svg` | On the vermilion field or a dark stage: bone cells, field escapee |
| `glyph.svg` | Two cells, for a favicon |
| `wordmark.svg` | 22 rows of cells, outlined — no font |
| `lockup.svg` | Mark + wordmark, ink, for light grounds |
| `lockup-reverse.svg` | Mark + wordmark, bone, for the field and dark stages |
| `favicon.svg` | Ink plate, bone cells, field escapee |
| `asgardsreien-1872.jpg` | Arbo, *Åsgårdsreien*, 1872. Public domain. The footer's plate |
| `asgardsreien-riders.webp` | The cutout the footer lifts out of the painting |

## Rebuilding a lockup

```bash
node scripts/build-lockup.mjs --mark public/brand/huginn/mark.svg \
  --wordmark public/brand/huginn/wordmark.svg --out public/brand/huginn/lockup.svg \
  --mark-size 56 --word-height 37 --gap 15 --ink "#100f0e" --label "Huginn"
```

`currentColor` resolves to black inside an `<img>`, so the ink is baked in. The board is authored
at 1500 × 1125 in `design/brand/huginn/brandkit.html` with a local copy of the Bodoni Moda latin
subset (`design/brand/huginn/assets/bodoni-moda.woff2`), so the PNG does not need the network.
