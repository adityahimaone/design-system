#!/usr/bin/env node
/**
 * build-daybook.mjs — the Daybook brand kit in one pass.
 *
 * Writes: public/brand/daybook/{mark*,glyph,icon,lockup*,cast/*.svg}
 *         src/features/daybook/{tokens.json,daybook-tokens.css,daybook-data.ts,wordmark-path.ts}
 *
 * Surface: Glass & light. Every pane is a real `backdrop-filter`, never an
 * opacity trick; radius 16, one white inner highlight on the top edge, 260ms
 * ease-out. Geometry is the brand: every shape on the 64-unit grid, fill-only,
 * zero strokes. Re-run after editing a path — the page reads tokens.json, so
 * swatches and the contrast ledger stay in sync with the SVGs.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SLUG = 'daybook'
const BRAND = path.join(ROOT, 'public/brand', SLUG)
const FEAT = path.join(ROOT, 'src/features', SLUG)

const INK = '#131C25'
const PAPER = '#F7FAFC'

const WM_INNER = (await readFile(path.join(ROOT, 'scripts/assets/daybook-wordmark-inner.svg'), 'utf8')).trim()
const WM_VIEW = '0 0 8125.28 1997.92'
const WM_W = 298
const WM_H = Math.round((298 * 1997.92) / 8125.28)

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`

const wm = (fill) => `<g fill="${fill}" >${WM_INNER.replace(/fill="currentColor"/g, '')}</g>`

/* ── 01 · the mark ──────────────────────────────────────────────────────────
 * Nine 12-unit panes on a 4-unit gutter, and the bottom-right pane slides to
 * 50,50 instead of 34,34 — a full gutter both axes, so the break reads at 96px
 * and survives a 16px raster. The matrix is the practice; the pane outside it
 * is the client that does not fit. Fill only, no stroke anywhere.             */
const CELL = 12
const AT = [2, 18, 34]
const rect = (x, y, s = CELL) => `M${x} ${y}h${s}v${s}h-${s}Z`

const gridCells = []
for (const y of AT) for (const x of AT) gridCells.push([x, y])
const cells = gridCells.filter(([x, y]) => !(x === 34 && y === 34)).map(([x, y]) => rect(x, y))
cells.push(rect(50, 50))
const markPath = `<path d="${cells.join(' ')}"/>`

// 16px is a separate drawing: three fat panes and a wider escapee, so the gap
// still reads when the whole mark is 16 pixels across.
const compactPath = `<path d="${rect(4, 4, 20)} ${rect(36, 4, 20)} ${rect(4, 36, 20)} ${rect(42, 42, 18)}"/>`

// Glyph: the complete matrix, no escapee — favicons and 12px stamps.
const glyphPath = `<path d="${gridCells.map(([x, y]) => rect(x, y)).join(' ')}"/>`

const cast = {
  pane: `<path fill-rule="evenodd" d="M6 8H58V56H6Z M12 14H52V50H12Z"/>`,
  stack: `<path fill-rule="evenodd" d="M8 40H56V56H8Z M14 24H50V40H14Z M20 8H44V24H20Z"/>`,
  seam: `<path d="M8 14H56V22H8Z M8 42H56V50H8Z"/>`,
  lens: `<path fill-rule="evenodd" d="M32 4L60 32L32 60L4 32Z M32 20L44 32L32 44L20 32Z"/>`,
  glare: `<path d="M10 46L54 10V18L18 54H10Z"/>`,
  veil: `<path d="M10 10H54V36L36 54H10Z"/>`,
}

// Wipe the cast directory first: a renamed cast mark would otherwise leave its
// predecessor behind and the board would render twelve marks instead of six.
await rm(path.join(BRAND, 'cast'), { recursive: true, force: true })
await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })

const write = (rel, content) => writeFile(path.join(rel.startsWith('/') ? rel : ROOT, rel), content)

