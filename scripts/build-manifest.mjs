#!/usr/bin/env node
/**
 * build-manifest.mjs — the Manifest brand kit in one pass.
 *
 * Writes: public/brand/manifest/{mark*,glyph,icon,lockup*,cast/*.svg}
 *         src/features/manifest/{tokens.json,manifest-tokens.css,wordmark-path.ts}
 *
 * Geometry is the brand: every shape is on the 64-unit grid, fill-only, zero
 * strokes. Re-run after editing a path here — the page reads tokens.json, so
 * swatches and the contrast ledger stay in sync with the SVGs.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const BRAND = path.join(ROOT, 'public/brand/manifest')
const FEAT = path.join(ROOT, 'src/features/manifest')
const SLUG = 'manifest'

const INK = '#1A1714'
const KRAFT = '#D8BC93'
const STOCK = '#F4EDE0'

const WM_INNER = (await readFile(path.join(ROOT, 'scripts/assets/manifest-wordmark-inner.svg'), 'utf8')).trim()
const WM_VIEW = '0 0 5081 750'

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`

const wm = (fill) => `<g fill="${fill}">${WM_INNER.replace(/fill="currentColor"/g, '')}</g>`

/* ── 01 · the mark ──────────────────────────────────────────────────────────
 * Boolean counter-form carton: a lid strip, a body, and an arrow corridor
 * carved out of the body with fill-rule="evenodd". The negative space is the
 * outbound arrow — the box is the subject, the arrow is what it does.        */
const MARK = {
  lid: 'M6 10H58V20H6Z',
  body: 'M6 24H58V58H6Z',
  cut: 'M32 28L45 42H37V54H27V42H19Z',
}
const markPath = `<path fill-rule="evenodd" d="${MARK.lid} ${MARK.body} ${MARK.cut}"/>`

// 16px is a separate drawing: no lid channel, wider shaft, bigger head.
const COMPACT = 'M4 12H60V58H4Z'
const COMPACT_CUT = 'M32 20L48 36H40V52H24V36H16Z'
const compactPath = `<path fill-rule="evenodd" d="${COMPACT} ${COMPACT_CUT}"/>`

// Glyph: the mark without the arrow, for favicons and 12px stamps.
const glyphPath = `<path fill-rule="evenodd" d="M6 10H58V20H6Z ${MARK.body}"/>`

const cast = {
  parcel: `<path fill-rule="evenodd" d="M8 16H56V56H8Z M8 26H56V32H8Z"/>`,
  docket: `<path fill-rule="evenodd" d="M12 8H52V56H12Z M20 20H44V26H20Z M20 34H44V40H20Z M20 44H34V50H20Z"/>`,
  pallet: `<path d="M6 18H58V26H6Z M6 34H58V42H6Z M10 42H18V56H10Z M46 42H54V56H46Z"/>`,
  tape: `<path fill-rule="evenodd" d="M10 12H54V44H10Z M22 22H42V34H22Z M10 44H26V54H10Z"/>`,
  route: `<path d="M8 46H22V32H34V18H48V30H58V38H44V50H32V56H8Z"/>`,
  depot: `<path fill-rule="evenodd" d="M32 8L58 26V56H6V26Z M26 38H38V56H26Z"/>`,
}

await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })

const write = (rel, content) => writeFile(path.join(rel.startsWith('/') ? rel : ROOT, rel), content)

await write(`public/brand/${SLUG}/mark.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Manifest mark', 64, 64))
await write(`public/brand/${SLUG}/mark-reverse.svg`, svg('0 0 64 64', `<g fill="${KRAFT}">${markPath}</g>`, 'Manifest mark, reverse', 64, 64))
await write(`public/brand/${SLUG}/mark-mono.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Manifest mark, mono', 64, 64))
await write(`public/brand/${SLUG}/mark-compact.svg`, svg('0 0 64 64', `<g fill="${INK}">${compactPath}</g>`, 'Manifest compact mark', 64, 64))
await write(`public/brand/${SLUG}/mark-compact-reverse.svg`, svg('0 0 64 64', `<g fill="${KRAFT}">${compactPath}</g>`, 'Manifest compact mark, reverse', 64, 64))
await write(`public/brand/${SLUG}/glyph.svg`, svg('0 0 64 64', `<g fill="${INK}">${glyphPath}</g>`, 'Manifest glyph', 64, 64))
await write(
  `public/brand/${SLUG}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" fill="${INK}"/><g transform="translate(6 6) scale(0.8125)" fill="${KRAFT}">${markPath}</g>`, 'Manifest app icon', 64, 64)
)

