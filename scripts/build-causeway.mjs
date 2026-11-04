#!/usr/bin/env node
/**
 * build-causeway.mjs — the Causeway brand kit in one pass.
 *
 * Writes: public/brand/causeway/{mark*,glyph,icon,lockup*,wordmark*,cast/*.svg}
 *         src/features/causeway/{tokens.json,causeway-tokens.css,causeway-data.ts}
 *
 * Surface: Cardboard & steel. Kraft tan ground, galvanised grey plate, 1px cold
 * rules, 0px radius, kraft grain at 5.5% and flute lines on large panels. The
 * one colour that is not cardboard is the green sampled off the bike's top tube
 * (#51D933, median of 8,377 frame pixels in hero-bike-by-water.jpg).
 *
 * Mark: one 4-unit bar (the causeway) with one 9-unit arch standing on it (the
 * wheel that rides it). Two shapes, fill only, zero strokes, and the void under
 * the arch is the water.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SLUG = 'causeway'
const BRAND = path.join(ROOT, 'public/brand', SLUG)
const FEAT = path.join(ROOT, 'src/features', SLUG)

const INK = '#17181A'
const CHALK = '#F5F2E9'
const GREEN = '#51D933'

/* ── 01 · the mark ──────────────────────────────────────────────────────────
 * Bar 2→62 at y 44→48 (4 units thick). Arch centred 32,44: outer r 26, inner
 * r 17, so the band is 9 units and the feet land exactly on the bar's top edge.
 * Apex at y 18. Clear space 2 units all round.                                  */
const BAR = 'M2 44H62V48H2Z'
const arch = (cx, cy, ro, ri, foot) =>
  `M${cx - ro} ${cy}A${ro} ${ro} 0 0 1 ${cx + ro} ${cy}H${cx + ri}A${ri} ${ri} 0 0 0 ${cx - ri} ${cy}Z${foot ? '' : ''}`

const markPath = `<path d="${BAR} ${arch(32, 44, 26, 17)}"/>`

// 16px is its own drawing: bar 6 units, arch band 14, so the void survives a
// 16-pixel raster instead of filling in with anti-aliasing.
const compactPath = `<path d="M2 42H62V48H2Z ${arch(32, 42, 27, 13)}"/>`

// Glyph: the arch loses its void and becomes a solid dome on the bar — the
// favicon and the 12px stamp. Three drawings, one family.
const glyphPath = `<path d="M2 44H62V48H2Z M6 44A26 26 0 0 1 58 44Z"/>`

/* ── 02 · the cast · six nouns off the workshop floor ─────────────────────── */
const cast = {
  frame: `<path fill-rule="evenodd" d="M32 6 58 56H6Z M32 24 44 44H20Z"/>`,
  wheel: `<path fill-rule="evenodd" d="M32 6A26 26 0 1 1 32 58A26 26 0 1 1 32 6Z M32 15A17 17 0 1 0 32 49A17 17 0 1 0 32 15Z M27 27H37V37H27Z"/>`,
  carton: `<path fill-rule="evenodd" d="M8 18H56V56H8Z M16 26H48V48H16Z M22 18H42V8H22Z"/>`,
  rack: `<path d="M6 16H58V24H6Z M10 24H18V56H10Z M28 24H36V56H28Z M46 24H54V56H46Z"/>`,
  guard: `<path d="M0 56A32 32 0 0 1 64 56H53A21 21 0 0 0 11 56Z"/>`,
  lamp: `<path fill-rule="evenodd" d="M16 8H48V36H16Z M25 17H39V31H25Z M29 36H35V48H29Z M4 48H60V56H4Z"/>`,
}

const castMeta = [
  ['frame', 'Frame', 'The diamond that carries the load'],
  ['wheel', 'Wheel', 'Ring, hub, and the void between'],
  ['carton', 'Carton', 'One box, one bike, one flap'],
  ['rack', 'Rack', 'Platform and three legs'],
  ['guard', 'Guard', 'The arc that keeps the rain off'],
  ['lamp', 'Lamp', 'Body, lens, and the road under it'],
]

/* ── 03 · wordmark ─────────────────────────────────────────────────────────
 * Outlined from Archivo 700 at -0.035em. Baseline in source units is 713.43 of
 * a 916.52-tall box, which is what every lockup offset below is computed from. */
