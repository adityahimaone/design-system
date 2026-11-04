#!/usr/bin/env node
/**
 * brandkit-board-setout.mjs — the 6-panel 1500×1125 (3000×2250 @2x) brand board.
 *
 * Surface #4 Blueprint grid. One daylight scope. The 24px grid is an inline SVG
 * pattern, not a CSS gradient. The only gradient is the hero panel's directional
 * deep-blue scrim. No glass, blur, shadow, radius or night pane.
 *
 *   node scripts/brandkit-board-setout.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const slug = 'setout'
const brandDir = path.join(ROOT, `public/brand/${slug}`)
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, `src/features/${slug}/tokens.json`), 'utf8'))
const outPath = path.join(brandDir, `${slug}-brandkit.png`)
const webpPath = path.join(brandDir, `${slug}-brandkit.webp`)
const htmlOut = path.join(brandDir, 'brandkit.html')

const meta = tokens.meta
const primitives = tokens.primitives
const contrast = tokens.contrast
const passes = contrast.filter((c) => c.pass)
const fails = contrast.filter((c) => !c.pass)
const hex = (n) => primitives.find((p) => p.name === n)?.value || '#000'
const BLUEPRINT = hex('blueprint')
const PLATE = hex('plate')
const CHALK = hex('chalk')
const HIVIS = hex('hivis')
const INK = hex('ink')

const read = (f) => (fs.existsSync(path.join(brandDir, f)) ? fs.readFileSync(path.join(brandDir, f), 'utf8') : '')
const markSvg = read('mark-reverse.svg')
const compactSvg = read('mark-compact-reverse.svg') || markSvg
const glyphSvg = compactSvg
const lockupRev = read('lockup-reverse.svg')

const uri = (f) => `data:image/jpeg;base64,${fs.readFileSync(path.join(brandDir, f)).toString('base64')}`
const heroUri = uri('hero-roof-setout.jpg')
const fieldUri = uri('plate-scaffold.jpg')

const castItems = fs
  .readdirSync(path.join(brandDir, 'cast'))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => ({ id: path.basename(f, '.svg'), svg: fs.readFileSync(path.join(brandDir, 'cast', f), 'utf8') }))

const CAST_NOTE = {
  datum: 'one fixed point',
  formwork: 'shutters + ties',
  grid: 'nine bays, one off',
  level: 'plumb centre',
  pin: 'line into point',
  survey: 'stepped stations',
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&family=Archivo:wght@400..700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  :root {
    --blueprint: ${BLUEPRINT};
    --plate: ${PLATE};
    --chalk: ${CHALK};
    --hivis: ${HIVIS};
    --ink: ${INK};
    --line: color-mix(in srgb, var(--chalk) 22%, transparent);
    --line-soft: color-mix(in srgb, var(--chalk) 12%, transparent);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px; height: 1125px;
    padding: 28px;
    overflow: hidden;
    background: var(--blueprint);
    color: var(--chalk);
    font-family: 'Archivo', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .bg-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; width: 1500px; height: 1125px; }
  #board {
    position: relative; z-index: 1;
    width: 1444px; height: 1069px;
    display: grid;
    grid-template-columns: 836px 588px;
    grid-template-rows: 566px 250px 233px;
    gap: 10px;
  }
  .panel {
    position: relative; overflow: hidden;
    background: var(--plate);
    border: 1px solid var(--line);
  }
  .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 9px; font-variant-numeric: tabular-nums; }
  .display { font-family: 'Space Grotesk', system-ui, sans-serif; }

  /* 01 · field */
  .p-hero { background: var(--blueprint); }
  .p-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 38% 42%; }
  .p-hero__scrim {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(7,30,70,0.97) 0%, rgba(7,30,70,0.84) 28%, rgba(7,30,70,0.24) 66%, rgba(7,30,70,0) 100%);
  }
  .p-hero__grid { position: absolute; inset: 0; width: 100%; height: 100%; color: var(--chalk); opacity: .55; }
  .p-hero__in { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 22px 26px 24px; }
  .p-hero__top { display: flex; justify-content: space-between; opacity: .78; }
  .p-hero__lock { width: 170px; margin-bottom: 12px; }
  .p-hero__lock svg { width: 100%; height: auto; display: block; }
  .p-hero__title { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 52px; line-height: .96; letter-spacing: -.04em; font-weight: 600; max-width: 22ch; margin-bottom: 10px; }
  .p-hero__sub { font-size: 12.5px; line-height: 1.5; max-width: 46ch; opacity: .86; }
  .p-hero__facts { display: flex; gap: 20px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--line); opacity: .76; }

  /* 02 · mark */
  .p-mark { padding: 18px 22px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-mark__head { display: flex; justify-content: space-between; opacity: .7; }
  .p-mark__stage { display: flex; align-items: center; gap: 26px; }
  .p-mark__big { width: 146px; flex: 0 0 auto; line-height: 0; }
  .p-mark__big svg { width: 100%; height: auto; display: block; }
  .p-mark__geo { flex: 1; }
  .p-mark__geo > div { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px solid var(--line-soft); }
  .p-mark__geo dt { opacity: .7; }
  .p-mark__geo dd { font-variant-numeric: tabular-nums; }
  .p-mark__lockup svg { width: 100%; max-width: 260px; height: auto; display: block; }
  .p-mark__scale { display: flex; align-items: flex-end; gap: 18px; }
  .p-mark__scale figure { display: flex; flex-direction: column; align-items: center; gap: 5px; line-height: 0; }
  .p-mark__scale svg { display: block; height: auto; }
  .p-mark__scale figcaption { line-height: 1; opacity: .58; }
  .p-mark__foot { display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--line-soft); opacity: .7; }

  /* 03 · palette */
  .p-pal { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 9px; }
  .p-pal__head { display: flex; justify-content: space-between; opacity: .72; }
  .p-pal__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .swatch { display: flex; flex-direction: column; border: 1px solid var(--line-soft); }
  .swatch__color { flex: 1; border-bottom: 1px solid var(--line-soft); }
  .swatch__meta { padding: 4px 6px 5px; }
  .swatch__name { font-size: 8.5px; font-weight: 600; display: block; }
  .swatch__hex { font-size: 7.2px; opacity: .7; display: block; font-variant-numeric: tabular-nums; }

  /* 04 · type */
  .p-type { padding: 14px 20px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-type__head { display: flex; justify-content: space-between; opacity: .72; }
  .p-type__big { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 32px; font-weight: 600; letter-spacing: -.035em; line-height: 1; display: block; }
  .p-type__row { border-top: 1px solid var(--line-soft); padding-top: 6px; }
  .p-type__row .lbl { opacity: .65; display: block; margin-bottom: 3px; }

  /* 05 · cast */
  .p-cast { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 9px; }
  .p-cast__head { display: flex; justify-content: space-between; opacity: .72; }
  .p-cast__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .p-cast__cell { border: 1px solid var(--line-soft); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding: 8px 4px; }
  .p-cast__cell svg { width: 36px; height: 36px; display: block; }
  .p-cast__cell b { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 9px; font-weight: 600; }
  .p-cast__cell span { font-size: 6.8px; opacity: .55; }

  /* 06 · laws */
  .p-rules { padding: 14px 20px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-rules::before { content: ''; position: absolute; inset: 0; background-image: url('${fieldUri}'); background-size: 220% auto; background-position: 50% 44%; opacity: .12; }
  .p-rules > * { position: relative; z-index: 1; }
  .p-rules__head { display: flex; justify-content: space-between; opacity: .72; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .p-rules li { font-size: 9.6px; line-height: 1.36; padding-left: 12px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 3px; width: 5px; height: 5px; background: var(--chalk); }
  .p-rules li:nth-child(2)::before { background: var(--hivis); }
  .p-rules li b { font-weight: 600; }
  .p-rules__foot { display: flex; justify-content: space-between; opacity: .5; }
</style>
</head>
<body>
  <svg class="bg-grid" width="1500" height="1125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="so-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke="#F4F7FF" stroke-opacity="0.10" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="1500" height="1125" fill="url(#so-grid)" />
  </svg>

  <div id="board">

    <!-- 01 · the field -->
    <div class="panel p-hero">
      <img class="p-hero__img" src="${heroUri}" alt="" />
      <div class="p-hero__scrim"></div>
      <svg class="p-hero__grid" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#F4F7FF" stroke-opacity="0.12" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div class="p-hero__in">
        <div class="p-hero__top mono">
          <span>Brand kit · ${meta.version} · ${meta.name}</span>
          <span>Case ${meta.case} · blueprint grid</span>
        </div>
        <div>
          <div class="p-hero__lock">${lockupRev}</div>
          <h1 class="p-hero__title">The drawing becomes<br />a line on the ground.</h1>
          <p class="p-hero__sub">${meta.promise}</p>
          <div class="p-hero__facts mono">
            <span>24px grid</span><span>1px rules</span><span>0px radius</span><span>160ms linear</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 02 · the mark -->
    <div class="panel p-mark">
      <div class="p-mark__head mono">
        <span>Logo · two offset blocks</span>
        <span>Fill only · 0 stroke</span>
      </div>
      <div class="p-mark__stage">
        <div class="p-mark__big">${markSvg}</div>
        <dl class="p-mark__geo mono">
          <div><dt>Upper mass</dt><dd>22 × 26 · x 8</dd></div>
          <div><dt>Lower mass</dt><dd>22 × 28 · x 36</dd></div>
          <div><dt>Channel</dt><dd>6 units</dd></div>
          <div><dt>Bounds</dt><dd>8–58 × 10–56</dd></div>
          <div><dt>Grid</dt><dd>64 units</dd></div>
        </dl>
      </div>
      <div class="p-mark__lockup">${lockupRev}</div>
      <div class="p-mark__scale mono">
        <figure><div style="width:84px;">${markSvg}</div><figcaption>84</figcaption></figure>
        <figure><div style="width:44px;">${markSvg}</div><figcaption>44</figcaption></figure>
        <figure><div style="width:28px;">${markSvg}</div><figcaption>28</figcaption></figure>
        <figure><div style="width:16px;">${compactSvg}</div><figcaption>16 · compact</figcaption></figure>
        <figure><div style="width:14px;">${glyphSvg}</div><figcaption>14 · glyph</figcaption></figure>
      </div>
      <div class="p-mark__foot mono">
        <span>Never equal blocks · never a third mass</span>
        <span>Clear space 3u</span>
      </div>
    </div>

    <!-- 03 · palette -->
    <div class="panel p-pal">
      <div class="p-pal__head mono">
        <span>Palette · ${primitives.length} primitives</span>
        <span>${passes.length} pass · ${fails.length} published fails</span>
      </div>
      <div class="p-pal__grid">
        ${primitives
          .map(
            (p) =>
              `<div class="swatch"><div class="swatch__color" style="background:${p.value};"></div><div class="swatch__meta"><span class="swatch__name">${p.name}</span><span class="swatch__hex">${p.value}</span></div></div>`
          )
          .join('')}
      </div>
    </div>

    <!-- 04 · type -->
    <div class="panel p-type">
      <div class="p-type__head mono">
        <span>Type · 3 voices</span>
        <span>One scope</span>
      </div>
      <div>
        <span class="mono" style="display:block;opacity:.65;margin-bottom:4px;">Display · Space Grotesk 600</span>
        <span class="p-type__big">The drawing<br/>becomes a line.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl mono">Reading · Archivo 400</span>
        <span style="font-size:11.5px;line-height:1.45;display:block;">Set the datum, check the level, then mark the pin. The site is a drawing at 1:1.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl mono">Figures · IBM Plex Mono</span>
        <span class="mono" style="font-size:10px;">SO-24 · GRID 24 · RULE 1 · 0 RADIUS</span>
      </div>
    </div>

    <!-- 05 · cast -->
    <div class="panel p-cast">
      <div class="p-cast__head mono">
        <span>Cast · six nouns off the site</span>
        <span>64 grid · fill only</span>
      </div>
      <div class="p-cast__grid">
        ${castItems
          .map(
            (c) =>
              `<div class="p-cast__cell">${c.svg}<b>${c.id}</b><span>${CAST_NOTE[c.id] || ''}</span></div>`
          )
          .join('')}
      </div>
    </div>

    <!-- 06 · the law -->
    <div class="panel p-rules">
      <div class="p-rules__head mono">
        <span>Architectural laws</span>
        <span>${meta.name} · ${meta.version}</span>
      </div>
      <ul>
        <li><b>One 24px grid.</b> The ground is a drawing sheet; every section reads off the same 24px measure.</li>
        <li><b>One 1px rule.</b> ${fails[0].a} on ${fails[0].b} is ${fails[0].ratio}:1, so orange never carries type.</li>
        <li><b>Zero radius.</b> A blueprint has no soft corners, no lifted card and no shadow at rest.</li>
        <li><b>160ms linear.</b> The site checks a value; it does not perform an entrance animation.</li>
      </ul>
      <div class="p-rules__foot mono">
        <span>Case ${meta.case} · setting out</span>
        <span>Single scope · no second sheet</span>
      </div>
    </div>

  </div>
</body>
</html>`

fs.writeFileSync(htmlOut, html, 'utf8')

const { chromium } = await import('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1125 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await page.goto(pathToFileURL(path.resolve(htmlOut)).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.locator('body').screenshot({ path: outPath })
await browser.close()

try {
  const sharp = (await import('sharp')).default
  await sharp(outPath).webp({ quality: 88 }).toFile(webpPath)
  console.log(`Rendered 6-panel board → ${outPath}`)
  console.log(`Rendered webp → ${webpPath}`)
} catch (error) {
  console.warn(`sharp unavailable, webp not written: ${error.message}`)
  console.log(`Rendered 6-panel board → ${outPath}`)
}
