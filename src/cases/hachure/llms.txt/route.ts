import tokens from '@/features/hachure/tokens.json'

type Token = { name?: string; value?: string; role?: string; use?: string }

const rows = (items: Token[]) =>
  items
    .map(
      (item) =>
        `| ${item.name ?? item.use} | ${item.value ?? ''} | ${item.role ?? item.use ?? ''} |`,
    )
    .join('\n')

const pairs = tokens.contrast
  .map(
    (pair) =>
      `| ${pair.label} | ${pair.theme} | ${pair.a} on ${pair.b} | ${pair.ratio.toFixed(2)}:1 | ${pair.level} |`,
  )
  .join('\n')

const failing = tokens.contrast.filter((pair) => pair.level === 'Fail')

export function GET() {
  const content = `# Hachure — design system

> Relief drawn by density, never by shadow.

Hachure is Case 05 in the design-system library: a cartographic interface system for terrain, weather and field data, built from the supplied \`RidgelineDitherFooter\` component. The component is a tone engine — ridged fractal noise, an 8×8 Bayer matrix, a seven-step palette whose first step is the paper, a drifting mist field and a back-to-front reveal. The system is the decision about what that engine is for.

## The rule

Depth is density, not shadow. Every tonal step is a palette index chosen per cell by a Bayer threshold. There are no gradients, no \`box-shadow\` and no opacity tints: a cell is ink or it is paper. Tone 1 is the paper colour, which is why the top of the range can dissolve into the page rather than fade out of it.

## The fusion

Six directions were considered for the component's interface. Two were borrowed and two refused:

1. Terrain console — refused: night radar is a cliché with worse contrast.
2. Editorial riso zine — refused: that is Case 04 and it earned it.
3. Data-relief dashboard — borrowed: the chart has to be honest, so contrast is measured in the build.
4. Cartographic survey sheet — kept: hachure, margins, benchmark numerals, one loud field.
5. Mist-lens explorer — borrowed: the pointer parts the mist and reads a crest height.
6. Bento relief cards — refused: dither as garnish in a rounded box.

Category defaults rejected: the soft card shadow, the gradient sky, and the isosceles-triangle peak logo.

## Elevation

There are three bands because an interface has three levels of meaning.

| Band | Altitude | What lives there |
| --- | --- | --- |
| Range | 400–3,000 m | The two edges of the page: the hero field and the footer field. One field, two exposures |
| Bench | 40 m | Panels, inputs, table headers: one hairline and one tone |
| Ground | 0 m | The page, survey stock, reading type. Nothing sits below it |

The range is the only loud field, and it is allowed at the two edges: it rises under the title and returns at the foot. Both are drawn by the same engine and seeded differently, so they read as one range seen twice rather than two illustrations. A third exposure — a framed plate mid-page — would cancel them, so it is not allowed. The copy never sits on the field: it is a row of its own in the hero's column, because the engine puts the highest crest at 16% of its box and a field stretched behind the type lifts the terrain into the lead paragraph.

## Mark

A section through rising ground: one solid mass, one lit crest, on a 64 grid. The mass has a flat bottom at \`y57\`, vertical sides at \`x3\` and \`x61\`, and a top edge climbing \`24\` units over \`58\` — a 22° slope. The crest is a \`7\`-unit band cut from that edge, so the highest surface of the silhouette is the lichen and the accent is the ground rather than a stripe laid on it. Nothing is hatched inside the mass, because internal hatching is what fails at 16px; density is carried by the slope of the top edge instead of by a stroke count. The body reads \`--hx-mark-ink\` (\`#16211B\` on ground, the paper ink at night) and the crest reads \`--hx-sheet\` \`#C9D94E\`. Clear space is \`3\` left and right, \`5\` above, \`7\` below. No circle, no ring, no stroke. There is no compact variant: with no channel to close, 16px and 512px are the same geometry. \`mono\` collapses the crest to currentColor and the slope remains the silhouette. Nine marks were drawn in the v4.0 bake-off — a stepped silhouette, a single stroke, a map key, a quantised edge, a banded solid, a contour arc, a weight ramp in three weights, a heavy base with a lit summit, and the kept solid mass with a lit crest. The ramp was the best of them and lost because reversing it reversed its meaning. Notes live in \`design/brand/hachure/explorations/directions.md\`.

## Wordmark

"hachure" outlined from Geist Mono 700 into a single path. Never live text, never a webfont dependency. The lockup places the mark and wordmark 16 units apart.

## Palette

| Primitive | Value | Role |
| --- | --- | --- |
${rows(tokens.primitives)}

## Tone ramp — light

| Step | Value |
| --- | --- |
${tokens.tones.light.map((tone, index) => `| ${index + 1} | ${tone} |`).join('\n')}

## Tone ramp — night

| Step | Value |
| --- | --- |
${tokens.tones.dark.map((tone, index) => `| ${index + 1} | ${tone} |`).join('\n')}

Night is not the light ramp inverted: the near ridges get lighter, the way a moonlit face catches light.

## Semantic tokens — light

| Token | Value | Role |
| --- | --- | --- |
${rows(tokens.semantic.light)}

## Semantic tokens — night

| Token | Value | Role |
| --- | --- | --- |
${rows(tokens.semantic.dark)}

## Colour rules

- Lichen \`#C9D94E\` is a fill, never a letter: ${failing[0]?.ratio.toFixed(2) ?? '1.40'}:1 on stock.
- Moss \`#4A6B33\` is the type-safe green, and tone 5 follows it so the footer and page agree.
- Survey red \`#A82A1C\` is functional only: errors, never identity.
- Night paper is \`#0A110D\` — a green-black, not \`#000\`.

## Type

| Role | Face | Weight | Size | Leading | Tracking |
| --- | --- | --- | --- | --- | --- |
${tokens.type.map((row) => `| ${row.role} | ${row.face === 'mono' ? 'Geist Mono' : 'Geist'} | ${row.weight} | ${row.size} | ${row.leading} | ${row.tracking} |`).join('\n')}

Mono carries the display, labels, coordinates, altitudes and the wordmark; Geist reads. Two families, both already loaded by the host.

## Space and motion

${tokens.space.map((row) => `- \`--hx-space-${row.name}\`: ${row.value} — ${row.use}`).join('\n')}

