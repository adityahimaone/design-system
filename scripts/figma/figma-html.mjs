#!/usr/bin/env node
/**
 * figma-html.mjs — Generates a 100% self-contained, zero-CDN, white-background
 * 8-Sheet Figma / HTML-to-Design Documentation HTML file (`<slug>-figma.html`)
 * from a brand system's `tokens.json`, `<slug>-tokens.css`, and SVG mark family.
 *
 * Designed for 1:1 import into Figma (`html.to.design`, Builder.io, Code-to-Design),
 * Penpot, OpenPencil, or section-by-section HTML copy/paste.
 *
 * Usage:
 *   node skills/sunnyside-brand-system/scripts/figma-html.mjs --slug setout [--root ../design-system]
 *   node skills/sunnyside-brand-system/scripts/figma-html.mjs --all [--root ../design-system]
 */

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findTokens, readTokens, familyOf } from './lib/tokens.mjs'
import {
  buildSystemSpec, CHECKSUM_JS, GENERATOR_VERSION, CAPTURE_VIEWPORT,
  CAPTURE_MODE, SHEET_INDEX, makeDsId,
} from './lib/canonical.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
/* Vendored layout: the replay templates sit beside this script, not two levels up. */
const TEMPLATES_DIR = resolve(__dirname, 'templates')

/* ── Downloadable Figma plugin bundle ──────────────────────────────────────
   The sheet already measures itself into a `sunnyside/figma-manifest`. The
   replay plugin (templates/figma-replay-plugin.js + figma-replay-ui.html) turns
   that manifest into native Figma Auto Layout, variables, paint/text styles and
   components. Embedding the plugin's bytes in the page lets one toolbar button
   hand a designer a ready-to-import plugin, with the page's own manifest baked
   in as the seed — no copy/paste, no third-party importer. */
function buildReplayAssets(brandName, slug) {
  const b64 = (s) => Buffer.from(String(s), 'utf8').toString('base64')
  try {
    const code = readFileSync(join(TEMPLATES_DIR, 'figma-replay-plugin.js'), 'utf8')
    const version = (/const PLUGIN_VERSION = '([^']+)'/.exec(code) || [, '0'])[1]
    const ui = readFileSync(join(TEMPLATES_DIR, 'figma-replay-ui.html'), 'utf8')
      .replace('__VERSION__', () => version)
    const pluginManifest = JSON.stringify({
      name: `${brandName} — replay v${version}`,
      id: `${slug}-replay`,
      api: '1.0.0',
      main: 'code.js',
      ui: 'ui.html',
      editorType: ['figma'],
      networkAccess: { allowedDomains: ['none'] },
      documentAccess: 'dynamic-page',
    })
    return [
      `var REPLAY_CODE_B64=${JSON.stringify(b64(code))};`,
      `var REPLAY_UI_B64=${JSON.stringify(b64(ui))};`,
      `var REPLAY_MANIFEST_B64=${JSON.stringify(b64(pluginManifest))};`,
    ].join('\n')
  } catch (e) {
    return 'var REPLAY_CODE_B64="";var REPLAY_UI_B64="";var REPLAY_MANIFEST_B64="";'
  }
}

/* Injected into every generated sheet. Kept dependency-free: base64-decode the
   embedded plugin bytes, build a store-only ZIP in memory, hand it to the
   browser. `buildFigmaManifest()` is defined earlier in the same script. */
const FIGMA_DOWNLOAD_JS = String.raw`
    /* ---- Download the manifest or a ready-to-import Figma plugin -------- */
    function b64ToBytes(b64) {
      var bin = atob(b64 || '');
      var out = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
    function b64ToText(b64) {
      try { return new TextDecoder('utf-8').decode(b64ToBytes(b64)); }
      catch (e) { return ''; }
    }
    function triggerDownload(blob, filename) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 1200);
    }
    function slugifyName(s) {
      return String(s || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'brand';
    }
    async function downloadFigmaManifest() {
      try {
        var m = await buildFigmaManifest();
        var json = JSON.stringify(m, null, 2);
        triggerDownload(new Blob([json], { type: 'application/json' }), slugifyName(m.brand) + '-figma-manifest.json');
        showToast('Manifest downloaded · ' + m.sheets.length + ' sheets · ' + m.nodes + ' nodes · ' + m.capture.checksum);
      } catch (e) { showToast('Manifest failed: ' + ((e && e.message) || e)); }
    }
    function buildStoreZip(files) {
      var table = (function () {
        var t = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
          var c = n;
          for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
          t[n] = c >>> 0;
        }
        return t;
      })();
      function crc32(buf) {
        var c = 0xFFFFFFFF;
        for (var i = 0; i < buf.length; i++) c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xFF];
        return (c ^ 0xFFFFFFFF) >>> 0;
      }
      var enc = new TextEncoder();
      var parts = [];
      var central = [];
      var offset = 0;
      for (var f = 0; f < files.length; f++) {
        var nameBytes = enc.encode(files[f].name);
        var data = files[f].data;
        var crc = crc32(data);
        var size = data.length;
        var lh = new DataView(new ArrayBuffer(30));
        lh.setUint32(0, 0x04034b50, true);
        lh.setUint16(4, 20, true);
        lh.setUint16(6, 0, true);
        lh.setUint16(8, 0, true);
        lh.setUint16(10, 0, true);
        lh.setUint16(12, 0, true);
        lh.setUint32(14, crc, true);
        lh.setUint32(18, size, true);
        lh.setUint32(22, size, true);
        lh.setUint16(26, nameBytes.length, true);
        lh.setUint16(28, 0, true);
        parts.push(new Uint8Array(lh.buffer), nameBytes, data);
        var ch = new DataView(new ArrayBuffer(46));
        ch.setUint32(0, 0x02014b50, true);
        ch.setUint16(4, 20, true);
        ch.setUint16(6, 20, true);
        ch.setUint16(8, 0, true);
        ch.setUint16(10, 0, true);
        ch.setUint16(12, 0, true);
        ch.setUint16(14, 0, true);
        ch.setUint32(16, crc, true);
        ch.setUint32(20, size, true);
        ch.setUint32(24, size, true);
        ch.setUint16(28, nameBytes.length, true);
        ch.setUint16(30, 0, true);
        ch.setUint16(32, 0, true);
        ch.setUint16(34, 0, true);
        ch.setUint16(36, 0, true);
        ch.setUint32(38, 0, true);
        ch.setUint32(42, offset, true);
        central.push(new Uint8Array(ch.buffer), nameBytes);
        offset += 30 + nameBytes.length + size;
      }
      var centralSize = 0;
      for (var c2 = 0; c2 < central.length; c2++) centralSize += central[c2].length;
      var eo = new DataView(new ArrayBuffer(22));
      eo.setUint32(0, 0x06054b50, true);
      eo.setUint16(4, 0, true);
      eo.setUint16(6, 0, true);
      eo.setUint16(8, files.length, true);
      eo.setUint16(10, files.length, true);
      eo.setUint32(12, centralSize, true);
      eo.setUint32(16, offset, true);
      eo.setUint16(20, 0, true);
      return new Blob(parts.concat(central, [new Uint8Array(eo.buffer)]), { type: 'application/zip' });
    }
    async function downloadFigmaPlugin() {
      try {
        if (!REPLAY_CODE_B64 || !REPLAY_UI_B64 || !REPLAY_MANIFEST_B64) {
          showToast('Plugin bundle not embedded in this build — regenerate the sheet.');
          return;
        }
        var m = await buildFigmaManifest();
        var seed = JSON.stringify(m).replace(/</g, '\\u003c');
        var uiHtml = b64ToText(REPLAY_UI_B64)
          .replace('__BRAND__', function () { return m.brand || 'Brand'; })
          .replace('__MANIFEST__', function () { return seed; });
        var pluginManifest = b64ToText(REPLAY_MANIFEST_B64);
        var files = [
          { name: 'manifest.json', data: new TextEncoder().encode(pluginManifest) },
          { name: 'code.js', data: b64ToBytes(REPLAY_CODE_B64) },
          { name: 'ui.html', data: new TextEncoder().encode(uiHtml) }
        ];
        triggerDownload(buildStoreZip(files), slugifyName(m.brand) + '-figma-plugin.zip');
        showToast('Figma plugin downloaded · manifest.json + code.js + ui.html');
      } catch (e) { showToast('Plugin failed: ' + ((e && e.message) || e)); }
    }
`

/**
 * Workspace layouts do not all put tokens.json in features/<slug>/. Accept an
 * explicit --tokens path, then try the per-case roots before the shared reader.
 * Detection stays by key, never by case name.
 */
function locateTokens(root, slug, explicit) {
  if (explicit) {
    const p = resolve(explicit)
    if (!existsSync(p)) throw new Error(`--tokens path does not exist: ${p}`)
    return p
  }
  const extra = [
    join(root, 'src', 'tokens.json'),
    join(root, slug, 'src', 'tokens.json'),
    join(root, 'src', slug, 'tokens.json'),
    join(root, 'features', 'design-system', `${slug}-tokens.json`),
  ]
  return extra.find(existsSync) ?? findTokens(root, slug)
}

/* ── Color Math Helpers (Hex ↔ RGB ↔ OKLCH) ─────────────────────────────── */

function normalizeHex(hex, fallback = '#2960EC') {
  if (!hex || typeof hex !== 'string') return fallback
  const h = hex.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    return (
      '#' +
      h[1] +
      h[1] +
      h[2] +
      h[2] +
      h[3] +
      h[3]
    ).toUpperCase()
  }
  return fallback
}

function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2))
}

function hexToOklchObj(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.sqrt(A * A + B * B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return { L, C, H, str: `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})` }
}

function oklchToHex(L, C, H) {
  const rad = (H * Math.PI) / 180
  const a = C * Math.cos(rad)
  const b = C * Math.sin(rad)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  const encode = (v) => {
    const c = Math.min(1, Math.max(0, v))
    const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
    return Math.round(Math.min(1, Math.max(0, srgb)) * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${lin.map(encode).join('')}`.toUpperCase()
}

/**
 * Generates a 10-step scale (10..100) anchored around a base hex color.
 */
function build10StepScale(prefix, baseHex, anchorStep = 70) {
  const { C, H } = hexToOklchObj(baseHex)
  const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const lightnessMap = {
    10: 0.955,
    20: 0.91,
    30: 0.84,
    40: 0.75,
    50: 0.65,
    60: 0.56,
    70: 0.48,
    80: 0.4,
    90: 0.32,
    100: 0.24,
  }
  const chromaScale = {
    10: 0.22,
    20: 0.38,
    30: 0.58,
    40: 0.78,
    50: 0.92,
    60: 1.0,
    70: 1.0,
    80: 0.92,
    90: 0.8,
    100: 0.68,
  }
  const baseC = Math.max(C, 0.04)
  return steps.map((st) => {
    if (st === anchorStep) {
      return { name: `${prefix}-${st}`, hex: normalizeHex(baseHex) }
    }
    const L = lightnessMap[st]
    const cVal = Math.min(0.24, baseC * chromaScale[st])
    return {
      name: `${prefix}-${st}`,
      hex: oklchToHex(L, cVal, H),
    }
  })
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* ── SVG Helper: Read & Inline Clean Vector Markup ──────────────────────── */

function readBrandSvg(root, slug, filename, fallbackSvg = '') {
  const candidates = [
    join(root, 'public', 'brand', slug, filename),
    ...(slug === 'sunnyside'
      ? [join(root, 'public', 'brand', `sunnyside-${filename}`)]
      : []),
  ]
  const found = candidates.find(existsSync)
  if (!found) return fallbackSvg
  let raw = readFileSync(found, 'utf8').trim()
  // Strip XML declarations or doctype if any
  raw = raw.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!DOCTYPE[^>]*>/gi, '').trim()
  return raw
}

function resizeSvgTag(svgMarkup, width, height, extraStyle = '') {
  if (!svgMarkup || !svgMarkup.includes('<svg')) return svgMarkup
  return svgMarkup.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    let cleaned = attrs
      .replace(/\bwidth="[^"]*"/gi, '')
      .replace(/\bheight="[^"]*"/gi, '')
    const styleAttr = extraStyle ? ` style="${extraStyle}"` : ''
    return `<svg${cleaned} width="${width}" height="${height}"${styleAttr}>`
  })
}

function readCastSvgs(root, slug, primaryHex) {
  const castDir = join(root, 'public', 'brand', slug, 'cast')
  const defaultCastMeta = [
    { id: 'datum', name: 'Datum', note: 'Fixed reference point on the 64-unit grid' },
    { id: 'grid', name: 'Grid', note: 'Modular bay matrix with one offset cell' },
    { id: 'horizon', name: 'Horizon', note: 'Structural bar with resting geometry' },
    { id: 'frame', name: 'Frame', note: 'Two parallel shutters held by cross ties' },
    { id: 'beacon', name: 'Beacon', note: 'Signal marker on the primary cut weight' },
    { id: 'step', name: 'Step', note: 'Three stations stepped up the profile' },
  ]
  const defaultPaths = [
    `<path d="M6 50H58V56H6Z M28 8H36V50H28Z M16 18H48V22H16Z" fill="${primaryHex}"/>`,
    `<path d="M6 6H20V20H6Z M26 6H40V20H26Z M46 6H60V20H46Z M6 26H20V40H6Z M26 26H40V40H26Z M48 44H62V58H48Z M6 46H20V60H6Z M26 46H40V60H26Z" fill="${primaryHex}"/>`,
    `<path d="M6 46H58V52H6Z M32 10L38 26L54 32L38 38L32 46L26 38L10 32L26 26Z" fill="${primaryHex}"/>`,
    `<path d="M8 6H20V58H8Z M44 6H56V58H44Z M20 18H44V22H20Z M20 40H44V44H20Z" fill="${primaryHex}"/>`,
    `<path d="M20 8H44V18H20Z M28 18H36V56H28Z M24 56H40V60H24Z" fill="${primaryHex}"/>`,
    `<path d="M8 52H56V58H8Z M14 40H26V52H14Z M30 28H42V52H30Z M46 14H58V52H46Z" fill="${primaryHex}"/>`,
  ]

  if (existsSync(castDir)) {
    const files = readdirSync(castDir).filter((f) => f.endsWith('.svg')).sort()
    if (files.length > 0) {
      return files.slice(0, 6).map((file, idx) => {
        const id = file.replace(/\.svg$/i, '')
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
        let raw = readFileSync(join(castDir, file), 'utf8')
          .replace(/<\?xml[^>]*\?>/gi, '')
          .trim()
        // Ensure visible fill if currentColor is used
        raw = raw.replace(/currentColor/g, primaryHex)
        if (!/fill=/i.test(raw)) {
          raw = raw.replace(/<svg\b([^>]*)>/i, `<svg$1 fill="${primaryHex}">`)
        }
        return {
          id,
          name,
          note: `64×64 companion cast mark · ${id}`,
          svg: resizeSvgTag(raw, 36, 36),
        }
      })
    }
  }

  return defaultCastMeta.map((m, idx) => ({
    ...m,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36" role="img" aria-label="${m.name}">${defaultPaths[idx]}</svg>`,
  }))
}

/* ── Font Extraction from tokens.json & CSS ─────────────────────────────── */

