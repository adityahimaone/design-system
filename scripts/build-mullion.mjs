#!/usr/bin/env node
/**
 * build-mullion.mjs — the Mullion brand kit in one pass.
 *
 * Writes: public/brand/mullion/{mark*,glyph,icon,lockup*,wordmark*,cast/*.svg}
 *         src/features/mullion/{tokens.json,mullion-tokens.css,mullion-data.ts}
 *
 * Surface: Glass & light. A lit field behind, a translucent pane in front, real
 * backdrop blur, a 1px rim that catches the light, 22px squircle. The one colour
 * that is not sky is the red of the bus in the second photograph (#B01B26), the
 * only warm object in all three.
 *
 * Mark: two blocks of different height standing on one baseline with an 8-unit
 * street between them — the massing, not the silhouette. Fill only, no stroke.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SLUG = 'mullion'
const BRAND = path.join(ROOT, 'public/brand', SLUG)
const FEAT = path.join(ROOT, 'src/features', SLUG)

const INK = '#0E1620'
const HAZE = '#F4F6F9'
const GLOW = '#A8CDEA'

/* ── 01 · the mark ──────────────────────────────────────────────────────────
 * Two masses on one baseline: a 22 × 50 shaft at x 9, a 16 × 34 mass at x 39,
 * an 8-unit street between them. Bounds 9–55 × 6–56, so the pair sits dead
 * centre in the 64 box. Fill only, no stroke, no outline, no third shape.     */
const markPath = `<path d="M9 6H31V56H9Z M39 22H55V56H39Z"/>`

// 16px is its own drawing: the street widens to 10 units and both masses grow,
// so the gap survives a 16-pixel raster instead of closing up.
const compactPath = `<path d="M6 4H30V58H6Z M40 18H58V58H40Z"/>`

// Glyph: the pair at maximum weight for favicons and 12px stamps.
const glyphPath = `<path d="M4 2H28V60H4Z M38 16H60V60H38Z"/>`

/* ── 02 · the cast · six nouns from a building's own vocabulary ───────────── */
const cast = {
  floor: `<path d="M6 20H58V28H6Z M6 42H44V50H6Z"/>`,
  lift: `<path fill-rule="evenodd" d="M22 6H42V58H22Z M26 12H38V26H26Z M26 34H38V54H26Z"/>`,
  facade: `<path d="M8 8H20V20H8Z M26 8H38V20H26Z M44 8H56V20H44Z M8 26H20V38H8Z M26 26H38V38H26Z M44 26H56V38H44Z M8 44H20V56H8Z M26 44H38V56H26Z M44 44H56V56H44Z"/>`,
  lobby: `<path fill-rule="evenodd" d="M6 32H58V56H6Z M24 44H40V56H24Z"/>`,
  bay: `<path d="M10 8H18V56H10Z M28 8H36V56H28Z M46 8H54V56H46Z"/>`,
  skyline: `<path d="M6 56V34H16V24H26V40H36V18H46V30H58V56Z"/>`,
}

const castMeta = [
  ['floor', 'Floor', 'Two slabs and the storey between'],
  ['lift', 'Lift', 'Shaft, landing, car'],
  ['facade', 'Facade', 'Nine panes and the frame that holds them'],
  ['lobby', 'Lobby', 'The mass, and the door cut out of it'],
  ['bay', 'Bay', 'Three mullions at structural centres'],
  ['skyline', 'Skyline', 'The stepped profile of the block'],
]

/* ── 03 · wordmark ─────────────────────────────────────────────────────────
 * Outlined from Sora 500 at -0.028em. Baseline sits at 713.43 of a 916.52-tall
 * box; every lockup offset below is computed from those two numbers.          */
