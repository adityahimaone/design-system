/* ============================================================================
 * Figma runtime — Sunnyside canonical manifest replay (v5.0.0).
 *
 * The HTML sheet measures a fixed 1440px clone of itself and emits a signed
 * `sunnyside/figma-manifest` v2. This plugin replays that one spec natively:
 *
 *   · a complete, idempotent variable/style library (colour, semantic, ramps,
 *     spacing, radius, type, elevation, grid) — re-running never duplicates
 *   · every SOLID fill bound to a variable, every text bound to a text style
 *   · Auto Layout with spacing/radius variable bindings
 *   · real components with variant sets, descriptions and live instances
 *   · an in-place upgrader for flat Doop / HTML-importer pages
 *
 * This is NOT a general HTML-to-Figma converter. It reads a known schema from a
 * page we generate ourselves, so there is no CSS parsing and no guessing.
 * v1 manifests (tokens-only, no `system`) still build via a compatibility path.
 * ==========================================================================*/

const blankReport = () => ({
  pages: 0, frames: 0, texts: 0, rects: 0, vectors: 0,
  variables: 0, variablesReused: 0, autoVariables: 0,
  paintStyles: 0, textStyles: 0, effectStyles: 0, gridStyles: 0,
  components: 0, componentSets: 0, instances: 0, componentDescriptions: 0,
  autoLayout: 0, layoutBindings: 0, textStyleBindings: 0,
  paintBindings: 0, styleBindings: 0, replaced: 0,
  upgradedTexts: 0, upgradedFills: 0, upgradedLayouts: 0, upgradedPages: 0, skippedPages: 0,
  textInk: 0, textBoosted: 0, fontFallbacks: 0, vectorsScaled: 0,
  effects: 0, chips: 0, grown: 0, skippedSheets: 0, errors: [],
})
const report = blankReport()
const fail = (where, e) => report.errors.push(where + ': ' + ((e && e.message) || String(e)))
const resetReport = () => Object.assign(report, blankReport())

/* The replay manifest declares "documentAccess": "dynamic-page", which makes
 * figma.currentPage read-only. Assigning to it throws "Cannot call with
 * documentAccess: dynamic-page. Use figma.setCurrentPageAsync instead."
 * The async method also loads the page's children on demand. */
async function usePage(page) {
  if (typeof figma.setCurrentPageAsync === 'function') {
    await figma.setCurrentPageAsync(page)
  } else {
    figma.currentPage = page
  }
}

/* ── colour ─────────────────────────────────────────────────────────────── */

function parseColor(str) {
  if (!str || typeof str !== 'string') return null
  const s = str.trim().toLowerCase()
  if (s === 'transparent' || s === 'none') return null
  if (s.charAt(0) === '#') {
    let h = s.slice(1)
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    let a = 1
    if (h.length === 8) { a = parseInt(h.slice(6, 8), 16) / 255; h = h.slice(0, 6) }
    if (h.length !== 6) return null
    const n = parseInt(h, 16)
    if (!Number.isFinite(n)) return null
    if (a <= 0.001) return null
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a }
  }
  const m = s.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const p = m[1].split(',').map((x) => parseFloat(x))
  if (p.length < 3) return null
  const a = p.length > 3 ? p[3] : 1
  if (a <= 0.001) return null
  return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a }
}

const solid = (c) => ({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a })
const key = (c) => [c.r, c.g, c.b].map((v) => Math.round(v * 1000)).join(',')
const hexOf = (c) => '#' + [c.r, c.g, c.b]
  .map((v) => ('0' + Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16)).slice(-2))
  .join('').toUpperCase()

/* ── fonts ──────────────────────────────────────────────────────────────── */

const GENERIC_FAMILY = /^(monospace|sans-serif|serif|system-ui|ui-[a-z-]+|-apple-system|inherit|initial)$/i

