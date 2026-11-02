import {
  AUDIT_ROWS,
  CAMPAIGN,
  DECISIONS,
  FAILURES,
  GAPS,
  MARK_SPECS,
  META,
  RAMPS,
  SEMANTIC,
  SHIP_CONDITIONS,
  STORY_BEATS,
  TYPE_SCALE,
} from '@/features/jakarta/jakarta-data'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Jakarta — design system, brand guide and audit (v${META.version})

> ${META.essence}

Jakarta is Case ${META.number} in the Sunnyside portfolio: a city identity system at
https://adityahimaone.space${META.href}.

## 1. The one idea

**${META.thesis}** Jakarta is not seen from one place; it is the place where a toll
road crosses a river and five modes of transport meet at Dukuh Atas. The mark is one
stroke that turns a corner and one stop where it turns.

The campaign line is **${META.campaign}** (${META.campaignYear}). The slogan and the
thesis are not the same sentence: the campaign is what the city says to its residents
in its 499th year, the thesis is why the mark is drawn the way it is.

- Thesis: the junction is the unit of the identity.
- Family: constructed track — one stroke width S, no circles except the stop.
- Geometry: outer corner 2S, inner corner 1S, stop 1,38S, gap 0,62S.
- Voice: warm, progressive, inclusive, authoritative.
- Not this: a skyline silhouette, a monogram in a circle, a gradient sunset.

### The campaign copy, verbatim

The hero carries the line and one sentence — *${CAMPAIGN.sub}* — because a hero that
explains itself is not a hero. The client's full text lives here:

> ${CAMPAIGN.lede}
>
> ${CAMPAIGN.body}