const wmRaw = await readFile(path.join(ROOT, 'scripts/assets/causeway-wordmark.svg'), 'utf8')
const WM_INNER = (wmRaw.match(/<g fill="currentColor">([\s\S]*)<\/g>/) || [, ''])[1].trim()
const WM_W = 4754.91
const WM_H = 916.52
const WM_BASE = 713.43

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`

const wm = (fill) => `<g fill="${fill}">${WM_INNER.replace(/fill="currentColor"/g, '')}</g>`

const LOCK_S = 0.0308 // cap height ≈ 22 units inside a 64-unit lockup
const LOCK_X = 62
const LOCK_BASE = 50
const LOCK_W = Math.round(LOCK_X + WM_W * LOCK_S)

const lockup = (markFill, wmFill, stacked = false) => {
  if (stacked) {
    // Mark at full 64 units, wordmark 18 units below it: a stacked lockup with a
    // wider gap reads as two logos sharing a sheet.
    const s = LOCK_S
    const w = WM_W * s
    const x = Math.round((204 - w) / 2)
    const base = 106
    return svg(
      '0 0 204 116',
      `<g transform="translate(70 0)" fill="${markFill}">${markPath}</g>` +
        `<g transform="translate(${x} ${(base - WM_BASE * s).toFixed(2)}) scale(${s})">${wm(wmFill)}</g>`,
      'Causeway lockup, stacked',
      204,
      116
    )
  }
  return svg(
    `0 0 ${LOCK_W} 64`,
    `<g transform="translate(0 8) scale(0.75)" fill="${markFill}">${markPath}</g>` +
      `<g transform="translate(${LOCK_X} ${(LOCK_BASE - WM_BASE * LOCK_S).toFixed(2)}) scale(${LOCK_S})">${wm(wmFill)}</g>`,
    'Causeway lockup',
    LOCK_W,
    64
  )
}

await rm(path.join(BRAND, 'cast'), { recursive: true, force: true })
await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })

const write = (rel, content) => writeFile(path.join(ROOT, rel), content)
const P = `public/brand/${SLUG}`

await write(`${P}/mark.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Causeway mark', 64, 64))
await write(`${P}/mark-reverse.svg`, svg('0 0 64 64', `<g fill="${CHALK}">${markPath}</g>`, 'Causeway mark, reverse', 64, 64))
await write(`${P}/mark-green.svg`, svg('0 0 64 64', `<g fill="${GREEN}">${markPath}</g>`, 'Causeway mark, frame green', 64, 64))
await write(`${P}/mark-compact.svg`, svg('0 0 64 64', `<g fill="${INK}">${compactPath}</g>`, 'Causeway compact mark', 64, 64))
await write(`${P}/mark-compact-reverse.svg`, svg('0 0 64 64', `<g fill="${CHALK}">${compactPath}</g>`, 'Causeway compact mark, reverse', 64, 64))
await write(`${P}/glyph.svg`, svg('0 0 64 64', `<g fill="${INK}">${glyphPath}</g>`, 'Causeway glyph', 64, 64))
await write(
  `${P}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" fill="${GREEN}"/><g fill="${INK}">${markPath}</g>`, 'Causeway app icon', 64, 64)
)

await write(`${P}/lockup.svg`, lockup(INK, INK))
await write(`${P}/lockup-reverse.svg`, lockup(CHALK, CHALK))
await write(`${P}/lockup-stacked.svg`, lockup(INK, INK, true))
await write(`${P}/wordmark.svg`, svg(`0 0 ${WM_W} ${WM_H}`, wm(INK), 'Causeway wordmark', 300, Math.round((300 * WM_H) / WM_W)))
await write(`${P}/wordmark-reverse.svg`, svg(`0 0 ${WM_W} ${WM_H}`, wm(CHALK), 'Causeway wordmark, reverse', 300, Math.round((300 * WM_H) / WM_W)))

for (const [id, body] of Object.entries(cast)) {
  await write(`${P}/cast/${id}.svg`, svg('0 0 64 64', `<g fill="${INK}">${body}</g>`, `Causeway cast mark: ${id}`, 64, 64))
}

