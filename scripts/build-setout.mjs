#!/usr/bin/env node
/**
 * build-setout.mjs — the Setout construction brand kit in one pass.
 *
 * Surface: #4 Blueprint grid. One scope. The deep blue is the paper, not a
 * night mode. A 24px white grid, 1px rules, 0px radius, 160ms linear motion,
 * and one hi-vis orange sampled from the worker's vest on the primary action.
 *
 * Writes: public/brand/setout/{mark*,glyph,icon,lockup*,wordmark*,cast/*.svg}
 *         src/features/setout/{tokens.json,setout-tokens.css,setout-data.ts,DESIGN.md}
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SLUG = 'setout'
const BRAND = path.join(ROOT, 'public/brand', SLUG)
const FEAT = path.join(ROOT, 'src/features', SLUG)
const P = `public/brand/${SLUG}`

const BLUEPRINT = '#071E46'
const PLATE = '#0D2C5C'
const CHALK = '#F4F7FF'
const HIVIS = '#FF6B1A'
const INK = '#06152F'

/* ── 01 · the mark — two offset blocks ─────────────────────────────────────── */
const markPath = `<path d="M8 10H30V36H8Z M36 28H58V56H36Z"/>`
const compactPath = `<path d="M4 6H28V34H4Z M36 30H60V60H36Z"/>`
const glyphPath = `<path d="M2 4H26V36H2Z M34 28H62V62H34Z"/>`

/* ── 02 · the cast — six nouns from a setting-out site ────────────────────── */
const cast = {
  datum: `<path d="M6 50H58V56H6Z M28 8H36V50H28Z M16 18H48V22H16Z"/>`,
  grid: `<path d="M6 6H20V20H6Z M26 6H40V20H26Z M46 6H60V20H46Z M6 26H20V40H6Z M26 26H40V40H26Z M48 44H62V58H48Z M6 46H20V60H6Z M26 46H40V60H26Z"/>`,
  level: `<path d="M6 28H58V36H6Z M10 14H18V50H10Z M46 14H54V50H46Z M28 10H36V54H28Z"/>`,
  formwork: `<path d="M8 6H20V58H8Z M44 6H56V58H44Z M20 18H44V22H20Z M20 40H44V44H20Z"/>`,
  pin: `<path d="M20 8H44V18H20Z M28 18H36V56H28Z M24 56H40V60H24Z"/>`,
  survey: `<path d="M8 52H56V58H8Z M14 40H26V52H14Z M30 28H42V52H30Z M46 14H58V52H46Z"/>`,
}

const castMeta = [
  ['datum', 'Datum', 'One fixed point every measurement returns to'],
  ['grid', 'Grid', 'Nine bays, one pushed off the line'],
  ['level', 'Level', 'A horizontal check with a plumb centre'],
  ['formwork', 'Formwork', 'Two shutters held by two ties'],
  ['pin', 'Pin', 'The nail that turns a line into a point'],
  ['survey', 'Survey', 'Three stations stepped up the profile'],
]