function firstFamily(stack) {
  const parts = String(stack || '')
    .split(',')
    .map((p) => p.replace(/["']/g, '').trim())
    .filter(Boolean)
  return parts.find((p) => !GENERIC_FAMILY.test(p)) || 'Inter'
}

function weightStyle(w) {
  const n = parseInt(String(w || '400'), 10)
  if (!Number.isFinite(n)) return String(w || 'Regular')
  if (n <= 300) return 'Light'
  if (n <= 400) return 'Regular'
  if (n <= 500) return 'Medium'
  if (n <= 600) return 'Semi Bold'
  return 'Bold'
}

/* Google Fonts ship with Figma, so Archivo / DM Mono / Fraunces resolve by name
 * without installing anything — but only under the style spelling Figma uses.
 * "Semi Bold" and "SemiBold" are different strings. Try every spelling. */
function styleCandidates(style) {
  const map = {
    'Semi Bold': ['SemiBold', 'Semi Bold', 'DemiBold', 'Demi Bold', 'Medium', 'Bold'],
    'Extra Bold': ['ExtraBold', 'Extra Bold', 'Bold'],
    'Extra Light': ['ExtraLight', 'Extra Light', 'Light'],
    'Ultra Light': ['UltraLight', 'Ultra Light', 'Thin'],
    'Hairline': ['Thin', 'ExtraLight', 'Light'],
  }
  const out = map[style] || []
  return [...out, style, 'Regular', 'Medium', 'Bold'].filter((s, i, a) => s && a.indexOf(s) === i)
}

const fontCache = new Map()
async function loadFont(family, weight) {
  const fam = firstFamily(family)
  const style = weightStyle(weight)
  const k = fam + '|' + style
  if (fontCache.has(k)) return fontCache.get(k)
  const tries = styleCandidates(style)
  for (const s of tries) {
    try {
      const f = { family: fam, style: s }
      await figma.loadFontAsync(f)
      fontCache.set(k, f)
      return f
    } catch (e) { /* try the next weight */ }
  }
  report.fontFallbacks++
  try { await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }) } catch (e) { /* bundled */ }
  const fallback = { family: 'Inter', style: 'Regular' }
  fontCache.set(k, fallback)
  return fallback
}

/* ── effects ────────────────────────────────────────────────────────────── */

function parseShadow(str) {
  if (!str || str === 'none') return null
  const first = String(str).split(/,(?![^(]*\))/)[0]
  if (!first || first === 'none') return null
  const colourMatch = first.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/)
  const nums = first.replace(colourMatch ? colourMatch[0] : '', '').match(/-?[\d.]+px/g) || []
  if (nums.length < 2) return null
  const [x, y, blur, spread] = nums.map((n) => parseFloat(n))
  const c = parseColor(colourMatch ? colourMatch[0] : 'rgba(0,0,0,0.15)') || { r: 0, g: 0, b: 0, a: 0.15 }
  return {
    type: /\binset\b/.test(first) ? 'INNER_SHADOW' : 'DROP_SHADOW',
    color: { r: c.r, g: c.g, b: c.b, a: c.a },
    offset: { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 },
    radius: Math.max(0, Number.isFinite(blur) ? blur : 0),
    spread: Number.isFinite(spread) ? spread : 0,
    visible: true,
    blendMode: 'NORMAL',
  }
}

/* ── local system discovery (idempotency) ───────────────────────────────── */

async function localFrom(host, asyncName, syncName) {
  const fn = (typeof host[asyncName] === 'function' && host[asyncName]) ||
             (typeof host[syncName] === 'function' && host[syncName])
  if (!fn) return []
  try {
    const out = await fn.call(host)
    return Array.isArray(out) ? out : []
  } catch (e) { return [] }
}

function emptyRegistry() {
  return {
    collections: new Map(), varsByName: new Map(), varList: [],
    byRgb: new Map(), byToken: new Map(),
    colourCollection: null, colourMode: null,
    spaceVars: new Map(), radiusVars: new Map(),
    textStyleByKey: new Map(), paintStyleByHex: new Map(),
    effectStyleByShadow: new Map(), styleByName: new Map(),
  }
}

/* `system` is the v2 spec. v1 sheets only have `tokens`; promote them so the
 * rest of the plugin has one shape to work with. */
function legacySystem(tokens) {
  const t = tokens || {}
  return {
    version: t.version || 'v1.0',
    brand: t.brand || 'Brand',
    slug: t.slug || '',
    namespace: t.namespace || '',
    fonts: null,
    colours: (t.palette || []).map((p) => ({ name: p.name, hex: p.hex, token: p.name, group: 'Primitive' })),
    type: (t.type || []).map((r) => ({ ...r, role: r.name })),
    space: t.space || [], radius: t.radius || [],
    effects: [], components: [], sheets: [],
  }
}

function systemOf(manifest) {
  return manifest && manifest.system && Array.isArray(manifest.system.colours)
    ? manifest.system
    : legacySystem(manifest && manifest.tokens)
}

