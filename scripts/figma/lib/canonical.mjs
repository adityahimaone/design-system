/**
 * canonical.mjs — the single source of truth for the Figma handoff v2 spec.
 *
 * The brainstorm on `test ds 3.fig` found that the HTML page and the replay
 * plugin were measuring and describing two different design systems:
 *
 *   - the page captured the live browser window (2504px in Canvas Grid mode),
 *     while the headless extractor used a fixed 1440px viewport;
 *   - Canvas Grid equalised row heights, so logo/overlays arrived 350–2300px tall;
 *   - Mullion's tokens.json has only meta/primitives/contrast, so the embedded
 *     token payload shipped 12 colours and ZERO type/space/radius roles;
 *   - components were created but never had styles, variants, instances or
 *     descriptions, and re-running duplicated whole collections.
 *
 * This module builds the complete system description in Node (where tokens.json,
 * CSS, scales and the generator's own constants are all available), and defines
 * the manifest envelope both emitters sign. `CHECKSUM_JS` is injected verbatim
 * into the browser page so the browser and Node compute the same checksum —
 * there is no second copy of the algorithm to drift.
 *
 *   buildSystemSpec(...) → system      (colours · type · space · radius ·
 *                                      effects · fonts · components · sheets)
 *   finalizeManifest(m) → m           (dsId + capture.checksum)
 *   readSystem(m)       → system      (v2 first, v1 token payload fallback)
 */
import { readFileSync } from 'node:fs'

export const SPEC_VERSION = 2
export const GENERATOR_VERSION = '5.0.0'
export const CAPTURE_VIEWPORT = 1440
export const CAPTURE_MODE = 'canonical-v2'
export const MANIFEST_KIND = 'sunnyside/figma-manifest'

/** The canonical 8 sheets. Sheet 08 is always in the spec and always captured,
 *  but the plugin keeps it optional (the user's explicit constraint). */
export const SHEET_INDEX = [
  { index: 1, name: 'colors', label: 'section-colors', title: 'Colour System', optional: false },
  { index: 2, name: 'primitives', label: 'section-primitives', title: 'Primitives', optional: false },
  { index: 3, name: 'typography', label: 'section-typography', title: 'Typography', optional: false },
  { index: 4, name: 'logo', label: 'section-logo', title: 'Logo & Identity', optional: false },
  { index: 5, name: 'assets', label: 'section-assets', title: 'Cast & Assets', optional: false },
  { index: 6, name: 'components', label: 'section-components', title: 'Core Components', optional: false },
  { index: 7, name: 'overlays', label: 'section-overlays', title: 'Modals & Overlays', optional: false },
  { index: 8, name: 'patterns', label: 'section-patterns', title: 'Patterns & Tokens', optional: true },
]

export function makeDsId(slug, version) {
  return `${String(slug || 'brand').toLowerCase()}@${String(version || 'v1.0').replace(/^v/i, '')}`
}

/** FNV-1a / 32-bit, hex. Deliberately tiny so the browser copy is identical. */
export function checksum(str) {
  let h = 0x811c9dc5
  const s = String(str ?? '')
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0
  return ('00000000' + h.toString(16)).slice(-8)
}

/** Injected into the generated sheet. Keep in lockstep with `checksum()` above. */
export const CHECKSUM_JS = String.raw`
    function figmaChecksum(str) {
      var h = 0x811c9dc5;
      var s = String(str == null ? '' : str);
      for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
      return ('00000000' + h.toString(16)).slice(-8);
    }
`

/** The signed payload. Excludes `source` (a file:// URL that differs per machine)
 *  and `checksum` itself, so two captures of the same system are byte-identical. */
export function captureInput(m) {
  return JSON.stringify({
    dsId: m.dsId,
    version: m.version,
    viewport: m.capture?.viewport,
    sheets: m.capture?.sheets,
    mode: m.capture?.mode,
    generator: m.capture?.generator,
    system: m.system,
    tokens: m.tokens,
    sheetsTree: m.sheets,
    nodes: m.nodes,
  })
}

export function finalizeManifest(m) {
  m.version = m.version || SPEC_VERSION
  m.kind = MANIFEST_KIND
  if (!m.dsId) m.dsId = makeDsId(m.slug, m.system?.version || m.tokens?.version)
  m.capture = m.capture || {}
  m.capture.viewport = m.capture.viewport || CAPTURE_VIEWPORT
  m.capture.sheets = m.capture.sheets ?? (Array.isArray(m.sheets) ? m.sheets.length : 0)
  m.capture.mode = m.capture.mode || CAPTURE_MODE
  m.capture.generator = m.capture.generator || GENERATOR_VERSION
  m.capture.checksum = checksum(captureInput(m))
  return m
}

