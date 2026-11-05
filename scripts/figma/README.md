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

## What the sheet carries (v5.0.0 canonical handoff)

- **One canonical spec.** `lib/canonical.mjs` builds the complete system from
  tokens.json + the sheet's own ramps, CSS variables, type roles, spacing,
  radius, elevation, fonts, grid and component definitions. A case whose
  tokens.json has only `meta/primitives/contrast` still ships 60–100 colours and
  10+ text styles.
- **Deterministic capture.** `buildFigmaManifest()` clones the document into a
  fixed 1440px iframe, clears body modes, reveals all 8 sheets and records
  coordinates relative to each sheet root. The same checksum and geometry are
  produced at any browser width, in Canvas Grid mode, with `?clean=1`, or with a
  single-sheet filter. The manifest is signed (`dsId`, `capture.checksum`).
- `?autolayout=1` — outlines flow containers and flags absolute/transform layers.
- **`?clean=1&doop=1` — Doop / importer mode.** One 1440px column, no sticky bar,
  no 2-column grid, no shadows or transforms, and 28px of slack on one-line
  labels so a substituted font cannot clip them. Copy it from **Doop Helper**.
- `?clean=1&grid=1` — 2-column canvas grid for preview only (capture ignores it).
- **Copy for Figma** / **Manifest** — copy or download the signed v2 manifest.
- **Plugin** — downloads a ready-to-import Figma plugin ZIP (`manifest.json`,
  `code.js`, `ui.html`) with the sheet's manifest baked in as the seed. Running
  it in Figma rebuilds an idempotent variable/style library, Auto Layout with
  variable bindings, real component variant sets + instances, and binds every
  fill and text layer. No third-party importer needed.
- **Upgrade existing pages** — migrates a flat Doop / html.to.design import in
  place instead of re-importing.
- **Sheet 08 stays optional** in Figma but is always present in the spec.
- **v5.1.0 layer quality:** one-line labels declare `white-space: nowrap` (no
  wrapping in Doop / html.to.design either), modal action groups are explicit
  full-width `action-group` layers, and the 6 cast marks / 8 system icons / 4
  spot illustrations are real named components (7 families, 34 refs per case).
  The plugin puts a full-width component library **above** the sheet on pages
  05/06/07, keeps HORIZONTAL frames at their measured width, and never
  reparents sheet content.

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

Vendored from the `sunnyside-brand-system` skill at **v5.2.0**:

```
scripts/figma/figma-html.mjs            ← scripts/figma-html.mjs
scripts/figma/lib/tokens.mjs           ← scripts/lib/tokens.mjs
scripts/figma/lib/canonical.mjs        ← scripts/lib/canonical.mjs (new)
scripts/figma/templates/figma-replay-plugin.js  ← templates/figma-replay-plugin.js
scripts/figma/templates/figma-replay-ui.html   ← templates/figma-replay-ui.html
```

Only one line differs from upstream: `TEMPLATES_DIR` points beside the script
instead of two levels up. To update, copy those five files and re-apply that one
line. Do not hand-edit the sheet outputs — they are generated.

The parity gate and smoke suites live in the skill, not here; this repo only
needs the generator, the token reader, the canonical spec and the two plugin
templates that get embedded into each sheet.