async function buildSystem(system) {
  const brand = system.brand || 'Brand'
  const reg = emptyRegistry()

  const collections = await localFrom(figma.variables, 'getLocalVariableCollectionsAsync', 'getLocalVariableCollections')
  const variables = await localFrom(figma.variables, 'getLocalVariablesAsync', 'getLocalVariables')
  reg.varList = variables.slice()
  for (const c of collections) reg.collections.set(c.name, c)
  for (const v of variables) reg.varsByName.set((v.variableCollectionId || '') + '|' + v.name, v)

  const styleSets = [
    ['Paint', await localFrom(figma, 'getLocalPaintStylesAsync', 'getLocalPaintStyles')],
    ['Text', await localFrom(figma, 'getLocalTextStylesAsync', 'getLocalTextStyles')],
    ['Effect', await localFrom(figma, 'getLocalEffectStylesAsync', 'getLocalEffectStyles')],
  ]
  for (const [, list] of styleSets) for (const s of list) reg.styleByName.set(s.name, s)

  const collection = (suffix) => {
    const name = brand + ' / ' + suffix
    let coll = reg.collections.get(name)
    if (!coll) {
      coll = figma.variables.createVariableCollection(name)
      reg.collections.set(name, coll)
      try { coll.renameMode(coll.modes[0].modeId, 'Light') } catch (e) { /* some editors ship one fixed mode */ }
    }
    return coll
  }
  const modeOf = (coll) => coll.modes[0].modeId

  const upsertVariable = (name, coll, type, value, tag) => {
    const k = (coll.id || '') + '|' + name
    let v = reg.varsByName.get(k)
    if (!v) {
      v = figma.variables.createVariable(name, coll, type)
      try { v.variableCollectionId = coll.id } catch (e) { /* readonly in Figma; the map below is what we use */ }
      reg.varsByName.set(k, v)
      reg.varList.push(v)
      report.variables++
    } else {
      report.variablesReused++
    }
    try { v.setValueForMode(modeOf(coll), value) } catch (e) { fail('variable/' + name, e) }
    if (tag) tag(v)
    return v
  }

  const upsertStyle = (kind, name, apply) => {
    let st = reg.styleByName.get(name)
    if (!st) {
      const fn = figma['create' + kind + 'Style']
      if (typeof fn !== 'function') return null
      st = fn.call(figma)
      st.name = name
      reg.styleByName.set(name, st)
      report[{ Paint: 'paintStyles', Text: 'textStyles', Effect: 'effectStyles', Grid: 'gridStyles' }[kind]]++
    }
    try { apply(st) } catch (e) { fail('style/' + name, e) }
    return st
  }

  /* ── colour: primitives, three 10-step ramps, semantic surfaces ───────── */
  const colourColl = collection('Colour')
  reg.colourCollection = colourColl
  reg.colourMode = modeOf(colourColl)
  const seenColour = new Set()
  for (const p of system.colours || []) {
    const c = parseColor(p.hex)
    if (!c || seenColour.has(String(p.name))) continue
    seenColour.add(String(p.name))
    const k = key(c)
    const v = upsertVariable(String(p.name), colourColl, 'COLOR', c, (made) => {
      if (!reg.byRgb.has(k)) reg.byRgb.set(k, made)
      reg.byToken.set(String(p.token || p.name), made)
    })
    const paint = figma.variables.setBoundVariableForPaint(solid(c), 'color', v)
    const style = upsertStyle('Paint', 'Colour/' + String(p.name), (st) => { st.paints = [paint] })
    if (style) reg.paintStyleByHex.set(k, style)
  }

  /* ── spacing + radius FLOAT variables, keyed by their pixel value ──────── */
  const numberVars = (suffix, list, target) => {
    const arr = list || []
    if (!arr.length) return
    const coll = collection(suffix)
    for (const t of arr) {
      const n = parseFloat(t.value)
      if (!Number.isFinite(n)) continue
      upsertVariable(String(t.name), coll, 'FLOAT', n, (v) => { if (!target.has(n)) target.set(n, v) })
    }
  }
  numberVars('Spacing', system.space, reg.spaceVars)
  numberVars('Radius', system.radius, reg.radiusVars)

  /* ── text styles ──────────────────────────────────────────────────────── */
  for (const t of system.type || []) {
    const size = Number(t.size)
    if (!Number.isFinite(size) || size <= 0) continue
    const fam = firstFamily(t.family)
    const st = upsertStyle('Text', 'Type/' + String(t.name), () => {})
    if (!st) continue
    try {
      st.fontName = await loadFont(t.family, t.weight)
      st.fontSize = size
      if (t.leading != null) {
        const lh = Number(t.leading)
        if (Number.isFinite(lh) && lh > 0) st.lineHeight = { unit: 'PERCENT', value: Math.round((lh > 3 ? lh / size : lh) * 100) }
      }
      if (t.tracking != null && Number.isFinite(Number(t.tracking))) {
        st.letterSpacing = { unit: 'PIXELS', value: +(Number(t.tracking) * size).toFixed(2) }
      }
      reg.textStyleByKey.set(fam + '|' + Math.round(size) + '|' + weightStyle(t.weight), st)
    } catch (e) { fail('textStyle/' + t.name, e) }
  }

  /* ── elevation effect styles ─────────────────────────────────────────── */
  for (const e of system.effects || []) {
    const shadow = parseShadow(e.shadow)
    if (!shadow) continue
    const st = upsertStyle('Effect', 'Effect/' + e.name, (s) => { s.effects = [shadow] })
    if (st) reg.effectStyleByShadow.set(e.shadow, st)
  }

  /* ── layout grid style (12-column house grid) ────────────────────────── */
  if (system.grid && typeof figma.createGridStyle === 'function') {
    const st = upsertStyle('Grid', 'Grid/' + system.grid.columns + ' Column', (s) => {
      s.layoutGrids = [{
        pattern: 'COLUMNS', alignment: 'CENTER', gutterSize: system.grid.gutter,
        count: system.grid.columns, offset: system.grid.margin, sectionSize: 0,
      }]
    })
    if (st) report.gridStyles = Math.max(report.gridStyles, 1)
  }
  return reg
}

/* A colour used by the DOM but absent from the token file still gets a
 * variable, named by its hex. That is what takes fill binding from "a few
 * swatches" to the whole sheet without changing a single pixel. */
function colourVarFor(c, reg) {
  const k = key(c)
  if (reg.byRgb.has(k)) return reg.byRgb.get(k)
  if (!reg.colourCollection) return null
  try {
    const name = 'Auto/' + hexOf(c)
    const cacheKey = (reg.colourCollection.id || '') + '|' + name
    let v = reg.varsByName.get(cacheKey)
    if (!v) {
      v = figma.variables.createVariable(name, reg.colourCollection, 'COLOR')
      try { v.variableCollectionId = reg.colourCollection.id } catch (e) { /* readonly in Figma */ }
      reg.varsByName.set(cacheKey, v)
      reg.varList.push(v)
      report.variables++
      report.autoVariables++
    }
    v.setValueForMode(reg.colourMode, c)
    reg.byRgb.set(k, v)
    return v
  } catch (e) { fail('autoVariable', e); return null }
}

/* Bind a text node to a real text style. When the token file has no exact role
 * for this size/face, mint one from the node's own metrics — binding must never
 * silently change the appearance. */
