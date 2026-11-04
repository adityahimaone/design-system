/**
 * Kanon · icons + share card
 * The tab icon is the header's mark exactly: the ink rosette on the paper
 * ground, same art, same 64 grid. It used to be a reversed lockup — paper
 * rosette on a solid ink square — which read as a different logo in a light
 * tab bar: a black chip where the page shows a drawn mark.
 * The share card is a printed sheet with the studio's line.
 *
 *   node scripts/build-kanon-icons.mjs
 */
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const PUB = path.join(ROOT, 'public')
const K = path.join(PUB, 'brand/kanon')

const INK = '#11140D'
const PAPER = '#F4F2E9'

const compactD = (await readFile(path.join(K, 'mark-compact.svg'), 'utf8')).match(
  /<path[^>]*\sd="([^"]+)"/,
)[1]
const markD = (await readFile(path.join(K, 'mark.svg'), 'utf8')).match(
  /<path[^>]*\sd="([^"]+)"/,
)[1]
const wordmark = await readFile(path.join(K, 'wordmark.svg'), 'utf8')
const wordPaths = [...wordmark.matchAll(/<path transform="([^"]+)" d="([^"]+)"/g)]
  .map((m) => `<path transform="${m[1]}" d="${m[2]}"/>`)
  .join('')

/* ── 01 · favicon.svg — the page in one tile: paper ground, ink mark ────── */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Kanon">
  <title>Kanon</title>
  <rect width="64" height="64" fill="${PAPER}"/>
  <g transform="translate(5 5) scale(0.844)">
    <path fill="${INK}" fill-rule="evenodd" d="${markD}"/>
  </g>
</svg>
`
await writeFile(path.join(PUB, 'favicon.svg'), favicon)

/* ── 02 · the share card ───────────────────────────────────────────────── */
const font = (f) => pathToFileURL(path.join(PUB, 'brand/serenica/fonts', f)).href

const og = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'IS';src:url('${font('InstrumentSerif-Regular.woff2')}') format('woff2');font-weight:400}
@font-face{font-family:'IS';src:url('${font('InstrumentSerif-Italic.woff2')}') format('woff2');font-style:italic}
@font-face{font-family:'IT';src:url('${font('InterTight-400.woff2')}') format('woff2');font-weight:400}
@font-face{font-family:'IT';src:url('${font('InterTight-500.woff2')}') format('woff2');font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:${PAPER};color:${INK};font-family:'IT',sans-serif;
     display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;position:relative}
.rule{position:absolute;inset:24px;border:1px solid rgba(17,20,13,.22);pointer-events:none}
.top{display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px}
.brand span{font-family:'IS',serif;font-size:34px;letter-spacing:-.01em}
.meta{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#3B4234}
h1{font-family:'IS',serif;font-weight:400;font-size:74px;line-height:1.02;letter-spacing:-.02em;max-width:19ch}
h1 em{font-style:italic}
p{font-size:19px;line-height:1.5;color:#3B4234;max-width:56ch;margin-top:20px}
.foot{display:flex;align-items:flex-end;justify-content:space-between;border-top:1px solid rgba(17,20,13,.22);padding-top:20px}
.nums{display:flex;gap:44px}
.num b{font-family:'IS',serif;font-size:34px;font-weight:400;display:block;line-height:1}
.num i{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#3B4234;font-style:normal;display:block;margin-top:7px}
</style></head><body>
<div class="rule"></div>
<div class="top">
  <div class="brand">
    <svg viewBox="0 0 64 64" width="40" height="40"><path fill="${INK}" fill-rule="evenodd" d="${markD}"/></svg>
    <span>Kanon</span>
  </div>
  <div class="meta">Design systems, written</div>
</div>
<div>
  <h1>Every brand is a <em>rule</em> before it is a look.</h1>
  <p>Six skills that write a brandkit and a design system — marks on one grid, tokens in three layers, and a contrast ledger that publishes its own failures.</p>
</div>
<div class="foot">
  <div class="nums">
    <div class="num"><b>23</b><i>Cases held</i></div>
    <div class="num"><b>06</b><i>Skills</i></div>
    <div class="num"><b>03</b><i>Published fails</i></div>
  </div>
  <div class="meta">kanon · case 23 closes the shelf</div>
</div>
</body></html>`

const browser = await chromium.launch()

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.setContent(og, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
await page.screenshot({ path: path.join(K, 'kanon-og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } })
await page.close()

/* ── 03 · raster icons from the favicon svg ────────────────────────────── */
const sizes = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['favicon-48.png', 48],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]

/* The brandkit's own rule: below 24px the eight-petal mark closes into a blob,
   so the compact mark — ring, four petals, centre dot — carries the small
   rasters. Same identity, fewer strokes than the pixel has room for. */
const tile = (size) =>
  size < 24
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${PAPER}"/><g transform="translate(8 8) scale(0.75)"><path fill="${INK}" fill-rule="evenodd" d="${compactD}"/></g></svg>`
    : favicon

for (const [name, size] of sizes) {
  const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await p.setContent(
    `<html><body style="margin:0"><img src="data:image/svg+xml;utf8,${encodeURIComponent(
      tile(size),
    )}" width="${size}" height="${size}" style="display:block"/></body></html>`,
  )
  await p.waitForTimeout(120)
  await p.screenshot({ path: path.join(PUB, name), omitBackground: true })
  await p.close()
}

/* maskable: same art, safe-zone padded */
{
  const size = 512
  const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await p.setContent(
    `<html><body style="margin:0;background:${PAPER}"><div style="width:${size}px;height:${size}px;display:grid;place-items:center">
      <img src="data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g transform="translate(5 5) scale(0.844)"><path fill="${INK}" fill-rule="evenodd" d="${markD}"/></g></svg>`,
      )}" width="${size * 0.62}" height="${size * 0.62}"/></div></body></html>`,
  )
  await p.waitForTimeout(120)
  await p.screenshot({ path: path.join(PUB, 'icon-maskable-512.png') })
  await p.close()
}

await browser.close()
console.log(JSON.stringify({ favicon: true, og: true, icons: sizes.map((s) => s[0]) }, null, 2))
