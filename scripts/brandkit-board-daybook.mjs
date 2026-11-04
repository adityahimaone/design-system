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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px;
    height: 1125px;
    background: ${surface};
    color: ${ink};
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
    padding: 28px;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  /* The light field: the same photograph the page frosts, thrown far out of focus. */
  body::before {
    content: '';
    position: fixed;
    inset: -90px;
    background-image: url('${heroDataUri}');
    background-size: cover;
    background-position: center 46%;
    filter: blur(52px) saturate(1.16) contrast(1.02);
    z-index: 0;
  }
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(120% 90% at 16% 6%, rgba(255,255,255,0.94), transparent 62%),
      radial-gradient(84% 72% at 90% 82%, rgba(159,194,218,0.44), transparent 66%),
      linear-gradient(166deg, rgba(255,255,255,0.86), rgba(233,238,243,0.60));
    z-index: 0;
  }
  #board {
    position: relative;
    z-index: 1;
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
    border: 1px solid rgba(255, 255, 255, 0.88);
    background: rgba(255, 255, 255, 0.58);
    backdrop-filter: blur(18px) saturate(1.35);
    -webkit-backdrop-filter: blur(18px) saturate(1.35);
    box-shadow: 0 1px 0 0 rgba(255,255,255,0.90) inset, 0 18px 40px -24px rgba(19,28,37,0.34);
  }
  .panel--deep {
    background: rgba(11, 18, 24, 0.74);
    border-color: rgba(255, 255, 255, 0.26);
    color: ${ground};
    box-shadow: 0 1px 0 0 rgba(255,255,255,0.22) inset, 0 18px 40px -24px rgba(11,18,24,0.52);
  }
  .mono {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .p-hero {
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
    filter: saturate(0.9) brightness(0.8) contrast(1.04);
    z-index: 0;
  }
  /* Two washes, not one: the loft photograph is bright at the top and centre,
     so a vertical scrim alone leaves the mono header and the lede at 2:1. */
  .p-hero__scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(11,18,24,0.58) 0%, rgba(11,18,24,0.16) 32%, rgba(11,18,24,0.84) 100%),
      linear-gradient(96deg, rgba(11,18,24,0.64) 0%, rgba(11,18,24,0.26) 54%, rgba(11,18,24,0) 100%);
    z-index: 1;
  }
  .p-hero__top, .p-hero__bottom { position: relative; z-index: 2; }
  .p-hero__top { display: flex; justify-content: space-between; opacity: 0.85; }
  .p-hero__title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 46px;
    line-height: 1.0;
    letter-spacing: -0.032em;
    font-weight: 300;
    max-width: 15ch;
    margin: 14px 0 12px;
  }
  .p-hero__sub { font-size: 14.5px; line-height: 1.55; opacity: 0.88; max-width: 52ch; }
  .p-mark {
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
  .swatch { border-radius: 10px; overflow: hidden; border: 1px solid rgba(19,28,37,0.10); background: rgba(255,255,255,0.82); }
  .swatch__color { height: ${primitives.length > 7 ? 44 : 104}px; }
  .swatch__meta { padding: 5px 7px; }
  .swatch__name { font-size: 9.5px; font-weight: 700; display: block; color: #191a2e; }
  .swatch__hex { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #555; }
  .p-type { padding: 20px 26px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-cast { padding: 18px 22px 26px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-cast__grid svg { width: 100%; height: 100%; display: block; }
  .p-cast__grid { display: grid; grid-template-columns: repeat(${Math.max(castItems.length, 1)}, 1fr); gap: 10px; align-items: start; padding-top: 4px; }
  .p-rules { color: ${ground}; padding: 16px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .p-rules li { font-size: 10.4px; line-height: 1.34; opacity: 0.85; padding-left: 13px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 4px; width: 5px; height: 5px; border-radius: 999px; background: ${accent}; }
</style>
</head>
<body>
  <div id="board">
    <div class="panel panel--deep p-hero">
      ${heroDataUri ? `<img class="p-hero__img" src="${heroDataUri}" alt="" />` : ''}
      <div class="p-hero__scrim"></div>
      <div class="p-hero__top">
        <span class="mono">BRAND KIT · ${meta.version || 'V4.2'} · ${(meta.slug || slug).toUpperCase()}</span>
        <span class="mono">${(meta.track || 'CONSTRUCTED').toUpperCase()} TRACK · 64 GRID</span>
      </div>
      <div class="p-hero__bottom">
        <div style="display:inline-flex;padding:12px 18px;border-radius:16px;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.30);backdrop-filter:blur(18px) saturate(1.35);box-shadow:0 1px 0 0 rgba(255,255,255,0.28) inset;">
          <div style="height:30px;display:flex;align-items:center;">${lockupRevSvg}</div>
        </div>
        <h1 class="p-hero__title">${meta.essence || meta.name || slug}</h1>
        <p class="p-hero__sub">${meta.promise || meta.oneSentence || ''}</p>
      </div>
    </div>
    <div class="panel panel--deep p-mark">
      <div style="display:flex;justify-content:space-between;opacity:0.55;" class="mono">
        <span>LOGO / 01 · 9-CELL MATRIX · 64 GRID</span>
        <span style="text-align:right;">GRID 64<br/>RADIUS 16</span>
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
        <span>INTER 300 / 400 · DM MONO</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div><span class="mono" style="opacity:0.55;display:block;">DISPLAY</span><span style="font-family:'Inter',system-ui,sans-serif;font-weight:300;font-size:32px;letter-spacing:-0.028em;">${meta.name || slug} · Aa 14:30</span></div>
        <div><span class="mono" style="opacity:0.55;display:block;">READING</span><span style="font-size:15px;">${meta.essence || 'Measured 60-68ch reading column over solid plates.'}</span></div>
        <div><span class="mono" style="opacity:0.55;display:block;">MONO</span><span class="mono" style="font-size:12.5px;color:${accent};">DB-2204 · DAY + NIGHT · TABULAR</span></div>
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
    <div class="panel panel--deep p-rules">
      <div style="display:flex;justify-content:space-between;opacity:0.5;" class="mono">
        <span>ARCHITECTURAL LAWS</span>
        <span>64 GRID · FILL ONLY</span>
      </div>
      <ul>
        <li><b>Matrix, not shape.</b> Nine cells on a 64 grid, one slid out of place. Never a tenth cell to rebalance it.</li>
        <li><b>Blur is the material.</b> A real 18px backdrop-filter on every pane. 16px radius, 14px seam, 260ms, no serif.</li>
        <li><b>One signal, and it is a tint.</b> Tint marks the live control only. Sun stays fill-only at 2.79:1 on frost.</li>
        <li><b>Two scopes, one room.</b> The same room after dark: ground deep, tint lifted to glow, because tint reads 2.4:1 there.</li>
      </ul>
      <div style="display:flex;justify-content:space-between;opacity:0.45;" class="mono">
        <span>CASE 20 · OFFICE CONSULTANT</span>
        <span>DAYBOOK · V1.1</span>
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
