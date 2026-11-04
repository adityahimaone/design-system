/**
 * Kanon · shelf thumbnails
 *
 * The shelf and the hero band were loading the brandkit boards themselves —
 * 32 MB of PNG, most of it 3000×2250 — to paint a 390px card and a 190px tile.
 * This downsamples each cover once into two WebPs the layout actually needs:
 *
 *   <slug>.webp     1200×900  the shelf card (2× of a 420px column)
 *   <slug>-sm.webp   560×420  one band tile (2× of a 190px facet)
 *
 * 800px was the first try and the boards — dense print mockups — came back soft.
 *
 *   node scripts/build-covers.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const PUB = path.join(ROOT, 'public')
const OUT = path.join(PUB, 'brand/thumbs')

const SIZES = [
  { suffix: '', w: 1200, h: 900, quality: 80 },
  { suffix: '-sm', w: 560, h: 420, quality: 74 },
]

const src = await readFile(path.join(ROOT, 'src/data/cases.ts'), 'utf8')
const covers = [...src.matchAll(/cover: '(\/brand\/[^']+)'/g)].map((m) => m[1])

await mkdir(OUT, { recursive: true })

const made = []

for (const cover of covers) {
  const slug = cover.split('/').pop().replace(/-brandkit\.\w+$/, '').replace(/\.\w+$/, '')
  const from = path.join(PUB, cover)

  const row = { slug, bytes: {} }
  for (const s of SIZES) {
    const buf = await sharp(from)
      .resize(s.w, s.h, { fit: 'cover', position: 'centre' })
      .webp({ quality: s.quality, effort: 6 })
      .toBuffer()
    await writeFile(path.join(OUT, `${slug}${s.suffix}.webp`), buf)
    row.bytes[s.suffix || 'full'] = buf.length
  }
  made.push(row)
}

const sum = (k) => made.reduce((n, r) => n + r.bytes[k], 0)
const kb = (n) => `${Math.round(n / 1024)} KB`
const top = (k) =>
  [...made]
    .sort((a, b) => b.bytes[k] - a.bytes[k])
    .slice(0, 3)
    .map((r) => [r.slug, kb(r.bytes[k])])

console.log(
  JSON.stringify(
    {
      boards: made.length,
      shelf: { total: kb(sum('full')), largest: top('full') },
      band: { total: kb(sum('-sm')), largest: top('-sm') },
    },
    null,
    2,
  ),
)
