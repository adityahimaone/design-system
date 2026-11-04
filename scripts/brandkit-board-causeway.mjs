#!/usr/bin/env node
/**
 * brandkit-board-causeway.mjs — the 6-panel 1500×1125 (3000×2250 @2x) brand board.
 *
 * Cardboard & steel: kraft ground, galvanised plate, 1px cold rules, 0px radius,
 * no shadow, no blur, one green. Panels are separated by a 1px ink gutter, the
 * way a die-cut sheet is separated by its own cut lines.
 *
 *   node scripts/brandkit-board-causeway.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const slug = 'causeway'
const brandDir = path.join(ROOT, `public/brand/${slug}`)
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, `src/features/${slug}/tokens.json`), 'utf8'))
const outPath = path.join(brandDir, `${slug}-brandkit.png`)

const meta = tokens.meta
const primitives = tokens.primitives
const contrast = tokens.contrast
const passes = contrast.filter((c) => c.pass)
const fails = contrast.filter((c) => !c.pass)

const hex = (n) => primitives.find((p) => p.name === n)?.value || '#000'
const KRAFT = hex('kraft')
const CARTON = hex('carton')
const STEEL = hex('steel')
const INK = hex('ink')
const GREEN = hex('green')
const MOSS = hex('moss')
const CHALK = hex('chalk')

const read = (f) => (fs.existsSync(path.join(brandDir, f)) ? fs.readFileSync(path.join(brandDir, f), 'utf8') : '')
const markSvg = read('mark.svg')
const markRev = read('mark-reverse.svg')
const markGreen = read('mark-green.svg')
const compactSvg = read('mark-compact.svg')
const glyphSvg = read('glyph.svg')
const lockupRev = read('lockup-reverse.svg')
const lockup = read('lockup.svg')

const heroFile = path.join(brandDir, 'hero-bike-by-water.jpg')
const heroUri = `data:image/jpeg;base64,${fs.readFileSync(heroFile).toString('base64')}`

const castItems = fs
  .readdirSync(path.join(brandDir, 'cast'))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => ({ id: path.basename(f, '.svg'), svg: fs.readFileSync(path.join(brandDir, 'cast', f), 'utf8') }))

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px; height: 1125px;
    background: ${KRAFT};
    color: ${INK};
    font-family: 'Archivo', system-ui, sans-serif;
    padding: 28px;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  /* the kraft grain — 5.5%, the same value the page uses */
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 3; pointer-events: none;
    background-image: ${grain};
    background-size: 160px 160px;
    opacity: 0.055;
    mix-blend-mode: multiply;
  }
  #board {
    position: relative; z-index: 1;
    width: 1444px; height: 1069px;
    display: grid;
    grid-template-columns: 836px 588px;
    grid-template-rows: 576px 254px 237px;
    gap: 1px;
    background: ${INK};
    border: 1px solid ${INK};
  }
  .panel { overflow: hidden; position: relative; background: ${KRAFT}; }
  .mono { font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; }

  /* 01 · hero plate */
  .p-hero { color: ${CHALK}; display: flex; flex-direction: column; justify-content: space-between; padding: 26px 30px; text-align: right; }
  .p-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 40% 50%; }
  .p-hero__scrim {
    position: absolute; inset: 0;
    background: linear-gradient(270deg, rgba(23,24,26,0.96) 0%, rgba(23,24,26,0.93) 34%, rgba(23,24,26,0.62) 52%, rgba(23,24,26,0.12) 66%, rgba(23,24,26,0) 74%),
                linear-gradient(180deg, rgba(23,24,26,0.72) 0%, rgba(23,24,26,0) 30%);
  }
  .p-hero__top, .p-hero__bottom { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: flex-end; }
  .p-hero__top { display: flex; justify-content: space-between; opacity: 0.9; text-align: left; }
  .p-hero__top span:last-child { text-align: right; }
  .p-hero__title {
    font-size: 54px; line-height: 0.94; letter-spacing: -0.038em; font-weight: 700;
    max-width: 13ch; margin: 16px 0 12px; margin-left: auto;
  }
  .p-hero__sub { font-size: 13.5px; line-height: 1.5; max-width: 42ch; opacity: 0.9; }
  .p-hero__lock { width: 196px; margin-bottom: 6px; }
  .p-hero__lock svg { width: 100%; height: auto; display: block; }

  /* 02 · mark */
  .p-mark { background: ${CARTON}; color: ${INK}; padding: 26px 30px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-mark__stage { display: flex; flex-direction: column; gap: 26px; margin: auto 0; }
  .p-mark__lockup svg { width: 100%; height: auto; display: block; }
  .p-mark__scale { display: flex; align-items: flex-end; gap: 22px; }
  .p-mark__scale svg { width: 100%; height: auto; display: block; }

  /* 03 · palette */
  .p-pal { padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; }
  .p-pal__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: ${INK}; border: 1px solid ${INK}; }
  .swatch { background: ${CARTON}; }
  .swatch__color { height: 46px; }
  .swatch__meta { padding: 5px 6px 6px; }
  .swatch__name { font-size: 9px; font-weight: 700; display: block; letter-spacing: 0.02em; }
  .swatch__hex { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: ${MOSS}; display: block; margin-top: 1px; }

  /* 04 · type */
  .p-type { padding: 18px 24px; display: flex; flex-direction: column; justify-content: space-between; }
  .p-type__big { font-size: 40px; font-weight: 700; letter-spacing: -0.038em; line-height: 0.98; }

  /* 05 · cast */
  .p-cast { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 12px; }
  .p-cast__grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; background: ${INK}; border: 1px solid ${INK}; }
  .p-cast__cell { background: ${CARTON}; padding: 12px 6px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .p-cast__cell svg { width: 34px; height: 34px; display: block; }

  /* 06 · laws */
  .p-rules { background: ${INK}; color: ${CHALK}; padding: 18px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  .p-rules ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .p-rules li { font-size: 10.4px; line-height: 1.32; padding-left: 11px; position: relative; }
  .p-rules li::before { content: ''; position: absolute; left: 0; top: 3px; width: 5px; height: 5px; background: ${GREEN}; }
</style>
</head>
<body>
  <div id="board">

    <!-- 01 · the plate -->
    <div class="panel p-hero">
      <img class="p-hero__img" src="${heroUri}" alt="" />
      <div class="p-hero__scrim"></div>
      <div class="p-hero__top">
        <span class="mono">Brand kit · ${meta.version} · ${meta.name}</span>
        <span class="mono">Case ${meta.case} · commuter</span>
      </div>
      <div class="p-hero__bottom">
        <div class="p-hero__lock">${lockupRev}</div>
        <h1 class="p-hero__title">${meta.essence}</h1>
        <p class="p-hero__sub">One carton, one bike, one green. Kraft ground, galvanised plate, 1px rules, zero radius, and a mark that is a bar with an arch standing on it.</p>
      </div>
    </div>

    <!-- 02 · the mark -->
    <div class="panel p-mark">
      <div style="display:flex;justify-content:space-between;opacity:0.62;" class="mono">
        <span>Logo · bar + arch · 64 grid</span>
        <span>Fill only · 0 stroke</span>
      </div>
      <div class="p-mark__stage">
        <div class="p-mark__lockup">${lockup}</div>
        <div class="p-mark__scale">
          <div style="width:96px;">${markSvg}</div>
          <div style="width:48px;">${markSvg}</div>
          <div style="width:24px;">${markSvg}</div>
          <div style="width:16px;">${compactSvg}</div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(23,24,26,0.28);padding-top:14px;display:flex;justify-content:space-between;align-items:flex-end;" class="mono">
        <span>96 · 48 · 24 · 16 compact</span>
        <span>Separate 16px drawing</span>
      </div>
    </div>

    <!-- 03 · palette -->
    <div class="panel p-pal">
      <div style="display:flex;justify-content:space-between;" class="mono">
        <span>Palette · ${primitives.length} primitives</span>
        <span>${passes.length} pass · ${fails.length} published fails</span>
      </div>
      <div class="p-pal__grid">
        ${primitives
          .map(
            (p) =>
              `<div class="swatch"><div class="swatch__color" style="background:${p.value};box-shadow:inset 0 0 0 1px rgba(23,24,26,0.16);"></div><div class="swatch__meta"><span class="swatch__name">${p.name}</span><span class="swatch__hex">${p.value}</span></div></div>`
          )
          .join('')}
      </div>
    </div>

    <!-- 04 · type -->
    <div class="panel p-type">
      <div style="display:flex;justify-content:space-between;" class="mono">
        <span>Type · 2 families, 3 voices</span>
        <span>Archivo 400/700 · IBM Plex Mono</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <span class="mono" style="display:block;color:${MOSS};margin-bottom:4px;">Display · Archivo 700</span>
          <span class="p-type__big">The commute<br/>is the ride.</span>
        </div>
        <div style="border-top:1px solid rgba(23,24,26,0.24);padding-top:8px;">
          <span class="mono" style="display:block;color:${MOSS};margin-bottom:3px;">Reading · Archivo 400</span>
          <span style="font-size:13px;line-height:1.45;display:block;">A green steel frame, 32mm tyres, a rack that carries a week of groceries.</span>
        </div>
        <div style="border-top:1px solid rgba(23,24,26,0.24);padding-top:8px;">
          <span class="mono" style="display:block;color:${MOSS};margin-bottom:3px;">Mono · IBM Plex Mono</span>
          <span class="mono" style="font-size:11px;letter-spacing:0.06em;">CW-0021 · 54cm · 1 240,00</span>
        </div>
      </div>
    </div>

    <!-- 05 · cast -->
    <div class="panel p-cast">
      <div style="display:flex;justify-content:space-between;" class="mono">
        <span>Cast · six nouns off the floor</span>
        <span>64 grid · fill only</span>
      </div>
      <div class="p-cast__grid">
        ${castItems
          .map(
            (c) =>
              `<div class="p-cast__cell"><div style="line-height:0;">${c.svg}</div><span class="mono" style="font-size:7.5px;letter-spacing:0.08em;">${c.id}</span></div>`
          )
          .join('')}
      </div>
    </div>

    <!-- 06 · laws -->
    <div class="panel p-rules">
      <div style="display:flex;justify-content:space-between;opacity:0.6;" class="mono">
        <span>Architectural laws</span>
        <span>0px radius</span>
      </div>
      <ul>
        <li><b>Bar, then arch.</b> One 4-unit bar, one 9-unit arch standing on it. Never a second arch, never a stroke.</li>
        <li><b>Kraft and steel sit at the same value.</b> They read 1.03:1 apart, so every boundary carries a 1px rule.</li>
        <li><b>The green is a hue, not a highlight.</b> It reads 1.05:1 on kraft — fill and rule only, never type there.</li>
        <li><b>Two scopes, one depot.</b> Kraft by day, the depot at night; the frame green is the one colour that survives both.</li>
      </ul>
      <div style="display:flex;justify-content:space-between;opacity:0.5;" class="mono">
        <span>Case ${meta.case} · commuter bicycle</span>
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
await page.waitForTimeout(400)
await page.locator('body').screenshot({ path: outPath })
await browser.close()
console.log(`Rendered 6-panel board → ${outPath}`)
