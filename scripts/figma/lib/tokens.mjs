/**
 * One reader for every tokens.json the repo has shipped.
 *
 * Five shapes exist, and each script used to guess for itself, which is how a gate came to be
 * blind to Hachure (`role`/`face`), skip Huginn, and never see Clearing. Read them here, once.
 *
 *   readTokens(path) → {
 *     path, shape, name, namespace, idea,
 *     primitives: [{ name, value, hex, role }],   hex is null for non-hex values (oklch, rgba…)
 *     contrast:   [{ label, fg, bg, ratio }],     accepts fg/bg, a/b, and `pair` as the label
 *     type:       [{ name, value, family, size, weight }],
 *     radius, space: [{ name, value }]            numbers become px
 *   }
 *   findTokens(root, slug) → path | null          features/<slug>/tokens.json, else
 *                                                 public/brand/<slug>/<slug>-tokens.json
 *
 * Detection is by key, never by case name. An unreadable shape returns shape "unknown" and empty
 * lists; callers decide whether that is a SKIP or a FAIL.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function findTokens(root, slug) {
  /* Next.js repos keep cases under `src/features/<slug>/`, and some Astro repos
   * ship the token file unprefixed at `public/brand/<slug>/tokens.json`. Both
   * were invisible to the first version of this lookup, which is why a
   * design-system repo with 25 cases resolved only 9 of them. */
  const candidates = [
    join(root, 'features', slug, 'tokens.json'),
    join(root, 'src', 'features', slug, 'tokens.json'),
    join(root, 'public', 'brand', slug, `${slug}-tokens.json`),
    join(root, 'public', 'brand', slug, 'tokens.json'),
    ...(slug === 'sunnyside' ? [join(root, 'features', 'design-system', 'tokens.json')] : []),
  ]
  return candidates.find(existsSync) ?? null
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const hexOf = (v) => (typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : null)
const GENERIC = /^(sans-serif|serif|monospace|system-ui|ui-[a-z-]+|-apple-system|var\(.*)$/i

/** "Bodoni Moda 400/500" → "Bodoni Moda"; "var(--font-sora), 'Sora', sans" → "Sora". */
export function familyOf(value) {
  const first = String(value ?? '')
    .split(',')
    .map((p) => p.replace(/['"]/g, '').replace(/\s+\d{3}(?:\/\d{3})*$/, '').trim())
    .find((p) => p && !GENERIC.test(p))
  return first ?? ''
}

function scale(x) {
  if (Array.isArray(x))
    return x
      .map((r, i) => (r && typeof r === 'object' ? { name: String(r.name ?? i + 1).replace(/^(radius|space)-/, ''), value: String(r.value ?? '') } : { name: String(i + 1), value: typeof r === 'number' ? `${r}px` : String(r) }))
      .filter((r) => r.value)
  if (x && typeof x === 'object') return Object.entries(x).map(([name, v]) => ({ name, value: typeof v === 'number' ? `${v}px` : String(v?.value ?? v) }))
  return []
}

function parseContrast(c, primitives) {
  if (Array.isArray(c)) {
    return c.map((p) => ({
      label: p.label ?? p.pair ?? p.text ?? '',
      fg: p.fg ?? p.a,
      bg: p.bg ?? p.b,
      ratio: typeof p.ratio === 'number' ? p.ratio : p.ratio ? Number(String(p.ratio).replace(',', '.').replace(/:1$/, '')) : null,
    }))
  }
  if (c && typeof c === 'object') {
    const out = []
    const byName = new Map(primitives.map((p) => [p.name.toLowerCase(), p.hex]))
    const resolveHex = (str) => {
      const m = String(str ?? '').match(/#[0-9a-f]{3,6}/i)
      if (m) return m[0]
      for (const [k, hex] of byName) if (hex && String(str).toLowerCase().includes(k)) return hex
      return null
    }
    for (const scope of ['light', 'dark']) {
      if (c[scope] && typeof c[scope] === 'object') {
        for (const [label, r] of Object.entries(c[scope])) {
          const ratio = Number(String(r).replace(/:1$/, ''))
          out.push({ label: `${label} (${scope})`, fg: null, bg: null, ratio: Number.isNaN(ratio) ? null : ratio })
        }
      }
    }
    if (c.failing && typeof c.failing === 'object') {
      const f = c.failing
      const fg = f.fg ?? f.a ?? resolveHex(f.pair)
      const bg = f.bg ?? f.b ?? (fg ? '#ffffff' : null)
      const ratio = typeof f.ratio === 'number' ? f.ratio : Number(String(f.ratio ?? '').replace(/:1$/, ''))
      out.push({ label: f.pair ?? f.label ?? 'failing', fg, bg, ratio: Number.isNaN(ratio) ? null : ratio })
    }
    return out
  }
  return []
}

export function readTokens(path) {
  const t = JSON.parse(readFileSync(path, 'utf8'))
  const meta = t.meta ?? t.$meta ?? {}

  let shape = 'unknown'
  let primitives = []
  if (Array.isArray(t.primitives)) {
    shape = 'primitives[]'
    primitives = t.primitives.map((p) => ({ name: String(p.name), value: p.value, hex: hexOf(p.hex) ?? hexOf(p.value), role: p.role ?? '' }))
  } else if (t.primitive && typeof t.primitive === 'object') {
    shape = 'primitive{}'
    primitives = Object.entries(t.primitive).map(([name, v]) => {
      const value = typeof v === 'string' ? v : v?.value
      return { name, value, hex: hexOf(v?.hex) ?? hexOf(value), role: v?.role ?? '' }
    })
  } else if (t.color && typeof t.color === 'object' && !Array.isArray(t.color)) {
    shape = 'color{}'
    primitives = Object.entries(t.color)
      .filter(([, v]) => typeof v === 'string')
      .map(([name, value]) => ({ name, value, hex: hexOf(value), role: '' }))
  }

  const contrast = parseContrast(t.contrast, primitives)

  let type = []
  if (Array.isArray(t.type))
    type = t.type.map((e) => ({ name: String(e.name ?? e.role ?? ''), value: String(e.value ?? e.face ?? ''), family: familyOf(e.value ?? e.face), size: e.size, leading: e.leading ?? e.line, tracking: e.tracking, weight: e.weight, use: e.use ?? e.role }))
  else if (t.type && typeof t.type === 'object') {
    const entries = t.type.family && typeof t.type.family === 'object' ? Object.entries(t.type.family) : Object.entries(t.type)
    type = entries
      .filter(([, v]) => typeof v === 'string')
      .map(([name, value]) => ({ name, value, family: familyOf(value) }))
  }

  const rawRadius = t.radius
  const radiusStr =
    rawRadius == null
      ? undefined
      : Array.isArray(rawRadius)
        ? String(rawRadius[Math.floor(rawRadius.length / 2)]?.value ?? rawRadius[0]?.value ?? '')
        : typeof rawRadius === 'object'
          ? `${rawRadius.md ?? rawRadius.sm ?? rawRadius.base ?? Object.values(rawRadius)[0]}`.replace(/^(?!.*(?:px|rem|em)$)(.+)$/, '$1px')
          : String(rawRadius)

  const theme = {
    family: t.theme?.family ?? meta.family ?? t.track ?? meta.track,
    material: t.theme?.material ?? meta.material ?? (typeof t.material === 'string' ? t.material : t.material?.idea),
    edge: t.theme?.edge,
    offset: t.theme?.offset,
    stroke: t.theme?.stroke,
    tile: t.theme?.tile,
    radius: t.theme?.radius ?? radiusStr,
    ring: t.theme?.ring,
    density: t.theme?.density,
    label: t.theme?.label,
    'field-recipe': t.theme?.['field-recipe'] ?? t.theme?.fieldRecipe,
    'mark-form': t.theme?.['mark-form'] ?? t.theme?.markForm ?? meta.markForm,
  }

  const rawNs = meta.namespace ?? t.namespace ?? ''
  return {
    path,
    shape,
    name: meta.name ?? t.name ?? '',
    namespace: rawNs ? String(rawNs).replace(/^-+|-+$/g, '') : '',
    idea: meta.idea ?? meta.essence ?? meta.oneSentence ?? t.idea ?? t.claim ?? t.description ?? '',
    oneSentence: meta.oneSentence ?? t.oneSentence ?? meta.promise ?? meta.essence ?? meta.idea ?? t.idea ?? t.claim ?? t.description ?? '',
    archetype: meta.archetype ?? t.archetype ?? (Array.isArray(t.ramps) && t.ramps.length > 2 ? 'multi-ramp' : t.ramp ? 'ui-ramp' : 'minimal'),
    theme,
    sections: t.sections ?? meta.sections ?? [],
    primitives,
    contrast,
    type,
    radius: scale(t.radius),
    space: scale(t.space),
  }
}