On the page the line is applied to the field, not set on it. The field is ten
**hard-stop bands** — flat district colour, not a gradient — with the Semanggi
junction plate masked at the reading edge and blended \`luminosity\`. The words live
on one **tinted plate**, 620px wide, that lets the bands through: one cream type
colour, a 1px hairline, no offset. Cream on the worst band measures 5,20:1 at 0.55
tint and 5,64:1 at 0.58 with backdrop blur. The headline is a caption, not a
hoarding: **40px/600 at -0,028em**, two lines, one colour, above it a 10,5px eyebrow
carrying *HUT ke–499 Kota Jakarta*. The old display does the shouting the field
already does, so it went.

The field is then **torn off**, not stopped. There is no second object under the
hero: the photograph dissolves to nothing as the field reaches the floor, the last
stretch is flat palette, and the hero's own bottom edge is cut on a tooth line of
unequal width and unequal depth, so the page's paper shows through the tears. One
surface, one edge — the band, the skew and the separate zigzag are gone, and the
scrim releases at the floor so the colours being torn are the colours in the
palette, not colours in shadow.

## 2. The mark

${table(
  ['Drawing', 'ViewBox', 'Minimum', 'Use'],
  MARK_SPECS.map((spec) => [spec.name, spec.viewBox, spec.min, spec.use]),
)}

The primary has 1S of clear space baked into its viewBox. The compact is a **separate
drawing** (0,78S stop, 0,44S gap, flush right, no padding), not a scaled primary, and
scores 0,918 IoU against it — the difference is the redesign. The glyph is a single
knocked-out contour on a 32 × 32 plate and is the drawing that ships at 16px.

## 3. The palette

Nine ramps, four steps each, named after Jakarta places. Primitives are places;
semantics are jobs. The last column is the computed ratio of that colour as text on
paper — which is what decides whether it may ever be a word.

${table(
  ['Ramp', 'Place', '100', 'Ratio on paper', 'May be'],
  RAMPS.map((ramp) => [
    ramp.name,
    ramp.place,
    ramp.hex[0],
    `${ramp.onPaper.toFixed(2).replace('.', ',')}:1`,
    ramp.verdict === 'body'
      ? 'body text'
      : ramp.verdict === 'large'
        ? 'large text only'
        : 'a ground, never type',
  ]),
)}

### The six published failures

${table(
  ['Pair', 'Ratio', 'Therefore'],
  FAILURES.map((row) => [row.pair, row.ratio, row.therefore]),
)}

This is the load-bearing finding: **a district colour is a ground, a mark, a field or
a stripe — never a word.** The corollary decided the button: white on Senja is 3,56:1
and fails, ink on Senja is 4,56:1 and passes, so the primary button is dark-on-orange.

A seventh pair is not a district colour: \`text-faint\` on paper is **4,09:1**.
Tertiary labels on the page use \`text-muted\` at **6,29:1**; the faint role is kept
for 24px and up. Publishing only the colours would hide a real failure.

## 4. The semantic layer

${table(
  ['Token', 'Light', 'Night', 'Job'],
  SEMANTIC.map((row) => [`--jk-${row.token}`, row.light, row.night, row.job]),
)}

Night is a **scope**, not a second palette: \`html[data-jk="night"]\` swaps the semantic
layer only. All 46 primitives are identical in both scopes and nothing is mode-prefixed.

## 5. Type

Plus Jakarta Sans, variable, 200–800, self-hosted as a 27 kB latin subset. One family,
three voices: display at 800, reading at 400, labels at 600 with 0,16em tracking.

${table(
  ['Role', 'Size', 'Leading', 'Tracking', 'Weight'],
  TYPE_SCALE.map((row) => [
    row.role,
    row.size,
    row.leading,
    row.tracking,
    row.weight,
  ]),
)}

## 6. Photography

Five plates, one rule: the photograph supplies the light and the palette supplies the
colour. No source file is ever baked; every treatment is a filter or a blend mode.

- **Luminance, not tint** — a plate is set to \`mix-blend-mode: luminosity\` over the
  ten hard-stop bands, so the city keeps its own structure and gains the palette's hue.
  A colour overlay would paint the skyline out; this tints it.
- **Two scrims, both ink** — the hero's is a vertical floor and a left-edge seat,
  leaving the top of the frame pure colour. The colophon's is a veil strong enough for
  12 px type and no stronger. Neutral ink (#080C10), never a brand colour.
- **One crop** — horizon at 62% of the frame, subject on the left third, sky kept
  above. Never crop a landmark mid-shaft: Monas loses its argument at the shoulders.

Where they are used is a decision, not a gallery. The hero's plate is **Semanggi** —
roads that meet, not a monument — and the night scope swaps it for the light-trail
skyline. The colophon sits on the Monas aerial, screened onto the ink and tinted with
the same ten colours: the monument appears once, small, at the bottom of the page —
which is exactly what the brief asked for. There is no photography section, because a
section of photographs is a portfolio, not a system.

## 7. Applications

Four artifacts on a 12-column bento: a phone screen (4), the JakLingko card (8), a
wayfinding panel (4) and a bus livery (8). Each sits on a 28px grid plate with a
numbered caption and the three token roles it spends. The JakLingko card is drawn
from scratch at ID-1 proportions (1,586:1): the ten-colour issuer ribbon along the
top edge, the **outlined Jakarta lockup** at issuer size — 34 units of a 1000-unit
card, which is 2,9mm on the real object — a chip, a contactless mark, the number in a
tabular mono grouping and a foil disc on the paper; on the right, a Laut operator
panel with the mark knocked out of it and one right-angle route. The operator word
sits at 3,41:1 as 21px/800 — large text, which clears 3:1 — and no small cream type
is set on Laut at all, because it would read 3,41 and fail. The wall folds to 1 + 2 at 1000px and to one column at 700px. Cards
lift 3px and move their shadow; under \`prefers-reduced-motion\` the lift is removed and
the still frame is the design.

## 8. Story beats

${STORY_BEATS.map((beat) => `**${beat.title}** — ${beat.body}`).join('\n\n')}

## 9. Decisions

${DECISIONS.map(
  (decision) =>
    `**${decision.title}**\nBecause: ${decision.because}\nNot when: ${decision.notWhen}\nBreaks next: ${decision.breaksNext}`,
).join('\n\n')}

## 10. Audit — seventeen checks

${table(
  ['Check', 'Result', 'Evidence'],
  AUDIT_ROWS.map((row) => [row.check, row.result, row.evidence]),
)}

## 11. Named gaps

${GAPS.map((gap) => `- ${gap}`).join('\n')}

## 12. What would have to be true to ship

${SHIP_CONDITIONS.map((item) => `${item.n} **${item.title}** — ${item.body}`).join('\n')}

## 13. Files

- \`/brand/jakarta/mark.svg\`, \`mark-compact.svg\`, \`glyph.svg\`, \`wordmark.svg\`, \`lockup.svg\`
- \`/brand/jakarta/jakarta-brandkit.png\` — the brand board, 1500 × 1125
- \`/brand/jakarta/jaklingko-card.png\` — the ID-1 card, 1000 × 630, captured from the component
- \`/brand/jakarta/photos/\` — five plates, WebP
- \`/design-system/jakarta\` — the specimen page
- \`design/brand/jakarta/brandkit.html\` — board source, rendered by \`scripts/render-board.mjs\`
`

  return new Response(brand, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