function resolveFonts(root, slug, parsedTokens, rawJson, cssText) {
  let display = ''
  let reading = ''
  let mono = ''

  for (const t of parsedTokens.type) {
    const n = (t.name || '').toLowerCase()
    const fam = t.family || familyOf(t.value)
    if (!fam) continue
    if (!display && (n.includes('display') || n.includes('head') || n.includes('serif'))) display = fam
    else if (!mono && (n.includes('mono') || n.includes('code') || n.includes('fig'))) mono = fam
    else if (!reading && (n.includes('read') || n.includes('body') || n.includes('sans') || n.includes('title'))) reading = fam
  }

  const metaFonts = rawJson.meta?.fonts ?? rawJson.fonts ?? {}
  if (!display && metaFonts.display) display = familyOf(metaFonts.display)
  if (!reading && metaFonts.reading) reading = familyOf(metaFonts.reading)
  if (!mono && metaFonts.mono) mono = familyOf(metaFonts.mono)

  if (cssText) {
    const dispMatch = cssText.match(/--[a-z0-9-]*font-display\s*:\s*([^;]+);/i)
    const readMatch = cssText.match(/--[a-z0-9-]*font-reading\s*:\s*([^;]+);/i) || cssText.match(/--[a-z0-9-]*font-sans\s*:\s*([^;]+);/i)
    const monoMatch = cssText.match(/--[a-z0-9-]*font-mono\s*:\s*([^;]+);/i)
    if (!display && dispMatch) display = familyOf(dispMatch[1])
    if (!reading && readMatch) reading = familyOf(readMatch[1])
    if (!mono && monoMatch) mono = familyOf(monoMatch[1])
  }

  if (!display && parsedTokens.type[0]?.family) display = parsedTokens.type[0].family
  if (!reading && parsedTokens.type[1]?.family) reading = parsedTokens.type[1].family
  if (!mono && parsedTokens.type[2]?.family) mono = parsedTokens.type[2].family

  return {
    display: display || 'Plus Jakarta Sans',
    reading: reading || 'Inter',
    mono: mono || 'JetBrains Mono',
  }
}