await write(`public/brand/${SLUG}/mark.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Daybook mark', 64, 64))
await write(`public/brand/${SLUG}/mark-reverse.svg`, svg('0 0 64 64', `<g fill="${PAPER}">${markPath}</g>`, 'Daybook mark, reverse', 64, 64))
await write(`public/brand/${SLUG}/mark-mono.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Daybook mark, mono', 64, 64))
await write(`public/brand/${SLUG}/mark-compact.svg`, svg('0 0 64 64', `<g fill="${INK}">${compactPath}</g>`, 'Daybook compact mark', 64, 64))
await write(`public/brand/${SLUG}/mark-compact-reverse.svg`, svg('0 0 64 64', `<g fill="${PAPER}">${compactPath}</g>`, 'Daybook compact mark, reverse', 64, 64))
await write(`public/brand/${SLUG}/glyph.svg`, svg('0 0 64 64', `<g fill="${INK}">${glyphPath}</g>`, 'Daybook glyph', 64, 64))
await write(
  `public/brand/${SLUG}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" fill="${INK}"/><g transform="translate(6 6) scale(0.8125)" fill="${PAPER}">${markPath}</g>`, 'Daybook app icon', 64, 64)
)

// Lockups: mark + outlined wordmark. Ink is baked — <img> resolves currentColor to black.
const lockup = (markFill, wmFill, stacked = false) => {
  if (stacked) {
    return svg(
      '0 0 240 168',
      `<g transform="translate(88 8)" fill="${markFill}">${markPath}</g><g transform="translate(22 104) scale(0.0241)">${wm(wmFill)}</g>`,
      'Daybook lockup, stacked',
      240,
      168
    )
  }
  // viewBox hugs the ink: mark 0–48, a 14-unit gap, wordmark 62–169. A wider box
  // would leave the lockup floating in dead space inside every <img>.
  return svg(
    '0 0 170 64',
    `<g transform="translate(0 8) scale(0.75)" fill="${markFill}">${markPath}</g><g transform="translate(62 16) scale(0.0132)">${wm(wmFill)}</g>`,
    'Daybook lockup',
    170,
    64
  )
}
await write(`public/brand/${SLUG}/lockup.svg`, lockup(INK, INK))
await write(`public/brand/${SLUG}/lockup-reverse.svg`, lockup(PAPER, PAPER))
await write(`public/brand/${SLUG}/lockup-stacked.svg`, lockup(INK, INK, true))
await write(`public/brand/${SLUG}/wordmark.svg`, svg(WM_VIEW, wm(INK), 'Daybook wordmark', WM_W, WM_H))
await write(`public/brand/${SLUG}/wordmark-reverse.svg`, svg(WM_VIEW, wm(PAPER), 'Daybook wordmark, reverse', WM_W, WM_H))

for (const [id, body] of Object.entries(cast)) {
  await write(`public/brand/${SLUG}/cast/${id}.svg`, svg('0 0 64 64', `<g fill="${INK}">${body}</g>`, `Daybook cast mark: ${id}`, 64, 64))
}

