#!/usr/bin/env node
/**
 * brandkit-board.mjs — Universal 6-Panel Flagship Brand Kit Board Generator (Clearing / Vesper / Tavola Spec)
 *
 * Saves ~3,500 LLM output tokens by deterministically composing the 1500×1125 (3000×2250 @2x)
 * 6-panel Brand Board directly from `tokens.json`, `mark.svg`, `wordmark.svg`, `cast/*.svg`,
 * and the hero surface image (`<slug>-table.webp`, `painting.webp`, or `field.svg`).
 *
 * Usage:
 *   node skills/sunnyside-brand-system/scripts/brandkit-board.mjs \
 *     --tokens features/<slug>/tokens.json \
 *     --brand public/brand/<slug> \
 *     [--hero public/brand/<slug>/hero.webp] \
 *     [--out public/brand/<slug>/<slug>-brandkit.png]
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const flag = (name, fallback = '') => {
  const idx = args.indexOf(`--${name}`)
  return idx === -1 ? fallback : args[idx + 1]
}

const slug = flag('slug', 'brand')
const tokensPath = flag('tokens', `features/${slug}/tokens.json`)
const brandDir = flag('brand', `public/brand/${slug}`)
const heroArg = flag('hero', '')
const outPath = flag('out', path.join(brandDir, `${slug}-brandkit.png`))

if (!fs.existsSync(tokensPath)) {
  console.error(`tokens.json not found at: ${tokensPath}`)
  process.exit(1)
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'))
const meta = tokens.meta || {}
const primitives = tokens.primitives || []
const contrast = tokens.contrast || []
const fails = contrast.filter((c) => !c.pass)
const passes = contrast.filter((c) => c.pass)

const ground = primitives[0]?.value || '#FAF6EE'
const surface = primitives[1]?.value || '#F2ECE0'
const ink = primitives.find((p) => /ink|espresso|bark|obsidian|lampblack/i.test(p.name))?.value || '#191A2E'
const accent = primitives.find((p) => p.name === meta.primaryAccent || /accent|signal|coral|terracotta|cobalt/i.test(p.name))?.value || '#D85A38'

const readSvgInner = (file) => {
  const full = path.join(brandDir, file)
  if (!fs.existsSync(full)) return ''
  return fs.readFileSync(full, 'utf8')
}

const markSvg = readSvgInner('mark-reverse.svg') || readSvgInner('mark.svg')
const compactSvg = readSvgInner('mark-compact-reverse.svg') || readSvgInner('mark-compact.svg') || markSvg
const lockupRevSvg = readSvgInner('lockup-reverse.svg') || readSvgInner('lockup.svg')

// Auto-discover hero surface image if not passed explicitly
let heroFile = heroArg
if (!heroFile && fs.existsSync(brandDir)) {
  const candidates = fs
    .readdirSync(brandDir)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f) && !f.includes('brandkit') && !f.includes('favicon') && !f.includes('icon'))
  if (candidates.length > 0) heroFile = path.join(brandDir, candidates[0])
}

let heroDataUri = ''
if (heroFile && fs.existsSync(heroFile)) {
  const ext = path.extname(heroFile).slice(1).toLowerCase()
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
  heroDataUri = `data:${mime};base64,${fs.readFileSync(heroFile).toString('base64')}`
}

// Auto-discover companion cast SVGs
const castDir = path.join(brandDir, 'cast')
let castItems = []
if (fs.existsSync(castDir)) {
  castItems = fs
    .readdirSync(castDir)
    .filter((f) => f.endsWith('.svg'))
    .slice(0, 6)
    .map((f) => ({
      id: path.basename(f, '.svg'),
      svg: fs.readFileSync(path.join(castDir, f), 'utf8'),
    }))
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..800;1,400..600&family=Instrument+Sans:wght@400..700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px;
    height: 1125px;
    background: ${surface};
    color: ${ink};
    font-family: 'Instrument Sans', system-ui, sans-serif;
    padding: 28px;
    -webkit-font-smoothing: antialiased;
  }
  #board {
    width: 1444px;
    height: 1069px;
    display: grid;
    grid-template-columns: 836px 588px;
    grid-template-rows: 576px 236px 217px;
    gap: 20px;
  }
  .panel {
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: ${ground};
  }
  .mono {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .p-hero {
    background: ${ink};
    color: ${ground};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 32px;
  }
  .p-hero__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .p-hero__scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(16,13,11,0.48) 0%, rgba(16,13,11,0.16) 40%, rgba(16,13,11,0.84) 100%);
    z-index: 1;
  }
  .p-hero__top, .p-hero__bottom { position: relative; z-index: 2; }
  .p-hero__top { display: flex; justify-content: space-between; opacity: 0.85; }
  .p-hero__title {
    font-family: 'Archivo', 'Helvetica Neue', sans-serif;
    font-size: 48px;
    line-height: 0.98;
    letter-spacing: -0.03em;
    font-weight: 500;
    max-width: 15ch;
    margin: 14px 0 12px;
  }
  .p-hero__sub { font-size: 14.5px; line-height: 1.55; opacity: 0.88; max-width: 52ch; }
  .p-mark {
    background: ${ink};
    color: ${ground};
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .p-mark__stage { display: flex; flex-direction: column; gap: 22px; margin: auto 0; }
  .p-mark__lockup svg { width: 100%; height: auto; display: block; }
  .p-mark__scale { display: flex; align-items: flex-end; gap: 18px; padding-top: 4px; }
  .p-mark__scale svg { width: 100%; height: auto; display: block; }
  .p-pal { padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-pal__grid { display: grid; align-content: start; grid-template-columns: repeat(${primitives.length > 7 ? 5 : primitives.length}, 1fr); gap: 8px; }
  .swatch { border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,0,0,0.12); background: #fff; }
  .swatch__color { height: ${primitives.length > 7 ? 44 : 104}px; }
  .swatch__meta { padding: 5px 7px; }
  .swatch__name { font-size: 9.5px; font-weight: 700; display: block; color: #191a2e; }
  .swatch__hex { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #555; }
  .p-type { padding: 20px 26px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-cast { padding: 18px 22px 26px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-cast__grid svg { width: 100%; height: 100%; display: block; }
  .p-cast__grid { display: grid; grid-template-columns: repeat(${Math.max(castItems.length, 1)}, 1fr); gap: 10px; align-items: start; padding-top: 4px; }
  .p-rules { background: ${ink}; color: ${ground}; padding: 18px 24px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .p-rules li { font-size: 11.25px; line-height: 1.38; opacity: 0.85; padding-left: 14px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 5px; width: 6px; height: 6px; border-radius: 99px; background: ${accent}; }
</style>
</head>
<body>
  <div id="board">
    <div class="panel p-hero">
      ${heroDataUri ? `<img class="p-hero__img" src="${heroDataUri}" alt="" />` : ''}
      <div class="p-hero__scrim"></div>
      <div class="p-hero__top">
        <span class="mono">BRAND KIT · ${meta.version || 'V4.2'} · ${(meta.slug || slug).toUpperCase()}</span>
        <span class="mono">${(meta.track || 'CONSTRUCTED').toUpperCase()} TRACK · 64 GRID</span>
      </div>
      <div class="p-hero__bottom">
        <div style="display:inline-flex;padding:10px 16px;border-radius:12px;background:rgba(0,0,0,0.52);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.2);">
          <div style="height:36px;display:flex;align-items:center;">${lockupRevSvg}</div>
        </div>
        <h1 class="p-hero__title">${meta.essence || meta.name || slug}</h1>
        <p class="p-hero__sub">${meta.promise || meta.oneSentence || ''}</p>
      </div>
    </div>
    <div class="panel p-mark">
      <div style="display:flex;justify-content:space-between;opacity:0.55;" class="mono">
        <span>LOGO / 01 · KUWAYAMA 64 GRID</span>
        <span style="text-align:right;">GRID 64<br/>CLEARSPACE 8</span>
      </div>
      <div class="p-mark__stage">
        <div class="p-mark__lockup">${lockupRevSvg || markSvg}</div>
        <div class="p-mark__scale">
          <div style="width:96px;">${markSvg}</div>
          <div style="width:48px;">${markSvg}</div>
          <div style="width:24px;">${compactSvg}</div>
          <div style="width:16px;">${compactSvg}</div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.14);padding-top:16px;display:flex;justify-content:space-between;align-items:flex-end;" class="mono">
        <span>64 · 32 · 16 COMPACT</span>
        <span>SEPARATE 16PX DRAWING</span>
      </div>
    </div>
    <div class="panel p-pal">
      <div style="display:flex;justify-content:space-between;opacity:0.65;" class="mono">
        <span>PALETTE / ${primitives.length} PRIMITIVES</span>
        <span>${passes.length} PASS · ${fails.length} PUBLISHED FAILS</span>
      </div>
      <div class="p-pal__grid">
        ${primitives
          .slice(0, 10)
          .map(
            (p) => `<div class="swatch"><div class="swatch__color" style="background:${p.value};"></div><div class="swatch__meta"><span class="swatch__name">${p.name}</span><span class="swatch__hex">${p.value}</span></div></div>`
          )
          .join('')}
      </div>
    </div>
    <div class="panel p-type">
      <div style="display:flex;justify-content:space-between;opacity:0.65;" class="mono">
        <span>TYPE / 03 VOICES</span>
        <span>OPTICAL CONTRAST STACK</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div><span class="mono" style="opacity:0.55;display:block;">DISPLAY</span><span style="font-family:'Archivo',sans-serif;font-size:28px;">${meta.name || slug} · Aa 14:30</span></div>
        <div><span class="mono" style="opacity:0.55;display:block;">READING</span><span style="font-size:15px;">${meta.essence || 'Measured 60-68ch reading column over solid plates.'}</span></div>
        <div><span class="mono" style="opacity:0.55;display:block;">MONO</span><span class="mono" style="font-size:12.5px;color:${accent};">OKLCH DUAL-SCOPE · TABULAR-NUMS</span></div>
      </div>
    </div>
    <div class="panel p-cast">
      <div style="display:flex;justify-content:space-between;opacity:0.65;" class="mono">
        <span>CAST / COMPANION MARKS</span>
        <span>64-UNIT GRID · FILL ONLY</span>
      </div>
      <div class="p-cast__grid">
        ${castItems
          .map(
            (c) => `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;"><div style="width:26px;height:26px;line-height:0;">${c.svg}</div><span class="mono" style="font-size:8px;letter-spacing:0.1em;">${c.id}</span></div>`
          )
          .join('')}
      </div>
    </div>
    <div class="panel p-rules">
      <div style="display:flex;justify-content:space-between;opacity:0.5;" class="mono">
        <span>ARCHITECTURAL LAWS</span>
        <span>64 GRID · FILL ONLY</span>
      </div>
      <ul>
        <li><b>Field + Waybill.</b> Kraft and brick carry the field; type sits on stock or a chalk plate, never on the photo.</li>
        <li><b>Boolean counter-form.</b> The arrow is carved out of the carton, never drawn beside it. One mass, one cut.</li>
        <li><b>Honest contrast ledger.</b> Three pairs fail 4.5:1 and are published as graphic-only jobs.</li>
        <li><b>Rules, not shadows.</b> 1px ink rules and 4px seams replace every drop shadow. Zero blur on paper.</li>
      </ul>
      <div style="display:flex;justify-content:space-between;opacity:0.45;" class="mono">
        <span>${(meta.name || slug).toUpperCase()}</span>
        <span>MANIFEST · CASE 19</span>
      </div>
    </div>
  </div>
</body>
</html>`

const htmlOut = path.join(brandDir, 'brandkit.html')
fs.writeFileSync(htmlOut, html, 'utf8')

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  ;({ chromium } = await import('@playwright/test'))
}

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1500, height: 1125 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
})
await page.goto(pathToFileURL(path.resolve(htmlOut)).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
await page.locator('body').screenshot({ path: path.resolve(outPath) })
await browser.close()
console.log(`Rendered 6-panel brandkit board → ${outPath} (3000 × 2250)`)