const wmRaw = await readFile(path.join(ROOT, 'scripts/assets/mullion-wordmark.svg'), 'utf8')
const WM_INNER = (wmRaw.match(/<g fill="currentColor">([\s\S]*)<\/g>/) || [, ''])[1].trim()
const WM_VIEW = (wmRaw.match(/viewBox="([^"]+)"/) || [, '0 0 4000 916'])[1]
const [, , WM_W, WM_H] = WM_VIEW.split(' ').map(Number)
const WM_BASE = 713.43

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`

const wm = (fill) => `<g fill="${fill}">${WM_INNER.replace(/fill="currentColor"/g, '')}</g>`

const LOCK_S = 0.0316 // cap height ≈ 22.5 units inside a 64-unit lockup
const LOCK_X = 62
const LOCK_BASE = 50
const LOCK_W = Math.round(LOCK_X + WM_W * LOCK_S)

const lockup = (markFill, wmFill, stacked = false) => {
  if (stacked) {
    const s = LOCK_S
    const w = WM_W * s
    const x = Math.round((204 - w) / 2)
    const base = 108
    return svg(
      '0 0 204 118',
      `<g transform="translate(71 2)" fill="${markFill}">${markPath}</g>` +
        `<g transform="translate(${x} ${(base - WM_BASE * s).toFixed(2)}) scale(${s})">${wm(wmFill)}</g>`,
      'Mullion lockup, stacked',
      204,
      118
    )
  }
  return svg(
    `0 0 ${LOCK_W} 64`,
    `<g transform="translate(0 9) scale(0.71875)" fill="${markFill}">${markPath}</g>` +
      `<g transform="translate(${LOCK_X} ${(LOCK_BASE - WM_BASE * LOCK_S).toFixed(2)}) scale(${LOCK_S})">${wm(wmFill)}</g>`,
    'Mullion lockup',
    LOCK_W,
    64
  )
}

await rm(path.join(BRAND, 'cast'), { recursive: true, force: true })
await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })

const write = (rel, content) => writeFile(path.join(ROOT, rel), content)
const P = `public/brand/${SLUG}`

await write(`${P}/mark.svg`, svg('0 0 64 64', `<g fill="${INK}">${markPath}</g>`, 'Mullion mark', 64, 64))
await write(`${P}/mark-reverse.svg`, svg('0 0 64 64', `<g fill="${HAZE}">${markPath}</g>`, 'Mullion mark, reverse', 64, 64))
await write(`${P}/mark-compact.svg`, svg('0 0 64 64', `<g fill="${INK}">${compactPath}</g>`, 'Mullion compact mark', 64, 64))
await write(`${P}/mark-compact-reverse.svg`, svg('0 0 64 64', `<g fill="${HAZE}">${compactPath}</g>`, 'Mullion compact mark, reverse', 64, 64))
await write(`${P}/glyph.svg`, svg('0 0 64 64', `<g fill="${INK}">${glyphPath}</g>`, 'Mullion glyph', 64, 64))
await write(
  `${P}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" fill="${INK}"/><g fill="${GLOW}">${markPath}</g>`, 'Mullion app icon', 64, 64)
)

await write(`${P}/lockup.svg`, lockup(INK, INK))
await write(`${P}/lockup-reverse.svg`, lockup(HAZE, HAZE))
await write(`${P}/lockup-stacked.svg`, lockup(INK, INK, true))
await write(`${P}/wordmark.svg`, svg(WM_VIEW, wm(INK), 'Mullion wordmark', 300, Math.round((300 * WM_H) / WM_W)))
await write(`${P}/wordmark-reverse.svg`, svg(WM_VIEW, wm(HAZE), 'Mullion wordmark, reverse', 300, Math.round((300 * WM_H) / WM_W)))

for (const [id, body] of Object.entries(cast)) {
  await write(`${P}/cast/${id}.svg`, svg('0 0 64 64', `<g fill="${INK}">${body}</g>`, `Mullion cast mark: ${id}`, 64, 64))
}