/* ── 02 · colour ──────────────────────────────────────────────────────────── */
const PRIMITIVES = [
  { name: 'frost', value: '#E9EEF3', oklch: 'oklch(0.937 0.008 240)', role: 'Daylight through a window — the day ground' },
  { name: 'haze', value: '#F7FAFC', oklch: 'oklch(0.980 0.005 235)', role: 'Light bloom behind a pane' },
  { name: 'veil', value: '#FFFFFF', oklch: 'oklch(1 0 0)', role: 'The frosted pane itself — always translucent' },
  { name: 'ink', value: '#131C25', oklch: 'oklch(0.218 0.020 245)', role: 'Type on glass — never pure black' },
  { name: 'slate', value: '#4C5F72', oklch: 'oklch(0.466 0.032 245)', role: 'Captions, secondary text' },
  { name: 'tint', value: '#2E5C8A', oklch: 'oklch(0.462 0.086 253)', role: 'Glass tint — the one signal in day' },
  { name: 'sun', value: '#C0813C', oklch: 'oklch(0.628 0.098 68)', role: 'Daylight in the photograph — accent only' },
  { name: 'glow', value: '#9FC2DA', oklch: 'oklch(0.800 0.042 240)', role: 'Specular edge — the signal at night' },
  { name: 'deep', value: '#0B1218', oklch: 'oklch(0.170 0.014 245)', role: 'The room after dark — night ground' },
  { name: 'deep-plate', value: '#131E28', oklch: 'oklch(0.232 0.020 245)', role: 'A pane against the night ground' },
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
  ['ink', 'frost', 'Body and headings on the day ground', 'text'],
  ['ink', 'haze', 'Body on the light bloom', 'text'],
  ['slate', 'frost', 'Captions, notes, figure labels', 'text'],
  ['tint', 'frost', 'Signal text on the day ground', 'text'],
  ['slate', 'haze', 'Captions on a bright pane', 'text'],
  ['tint', 'haze', 'Signal on a bright pane', 'text'],
  ['frost', 'deep', 'Reverse type on the night ground', 'text'],
  ['haze', 'deep', 'Brightest type at night', 'text'],
  ['glow', 'deep', 'Night signal as text', 'text'],
  ['haze', 'deep-plate', 'Type on a night pane', 'text'],
  ['sun', 'frost', 'Daylight accent — fill only', 'graphic'],
  ['sun', 'deep', 'Daylight accent at night — fill only', 'graphic'],
  ['glow', 'frost', 'Specular edge on day glass — fill only', 'graphic'],
  ['veil', 'frost', 'Pane on ground — the 1px seam', 'graphic'],
  ['deep-plate', 'deep', 'Night pane on night ground', 'graphic'],
  ['glow', 'deep-plate', 'Specular edge on a night pane', 'graphic'],
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
    name: 'Daybook',
    version: 'V1.1',
    track: 'ADVISORY',
    primaryAccent: 'tint',
    essence: 'The work is the record.',
    promise:
      'An office-consultancy identity built from frosted glass over daylight: nine panes on a 64 grid, one slid out of place, real 18px backdrop blur, and a contrast table that prints the pairs it fails.',
    case: '20',
  },
  primitives: PRIMITIVES,
  contrast,
}

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')