${tokens.motion.map((row) => `- \`--hx-dur-${row.name}\`: ${row.value} — ${row.use}`).join('\n')}

The footer's reveal runs once, in this order: frame guides (1.4s), brand (140ms), ridges back to front (380ms, 170ms apart), copyright (1250ms), altimeter armed (1600ms). Reduced motion resolves to the finished plate, the mist holds still and the pointer clearing is off; the altimeter still reads.

## Contrast, measured in the build

Ratios are computed from the semantic layer by \`scripts/build-hachure-brand.mjs\`; none are typed beside the colour.

| Pair | Theme | Colours | Ratio | Level |
| --- | --- | --- | --- | --- |
${pairs}

${failing.length ? `The failing pair is kept visible as a rule rather than fixed by drifting the colour: ${failing.map((pair) => `${pair.label} at ${pair.ratio.toFixed(2)}:1`).join(', ')}.` : 'No pair fails.'}

## Components

- \`features/hachure/components/brand.tsx\`: \`HachureMark\`, \`HachureWordmark\`, \`HachureLockup\`.
- \`features/hachure/components/controls.tsx\`: ground/night switch; the page root carries \`data-theme\` so the token layer decides what each role resolves to.
- \`features/hachure/components/hero-plate.tsx\`: the hero plate, revealed once by the same engine as the footer.
- \`features/hachure/components/dither-study.tsx\`: tones, ridges, cell size, mist and a \`develop\` scrub, plus the Bayer matrix.
- \`features/hachure/components/elevation-study.tsx\`: the three bands, with what lives on each.
- \`features/hachure/components/form-demo.tsx\`: "File a site report" — station, correction address, datum, spot height, report kind, note, quote consent. Errors are summarised with anchor links and focus moves to the first problem.
- \`features/hachure/components/footer-demo.tsx\`: the \`RidgelineDitherFooter\` specimen with seed, ridge count, mist and altimeter controls; it follows the page theme through a MutationObserver.
- \`components/ui/ridgeline-dither-footer.tsx\`: the supplied component, unmodified in behaviour.

## Files

- Tokens: \`features/hachure/tokens.json\` → \`features/hachure/hachure-tokens.css\`, \`public/brand/hachure/hachure-tokens.{css,json}\`.
- Marks: \`public/brand/hachure/\` — mark, mark-mono, wordmark, lockup, favicons at 16/32/180 and SVG.
- Board: \`design/brand/hachure/brandkit.html\` → \`public/brand/hachure/hachure-brandkit.png\` (1500 × 1125).
- Generators: \`scripts/build-hachure-brand.mjs\`, \`scripts/hachure-wordmark.py\`, \`scripts/render-hachure-board.mjs\`.
- Case notes: \`design/brand/hachure/brief.md\`, \`design/brand/hachure/explorations/directions.md\`, \`docs/hachure-design-system-audit.md\`.

## Not verified

Print output. The palette is a screen approximation of a two-ink survey sheet; halftone at 2px, paper absorption and the real lichen ink have not been proofed. The altimeter reads a generated elevation, not a surveyed one. The component's \`backdrop-filter\` altimeter badge has not been checked in Safari. The Playwright e2e suite was skipped for this case.
`

  return new Response(content, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