function textStyleFor(t, style, reg) {
  const fam = firstFamily(style.fontFamily)
  const k = fam + '|' + Math.round(Number(t.fontSize) || 14) + '|' + weightStyle(style.fontWeight)
  if (reg.textStyleByKey.has(k)) return reg.textStyleByKey.get(k)
  try {
    const st = figma.createTextStyle()
    st.name = 'Type/Auto/' + fam.replace(/\s+/g, '') + '/' + Math.round(Number(t.fontSize) || 14) + '/' + weightStyle(style.fontWeight)
    st.fontName = t.fontName
    st.fontSize = Number(t.fontSize) || 14
    if (t.lineHeight && typeof t.lineHeight !== 'symbol') st.lineHeight = t.lineHeight
    if (t.letterSpacing && typeof t.letterSpacing !== 'symbol') st.letterSpacing = t.letterSpacing
    reg.textStyleByKey.set(k, st)
    reg.styleByName.set(st.name, st)
    report.textStyles++
    return st
  } catch (e) { fail('autoTextStyle', e); return null }
}

function bindVariable(node, field, variable) {
  if (!variable) return
  try {
    if (typeof node.setBoundVariable === 'function') {
      node.setBoundVariable(field, variable)
      report.layoutBindings++
    }
  } catch (e) { /* not every field is bindable on every node type */ }
}

/* ── layout mapping ─────────────────────────────────────────────────────── */

function justify(v) {
  switch (String(v || '')) {
    case 'flex-end': case 'end': case 'right': return 'MAX'
    case 'center': return 'CENTER'
    case 'space-between': return 'SPACE_BETWEEN'
    case 'space-around': return 'SPACE_AROUND'
    case 'space-evenly': return 'SPACE_EVENLY'
    default: return 'MIN'
  }
}
function align(v) {
  switch (String(v || '')) {
    case 'flex-end': case 'end': return 'MAX'
    case 'center': return 'CENTER'
    case 'baseline': return 'BASELINE'
    default: return 'MIN'
  }
}
function padding(L, i) {
  const v = L && Array.isArray(L.padding) ? Number(L.padding[i]) : 0
  return Number.isFinite(v) && v > 0 ? v : 0
}

function applyLayout(frame, L, children, reg) {
  if (!L || !L.mode || L.mode === 'NONE') return
  const childCount = Array.isArray(children) ? children.length : 0
  if (L.mode === 'HORIZONTAL' || L.mode === 'VERTICAL') {
    const hasFillChild = Array.isArray(children) &&
      children.some((c) => c && c.layout && Number(c.layout.grow) > 0)
    const distributed = ['SPACE_BETWEEN', 'SPACE_AROUND', 'SPACE_EVENLY'].indexOf(justify(L.justify)) !== -1
    frame.layoutMode = L.mode
    frame.primaryAxisSizingMode = (hasFillChild || distributed) ? 'FIXED' : 'AUTO'
    frame.counterAxisSizingMode = L.mode === 'HORIZONTAL' ? 'AUTO' : 'FIXED'
    frame.itemSpacing = Number(L.spacing) || 0
    frame.paddingTop = padding(L, 0)
    frame.paddingRight = padding(L, 1)
    frame.paddingBottom = padding(L, 2)
    frame.paddingLeft = padding(L, 3)
    frame.primaryAxisAlignItems = justify(L.justify)
    frame.counterAxisAlignItems = align(L.align)
    frame.layoutWrap = L.wrap === 'WRAP' ? 'WRAP' : 'NO_WRAP'
    const spaceVar = reg && reg.spaceVars.get(frame.itemSpacing)
    if (spaceVar) bindVariable(frame, 'itemSpacing', spaceVar)
    for (const f of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
      const v = reg && reg.spaceVars.get(frame[f])
      if (v) bindVariable(frame, f, v)
    }
    report.autoLayout++
    return
  }
  if (L.mode === 'GRID') {
    const cols = String(L.columns || '').trim().split(/\s+/).filter(Boolean).length || 1
    try {
      frame.layoutMode = 'GRID'
      frame.gridColumnCount = Math.max(1, cols)
      frame.gridRowCount = Math.max(1, Math.ceil(childCount / Math.max(1, cols)))
      frame.gridRowGap = Number(L.spacing) || 0
      frame.gridColumnGap = Number(L.counterSpacing) || 0
      frame.gridItemsPositioning = 'ROW_AUTO_FLOW'
      frame.paddingTop = padding(L, 0)
      frame.paddingRight = padding(L, 1)
      frame.paddingBottom = padding(L, 2)
      frame.paddingLeft = padding(L, 3)
      report.autoLayout++
    } catch (e) {
      frame.layoutMode = 'VERTICAL'
      frame.itemSpacing = Number(L.spacing) || 0
      frame.paddingTop = padding(L, 0)
      frame.paddingLeft = padding(L, 3)
      report.autoLayout++
    }
  }
}

