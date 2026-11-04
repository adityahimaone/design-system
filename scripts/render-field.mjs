// Render the brand's own field plate (SVG) to a PNG the board can carry.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const svg = fs.readFileSync(path.resolve('public/brand/serenica/serenica-field.svg'), 'utf8')
const out = path.resolve('public/brand/serenica/serenica-field.png')
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })
await p.setContent(
  `<html><body style="margin:0;overflow:hidden;background:#E9ECE3">${svg.replace('<svg ', '<svg style="display:block;width:1600px;height:900px" ')}</body></html>`,
)
await p.waitForTimeout(400)
await p.screenshot({ path: out })
await b.close()
console.log('rendered →', out)
