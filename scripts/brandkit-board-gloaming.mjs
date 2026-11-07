#!/usr/bin/env node
/**
 * brandkit-board-gloaming.mjs — 1500x1125 (3000x2250 @2x) six-panel brand board.
 *
 * Surface #19 Liquid glass. The board ground is ONE measured horizon gradient;
 * every reading panel is a solid oat plate with a 22px squircle, a 1px inset rim
 * and one lit top edge. The only blur is the hero pane. The only extra gradient
 * is the hero's directional zenith scrim.
 *
 *   node scripts/brandkit-board-gloaming.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const slug = 'gloaming'
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
const OAT = hex('oat'), INK = hex('ink'), ZENITH = hex('zenith')
const BLUEHOUR = hex('bluehour'), PERI = hex('periwinkle'), MAUVE = hex('mauve')
const APRICOT = hex('apricot'), HAY = hex('hay')

const read = (f) => (fs.existsSync(path.join(brandDir, f)) ? fs.readFileSync(path.join(brandDir, f), 'utf8') : '')
const markSvg = read('mark-reverse.svg')
const compactSvg = read('mark-compact-reverse.svg') || markSvg
const glyphSvg = read('glyph.svg').replaceAll(INK, OAT) || compactSvg
const lockupRev = read('lockup-reverse.svg')
const wordmark = read('wordmark.svg')
const uri = (f) => `data:image/jpeg;base64,${fs.readFileSync(path.join(brandDir, f)).toString('base64')}`
const heroUri = uri('blue-hour.jpg')
const nightUri = uri('plate-night.jpg')
const meadowUri = uri('plate-meadow-detail.jpg')

const castItems = fs
  .readdirSync(path.join(brandDir, 'cast'))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => ({ id: path.basename(f, '.svg'), svg: fs.readFileSync(path.join(brandDir, 'cast', f), 'utf8') }))
const CAST_NOTE = {
  herd: 'three masses on the line',
  horizon: 'the last light passing',
  lupine: 'a spire of four florets',
  oak: 'one canopy, one trunk',
  pane: 'one mullion, one lit edge',
  ridge: 'three angular crests',
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Gloock&family=Hanken+Grotesk:wght@300..700&family=Martian+Mono:wght@300..700&display=swap" rel="stylesheet" />
<style>
  :root {
    --oat: ${OAT}; --ink: ${INK}; --zenith: ${ZENITH}; --apricot: ${APRICOT};
    --line: rgba(27,32,48,.20); --line-soft: rgba(27,32,48,.11);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px; height: 1125px; padding: 28px; overflow: hidden;
    background: linear-gradient(180deg,
      ${ZENITH} 0%, ${BLUEHOUR} 24%, ${PERI} 47%, ${MAUVE} 61%, ${APRICOT} 78%, ${HAY} 100%);
    color: var(--ink);
    font-family: 'Hanken Grotesk', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
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
    background: var(--oat);
    border: 1px solid rgba(255,255,255,.55);
    border-radius: 22px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 0 0 1px var(--line-soft);
  }
  .mono { font-family: 'Martian Mono', ui-monospace, monospace; font-size: 9px; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
  .display { font-family: 'Gloock', Georgia, serif; }
  .head { display: flex; justify-content: space-between; opacity: .62; }

  /* 01 · the blue-hour plate under one pane */
  .p-hero { background: var(--zenith); }
  .p-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 56%; }
  .p-hero__scrim { position: absolute; inset: 0; background: linear-gradient(96deg, ${ZENITH}f2 0%, ${ZENITH}c7 26%, ${ZENITH}3d 66%, ${ZENITH}00 100%); }
  .p-hero__pane {
    position: absolute; left: 22px; top: 54px; width: 262px; height: 76px;
    background: rgba(255,255,255,.16);
    backdrop-filter: blur(26px) saturate(1.25); -webkit-backdrop-filter: blur(26px) saturate(1.25);
    border: 1px solid rgba(255,255,255,.42); border-radius: 18px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
    display: flex; align-items: center; padding: 0 18px;
  }
  .p-hero__pane span { color: var(--oat); font-size: 10px; line-height: 1.5; opacity: .92; }
  .p-hero__mullion { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,.18); }
  .p-hero__in { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 22px 26px 24px; color: var(--oat); }
  .p-hero__top { display: flex; justify-content: space-between; opacity: .82; }
  .p-hero__lock { width: 210px; margin-bottom: 14px; }
  .p-hero__lock svg { width: 100%; height: auto; display: block; }
  .p-hero__title { font-family: 'Gloock', Georgia, serif; font-size: 53px; line-height: .99; letter-spacing: -.035em; max-width: 20ch; margin-bottom: 10px; }
  .p-hero__sub { font-size: 12.5px; line-height: 1.5; max-width: 44ch; opacity: .90; }
  .p-hero__facts { display: flex; gap: 18px; margin-top: 16px; padding-top: 11px; border-top: 1px solid rgba(246,240,229,.32); opacity: .84; }

  /* 02 · the mark */
  .p-mark { padding: 18px 22px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-mark__stage { display: flex; align-items: center; gap: 24px; }
  .p-mark__big { width: 146px; flex: 0 0 auto; line-height: 0; background: ${ZENITH}; border-radius: 18px; padding: 12px; }
  .p-mark__big svg { width: 100%; height: auto; display: block; }
  .p-mark__geo { flex: 1; }
  .p-mark__geo > div { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px solid var(--line-soft); }
  .p-mark__geo dt { opacity: .66; }
  .p-mark__geo dd { font-variant-numeric: tabular-nums; }
  .p-mark__wm { border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft); padding: 6px 0; }
  .p-mark__wm svg { width: 100%; max-width: 420px; height: auto; display: block; }
  .p-mark__scale { display: flex; align-items: flex-end; gap: 20px; background: ${ZENITH}; border-radius: 12px; padding: 10px 16px; color: var(--oat); }
  .p-mark__scale figure { display: flex; flex-direction: column; align-items: center; gap: 6px; line-height: 0; }
  .p-mark__scale svg { display: block; height: auto; }
  .p-mark__scale figcaption { line-height: 1; opacity: .66; }
  .p-mark__foot { display: flex; justify-content: space-between; opacity: .66; }

  /* 03 · palette */
  .p-pal { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 9px; }
  .p-pal__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .swatch { display: flex; flex-direction: column; border: 1px solid var(--line-soft); border-radius: 6px; overflow: hidden; }
  .swatch__color { flex: 1; min-height: 54px; }
  .swatch__meta { padding: 4px 6px 5px; }
  .swatch__name { font-size: 8.5px; font-weight: 600; display: block; }
  .swatch__hex { font-size: 7.2px; opacity: .7; display: block; font-variant-numeric: tabular-nums; }

  /* 04 · type */
  .p-type { padding: 14px 20px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-type__big { font-family: 'Gloock', Georgia, serif; font-size: 34px; letter-spacing: -.03em; line-height: 1.02; display: block; }
  .p-type__row { border-top: 1px solid var(--line-soft); padding-top: 6px; }
  .p-type__row .lbl { opacity: .65; display: block; margin-bottom: 3px; }
  .p-type__ramp { position: absolute; right: 14px; top: 40px; bottom: 14px; width: 62px; border-radius: 8px; overflow: hidden; border: 1px solid var(--line-soft); }
  .p-type__ramp svg { width: 100%; height: 100%; display: block; }

  /* 05 · cast */
  .p-cast { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 9px; }
  .p-cast__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .p-cast__cell { background: ${ZENITH}; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding: 8px 4px; color: var(--oat); }
  .p-cast__cell svg { width: 36px; height: 36px; display: block; }
  .p-cast__cell b { font-family: 'Gloock', Georgia, serif; font-size: 10px; font-weight: 400; }
  .p-cast__cell span { font-size: 6.8px; opacity: .6; }

  /* 06 · laws */
  .p-rules { padding: 14px 20px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-rules > * { position: relative; z-index: 1; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 6px; padding-right: 120px; }
  .p-rules li { font-size: 9.6px; line-height: 1.36; padding-left: 12px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 3px; width: 5px; height: 5px; background: var(--ink); border-radius: 1px; }
  .p-rules li:nth-child(2)::before { background: ${APRICOT}; }
  .p-rules li b { font-weight: 700; }
  .p-rules__meadow { position: absolute; right: 0; top: 44px; bottom: 38px; width: 108px; overflow: hidden; border-left: 1px solid var(--line-soft); border-radius: 8px 0 0 8px; }
  .p-rules__meadow img { width: 100%; height: 100%; object-fit: cover; object-position: 42% 50%; opacity: .8; }
  .p-rules__foot { display: flex; justify-content: space-between; opacity: .55; }
</style>
</head>
<body>
  <div id="board">

    <!-- 01 · the blue-hour plate -->
    <div class="panel p-hero">
      <img class="p-hero__img" src="${heroUri}" alt="" />
      <div class="p-hero__scrim"></div>
      <div class="p-hero__mullion"></div>
      <div class="p-hero__pane"><span class="mono">26px REFRACTING PANE<br />1px MULLION · 1 LIT EDGE<br />READING COPY ON SOLID PLATES</span></div>
      <div class="p-hero__in">
        <div class="p-hero__top mono">
          <span>Brand kit · ${meta.version} · ${meta.name}</span>
          <span>Case ${meta.case} · #19 liquid glass</span>
        </div>
        <div>
          <div class="p-hero__lock">${lockupRev}</div>
          <h1 class="p-hero__title">The last light is<br />a reading, not a mood.</h1>
          <p class="p-hero__sub">${meta.promise}</p>
          <div class="p-hero__facts mono">
            <span>11 measured strips</span><span>1,760 sampled dots</span><span>22px pane</span><span>Day + night</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 02 · the mark -->
    <div class="panel p-mark">
      <div class="p-mark__head head mono">
        <span>Logo · horizon bar + two refracted hill panes</span>
        <span>Fill only · 0 stroke</span>
      </div>
      <div class="p-mark__stage">
        <div class="p-mark__big">${markSvg}</div>
        <dl class="p-mark__geo mono">
          <div><dt>Horizon bar</dt><dd>52 × 4 · y 46</dd></div>
          <div><dt>Left crest</dt><dd>y 26 · x 8–29</dd></div>
          <div><dt>Right crest</dt><dd>y 22 · x 33–56</dd></div>
          <div><dt>Mullion</dt><dd>4u · x 29–33</dd></div>
          <div><dt>Refraction</dt><dd>4u vertical step</dd></div>
        </dl>
      </div>
      <div class="p-mark__wm">${wordmark}</div>
      <div class="p-mark__scale mono">
        <figure><div style="width:64px;">${markSvg}</div><figcaption>64</figcaption></figure>
        <figure><div style="width:40px;">${markSvg}</div><figcaption>40</figcaption></figure>
        <figure><div style="width:24px;">${markSvg}</div><figcaption>24</figcaption></figure>
        <figure><div style="width:16px;">${compactSvg}</div><figcaption>16 compact</figcaption></figure>
        <figure><div style="width:14px;">${glyphSvg}</div><figcaption>14 glyph</figcaption></figure>
      </div>
      <div class="p-mark__foot mono">
        <span>Wordmark: 7u horizon channel · 2u refraction shift</span>
        <span>Clear space 4u</span>
      </div>
    </div>

    <!-- 03 · palette -->
    <div class="panel p-pal">
      <div class="p-pal__head head mono">
        <span>Palette · ${primitives.length} sampled primitives</span>
        <span>${passes.length} pass · ${fails.length} published fails · min ΔE_OK ${meta.cvd.minDeltaOk.toFixed(3)}</span>
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
      <div class="p-type__head head mono">
        <span>Type · 3 voices</span>
        <span>Dual scope · shared primitives</span>
      </div>
      <div>
        <span class="mono" style="display:block;opacity:.65;margin-bottom:4px;">Display · Gloock</span>
        <span class="p-type__big">One pane,<br />one horizon.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl mono">Reading · Hanken Grotesk 400 / 64ch</span>
        <span style="font-size:11.5px;line-height:1.45;display:block;max-width:38ch;">The pane refracts the last light. The oat plate holds the ridge, the oak, the lupine and the herd.</span>
      </div>
      <div class="p-type__row">
        <span class="lbl mono">Figures · Martian Mono</span>
        <span class="mono" style="font-size:10px;">GL-25 · R22 / R18 · S8 · PANE 26 · MULLION 1</span>
      </div>
      <div class="p-type__ramp">${read('horizon-ramp.svg')}</div>
    </div>

    <!-- 05 · cast -->
    <div class="panel p-cast">
      <div class="p-cast__head head mono">
        <span>Cast · six nouns off the meadow</span>
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
      <div class="p-rules__head head mono">
        <span>Architectural laws</span>
        <span>${meta.name} · ${meta.version} · plate-source.json</span>
      </div>
      <ul>
        <li><b>One measured ground.</b> Eleven strips off one painting become one gradient; nothing is stacked on it.</li>
        <li><b>Glass never carries type.</b> ${fails[2].a} on ${fails[2].b} is ${fails[2].ratio}:1, so a 1px mullion and a solid oat plate do the reading.</li>
        <li><b>One accent, on the action.</b> Oat on apricot is ${fails[0].ratio}:1; the button uses ink on apricot at ${contrast.find((c) => c.a === 'ink' && c.b === 'apricot').ratio}:1.</li>
        <li><b>The plate never changes.</b> Night removes the warm band, not the paper. Primitives never flip.</li>
      </ul>
      <div class="p-rules__foot mono">
        <span>Case ${meta.case} · blue-hour rangeland</span>
        <span>Day + night · ${fails.length} published failures</span>
      </div>
      <div class="p-rules__meadow"><img src="${meadowUri}" alt="" /></div>
    </div>

  </div>
</body>
</html>`

fs.writeFileSync(htmlOut, html, 'utf8')

const { chromium } = await import('playwright')
// No bundled browser is installed in this workspace; use the system Chrome.
let browser
try {
  browser = await chromium.launch({ channel: 'chrome' })
} catch {
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
}
const page = await browser.newPage({ viewport: { width: 1500, height: 1125 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await page.goto(pathToFileURL(path.resolve(htmlOut)).href, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 4000))]))
await page.waitForTimeout(400)
await page.locator('body').screenshot({ path: outPath })
await browser.close()

try {
  const sharp = (await import('sharp')).default
  await sharp(outPath).webp({ quality: 88 }).toFile(webpPath)
  console.log(`Rendered 6-panel board -> ${outPath}`)
  console.log(`Rendered webp          -> ${webpPath}`)
} catch (error) {
  console.warn(`sharp unavailable, webp not written: ${error.message}`)
  console.log(`Rendered 6-panel board -> ${outPath}`)
}
