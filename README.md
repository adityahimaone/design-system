# design-system

Astro v5 design system library and showcase hosting 13 documented interface design systems (Cases 02–14), an interactive case gallery, and a public JSON API endpoint (`/api/cases.json`).

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