/* ── 04 · colour ──────────────────────────────────────────────────────────── */
const PRIMITIVES = [
  { name: 'sky', value: '#DEE1E6', oklch: 'oklch(0.899 0.006 255)', role: 'The hazy sky — the day ground, sampled from the hero' },
  { name: 'haze', value: '#F4F6F9', oklch: 'oklch(0.972 0.004 247)', role: 'Light bloom behind a pane' },
  { name: 'veil', value: '#FFFFFF', oklch: 'oklch(1 0 0)', role: 'The pane itself — always translucent' },
  { name: 'mist', value: '#C9D4DF', oklch: 'oklch(0.860 0.015 246)', role: 'The blue in the glass — fill only' },
  { name: 'steel', value: '#7C8B9C', oklch: 'oklch(0.632 0.020 250)', role: 'The mullion frame — rules and graphic marks' },
  { name: 'slate', value: '#4B5866', oklch: 'oklch(0.456 0.019 250)', role: 'Secondary text, captions' },
  { name: 'ink', value: '#0E1620', oklch: 'oklch(0.197 0.014 250)', role: 'Type on glass — never pure black' },
  { name: 'bus', value: '#B01B26', oklch: 'oklch(0.452 0.176 27)', role: 'The bus — the one accent, and the only warm object in the photographs' },
  { name: 'flare', value: '#E23B3B', oklch: 'oklch(0.596 0.190 27)', role: 'The lit panel of the bus — fill only' },
  { name: 'glow', value: '#A8CDEA', oklch: 'oklch(0.828 0.055 245)', role: 'Specular edge on glass, and the signal at night' },
  { name: 'deep', value: '#08101A', oklch: 'oklch(0.170 0.015 250)', role: 'The city after dark — night ground' },
  { name: 'deep-plate', value: '#111C28', oklch: 'oklch(0.238 0.019 250)', role: 'A pane against the night ground' },
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
  ['ink', 'sky', 'Body and headings on the sky ground', 'text'],
  ['ink', 'haze', 'Type on the light bloom', 'text'],
  ['slate', 'sky', 'Captions, notes, figure labels', 'text'],
  ['bus', 'sky', 'The bus red as a link on the day ground', 'text'],
  ['bus', 'haze', 'The signal on a bright pane', 'text'],
  ['ink', 'glow', 'Ink on the specular edge — the pressed control', 'text'],
  ['haze', 'deep', 'Reverse type on the night ground', 'text'],
  ['glow', 'deep', 'Night signal — the glass edge as text', 'text'],
  ['glow', 'deep-plate', 'Type on a night pane', 'text'],
  ['steel', 'sky', 'The mullion frame against the sky', 'text'],
  ['veil', 'sky', 'The pane edge on the day ground', 'graphic'],
  ['mist', 'sky', 'The blue in the glass', 'graphic'],
  ['flare', 'sky', 'The lit bus panel', 'graphic'],
  ['bus', 'deep', 'The bus red at night', 'graphic'],
  ['deep-plate', 'deep', 'A pane lifted off the night ground', 'graphic'],
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
    name: 'Mullion',
    version: 'V1.0',
    track: 'WORKSPACE',
    primaryAccent: 'bus',
    essence: 'The city, one floor up.',
    promise:
      'Whole floors in glass towers, handed over fitted. A hazy sky behind a translucent pane, real 26px backdrop blur, a 22px squircle, and one red sampled off the bus in the second photograph.',
    case: '22',
  },
  primitives: PRIMITIVES,
  contrast,
}

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')