function applyStyle(node, style, reg, bind) {
  if (!style) return
  const doBind = bind !== false
  try {
    const fill = parseColor(style.fill)
    if (fill) {
      const k = key(fill)
      const v = doBind ? colourVarFor(fill, reg) : reg.byRgb.get(k)
      const paint = v ? figma.variables.setBoundVariableForPaint(solid(fill), 'color', v) : solid(fill)
      if (v) report.paintBindings++
      node.fills = [paint]
      const ps = reg.paintStyleByHex.get(k)
      if (ps && doBind) {
        try { node.fillStyleId = ps.id; report.styleBindings++ } catch (e) { /* style not applicable */ }
      }
    } else {
      node.fills = []
    }
  } catch (e) { fail('fills', e) }
  try {
    const stroke = parseColor(style.stroke)
    if (stroke) {
      node.strokes = [solid(stroke)]
      node.strokeWeight = Number(style.strokeWidth) || 1
    }
  } catch (e) { fail('strokes', e) }
  try {
    const r = Number(style.radius)
    if (Number.isFinite(r) && r > 0) {
      node.cornerRadius = r
      const rv = reg.radiusVars.get(r)
      if (rv && doBind) bindVariable(node, 'cornerRadius', rv)
    }
  } catch (e) { /* not every node has a radius */ }
  try {
    const shadow = parseShadow(style.shadow)
    if (shadow) {
      const es = reg.effectStyleByShadow.get(style.shadow)
      if (es && doBind) {
        try { node.effectStyleId = es.id; report.styleBindings++ } catch (e) { /* ignore */ }
      }
      node.effects = [shadow]
      report.effects++
    }
  } catch (e) { /* effects are not available on every node type */ }
  try {
    const o = Number(style.opacity)
    if (Number.isFinite(o) && o < 1) node.opacity = o
  } catch (e) { /* ignore */ }
}

function safeBox(node) {
  const b = node && node.box ? node.box : {}
  return {
    x: Number(b.x) || 0, y: Number(b.y) || 0,
    w: Math.max(1, Number(b.w) || 1), h: Math.max(1, Number(b.h) || 1),
  }
}

/* A button, badge or input is a TEXT / RECTANGLE leaf in the DOM, but a real
 * component in the design system. Give it a COMPONENT host carrying the plate,
 * description and variant name, with the visual node as its child. */
function makeComponentHost(node, box, reg, ctx) {
  const spec = node.componentRef
  const host = figma.createComponent()
  host.name = 'Component/' + spec.name + '/' + spec.variant
  try {
    host.description = spec.description || ''
    if (spec.description) report.componentDescriptions++
  } catch (e) { /* description is optional on older runtimes */ }
  host.fills = []
  applyStyle(host, node.style, reg, true)
  try { host.resize(box.w, box.h) } catch (e) { fail('component/resize/' + spec.name, e) }
  ctx.components.push({ node: host, spec })
  report.components++
  return host
}

/* ── node tree ──────────────────────────────────────────────────────────── */