// Lockups: mark + outlined wordmark. Ink is baked — <img> resolves currentColor to black.
const lockup = (markFill, wmFill, stacked = false) => {
  if (stacked) {
    return svg(
      '0 0 240 168',
      `<g transform="translate(88 8)" fill="${markFill}">${markPath}</g><g transform="translate(18 104) scale(0.0402)">${wm(wmFill)}</g>`,
      'Manifest lockup, stacked',
      240,
      168
    )
  }
  return svg(
    '0 0 288 64',
    `<g transform="translate(0 8) scale(0.75)" fill="${markFill}">${markPath}</g><g transform="translate(64 16) scale(0.0427)">${wm(wmFill)}</g>`,
    'Manifest lockup',
    288,
    64
  )
}
await write(`public/brand/${SLUG}/lockup.svg`, lockup(INK, INK))
await write(`public/brand/${SLUG}/lockup-reverse.svg`, lockup(KRAFT, STOCK))
await write(`public/brand/${SLUG}/lockup-stacked.svg`, lockup(INK, INK, true))
await write(`public/brand/${SLUG}/wordmark.svg`, svg(WM_VIEW, wm(INK), 'Manifest wordmark', 508, 75))
await write(`public/brand/${SLUG}/wordmark-reverse.svg`, svg(WM_VIEW, wm(STOCK), 'Manifest wordmark, reverse', 508, 75))

for (const [id, body] of Object.entries(cast)) {
  await write(`public/brand/${SLUG}/cast/${id}.svg`, svg('0 0 64 64', `<g fill="${INK}">${body}</g>`, `Manifest cast mark: ${id}`, 64, 64))
}

/* ── 02 · colour ──────────────────────────────────────────────────────────── */
const PRIMITIVES = [
  { name: 'stock', value: '#F4EDE0', oklch: 'oklch(0.945 0.014 82)', role: 'Waybill paper — the default page ground' },
  { name: 'chalk', value: '#FCFAF4', oklch: 'oklch(0.984 0.008 84)', role: 'Reading plate lifted off the stock' },
  { name: 'kraft', value: '#D8BC93', oklch: 'oklch(0.800 0.055 78)', role: 'Corrugated carton — fields, bands, the mark' },
  { name: 'kraft-deep', value: '#B9905F', oklch: 'oklch(0.688 0.072 71)', role: 'A carton edge in shadow — rules and hatching' },
  { name: 'brick', value: '#A6382A', oklch: 'oklch(0.512 0.148 33)', role: 'Brick oxide — the one warm signal' },
  { name: 'brick-deep', value: '#7A271D', oklch: 'oklch(0.396 0.118 32)', role: 'Pressed brick — fail states and stamps' },
  { name: 'indigo', value: '#2F4A6B', oklch: 'oklch(0.398 0.062 253)', role: 'Workwear chambray — secondary ink' },
  { name: 'indigo-deep', value: '#1B2C42', oklch: 'oklch(0.290 0.048 254)', role: 'Night depot — inverted bands' },
  { name: 'transit', value: '#3E6B4E', oklch: 'oklch(0.477 0.078 152)', role: 'Delivered / cleared status only' },
  { name: 'ink', value: '#1A1714', oklch: 'oklch(0.208 0.008 66)', role: 'Warm lampblack — type, marks, rules' },
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
  ['ink', 'stock', 'Body and headings on the waybill ground', 'text'],
  ['ink', 'chalk', 'Body on the lifted reading plate', 'text'],
  ['ink', 'kraft', 'Type over a carton field', 'text'],
  ['chalk', 'brick', 'Type on the oxide signal', 'text'],
  ['stock', 'ink', 'Reverse type on lampblack', 'text'],
  ['chalk', 'indigo', 'Reverse type on chambray', 'text'],
  ['chalk', 'indigo-deep', 'The night-depot band', 'text'],
  ['indigo', 'stock', 'Secondary ink, links, captions', 'text'],
  ['brick', 'stock', 'The signal as a 14px label', 'text'],
  ['brick-deep', 'stock', 'Error text and stamps', 'text'],
  ['transit', 'stock', 'Delivered status label', 'text'],
  ['ink', 'kraft-deep', 'Type over a shadowed carton edge', 'text'],
  ['kraft', 'chalk', 'Carton field on paper — fill only', 'graphic'],
  ['brick', 'ink', 'Oxide on lampblack — graphic only', 'graphic'],
  ['transit', 'kraft', 'Status on carton — graphic only', 'graphic'],
  ['stock', 'kraft', 'Paper on carton — rules, never type', 'graphic'],
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
    job: pass
      ? kind === 'text'
        ? 'Text at any size'
        : 'Rules, fills, graphic marks'
      : 'Graphic only — never type',
  }
})