/* ── 05 · the three token layers ──────────────────────────────────────────── */
const prim = PRIMITIVES.map((p) => `  --ml-${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const css = `/* Mullion — case 22. Surface: Glass & light.
   Layer 1 primitives never flip. Layer 2 is the scope. A pane is always a real
   translucent fill + backdrop blur over a lit field; never an opaque card. */
.ml-scope {
${prim}

  /* 2 · semantic scope — glass over daylight is the default */
  --ml-surface-page: var(--ml-sky);
  --ml-surface-plate: var(--ml-haze);
  --ml-surface-invert: var(--ml-deep);
  --ml-text-primary: var(--ml-ink);
  --ml-text-secondary: var(--ml-slate);
  --ml-text-invert: var(--ml-haze);
  --ml-signal: var(--ml-bus);

  /* glass — the material, expressed once */
  --ml-glass-fill: color-mix(in srgb, var(--ml-veil) 16%, transparent);
  --ml-glass-fill-strong: color-mix(in srgb, var(--ml-veil) 34%, transparent);
  --ml-glass-edge: color-mix(in srgb, var(--ml-veil) 62%, transparent);
  --ml-glass-rim: color-mix(in srgb, var(--ml-ink) 9%, transparent);
  --ml-glass-blur: blur(26px) saturate(1.8);
  --ml-glass-sheen: linear-gradient(122deg, color-mix(in srgb, var(--ml-veil) 26%, transparent) 0%, transparent 46%);
  --ml-glass-shadow: 0 1px 0 0 var(--ml-glass-edge) inset, 0 26px 60px -34px color-mix(in srgb, var(--ml-ink) 40%, transparent);

  --ml-line-strong: color-mix(in srgb, var(--ml-ink) 24%, transparent);
  --ml-line-subtle: color-mix(in srgb, var(--ml-ink) 10%, transparent);

  /* 3 · component tokens — the only layer that knows a recipe */
  --ml-btn-bg: var(--ml-ink);
  --ml-btn-text: var(--ml-haze);
  --ml-btn-bg-hover: var(--ml-signal);
  --ml-chip-border: var(--ml-glass-rim);
  --ml-field-bg: color-mix(in srgb, var(--ml-veil) 52%, transparent);
  --ml-field-border: color-mix(in srgb, var(--ml-ink) 20%, transparent);

  /* type — a neutral sans for display and reading, mono for anything counted */
  --ml-font-display: 'Sora', system-ui, sans-serif;
  --ml-font-reading: 'Schibsted Grotesk', system-ui, sans-serif;
  --ml-font-mono: 'Geist Mono', ui-monospace, monospace;

  /* physics — light settles, it does not snap */
  --ml-radius: 22px;
  --ml-radius-sm: 12px;
  --ml-hair: 1px;
  --ml-seam: 16px;
  --ml-ease: cubic-bezier(0.16, 0.84, 0.44, 1);
  --ml-dur: 260ms;
  --ml-wrap: 1280px;
  --ml-gutter: clamp(20px, 4vw, 56px);
}

/* night scope — the same glass over the city after dark, same primitives */
.ml-scope[data-ml-theme='night'] {
  --ml-surface-page: var(--ml-deep);
  --ml-surface-plate: var(--ml-deep-plate);
  --ml-surface-invert: var(--ml-haze);
  --ml-text-primary: var(--ml-haze);
  --ml-text-secondary: color-mix(in srgb, var(--ml-haze) 62%, var(--ml-deep));
  --ml-text-invert: var(--ml-ink);
  --ml-signal: var(--ml-glow); /* the bus red is 2.6:1 on deep — light replaces it */
  --ml-glass-fill: color-mix(in srgb, var(--ml-veil) 7%, transparent);
  --ml-glass-fill-strong: color-mix(in srgb, var(--ml-veil) 13%, transparent);
  --ml-glass-edge: color-mix(in srgb, var(--ml-veil) 26%, transparent);
  --ml-glass-rim: color-mix(in srgb, var(--ml-veil) 20%, transparent);
  --ml-glass-sheen: linear-gradient(122deg, color-mix(in srgb, var(--ml-veil) 12%, transparent) 0%, transparent 46%);
  --ml-glass-shadow: 0 1px 0 0 var(--ml-glass-edge) inset, 0 26px 70px -30px rgba(0, 0, 0, 0.72);
  --ml-line-strong: color-mix(in srgb, var(--ml-haze) 26%, transparent);
  --ml-line-subtle: color-mix(in srgb, var(--ml-haze) 11%, transparent);
  --ml-btn-bg: var(--ml-haze);
  --ml-btn-text: var(--ml-deep);
  --ml-btn-bg-hover: var(--ml-glow);
  --ml-field-bg: color-mix(in srgb, var(--ml-veil) 6%, transparent);
  --ml-field-border: color-mix(in srgb, var(--ml-haze) 24%, transparent);
}
`
await write(`src/features/${SLUG}/mullion-tokens.css`, css)

/* ── 06 · inline path data for the page ───────────────────────────────────── */
await write(
  `src/features/${SLUG}/mullion-data.ts`,
  `// Generated by scripts/build-mullion.mjs — do not hand-edit.\n` +
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
)

console.log(`mullion: ${PRIMITIVES.length} primitives · ${contrast.filter((c) => c.pass).length} pass · ${contrast.filter((c) => !c.pass).length} fail`)
console.log(contrast.filter((c) => !c.pass).map((c) => `${c.a} on ${c.b} = ${c.ratio}:1`).join('\n'))