async function createNode(node, parentBox, reg, depth, options, ctx) {
  if (!node || depth > 14) return null
  const box = safeBox(node)
  let out = null
  let textInk = null
  let inkPaint = null
  let chip = false
  let oneLine = false

  if (node.type === 'TEXT') {
    const rawSize = Number(node.style && node.style.fontSize) || 14
    const minSize = Number(options && options.minFontSize) || 0
    const size = Math.max(rawSize, minSize)
    if (size > rawSize) report.textBoosted++
    textInk = parseColor(node.style && node.style.color) || { r: 0.07, g: 0.09, b: 0.15, a: 1 }

    const t = figma.createText()
    t.name = String(node.name || 'Text')
    t.fontName = await loadFont(node.style && node.style.fontFamily, node.style && node.style.fontWeight)
    t.characters = String(node.text || '')
    t.fontSize = size
    const lh = node.style && node.style.lineHeight
    if (lh && lh !== 'normal') {
      const px = parseFloat(lh)
      if (Number.isFinite(px) && px > 0) t.lineHeight = { unit: 'PIXELS', value: px }
    }
    const ls = parseFloat(node.style && node.style.letterSpacing)
    if (Number.isFinite(ls) && ls !== 0) t.letterSpacing = { unit: 'PIXELS', value: ls }
    /* Text ink is a colour too. Bind it so a mode flip recolours the sheet,
     * not just its swatches. */
    inkPaint = solid(textInk)
    const inkVar = colourVarFor(textInk, reg)
    if (inkVar) {
      inkPaint = figma.variables.setBoundVariableForPaint(inkPaint, 'color', inkVar)
      report.paintBindings++
    }
    t.fills = [inkPaint]

    oneLine = box.h <= size * 1.6
    t.textAutoResize = oneLine ? 'WIDTH_AND_HEIGHT' : 'HEIGHT'
    t.x = 0
    t.y = 0
    report.texts++
    report.textInk++

    const st = textStyleFor(t, node.style || {}, reg)
    if (st) {
      try { t.textStyleId = st.id; report.textStyleBindings++ } catch (e) { fail('textStyleBind/' + node.name, e) }
    }

    const bg = parseColor(node.style && node.style.fill)
    if (bg && bg.a > 0.05) {
      const plate = figma.createFrame()
      plate.name = String(node.name || 'Chip')
      plate.fills = []
      applyStyle(plate, node.style, reg, true)
      try { plate.resize(box.w, box.h) } catch (e) { fail('chip/' + node.name, e) }
      try {
        plate.appendChild(t)
        t.x = Math.max(0, (box.w - t.width) / 2)
        t.y = Math.max(0, (box.h - t.height) / 2)
      } catch (e) { fail('chipText/' + node.name, e) }
      out = plate
      chip = true
      report.chips++
    } else {
      out = t
    }
  } else if (node.type === 'VECTOR') {
    try {
      out = figma.createNodeFromSvg(String(node.svg || ''))
      out.name = String(node.name || 'Vector')
      out.fills = []
      const sw = Number(out.width) || box.w
      const sh = Number(out.height) || box.h
      if (sw > 0 && sh > 0 && box.w > 0 && box.h > 0) {
        const scale = Math.min(box.w / sw, box.h / sh, 12)
        if (Number.isFinite(scale) && scale > 0 && Math.abs(scale - 1) > 0.02) {
          try { out.rescale(scale); report.vectorsScaled++ } catch (e) { /* keep intrinsic size */ }
        }
      }
      report.vectors++
    } catch (e) {
      const r = figma.createRectangle()
      r.name = String(node.name || 'Vector (fallback)')
      r.fills = []
      out = r
      report.rects++
      fail('vector/' + node.name, e)
    }
  } else if (node.type === 'RECTANGLE') {
    const r = figma.createRectangle()
    r.name = String(node.name || 'Rectangle')
    out = r
    report.rects++
  } else {
    const spec = node.componentRef
    const isComponent = !!(spec || node.component)
    out = isComponent ? figma.createComponent() : figma.createFrame()
    if (spec) {
      out.name = 'Component/' + spec.name + '/' + spec.variant
      try {
        out.description = spec.description || ''
        if (spec.description) report.componentDescriptions++
      } catch (e) { /* description is optional on older runtimes */ }
      ctx.components.push({ node: out, spec })
      report.components++
    } else {
      out.name = String(node.component || node.name || 'Frame')
      if (node.component) report.components++
      else report.frames++
    }
  }

  if (!chip) applyStyle(out, node.style, reg, true)

  /* applyStyle writes the CSS background into fills. Text ink comes from CSS
   * `color`, which is transparent-as-background for ~78% of labels. */
  if (node.type === 'TEXT' && inkPaint && !chip) {
    try { out.fills = [inkPaint] } catch (e) { fail('textInk/' + node.name, e) }
  }

  try {
    if (chip) { /* sized when the plate was built */ }
    else if (node.type === 'TEXT' && oneLine) { /* auto-width keeps the line intact */ }
    else if (node.type === 'TEXT') out.resize(Math.max(box.w, 32), box.h)
    else out.resize(box.w, box.h)
  } catch (e) { fail('resize/' + node.name, e) }
  out.x = box.x - parentBox.x
  out.y = box.y - parentBox.y

  /* Leaf specimens (buttons, badges, inputs) need a COMPONENT host of their
   * own. Frame specimens already registered themselves above. */
  if (node.componentRef && out.type !== 'COMPONENT') {
    const host = makeComponentHost(node, box, reg, ctx)
    try {
      host.appendChild(out)
      out.x = 0
      out.y = 0
      host.x = box.x - parentBox.x
      host.y = box.y - parentBox.y
      out = host
    } catch (e) { fail('component/wrap/' + node.componentRef.name, e) }
  }

  const children = Array.isArray(node.children) ? node.children : []
  if (out.type === 'FRAME' || out.type === 'COMPONENT' || out.type === 'INSTANCE') {
    if (!chip) applyLayout(out, node.layout, children, reg)
    for (const child of children) {
      const made = await createNode(child, box, reg, depth + 1, options, ctx)
      if (!made) continue
      try { out.appendChild(made) } catch (e) { fail('append/' + child.name, e); continue }
      const L = child.layout || {}
      if (out.layoutMode && out.layoutMode !== 'NONE') {
        try { made.layoutGrow = Number(L.grow) > 0 ? 1 : 0 } catch (e) { /* not a flow child */ }
        try { made.layoutPositioning = L.positioning === 'ABSOLUTE' ? 'ABSOLUTE' : 'AUTO' } catch (e) { /* not a flow child */ }
        if (L.positioning === 'ABSOLUTE') {
          try { made.x = (child.box ? Number(child.box.x) || 0 : 0) - box.x; made.y = (child.box ? Number(child.box.y) || 0 : 0) - box.y } catch (e) { /* ignore */ }
        }
      }
    }
  }
  return out
}

/* A frame with layoutMode NONE keeps the height the browser measured and
 * cannot hug. Grow it to its children; never shrink it. */
function fitAbsoluteFrames(node) {
  if (!node) return
  const kids = Array.isArray(node.children) ? node.children : []
  for (const child of kids) fitAbsoluteFrames(child)
  if (node.type !== 'FRAME' && node.type !== 'COMPONENT') return
  if (node.layoutMode && node.layoutMode !== 'NONE') return
  if (!kids.length) return
  let maxRight = 0
  let maxBottom = 0
  for (const child of kids) {
    maxRight = Math.max(maxRight, (Number(child.x) || 0) + (Number(child.width) || 0))
    maxBottom = Math.max(maxBottom, (Number(child.y) || 0) + (Number(child.height) || 0))
  }
  try {
    if (maxBottom > node.height + 1) { node.resize(node.width, maxBottom); report.grown++ }
    if (maxRight > node.width + 1) { node.resize(maxRight, node.height); report.grown++ }
  } catch (e) { fail('fit/' + node.name, e) }
}

/* ── real component library: variant sets + live instances ──────────────── */