/* ── 03 · token layers ────────────────────────────────────────────────────── */
const prim = PRIMITIVES.map((p) => `  --db-${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const css = `/* Daybook — case 20. Surface: Glass & light.
   Layer 1 primitives never flip; layer 2 is the scope. A pane is always
   translucent + blurred, never a flat fill pretending to be glass. */
.db-scope {
${prim}

  /* 2 · semantic scope — daylight through glass is the default */
  --db-surface-page: var(--db-frost);
  --db-surface-plate: var(--db-haze);
  --db-surface-invert: var(--db-deep);
  --db-text-primary: var(--db-ink);
  --db-text-secondary: var(--db-slate);
  --db-text-invert: var(--db-haze);
  --db-signal: var(--db-tint);
  --db-signal-deep: color-mix(in srgb, var(--db-tint) 74%, var(--db-ink));
  --db-form-ink: var(--db-tint);
  --db-line-strong: color-mix(in srgb, var(--db-ink) 26%, transparent);
  --db-line-subtle: color-mix(in srgb, var(--db-ink) 11%, transparent);

  /* glass — the material, expressed once */
  --db-glass-fill: color-mix(in srgb, var(--db-veil) 58%, transparent);
  --db-glass-fill-strong: color-mix(in srgb, var(--db-veil) 78%, transparent);
  --db-glass-edge: color-mix(in srgb, var(--db-veil) 88%, transparent);
  --db-glass-rim: color-mix(in srgb, var(--db-ink) 10%, transparent);
  --db-glass-blur: blur(18px) saturate(1.35);
  --db-glass-shadow: 0 1px 0 0 var(--db-glass-edge) inset, 0 18px 40px -24px color-mix(in srgb, var(--db-ink) 34%, transparent);
  --db-field-field: color-mix(in srgb, var(--db-veil) 62%, transparent);

  /* 3 · component tokens — the only layer that knows a recipe */
  --db-btn-bg: var(--db-ink);
  --db-btn-text: var(--db-haze);
  --db-btn-bg-hover: var(--db-tint);
  --db-chip-border: var(--db-glass-rim);
  --db-field-border: color-mix(in srgb, var(--db-ink) 22%, transparent);
  --db-field-bg: var(--db-field-field);

  /* type — neutral sans only. Glass has no serif. */
  --db-font-display: 'Inter', system-ui, sans-serif;
  --db-font-reading: 'Inter', system-ui, sans-serif;
  --db-font-mono: 'DM Mono', ui-monospace, monospace;

  /* physics — cast light, not printed ink */
  --db-radius: 16px;
  --db-radius-sm: 10px;
  --db-hair: 1px;
  --db-seam: 14px;
  --db-ease: cubic-bezier(0.16, 0.84, 0.44, 1);
  --db-dur: 260ms;
}

/* night scope — the same room after dark, same primitives, opposite ground */
.db-scope[data-db-theme='night'] {
  --db-surface-page: var(--db-deep);
  --db-surface-plate: var(--db-deep-plate);
  --db-surface-invert: var(--db-haze);
  --db-text-primary: var(--db-haze);
  --db-text-secondary: color-mix(in srgb, var(--db-haze) 64%, var(--db-deep));
  --db-text-invert: var(--db-ink);
  --db-signal: var(--db-glow); /* the tint is 2.4:1 on deep — light replaces it */
  --db-signal-deep: color-mix(in srgb, var(--db-glow) 72%, var(--db-deep));
  --db-form-ink: var(--db-glow);
  --db-line-strong: color-mix(in srgb, var(--db-haze) 30%, transparent);
  --db-line-subtle: color-mix(in srgb, var(--db-haze) 13%, transparent);
  --db-glass-fill: color-mix(in srgb, var(--db-veil) 8%, transparent);
  --db-glass-fill-strong: color-mix(in srgb, var(--db-veil) 14%, transparent);
  --db-glass-edge: color-mix(in srgb, var(--db-veil) 24%, transparent);
  --db-glass-rim: color-mix(in srgb, var(--db-veil) 22%, transparent);
  --db-glass-shadow: 0 1px 0 0 var(--db-glass-edge) inset, 0 22px 50px -26px rgba(0, 0, 0, 0.72);
  --db-field-field: color-mix(in srgb, var(--db-veil) 7%, transparent);
  --db-btn-bg: var(--db-haze);
  --db-btn-text: var(--db-deep);
  --db-btn-bg-hover: var(--db-glow);
  --db-field-border: color-mix(in srgb, var(--db-haze) 28%, transparent);
}
`
await write(`src/features/${SLUG}/daybook-tokens.css`, css)

/* ── 04 · wordmark paths for inlining (currentColor) ──────────────────────── */
await write(
  `src/features/${SLUG}/wordmark-path.ts`,
  `// Outlined from Inter Light 300 (variable TTF, wght instanced) at ${WM_VIEW.replace('0 0 ', '')} units. Fill with currentColor.\nexport const WORDMARK_VIEWBOX = '${WM_VIEW}'\nexport const WORDMARK_INNER = ${JSON.stringify(WM_INNER)}\n`
)

/* ── 05 · inline path data for the page (currentColor) ───────────────────── */
const castMeta = [
  ['pane', 'Pane', 'One frosted sheet with a lit edge'],
  ['stack', 'Stack', 'Three panes, offset — depth without shadow'],
  ['seam', 'Seam', 'Two bands of light where panes meet'],
  ['lens', 'Lens', 'A pane inside a frame — the review'],
  ['glare', 'Glare', 'The specular band that crosses glass'],
  ['veil', 'Veil', 'A pane within a pane — the second opinion'],
]
await write(
  `src/features/${SLUG}/daybook-data.ts`,
  `// Generated by scripts/build-daybook.mjs — do not hand-edit.\n` +
    `export const MARK_PATH = ${JSON.stringify(markPath)}\n` +
    `export const COMPACT_PATH = ${JSON.stringify(compactPath)}\n` +
    `export const GLYPH_PATH = ${JSON.stringify(glyphPath)}\n` +
    `export type CastMark = { id: string; name: string; note: string; path: string }\n` +
    `export const CAST: readonly CastMark[] = [\n` +
    castMeta.map(([id, name, note]) => `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, note: ${JSON.stringify(note)}, path: ${JSON.stringify(cast[id])} },`).join('\n') +
    `\n]\n`
)

console.log(`daybook: ${PRIMITIVES.length} primitives · ${contrast.filter((c) => c.pass).length} pass · ${contrast.filter((c) => !c.pass).length} fail`)
console.log(contrast.filter((c) => !c.pass).map((c) => `${c.a} on ${c.b} = ${c.ratio}:1`).join('\n'))