/** v2 manifests carry `system`. Old sheets carry the smaller `tokens` payload;
 *  upgrade that shape in place so the plugin treats both identically. */
export function readSystem(manifest) {
  if (manifest?.system && Array.isArray(manifest.system.colours)) return manifest.system
  const t = manifest?.tokens || {}
  const colours = (t.palette || []).map((p) => ({
    name: p.name, hex: p.hex, token: p.name, role: 'Primitive', group: 'Primitive',
  }))
  return {
    version: t.version || 'v1.0',
    brand: t.brand || manifest?.brand || 'Brand',
    slug: t.slug || manifest?.slug || '',
    namespace: t.namespace || '',
    fonts: null,
    colours,
    scales: [],
    type: (t.type || []).map((r) => ({ ...r, role: r.name })),
    space: t.space || [],
    radius: t.radius || [],
    effects: [],
    components: [],
    sheets: SHEET_INDEX,
  }
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const norm = (s) => (typeof s === 'string' ? s.trim().toUpperCase() : '')
const px = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? `${n}px` : null
}

/** Build the full system from everything the generator knows — not just the
 *  fields that happen to exist in a given tokens.json. */
export function buildSystemSpec({
  slug, brandName, version, ns, fonts,
  primitives = [], scales = {}, parsed = {}, cssText = '',
  houseRadius = '8px', spacingTokens = [], primaryHex = '#2960EC',
  primaryTint = '#EEF2FF', secondaryTint = '#F5F0FF', tertiaryTint = '#ECFDF5',
}) {
  const colours = []
  const seen = new Set()
  const addColour = (name, hex, token, role, group) => {
    const H = norm(hex)
    if (!HEX.test(H) || seen.has(`${group}/${name}`)) return
    seen.add(`${group}/${name}`)
    colours.push({ name: String(name), hex: H, token: token || `--${ns}-${name}`, role, group })
  }

  for (const p of primitives) addColour(p.name, p.hex, p.token, p.role || 'Brand primitive', 'Primitive')
  for (const [group, list] of Object.entries(scales)) {
    for (const s of list || []) addColour(s.name, s.hex, `--${ns}-${s.name}`, `${group} ramp`, 'Scale')
  }

  /* The sheet renders these literal surfaces regardless of what tokens.json
   * contains. Declaring them is what takes a Mullion-style kit from 12 palette
   * variables to a library that actually binds the layers it draws. */
  const darkest = [...primitives].sort((a, b) => (a.lum ?? 1) - (b.lum ?? 1))[0]?.hex || '#111827'
  const semantic = {
    'surface-page': '#FFFFFF',
    'surface-raised': '#FFFFFF',
    'surface-banner': '#FAFAFA',
    'surface-subtle': '#F8FAFC',
    'surface-tint': primaryTint,
    'text-main': '#111827',
    'text-secondary': '#64748B',
    'text-muted': '#94A3B8',
    'line-strong': '#CBD5E1',
    'border-default': '#E2E8F0',
    'border-subtle': '#F1F5F9',
    'ink-deep': darkest,
    signal: primaryHex,
    'signal-tint': primaryTint,
    'secondary-tint': secondaryTint,
    'tertiary-tint': tertiaryTint,
    danger: '#E11D48',
    'danger-surface': '#FFF1F2',
    'danger-line': '#FECDD3',
    'danger-ink': '#9F1239',
    success: '#18B368',
    'success-surface': '#F0FFF4',
    warning: '#B45309',
    'warning-surface': '#FFFBEB',
  }
  for (const [name, hex] of Object.entries(semantic)) {
    addColour(`semantic-${name}`, hex, `--${ns}-${name}`, `Semantic · ${name}`, 'Semantic')
  }

  /* CSS custom properties from the real token stylesheet, when present. */
  const byToken = new Map(colours.map((c) => [c.token.toLowerCase(), c.hex]))
  const cssRe = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi
  let m
  while ((m = cssRe.exec(cssText || '')) !== null) {
    const name = m[1]
    let value = m[2].trim()
    const ref = /var\(\s*--([a-z0-9-]+)/i.exec(value)
    if (ref) value = byToken.get(`--${ref[1]}`.toLowerCase()) || ''
    const H = norm(value)
    if (HEX.test(H)) {
      addColour(`css-${name}`, H, `--${name}`, `CSS token · ${name}`, 'Semantic')
      /* A later declaration may reference this one through var(). Keep the
       * lookup live so aliases resolve to the same hex. */
      byToken.set(`--${name}`.toLowerCase(), H)
    }
  }

  /* Type roles. tokens.json rarely carries them; the sheet does. */
  const type = []
  const typeSeen = new Set()
  const addType = (t) => {
    const size = Number(t.size)
    if (!Number.isFinite(size) || size <= 0 || typeSeen.has(t.name)) return
    typeSeen.add(t.name)
    type.push({
      name: t.name,
      family: t.family || fonts.reading,
      size,
      leading: t.leading ?? null,
      tracking: t.tracking ?? null,
      weight: t.weight ?? 400,
      role: t.role || t.name,
    })
  }
  for (const t of parsed.type || []) {
    addType({ name: t.name, family: t.family, size: t.size, leading: t.leading, tracking: t.tracking, weight: t.weight, role: t.use || t.name })
  }
  const canonicalType = [
    { name: 'Display XL', family: fonts.display, size: 42, leading: 1.05, tracking: -0.03, weight: 700, role: 'Hero headline' },
    { name: 'Heading H1', family: fonts.display, size: 26, leading: 34, tracking: -0.02, weight: 700, role: 'Sheet title' },
    { name: 'Heading H2', family: fonts.display, size: 24, leading: 32, tracking: -0.02, weight: 700, role: 'Section group' },
    { name: 'Heading H3', family: fonts.display, size: 17, leading: 24, weight: 600, role: 'Card heading' },
    { name: 'Body Regular', family: fonts.reading, size: 16, leading: 1.6, weight: 400, role: 'Reading copy' },
    { name: 'Body Small', family: fonts.reading, size: 14, leading: 1.5, weight: 400, role: 'Secondary copy' },
    { name: 'Label', family: fonts.reading, size: 13, leading: 1.5, weight: 400, role: 'Metadata / captions' },
    { name: 'Token Label', family: fonts.mono, size: 13, leading: 1.5, weight: 400, role: 'Tokens / tabular' },
    { name: 'Caption', family: fonts.reading, size: 12, leading: 1.5, weight: 400, role: 'Fine print' },
    { name: 'Micro', family: fonts.reading, size: 11, leading: 1.4, weight: 400, role: 'Overline' },
  ]
  for (const t of canonicalType) addType(t)

  const space = (parsed.space || []).length
    ? (parsed.space || []).map((s) => ({ name: s.name, value: px(s.value) || s.value }))
    : (spacingTokens || []).map((s) => ({ name: s.name, value: s.px }))
  if (!space.length) space.push({ name: 'space-4', value: '16px' })

  const radius = (parsed.radius || []).length
    ? (parsed.radius || []).map((r) => ({ name: r.name, value: px(r.value) || r.value }))
    : [
        { name: 'radius-sm', value: '4px' },
        { name: 'radius-md', value: px(houseRadius) || '8px' },
        { name: 'radius-lg', value: '16px' },
        { name: 'radius-pill', value: '9999px' },
      ]

  const effects = [
    { name: 'Elevation / sm', shadow: '0 4px 8px -2px rgba(16,24,40,0.08)' },
    { name: 'Elevation / lg', shadow: '0 12px 24px -4px rgba(16,24,40,0.12)' },
    { name: 'Elevation / xl', shadow: '0 24px 48px -12px rgba(16,24,40,0.18)' },
  ]

  const components = [
    { name: 'Button', description: 'Primary action hierarchy for the brand kit.', variants: ['State=Primary', 'State=Secondary', 'State=Tertiary', 'State=Subtle', 'State=Outline', 'State=Destructive'] },
    { name: 'Badge', description: 'Status pills used in ledgers and release notes.', variants: ['Tone=Brand', 'Tone=Secondary', 'Tone=Success', 'Tone=Warning', 'Tone=Danger'] },
    { name: 'Input', description: 'Text field with default / focus / error states.', variants: ['State=Default', 'State=Focused', 'State=Error'] },
    { name: 'Modal', description: 'Dialog surfaces: form publish and destructive confirm.', variants: ['Intent=Publish', 'Intent=Destructive'] },
    { name: 'Cast Mark', description: 'Six companion marks on the 64×64 Kuwayama grid.', variants: [], page: 5 },
    { name: 'System Icon', description: 'Eight 24×24 keyline UI icons, 1.75px stroke.', variants: [], page: 5 },
    { name: 'Spot Illustration', description: 'Empty and status state illustrations.', variants: [], page: 5 },
  ]

  return {
    version,
    dsId: makeDsId(slug, version),
    brand: brandName,
    slug,
    namespace: ns,
    fonts: { display: fonts.display, reading: fonts.reading, mono: fonts.mono },
    colours,
    scales: Object.fromEntries(Object.entries(scales).map(([k, v]) => [k, (v || []).map((s) => s.name)])),
    type,
    space,
    radius,
    effects,
    grid: { columns: 12, gutter: 24, maxWidth: 1160, margin: 64 },
    components,
    sheets: SHEET_INDEX,
  }
}

/** Convenience for tests / tooling: read a manifest JSON from disk. */
export function readManifest(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}