function buildComponentLibrary(page, root, ctx) {
  const groups = new Map()
  for (const entry of ctx.components) {
    const name = entry.spec.name
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name).push(entry)
  }
  if (!groups.size) return null

  const library = figma.createFrame()
  library.name = '◆ Component Library'
  library.fills = []
  try {
    library.layoutMode = 'VERTICAL'
    library.itemSpacing = 24
    library.paddingTop = library.paddingRight = library.paddingBottom = library.paddingLeft = 32
    library.resize(420, 120)
  } catch (e) { /* cosmetics only */ }
  library.x = (Number(root.width) || 1440) + 200
  library.y = 0

  const descriptionOf = (system, name) => {
    for (const c of (system && system.components) || []) if (c.name === name) return c.description || ''
    return ''
  }

  for (const [name, entries] of groups) {
    /* combineAsVariants moves its arguments into a new COMPONENT_SET. Use
     * clones so the specimens stay exactly where the sheet placed them. */
    let set = null
    if (typeof figma.combineAsVariants === 'function') {
      try {
        const clones = []
        for (const entry of entries) {
          if (typeof entry.node.clone !== 'function') continue
          const copy = entry.node.clone()
          copy.name = entry.spec.variant
          library.appendChild(copy)
          clones.push(copy)
        }
        if (clones.length) {
          set = figma.combineAsVariants(clones, library)
          set.name = 'Component / ' + name
          try { set.description = descriptionOf(ctx.system, name) || entries[0].spec.description || '' } catch (e) { /* ignore */ }
          report.componentSets++
        }
      } catch (e) { fail('combineAsVariants/' + name, e) }
    }
    for (const entry of entries) {
      try {
        const inst = (set && set.defaultVariant && typeof set.defaultVariant.createInstance === 'function')
          ? set.defaultVariant.createInstance()
          : entry.node.createInstance()
        inst.name = 'Instance / ' + name + ' / ' + entry.spec.variant
        library.appendChild(inst)
        report.instances++
      } catch (e) { fail('instance/' + name, e) }
    }
  }
  page.appendChild(library)
  return library
}

/* ── build ──────────────────────────────────────────────────────────────── */

async function build(manifest, replace, options) {
  if (!manifest || manifest.kind !== 'sunnyside/figma-manifest') {
    throw new Error('Not a Sunnyside Figma manifest (kind must be sunnyside/figma-manifest)')
  }
  if (!Array.isArray(manifest.sheets) || !manifest.sheets.length) throw new Error('Manifest has no sheets')

  /* The canonical spec always carries 8 sheets. Sheet 08 stays optional in
   * Figma: it is mostly CSS dumps and copy controls, and the user asked to keep
   * it off by default. */
  const includePatterns = !!(options && options.includePatterns)
  const sheets = manifest.sheets.filter((s) => {
    const optional = (s && s.optional === true) || /patterns|tokens/i.test(String((s && s.name) || ''))
    return includePatterns || !optional
  })
  report.skippedSheets = manifest.sheets.length - sheets.length
  if (!sheets.length) throw new Error('Every sheet was filtered out — enable the patterns page')

  /* Safe re-run: remove every page this plugin generates, not just the ones in
   * the current manifest. An older file may have 6 or 8 generated pages. The
   * pattern is deliberately narrow so a designer's own pages are untouched. */
  if (replace) {
    try {
      if (typeof figma.loadAllPagesAsync === 'function') await figma.loadAllPagesAsync()
      for (const page of [...figma.root.children]) {
        if (page.type === 'PAGE' && /^\d{2} · /.test(page.name)) {
          try { page.remove(); report.replaced++ } catch (e) { fail('replace/' + page.name, e) }
        }
      }
    } catch (e) { fail('replace/scan', e) }
  }

  const system = systemOf(manifest)
  const reg = await buildSystem(system)

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i]
    const number = String(sheet.index || i + 1).padStart(2, '0')
    const page = figma.createPage()
    page.name = number + ' · ' + (sheet.name || 'Sheet')
    await usePage(page)
    const ctx = { components: [], system }
    const root = await createNode(sheet.node, { x: 0, y: 0 }, reg, 0, options, ctx)
    if (root) {
      fitAbsoluteFrames(root)
      root.x = 0
      root.y = 0
      page.appendChild(root)
      if (options.components !== false) buildComponentLibrary(page, root, ctx)
    }
    report.pages++
  }

  try {
    if (typeof figma.loadAllPagesAsync === 'function') await figma.loadAllPagesAsync()
    for (const page of [...figma.root.children]) {
      try {
        if (/^Page \d+$/.test(page.name) && page.children.length === 0) page.remove()
      } catch (e) { fail('page cleanup/' + page.name, e) }
    }
  } catch (e) { fail('page cleanup', e) }
}

/* ── in-place upgrader for existing Doop / HTML-importer pages ──────────── */

function upgradeFills(node, reg) {
  const paints = Array.isArray(node.fills) ? node.fills : []
  let changed = 0
  const next = paints.map((p) => {
    if (!p || p.type !== 'SOLID' || (p.boundVariables && p.boundVariables.color)) return p
    const c = p.color
    if (!c) return p
    const v = colourVarFor({ r: c.r, g: c.g, b: c.b, a: p.opacity == null ? 1 : p.opacity }, reg)
    if (!v) return p
    changed++
    return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: p.opacity == null ? 1 : p.opacity }, 'color', v)
  })
  if (changed) {
    try { node.fills = next; report.upgradedFills += changed } catch (e) { fail('upgrade/fills', e) }
  }
}

