#!/usr/bin/env node
/**
 * Halation field — the reeded prismatic pane, in vectors.
 *
 *   node brand/halation/field.mjs
 *
 * The photographic field ships as `field-coral.jpg` / `field-ember.jpg`; this is the token-locked
 * twin, so the material survives print, OG images and scripts-off. Every colour is read from
 * tokens.json — nothing is hard-coded here.
 *
 * Geometry: 9-unit rib pitch, rib width varying 3–7 by a deterministic wave, so the field reads as
 * reeded glass rather than a bar chart. The bright line at each pitch boundary is the specular.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..')
const out = join(root, 'public', 'brand', 'halation')
const t = JSON.parse(readFileSync(join(root, 'src', 'features', 'halation', 'tokens.json'), 'utf8'))
const C = Object.fromEntries(t.primitives.map((p) => [p.name, p.value]))

const W = 1600
const H = 1000
const PITCH = 9

function field({ base, baseTo, ribs, glow, specular, label }) {
  const bands = []
  for (let x = -PITCH; x < W + PITCH; x += PITCH) {
    const wave = (Math.sin(x / 97) + Math.sin(x / 41 + 1.3) + 2) / 4 // 0–1, deterministic
    const w = 3 + wave * 4.2
    const pick = ribs[Math.floor(((wave * ribs.length) % ribs.length + ribs.length) % ribs.length)]
    const o = (0.1 + wave * 0.5).toFixed(3)
    bands.push(`<rect x="${x}" y="-40" width="${w.toFixed(2)}" height="${H + 80}" fill="${pick}" opacity="${o}"/>`)
    bands.push(
      `<rect x="${(x + w).toFixed(2)}" y="-40" width="0.9" height="${H + 80}" fill="${specular}" opacity="${(0.18 + wave * 0.34).toFixed(3)}"/>`,
    )
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="0.35">
<stop offset="0" stop-color="${base}"/><stop offset="0.62" stop-color="${baseTo}"/><stop offset="1" stop-color="${base}"/>
</linearGradient>
<radialGradient id="r" cx="0.26" cy="0.22" r="0.72">
<stop offset="0" stop-color="${glow}" stop-opacity="0.85"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<g>${bands.join('')}</g>
<rect width="${W}" height="${H}" fill="url(#r)"/>
</svg>
`
}

writeFileSync(
  join(out, 'field-prism.svg'),
  field({
    base: C.porcelain,
    baseTo: C.wash,
    ribs: [C.coral, C.ember, C.lilac, C['coral-deep']],
    glow: C.shell,
    specular: C.shell,
    label: 'Halation prismatic field — reeded glass over porcelain',
  }),
)

writeFileSync(
  join(out, 'field-prism-night.svg'),
  field({
    base: C.obsidian,
    baseTo: C.wine,
    ribs: [C.coral, C.ember, C['coral-deep'], C.lilac],
    glow: C.coral,
    specular: C['coral-light'],
    label: 'Halation night field — reeded glass over ember',
  }),
)

console.log('field · 2 files → public/brand/halation')