const tokens = {
  meta: {
    slug: SLUG,
    name: 'Manifest',
    version: 'V1.0',
    track: 'CONSTRUCTED',
    primaryAccent: 'brick',
    essence: 'Every parcel leaves a paper trail.',
    promise:
      'A logistics identity built from corrugated kraft, brick oxide and chambray indigo: a carton whose negative space is the outbound arrow, one waybill ledger, and a contrast table that prints the pairs it fails.',
    case: '20',
  },
  primitives: PRIMITIVES,
  contrast,
}

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')

/* ── 03 · token layers ────────────────────────────────────────────────────── */
const prim = PRIMITIVES.map((p) => `  --mf-${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const css = `/* Manifest — case 20. Layer 1 primitives never flip; layer 2 is the scope. */
.mf-scope {
${prim}

  /* 2 · semantic scope — daylight kraft is the default */
  --mf-surface-page: var(--mf-stock);
  --mf-surface-plate: var(--mf-chalk);
  --mf-surface-field: var(--mf-kraft);
  --mf-surface-invert: var(--mf-ink);
  --mf-text-primary: var(--mf-ink);
  --mf-text-secondary: var(--mf-indigo);
  --mf-text-invert: var(--mf-chalk);
  --mf-signal: var(--mf-brick);
  --mf-signal-deep: var(--mf-brick-deep);
  --mf-status-ok: var(--mf-transit);
  --mf-line-strong: color-mix(in srgb, var(--mf-ink) 82%, transparent);
  --mf-line-subtle: color-mix(in srgb, var(--mf-ink) 16%, transparent);

  /* 3 · component tokens — the only layer that knows a recipe */
  --mf-btn-bg: var(--mf-ink);
  --mf-btn-text: var(--mf-chalk);
  --mf-btn-bg-hover: var(--mf-signal);
  --mf-chip-border: var(--mf-line-subtle);
  --mf-field-border: color-mix(in srgb, var(--mf-ink) 34%, transparent);
  --mf-field-bg: var(--mf-chalk);

  /* type */
  --mf-font-display: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
  --mf-font-reading: 'Instrument Sans', 'Archivo', system-ui, sans-serif;
  --mf-font-mono: 'DM Mono', 'IBM Plex Mono', ui-monospace, monospace;

  /* physics: printed, not rounded */
  --mf-radius: 0px;
  --mf-radius-plate: 3px;
  --mf-rule: 1px;
  --mf-seam: 4px;
  --mf-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
}
`
await write(`src/features/${SLUG}/manifest-tokens.css`, css)

/* ── 04 · wordmark paths for inlining (currentColor) ──────────────────────── */
await write(
  `src/features/${SLUG}/wordmark-path.ts`,
  `// Outlined from Archivo 700 at 5081×750 units. Fill with currentColor.\nexport const WORDMARK_VIEWBOX = '${WM_VIEW}'\nexport const WORDMARK_INNER = ${JSON.stringify(WM_INNER)}\n`
)

/* ── 05 · inline path data for the page (currentColor) ───────────────────── */
const castMeta = [
  ['parcel', 'Parcel', 'One box, one band — the shipped unit'],
  ['docket', 'Docket', 'Lines of a waybill, ruled left'],
  ['pallet', 'Pallet', 'Two decks, two feet — the load'],
  ['tape', 'Tape', 'A taped seam with a torn tail'],
  ['route', 'Route', 'Three legs, one corner each'],
  ['depot', 'Depot', 'Gable, wall, one open door'],
]
await write(
  `src/features/${SLUG}/manifest-data.ts`,
  `// Generated by scripts/build-manifest.mjs — do not hand-edit.\n` +
    `export const MARK_PATH = ${JSON.stringify(markPath)}\n` +
    `export const COMPACT_PATH = ${JSON.stringify(compactPath)}\n` +
    `export const GLYPH_PATH = ${JSON.stringify(glyphPath)}\n` +
    `export type CastMark = { id: string; name: string; note: string; path: string }\n` +
    `export const CAST: readonly CastMark[] = [\n` +
    castMeta.map(([id, name, note]) => `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, note: ${JSON.stringify(note)}, path: ${JSON.stringify(cast[id])} },`).join('\n') +
    `\n]\n`
)

console.log(`manifest: ${PRIMITIVES.length} primitives · ${contrast.filter((c) => c.pass).length} pass · ${contrast.filter((c) => !c.pass).length} fail`)
console.log(contrast.filter((c) => !c.pass).map((c) => `${c.a} on ${c.b} = ${c.ratio}:1`).join('\n'))
