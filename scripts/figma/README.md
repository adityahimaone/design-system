# Figma export (node)

Generates every case's `<slug>-figma.html` sheet — the white-background, 8-page
documentation board meant to be imported into Figma, Penpot or OpenPencil.

```bash
npm run figma:check      # resolve tokens for every case, write nothing
npm run figma:export     # rewrite public/brand/<slug>/<slug>-figma.html
npm run figma:sunnyside  # sunnyside only (its tokens live in the app repo)
```

Output goes to `public/brand/<slug>/<slug>-figma.html`, which is the path every
case page links to.

## What the sheet carries

- `?autolayout=1` — outlines flow containers and flags absolute/transform layers.
- `?clean=1&grid=1` — clean export and 2-column canvas grid (each sheet stays
  under the 10,000px Figma import limit).
- **Copy for Figma** — copies a typed layout + token manifest.
- **Manifest** — downloads that manifest as JSON.
- **Plugin** — downloads a ready-to-import Figma plugin ZIP (`manifest.json`,
  `code.js`, `ui.html`) with the sheet's manifest baked in as the seed. Running
  it in Figma rebuilds native Auto Layout, variable collections, bound paint and
  text styles, components and vectors. No third-party importer needed.

## Case discovery

`--all` resolves a case when it finds tokens at any of:

```
features/<slug>/tokens.json
src/features/<slug>/tokens.json
public/brand/<slug>/<slug>-tokens.json
public/brand/<slug>/tokens.json
```

This repo keeps most cases at `src/features/<slug>/tokens.json`, so `--all`
scans `src/features` and `public/brand` directly at the repo root.

**Sunnyside is the exception.** Its token source is
`../sunnyside/features/design-system/tokens.json` (the app repo), so `--all`
skips it and `npm run figma:sunnyside` generates it with an explicit `--tokens`
path. If the sibling checkout is missing, that one command fails and the other
24 sheets are unaffected.

## Provenance

Vendored from the `sunnyside-brand-system` skill, `scripts/figma-html.mjs`
plus `scripts/lib/tokens.mjs` and `templates/figma-replay-{plugin,ui}` at
**v4.9.6**. Only one line differs from upstream: `TEMPLATES_DIR` points beside
the script instead of two levels up.

To update, copy the four files from the skill and re-apply that one line. Do not
hand-edit the sheet outputs — they are generated.
