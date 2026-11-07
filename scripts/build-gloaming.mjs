#!/usr/bin/env node
/**
 * build-gloaming.mjs — the Gloaming brand kit in one pass.
 *
 * Surface #19 · Liquid glass, read over a blue-hour rangeland plate.
 * Case 25. Dual scope (day default, night secondary) over shared primitives.
 * One declarative source: brand/gloaming.brand.json.
 *
 * Writes:
 *   public/brand/gloaming/{mark*,glyph,icon,lockup*,wordmark*,cast/*,anatomy-sheet}.svg
 *   src/features/gloaming/{tokens.json,gloaming-tokens.css,gloaming-data.ts,DESIGN.md}
 *
 *   node scripts/build-gloaming.mjs
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SPEC = JSON.parse(await readFile(path.join(ROOT, 'brand/gloaming.brand.json'), 'utf8'))
const PROVENANCE = JSON.parse(
  await readFile(path.join(ROOT, 'public/brand/gloaming/plate-source.json'), 'utf8')
)
const SLUG = SPEC.slug
const BRAND = path.join(ROOT, 'public/brand', SLUG)
const FEAT = path.join(ROOT, 'src/features', SLUG)
const P = `public/brand/${SLUG}`

const META = SPEC.synthesis
const NS = '--gl-'
const hex = (name) => SPEC.primitives.find((p) => p.name === name).value
const INK = hex('ink')
const OAT = hex('oat')
const ZENITH = hex('zenith')
const APRICOT = hex('apricot')

/* ── 01 · colour maths ──────────────────────────────────────────────────────── */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h) => {
  const [r, g, b] = rgb(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrastRatio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return Number(((x + 0.05) / (y + 0.05)).toFixed(2))
}
const hexToOklch = (h) => {
  const [r, g, b] = rgb(h).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return `oklch(${L.toFixed(3)} ${Math.sqrt(A * A + B * B).toFixed(3)} ${H.toFixed(1)})`
}
const oklab = (h) => {
  const [r, g, b] = rgb(h).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
const deltaOk = (a, b) => {
  const [x, y, z] = oklab(a)
  const [u, v, w] = oklab(b)
  return Math.hypot(x - u, y - v, z - w)
}
/** Brettel / Viénot deuteranope + protanope simulation in Smith-Pokorny LMS,
 *  then back to sRGB. Tritanopia is deliberately not approximated: the common
 *  single-matrix shortcut clips to magenta and would report a false result. */
const cvd = (h, kind) => {
  const [r, g, b] = rgb(h).map(lin)
  let L = 17.8824 * r + 43.5161 * g + 4.11935 * b
  let M = 3.45565 * r + 27.1554 * g + 3.86714 * b
  let S = 0.0299566 * r + 0.184309 * g + 1.46709 * b
  const l0 = L, m0 = M, s0 = S
  if (kind === 'protanopia') L = 2.02344 * m0 - 2.52581 * s0
  if (kind === 'deuteranopia') M = 0.494207 * l0 + 1.24827 * s0
  const out = [
    0.0809444479 * L - 0.130504409 * M + 0.116721066 * S,
    -0.0102485335 * L + 0.0540193266 * M - 0.113614708 * S,
    -0.000365296938 * L - 0.00412161469 * M + 0.693511405 * S,
  ].map((v) => Math.max(0, Math.min(1, v)))
  const enc = (v) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
  return `#${out.map(enc).map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

const CWD_THRESHOLD = 0.045
const CVD_PAIRS = [
  ['apricot', 'lupine'],
  ['apricot', 'ridge'],
  ['apricot', 'zenith'],
  ['lupine', 'ridge'],
  ['oak', 'ink'],
]
const cvdResults = CVD_PAIRS.flatMap(([a, b]) =>
  ['deuteranopia', 'protanopia'].map((kind) => ({
    pair: `${a} / ${b}`,
    kind,
    delta: Number(deltaOk(cvd(hex(a), kind), cvd(hex(b), kind)).toFixed(3)),
  }))
)
const cvdMin = Math.min(...cvdResults.map((r) => r.delta))
const cvdPass = cvdMin >= CWD_THRESHOLD

/* ── 02 · measured contrast ledger ─────────────────────────────────────────── */
const contrast = SPEC.contrastPairs.map(([a, b, note, kind]) => {
  const r = contrastRatio(hex(a), hex(b))
  const pass = kind === 'text' ? r >= 4.5 : r >= 3
  return {
    a, b, note, kind, ratio: r, pass,
    job: pass
      ? kind === 'text'
        ? 'Text at any size'
        : 'Rules, fills, graphic marks'
      : SPEC.restrictedJobs[`${a} on ${b}`] || 'Graphic only — never type',
  }
})
const fails = contrast.filter((c) => !c.pass)
const PRIMITIVES = SPEC.primitives.map((p) => ({ ...p, oklch: hexToOklch(p.value) }))

/* ── 03 · the mark family ──────────────────────────────────────────────────── */
const svgPath = (d) => `<path d="${d}"/>`
const MARK_PATH = svgPath(SPEC.mark.d)
const COMPACT_PATH = svgPath(SPEC.mark.compactD)
const GLYPH_PATH = svgPath(SPEC.mark.glyphD)

const svg = (viewBox, body, label, w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`
const markBody = (fill, d) => `<g fill="${fill}">${svgPath(d)}</g>`

/* Wordmark: a 5x7 cell alphabet, pure <path>, zero <text>. Two ownable cuts:
   a 7-unit horizon channel between rows 2 and 3, and a 2-unit lateral shift of
   everything above it — the same refraction step as the two hill panes. */
const GLYPHS = {
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
}
const CELL = 11, STEP = 15, X0 = 14, Y0 = 12, ADV = 87
const HORIZON_GAP = 7, REFRACTION = 2
const letters = [...SPEC.mark.wordmark]
const cells = []
letters.forEach((letter, li) => {
  GLYPHS[letter].forEach((row, r) => {
    ;[...row].forEach((bit, c) => {
      if (bit !== '1') return
      const x = X0 + li * ADV + c * STEP + (r <= 2 ? REFRACTION : 0)
      const y = Y0 + r * STEP + (r >= 3 ? HORIZON_GAP : 0)
      cells.push(`M${x} ${y}h${CELL}v${CELL}h-${CELL}z`)
    })
  })
})
const WM_PATH = `<path d="${cells.join(' ')}"/>`
const WM_VIEW = '0 0 712 134'
const [, , WM_W, WM_H] = WM_VIEW.split(' ').map(Number)
const wm = (fill) => `<g fill="${fill}">${WM_PATH}</g>`

const lockup = (fill, stacked = false) => {
  if (stacked) {
    return svg(
      '0 0 240 150',
      `<g transform="translate(91 4) scale(0.86)">${markBody(fill, SPEC.mark.d)}</g>` +
        `<g transform="translate(12 90) scale(0.30)">${wm(fill)}</g>`,
      'Gloaming lockup, stacked', 240, 150
    )
  }
  return svg(
    '0 0 268 64',
    `<g transform="translate(2 4) scale(0.86)">${markBody(fill, SPEC.mark.d)}</g>` +
      `<g transform="translate(64 15) scale(0.27)">${wm(fill)}</g>`,
    'Gloaming horizontal lockup', 268, 64
  )
}

/* ── 04 · dimensional anatomy sheet (Apple-style S# / H# / R# redline) ─────── */
const anatomy = () => {
  const mono = "font-family:'Martian Mono',ui-monospace,monospace"
  const disp = "font-family:'Gloock',Georgia,serif"
  const s = (x, y, t, size = 9, extra = '') =>
    `<text x="${x}" y="${y}" style="${mono}" font-size="${size}" fill="#1B2030" ${extra}>${t}</text>`
  const line = (x1, y1, x2, y2, dash = '') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1B2030" stroke-opacity=".42" stroke-width="1" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`
  const arrow = (x, y, dir = 'h') =>
    dir === 'h'
      ? `<path d="M${x - 4} ${y - 3}L${x} ${y}L${x - 4} ${y + 3}" fill="none" stroke="#1B2030" stroke-width="1"/><path d="M${x + 4} ${y - 3}L${x} ${y}L${x + 4} ${y + 3}" fill="none" stroke="#1B2030" stroke-width="1"/>`
      : ''
  const radii = [22, 18, 10].map((r, i) =>
    `<rect x="${60 + i * 14}" y="${150 + i * 14}" width="${400 - i * 28}" height="${286 - i * 28}" rx="${r}" fill="none" stroke="#1B2030" stroke-width="${i === 0 ? 1.6 : 1}" ${i ? 'stroke-dasharray="4 3"' : ''}/>`
  ).join('')
  const layers = [0, 1, 2, 3].map((i) => {
    const ox = 760 + i * 28, oy = 200 + i * 68
    const pts = `${ox},${oy} ${ox + 330},${oy} ${ox + 400},${oy + 52} ${ox + 70},${oy + 52}`
    return `<polygon points="${pts}" fill="${i === 3 ? '#E7E1D5' : '#F6F0E5'}" stroke="#1B2030" stroke-width="1.2"/>` +
      s(ox + 12, oy + 28, ['PLATE A · HAZY PHOTOGRAPH (one image, no stack)', 'PLATE B · 26px REFRACTING PANE + 1px INSET RIM', 'PLATE C · 1px MULLIONS + ONE LIT TOP EDGE', 'PLATE D · SOLID OAT READING PLATE'][i], 8)
  }).join('')
  const spacing =
    line(60, 536, 410, 536) +
    [8, 16, 24, 32, 48, 64].map((v, i) => {
      const x = 60 + i * 70
      return line(x, 520, x, 536) + s(x + 3, 552, `S${i + 1}`, 8) + s(x + 3, 566, `${v}`, 8)
    }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 980" width="1400" height="980" role="img" aria-label="Gloaming dimensional anatomy sheet: concentric radii, spacing chains, height chains and an exploded axonometric layer stack">
<rect width="1400" height="980" fill="#F6F0E5"/>
<rect x="24" y="24" width="1352" height="932" fill="none" stroke="#1B2030" stroke-opacity=".35"/>
${line(24, 96, 1376, 96)}
<text x="60" y="70" style="${disp}" font-size="34" fill="#1B2030">Dimensional anatomy · the reading pane</text>
${s(1060, 62, 'GLOAMING / SHEET 01', 10)}${s(1060, 80, 'CASE 25 · #19 LIQUID GLASS', 9)}
${s(60, 130, '01 / CONCENTRIC RADII — the corner is a closed chain, not three numbers', 10)}
${radii}
${line(60, 452, 460, 452, '3 3')}${s(60, 470, 'R1 = 22  R2 = R1 - 4 = 18  R3 = R2 - 8 = 10', 9)}
${s(60, 488, 'R_n = R_1 - sum(delta_1..delta_n) · every inner radius inherits its parent', 8)}
${s(60, 512, '02 / SPACING CHAIN — S_n = 8n, tabular, no optical adjustment', 10)}
${spacing}
${line(60, 574, 460, 574)}${s(60, 594, '03 / HEIGHT CHAIN', 10)}
${[44, 52, 60, 68, 76].map((y, i) => line(60, 610 + i * 22, 76, 610 + i * 22) + s(86, 614 + i * 22, `H${i + 1} = 48 + 8n = ${48 + 8 * (i + 1)}`, 8)).join('')}
${line(520, 120, 520, 940, '3 3')}
${s(560, 130, '04 / EXPLODED LAYER STACK — four plates, one light source', 10)}
${layers}
${line(830, 182, 1330, 182, '3 3')}${s(1090, 174, 'ONE SPECULAR TOP EDGE', 8)}
${s(560, 620, '05 / PHYSICS', 10)}
${['blur(pane) = 26px · saturate(1.25) · one value only', 'mullion = 1px · outset shadow · never a gap', 'rim = 1px inset at 9% ink', 'reading copy = solid oat plate · never on the pane', 'motion = 180ms cubic-bezier(.2,.7,.2,1)', 'measure = 64ch · display ≤ 2 lines at 390'].map((t, i) => s(560, 648 + i * 24, `· ${t}`, 9)).join('')}
${line(24, 830, 1376, 830)}
${s(60, 858, '06 / CLOSED-FORM LEDGER', 10)}
${s(60, 882, 'R_inner = R_outer - 4     S_n = 8n     H_row = 48 + 8n     pane = 26px     mullion = 1px     radius = 22px', 9)}
${s(60, 906, 'The pane never carries type. The plate never refracts. One horizon cut separates them.', 9)}
${s(60, 936, 'S1..S6  H1..H5  R1..R3  ·  monochrome redline  ·  Gloaming V1.0  ·  generated by scripts/build-gloaming.mjs', 8)}
${s(1120, 936, 'SHEET 01 / 01', 9)}
</svg>\n`
}

/* ── 05 · tokens.json ──────────────────────────────────────────────────────── */
const tokens = {
  meta: {
    slug: SLUG,
    name: SPEC.name,
    version: SPEC.version,
    track: META.track,
    primaryAccent: 'apricot',
    namespace: 'gl-',
    essence: META.essence,
    oneSentence: META.oneSentence,
    promise: META.promise,
    material: META.material,
    markForm: SPEC.mark.geometry,
    case: SPEC.case,
    surfaceContract: '#19 Liquid glass',
    rail: 'A · 176px per-section rail',
    hero: 'A · banner, then a number row · relation below',
    footer: 'F1 · bench echo',
    polarity: 'Dual · day default, night secondary, shared primitives',
    styleReason: META.styleReason,
    mechanism: META.mechanism,
    archetype: META.archetype,
    fonts: SPEC.fonts,
    assets: SPEC.assets,
    sourceAsset: META.sourceAsset,
    sampledStrips: PROVENANCE.strips.map((s) => ({ name: s.name, hex: s.hex })),
    lupine: PROVENANCE.lupine,
    cvd: { minDeltaOk: cvdMin, threshold: CWD_THRESHOLD, pass: cvdPass },
  },
  theme: {
    family: 'Kuwayama parametric vector discipline · 64-unit grid',
    material: 'one hazy blue-hour plate + a 26px refracting pane + solid oat reading plates',
    edge: '22px squircle outer / 18px inner / 10px control, concentric R_inner = R_outer - 4',
    offset: 'one lit 1px top edge · no drop shadow at rest',
    stroke: 'zero line icons; pure filled vectors',
    tile: 'five adjacent oat number cells divided by 1px mullions, never a gap',
    radius: '22px',
    ring: '1px inset rim at 9% ink; 1px mullion at 18% white',
    density: 'editorial balanced · 64ch measure · 176px sticky rail',
    label: 'Martian Mono 10.5px tabular, uppercase only in rails and code sheets',
    'field-recipe': 'optical-glass + atmospheric-scrim + image-sampled lupine halftone',
    'mark-form': 'horizon bar with two refracted hill panes split by a 4-unit mullion',
  },
  type: [
    { name: 'font-display', value: "'Gloock', Georgia, serif", family: 'Gloock' },
    { name: 'font-reading', value: "'Hanken Grotesk', system-ui, sans-serif", family: 'Hanken Grotesk' },
    { name: 'font-mono', value: "'Martian Mono', ui-monospace, monospace", family: 'Martian Mono' },
  ],
  radius: { xs: '4px', sm: '8px', md: '10px', lg: '18px', xl: '22px', pill: '999px' },
  sections: ['idea', 'mark', 'colour', 'surfaces', 'type', 'kit', 'tokens'],
  primitives: PRIMITIVES,
  contrast,
  semantic: {
    scope: 'dual',
    surfacePage: 'bluehour',
    surfacePlate: 'oat',
    surfaceInvert: 'zenith',
    textPrimary: 'ink',
    textSecondary: 'oak',
    textInvert: 'oat',
    signal: 'apricot',
    lineStrong: 'ridge',
    lineSubtle: 'periwinkle',
    grid: 'oat',
    nightSurfacePage: 'zenith',
    nightSurfacePlate: 'oat',
    nightTextOnGlass: 'oat',
    nightPaneTint: 'periwinkle',
  },
  physics: {
    radiusPane: '22px', radiusInner: '18px', radiusControl: '10px',
    paneBlur: '26px', mullion: '1px', rim: '1px',
    duration: '180ms', ease: 'cubic-bezier(.2,.7,.2,1)',
    wrap: '1280px', rail: '176px', measure: '64ch',
  },
}

/* ── 06 · three-layer tokens CSS ───────────────────────────────────────────── */
const prim = PRIMITIVES.map((p) => `  ${NS}${p.name}: ${p.value}; /* ${p.oklch} */`).join('\n')
const tokensCss = `/* Gloaming — case 25. Surface: #19 Liquid glass over one blue-hour plate.
   Layer 1 primitives are sampled from the painting and NEVER flip.
   Layer 2 is one day scope plus one night scope over those same primitives.
   Layer 3 is purpose-first: the only layer that knows a control exists. */
.gl-scope {
${prim}

  /* 2 · semantic DAY scope — the sky still holds the warm horizon */
  ${NS}surface-page: var(${NS}bluehour);
  ${NS}surface-plate: var(${NS}oat);
  ${NS}surface-invert: var(${NS}zenith);
  ${NS}text-primary: var(${NS}ink);
  ${NS}text-secondary: color-mix(in oklab, var(${NS}ink) 72%, var(${NS}oat));
  ${NS}text-on-glass: var(${NS}oat);
  ${NS}signal: var(${NS}apricot);
  ${NS}line-strong: color-mix(in srgb, var(${NS}oat) 26%, transparent);
  ${NS}line-subtle: color-mix(in srgb, var(${NS}oat) 14%, transparent);
  ${NS}pane-bg: rgba(255, 255, 255, .16);
  ${NS}pane-rim: rgba(255, 255, 255, .42);
  ${NS}mullion: rgba(255, 255, 255, .18);
  ${NS}field-day: linear-gradient(180deg, ${hex('zenith')} 0%, ${hex('bluehour')} 25%, ${hex('periwinkle')} 48%, ${hex('mauve')} 61%, ${hex('apricot')} 76%, ${hex('hay')} 100%);

  /* 3 · component tokens — the only layer that knows a recipe */
  ${NS}btn-bg: var(${NS}apricot);
  ${NS}btn-text: var(${NS}ink);
  ${NS}field-bg: var(${NS}oat);
  ${NS}field-border: color-mix(in srgb, var(${NS}ink) 22%, transparent);
  ${NS}row-active: color-mix(in srgb, var(${NS}apricot) 30%, transparent);
  ${NS}status-shape: 6px;

  /* type aliases */
  ${NS}font-display: 'Gloock', 'Times New Roman', serif;
  ${NS}font-reading: 'Hanken Grotesk', system-ui, sans-serif;
  ${NS}font-mono: 'Martian Mono', ui-monospace, monospace;
  --font-gloock: 'Gloock', 'Times New Roman', serif;
  --font-hanken-grotesk: 'Hanken Grotesk', system-ui, sans-serif;
  --font-martian-mono: 'Martian Mono', ui-monospace, monospace;

  /* physics */
  ${NS}radius-pane: 22px;
  ${NS}radius-inner: 18px;
  ${NS}radius-control: 10px;
  ${NS}pane-blur: 26px;
  ${NS}hair: 1px;
  ${NS}dur: 180ms;
  ${NS}ease: cubic-bezier(.2,.7,.2,1);
  ${NS}wrap: 1280px;
  ${NS}rail: 176px;
  ${NS}measure: 64ch;
  ${NS}gutter: clamp(20px, 4vw, 56px);
}

/* 2 · semantic NIGHT scope — the warm band has gone, the printed plate has not.
   Primitives stay put. Only the glass field, the pane tint and the rim change. */
.gl-scope[data-gl-scope='night'] {
  ${NS}surface-page: var(${NS}zenith);
  ${NS}surface-plate: var(${NS}oat);
  ${NS}text-primary: var(${NS}ink);
  ${NS}text-secondary: color-mix(in oklab, var(${NS}ink) 78%, var(${NS}oat));
  ${NS}text-on-glass: var(${NS}oat);
  ${NS}line-strong: color-mix(in srgb, var(${NS}oat) 34%, transparent);
  ${NS}line-subtle: color-mix(in srgb, var(${NS}oat) 18%, transparent);
  ${NS}pane-bg: rgba(255, 255, 255, .09);
  ${NS}pane-rim: rgba(255, 255, 255, .58);
  ${NS}mullion: rgba(255, 255, 255, .26);
  ${NS}field-day: linear-gradient(180deg, ${hex('ink')} 0%, ${hex('zenith')} 44%, ${hex('bluehour')} 72%, ${hex('oak')} 100%);
}
`

/* ── 07 · generated data module ────────────────────────────────────────────── */
const dataTs =
  `// Generated by scripts/build-gloaming.mjs — do not hand-edit.\n` +
  `export const MARK_PATH = ${JSON.stringify(MARK_PATH)}\n` +
  `export const COMPACT_PATH = ${JSON.stringify(COMPACT_PATH)}\n` +
  `export const GLYPH_PATH = ${JSON.stringify(GLYPH_PATH)}\n` +
  `export const WORDMARK_PATH = ${JSON.stringify(WM_PATH)}\n` +
  `export const WORDMARK_VIEWBOX = '${WM_VIEW}'\n` +
  `export type CastMark = { id: string; name: string; note: string; path: string }\n` +
  `export const CAST: readonly CastMark[] = [\n` +
  SPEC.cast.map((c) =>
    `  { id: ${JSON.stringify(c.id)}, name: ${JSON.stringify(c.name)}, note: ${JSON.stringify(c.note)}, path: ${JSON.stringify(svgPath(c.d))} },`
  ).join('\n') + `\n]\n`

/* ── 08 · DESIGN.md ────────────────────────────────────────────────────────── */
const stripTable = PROVENANCE.strips.map((s) => `| ${s.name} | \`${s.hex}\` |`).join('\n')
const design = [
  `# Gloaming — Case ${SPEC.case} · listed build`,
  '',
  `**3-Axis Synthesis:** Surface: *Optical glass* · Style: *#19 Liquid glass* · Rail: *A (176px per-section)* · Hero: *A · relation \`below\`* · Footer: *F1 · bench echo* · Physics: *22px squircle / 26px refraction / 1px mullions / 1px inset rim*.`,
  '',
  `**Mechanism:** ${META.mechanism}`,
  '',
  `**DNA:** Archetype: *${META.archetype}* · Mark: *horizon bar + two refracted hill panes + 6-cast* · Stack: *Gloock / Hanken Grotesk / Martian Mono* · Polarity: *Day + Night over shared primitives*.`,
  '',
  `**Essence.** ${META.essence}`,
  '',
  `**Promise.** ${META.promise}`,
  '',
  '## Why this surface',
  '',
  META.styleReason,
  '',
  '## One plate, nine derivatives',
  '',
  `The entire material library comes from one supplied painting, \`${META.sourceAsset}\`. \`scripts/build-gloaming-plates.py\` measures eleven horizontal strips, reduces the frame to fourteen dominant colours, samples ${PROVENANCE.lupine.sampleCount} violet pixels from the meadow, and derives:`,
  '',
  ...SPEC.assets.map((a) => `- \`${a}\``),
  '',
  `\`field-lupine.svg\` is not a crop: it is 1,760 dots whose colour, radius and opacity are each sampled from the corresponding point of the meadow. \`horizon-ramp.svg\` is the eleven measured strips as one gradient. \`plate-night.jpg\` is the same frame graded forty minutes later, not a second photograph.`,
  '',
  '| Measured strip | Hex |',
  '|---|---|',
  stripTable,
  '',
  '## The nine slots',
  '',
  `- \`ground\` ${hex('zenith')} → ${hex('hay')}, ONE measured gradient, never stacked`,
  `- \`plate\` ${hex('oat')} solid — every surface that carries type`,
  `- \`text\` ${hex('ink')} near-black, on solid plates only`,
  `- \`text2\` ink at 72% on oat`,
  `- \`rule\` 1px oat at 26% on glass; 1px ink at 22% on plates`,
  `- \`radius\` 22px pane / 18px inner / 10px control (concentric, R_inner = R_outer − 4)`,
  `- \`texture\` one 26px refracting pane with 1px mullions and one lit top edge`,
  `- \`type\` Gloock display / Hanken Grotesk reading / Martian Mono figures`,
  `- \`motion\` 180ms cubic-bezier(.2,.7,.2,1), one physical response`,
  '',
  '## Scope',
  '',
  'Q5 was **Light + dark**. Both scopes ship over the SAME twelve primitives: a day scope that keeps the warm apricot horizon, and a night scope that removes it. The printed oat plate does not change — a sheet of paper is still the same sheet after dark. The navbar toggle, the Night token sheet in Section 07 and the night audit rows are all present. The hero swaps `blue-hour.jpg` for `plate-night.jpg`.',
  '',
  '## Hero and footer',
  '',
  'Hero A, relation `below`: the full painting is a wide banner with a 1px mullion frame and one lit top edge. Five solid oat number cells overlap its bottom edge — adjacent, separated by 1px mullions, never by a gap — and the headline follows underneath. No eyebrow, no mono in the hero, no outlined chips, no styled accent word in the `<h1>`, one accent on the primary action only.',
  '',
  'Footer F1 · bench echo: the night plate sits above a mirrored five-cell bench, and the reverse lockup closes it. The footer image is never the hero image.',
  '',
  '## Mark and cast',
  '',
  SPEC.mark.geometry,
  '',
  'The 16px compact is a separate, heavier drawing with an 8-unit channel; the glyph is a third drawing for favicons. The outlined wordmark is a 5×7 cell alphabet with zero `<text>` elements and two ownable cuts: a 7-unit horizon channel between rows 2 and 3, and a 2-unit lateral shift of everything above it — the refraction step, carried from the mark into the letters.',
  '',
  `Cast nouns: ${SPEC.cast.map((c) => `\`${c.id}\``).join(', ')}. All on the 64-unit grid at one cut weight, drawn inside Section 02 under the scale strip, never above the footer.`,
  '',
  '## Honest contrast ledger',
  '',
  `${contrast.length} pairs computed from the same hex the CSS loads. ${fails.length} fail and are published rather than corrected:`,
  '',
  ...fails.map((c) => `- \`${c.a}\` on \`${c.b}\` = ${c.ratio}:1 — ${c.job}`),
  '',
  `The apricot accent is the one accent and appears on the primary action only. Oat on apricot is ${contrastRatio(OAT, APRICOT)}:1, so the button uses ink on apricot at ${contrastRatio(INK, APRICOT)}:1. The pane tint periwinkle on zenith is ${contrastRatio(hex('periwinkle'), ZENITH)}:1, which is why a 1px mullion always separates it and type never sits on it.`,
  '',
  '## CVD safety gate',
  '',
  `Deuteranopia and protanopia were simulated across ${CVD_PAIRS.length} status/accent pairs with a Brettel/Viénot LMS transform and measured in Oklab. Minimum ΔE_OK = **${cvdMin.toFixed(3)}** against a threshold of ${CWD_THRESHOLD}: **${cvdPass ? 'PASS' : 'non-colour indicators required'}**. Tritanopia is not approximated — the common single-matrix shortcut clips to magenta and would report a false pass. Every status in the kit also ships a word and a shape, so no state is carried by colour alone.`,
  '',
  '## Dimensional anatomy',
  '',
  '`anatomy-sheet.svg` is the monochrome S#/H#/R# redline: concentric radii with the closed chain `R_inner = R_outer − 4`, spacing `S_n = 8n`, heights `H_row = 48 + 8n`, and a four-plate exploded axonometric stack (photograph → refracting pane → mullion → solid reading plate).',
  '',
  '## Audit & known gaps',
  '',
  '- Browser frame measurements were skipped because **Skip browser tests** was selected. The 1440 / 1024 / 390 widths and `scrollWidth === clientWidth` were not checked in a headless browser; the contrast and CVD values above are computed statically from hex.',
  '- **Export spec files** was not selected, so there is no separate export bundle. The page does ship `tokens.json`, `gloaming-tokens.css`, `DESIGN.md` and a generated Figma HTML sheet so the shelf link resolves.',
  '- `backdrop-filter` is scoped to panes and nav chrome only. If the platform disables it, the 1px rim and the solid oat plates keep every reading surface legible.',
  '- **Detach overlap (published, not corrected).** A detach check against eight sibling systems scores 91–75 for seven of them and 63/100 against Case 24 Setout: its hi-vis `#FF6B1A` and this plate\'s sampled apricot `#E2A38C` sit 2° apart in OKLCH hue. They differ in chroma (0.061 vs 0.113), in role (horizon light vs a safety vest) and in every material choice. The colour was kept because it was measured off the painting rather than chosen from a ramp; a hue-only heuristic cannot see that distinction.',
  '',
  '## Registration',
  '',
  'The page is a standalone static route at `/design-system/gloaming`. It is registered in `cases.ts` and `collections.ts` (Glass & light), appears on the landing shelf, the hero band and the Meniscus gallery, and ships generated 1200×900 / 560×420 thumbnails.',
].join('\n')

/* ── 09 · write everything ─────────────────────────────────────────────────── */
await rm(path.join(BRAND, 'cast'), { recursive: true, force: true })
await mkdir(path.join(BRAND, 'cast'), { recursive: true })
await mkdir(FEAT, { recursive: true })
const write = (rel, content) => writeFile(path.join(ROOT, rel), content, 'utf8')

await write(`${P}/mark.svg`, svg('0 0 64 64', markBody(INK, SPEC.mark.d), 'Gloaming mark', 64, 64))
await write(`${P}/mark-reverse.svg`, svg('0 0 64 64', markBody(OAT, SPEC.mark.d), 'Gloaming mark, reverse', 64, 64))
await write(`${P}/mark-compact.svg`, svg('0 0 64 64', markBody(INK, SPEC.mark.compactD), 'Gloaming compact mark', 64, 64))
await write(`${P}/mark-compact-reverse.svg`, svg('0 0 64 64', markBody(OAT, SPEC.mark.compactD), 'Gloaming compact mark, reverse', 64, 64))
await write(`${P}/glyph.svg`, svg('0 0 64 64', markBody(INK, SPEC.mark.glyphD), 'Gloaming glyph', 64, 64))
await write(
  `${P}/icon.svg`,
  svg('0 0 64 64', `<rect width="64" height="64" rx="14" fill="${ZENITH}"/>${markBody(OAT, SPEC.mark.compactD)}`, 'Gloaming app icon', 64, 64)
)
await write(`${P}/wordmark.svg`, svg(WM_VIEW, wm(INK), 'Gloaming wordmark', 420, Math.round((420 * WM_H) / WM_W)))
await write(`${P}/wordmark-reverse.svg`, svg(WM_VIEW, wm(OAT), 'Gloaming wordmark, reverse', 420, Math.round((420 * WM_H) / WM_W)))
await write(`${P}/lockup.svg`, lockup(INK))
await write(`${P}/lockup-reverse.svg`, lockup(OAT))
await write(`${P}/lockup-stacked.svg`, lockup(INK, true))
for (const c of SPEC.cast) {
  await write(`${P}/cast/${c.id}.svg`, svg('0 0 64 64', markBody(OAT, c.d), `Gloaming cast mark: ${c.name}`, 64, 64))
}
await write(`${P}/anatomy-sheet.svg`, anatomy())

await write(`src/features/${SLUG}/tokens.json`, JSON.stringify(tokens, null, 2) + '\n')
await write(`src/features/${SLUG}/gloaming-tokens.css`, tokensCss)
await write(`src/features/${SLUG}/gloaming-data.ts`, dataTs)
await write(`src/features/${SLUG}/DESIGN.md`, design + '\n')

console.log(`gloaming: ${PRIMITIVES.length} primitives · ${contrast.length} pairs · ${fails.length} published fails`)
console.log(fails.map((c) => `  FAIL  ${c.a} on ${c.b} = ${c.ratio}:1 — ${c.job}`).join('\n'))
console.log(`  CVD   min ΔE_OK ${cvdMin.toFixed(3)} / ${CWD_THRESHOLD} → ${cvdPass ? 'PASS' : 'NON-COLOUR INDICATORS REQUIRED'}`)
console.log(`  mark  ${cells.length} wordmark cells, ${SPEC.cast.length} cast marks, anatomy sheet written`)