async function upgradeText(node, reg) {
  if (node.type !== 'TEXT') return
  if (node.textStyleId) return
  try {
    const size = Number(node.fontSize) || 14
    const fam = node.fontName ? node.fontName.family : 'Inter'
    const weight = node.fontName ? node.fontName.style : 'Regular'
    const st = textStyleFor(
      { fontSize: size, fontName: { family: fam, style: weight }, lineHeight: node.lineHeight, letterSpacing: node.letterSpacing },
      { fontFamily: fam, fontWeight: weight }, reg)
    if (st) { node.textStyleId = st.id; report.upgradedTexts++ }
  } catch (e) { fail('upgrade/text', e) }
}

function inferLayout(node) {
  if (node.type !== 'FRAME' || (node.layoutMode && node.layoutMode !== 'NONE')) return
  const hint = node.inferredAutoLayout
  if (!hint || !hint.layoutMode || hint.layoutMode === 'NONE') return
  try {
    node.layoutMode = hint.layoutMode
    if (hint.itemSpacing != null) node.itemSpacing = hint.itemSpacing
    for (const f of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
      if (hint[f] != null) node[f] = hint[f]
    }
    report.upgradedLayouts++
  } catch (e) { fail('upgrade/infer', e) }
}

async function upgrade(manifest, options) {
  const system = systemOf(manifest || {})
  const reg = await buildSystem(system)
  try { if (typeof figma.loadAllPagesAsync === 'function') await figma.loadAllPagesAsync() } catch (e) { /* best effort */ }
  const all = [...figma.root.children].filter((p) => p.type === 'PAGE')
  const targets = options.allPages ? all : [figma.currentPage].filter(Boolean)

  for (const page of targets) {
    /* Our own generated pages are already bound — leave them alone. */
    if (/^\d{2} · /.test(page.name) || page.name === '◆ Component Library') { report.skippedPages++; continue }
    await usePage(page)
    const kids = Array.isArray(page.children) ? [...page.children] : []
    const stack = kids.slice()
    while (stack.length) {
      const node = stack.pop()
      if (!node) continue
      if (Array.isArray(node.children)) for (const c of node.children) stack.push(c)
      upgradeFills(node, reg)
      await upgradeText(node, reg)
      if (options.inferLayout) inferLayout(node)
    }
    report.upgradedPages++
  }
  return reg
}

/* ── plugin entry ───────────────────────────────────────────────────────── */

figma.showUI(__html__, { width: 520, height: 720 })

function summaryFor(label, manifest) {
  return (label + ' · ' + (manifest && manifest.brand ? manifest.brand + ' — ' : '')) +
    report.pages + ' pages, ' + report.autoLayout + ' auto layouts, ' +
    report.frames + ' frames, ' +
    report.texts + ' texts (' + report.textInk + ' inked, ' + report.textStyleBindings + ' styled' +
    (report.textBoosted ? ', ' + report.textBoosted + ' boosted' : '') + '), ' +
    report.rects + ' rects, ' + report.vectors + ' vectors, ' + report.effects + ' shadows, ' +
    (report.chips ? report.chips + ' chips, ' : '') +
    report.variables + ' variables (' + report.variablesReused + ' reused), ' +
    report.paintBindings + ' bound paints, ' + report.paintStyles + ' paint styles, ' +
    report.textStyles + ' text styles, ' + report.effectStyles + ' effect styles, ' +
    report.components + ' components / ' + report.componentSets + ' sets / ' + report.instances + ' instances' +
    (report.replaced ? ' · replaced ' + report.replaced + ' existing page(s)' : '') +
    (report.skippedSheets ? ' · skipped ' + report.skippedSheets + ' sheet(s)' : '') +
    (report.upgradedPages ? ' · upgraded ' + report.upgradedPages + ' page(s): ' + report.upgradedTexts + ' texts, ' + report.upgradedFills + ' fills, ' + report.upgradedLayouts + ' layouts' : '') +
    (report.fontFallbacks ? ' · ' + report.fontFallbacks + ' font fallback(s) — install the brand fonts' : '')
}

figma.ui.onmessage = async (msg) => {
  if (!msg || msg.type === 'cancel') { figma.closePlugin(); return }
  if (msg.type !== 'build' && msg.type !== 'upgrade') return
  resetReport()
  try {
    const manifest = typeof msg.json === 'string' ? JSON.parse(msg.json) : msg.json
    const options = {
      minFontSize: Math.max(0, Number(msg.minFontSize) || 0),
      includePatterns: msg.includePatterns === true,
      components: msg.components !== false,
      bind: msg.bind !== false,
      allPages: msg.allPages === true,
      inferLayout: msg.inferLayout === true,
    }
    if (msg.type === 'upgrade') await upgrade(manifest, options)
    else await build(manifest, msg.replace !== false, options)

    const summary = summaryFor(msg.type === 'upgrade' ? 'Upgrade' : 'Build', manifest)
    figma.notify(summary, { timeout: 9000 })
    figma.ui.postMessage({
      type: msg.type === 'upgrade' ? 'upgraded' : 'done',
      summary: summary + (report.errors.length ? ' · ' + report.errors.length + ' error(s)' : ''),
      report: { ...report },
    })
    if (report.errors.length) for (const e of report.errors) console.error('[replay] ' + e)
    figma.closePlugin(summary)
  } catch (e) {
    const message = (e && e.message) || String(e)
    figma.ui.postMessage({ type: 'error', message: message })
    figma.notify('Build failed: ' + message, { error: true })
  }
}
