# design-system

Astro v5 design system library and showcase hosting 15 documented interface design systems (Cases 01–15), an interactive case gallery, and a public JSON API endpoint (`/api/cases.json`).

## The library identity — Halation (Case 00)

The library itself is branded **Halation**: reeded prismatic glass, one coral spill, and a day scope and
a night scope cut from the same eighteen primitives. It is not a sixteenth case — it is the shelf that
holds them.

The name is the behaviour: a halation is the glow that bleeds past the edge of a light source. The mark
is that sentence drawn — a ribbed pane with one reed of light that runs past its edge to the edge of the
canvas. Every pane in the system tints and refracts rather than only blurring, and the palette publishes
the pair it fails: coral measures 3.02:1 on porcelain, so it is assigned graphic duty, never body text.

- **Landing (`/`)**: `src/components/case-gallery.tsx` + `halation-gallery.css`. The display line is set
  directly on the prismatic field, and the shelf runs beneath it as a CSS-3D band
  (`tilted-grid-hero.tsx` — 16 slices per tile, transform-only on the compositor). The scope toggle flips
  `[data-ha]` on the page root, so field, type, rules and surfaces all invert from one token layer.
- **Brand system page**: `/design-system/halation` (hero, thesis, mark, colour, type, foundations, kit,
  night, tokens).
- **Tokens**: `src/features/halation/tokens.json` → `halation-tokens.css` (primitive → semantic →
  component, **day** + **night** scopes). 18 primitives, 20 measured contrast pairs, 4 published failures.
- **Marks and wordmark**: `public/brand/halation/` — Syne 600 outlined wordmark; every asset ships twice
  (`*.svg` ink for day, `*-reverse.svg` chalk for night), plus a separate 16px compact drawing because the
  ribs merge below 24px.
- **Site icons**: `brand/halation/icons.py` renders the whole set from the mark — `public/favicon.svg`,
  `favicon-16/32/48.png`, `apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png`. Run
  `python3 brand/halation/icons.py` after changing the mark; never hand-edit a PNG.
- **Social card**: `public/brand/halation/og.html` composed on the ember field, rendered to `public/og.jpg`
  (1200 × 630).
- **Manifest**: `public/site.webmanifest` (standalone, obsidian ground, coral theme).

The **Meniscus** system in `src/features/meniscus/` (documented at `/design-system/meniscus`) was the
library's previous identity: smoked graphite, a warm caustic, 12 primitives, 15 contrast pairs and 3
published failures. Its page still ships as a documented system; the landing no longer loads its
stylesheet.

## Design Systems

- **Case 01**: Sunnyside (Paper & Cobalt · Studio Anchor)
- **Case 02**: Vitrine (Glass & Dither)
- **Case 03**: Huginn Studio (Cells & Vermilion)
- **Case 04**: Riso Co. (Risograph & Pinned Sheet)
- **Case 05**: Hachure (Cartography & Dither Engine)
- **Case 06**: Cove (Liquid Glass & Blue Field)
- **Case 07**: Strand (Coastal & Quartz Sand)
- **Case 08**: Clearing (Painted Emerald & Wildlife)
- **Case 09**: Ledger (Tactile Glass & Crisp Grid)
- **Case 10**: Porphyry (Stone, Marble & Gold Leaf)
- **Case 11**: Jakarta (Transit Wayfinding & Nine District Ramps)
- **Case 12**: Bluewater Freight (Maritime Chart & Hull Waterline)
- **Case 13**: Wildflower Wind (Seed House & Refracted Violet)
- **Case 14**: Vesper (Two Inks & Stipple)
- **Case 15**: Halation (Reeded Glass & One Coral Spill)

## API Endpoint

- `GET /api/cases.json` returns structured metadata, cover thumbnails, tags, and links for all 15 cases.

## Development

```bash
npm install
npm run dev     # starts Astro on port 4321
npm run build   # builds static site into dist/
npm run preview # previews production build
```