/* ── 04 · colour ──────────────────────────────────────────────────────────── */
const PRIMITIVES = [
  { name: 'kraft', value: '#CFC1A8', oklch: 'oklch(0.800 0.031 79)', role: 'Kraft tan — the day ground, the outside of the box' },
  { name: 'carton', value: '#E8E1D3', oklch: 'oklch(0.901 0.017 84)', role: 'Bleached inner face — labels, inset panels' },
  { name: 'steel', value: '#C2C7C2', oklch: 'oklch(0.804 0.007 145)', role: 'Galvanised sheet — the plate, cool against the kraft' },
  { name: 'graphite', value: '#444944', oklch: 'oklch(0.383 0.007 145)', role: 'Secondary text, cold structure' },
  { name: 'ink', value: '#17181A', oklch: 'oklch(0.205 0.003 265)', role: 'Near-black print, tyres, the bar' },
  { name: 'green', value: '#51D933', oklch: 'oklch(0.800 0.223 138)', role: 'The frame — sampled from the top tube' },
  { name: 'moss', value: '#175A0C', oklch: 'oklch(0.398 0.130 143)', role: 'The frame as type — links, signal' },
  { name: 'chalk', value: '#F5F2E9', oklch: 'oklch(0.956 0.010 90)', role: 'Reverse type on ink, waybill white' },
  { name: 'night', value: '#141713', oklch: 'oklch(0.187 0.008 145)', role: 'The depot after dark — night ground' },
  { name: 'night-plate', value: '#1E221D', oklch: 'oklch(0.240 0.010 145)', role: 'A steel sheet against the night ground' },
]

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h) => {
  const [r, g, b] = hex(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const PAIRS = [
  ['ink', 'kraft', 'Body and headings on the kraft ground', 'text'],
  ['ink', 'steel', 'Type on a galvanised plate', 'text'],
  ['ink', 'carton', 'Type on the bleached face', 'text'],
  ['graphite', 'kraft', 'Captions, notes, figure labels', 'text'],
  ['moss', 'kraft', 'The signal as a link on kraft', 'text'],
  ['moss', 'carton', 'The signal on a label', 'text'],
  ['chalk', 'night', 'Reverse type on the night ground', 'text'],
  ['kraft', 'night', 'Kraft as type at night', 'text'],
  ['green', 'night', 'Night signal — the same green as the frame', 'text'],
  ['green', 'ink', 'The reverse lockup: frame green on print black', 'text'],
  ['ink', 'green', 'Primary button: ink printed on the frame colour', 'text'],
  ['green', 'kraft', 'The frame colour on kraft', 'graphic'],
  ['chalk', 'steel', 'Label white on galvanised', 'graphic'],
  ['kraft', 'steel', 'Kraft against steel — the tone step', 'graphic'],
  ['graphite', 'ink', 'Graphite at night — why the scope lifts to chalk', 'text'],
]

const contrast = PAIRS.map(([a, b, note, kind]) => {
  const r = ratio(PRIMITIVES.find((p) => p.name === a).value, PRIMITIVES.find((p) => p.name === b).value)
  const pass = kind === 'text' ? r >= 4.5 : r >= 3
  return {
    a,
    b,
    note,
    kind,
    ratio: Number(r.toFixed(2)),
    pass,
    job: pass ? (kind === 'text' ? 'Text at any size' : 'Rules, fills, graphic marks') : 'Graphic only — never type',
  }
})

const tokens = {
  meta: {
    slug: SLUG,
    name: 'Causeway',
    version: 'V1.0',
    track: 'COMMUTER',
    primaryAccent: 'green',
    essence: 'The commute is the ride.',
    promise:
      'A commuter bicycle sold in one carton: kraft ground, galvanised plate, zero radius, and one green sampled off the top tube. The mark is a bar with an arch standing on it — a causeway with a wheel riding it.',
    case: '21',
  },
  primitives: PRIMITIVES,
  contrast,
}

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')

/* ── 05 · the three token layers ──────────────────────────────────────────── */
const prim = PRIMITIVES.map((p) => `  --cw-${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const css = `/* Causeway — case 21. Surface: Cardboard & steel.
   Layer 1 primitives never flip. Layer 2 is the scope. Zero radius, 1px cold
   rules, kraft grain at 5.5%, flute lines on large panels, 140ms. */
.cw-scope {
${prim}

  /* 2 · semantic scope — kraft by daylight is the default */
  --cw-surface-page: var(--cw-kraft);
  --cw-surface-plate: var(--cw-steel);
  --cw-surface-label: var(--cw-carton);
  --cw-surface-invert: var(--cw-ink);
  --cw-text-primary: var(--cw-ink);
  --cw-text-secondary: var(--cw-graphite);
  --cw-text-invert: var(--cw-chalk);
  --cw-signal: var(--cw-moss);
  --cw-signal-fill: var(--cw-green);
  --cw-line-strong: color-mix(in srgb, var(--cw-ink) 42%, transparent);
  --cw-line-subtle: color-mix(in srgb, var(--cw-ink) 16%, transparent);
  --cw-grain: 0.055;

  /* 3 · component tokens — the only layer that knows a recipe */
  --cw-btn-bg: var(--cw-green);
  --cw-btn-text: var(--cw-ink);
  --cw-btn-ghost: color-mix(in srgb, var(--cw-ink) 6%, transparent);
  --cw-tag-line: color-mix(in srgb, var(--cw-ink) 30%, transparent);
  --cw-field-bg: color-mix(in srgb, var(--cw-carton) 62%, transparent);
  --cw-field-line: color-mix(in srgb, var(--cw-ink) 34%, transparent);

  /* type — one grotesque for display and reading, mono for anything counted */
  --cw-font-display: 'Archivo', 'Helvetica Neue', system-ui, sans-serif;
  --cw-font-reading: 'Archivo', 'Helvetica Neue', system-ui, sans-serif;
  --cw-font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  /* physics — corrugated board does not have soft corners */
  --cw-radius: 0px;
  --cw-hair: 1px;
  --cw-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --cw-dur: 140ms;
  --cw-wrap: 1320px;
  --cw-gutter: clamp(20px, 4vw, 56px);
}

/* night scope — the depot after dark, same primitives, opposite ground */
.cw-scope[data-cw-theme='night'] {
  --cw-surface-page: var(--cw-night);
  --cw-surface-plate: var(--cw-night-plate);
  --cw-surface-label: var(--cw-night-plate);
  --cw-surface-invert: var(--cw-chalk);
  --cw-text-primary: var(--cw-chalk);
  --cw-text-secondary: color-mix(in srgb, var(--cw-kraft) 74%, var(--cw-night));
  --cw-text-invert: var(--cw-ink);
  --cw-signal: var(--cw-green); /* moss is 2.6:1 on night — the frame colour carries it */
  --cw-line-strong: color-mix(in srgb, var(--cw-chalk) 40%, transparent);
  --cw-line-subtle: color-mix(in srgb, var(--cw-chalk) 15%, transparent);
  --cw-grain: 0.038;
  --cw-btn-bg: var(--cw-green);
  --cw-btn-text: var(--cw-ink);
  --cw-btn-ghost: color-mix(in srgb, var(--cw-chalk) 8%, transparent);
  --cw-tag-line: color-mix(in srgb, var(--cw-chalk) 34%, transparent);
  --cw-field-bg: color-mix(in srgb, var(--cw-chalk) 7%, transparent);
  --cw-field-line: color-mix(in srgb, var(--cw-chalk) 32%, transparent);
}
`
await write(`src/features/${SLUG}/causeway-tokens.css`, css)

/* ── 06 · inline path data + wordmark for the page ────────────────────────── */
await write(
  `src/features/${SLUG}/causeway-data.ts`,
  `// Generated by scripts/build-causeway.mjs — do not hand-edit.\n` +
    `export const MARK_PATH = ${JSON.stringify(markPath)}\n` +
    `export const COMPACT_PATH = ${JSON.stringify(compactPath)}\n` +
    `export const GLYPH_PATH = ${JSON.stringify(glyphPath)}\n` +
    `export const WORDMARK_VIEWBOX = '0 0 ${WM_W} ${WM_H}'\n` +
    `export const WORDMARK_INNER = ${JSON.stringify(WM_INNER)}\n` +
    `export type CastMark = { id: string; name: string; note: string; path: string }\n` +
    `export const CAST: readonly CastMark[] = [\n` +
    castMeta
      .map(
        ([id, name, note]) =>
          `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, note: ${JSON.stringify(note)}, path: ${JSON.stringify(cast[id])} },`
      )
      .join('\n') +
    `\n]\n`
)

console.log(`causeway: ${PRIMITIVES.length} primitives · ${contrast.filter((c) => c.pass).length} pass · ${contrast.filter((c) => !c.pass).length} fail`)
console.log(contrast.filter((c) => !c.pass).map((c) => `${c.a} on ${c.b} = ${c.ratio}:1`).join('\n'))