/* ── 03 · outlined wordmark — pure path, zero <text> ─────────────────────── */
const GLYPHS = {
  S: ['11111', '10000', '10000', '11111', '00001', '00001', '11111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  O: ['11111', '10001', '10001', '10001', '10001', '10001', '11111'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '11111'],
}
const LETTERS = ['S', 'E', 'T', 'O', 'U', 'T']
const CELL = 14
const STEP = 16
const X0 = 20
const Y0 = 14
const LETTER_STEP = 92
const rects = []
LETTERS.forEach((letter, li) => {
  GLYPHS[letter].forEach((row, r) => {
    ;[...row].forEach((bit, c) => {
      if (bit === '1') {
        const x = X0 + li * LETTER_STEP + c * STEP
        const y = Y0 + r * STEP
        rects.push(`M${x} ${y}h${CELL}v${CELL}h-${CELL}z`)
      }
    })
  })
})
const WM_PATH = `<path d="${rects.join(' ')}"/>`
const WM_VIEW = '0 0 578 140'
const [, , WM_W, WM_H] = WM_VIEW.split(' ').map(Number)

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`

const wm = (fill) => `<g fill="${fill}">${WM_PATH}</g>`

const lockup = (markFill, wmFill, stacked = false) => {
  if (stacked) {
    const s = 0.34
    const w = WM_W * s
    const x = ((240 - w) / 2).toFixed(2)
    return svg(
      '0 0 240 150',
      `<g transform="translate(92 4) scale(0.875)" fill="${markFill}">${markPath}</g>` +
        `<g transform="translate(${x} 82) scale(${s})">${wm(wmFill)}</g>`,
      'Setout lockup, stacked',
      240,
      150
    )
  }
  const s = 0.24
  return svg(
    '0 0 220 64',
    `<g transform="translate(0 4) scale(0.875)" fill="${markFill}">${markPath}</g>` +
      `<g transform="translate(70 15.2) scale(${s})">${wm(wmFill)}</g>`,
    'Setout lockup',
    220,
    64
  )
}

/* ── 04 · colour primitives + OKLCH ──────────────────────────────────────── */
const BASE = [
  ['blueprint', '#071E46', 'Deep blueprint blue — the day ground, sampled from the blue hard hat'],
  ['plate', '#0D2C5C', 'One step lighter — the drawing plate and footer field'],
  ['chalk', '#F4F7FF', 'Paper white — type and dimension ticks'],
  ['grid', '#FFFFFF', 'The 24px grid ink, used only as a rule or graphic'],
  ['signal', '#2D6BFF', 'Blue hard hat — dimension ticks only, never body text'],
  ['hivis', '#FF6B1A', 'Hi-vis orange — the one accent, on the primary action'],
  ['lime', '#C8F000', 'Hi-vis lime from the vest — pass pairs only'],
  ['concrete', '#8C949E', 'Cool concrete grey — captions and rules'],
  ['graphite', '#121826', 'Near-black steel — reverse type ground'],
  ['kraft', '#C8A46A', 'Kraft tape and timber — pass pairs only'],
  ['steel', '#6E7C8C', 'Scaffold steel — graphic rules only'],
  ['ink', '#06152F', 'Ink on the hi-vis button — never pure black'],
]

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h) => {
  const [r, g, b] = hexToRgb(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const hexToOklch = (h) => {
  const [r, g, b] = hexToRgb(h).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
}

const PRIMITIVES = BASE.map(([name, value, role]) => ({ name, value, oklch: hexToOklch(value), role }))
const byName = (n) => PRIMITIVES.find((p) => p.name === n).value

const PAIRS = [
  ['chalk', 'blueprint', 'Body and headings on the blueprint ground', 'text'],
  ['chalk', 'plate', 'Type on the lighter drawing plate', 'text'],
  ['concrete', 'blueprint', 'Captions, notes and figure labels', 'text'],
  ['hivis', 'blueprint', 'The hi-vis accent as a measured link', 'text'],
  ['ink', 'hivis', 'Button ink on the hi-vis action', 'text'],
  ['lime', 'blueprint', 'Hi-vis lime on the blueprint ground', 'text'],
  ['kraft', 'blueprint', 'Kraft tape as a measured label', 'text'],
  ['chalk', 'graphite', 'Reverse type on near-black steel', 'text'],
  ['chalk', 'hivis', 'Chalk on the hi-vis orange — a failing pair', 'text'],
  ['signal', 'blueprint', 'Blue hard hat on the blueprint ground — a failing pair', 'text'],
  ['steel', 'blueprint', 'Scaffold steel as a 1px rule', 'graphic'],
  ['grid', 'blueprint', 'The 24px grid itself', 'graphic'],
  ['plate', 'blueprint', 'A plate lifted off the ground — a failing pair', 'graphic'],
]

const RESTRICTED = {
  'chalk on hivis': 'Wash / fill / graphic only — never type',
  'signal on blueprint': 'Grid / dimension tick only — never body text',
  'plate on blueprint': 'Plate separation only — never type; rules carry it',
}

const contrast = PAIRS.map(([a, b, note, kind]) => {
  const r = ratio(byName(a), byName(b))
  const pass = kind === 'text' ? r >= 4.5 : r >= 3
  const key = `${a} on ${b}`
  return {
    a,
    b,
    note,
    kind,
    ratio: Number(r.toFixed(2)),
    pass,
    job: pass ? (kind === 'text' ? 'Text at any size' : 'Rules, fills, graphic marks') : RESTRICTED[key],
  }
})

const tokens = {
  meta: {
    slug: SLUG,
    name: 'Setout',
    version: 'V1.0',
    track: 'CONSTRUCTED',
    primaryAccent: 'hivis',
    essence: 'The drawing becomes a line on the ground.',
    promise:
      'Setout turns a construction drawing into measured points, grids and levels on a live site, so the building starts from a datum everyone can check rather than from a render nobody can.',
    case: '24',
    surfaceContract: '#4 Blueprint grid',
    rail: 'A · 176px per-section rail',
    hero: 'E · full-screen photo · relation on · recipe R8',
    footer: 'F2 · split · top scrim · 38/62 columns',
    polarity: 'Light only · one scope',
    styleReason:
      'Q1 was an explicit named pick of #4 Blueprint grid. The photographs agree: one holds a printed plan, one is a lattice of steel scaffolding, and one carries a blue hard hat. Glass, paper and mesh would contradict the site.',
    fonts: {
      display: 'Space Grotesk',
      reading: 'Archivo',
      mono: 'IBM Plex Mono',
    },
    assets: ['hero-roof-setout.jpg', 'plate-blueprint.jpg', 'plate-scaffold.jpg'],
  },
  primitives: PRIMITIVES,
  contrast,
  semantic: {
    scope: 'single',
    surfacePage: 'blueprint',
    surfacePlate: 'plate',
    surfaceInvert: 'chalk',
    textPrimary: 'chalk',
    textSecondary: 'concrete',
    textInvert: 'ink',
    signal: 'hivis',
    lineStrong: 'grid',
    lineSubtle: 'steel',
    grid: 'grid',
  },
}

/* ── 05 · write the files ─────────────────────────────────────────────────── */
await rm(path.join(BRAND, 'cast'), { recursive: true, force: true })
await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })

const write = (rel, content) => writeFile(path.join(ROOT, rel), content)

await write(`${P}/mark.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Setout mark', 64, 64))
await write(`${P}/mark-reverse.svg`, svg('0 0 64 64', `<g fill="${CHALK}">${markPath}</g>`, 'Setout mark, reverse', 64, 64))
await write(`${P}/mark-compact.svg`, svg('0 0 64 64', `<g fill="${INK}">${compactPath}</g>`, 'Setout compact mark', 64, 64))
await write(`${P}/mark-compact-reverse.svg`, svg('0 0 64 64', `<g fill="${CHALK}">${compactPath}</g>`, 'Setout compact mark, reverse', 64, 64))
await write(`${P}/glyph.svg`, svg('0 0 64 64', `<g fill="${INK}">${glyphPath}</g>`, 'Setout glyph', 64, 64))
await write(
  `${P}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" fill="${BLUEPRINT}"/><g fill="${CHALK}">${markPath}</g>`, 'Setout app icon', 64, 64)
)

