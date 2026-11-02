# design-system

Astro v5 design system library and showcase hosting 14 documented interface design systems (Cases 01–14), an interactive case gallery, and a public JSON API endpoint (`/api/cases.json`).

## The shelf identity — Meniscus (Case 00)

The library itself is branded **Meniscus**: smoked graphite under glass, panes that lift by a 1px
specular edge instead of a shadow, and one warm caustic (#ffa768) where the light exits. It is not a
fifteenth case — it is the shelf that holds them.

The name is the shape: a meniscus is the curve a liquid makes where it meets its container. The hero
band — fourteen covers curved round the inside of a cylinder, flattening at the centre and swelling as
they come past the lens — is that curve, and the mark is the same curve scooped out of a tile.

- Brand system page: `/design-system/meniscus` (hero, premise, mark, caustic, voice, components, index, tokens)
- Tokens: `src/features/meniscus/tokens.json` → `meniscus-tokens.css` (primitive → semantic → component, **smoked** + **board** scopes). 12 primitives, 15 measured contrast pairs, 3 published failures.
- Marks and wordmark: `public/brand/meniscus/` — Bricolage Grotesque 800 outlined wordmark; every asset ships twice (`*.svg` ink for smoked, `*-reverse.svg` ink-solid for board) and `<Ink />` picks by scope.
- Caustic plates for the hero band: `public/brand/meniscus/plates/` — four generated glass plates that alternate with the covers so the band has rhythm instead of being a strip of screenshots.
- UI kit: `meniscus-ui.css` + `src/features/meniscus/ui/` — `Button`, `Field`, `Input`, `Textarea`,
  `Select`, `SearchField`, `Checkbox`, `Radio`, `Switch`, `Badge`, `Tag`, `Surface`, `Tabs`, `EmptyState`.
  No component names a colour; every value resolves through a `--me-*` token, so the whole kit inverts
  with the smoked/board scope toggle.
- Hero band: `src/components/tilted-grid-hero.tsx` — a CSS-3D cylinder built from 16 vertical slices per
  tile, transform-only on the compositor. Below 700px the tile shrinks, the bend eases and the axis
  lifts, so the band never fights the stacked type.
- The gallery (`/`) wears the same tokens and runs on that kit: search, sort, collection tabs, live
  result count, and an empty state. Cases keep their own identities untouched.

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

## API Endpoint

- `GET /api/cases.json` returns structured metadata, cover thumbnails, tags, and links for all 14 cases.

## Development

```bash
npm install
npm run dev     # starts Astro on port 4321
npm run build   # builds static site into dist/
npm run preview # previews production build
```
