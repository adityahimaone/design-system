#!/usr/bin/env node
/**
 * Halation mark family — one geometry, twelve files.
 *
 *   node brand/halation/mark.mjs
 *
 * Why this file exists: `brand-forge.mjs` generates a family from a built-in concept, and none of
 * the 22 read as reeded glass. The mark is the identity's whole argument — a ribbed pane with one
 * reed of light that overshoots its edge — so it is drawn here from stated grid units and every
 * other asset is derived from it. Regenerate; never hand-edit the SVGs.
 *
 * Grid (64 × 64):
 *   pane      x 8 → 44, y 10 → 54         (36 × 44)
 *   rib       4 wide, 8 pitch, 4 ribs at x 12 / 20 / 28 / 36, y 16 → 48
 *   gap       6 between pane edge and spill
 *   spill     5 × 64 at x 50, y 0 → 64    (runs to the canvas edge, 10 past the pane)
 *
 * The compact is a different drawing, not a scaled copy: ribs dropped, spill thickened 5 → 8.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..')
const out = join(root, 'public', 'brand', 'halation')
const tokens = JSON.parse(readFileSync(join(root, 'src', 'features', 'halation', 'tokens.json'), 'utf8'))
const C = Object.fromEntries(tokens.primitives.map((p) => [p.name, p.value]))

const INK = C.ink
const CORAL = C.coral
const CHALK = C.chalk
const CORAL_LIGHT = C['coral-light']

const rect = (x, y, w, h) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`

/* pane + four ribs as one evenodd path: the ribs are holes, so the mark reads on any ground */
const PANE_RIBS = [
  rect(8, 10, 36, 44),
  rect(12, 16, 4, 32),
  rect(20, 16, 4, 32),
  rect(28, 16, 4, 32),
  rect(36, 16, 4, 32),
].join('')

const SPILL = rect(50, 0, 5, 64)

const svg = (w, h, body, label = 'Halation') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${body}</svg>\n`

/* ── the marks ─────────────────────────────────────────────────────────────── */

const mark = (ink, accent) =>
  `<path d="${PANE_RIBS}" fill="${ink}" fill-rule="evenodd"/><path d="${SPILL}" fill="${accent}"/>`

const compact = (ink, accent) =>
  `<path d="${rect(10, 10, 32, 44)}" fill="${ink}"/><path d="${rect(48, 0, 8, 64)}" fill="${accent}"/>`

writeFileSync(join(out, 'mark.svg'), svg(64, 64, mark(INK, CORAL)))
writeFileSync(join(out, 'mark-reverse.svg'), svg(64, 64, mark(CHALK, CORAL_LIGHT)))
writeFileSync(join(out, 'mark-mono.svg'), svg(64, 64, mark(INK, INK)))
writeFileSync(join(out, 'mark-compact.svg'), svg(64, 64, compact(INK, CORAL)))
writeFileSync(join(out, 'mark-compact-reverse.svg'), svg(64, 64, compact(CHALK, CORAL_LIGHT)))
writeFileSync(
  join(out, 'glyph.svg'),
  svg(64, 64, `<path d="${rect(6, 8, 34, 48)}" fill="${INK}"/><path d="${rect(46, 0, 5, 64)}" fill="${CORAL}"/>`),
)
writeFileSync(
  join(out, 'icon.svg'),
  svg(
    64,
    64,
    `<rect width="64" height="64" fill="${CORAL}"/><path d="${PANE_RIBS}" fill="${INK}" fill-rule="evenodd"/><path d="${rect(50, 0, 5, 64)}" fill="${CHALK}"/>`,
  ),
)

/* ── the wordmark, outlined from Syne 600 ──────────────────────────────────── */
/* Baseline sits at 724.46 and cap top at 74.46 in the wordmark's own 750.72 box;
   Syne's cap height is 650/1000, so the lockup scale is cap/650. */

const wm = readFileSync(join(out, 'wordmark.svg'), 'utf8')
const paths = wm.match(/<path[^>]*\/>/g) ?? []
const WM_W = 4162.09
const WM_H = 750.72
const BASELINE = 724.46

const CAP = 30
const s = CAP / 650
const wmW = WM_W * s
const wmH = WM_H * s
const baseY = 47 // cap 32 → 47, so the cap centre sits on the mark's centre line
const wmX = 63 // mark ink 0 → 47, then a 16 gap

const wmGroup = (x, y, fill) =>
  `<g transform="translate(${x} ${y}) scale(${s.toFixed(6)})" fill="${fill}">${paths.join('')}</g>`

/* wordmark alone, ink baked in — an <img> resolves currentColor to black */
writeFileSync(
  join(out, 'wordmark.svg'),
  svg(WM_W, WM_H, `<g fill="${INK}">${paths.join('')}</g>`),
)
writeFileSync(
  join(out, 'wordmark-reverse.svg'),
  svg(WM_W, WM_H, `<g fill="${CHALK}">${paths.join('')}</g>`),
)

/* ── lockups ───────────────────────────────────────────────────────────────── */

const lockupW = wmX + wmW
writeFileSync(
  join(out, 'lockup.svg'),
  svg(lockupW, 64, `<g transform="translate(-8 0)">${mark(INK, CORAL)}</g>${wmGroup(wmX, baseY - BASELINE * s, INK)}`),
)
writeFileSync(
  join(out, 'lockup-reverse.svg'),
  svg(
    lockupW,
    64,
    `<g transform="translate(-8 0)">${mark(CHALK, CORAL_LIGHT)}</g>${wmGroup(wmX, baseY - BASELINE * s, CHALK)}`,
  ),
)

const stackW = Math.max(wmW, 47)
const stackMarkX = (stackW - 47) / 2 - 8
const stackWmX = (stackW - wmW) / 2
const stackH = 64 + 16 + wmH
const stackBase = 80 + BASELINE * s

writeFileSync(
  join(out, 'lockup-stacked.svg'),
  svg(
    stackW,
    stackH,
    `<g transform="translate(${stackMarkX.toFixed(2)} 0)">${mark(INK, CORAL)}</g>${wmGroup(stackWmX, stackBase - BASELINE * s, INK)}`,
  ),
)
writeFileSync(
  join(out, 'lockup-stacked-reverse.svg'),
  svg(
    stackW,
    stackH,
    `<g transform="translate(${stackMarkX.toFixed(2)} 0)">${mark(CHALK, CORAL_LIGHT)}</g>${wmGroup(stackWmX, stackBase - BASELINE * s, CHALK)}`,
  ),
)

console.log(`mark family · 11 files → ${out}`)
console.log(`  lockup ${lockupW.toFixed(1)} × 64 · stacked ${stackW.toFixed(1)} × ${stackH.toFixed(1)} · cap ${CAP}`)