await write(`${P}/lockup.svg`, lockup(INK, INK))
await write(`${P}/lockup-reverse.svg`, lockup(CHALK, CHALK))
await write(`${P}/lockup-stacked.svg`, lockup(INK, INK, true))
await write(`${P}/wordmark.svg`, svg(WM_VIEW, wm(INK), 'Setout wordmark', 300, Math.round((300 * WM_H) / WM_W)))
await write(`${P}/wordmark-reverse.svg`, svg(WM_VIEW, wm(CHALK), 'Setout wordmark, reverse', 300, Math.round((300 * WM_H) / WM_W)))

for (const [id, body] of Object.entries(cast)) {
  await write(`${P}/cast/${id}.svg`, svg('0 0 64 64', `<g fill="${CHALK}">${body}</g>`, `Setout cast mark: ${id}`, 64, 64))
}

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')

const prim = PRIMITIVES.map((p) => `  --so-${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const css = `/* Setout — case 24. Surface: #4 Blueprint grid.
   Layer 1 primitives never flip. Layer 2 is one daylight scope: the deep blue
   is the drawing paper, not a night mode. Layer 3 knows the controls. */
.so-scope {
${prim}

  /* 2 · semantic scope — one scope, no night block, no toggle */
  --so-surface-page: var(--so-blueprint);
  --so-surface-plate: var(--so-plate);
  --so-surface-invert: var(--so-chalk);
  --so-text-primary: var(--so-chalk);
  --so-text-secondary: color-mix(in srgb, var(--so-chalk) 72%, var(--so-blueprint));
  --so-text-invert: var(--so-ink);
  --so-signal: var(--so-hivis);
  --so-grid-ink: color-mix(in srgb, var(--so-grid) 10%, transparent);
  --so-line-strong: color-mix(in srgb, var(--so-grid) 22%, transparent);
  --so-line-subtle: color-mix(in srgb, var(--so-grid) 12%, transparent);

  /* 3 · component tokens — the only layer that knows a recipe */
  --so-btn-bg: var(--so-hivis);
  --so-btn-text: var(--so-ink);
  --so-btn-bg-hover: var(--so-lime);
  --so-field-bg: var(--so-plate);
  --so-field-border: var(--so-line-strong);
  --so-row-active: color-mix(in srgb, var(--so-hivis) 14%, transparent);

  /* type */
  --so-font-display: 'Space Grotesk', system-ui, sans-serif;
  --so-font-reading: 'Archivo', system-ui, sans-serif;
  --so-font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  /* physics */
  --so-radius: 0px;
  --so-hair: 1px;
  --so-grid-size: 24px;
  --so-dur: 160ms;
  --so-ease: linear;
  --so-wrap: 1280px;
  --so-gutter: clamp(20px, 4vw, 56px);
}
`
await write(`src/features/${SLUG}/setout-tokens.css`, css)

const dataTs =
  `// Generated by scripts/build-setout.mjs — do not hand-edit.\n` +
  `export const MARK_PATH = ${JSON.stringify(markPath)}\n` +
  `export const COMPACT_PATH = ${JSON.stringify(compactPath)}\n` +
  `export const GLYPH_PATH = ${JSON.stringify(glyphPath)}\n` +
  `export const WORDMARK_VIEWBOX = '${WM_VIEW}'\n` +
  `export type CastMark = { id: string; name: string; note: string; path: string }\n` +
  `export const CAST: readonly CastMark[] = [\n` +
  castMeta
    .map(
      ([id, name, note]) =>
        `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, note: ${JSON.stringify(note)}, path: ${JSON.stringify(cast[id])} },`
    )
    .join('\n') +
  `\n]\n`
await write(`src/features/${SLUG}/setout-data.ts`, dataTs)

const fails = contrast.filter((c) => !c.pass)
const design = [
  '# Setout — Case 24 · listed build',
  '',
  '**3-Axis Synthesis:** Surface: Blueprint grid · Style: `#4 Blueprint grid` · Rail: A (176px per-section) · Hero: E, relation `on`, recipe R8 · Footer: F2 · Physics: 0px radius, 1px rules, 24px grid, 160ms linear.',
  '',
  '**Essence.** The drawing becomes a line on the ground.',
  '',
  '**Promise.** Setout turns a construction drawing into measured points, grids and levels on a live site, so the building starts from a datum everyone can check rather than from a render nobody can.',
  '',
  '## The nine slots',
  '',
  '- `ground` `#071E46` deep blueprint blue',
  '- `plate` `#0D2C5C` one step lighter, derived from the ground',
  '- `text` `#F4F7FF` paper white',
  '- `text2` chalk at 72% on the blue ground',
  '- `rule` 1px white at 22%',
  '- `radius` 0px, one value everywhere',
  '- `texture` a 24px white SVG grid, never a CSS gradient',
  '- `type` Space Grotesk display / Archivo reading / IBM Plex Mono figures',
  '- `motion` 160ms linear, one physical response',
  '',
  '## Scope',
  '',
  'Q5 was **Light only / one scope**. A blueprint is a daylight document; a dark one is a different product. The deep blue is the paper. There is no theme toggle, no night token block, no second token sheet and no second set of audit rows.',
  '',
  '## Hero and footer',
  '',
  'Hero E, relation `on`, recipe R8: the roof-setout photograph bleeds to the viewport edge, one directional deep-blue scrim falls from the right, and the type sits on the image. No panel, no card, no eyebrow.',
  '',
  'Footer F2: the blueprint photograph sits on the left in a 38/62 split, the statement on the right, with a top scrim and a 26px reverse lockup at the upper-right of the plate. Cases 21 and 22 used bottom/left lockups and bottom scrims; this variation does not repeat them. The footer image is never the hero image.',
  '',
  '## Mark and cast',
  '',
  'Two offset blocks on a 64-unit grid: a 22×26 mass at x8/y10 and a 22×28 mass at x36/y28, with a 6-unit channel between them. Fill only. The 16px compact and glyph are separate, heavier drawings.',
  '',
  'Cast nouns: `datum`, `grid`, `level`, `formwork`, `pin`, `survey`. All share the same cut weight and sit inside Section 02, not at the end of the page.',
  '',
  '## Honest contrast ledger',
  '',
  `${contrast.length} pairs computed from the same hex the CSS loads. ${fails.length} fail and are published rather than corrected:`,
  '',
  ...fails.map((c) => `- \`${c.a}\` on \`${c.b}\` = ${c.ratio}:1 — ${c.job}`),
  '',
  'The hi-vis orange is the one accent and appears on the primary action only. `chalk on hivis` cannot carry type, so the button uses `ink on hivis` at 6.38:1.',
  '',
  '## Assets',
  '',
  '- `hero-roof-setout.jpg` — worker kneeling on a green roof deck, blue hard hat, hammer and nail',
  '- `plate-blueprint.jpg` — worker holding a printed plan against pink insulation',
  '- `plate-scaffold.jpg` — worker under a lattice of steel scaffolding',
  '',
  'The page is a standalone static route at `/design-system/setout`. It is registered in `cases.ts` and `collections.ts`, appears on the landing shelf and Meniscus gallery, and ships generated thumbnails. Because "Export spec files" was not selected, no separate export bundle is produced; the core `DESIGN.md`, `tokens.json` and `setout-tokens.css` above are the feature files the page needs.',
].join('\n')
await write(`src/features/${SLUG}/DESIGN.md`, design + '\n')

console.log(`setout: ${PRIMITIVES.length} primitives · ${contrast.length} pairs · ${fails.length} published fails`)
console.log(fails.map((c) => `${c.a} on ${c.b} = ${c.ratio}:1`).join('\n'))