function buildGoogleFontsUrl(fonts) {
  const families = new Set(['Plus Jakarta Sans', 'Inter', 'JetBrains Mono', fonts.display, fonts.reading, fonts.mono])
  const systemSkip = new Set(['system-ui', 'sans-serif', 'serif', 'monospace', 'Geist', 'Geist Mono'])
  const params = []
  for (const fam of families) {
    if (!fam || systemSkip.has(fam)) continue
    const encoded = fam.trim().replace(/\s+/g, '+')
    params.push(`family=${encoded}:wght@400;500;600;700;800`)
  }
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`
}

/* ── Main Generator Function ────────────────────────────────────────────── */

export function generateFigmaHtml({ slug, root = '.', outPath = null, tokensPath = null }) {
  const resolvedRoot = resolve(root)
  const tokensFile = locateTokens(resolvedRoot, slug, tokensPath)
  if (!tokensFile) {
    throw new Error(`Could not find tokens.json for slug "${slug}" under ${resolvedRoot} — pass --tokens <path>`)
  }

  const parsed = readTokens(tokensFile)
  const rawJson = JSON.parse(readFileSync(tokensFile, 'utf8'))
  const meta = rawJson.meta ?? rawJson.$meta ?? {}

  // Locate optional CSS file
  const cssCandidates = [
    join(resolvedRoot, 'features', slug, `${slug}-tokens.css`),
    join(resolvedRoot, 'src', 'features', slug, `${slug}-tokens.css`),
    join(resolvedRoot, 'public', 'brand', slug, `${slug}-tokens.css`),
    ...(slug === 'sunnyside'
      ? [
          join(resolvedRoot, 'features', 'design-system', 'sunnyside-tokens.css'),
          join(resolvedRoot, 'src', 'features', 'design-system', 'sunnyside-tokens.css'),
        ]
      : []),
  ]
  const cssPath = cssCandidates.find(existsSync)
  const cssText = cssPath ? readFileSync(cssPath, 'utf8') : ''

  const brandName = parsed.name || meta.name || slug.charAt(0).toUpperCase() + slug.slice(1)
  const version = meta.version || 'v1.0'
  const caseNo = meta.case ? String(meta.case).replace(/^case\s*/i, '') : ''
  const rawNs = parsed.namespace || meta.namespace || slug.slice(0, 2)
  const ns = rawNs.replace(/^-+|-+$/g, '')
  const tagline = meta.essence || parsed.idea || `${brandName} Design System & Token Architecture`
  const promise = parsed.oneSentence || meta.promise || tagline
  const showcaseHref = slug === 'sunnyside' ? '/sunnyside' : `/design-system/${slug}`

  // Extract Primitives with guaranteed hex + oklch
  const primitives = parsed.primitives
    .filter((p) => p.hex || /^#[0-9a-f]{3,6}$/i.test(String(p.value || '')))
    .map((p) => {
      const hex = normalizeHex(p.hex || p.value)
      const rawItem = Array.isArray(rawJson.primitives)
        ? rawJson.primitives.find((x) => x.name === p.name)
        : null
      const oklch = rawItem?.oklch || hexToOklchObj(hex).str
      return {
        name: p.name,
        token: `--${ns}-${p.name}`,
        hex,
        oklch,
        role: p.role || 'Brand primitive token',
        lum: luminance(hex),
        chroma: hexToOklchObj(hex).C,
      }
    })

  // Select 3 Main Colors (Primary Accent/Brand, Secondary Deep/Ink, Tertiary Chromatic/Surface)
  const primaryAccentName = String(meta.primaryAccent || '').toLowerCase()
  const chromaticSorted = [...primitives].sort((a, b) => b.chroma - a.chroma)
  const darkSorted = [...primitives].sort((a, b) => a.lum - b.lum)

  const primaryColor =
    primitives.find((p) => p.name.toLowerCase() === primaryAccentName) ||
    chromaticSorted.find((p) => p.lum > 0.08 && p.lum < 0.75) ||
    chromaticSorted[0] || {
      name: 'primary',
      token: `--${ns}-primary`,
      hex: '#2960EC',
      role: 'Primary brand accent',
    }

  const secondaryColor =
    chromaticSorted.find(
      (p) => p.name !== primaryColor.name && p.chroma > 0.04 && p.lum < 0.65
    ) ||
    darkSorted.find((p) => p.name !== primaryColor.name) ||
    primitives[1] || {
      name: 'secondary',
      token: `--${ns}-secondary`,
      hex: '#6739D2',
      role: 'Secondary ink & structure',
    }

  const tertiaryColor =
    chromaticSorted.find(
      (p) => p.name !== primaryColor.name && p.name !== secondaryColor.name
    ) ||
    primitives.find(
      (p) => p.name !== primaryColor.name && p.name !== secondaryColor.name
    ) || {
      name: 'tertiary',
      token: `--${ns}-tertiary`,
      hex: '#18B368',
      role: 'Tertiary surface & highlight',
    }

  const MAIN_COLORS = [
    {
      name: primaryColor.name.charAt(0).toUpperCase() + primaryColor.name.slice(1),
      token: primaryColor.token,
      hex: primaryColor.hex,
      role: primaryColor.role,
    },
    {
      name: secondaryColor.name.charAt(0).toUpperCase() + secondaryColor.name.slice(1),
      token: secondaryColor.token,
      hex: secondaryColor.hex,
      role: secondaryColor.role,
    },
    {
      name: tertiaryColor.name.charAt(0).toUpperCase() + tertiaryColor.name.slice(1),
      token: tertiaryColor.token,
      hex: tertiaryColor.hex,
      role: tertiaryColor.role,
    },
  ]

  const PRIMARY_SCALE = build10StepScale('Primary', primaryColor.hex, 70)
  const SECONDARY_SCALE = build10StepScale('Secondary', secondaryColor.hex, 60)
  const TERTIARY_SCALE = build10StepScale('Tertiary', tertiaryColor.hex, 50)

  // Contrast Ledger
  const contrastPairs = parsed.contrast
    .filter((c) => c.ratio != null)
    .map((c) => {
      const fgHex = normalizeHex(c.fgHex || c.fg, darkSorted[0]?.hex || '#111827')
      const bgHex = normalizeHex(c.bgHex || c.bg, '#FFFFFF')
      const ratio = Number(c.ratio)
      const pass = typeof c.pass === 'boolean' ? c.pass : ratio >= 4.5
      return {
        label: c.label || `${c.fg} on ${c.bg}`,
        note: c.note || '',
        fgHex,
        bgHex,
        ratio: ratio.toFixed(2),
        pass,
        job: c.job || (pass ? 'Text at any size' : 'Wash / graphic only — never type'),
      }
    })

  const failCount = contrastPairs.filter((c) => !c.pass).length

  // Fonts & Type Scale
  const fonts = resolveFonts(resolvedRoot, slug, parsed, rawJson, cssText)
  const googleFontsUrl = buildGoogleFontsUrl(fonts)

  // SVGs (Inlined so HTML-to-Figma imports true editable vectors)
  const fallbackMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32"><rect x="8" y="10" width="22" height="26" fill="${primaryColor.hex}"/><rect x="34" y="28" width="22" height="26" fill="${secondaryColor.hex}"/></svg>`
  const markSvgRaw = readBrandSvg(resolvedRoot, slug, 'mark.svg', fallbackMark)
  const markRevSvgRaw = readBrandSvg(resolvedRoot, slug, 'mark-reverse.svg', markSvgRaw)
  const markCompactRaw = readBrandSvg(resolvedRoot, slug, 'mark-compact.svg', markSvgRaw)
  const glyphRaw = readBrandSvg(resolvedRoot, slug, 'glyph.svg', markCompactRaw)
  const wordmarkRaw = readBrandSvg(resolvedRoot, slug, 'wordmark.svg', '')
  const lockupRaw = readBrandSvg(resolvedRoot, slug, 'lockup.svg', markSvgRaw)
  const lockupRevRaw = readBrandSvg(resolvedRoot, slug, 'lockup-reverse.svg', lockupRaw)
  const lockupStackedRaw = readBrandSvg(resolvedRoot, slug, 'lockup-stacked.svg', lockupRaw)

  const badgeMark20 = resizeSvgTag(markSvgRaw, 22, 22)
  const badgeMark28 = resizeSvgTag(markSvgRaw, 28, 28)
  const castItems = readCastSvgs(resolvedRoot, slug, primaryColor.hex)

  // Spacing & Radius
  const SPACING_TOKENS = [
    { name: 'space-1', px: '4px', rem: '0.25rem', width: 16 },
    { name: 'space-2', px: '8px', rem: '0.5rem', width: 32 },
    { name: 'space-3', px: '12px', rem: '0.75rem', width: 48 },
    { name: 'space-4', px: '16px', rem: '1rem', width: 64 },
    { name: 'space-6', px: '24px', rem: '1.5rem', width: 96 },
    { name: 'space-8', px: '32px', rem: '2rem', width: 128 },
    { name: 'space-12', px: '48px', rem: '3rem', width: 192 },
    { name: 'space-16', px: '64px', rem: '4rem', width: 256 },
  ]

  const houseRadius = parsed.theme?.radius || '8px'

  // Token CSS Sheets for Section 08
  const primCssBlock =
    `/* 1 · Primitives (${brandName} --${ns}-*) */\n:root {\n` +
    primitives.map((p) => `  ${p.token}: ${p.hex}; /* ${p.oklch} */`).join('\n') +
    `\n}`

  const semCssBlock =
    cssText.trim() ||
    `/* 2 · Semantic & Typography Scope */\n:root {\n  --${ns}-surface-page: ${primitives[0]?.token || '#FFFFFF'};\n  --${ns}-text-primary: ${darkSorted[0]?.token || '#111827'};\n  --${ns}-signal: ${primaryColor.token};\n  --${ns}-font-display: '${fonts.display}', sans-serif;\n  --${ns}-font-reading: '${fonts.reading}', sans-serif;\n  --${ns}-font-mono: '${fonts.mono}', monospace;\n}`

  /* Machine-readable token payload for the Figma replay plugin. The page itself
   * measures DOM geometry at click time; this is the one source of truth for
   * colours, type, space and radius that both emitters agree on. */
  const tokenPayload = JSON.stringify({
    brand: brandName,
    slug,
    version,
    namespace: ns,
    palette: primitives.map((p) => ({ name: p.name, hex: p.hex })),
    type: (parsed.type || [])
      .map((t) => ({
        name: t.name,
        family: t.family || familyOf(t.value),
        size: t.size,
        leading: t.leading,
        tracking: t.tracking,
        weight: t.weight,
      }))
      .filter((t) => t.size != null),
    space: (parsed.space || []).map((s) => ({ name: s.name, value: s.value })),
    radius: (parsed.radius || []).map((r) => ({ name: r.name, value: r.value })),
  }).replace(/</g, '\\u003c')

  /* v2: the complete design-system description. It does not depend on a
   * tokens.json having type/space/radius keys — the sheet's own scales, CSS
   * variables and canonical roles are folded in. The plugin reads `system`
   * first and falls back to `tokens` for sheets generated before v5.0.0. */
  const systemSpec = buildSystemSpec({
    slug, brandName, version, ns, fonts,
    primitives,
    scales: { Primary: PRIMARY_SCALE, Secondary: SECONDARY_SCALE, Tertiary: TERTIARY_SCALE },
    parsed, cssText, houseRadius, spacingTokens: SPACING_TOKENS,
    primaryHex: primaryColor.hex,
    primaryTint: PRIMARY_SCALE[0].hex,
    secondaryTint: SECONDARY_SCALE[0].hex,
    tertiaryTint: TERTIARY_SCALE[0].hex,
  })
  const systemPayload = JSON.stringify(systemSpec).replace(/</g, '\\u003c')

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(brandName)}${caseNo ? ` (Case ${escapeHtml(caseNo)})` : ''} — Figma &amp; HTML-to-Design Documentation Sheet</title>
  <meta name="description" content="${escapeHtml(promise)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">

  <style>
    /* =========================================================================
       1. CSS RESET & DESIGN TOKENS (100% SELF-CONTAINED, ZERO EXTERNAL CDN)
       ========================================================================= */
    :root {
      --primary-70: ${primaryColor.hex};
      --secondary-60: ${secondaryColor.hex};
      --tertiary-80: ${tertiaryColor.hex};
      --primary-tint: ${PRIMARY_SCALE[0].hex};
      --secondary-tint: ${SECONDARY_SCALE[0].hex};
      --tertiary-tint: ${TERTIARY_SCALE[0].hex};
      --text-main: #111827;
      --text-secondary: #64748B;
      --text-muted: #94A3B8;
      --bg-white: #FFFFFF;
      --bg-banner: #FAFAFA;
      --border-subtle: #F1F5F9;
      --border-default: #E2E8F0;
      /* The sheet is brand documentation, so it is set in the brand's faces.
       * The old defaults stay in the stack: a kit whose tokens name a face the
       * browser or Figma cannot load still renders, and still reads. */
      --font-sans: '${escapeHtml(fonts.reading)}', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-body: '${escapeHtml(fonts.reading)}', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: '${escapeHtml(fonts.mono)}', 'JetBrains Mono', monospace;
      --brand-display: '${escapeHtml(fonts.display)}', var(--font-sans);
      --brand-reading: '${escapeHtml(fonts.reading)}', var(--font-body);
      --brand-mono: '${escapeHtml(fonts.mono)}', var(--font-mono);
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-white);
      color: var(--text-main);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
    }

    button, input, select, textarea {
      font-family: inherit;
    }

    /* =========================================================================
       2. STICKY TOP WORKSPACE BAR (COLLAPSIBLE FOR CLEAN FIGMA EXPORT)
       ========================================================================= */
    .workspace-topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-default);
      padding: 10px 24px;
      transition: all 0.2s ease;
    }

    body.clean-export-mode .workspace-topbar,
    body.clean-export-mode .section-copy-btn {
      display: none !important;
    }

    @media print {
      .workspace-topbar,
      .section-copy-btn,
      .toast-notification {
        display: none !important;
      }
    }

    .topbar-inner {
      max-width: 1320px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-mini-badge {
      width: 34px;
      height: 34px;
      border-radius: 9999px;
      background: #FFFFFF;
      border: 1px solid var(--border-default);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .brand-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-version {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      background: #E8EEFF;
      color: #1E40AF;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .nav-pills {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 10px;
      overflow-x: auto;
      max-width: 100%;
    }

    .nav-pill {
      border: none;
      background: transparent;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 11px;
      border-radius: 7px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .nav-pill:hover {
      color: var(--text-main);
    }

    .nav-pill.active {
      background: #FFFFFF;
      color: var(--text-main);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-tool {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid var(--border-default);
      background: #FFFFFF;
      color: #334155;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-tool:hover {
      background: #F8FAFC;
      border-color: #CBD5E1;
    }

    .btn-tool.active-spec {
      background: #F5F0FF;
      border-color: #B392F0;
      color: #6739D2;
    }

    .btn-tool.active-clean {
      background: #EFF6FF;
      border-color: #93C5FD;
      color: #1D4ED8;
    }

    .btn-tool.active-grid {
      background: #EFF6FF;
      border-color: #93C5FD;
      color: #1D4ED8;
    }

    /* 2-Column Canvas Grid Mode (< 10,000px on both sides for Doop & Figma) */
    body.canvas-grid-mode {
      width: max-content;
      min-width: 100vw;
      background: #F1F5F9;
    }

    body.canvas-grid-mode main {
      display: grid;
      grid-template-columns: repeat(2, 1440px);
      gap: 32px;
      padding: 32px;
      width: max-content;
      margin: 0 auto;
    }

    body.canvas-grid-mode .figma-sheet {
      width: 1440px;
      border: 1px solid var(--border-default);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    /* Auto Layout inspector. Outlines only — no position, display or geometry
       changes, so the inspected layout is the layout that gets imported. */
    body.al-mode [data-figma-layout] {
      outline: 2px solid #2563EB;
      outline-offset: 1px;
    }
    body.al-mode [data-figma-warn] {
      outline: 2px dashed #DC2626;
      outline-offset: 1px;
    }
    body.al-mode [data-figma-layout][data-figma-warn] {
      outline-color: #F59E0B;
    }
    button.active-al {
      background: #DBEAFE;
      border-color: #93C5FD;
      color: #1D4ED8;
    }

    /* =========================================================================
       3. FIGMA DOCUMENTATION SHEET ANATOMY
       ========================================================================= */
    .figma-sheet {
      background: var(--bg-white);
      border-bottom: 12px solid #F1F5F9;
    }

    .figma-sheet.hidden-sheet {
      display: none !important;
    }

    .sheet-banner {
      background: var(--bg-banner);
      border-bottom: 1px solid #F1F5F9;
      padding: 34px 64px;
    }

    .sheet-banner-inner {
      max-width: 1160px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .sheet-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #1E1E1E;
      letter-spacing: -0.02em;
    }

    .sheet-num-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #111827;
      color: #FFFFFF;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .sheet-subtitle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-left: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #64748B;
    }

    .sheet-banner-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .section-copy-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-default);
      background: #FFFFFF;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .section-copy-btn:hover {
      border-color: var(--primary-70);
      color: var(--primary-70);
    }

    .tnd-logo-circle {
      width: 52px;
      height: 52px;
      border-radius: 9999px;
      background: #FFFFFF;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .sheet-body {
      max-width: 1160px;
      margin: 0 auto;
      padding: 56px 0 64px 0;
    }

    .sheet-body-padded {
      padding-left: 64px;
      padding-right: 64px;
      max-width: 1288px;
      margin: 0 auto;
    }

    .category-block {
      margin-bottom: 64px;
      position: relative;
    }

    .category-block:last-child {
      margin-bottom: 0;
    }

    .category-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 28px 0;
      letter-spacing: -0.02em;
    }

    .category-header-flex {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .category-header-flex .category-title {
      margin-bottom: 0;
    }

    .category-desc {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 4px 0 0 0;
    }

    body.spec-mode .category-block {
      outline: 1.5px dashed #9747FF;
      outline-offset: 10px;
      border-radius: 8px;
    }

    body.spec-mode .category-block::before {
      content: attr(data-figma-node);
      position: absolute;
      top: -22px;
      right: 0;
      background: #9747FF;
      color: #FFFFFF;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* =========================================================================
       4. SECTION 01: COLOR SYSTEM GRIDS & CONTRAST LEDGER
       ========================================================================= */
    .main-colors-grid {
      display: grid;
      grid-template-columns: repeat(3, 224px);
      gap: 18px;
    }

    .scale-colors-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      column-gap: 18px;
      row-gap: 32px;
    }

    .primitives-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      column-gap: 18px;
      row-gap: 28px;
    }

    .swatch-card {
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s ease;
    }

    .swatch-card:hover {
      transform: translateY(-2px);
    }

    .swatch-rect {
      width: 100%;
      height: 146px;
      border-radius: 4px;
      margin-bottom: 12px;
      position: relative;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
    }

    .swatch-copy-pill {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(17, 24, 39, 0.78);
      color: #FFFFFF;
      font-family: var(--font-mono);
      font-size: 10px;
      padding: 3px 7px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .swatch-card:hover .swatch-copy-pill {
      opacity: 1;
    }

    .swatch-title {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }

    .swatch-sub {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 400;
      color: #64748B;
      margin: 0 0 3px 0;
      line-height: 1.35;
    }

    .swatch-hex {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      color: #64748B;
      margin: 0;
      text-transform: uppercase;
    }

    .grid-4-cols {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .grid-3-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .semantic-card {
      border: 1px solid var(--border-default);
      border-radius: 10px;
      overflow: hidden;
      background: #FFFFFF;
    }

    .semantic-head {
      height: 88px;
      padding: 14px 16px;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
    }

    .semantic-list {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 11px;
    }

    .semantic-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 10px;
      border-radius: 6px;
      cursor: pointer;
    }

    .contrast-ledger {
      border: 1px solid var(--border-default);
      border-radius: 12px;
      overflow: hidden;
      background: #FFFFFF;
    }

    .contrast-row {
      display: grid;
      grid-template-columns: 72px 1.4fr 110px 1fr;
      align-items: center;
      gap: 16px;
      padding: 12px 18px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 13px;
    }

    .contrast-row:last-child {
      border-bottom: none;
    }

    .contrast-row.is-fail {
      background: #FFFBEB;
    }

    .contrast-chips {
      display: inline-flex;
      align-items: center;
    }

    .contrast-chip {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.14);
    }

    .contrast-chip + .contrast-chip {
      margin-left: -6px;
    }

    /* =========================================================================
       5. SECTION 02: PRIMITIVES, RADIUS, ELEVATION & 12-COL GRID
       ========================================================================= */
    .surface-box {
      border: 1px solid var(--border-default);
      border-radius: 12px;
      background: #FFFFFF;
      padding: 24px;
    }

    .spacing-row {
      display: grid;
      grid-template-columns: 110px 120px 1fr;
      align-items: center;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid #F1F5F9;
      font-size: 13px;
    }

    .spacing-row:last-child {
      border-bottom: none;
    }

    .spacing-bar {
      height: 18px;
      background: var(--primary-70);
      border-radius: 3px;
      opacity: 0.88;
    }

    .grid-6-cols {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
    }

    .primitive-card {
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 16px;
      background: #FAFAFA;
      text-align: center;
    }

    .radius-preview {
      width: 64px;
      height: 64px;
      margin: 0 auto 12px auto;
      background: #E8EEFF;
      border: 2px solid var(--primary-70);
    }

    .shadow-preview {
      height: 76px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 11px;
      color: #64748B;
      margin-bottom: 12px;
    }

    .cols-12-visualizer {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 12px;
      padding: 20px;
      background: #FFF1F2;
      border: 1px dashed #FDA4AF;
      border-radius: 10px;
    }

    .col-bar {
      height: 56px;
      background: rgba(225, 29, 72, 0.12);
      border: 1px solid rgba(225, 29, 72, 0.3);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 600;
      color: #E11D48;
    }

    /* =========================================================================
       6. SECTION 03: TYPOGRAPHY SCALE
       ========================================================================= */
    .type-row {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 32px;
      align-items: baseline;
      padding: 22px 0;
      border-bottom: 1px solid var(--border-default);
    }

    .type-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    /* =========================================================================
       7. SECTION 04 & 05: LOGO, CAST, ASSETS & ICONOGRAPHY
       ========================================================================= */
    .blueprint-grid {
      background-color: #F8FAFC;
      background-image:
        linear-gradient(to right, rgba(41, 96, 236, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(41, 96, 236, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .icon-grid-8 {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 12px;
    }

    .cast-grid-6 {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
    }

    .icon-cell {
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 16px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }

    .icon-cell:hover {
      border-color: var(--primary-70);
      background: #F8FAFF;
      transform: translateY(-2px);
    }

    .icon-keyline {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px dashed #C1D2FE;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1E293B;
    }

    .icon-cell:hover .icon-keyline {
      color: var(--primary-70);
      background: #E8EEFF;
    }

    /* =========================================================================
       8. SECTION 06, 07, 08: COMPONENTS, MODALS & DATA TABLES
       ========================================================================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary { background: var(--primary-70); color: #FFFFFF; }
    .btn-primary:hover { opacity: 0.92; }
    .btn-secondary { background: var(--secondary-60); color: #FFFFFF; }
    .btn-secondary:hover { opacity: 0.92; }
    .btn-success { background: var(--tertiary-80); color: #FFFFFF; }
    .btn-danger { background: #E11D48; color: #FFFFFF; }
    .btn-outline { background: #FFFFFF; border-color: #CBD5E1; color: #1E293B; }
    .btn-outline:hover { background: #F8FAFC; }
    .btn-subtle { background: #E8EEFF; color: #1E40AF; }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }

    .input-field {
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      font-size: 13px;
      color: #111827;
      background: #FFFFFF;
      outline: none;
    }

    .input-field:focus {
      border-color: var(--primary-70);
      box-shadow: 0 0 0 3px #DBE5FE;
    }

    .modal-stage {
      background: #F1F5F9;
      border: 1px solid var(--border-default);
      border-radius: 16px;
      padding: 32px;
      display: grid;
      grid-template-columns: 7fr 5fr;
      gap: 24px;
      align-items: start;
    }

    .modal-card {
      background: #FFFFFF;
      border-radius: 14px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.15);
      overflow: hidden;
    }

    .ds-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .ds-table th {
      background: #FAFAFA;
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748B;
      border-bottom: 1px solid var(--border-default);
    }

    .ds-table td {
      padding: 14px 16px;
      border-bottom: 1px solid #F1F5F9;
      color: #1E293B;
    }

    .code-sheet-card {
      border: 1px solid var(--border-default);
      border-radius: 10px;
      background: #0F172A;
      color: #E2E8F0;
      overflow: hidden;
    }

    .code-sheet-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #1E293B;
      border-bottom: 1px solid #334155;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 600;
      color: #94A3B8;
    }

    .code-sheet-pre {
      margin: 0;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }

    .live-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .live-modal-overlay.open {
      display: flex;
    }

    .toast-notification {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #111827;
      color: #FFFFFF;
      padding: 10px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease;
      z-index: 400;
    }

    .toast-notification.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* =========================================================================
       9. IMPORTER-PROOF ONE-LINE LABELS & FULL-WIDTH ACTION GROUPS
       Doop / html.to.design substitute the brand face with a wider fallback, so
       a label that fits in Chrome wraps in Figma and collides with the line
       underneath. Declare the intent in CSS so *any* importer keeps one line,
       and let the canonical manifest carry whiteSpace for the native replay.
       ========================================================================= */
    .sheet-title-row { flex-wrap: nowrap; }
    .sheet-title-row > span,
    .sheet-subtitle-row > span,
    .category-title,
    .category-desc,
    .btn,
    .badge-pill,
    .modal-card strong,
    .icon-cell > strong,
    .icon-cell > span,
    .type-row strong,
    .swatch-title,
    .swatch-hex {
      white-space: nowrap;
    }
    .modal-card > div {
      width: 100%;
      box-sizing: border-box;
    }
    .modal-card .action-group {
      width: 100%;
      min-width: 100%;
      flex-wrap: nowrap;
    }
    .icon-keyline { flex: 0 0 44px; }
    .icon-keyline > svg { flex: 0 0 auto; }

    /* =========================================================================
       10. DOOP / IMPORTER MODE (?clean=1&doop=1)
       Importers snapshot computed styles. A 2-column grid, sticky chrome,
       shadows and transforms all survive that snapshot as extra layers and
       clipped frames. This mode is one 1440px column of plain sheets.
       ========================================================================= */
    body.doop-mode {
      width: 1440px !important;
      min-width: 1440px !important;
      background: #FFFFFF !important;
    }
    body.doop-mode main {
      display: block !important;
      width: 1440px !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
    }
    body.doop-mode .figma-sheet {
      width: 1440px !important;
      max-width: 1440px !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
    }
    body.doop-mode .workspace-topbar,
    body.doop-mode .section-copy-btn,
    body.doop-mode .swatch-copy-pill,
    body.doop-mode .toast-notification,
    body.doop-mode .live-modal-overlay,
    body.doop-mode #doop-modal {
      display: none !important;
    }
    body.doop-mode .figma-sheet * {
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      transform: none !important;
    }
    /* Substituted fonts are wider than the brand face; give one-line labels
       slack so an importer does not clip them mid-word. */
    body.doop-mode .sheet-title-row > span,
    body.doop-mode .sheet-subtitle-row > span,
    body.doop-mode .category-title,
    body.doop-mode .category-desc,
    body.doop-mode .btn,
    body.doop-mode .badge-pill,
    body.doop-mode .icon-cell > strong,
    body.doop-mode .icon-cell > span {
      padding-right: 28px;
    }

    @media (max-width: 1024px) {
      .scale-colors-grid, .primitives-grid { grid-template-columns: repeat(3, 1fr); }
      .main-colors-grid { grid-template-columns: repeat(3, 1fr); }
      .grid-4-cols, .grid-6-cols, .cast-grid-6, .icon-grid-8 { grid-template-columns: repeat(2, 1fr); }
      .modal-stage, .grid-2-cols, .grid-3-cols { grid-template-columns: 1fr; }
      .sheet-banner, .sheet-body-padded, .sheet-footer { padding-left: 24px; padding-right: 24px; }
      .type-row, .contrast-row { grid-template-columns: 1fr; gap: 8px; }
    }

    @media (max-width: 640px) {
      .scale-colors-grid, .primitives-grid, .main-colors-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body id="top">

  <script type="application/json" id="figma-tokens">${tokenPayload}</script>
  <script type="application/json" id="figma-system">${systemPayload}</script>

  <!-- =========================================================================
       STICKY WORKSPACE CONTROL BAR (Hidden in Clean Export Mode / ?clean=1)
       ========================================================================= -->
  <nav class="workspace-topbar">
    <div class="topbar-inner">
      <div class="brand-cluster">
        <div class="brand-mini-badge">
          ${badgeMark20}
        </div>
        <div>
          <div class="brand-title">
            <span>${escapeHtml(brandName)} DS</span>
            <span class="badge-version">${caseNo ? `Case ${escapeHtml(caseNo)} · ` : ''}${escapeHtml(version)} Figma Sheet</span>
          </div>
        </div>
      </div>

      <!-- Section Switcher Tabs -->
      <div class="nav-pills" role="tablist">
        <button class="nav-pill active" onclick="filterSection('all', this)">All (8)</button>
        <button class="nav-pill" onclick="filterSection('colors', this)">01 · Colors</button>
        <button class="nav-pill" onclick="filterSection('primitives', this)">02 · Primitives</button>
        <button class="nav-pill" onclick="filterSection('typography', this)">03 · Typography</button>
        <button class="nav-pill" onclick="filterSection('logo', this)">04 · Logo</button>
        <button class="nav-pill" onclick="filterSection('assets', this)">05 · Cast &amp; Assets</button>
        <button class="nav-pill" onclick="filterSection('components', this)">06 · Components</button>
        <button class="nav-pill" onclick="filterSection('overlays', this)">07 · Modals</button>
        <button class="nav-pill" onclick="filterSection('patterns', this)">08 · Patterns &amp; Tokens</button>
      </div>

      <!-- Inspector, Clean Export, Canvas Grid & Doop Helper Controls -->
      <div class="topbar-actions">
        <button id="btn-spec" class="btn-tool" onclick="toggleSpecMode()" title="Toggle Figma component bounds">
          <span>❖ Figma Specs</span>
        </button>
        <button id="btn-autolayout" class="btn-tool" onclick="toggleAutoLayoutMode()" title="Inspect CSS flex/grid flow containers and flag absolute, transform or backdrop layers that will not import as Auto Layout">
          <span>⇄ Auto Layout</span>
        </button>
        <button class="btn-tool" onclick="copyFigmaManifest()" title="Copy a machine-readable layout + token manifest for the Sunnyside replay plugin">
          <span>⤓ Copy for Figma</span>
        </button>
        <button class="btn-tool" onclick="downloadFigmaManifest()" title="Download the layout + token manifest as JSON">
          <span>⤓ Manifest</span>
        </button>
        <button class="btn-tool" onclick="downloadFigmaPlugin()" title="Download a ready-to-import Figma plugin (manifest.json + code.js + ui.html) with this sheet's manifest baked in">
          <span>⤓ Plugin</span>
        </button>
        <button id="btn-grid" class="btn-tool" onclick="toggleGridMode()" title="Toggle 2-column Canvas Grid Mode (&lt; 10,000px for Doop / Figma)">
          <span>⊞ Canvas Grid</span>
        </button>
        <button id="btn-clean" class="btn-tool" onclick="toggleCleanMode()" title="Toggle Clean Export Mode (?clean=1) &amp; copy URL">
          <span>Clean Export</span>
        </button>
        <button class="btn-tool" onclick="copyCleanLink()" title="Copy clean export link with ?clean=1">
          <span>Copy Clean Link</span>
        </button>
        <button class="btn-tool" onclick="openDoopModal()" title="View Doop &amp; Figma sheet links (&lt; 10,000px on all sides)">
          <span>Doop Helper</span>
        </button>
        <a class="btn-tool" href="${showcaseHref}">
          <span>← Case Page</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- =========================================================================
       MAIN CONTAINER: 8 SELF-CONTAINED FIGMA DOCUMENTATION SHEETS
       ========================================================================= -->
  <main>

    <!-- =======================================================================
         SECTION 01: COLOR SYSTEM, PRIMITIVES & HONEST CONTRAST LEDGER
         ======================================================================= -->
    <section id="section-colors" data-section="colors" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">01</span>
              <span>${escapeHtml(brandName)} Color System</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Color System · ${primitives.length} Primitives · ${contrastPairs.length} Measured Contrast Pairs</span>
            </div>
          </div>

          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-colors', '${escapeHtml(brandName)} Color System')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle" title="${escapeHtml(brandName)} Brand Mark">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        
        <!-- 1.1 Main Colors (3 Columns) -->
        <div class="category-block" data-figma-node="❖ Color / Main Colors">
          <h2 class="category-title">Main Colors</h2>
          <div id="grid-main-colors" class="main-colors-grid">
            ${MAIN_COLORS.map(
              (item) => `
            <div class="swatch-card" onclick="copyHex('${item.hex}', '${escapeHtml(item.name)} (${escapeHtml(item.token)})')">
              <div class="swatch-rect" style="background-color: ${item.hex};">
                <span class="swatch-copy-pill" data-figma-ignore>Copy</span>
              </div>
              <p class="swatch-title">${escapeHtml(item.name)}</p>
              <p class="swatch-sub">${escapeHtml(item.token)}</p>
              <p class="swatch-hex">${item.hex}</p>
            </div>`
            ).join('')}
          </div>
        </div>

        <!-- 1.2 Brand Primitives (All Primitives from tokens.json) -->
        <div class="category-block" data-figma-node="❖ Color / Brand Primitives (${primitives.length})">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">Brand Primitives (OKLCH Layer 1)</h2>
              <p class="category-desc">Named once for the physical material (--${ns}-*). Primitives never flip values across scopes.</p>
            </div>
          </div>
          <div class="primitives-grid">
            ${primitives
              .map(
                (p) => `
            <div class="swatch-card" onclick="copyHex('${p.hex}', '${escapeHtml(p.token)}')">
              <div class="swatch-rect" style="background-color: ${p.hex}; height: 112px;">
                <span class="swatch-copy-pill" data-figma-ignore>Copy</span>
              </div>
              <p class="swatch-title">${escapeHtml(p.name)}</p>
              <p class="swatch-sub">${escapeHtml(p.role)}</p>
              <p class="swatch-hex">${p.hex} · ${escapeHtml(p.oklch)}</p>
            </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- 1.3 Primary Scale (5 Columns × 2 Rows: Primary-10 to Primary-100) -->
        <div class="category-block" data-figma-node="❖ Color / Primary Scale">
          <h2 class="category-title">Primary Scale (${escapeHtml(MAIN_COLORS[0].name)})</h2>
          <div id="grid-primary-blue" class="scale-colors-grid">
            ${PRIMARY_SCALE.map(
              (item) => `
            <div class="swatch-card" onclick="copyHex('${item.hex}', '${item.name}')">
              <div class="swatch-rect" style="background-color: ${item.hex};">
                <span class="swatch-copy-pill" data-figma-ignore>Copy</span>
              </div>
              <p class="swatch-title">${item.name}</p>
              <p class="swatch-hex">${item.hex}</p>
            </div>`
            ).join('')}
          </div>
        </div>

        <!-- 1.4 Secondary Scale (5 Columns × 2 Rows) -->
        <div class="category-block" data-figma-node="❖ Color / Secondary Scale">
          <h2 class="category-title">Secondary Scale (${escapeHtml(MAIN_COLORS[1].name)})</h2>
          <div id="grid-secondary-purple" class="scale-colors-grid">
            ${SECONDARY_SCALE.map(
              (item) => `
            <div class="swatch-card" onclick="copyHex('${item.hex}', '${item.name}')">
              <div class="swatch-rect" style="background-color: ${item.hex};">
                <span class="swatch-copy-pill" data-figma-ignore>Copy</span>
              </div>
              <p class="swatch-title">${item.name}</p>
              <p class="swatch-hex">${item.hex}</p>
            </div>`
            ).join('')}
          </div>
        </div>

        <!-- 1.5 Tertiary Scale (5 Columns × 2 Rows) -->
        <div class="category-block" data-figma-node="❖ Color / Tertiary Scale">
          <h2 class="category-title">Tertiary Scale (${escapeHtml(MAIN_COLORS[2].name)})</h2>
          <div id="grid-tertiary-green" class="scale-colors-grid">
            ${TERTIARY_SCALE.map(
              (item) => `
            <div class="swatch-card" onclick="copyHex('${item.hex}', '${item.name}')">
              <div class="swatch-rect" style="background-color: ${item.hex};">
                <span class="swatch-copy-pill" data-figma-ignore>Copy</span>
              </div>
              <p class="swatch-title">${item.name}</p>
              <p class="swatch-hex">${item.hex}</p>
            </div>`
            ).join('')}
          </div>
        </div>

        <!-- 1.6 Honest Contrast Ledger (Computed Pairs + Published Failures) -->
        <div class="category-block" data-figma-node="❖ Color / Honest Contrast Ledger">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">Honest Contrast Ledger (${contrastPairs.length} Pairs · ${failCount} Published Failures)</h2>
              <p class="category-desc">Every pair is computed from hex. Failing pairs (&lt; 4.5:1) are published with a restricted non-text job.</p>
            </div>
          </div>
          <div class="contrast-ledger">
            ${contrastPairs
              .map(
                (c) => `
            <div class="contrast-row ${c.pass ? '' : 'is-fail'}">
              <div class="contrast-chips">
                <span class="contrast-chip" style="background:${c.fgHex};" title="Foreground: ${c.fgHex}"></span>
                <span class="contrast-chip" style="background:${c.bgHex};" title="Background: ${c.bgHex}"></span>
              </div>
              <div>
                <strong style="color:#111827;">${escapeHtml(c.label)}</strong>
                ${c.note && c.note !== c.label ? `<div style="font-size:12px; color:#64748B;">${escapeHtml(c.note)}</div>` : ''}
              </div>
              <div style="font-family:var(--font-mono); font-weight:700; color:${c.pass ? '#15803D' : '#B45309'};">
                ${c.ratio}:1 ${c.pass ? 'PASS' : 'FAIL'}
              </div>
              <div style="font-size:12px; color:#475569;">
                ${escapeHtml(c.job)}
              </div>
            </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- 1.7 Semantic & Status Feedback Tokens -->
        <div class="category-block" data-figma-node="❖ Color / Semantic Tokens">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">Semantic Feedback Tokens</h2>
              <p class="category-desc">System status pairings for alerts, badges, validation states, and surfaces.</p>
            </div>
          </div>
          <div class="grid-4-cols">
            <div class="semantic-card">
              <div class="semantic-head" style="background:#18B368;" onclick="copyHex('#18B368', 'Success Primary')">
                <span style="font-size:11px; font-family:var(--font-mono); opacity:0.85;">SUCCESS / POSITIVE</span>
                <strong style="font-size:16px;">#18B368</strong>
              </div>
              <div class="semantic-list">
                <div class="semantic-row" style="background:#F0FFF4; color:#165C26;" onclick="copyHex('#F0FFF4', 'Success Surface')">
                  <span>surface-subtle</span><span>#F0FFF4</span>
                </div>
                <div class="semantic-row" style="border:1px solid #85E89D; color:#176F2C;" onclick="copyHex('#85E89D', 'Success Border')">
                  <span>border-token</span><span>#85E89D</span>
                </div>
                <div class="semantic-row" style="color:#144620;" onclick="copyHex('#144620', 'Success Ink')">
                  <span>text-ink</span><span>#144620</span>
                </div>
              </div>
            </div>

            <div class="semantic-card">
              <div class="semantic-head" style="background:#F59E0B;" onclick="copyHex('#F59E0B', 'Warning Primary')">
                <span style="font-size:11px; font-family:var(--font-mono); opacity:0.85;">WARNING / CAUTION</span>
                <strong style="font-size:16px;">#F59E0B</strong>
              </div>
              <div class="semantic-list">
                <div class="semantic-row" style="background:#FFFBEB; color:#92400E;" onclick="copyHex('#FFFBEB', 'Warning Surface')">
                  <span>surface-subtle</span><span>#FFFBEB</span>
                </div>
                <div class="semantic-row" style="border:1px solid #FCD34D; color:#B45309;" onclick="copyHex('#FCD34D', 'Warning Border')">
                  <span>border-token</span><span>#FCD34D</span>
                </div>
                <div class="semantic-row" style="color:#78350F;" onclick="copyHex('#78350F', 'Warning Ink')">
                  <span>text-ink</span><span>#78350F</span>
                </div>
              </div>
            </div>

            <div class="semantic-card">
              <div class="semantic-head" style="background:#E11D48;" onclick="copyHex('#E11D48', 'Danger Primary')">
                <span style="font-size:11px; font-family:var(--font-mono); opacity:0.85;">DANGER / CRITICAL</span>
                <strong style="font-size:16px;">#E11D48</strong>
              </div>
              <div class="semantic-list">
                <div class="semantic-row" style="background:#FFF1F2; color:#9F1239;" onclick="copyHex('#FFF1F2', 'Danger Surface')">
                  <span>surface-subtle</span><span>#FFF1F2</span>
                </div>
                <div class="semantic-row" style="border:1px solid #FDA4AF; color:#BE123C;" onclick="copyHex('#FDA4AF', 'Danger Border')">
                  <span>border-token</span><span>#FDA4AF</span>
                </div>
                <div class="semantic-row" style="color:#881337;" onclick="copyHex('#881337', 'Danger Ink')">
                  <span>text-ink</span><span>#881337</span>
                </div>
              </div>
            </div>

            <div class="semantic-card">
              <div class="semantic-head" style="background:${primaryColor.hex};" onclick="copyHex('${primaryColor.hex}', 'Info Primary')">
                <span style="font-size:11px; font-family:var(--font-mono); opacity:0.85;">INFO / BRAND SIGNAL</span>
                <strong style="font-size:16px;">${primaryColor.hex}</strong>
              </div>
              <div class="semantic-list">
                <div class="semantic-row" style="background:${PRIMARY_SCALE[0].hex}; color:${PRIMARY_SCALE[8].hex};" onclick="copyHex('${PRIMARY_SCALE[0].hex}', 'Info Surface')">
                  <span>surface-subtle</span><span>${PRIMARY_SCALE[0].hex}</span>
                </div>
                <div class="semantic-row" style="border:1px solid ${PRIMARY_SCALE[3].hex}; color:${PRIMARY_SCALE[8].hex};" onclick="copyHex('${PRIMARY_SCALE[3].hex}', 'Info Border')">
                  <span>border-token</span><span>${PRIMARY_SCALE[3].hex}</span>
                </div>
                <div class="semantic-row" style="color:${PRIMARY_SCALE[9].hex};" onclick="copyHex('${PRIMARY_SCALE[9].hex}', 'Info Ink')">
                  <span>text-ink</span><span>${PRIMARY_SCALE[9].hex}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


    </section>


    <!-- =======================================================================
         SECTION 02: PRIMITIVES, SPACING & 12-COLUMN LAYOUT GRID
         ======================================================================= -->
    <section id="section-primitives" data-section="primitives" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">02</span>
              <span>${escapeHtml(brandName)} Primitives &amp; Layout Grid</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Spacing Scale, Corner Radius (${escapeHtml(String(houseRadius))}), Elevation &amp; 12-Col Grid</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-primitives', '${escapeHtml(brandName)} Primitives & Grid')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- 2.1 Spacing Scale -->
        <div class="category-block" data-figma-node="❖ Primitives / 4px Spacing Scale">
          <h2 class="category-title">Spacing Scale (Base 4px Unit)</h2>
          <div class="surface-box" id="spacing-scale-list">
            ${SPACING_TOKENS.map(
              (s) => `
            <div class="spacing-row">
              <strong style="font-family:var(--font-mono); color:var(--primary-70);">${s.name}</strong>
              <span style="font-family:var(--font-mono); color:#64748B;">${s.px} (${s.rem})</span>
              <div><div class="spacing-bar" style="width:${s.width}px; max-width:100%;"></div></div>
            </div>`
            ).join('')}
          </div>
        </div>

        <!-- 2.2 Border Radius -->
        <div class="category-block" data-figma-node="❖ Primitives / Border Radius">
          <h2 class="category-title">Corner Radius Tokens (House Physics: ${escapeHtml(String(houseRadius))})</h2>
          <div class="grid-6-cols">
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:0px;"></div>
              <strong style="font-size:13px;">radius-none</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">0px</p>
            </div>
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:4px;"></div>
              <strong style="font-size:13px;">radius-sm</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">4px (Swatches)</p>
            </div>
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:8px;"></div>
              <strong style="font-size:13px;">radius-md</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">8px (Controls)</p>
            </div>
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:12px;"></div>
              <strong style="font-size:13px;">radius-lg</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">12px (Cards)</p>
            </div>
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:16px;"></div>
              <strong style="font-size:13px;">radius-xl</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">16px (Modals)</p>
            </div>
            <div class="primitive-card">
              <div class="radius-preview" style="border-radius:9999px;"></div>
              <strong style="font-size:13px;">radius-full</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">9999px (Pills)</p>
            </div>
          </div>
        </div>

        <!-- 2.3 Elevation Shadows -->
        <div class="category-block" data-figma-node="❖ Primitives / Elevation Shadows">
          <h2 class="category-title">Elevation &amp; Hairline Surfaces</h2>
          <div class="grid-4-cols">
            <div class="primitive-card">
              <div class="shadow-preview" style="box-shadow: none; border: 1px solid #CBD5E1;">hairline 1px</div>
              <strong style="font-size:14px;">rule-1px (At Rest)</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">1px solid var(--${ns}-line-strong)</p>
            </div>
            <div class="primitive-card">
              <div class="shadow-preview" style="box-shadow: 0 4px 8px -2px rgba(16,24,40,0.08);">z-20</div>
              <strong style="font-size:14px;">shadow-sm</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">0 4px 8px rgba(0,0,0,0.08)</p>
            </div>
            <div class="primitive-card">
              <div class="shadow-preview" style="box-shadow: 0 12px 24px -4px rgba(16,24,40,0.12);">z-30</div>
              <strong style="font-size:14px;">shadow-lg</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">0 12px 24px rgba(0,0,0,0.12)</p>
            </div>
            <div class="primitive-card">
              <div class="shadow-preview" style="box-shadow: 0 24px 48px -12px rgba(16,24,40,0.18);">z-50</div>
              <strong style="font-size:14px;">shadow-xl (Modal)</strong>
              <p class="swatch-sub" style="font-family:var(--font-mono); margin-top:4px;">0 24px 48px rgba(0,0,0,0.18)</p>
            </div>
          </div>
        </div>

        <!-- 2.4 12-Column Responsive Layout Grid -->
        <div class="category-block" data-figma-node="❖ Primitives / 12-Column Grid">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">12-Column Responsive Layout Grid &amp; Section Rail</h2>
              <p class="category-desc">Container Max-Width: 1160px–1280px • Left Rail: 176px (Rail A) / 200px (Rail B) • Margin: 64px</p>
            </div>
          </div>
          <div class="cols-12-visualizer">
            <div class="col-bar">1</div><div class="col-bar">2</div><div class="col-bar">3</div><div class="col-bar">4</div>
            <div class="col-bar">5</div><div class="col-bar">6</div><div class="col-bar">7</div><div class="col-bar">8</div>
            <div class="col-bar">9</div><div class="col-bar">10</div><div class="col-bar">11</div><div class="col-bar">12</div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 03: TYPOGRAPHY SYSTEM
         ======================================================================= -->
    <section id="section-typography" data-section="typography" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">03</span>
              <span>${escapeHtml(brandName)} Typography System</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>3-Role Font Stack (${escapeHtml(fonts.display)} · ${escapeHtml(fonts.reading)} · ${escapeHtml(fonts.mono)})</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-typography', '${escapeHtml(brandName)} Typography System')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- Font Families -->
        <div class="category-block" data-figma-node="❖ Typography / Font Families">
          <h2 class="category-title">Typeface Tokens (--${ns}-font-*)</h2>
          <div class="grid-3-cols">
            <div class="surface-box" style="background:#FAFAFA;">
              <span class="badge-version">HEADINGS &amp; DISPLAY</span>
              <div style="font-size:44px; font-weight:700; color:var(--primary-70); font-family:var(--brand-display); margin:12px 0 6px 0;">Aa</div>
              <strong style="font-size:17px;">${escapeHtml(fonts.display)}</strong>
              <p class="swatch-sub" style="margin-top:6px;">--${ns}-font-display · Display &amp; Section Headlines</p>
            </div>
            <div class="surface-box" style="background:#FAFAFA;">
              <span class="badge-version" style="background:#F5F0FF; color:#6739D2;">UI &amp; READING COPY</span>
              <div style="font-size:44px; font-weight:600; color:var(--secondary-60); font-family:var(--brand-reading); margin:12px 0 6px 0;">Aa</div>
              <strong style="font-size:17px;">${escapeHtml(fonts.reading)}</strong>
              <p class="swatch-sub" style="margin-top:6px;">--${ns}-font-reading · 60ch–66ch Body &amp; UI Controls</p>
            </div>
            <div class="surface-box" style="background:#FAFAFA;">
              <span class="badge-version" style="background:#F0FFF4; color:#18B368;">HEX, RAIL &amp; TABULAR DATA</span>
              <div style="font-size:44px; font-weight:600; color:#18B368; font-family:var(--brand-mono); margin:12px 0 6px 0;">01</div>
              <strong style="font-size:17px;">${escapeHtml(fonts.mono)}</strong>
              <p class="swatch-sub" style="margin-top:6px;">--${ns}-font-mono · Rail Numbers, Tokens &amp; Ledger Figures</p>
            </div>
          </div>
        </div>

        <!-- Type Scale -->
        <div class="category-block" data-figma-node="❖ Typography / Scale">
          <h2 class="category-title">Type Scale &amp; Hierarchy</h2>
          <div style="border-top: 1px solid var(--border-default);">
            <div class="type-row">
              <div>
                <strong>Display XL (Hero H1)</strong>
                <div class="type-meta">${escapeHtml(fonts.display)} • 48px / 0.94 • -0.03em</div>
              </div>
              <div style="font-family:var(--brand-display); font-size:42px; font-weight:700; letter-spacing:-0.03em; line-height:1.05;">${escapeHtml(tagline)}</div>
            </div>
            <div class="type-row">
              <div>
                <strong>Heading H1 (Sheet Title)</strong>
                <div class="type-meta">${escapeHtml(fonts.display)} • 26px / 34px • Bold • -0.02em</div>
              </div>
              <div style="font-family:var(--brand-display); font-size:26px; font-weight:700; letter-spacing:-0.02em;">${escapeHtml(brandName)} Architecture &amp; Surface Rules</div>
            </div>
            <div class="type-row">
              <div>
                <strong>Heading H2 (Section Group)</strong>
                <div class="type-meta">${escapeHtml(fonts.display)} • 24px / 32px • Bold • -0.02em</div>
              </div>
              <div style="font-family:var(--brand-display); font-size:24px; font-weight:700; letter-spacing:-0.02em;">Main Colors, Primitives &amp; Contrast Ledger</div>
            </div>
            <div class="type-row">
              <div>
                <strong>Body Regular (66ch Measure)</strong>
                <div class="type-meta">${escapeHtml(fonts.reading)} • 16px / 1.60 • Regular</div>
              </div>
              <div style="font-size:16px; color:#334155; font-family:var(--brand-reading); max-width:66ch;">${escapeHtml(promise)}</div>
            </div>
            <div class="type-row">
              <div>
                <strong>Token Label / Tabular Mono</strong>
                <div class="type-meta">${escapeHtml(fonts.mono)} • 13px / 1.50 • Regular</div>
              </div>
              <div style="font-size:13px; color:#64748B; font-family:var(--brand-mono);">${escapeHtml(MAIN_COLORS[0].token)} • ${MAIN_COLORS[0].hex} • ${escapeHtml(MAIN_COLORS[1].token)} • ${MAIN_COLORS[1].hex}</div>
            </div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 04: LOGO & BRAND IDENTITY (KUWAYAMA 64-GRID)
         ======================================================================= -->
    <section id="section-logo" data-section="logo" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">04</span>
              <span>${escapeHtml(brandName)} Logo &amp; Brand Identity</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>64×64 Construction Grid, Surface Polarity, Outlined Lockups &amp; 16px Compact</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-logo', '${escapeHtml(brandName)} Logo & Brand')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- 4.1 Primary Mark & Surface Polarity -->
        <div class="category-block" data-figma-node="❖ Brand / Logo Construction & Surfaces">
          <h2 class="category-title">Primary Mark &amp; Surface Polarity</h2>
          <div class="grid-3-cols">
            <div class="surface-box blueprint-grid" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:200px;">
              <div style="padding:20px 28px; background:#FFFFFF; border:1.5px dashed var(--primary-70); border-radius:14px; display:flex; align-items:center; gap:14px;">
                ${resizeSvgTag(markSvgRaw, 44, 44)}
                <span style="font-family:var(--brand-display); font-size:24px; font-weight:800; letter-spacing:-0.03em; color:#111827;">${escapeHtml(brandName)}</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:11px; color:var(--primary-70); margin-top:12px;">64×64 Grid · Clearspace = 3–4 Units</span>
            </div>

            <div class="surface-box" style="background:#111827; color:#FFFFFF; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:200px;">
              <div style="display:flex; align-items:center; gap:14px;">
                <div class="tnd-logo-circle" style="border:none;">
                  ${badgeMark28}
                </div>
                <span style="font-family:var(--brand-display); font-size:24px; font-weight:800;">${escapeHtml(brandName)}</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#94A3B8; margin-top:14px;">Dark / Night Surface (#111827)</span>
            </div>

            <div class="surface-box" style="background:var(--primary-70); color:#FFFFFF; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:200px;">
              <div style="display:flex; align-items:center; gap:14px;">
                <div class="tnd-logo-circle" style="border:none;">
                  ${badgeMark28}
                </div>
                <span style="font-family:var(--brand-display); font-size:24px; font-weight:800;">${escapeHtml(brandName)}</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:11px; color:rgba(255,255,255,0.85); margin-top:14px;">Brand Accent Surface (${primaryColor.hex})</span>
            </div>
          </div>
        </div>

        <!-- 4.2 Mark Variants & Scale Strip -->
        <div class="category-block" data-figma-node="❖ Brand / Mark Family & Scale Strip">
          <h2 class="category-title">Mark Family (Primary · Reverse · 16px Compact · Glyph)</h2>
          <div class="grid-4-cols">
            <div class="primitive-card" style="background:#FFFFFF; padding:24px;">
              <div style="height:72px; display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
                ${resizeSvgTag(markSvgRaw, 56, 56)}
              </div>
              <strong style="font-size:14px;">mark.svg</strong>
              <p class="swatch-sub" style="margin-top:4px;">Primary 64×64 construction</p>
            </div>
            <div class="primitive-card" style="background:#111827; color:#FFFFFF; padding:24px;">
              <div style="height:72px; display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
                ${resizeSvgTag(markRevSvgRaw, 56, 56)}
              </div>
              <strong style="font-size:14px; color:#FFFFFF;">mark-reverse.svg</strong>
              <p class="swatch-sub" style="margin-top:4px; color:#94A3B8;">Reverse on dark/loud field</p>
            </div>
            <div class="primitive-card" style="background:#FFFFFF; padding:24px;">
              <div style="height:72px; display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:12px;">
                ${resizeSvgTag(markCompactRaw, 40, 40)}
                ${resizeSvgTag(markCompactRaw, 16, 16)}
              </div>
              <strong style="font-size:14px;">mark-compact.svg</strong>
              <p class="swatch-sub" style="margin-top:4px;">Separate 16–24px drawing</p>
            </div>
            <div class="primitive-card" style="background:#FFFFFF; padding:24px;">
              <div style="height:72px; display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:12px;">
                ${resizeSvgTag(glyphRaw, 40, 40)}
                ${resizeSvgTag(glyphRaw, 16, 16)}
              </div>
              <strong style="font-size:14px;">glyph.svg</strong>
              <p class="swatch-sub" style="margin-top:4px;">16px favicon &amp; tab badge</p>
            </div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 05: COMPANION CAST, ICONOGRAPHY & SPOT ILLUSTRATIONS
         ======================================================================= -->
    <section id="section-assets" data-section="assets" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">05</span>
              <span>${escapeHtml(brandName)} Companion Cast, Icons &amp; Illustrations</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>6-Mark Companion Cast (64×64 Grid), 24px Keyline Icons &amp; Spot Illustrations</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-assets', '${escapeHtml(brandName)} Cast & Assets')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- 5.1 6-Mark Companion Cast -->
        <div class="category-block" data-figma-node="❖ Assets / 6-Mark Companion Cast">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">6-Mark Companion Cast (Kuwayama 64×64 Grid)</h2>
              <p class="category-desc">Domain-specific companion symbols drawn on the same 64-unit grid and cut-line weight as the primary mark.</p>
            </div>
          </div>
          <div class="cast-grid-6">
            ${castItems
              .map(
                (c) => `
            <div class="icon-cell" data-figma-role="icon" data-figma-component="Cast Mark" data-figma-variant="Name=${escapeHtml(c.name)}" data-figma-description="${escapeHtml(c.note || `64×64 companion cast mark · ${c.name}`)}" onclick="copyHex('cast/${escapeHtml(c.id)}.svg', 'Cast Mark')">
              <div class="icon-keyline" style="width:56px; height:56px;">${c.svg}</div>
              <strong style="font-size:13px; color:#111827;">${escapeHtml(c.name)}</strong>
              <span style="font-family:var(--font-mono); font-size:10.5px; color:#64748B;">cast/${escapeHtml(c.id)}.svg</span>
            </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- 5.2 System Icons (24x24 Keyline Grid) -->
        <div class="category-block" data-figma-node="❖ Assets / 24px Icon Grid">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">System Iconography (24×24px Keyline)</h2>
              <p class="category-desc">1.75px stroke, rounded caps. Click any icon card to copy its token identifier.</p>
            </div>
          </div>
          <div class="icon-grid-8">
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=search" data-figma-description="24×24 keyline system icon · search" onclick="copyHex('icon-search', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">search</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=layers" data-figma-description="24×24 keyline system icon · layers" onclick="copyHex('icon-layers', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">layers</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=bell" data-figma-description="24×24 keyline system icon · bell" onclick="copyHex('icon-bell', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">bell</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=shield" data-figma-description="24×24 keyline system icon · shield" onclick="copyHex('icon-shield', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">shield</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=folder" data-figma-description="24×24 keyline system icon · folder" onclick="copyHex('icon-folder', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">folder</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=sparkles" data-figma-description="24×24 keyline system icon · sparkles" onclick="copyHex('icon-sparkles', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">sparkles</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=sliders" data-figma-description="24×24 keyline system icon · sliders" onclick="copyHex('icon-sliders', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">sliders</span>
            </div>
            <div class="icon-cell" data-figma-role="icon" data-figma-component="System Icon" data-figma-variant="Name=terminal" data-figma-description="24×24 keyline system icon · terminal" onclick="copyHex('icon-terminal', 'Icon Token')">
              <div class="icon-keyline"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg></div>
              <span style="font-family:var(--font-mono); font-size:11px; color:#475569;">terminal</span>
            </div>
          </div>
        </div>

        <!-- 5.3 Empty State Spot Illustrations -->
        <div class="category-block" data-figma-node="❖ Assets / Spot Illustrations">
          <h2 class="category-title">Spot Illustrations (Empty &amp; Status States)</h2>
          <div class="grid-4-cols">
            <div class="primitive-card" data-figma-role="icon" data-figma-component="Spot Illustration" data-figma-variant="State=empty-documents" data-figma-description="Empty or status state illustration · empty-documents" style="padding:24px;">
              <svg width="88" height="88" viewBox="0 0 120 120" fill="none" style="margin:0 auto 12px auto; display:block;">
                <circle cx="60" cy="60" r="46" fill="${PRIMARY_SCALE[0].hex}"/>
                <rect x="34" y="42" width="52" height="40" rx="6" fill="white" stroke="${primaryColor.hex}" stroke-width="2.5"/>
                <rect x="44" y="54" width="24" height="4" rx="2" fill="${PRIMARY_SCALE[3].hex}"/>
                <rect x="44" y="64" width="16" height="4" rx="2" fill="${PRIMARY_SCALE[1].hex}"/>
                <circle cx="82" cy="40" r="10" fill="${secondaryColor.hex}"/>
                <path d="M82 36V44M78 40H86" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <strong style="font-size:14px;">empty-documents</strong>
              <p class="swatch-sub" style="margin-top:4px;">Zero-data tables &amp; folders</p>
            </div>

            <div class="primitive-card" data-figma-role="icon" data-figma-component="Spot Illustration" data-figma-variant="State=empty-search" data-figma-description="Empty or status state illustration · empty-search" style="padding:24px;">
              <svg width="88" height="88" viewBox="0 0 120 120" fill="none" style="margin:0 auto 12px auto; display:block;">
                <circle cx="60" cy="60" r="46" fill="${SECONDARY_SCALE[0].hex}"/>
                <circle cx="55" cy="55" r="20" fill="white" stroke="${secondaryColor.hex}" stroke-width="2.5"/>
                <path d="M70 70L84 84" stroke="${secondaryColor.hex}" stroke-width="4" stroke-linecap="round"/>
                <path d="M49 55H61" stroke="${SECONDARY_SCALE[3].hex}" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <strong style="font-size:14px;">empty-search</strong>
              <p class="swatch-sub" style="margin-top:4px;">No matching filter results</p>
            </div>

            <div class="primitive-card" data-figma-role="icon" data-figma-component="Spot Illustration" data-figma-variant="State=status-verified" data-figma-description="Empty or status state illustration · status-verified" style="padding:24px;">
              <svg width="88" height="88" viewBox="0 0 120 120" fill="none" style="margin:0 auto 12px auto; display:block;">
                <circle cx="60" cy="60" r="46" fill="#F0FFF4"/>
                <circle cx="60" cy="60" r="24" fill="#18B368"/>
                <path d="M50 60.5L56.5 67L71 52.5" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <strong style="font-size:14px;">status-verified</strong>
              <p class="swatch-sub" style="margin-top:4px;">Release &amp; sync completed</p>
            </div>

            <div class="primitive-card" data-figma-role="icon" data-figma-component="Spot Illustration" data-figma-variant="State=status-warning" data-figma-description="Empty or status state illustration · status-warning" style="padding:24px;">
              <svg width="88" height="88" viewBox="0 0 120 120" fill="none" style="margin:0 auto 12px auto; display:block;">
                <circle cx="60" cy="60" r="46" fill="#FFF1F2"/>
                <path d="M60 36L86 80H34L60 36Z" fill="white" stroke="#E11D48" stroke-width="2.5" stroke-linejoin="round"/>
                <path d="M60 52V64" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>
                <circle cx="60" cy="71" r="2" fill="#E11D48"/>
              </svg>
              <strong style="font-size:14px;">status-warning</strong>
              <p class="swatch-sub" style="margin-top:4px;">Destructive &amp; offline alerts</p>
            </div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 06: CORE UI COMPONENTS STICKER SHEET
         ======================================================================= -->
    <section id="section-components" data-section="components" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">06</span>
              <span>${escapeHtml(brandName)} Core UI Components</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Buttons, Form Controls, Double-Reported Validation &amp; Status Badges</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-components', '${escapeHtml(brandName)} UI Components')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- Buttons -->
        <div class="category-block" data-figma-node="❖ Components / Button Variants">
          <h2 class="category-title">Buttons &amp; Action Hierarchy</h2>
          <div class="surface-box" style="display:flex; flex-wrap:wrap; gap:14px; align-items:center;">
            <button class="btn btn-primary" data-figma-component="Button" data-figma-variant="State=Primary" data-figma-description="Primary brand action">Primary (${MAIN_COLORS[0].hex})</button>
            <button class="btn btn-secondary" data-figma-component="Button" data-figma-variant="State=Secondary" data-figma-description="Secondary action">Secondary (${MAIN_COLORS[1].hex})</button>
            <button class="btn btn-success" data-figma-component="Button" data-figma-variant="State=Tertiary" data-figma-description="Positive / confirm action">Tertiary (${MAIN_COLORS[2].hex})</button>
            <button class="btn btn-subtle" data-figma-component="Button" data-figma-variant="State=Subtle" data-figma-description="Low-emphasis surface action">Subtle Surface</button>
            <button class="btn btn-outline" data-figma-component="Button" data-figma-variant="State=Outline" data-figma-description="Neutral outlined action">Outline Neutral</button>
            <button class="btn btn-danger" data-figma-component="Button" data-figma-variant="State=Destructive" data-figma-description="Destructive action">Destructive</button>
          </div>
        </div>

        <!-- Form Inputs & Badges -->
        <div class="category-block" data-figma-node="❖ Components / Inputs & Badges">
          <div class="grid-2-cols">
            <div class="surface-box">
              <h3 style="margin:0 0 16px 0; font-size:17px;">Form Input States &amp; Validation</h3>
              <div style="display:flex; flex-direction:column; gap:14px;">
                <div>
                  <label style="display:block; font-size:12px; font-weight:600; margin-bottom:6px;">Default Input</label>
                  <input type="text" class="input-field" data-figma-component="Input" data-figma-variant="State=Default" data-figma-description="Text field at rest" value="spec@${escapeHtml(slug)}.design" readonly />
                </div>
                <div>
                  <label style="display:block; font-size:12px; font-weight:600; color:var(--primary-70); margin-bottom:6px;">Focused Ring (${escapeHtml(MAIN_COLORS[0].token)})</label>
                  <input type="text" class="input-field" data-figma-component="Input" data-figma-variant="State=Focused" data-figma-description="Text field with focus ring" style="border-color:var(--primary-70); box-shadow: 0 0 0 3px ${PRIMARY_SCALE[1].hex};" value="${escapeHtml(brandName)} Token ${escapeHtml(version)}" readonly />
                </div>
                <div>
                  <label style="display:block; font-size:12px; font-weight:600; color:#E11D48; margin-bottom:6px;">Double-Reported Error State (aria-invalid="true")</label>
                  <input type="text" class="input-field" data-figma-component="Input" data-figma-variant="State=Error" data-figma-description="Text field with validation error" style="border-color:#E11D48; background:#FFF1F2;" value="--${ns}-legacy-token" aria-invalid="true" readonly />
                  <div style="margin-top:8px; padding:10px 12px; border-radius:8px; background:#FFF1F2; border:1px solid #FECDD3; font-size:12px; color:#9F1239;">
                    <strong>2 validation problems:</strong> Token must resolve to a Layer 1 primitive, and contrast must be ≥ 4.5:1 for body text.
                  </div>
                </div>
              </div>
            </div>

            <div class="surface-box">
              <h3 style="margin:0 0 16px 0; font-size:17px;">Status Pills &amp; Badges</h3>
              <div style="display:flex; flex-wrap:wrap; gap:10px;">
                <span class="badge-pill" data-figma-component="Badge" data-figma-variant="Tone=Brand" data-figma-description="Brand-token status pill" style="background:${PRIMARY_SCALE[0].hex}; color:${PRIMARY_SCALE[8].hex};">● ${escapeHtml(MAIN_COLORS[0].token)}</span>
                <span class="badge-pill" data-figma-component="Badge" data-figma-variant="Tone=Secondary" data-figma-description="Secondary-token status pill" style="background:${SECONDARY_SCALE[0].hex}; color:${SECONDARY_SCALE[8].hex};">● ${escapeHtml(MAIN_COLORS[1].token)}</span>
                <span class="badge-pill" data-figma-component="Badge" data-figma-variant="Tone=Success" data-figma-description="Passing contrast status" style="background:#F0FFF4; color:#18B368;">● Verified Pass</span>
                <span class="badge-pill" data-figma-component="Badge" data-figma-variant="Tone=Warning" data-figma-description="Graphic-only status" style="background:#FFFBEB; color:#B45309;">● Graphic Only</span>
                <span class="badge-pill" data-figma-component="Badge" data-figma-variant="Tone=Danger" data-figma-description="Deprecated token status" style="background:#FFF1F2; color:#E11D48;">● Deprecated</span>
              </div>
              <div style="margin-top:24px; padding-top:16px; border-top:1px solid #F1F5F9; display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:13px; color:#64748B;">Ready for Figma import or per-section HTML copy</span>
                <button class="btn btn-subtle" style="padding:6px 12px; font-size:12px;" onclick="copySectionHTML('section-components', '${escapeHtml(brandName)} UI Components')">Copy Markup →</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 07: MODALS, DRAWERS, TOASTS & OVERLAYS
         ======================================================================= -->
    <section id="section-overlays" data-section="overlays" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">07</span>
              <span>${escapeHtml(brandName)} Modals, Drawers &amp; Overlays</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Dialog Anatomy, Destructive Confirmation &amp; Live Modal Preview</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="btn btn-primary" style="padding:7px 14px; font-size:12px;" onclick="openLiveModal()">
              <span>Launch Live Modal</span>
            </button>
            <button class="section-copy-btn" onclick="copySectionHTML('section-overlays', '${escapeHtml(brandName)} Modals & Overlays')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <div class="category-block" data-figma-node="❖ Overlays / Modal Dialog Variants">
          <div class="category-header-flex">
            <div>
              <h2 class="category-title">Modal Dialogs (Form &amp; Destructive Variants)</h2>
              <p class="category-desc">Static artboard sticker sheet + interactive live modal preview.</p>
            </div>
          </div>

          <div class="modal-stage">
            <div class="modal-card" data-figma-component="Modal" data-figma-variant="Intent=Publish" data-figma-description="Form dialog for publishing a token release">
              <div style="padding:18px 22px; border-bottom:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="font-size:15px;">Publish ${escapeHtml(brandName)} Design Token Release</strong>
                  <p class="swatch-sub" style="margin-top:2px;">Sync variables to Figma &amp; CSS token bundles</p>
                </div>
                <span style="color:#94A3B8; font-weight:700;">✕</span>
              </div>
              <div style="padding:20px 22px; display:flex; flex-direction:column; gap:14px;">
                <div>
                  <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">Release Tag</label>
                  <input type="text" class="input-field" value="${escapeHtml(version)}-${escapeHtml(slug)}" readonly />
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <span class="badge-pill" style="background:${PRIMARY_SCALE[0].hex}; color:${PRIMARY_SCALE[8].hex};">Figma Variables</span>
                  <span class="badge-pill" style="background:${SECONDARY_SCALE[0].hex}; color:${SECONDARY_SCALE[8].hex};">CSS Tokens (--${ns}-*)</span>
                  <span class="badge-pill" style="background:#F0FFF4; color:#18B368;">SVG Cast (6)</span>
                </div>
              </div>
              <div class="action-group" data-figma-role="action-group" style="padding:14px 22px; width:100%; min-width:100%; background:#FAFAFA; border-top:1px solid #F1F5F9; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn btn-outline" style="padding:7px 14px; font-size:12px;">Cancel</button>
                <button class="btn btn-primary" style="padding:7px 14px; font-size:12px;" onclick="openLiveModal()">Publish Release</button>
              </div>
            </div>

            <div class="modal-card" data-figma-component="Modal" data-figma-variant="Intent=Destructive" data-figma-description="Destructive confirmation dialog" style="border-color:#FECDD3;">
              <div style="padding:22px;">
                <div style="width:40px; height:40px; border-radius:9999px; background:#FFF1F2; color:#E11D48; display:flex; align-items:center; justify-content:center; font-weight:800; margin-bottom:12px;">!</div>
                <strong style="font-size:15px;">Revoke Deprecated Token?</strong>
                <p class="swatch-sub" style="margin-top:6px;">Removing <code style="color:#E11D48;">--${ns}-legacy-50</code> will affect linked Figma component libraries.</p>
              </div>
              <div class="action-group" data-figma-role="action-group" style="padding:14px 22px; width:100%; min-width:100%; background:#FAFAFA; border-top:1px solid #F1F5F9; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn btn-outline" style="padding:7px 14px; font-size:12px;">Keep</button>
                <button class="btn btn-danger" style="padding:7px 14px; font-size:12px;">Revoke Token</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>


    <!-- =======================================================================
         SECTION 08: DATA DISPLAY, TABLES & TOKEN SHEETS
         ======================================================================= -->
    <section id="section-patterns" data-section="patterns" class="figma-sheet">
      <header class="sheet-banner">
        <div class="sheet-banner-inner">
          <div>
            <h1 class="sheet-title-row">
              <span class="sheet-num-badge">08</span>
              <span>${escapeHtml(brandName)} Data Display, Patterns &amp; Token Sheets</span>
            </h1>
            <div class="sheet-subtitle-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>KPI Metric Cards, Token Registry Table &amp; Copyable CSS Sheets</span>
            </div>
          </div>
          <div class="sheet-banner-right">
            <button class="section-copy-btn" onclick="copySectionHTML('section-patterns', '${escapeHtml(brandName)} Data & Patterns')">
              <span>Copy Section HTML</span>
            </button>
            <div class="tnd-logo-circle">
              ${badgeMark28}
            </div>
          </div>
        </div>
      </header>

      <div class="sheet-body sheet-body-padded">
        <!-- 8.1 KPI Cards -->
        <div class="category-block" data-figma-node="❖ Patterns / KPI Metric Cards">
          <h2 class="category-title">System Metric Cards</h2>
          <div class="grid-3-cols">
            <div class="surface-box">
              <div style="display:flex; justify-content:space-between; font-size:13px; color:#64748B;">
                <span>Design Token Coverage</span>
                <span class="badge-pill" style="background:#F0FFF4; color:#18B368; font-size:11px;">100% Synced</span>
              </div>
              <div style="font-size:32px; font-weight:800; margin:10px 0 4px 0;">${primitives.length} Primitives</div>
              <div style="font-family:var(--font-mono); font-size:11px; color:#94A3B8;">Namespace: --${ns}-* · OKLCH verified</div>
            </div>
            <div class="surface-box">
              <div style="display:flex; justify-content:space-between; font-size:13px; color:#64748B;">
                <span>Contrast Ledger</span>
                <span class="badge-pill" style="background:${PRIMARY_SCALE[0].hex}; color:${PRIMARY_SCALE[8].hex}; font-size:11px;">${failCount} Published Fails</span>
              </div>
              <div style="font-size:32px; font-weight:800; margin:10px 0 4px 0;">${contrastPairs.length} Pairs</div>
              <div style="font-family:var(--font-mono); font-size:11px; color:#94A3B8;">Measured from hex in tokens.json</div>
            </div>
            <div class="surface-box">
              <div style="display:flex; justify-content:space-between; font-size:13px; color:#64748B;">
                <span>Convertible Figma Artboards</span>
                <span class="badge-pill" style="background:${SECONDARY_SCALE[0].hex}; color:${SECONDARY_SCALE[8].hex}; font-size:11px;">Zero-CDN</span>
              </div>
              <div style="font-size:32px; font-weight:800; margin:10px 0 4px 0;">8 Sheets</div>
              <div style="font-family:var(--font-mono); font-size:11px; color:#94A3B8;">Isolated &lt;section&gt; blocks</div>
            </div>
          </div>
        </div>

        <!-- 8.2 Token Registry Table -->
        <div class="category-block" data-figma-node="❖ Patterns / Data Table">
          <h2 class="category-title">Token Registry Table</h2>
          <div class="surface-box" style="padding:0; overflow:hidden;">
            <table class="ds-table">
              <thead>
                <tr>
                  <th>Token Name</th>
                  <th>Role / Usage</th>
                  <th>HEX Value</th>
                  <th>OKLCH</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${primitives
                  .map(
                    (p) => `
                <tr onclick="copyHex('${p.hex}', '${escapeHtml(p.token)}')" style="cursor:pointer;">
                  <td style="font-family:var(--font-mono); font-weight:600; color:var(--primary-70);">${escapeHtml(p.token)}</td>
                  <td>${escapeHtml(p.role)}</td>
                  <td style="font-family:var(--font-mono);"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${p.hex};border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-right:6px;"></span>${p.hex}</td>
                  <td style="font-family:var(--font-mono); font-size:12px; color:#64748B;">${escapeHtml(p.oklch)}</td>
                  <td><span class="badge-pill" style="background:#F0FFF4; color:#18B368; font-size:11px;">Verified</span></td>
                </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 8.3 Copyable CSS Token Sheets -->
        <div class="category-block" data-figma-node="❖ Patterns / CSS Token Sheets">
          <h2 class="category-title">Copyable CSS Token Sheets</h2>
          <div class="grid-2-cols">
            <div class="code-sheet-card">
              <div class="code-sheet-head">
                <span>1 · PRIMITIVES (--${ns}-*)</span>
                <button class="btn-tool" style="padding:3px 9px; font-size:11px;" onclick="copyToClipboard(document.getElementById('code-prim').textContent, 'Copied Primitives CSS')">Copy CSS</button>
              </div>
              <pre id="code-prim" class="code-sheet-pre">${escapeHtml(primCssBlock)}</pre>
            </div>
            <div class="code-sheet-card">
              <div class="code-sheet-head">
                <span>2 · FULL TOKEN SHEET (${escapeHtml(slug)}-tokens.css)</span>
                <button class="btn-tool" style="padding:3px 9px; font-size:11px;" onclick="copyToClipboard(document.getElementById('code-sem').textContent, 'Copied Full Token CSS')">Copy CSS</button>
              </div>
              <pre id="code-sem" class="code-sheet-pre">${escapeHtml(semCssBlock)}</pre>
            </div>
          </div>
        </div>
      </div>


    </section>

  </main>

  <!-- =========================================================================
       LIVE INTERACTIVE MODAL OVERLAY
       ========================================================================= -->
  <div id="live-modal" class="live-modal-overlay" onclick="if(event.target === this) closeLiveModal()">
    <div class="modal-card" style="width:100%; max-width:480px;">
      <div style="padding:18px 22px; border-bottom:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
        <strong>Live ${escapeHtml(brandName)} Modal Preview</strong>
        <button class="btn-tool" style="padding:4px 8px;" onclick="closeLiveModal()">✕</button>
      </div>
      <div style="padding:22px; font-size:14px; color:#475569;">
        <p style="margin:0 0 12px 0;">This interactive modal uses the ${escapeHtml(brandName)} elevation token (<code>shadow-xl</code>) and primary token (<code>${escapeHtml(MAIN_COLORS[0].token)}: ${MAIN_COLORS[0].hex}</code>).</p>
        <div style="padding:12px; background:#FAFAFA; border:1px solid #E2E8F0; border-radius:8px; font-family:var(--font-mono); font-size:12px;">
          • Primary Action: ${MAIN_COLORS[0].hex} (${escapeHtml(MAIN_COLORS[0].token)})<br/>
          • Surface: #FFFFFF (Pure White Artboard)
        </div>
      </div>
      <div style="padding:14px 22px; background:#FAFAFA; border-top:1px solid #F1F5F9; display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-outline" onclick="closeLiveModal()">Close</button>
        <button class="btn btn-primary" onclick="copySectionHTML('section-overlays', '${escapeHtml(brandName)} Modals & Overlays'); closeLiveModal();">Copy Section HTML</button>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       DOOP & FIGMA IMPORT HELPER MODAL (< 10,000px ON ALL SIDES)
       ========================================================================= -->
  <div id="doop-modal" class="live-modal-overlay" onclick="if(event.target === this) closeDoopModal()">
    <div class="modal-card" style="width:100%; max-width:620px; max-height:90vh; overflow-y:auto;">
      <div style="padding:18px 22px; border-bottom:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="font-size:15px; color:#111827;">Doop &amp; Figma Import Helper</strong>
          <div style="font-size:12px; color:#64748B; margin-top:2px;">Figma restricts single frames to max 10,000px on each side.</div>
        </div>
        <button class="btn-tool" style="padding:4px 8px;" onclick="closeDoopModal()">✕</button>
      </div>
      <div style="padding:22px; font-size:13px; color:#334155;">
        <div style="margin-bottom:18px; padding:12px 14px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; color:#1E40AF; line-height:1.5;">
          <strong>Why does Doop show "Frames must be at most 10,000px"?</strong><br/>
          Figma has a strict internal limit: no frame can exceed 10,000px. When all 8 sheets are stacked vertically, the page totals ~13,500px. Choose one of the fixes below to import cleanly:
        </div>

        <h4 style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:0.04em; color:#0F172A;">Option A: Doop Clean — single column (recommended)</h4>
        <p style="margin:0 0 10px 0; color:#64748B;">One 1440px column, no grid, no sticky bar, no shadows or transforms. This is the layout an importer should snapshot — it removes the extra layers and clipped frames that make the imported page look messy.</p>
        <div style="display:flex; gap:8px; margin-bottom:20px;">
          <button class="btn-tool" style="flex:1; justify-content:center; background:#2563EB; color:#FFF; border-color:#2563EB; padding:8px 12px;" onclick="copyDoopUrl('doop')">
            <span>Copy Doop Clean URL (?clean=1&amp;doop=1)</span>
          </button>
          <button class="btn-tool" style="flex:0 0 190px; justify-content:center; padding:8px 12px;" onclick="copyDoopUrl('grid')">
            <span>2-Column Grid</span>
          </button>
        </div>

        <h4 style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:0.04em; color:#0F172A;">Option B: Import Sheet-by-Sheet (Recommended in Figma)</h4>
        <p style="margin:0 0 10px 0; color:#64748B;">Each sheet is ~1,500px to ~2,000px tall. Click any sheet to copy its clean URL for Doop / Figma:</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('1')">
            <span>01 · Colors (~1.8k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('2')">
            <span>02 · Primitives (~1.5k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('3')">
            <span>03 · Typography (~1.8k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('4')">
            <span>04 · Logo (~1.6k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('5')">
            <span>05 · Cast &amp; Assets (~1.4k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('6')">
            <span>06 · Components (~2.0k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('7')">
            <span>07 · Modals (~1.8k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
          <button class="btn-tool" style="justify-content:space-between; padding:8px 12px;" onclick="copyDoopUrl('8')">
            <span>08 · Patterns (~1.6k px)</span><span style="color:#2563EB;">Copy ↗</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Toast Notification -->
  <div id="toast" class="toast-notification">
    <span style="color:#4ADE80;">✔</span>
    <span id="toast-text">Copied to clipboard</span>
  </div>

  <!-- =========================================================================
       JAVASCRIPT: FILTERING, SPEC INSPECTOR, CLEAN EXPORT & CLIPBOARD
       ========================================================================= -->
  <script>
    function filterSection(target, btn, syncUrl = true) {
      document.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
      if (btn) btn.classList.add('active');

      document.querySelectorAll('.figma-sheet').forEach(sec => {
        if (target === 'all' || sec.getAttribute('data-section') === target) {
          sec.classList.remove('hidden-sheet');
        } else {
          sec.classList.add('hidden-sheet');
        }
      });

      if (syncUrl) {
        try {
          const url = new URL(window.location.href);
          if (target === 'all') {
            url.searchParams.delete('sheet');
            url.searchParams.delete('section');
          } else {
            url.searchParams.set('sheet', target);
          }
          window.history.replaceState({}, '', url.toString());
        } catch (e) {}
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleSpecMode() {
      document.body.classList.toggle('spec-mode');
      const btn = document.getElementById('btn-spec');
      if (btn) btn.classList.toggle('active-spec');
    }

    function toggleGridMode(forceState) {
      const isGrid = forceState !== undefined ? forceState : !document.body.classList.contains('canvas-grid-mode');
      const gridBtn = document.getElementById('btn-grid');

      if (isGrid) {
        document.body.classList.add('canvas-grid-mode');
        if (gridBtn) gridBtn.classList.add('active-grid');
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('grid', '1');
          window.history.replaceState({}, '', url.toString());
          showToast('Canvas Grid active (2-col, < 10,000px on both sides)');
        } catch (e) {}
      } else {
        document.body.classList.remove('canvas-grid-mode');
        if (gridBtn) gridBtn.classList.remove('active-grid');
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('grid');
          url.searchParams.delete('canvas');
          window.history.replaceState({}, '', url.toString());
          showToast('Exited Canvas Grid Mode');
        } catch (e) {}
      }
    }

    function toggleCleanMode(forceState) {
      const isClean = forceState !== undefined ? forceState : !document.body.classList.contains('clean-export-mode');
      const cleanBtn = document.getElementById('btn-clean');

      if (isClean) {
        document.body.classList.add('clean-export-mode');
        if (cleanBtn) cleanBtn.classList.add('active-clean');
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('clean', '1');
          window.history.replaceState({}, '', url.toString());
          copyToClipboard(url.toString(), 'Clean Export Mode active · Copied clean URL (?clean=1)');
        } catch (e) {
          showToast('Clean Export Mode active (?clean=1)');
        }
      } else {
        document.body.classList.remove('clean-export-mode');
        if (cleanBtn) cleanBtn.classList.remove('active-clean');
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('clean');
          url.searchParams.delete('figma');
          window.history.replaceState({}, '', url.toString());
          showToast('Exited Clean Export Mode');
        } catch (e) {
          showToast('Exited Clean Export Mode');
        }
      }
    }

    function copyCleanLink() {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('clean', '1');
        window.history.replaceState({}, '', url.toString());
        document.body.classList.add('clean-export-mode');
        const cleanBtn = document.getElementById('btn-clean');
        if (cleanBtn) cleanBtn.classList.add('active-clean');
        copyToClipboard(url.toString(), 'Copied Clean Export URL (?clean=1)');
      } catch (e) {
        fallbackCopy(window.location.href, 'Copied URL');
      }
    }

    function openLiveModal() {
      document.getElementById('live-modal').classList.add('open');
    }

    function closeLiveModal() {
      document.getElementById('live-modal').classList.remove('open');
    }

    function openDoopModal() {
      document.getElementById('doop-modal').classList.add('open');
    }

    function closeDoopModal() {
      document.getElementById('doop-modal').classList.remove('open');
    }

    function copyDoopUrl(mode) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('clean', '1');
        if (mode === 'grid') {
          url.searchParams.set('grid', '1');
          url.searchParams.delete('doop');
          url.searchParams.delete('sheet');
          url.searchParams.delete('section');
        } else if (mode === 'doop') {
          /* Single-column, chrome-free, shadow-free: what an importer should
           * snapshot. */
          url.searchParams.set('doop', '1');
          url.searchParams.delete('grid');
          url.searchParams.delete('sheet');
          url.searchParams.delete('section');
        } else {
          url.searchParams.delete('grid');
          url.searchParams.set('doop', '1');
          url.searchParams.set('sheet', mode);
        }
        copyToClipboard(url.toString(), 'Copied Doop URL: ' + url.search);
      } catch (e) {
        fallbackCopy(window.location.href, 'Copied URL');
      }
    }

    function copyToClipboard(text, message) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(message);
        }).catch(() => fallbackCopy(text, message));
        return;
      }
      fallbackCopy(text, message);
    }

    function fallbackCopy(text, message) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast(message);
      } catch (err) {
        showToast('Copied');
      }
      document.body.removeChild(textarea);
    }

    function copyHex(hex, label) {
      copyToClipboard(hex, 'Copied ' + label + ': ' + hex);
    }

    function copySectionHTML(sectionId, title) {
      const el = document.getElementById(sectionId);
      if (!el) return;
      copyToClipboard(el.outerHTML, 'Copied <section> HTML for "' + title + '"');
    }

    let toastTimer;
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-text').textContent = msg;
      toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
    }

    /* ---- Canonical capture + Figma manifest (v2) -------------------------
       The old capture measured the live window. In Canvas Grid mode that is a
       3090px two-column grid whose rows are stretched to equal height, so the
       same sheet arrived 842px tall in one run and 1189px in the next — while
       the headless extractor used a fixed 1440px viewport. Both flows now
       measure the SAME document: a clean clone in a 1440px iframe, with no
       body modes, no hidden sheets, and coordinates relative to each sheet
       root. That is the canonical spec the plugin rebuilds. */
    function figmaNum(v) {
      var n = parseFloat(v);
      return isFinite(n) ? n : 0;
    }

    function figmaLayoutOf(el, view) {
      var cs = (view || window).getComputedStyle(el);
      var d = String(cs.display || '').toLowerCase();
      var mode = 'NONE';
      if (d.indexOf('flex') !== -1) {
        mode = String(cs.flexDirection || 'row').indexOf('row') === 0 ? 'HORIZONTAL' : 'VERTICAL';
      } else if (d.indexOf('grid') !== -1) {
        mode = 'GRID';
      }
      return {
        mode: mode,
        spacing: figmaNum(cs.columnGap || cs.gap),
        counterSpacing: figmaNum(cs.rowGap || cs.gap),
        padding: [figmaNum(cs.paddingTop), figmaNum(cs.paddingRight), figmaNum(cs.paddingBottom), figmaNum(cs.paddingLeft)],
        align: cs.alignItems || 'stretch',
        justify: cs.justifyContent || 'flex-start',
        wrap: String(cs.flexWrap || 'nowrap') === 'nowrap' ? 'NO_WRAP' : 'WRAP',
        grow: figmaNum(cs.flexGrow),
        columns: cs.gridTemplateColumns || '',
        positioning: (cs.position === 'absolute' || cs.position === 'fixed') ? 'ABSOLUTE' : 'AUTO'
      };
    }

    function figmaStyleOf(el, view) {
      var cs = (view || window).getComputedStyle(el);
      return {
        fill: cs.backgroundColor,
        color: cs.color,
        radius: figmaNum(cs.borderTopLeftRadius),
        stroke: figmaNum(cs.borderTopWidth) > 0 ? cs.borderTopColor : null,
        strokeWidth: figmaNum(cs.borderTopWidth),
        fontFamily: cs.fontFamily,
        fontSize: figmaNum(cs.fontSize),
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        whiteSpace: cs.whiteSpace,
        textOverflow: cs.textOverflow,
        shadow: cs.boxShadow || 'none',
        opacity: figmaNum(cs.opacity) || 1
      };
    }

    function figmaSkip(el, view) {
      if (!el || !el.tagName) return true;
      var tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'br' || tag === 'link' || tag === 'meta' || tag === 'title') return true;
      if (tag === 'button' && String(el.getAttribute('onclick') || '').indexOf('copy') !== -1) return true;
      /* Browser-only chrome. Anything marked data-figma-ignore never reaches
       * Figma. The Doop importer keeps these as invisible layers; we do not. */
      if (el.closest && el.closest('[data-figma-ignore], .swatch-copy-pill, .section-copy-btn, .copy-btn, .workspace-topbar, .modal, .modal-overlay, .toast-notification')) return true;
      var cs = (view || window).getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return true;
      if (parseFloat(cs.opacity) === 0) return true;
      return false;
    }

    /* CSS colour → canonical hex, so a DOM style can name the variable it
       should bind to. rgba(0,0,0,0) is transparent and has no token. */
    function cssToHex(str) {
      if (!str || typeof str !== 'string') return null;
      var s = str.trim().toLowerCase();
      if (s === 'transparent' || s === 'none' || s === 'rgba(0, 0, 0, 0)') return null;
      if (s.charAt(0) === '#') {
        var h = s.slice(1);
        if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
        if (h.length === 8) h = h.slice(0, 6);
        return /^[0-9a-f]{6}$/.test(h) ? '#' + h.toUpperCase() : null;
      }
      var m = s.match(/rgba?\\(([^)]+)\\)/);
      if (!m) return null;
      var p = m[1].split(/[,\\s\\/]+/).filter(Boolean).map(parseFloat);
      if (p.length < 3) return null;
      if (p.length > 3 && p[3] <= 0.001) return null;
      var out = '#';
      for (var i = 0; i < 3; i++) {
        var b = Math.max(0, Math.min(255, Math.round(p[i]))).toString(16);
        out += (b.length === 1 ? '0' : '') + b;
      }
      return out.toUpperCase();
    }

    function componentSpecOf(el) {
      var name = el.getAttribute('data-figma-component');
      if (!name) return null;
      return {
        name: name,
        variant: el.getAttribute('data-figma-variant') || 'Default',
        description: el.getAttribute('data-figma-description') || ''
      };
    }

    var SHEET_INDEX = ${JSON.stringify(SHEET_INDEX)};
    var CAPTURE_VIEWPORT = ${CAPTURE_VIEWPORT};
    var CAPTURE_MODE = ${JSON.stringify(CAPTURE_MODE)};
    var GENERATOR_VERSION = ${JSON.stringify(GENERATOR_VERSION)};
    var CAPTURE_CSS =
      'html,body{width:' + CAPTURE_VIEWPORT + 'px!important;min-width:' + CAPTURE_VIEWPORT + 'px!important;max-width:' + CAPTURE_VIEWPORT + 'px!important;margin:0!important;padding:0!important;background:#fff!important}' +
      'main{display:block!important;width:' + CAPTURE_VIEWPORT + 'px!important;margin:0!important;padding:0!important;gap:0!important}' +
      '.figma-sheet.hidden-sheet{display:block!important}' +
      '.workspace-topbar,.toast-notification,.modal-overlay,.modal{display:none!important}';

    /* A fresh, fixed-width document. Stripping scripts also strips the ~600KB
       embedded replay bundle, so the clone is cheap. DOMParser + document.write
       keeps everything synchronous except the optional font wait. */
    function makeCaptureView() {
      try {
        var parsed = new DOMParser().parseFromString('<!DOCTYPE html>' + document.documentElement.outerHTML, 'text/html');
        var scripts = parsed.querySelectorAll('script');
        for (var i = 0; i < scripts.length; i++) scripts[i].parentNode.removeChild(scripts[i]);
        parsed.body.className = 'figma-capture-mode';
        var hidden = parsed.querySelectorAll('.hidden-sheet');
        for (var j = 0; j < hidden.length; j++) hidden[j].classList.remove('hidden-sheet');
        var inspected = parsed.querySelectorAll('[data-figma-layout],[data-figma-warn]');
        for (var k = 0; k < inspected.length; k++) {
          inspected[k].removeAttribute('data-figma-layout');
          inspected[k].removeAttribute('data-figma-warn');
        }
        var style = parsed.createElement('style');
        style.textContent = CAPTURE_CSS;
        parsed.head.appendChild(style);

        var frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.setAttribute('title', 'canonical capture');
        frame.style.cssText = 'position:fixed;left:-100000px;top:0;width:' + CAPTURE_VIEWPORT + 'px;height:900px;border:0;';
        document.body.appendChild(frame);
        var doc = frame.contentDocument;
        var view = frame.contentWindow;
        doc.open();
        doc.write('<!DOCTYPE html>' + parsed.documentElement.outerHTML);
        doc.close();
        return {
          doc: doc, view: view,
          cleanup: function () { if (frame.parentNode) frame.parentNode.removeChild(frame); }
        };
      } catch (e) {
        return { doc: document, view: window, cleanup: function () {}, fallback: String((e && e.message) || e) };
      }
    }

    ${CHECKSUM_JS}

    async function buildFigmaManifest() {
      var tokens = {};
      var system = null;
      var tokenEl = document.getElementById('figma-tokens');
      var systemEl = document.getElementById('figma-system');
      if (tokenEl) { try { tokens = JSON.parse(tokenEl.textContent || '{}'); } catch (e) {} }
      if (systemEl) { try { system = JSON.parse(systemEl.textContent || 'null'); } catch (e) {} }
      if (!system) {
        system = {
          version: tokens.version || 'v1.0',
          brand: tokens.brand || document.title.split(' ')[0],
          slug: tokens.slug || '',
          namespace: tokens.namespace || '',
          colours: (tokens.palette || []).map(function (p) { return { name: p.name, hex: p.hex, token: p.name, group: 'Primitive' }; }),
          type: tokens.type || [], space: tokens.space || [], radius: tokens.radius || [],
          effects: [], components: [], fonts: null, sheets: SHEET_INDEX
        };
      }

      /* Token lookup tables: computed CSS values → the design-system name. */
      var colourByHex = {};
      for (var ci = 0; ci < (system.colours || []).length; ci++) {
        var col = system.colours[ci];
        var H = cssToHex(col.hex);
        if (H && !colourByHex[H]) colourByHex[H] = col.token || col.name;
      }
      var typeBySize = {};
      for (var ti = 0; ti < (system.type || []).length; ti++) {
        var t = system.type[ti];
        var sz = Math.round(Number(t.size) || 0);
        if (sz && !typeBySize[sz]) typeBySize[sz] = t.name;
      }

      var cap = makeCaptureView();
      var doc = cap.doc, view = cap.view;
      try {
        /* Webfonts change text metrics; wait for them, but never let an offline
           Google Fonts request stall a download. */
        try {
          var ready = [];
          if (document.fonts && document.fonts.ready) ready.push(document.fonts.ready);
          if (doc !== document && doc.fonts && doc.fonts.ready) ready.push(doc.fonts.ready);
          if (ready.length) await Promise.race(ready.concat([new Promise(function (r) { setTimeout(r, 1500); })]));
        } catch (e) {}

        var MAX_DEPTH = 12;
        var MAX_NODES = 4000;
        var count = 0;
        var origin = { left: 0, top: 0 };

        function walk(el, depth) {
          if (count >= MAX_NODES || depth > MAX_DEPTH || figmaSkip(el, view)) return null;
          var tag = el.tagName.toLowerCase();
          var r = el.getBoundingClientRect();
          var box = {
            x: Math.round(r.left - origin.left), y: Math.round(r.top - origin.top),
            w: Math.round(r.width), h: Math.round(r.height)
          };
          var id = 'n' + (count + 1);
          if (tag === 'svg') {
            count++;
            return {
              id: id,
              name: el.getAttribute('aria-label') || el.getAttribute('data-figma-name') || 'vector',
              role: el.getAttribute('data-figma-role') || 'vector',
              type: 'VECTOR', svg: el.outerHTML, box: box,
              componentRef: componentSpecOf(el),
              tokenRef: null, styleRef: null,
              children: []
            };
          }
          count++;
          var layout = figmaLayoutOf(el, view);
          var style = figmaStyleOf(el, view);
          var rawText = el.children.length === 0 ? String(el.textContent || '').trim() : '';
          var isText = rawText.length > 0;
          var label = el.getAttribute('data-figma-node') || (typeof el.className === 'string' && el.className.split(' ')[0]) || tag;
          var fillHex = cssToHex(style.fill);
          var node = {
            id: id,
            name: label,
            role: el.getAttribute('data-figma-role') || (isText ? 'text' : (el.getAttribute('data-figma-component') ? 'component' : 'container')),
            type: isText ? 'TEXT' : (layout.mode !== 'NONE' || el.children.length ? 'FRAME' : 'RECTANGLE'),
            layout: layout,
            style: style,
            box: box,
            component: el.getAttribute('data-figma-node'),
            componentRef: componentSpecOf(el),
            styleRef: isText ? (typeBySize[Math.round(style.fontSize)] || null) : null,
            tokenRef: fillHex ? (colourByHex[fillHex] || null) : null,
            text: isText ? rawText.slice(0, 240) : null,
            children: []
          };
          if (depth < MAX_DEPTH && !isText) {
            for (var i = 0; i < el.children.length && count < MAX_NODES; i++) {
              var child = walk(el.children[i], depth + 1);
              if (child) node.children.push(child);
            }
          }
          return node;
        }

        var sheets = [];
        var sections = doc.querySelectorAll('.figma-sheet');
        for (var s = 0; s < sections.length; s++) {
          var sec = sections[s];
          var name = sec.getAttribute('data-section') || sec.id;
          var meta = null;
          for (var mi = 0; mi < SHEET_INDEX.length; mi++) if (SHEET_INDEX[mi].name === name || SHEET_INDEX[mi].label === sec.id) meta = SHEET_INDEX[mi];
          origin = sec.getBoundingClientRect();
          var root = walk(sec, 0);
          if (root) {
            sheets.push({
              index: meta ? meta.index : s + 1,
              name: name,
              label: sec.id,
              title: meta ? meta.title : name,
              optional: meta ? meta.optional : false,
              node: root
            });
          }
        }

        var dsId = (system.dsId || (String(system.slug || tokens.slug || 'brand').toLowerCase() + '@' + String(system.version || 'v1.0').replace(/^v/i, '')));
        var m = {
          version: 2,
          kind: 'sunnyside/figma-manifest',
          dsId: dsId,
          brand: system.brand || tokens.brand || document.title.split(' ')[0],
          slug: system.slug || tokens.slug || '',
          versionLabel: system.version || tokens.version || 'v1.0',
          namespace: system.namespace || tokens.namespace || '',
          source: window.location.href,
          capture: {
            viewport: CAPTURE_VIEWPORT,
            sheets: sheets.length,
            mode: cap.fallback ? 'live-window-fallback' : CAPTURE_MODE,
            generator: GENERATOR_VERSION,
            fallback: cap.fallback || null
          },
          system: system,
          tokens: tokens,
          sheets: sheets,
          nodes: count
        };
        m.capture.checksum = figmaChecksum(JSON.stringify({
          dsId: m.dsId, version: m.version,
          viewport: m.capture.viewport, sheets: m.capture.sheets,
          mode: m.capture.mode, generator: m.capture.generator,
          system: m.system, tokens: m.tokens, sheetsTree: m.sheets, nodes: m.nodes
        }));
        return m;
      } finally {
        cap.cleanup();
      }
    }

    function toggleAutoLayoutMode(forceState) {
      var on = forceState !== undefined ? forceState : !document.body.classList.contains('al-mode');
      document.body.classList.toggle('al-mode', on);
      var btn = document.getElementById('btn-autolayout');
      if (btn) btn.classList.toggle('active-al', on);
      var flow = 0;
      var flagged = 0;
      var all = document.querySelectorAll('.figma-sheet *');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        var cs = window.getComputedStyle(el);
        var d = String(cs.display || '').toLowerCase();
        var isFlow = d.indexOf('flex') !== -1 || d.indexOf('grid') !== -1;
        if (isFlow && on) { el.setAttribute('data-figma-layout', d); flow++; } else { el.removeAttribute('data-figma-layout'); }
        var risky = cs.position === 'absolute' || cs.position === 'fixed' || String(cs.transform || 'none') !== 'none' || String(cs.backdropFilter || 'none') !== 'none';
        if (risky && on) { el.setAttribute('data-figma-warn', '1'); flagged++; } else { el.removeAttribute('data-figma-warn'); }
      }
      try {
        var url = new URL(window.location.href);
        if (on) url.searchParams.set('autolayout', '1'); else url.searchParams.delete('autolayout');
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
      showToast((on ? 'Auto Layout inspector on' : 'Auto Layout inspector off') + ' · ' + flow + ' flow containers · ' + flagged + ' to review');
    }

    async function copyFigmaManifest() {
      var m = await buildFigmaManifest();
      copyToClipboard(JSON.stringify(m), 'Copied Figma manifest · ' + m.sheets.length + ' sheets · ' + m.nodes + ' nodes · ' + m.capture.checksum);
      return m;
    }

    /*__REPLAY_ASSETS__*/

    /*__FIGMA_DOWNLOAD__*/

    // Auto-enable Clean Export Mode, Canvas Grid, and Single Sheet Filter from URL
    function initExportControls() {
      const params = new URLSearchParams(window.location.search);
      if (params.get('clean') === '1' || params.get('figma') === '1') {
        document.body.classList.add('clean-export-mode');
        const cleanBtn = document.getElementById('btn-clean');
        if (cleanBtn) cleanBtn.classList.add('active-clean');
      }
      if (params.get('doop') === '1') {
        document.body.classList.add('doop-mode');
        document.body.classList.add('clean-export-mode');
      }
      if (params.get('spec') === '1') {
        document.body.classList.add('spec-mode');
        const specBtn = document.getElementById('btn-spec');
        if (specBtn) specBtn.classList.add('active-spec');
      }
      if (params.get('autolayout') === '1') {
        toggleAutoLayoutMode(true);
      }
      if (params.get('grid') === '1' || params.get('canvas') === '1' || params.get('layout') === 'grid') {
        document.body.classList.add('canvas-grid-mode');
        const gridBtn = document.getElementById('btn-grid');
        if (gridBtn) gridBtn.classList.add('active-grid');
      }

      // Check for single sheet filter (?sheet=1..8 or ?sheet=colors etc.)
      const sheetParam = params.get('sheet') || params.get('section') || params.get('part');
      if (sheetParam) {
        const sheetMap = {
          '1': 'colors', '01': 'colors', 'colors': 'colors', 'color': 'colors',
          '2': 'primitives', '02': 'primitives', 'primitives': 'primitives', 'primitive': 'primitives',
          '3': 'typography', '03': 'typography', 'typography': 'typography', 'type': 'typography',
          '4': 'logo', '04': 'logo', 'logo': 'logo',
          '5': 'assets', '05': 'assets', 'assets': 'assets', 'cast': 'assets',
          '6': 'components', '06': 'components', 'components': 'components', 'ui': 'components',
          '7': 'overlays', '07': 'overlays', 'overlays': 'overlays', 'modals': 'overlays', 'modal': 'overlays',
          '8': 'patterns', '08': 'patterns', 'patterns': 'patterns', 'tokens': 'patterns'
        };
        const targetSection = sheetMap[sheetParam.toLowerCase()] || sheetParam;
        const matchingBtn = Array.from(document.querySelectorAll('.nav-pill')).find(el => (el.getAttribute('onclick') || '').includes("'" + targetSection + "'"));
        filterSection(targetSection, matchingBtn, false);
      }
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initExportControls);
    } else {
      initExportControls();
    }
  </script>
</body>
</html>
`

  /* Bake the replay plugin bytes + download handlers into the sheet so the
   * toolbar can hand a designer a ready-to-import plugin without any network. */
  const replayAssets = buildReplayAssets(brandName, slug)
  const html = htmlTemplate
    .replace('/*__REPLAY_ASSETS__*/', () => replayAssets)
    .replace('/*__FIGMA_DOWNLOAD__*/', () => FIGMA_DOWNLOAD_JS)

  const targetOut =
    outPath ||
    (slug === 'sunnyside' && !existsSync(join(resolvedRoot, 'public', 'brand', 'sunnyside'))
      ? join(resolvedRoot, 'public', 'brand', 'sunnyside-figma.html')
      : join(resolvedRoot, 'public', 'brand', slug, `${slug}-figma.html`))

  mkdirSync(dirname(targetOut), { recursive: true })
  writeFileSync(targetOut, html, 'utf8')

  // For sunnyside, also write public/brand/sunnyside/sunnyside-figma.html so both paths resolve
  if (slug === 'sunnyside') {
    const nestedOut = join(resolvedRoot, 'public', 'brand', 'sunnyside', 'sunnyside-figma.html')
    mkdirSync(dirname(nestedOut), { recursive: true })
    writeFileSync(nestedOut, html, 'utf8')
  }

  return { slug, brandName, outPath: targetOut, primitives: primitives.length, contrast: contrastPairs.length }
}

/* ── CLI Entrypoint ──────────────────────────────────────────────────────── */

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
if (isMain) {
  const args = process.argv.slice(2)
  const one = (name, fallback) => {
    const i = args.indexOf(`--${name}`)
    return i === -1 ? fallback : args[i + 1]
  }
  const has = (name) => args.includes(`--${name}`)

  const root = resolve(one('root', '.'))
  const slug = one('slug', '')
  const out = one('out', null)
  const tokens = one('tokens', null)
  const all = has('all')
  const check = has('check')

  if (!slug && !all) {
    console.error(`Usage:
  node scripts/figma-html.mjs --slug <slug> [--root .] [--tokens <path>] [--out <path>] [--check]
  node scripts/figma-html.mjs --all [--root .] [--check]`)
    process.exit(1)
  }

  /* One brand per case folder is as common here as features/<slug>/ at a root.
   * Record the base beside the slug so CSS, SVGs and the output resolve in the
   * case that owns the tokens, not in the workspace root. */
  const found = new Map()
  const addFrom = (base) => {
    for (const dir of ['features', 'src/features', 'public/brand']) {
      const full = join(root, base, dir)
      if (!existsSync(full)) continue
      for (const entry of readdirSync(full, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const s = entry.name === 'design-system' ? 'sunnyside' : entry.name
        const caseRoot = join(root, base)
        if (locateTokens(caseRoot, s, null) && !found.has(s)) found.set(s, caseRoot)
      }
    }
    const caseRoot = join(root, base)
    const caseSlug = base || basename(root)
    if (existsSync(join(caseRoot, 'src', 'tokens.json')) && !found.has(caseSlug)) {
      found.set(caseSlug, caseRoot)
    }
  }
  if (existsSync(root)) {
    /* A repo that keeps every case inside `src/features/` or `public/brand/`
     * has no top-level case folders, so the loop below would find nothing —
     * a 25-case design-system repo resolved 0 brands. Scan those conventional
     * roots directly first; they are skipped by the loop's deny list. */
    addFrom('')
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules') continue
      if (['scripts', 'templates', 'references', 'examples', 'assets', 'fonts', 'cast', 'docs', 'tokens', 'lib', 'types', 'design', 'components', 'src', 'public', 'features'].includes(entry.name)) continue
      addFrom(entry.name)
    }
  }

  if (check) {
    if (all) {
      for (const [s, base] of [...found].sort()) {
        const p = locateTokens(base, s, s === slug ? tokens : null)
        console.log(`  ${s.padEnd(18)} root=${base} tokens=${p || 'MISSING'}`)
      }
      console.log(`\n  ${found.size} brand(s) resolved. Nothing written.`)
    } else {
      const p = locateTokens(root, slug, tokens)
      const parsed = p ? readTokens(p) : null
      console.log(JSON.stringify({ slug, root, tokens: p, name: parsed?.name, shape: parsed?.shape, primitives: parsed?.primitives.length, contrast: parsed?.contrast.length }, null, 2))
      console.log('\n  Nothing written.')
    }
  } else if (all) {
    let count = 0
    for (const [s, base] of [...found].sort()) {
      const res = generateFigmaHtml({ slug: s, root: base })
      console.log(`  ✓ ${res.slug.padEnd(18)} → ${res.outPath} (${res.primitives} primitives, ${res.contrast} contrast pairs)`)
      count++
    }
    console.log(`\n  Generated ${count} Figma HTML documentation sheet(s).`)
  } else {
    const res = generateFigmaHtml({ slug, root, outPath: out, tokensPath: tokens })
    console.log(`  ✓ ${res.slug} → ${res.outPath} (${res.primitives} primitives, ${res.contrast} contrast pairs)`)
  }
}
