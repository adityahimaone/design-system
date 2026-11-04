#!/usr/bin/env node
/**
 * brandkit-board-mullion.mjs — the 6-panel 1500×1125 (3000×2250 @2x) brand board.
 *
 * Glass & light. The board is not a set of cards on a flat colour: the ground is
 * a photograph of the city, and five of the six panels are real translucent panes
 * with backdrop blur floating 10px above it, so the gaps between panels show the
 * city through the same material the brand is built from. Panel 01 is the field
 * itself; panel 06 is the night pane.
 *
 *   node scripts/brandkit-board-mullion.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const slug = 'mullion'
const brandDir = path.join(ROOT, `public/brand/${slug}`)
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, `src/features/${slug}/tokens.json`), 'utf8'))
const outPath = path.join(brandDir, `${slug}-brandkit.png`)

const meta = tokens.meta
const primitives = tokens.primitives
const contrast = tokens.contrast
const passes = contrast.filter((c) => c.pass)
const fails = contrast.filter((c) => !c.pass)

const hex = (n) => primitives.find((p) => p.name === n)?.value || '#000'
const SKY = hex('sky')
const HAZE = hex('haze')
const VEIL = hex('veil')
const MIST = hex('mist')
const STEEL = hex('steel')
const SLATE = hex('slate')
const INK = hex('ink')
const BUS = hex('bus')
const GLOW = hex('glow')
const DEEP = hex('deep')

const read = (f) => (fs.existsSync(path.join(brandDir, f)) ? fs.readFileSync(path.join(brandDir, f), 'utf8') : '')
const markSvg = read('mark.svg')
const compactSvg = read('mark-compact.svg')
const glyphSvg = read('glyph.svg')
const lockup = read('lockup.svg')
const lockupRev = read('lockup-reverse.svg')

const uri = (f) => `data:image/jpeg;base64,${fs.readFileSync(path.join(brandDir, f)).toString('base64')}`
const heroUri = uri('towers-up.jpg')
const fieldUri = uri('city-expanse.jpg')

const castItems = fs
  .readdirSync(path.join(brandDir, 'cast'))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => ({ id: path.basename(f, '.svg'), svg: fs.readFileSync(path.join(brandDir, 'cast', f), 'utf8') }))

const CAST_NOTE = {
  bay: 'three mullions',
  facade: 'nine panes',
  floor: 'slabs + storey',
  lift: 'shaft + car',
  lobby: 'mass + door',
  skyline: 'stepped profile',
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300..700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400..600&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px; height: 1125px;
    padding: 28px;
    overflow: hidden;
    background: ${SKY};
    color: ${INK};
    font-family: 'Schibsted Grotesk', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  /* the field the panes are set into — a real photograph, lifted only enough
     that ink still reads through 16% white and 26px of blur */
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0;
    background-image: url('${fieldUri}');
    background-size: 228% auto; background-position: 46% 70%;
    filter: saturate(0.88) contrast(1.04);
  }
  body::after {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(70% 54% at 72% -8%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 66%),
      linear-gradient(180deg, ${SKY}8a 0%, ${SKY}26 30%, ${SKY}59 70%, ${SKY}8f 100%);
  }
  .mono { font-family: 'Geist Mono', monospace; font-size: 9px; letter-spacing: 0.13em; text-transform: uppercase; }
  .display { font-family: 'Sora', system-ui, sans-serif; }

  #board {
    position: relative; z-index: 1;
    width: 1444px; height: 1069px;
    display: grid;
    grid-template-columns: 842px 592px;
    grid-template-rows: 566px 250px 233px;
    gap: 10px;
  }
  /* every panel is the same pane: 16% white, 26px blur, 1px ink rim, 22px */
  .panel {
    position: relative; overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(122deg, ${VEIL}2e 0%, ${VEIL}0a 46%), ${VEIL}29;
    -webkit-backdrop-filter: blur(26px) saturate(1.8);
    backdrop-filter: blur(26px) saturate(1.8);
    box-shadow: inset 0 1px 0 0 ${VEIL}9e, inset 0 0 0 1px ${INK}17,
                0 26px 60px -34px ${INK}66;
  }

  /* 01 · the field — no pane on it at all */
  .p-hero { border-radius: 22px; padding: 0; }
  .p-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
  .p-hero__scrim {
    position: absolute; inset: 0;
    background:
      linear-gradient(0deg, rgba(8,16,26,0.95) 0%, rgba(8,16,26,0.86) 26%, rgba(8,16,26,0.34) 56%, rgba(8,16,26,0.06) 76%),
      linear-gradient(180deg, rgba(8,16,26,0.52) 0%, rgba(8,16,26,0) 24%),
      linear-gradient(90deg, rgba(8,16,26,0.62) 0%, rgba(8,16,26,0.08) 46%, rgba(8,16,26,0) 70%);
  }
  .p-hero__in {
    position: relative; z-index: 2; height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 24px 28px 26px; color: ${HAZE};
  }
  .p-hero__top { display: flex; justify-content: space-between; opacity: 0.86; }
  .p-hero__lock { width: 168px; margin-bottom: 14px; }
  .p-hero__lock svg { width: 100%; height: auto; display: block; }
  .p-hero__title {
    font-size: 52px; line-height: 0.94; letter-spacing: -0.045em; font-weight: 600;
    max-width: 12ch; margin-bottom: 12px;
  }
  .p-hero__sub { font-size: 13px; line-height: 1.52; max-width: 44ch; opacity: 0.88; }
  .p-hero__facts {
    display: flex; gap: 22px; margin-top: 16px; padding-top: 12px;
    border-top: 1px solid ${HAZE}2e; font-family: 'Geist Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.72;
  }

  /* 02 · the mark */
  .p-mark { padding: 22px 26px 18px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-mark__stage { display: flex; align-items: center; gap: 30px; }
  .p-mark__big { width: 156px; flex: 0 0 auto; line-height: 0; }
  .p-mark__big svg { width: 100%; height: auto; display: block; }
  .p-mark__geo { display: flex; flex-direction: column; gap: 0; flex: 1; }
  .p-mark__geo > div {
    display: flex; justify-content: space-between; align-items: baseline; gap: 10px;
    padding: 5px 0; box-shadow: 0 1px 0 ${INK}17;
  }
  .p-mark__geo dt { font-family: 'Geist Mono', monospace; font-size: 8px; letter-spacing: 0.13em; text-transform: uppercase; opacity: 0.72; }
  .p-mark__geo dd { font-family: 'Geist Mono', monospace; font-size: 9.5px; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; }
  .p-mark__lockup svg { width: 100%; max-width: 286px; height: auto; display: block; }
  .p-mark__scale { display: flex; align-items: flex-end; gap: 20px; }
  .p-mark__scale > figure { display: flex; flex-direction: column; align-items: center; gap: 7px; line-height: 0; }
  .p-mark__scale svg { display: block; height: auto; }
  .p-mark__scale figcaption {
    font-family: 'Geist Mono', monospace; font-size: 7.2px; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: 0.55; line-height: 1;
  }
  .p-mark__foot { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 12px; border-top: 1px solid ${INK}1f; opacity: 0.72; }

  /* 03 · palette */
  .p-pal { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 10px; }
  .p-pal__head { display: flex; justify-content: space-between; opacity: 0.72; }
  .p-pal__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .swatch { display: flex; flex-direction: column; border-radius: 9px; overflow: hidden; background: ${VEIL}40; box-shadow: inset 0 0 0 1px ${INK}1a; }
  .swatch__color { flex: 1; box-shadow: inset 0 0 0 1px ${INK}2b, inset 0 -1px 0 ${INK}1a; }
  .swatch__meta { padding: 4px 6px 5px; background: ${VEIL}8c; }
  .swatch__name { font-family: 'Sora', sans-serif; font-size: 8.5px; font-weight: 500; display: block; letter-spacing: -0.01em; }
  .swatch__hex { font-family: 'Geist Mono', monospace; font-size: 7.2px; color: ${SLATE}; display: block; letter-spacing: 0.02em; }

  /* 04 · type */
  .p-type { padding: 16px 22px 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-type__head { display: flex; justify-content: space-between; opacity: 0.72; }
  .p-type__big { font-family: 'Sora', sans-serif; font-size: 33px; font-weight: 500; letter-spacing: -0.04em; line-height: 0.98; display: block; }
  .p-type__row { border-top: 1px solid ${INK}1c; padding-top: 7px; }
  .p-type__row .lbl { font-family: 'Geist Mono', monospace; font-size: 7.6px; letter-spacing: 0.13em; text-transform: uppercase; color: ${BUS}; display: block; margin-bottom: 3px; }

  /* 05 · cast */
  .p-cast { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 10px; }
  .p-cast__head { display: flex; justify-content: space-between; opacity: 0.72; }
  .p-cast__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .p-cast__cell {
    background: ${VEIL}40; border-radius: 10px; box-shadow: inset 0 0 0 1px ${INK}12;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 8px 4px;
  }
  .p-cast__cell svg { width: 38px; height: 38px; display: block; }
  .p-cast__cell b { font-family: 'Sora', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: -0.008em; }
  .p-cast__cell span { font-family: 'Geist Mono', monospace; font-size: 6.8px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.55; }

  /* 06 · the law — the night pane */
  .p-rules {
    background: linear-gradient(122deg, ${VEIL}14 0%, ${VEIL}00 46%), ${DEEP}eb;
    box-shadow: inset 0 1px 0 0 ${VEIL}3d, inset 0 0 0 1px ${VEIL}26;
    color: ${HAZE}; padding: 16px 20px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;
  }
  .p-rules__head { display: flex; justify-content: space-between; opacity: 0.72; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .p-rules li { font-size: 9.6px; line-height: 1.36; padding-left: 12px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 3px; width: 5px; height: 5px; border-radius: 1px; background: ${GLOW}; }
  .p-rules li b { font-weight: 600; }
  .p-rules__foot { display: flex; justify-content: space-between; opacity: 0.5; }
</style>
</head>
<body>
  <div id="board">

    <!-- 01 · the field -->
    <div class="panel p-hero">
      <img class="p-hero__img" src="${heroUri}" alt="" />
      <div class="p-hero__scrim"></div>
      <div class="p-hero__in">
        <div class="p-hero__top">
          <span class="mono">Brand kit · ${meta.version} · ${meta.name}</span>
          <span class="mono">Case ${meta.case} · glass towers</span>
        </div>
        <div>
          <div class="p-hero__lock">${lockupRev}</div>
          <h1 class="p-hero__title">${meta.essence}</h1>
          <p class="p-hero__sub">Whole floors in glass towers, handed over fitted. A hazy sky ground, panes at 16% white with a real 26px blur, 1px rims and 1px mullions, and one red sampled off the bus.</p>
          <div class="p-hero__facts">
            <span>Sky ${SKY}</span><span>Pane 16%</span><span>Blur 26</span><span>Rim 1px</span><span>Radius 22</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 02 · the mark -->
    <div class="panel p-mark">
      <div style="display:flex;justify-content:space-between;opacity:0.72;" class="mono">
        <span>Logo · two masses, one street</span>
        <span>Fill only · 0 stroke</span>
      </div>
      <div class="p-mark__stage">
        <div class="p-mark__big">${markSvg}</div>
        <dl class="p-mark__geo">
          <div><dt>Shaft</dt><dd>22 × 50 · x 9</dd></div>
          <div><dt>Mass</dt><dd>16 × 34 · x 39</dd></div>
          <div><dt>Street</dt><dd>8 units</dd></div>
          <div><dt>Baseline</dt><dd>y 56</dd></div>
          <div><dt>Bounds</dt><dd>9–55 × 6–56</dd></div>
        </dl>
      </div>
      <div class="p-mark__lockup">${lockup}</div>
      <div class="p-mark__scale">
        <figure><div style="width:88px;">${markSvg}</div><figcaption>88</figcaption></figure>
        <figure><div style="width:44px;">${markSvg}</div><figcaption>44</figcaption></figure>
        <figure><div style="width:22px;">${markSvg}</div><figcaption>22</figcaption></figure>
        <figure><div style="width:16px;">${compactSvg}</div><figcaption>16 · compact</figcaption></figure>
        <figure><div style="width:14px;">${glyphSvg}</div><figcaption>14 · glyph</figcaption></figure>
      </div>
      <div class="p-mark__foot mono">
        <span>Fill only · no stroke · never equal heights</span>
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
        <span>Sora · Schibsted · Geist</span>
      </div>
      <div>
        <span class="mono" style="display:block;color:${BUS};margin-bottom:4px;">Display · Sora 500</span>
        <span class="p-type__big">The city,<br/>one floor up.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl">Reading · Schibsted Grotesk 400</span>
        <span style="font-size:11.5px;line-height:1.45;display:block;">1,240 m², twelve bays, handed over fitted in week one.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl">Figures · Geist Mono</span>
        <span style="font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.06em;">ML-22 · FL 08 · 1 240 M² · 12 BAYS</span>
      </div>
    </div>

    <!-- 05 · cast -->
    <div class="panel p-cast">
      <div class="p-cast__head mono">
        <span>Cast · six nouns off the building</span>
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
        <span>Law 01 · glass</span>
        <span>Night pane</span>
      </div>
      <ul>
        <li><b>Glass has no contrast of its own.</b> Veil on sky is 1.31:1, so the rim separates a pane — never the fill.</li>
        <li><b>A pane is an edge, not a shape.</b> Every division inside it is a 1px mullion, never a gap.</li>
        <li><b>Two masses, one street.</b> Never equal heights, never a third tower, never a stroke.</li>
        <li><b>One red, off the bus.</b> #B01B26 fills and marks; at night the signal is the glow, because 2.76:1 cannot carry type.</li>
      </ul>
      <div class="p-rules__foot mono">
        <span>Case ${meta.case} · glass towers</span>
        <span>${meta.name} · ${meta.version}</span>
      </div>
    </div>

  </div>
</body>
</html>`

const htmlOut = path.join(brandDir, 'brandkit.html')
fs.writeFileSync(htmlOut, html, 'utf8')

const { chromium } = await import('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1125 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await page.goto(pathToFileURL(path.resolve(htmlOut)).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.locator('body').screenshot({ path: outPath })
await browser.close()
console.log(`Rendered 6-panel board → ${outPath}`)
