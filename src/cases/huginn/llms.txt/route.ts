import {
  AUDIT_ROWS,
  CELL_RECIPE,
  CONTRAST_PAIRS,
  DECISIONS,
  DITHER_RECIPE,
  GAPS,
  MARK_SPECS,
  META,
  PALETTE,
  REJECTED_MARKS,
  STORY_BEATS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/huginn/huginn-data'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Huginn — design system, brand guide and audit (${META.version})

> ${META.promise}

Huginn is ${META.caseNumber} in the Sunnyside portfolio: a print-studio system built on a
single cell, at https://adityahimaone.space/design-system/huginn.

## 1. The one idea

**${META.oneSentence}**

- Track: constructed — a cell matrix, fill only, no stroke.
- Material: one vermilion field, ink black, bone paper, an ordered 4 × 4 Bayer dither.
- Signature: five 14-unit cells on a 3-unit gap, and a sixth that has left the grid by six
  units and is printed in the field colour.
- Enemy: the editorial dark-mode portfolio — a big serif, a duotone photograph, a gradient;
  and "dither" used as a texture overlay instead of a rendering rule.

## 2. The story, in seven beats

${STORY_BEATS.map((beat) => `- **${beat.beat}.** ${beat.line}`).join('\n')}

## 3. Decisions

${DECISIONS.map(
  (d) =>
    `### ${d.title}\n\n- **Decision.** ${d.decision}\n- **Because.** ${d.because}\n- **Not when.** ${d.notWhen}\n- **Breaks next.** ${d.breaksNext}`,
).join('\n\n')}

## 4. Marks

${table(
  ['Property', 'Value'],
  MARK_SPECS.map((spec) => [spec.key, spec.value]),
)}

Files: \`public/brand/huginn/\` — \`mark.svg\`, \`mark-compact.svg\`, \`mark-mono.svg\`,
\`mark-reverse.svg\`, \`glyph.svg\`, \`wordmark.svg\`, \`lockup.svg\`, \`lockup-reverse.svg\`,
\`favicon.svg\`, plus the studio's own plate (\`asgardsreien-1872.jpg\`,
\`asgardsreien-riders.webp\`). The wordmark is 22 rows of cells; no logo file contains live
text, and there is no blackletter font in the system.

Rejected, and why:

${REJECTED_MARKS.map((mark) => `- **${mark.name}.** ${mark.note}`).join('\n')}

## 5. The field

${table(
  ['Token', 'Name', 'Hex', 'Contrast', 'Job'],
  PALETTE.map((ink) => [ink.token, ink.name, ink.hex, ink.contrast, ink.job]),
)}

Measured pairs:

${table(
  ['Pair', 'Ratio', 'Use'],
  CONTRAST_PAIRS.map((pair) => [pair.pair, pair.ratio, pair.use]),
)}

The field never carries type below 24px: bone on vermilion is 4.54:1 and ink is 4.15:1, both
large-text only.

## 6. The dissolve

\`\`\`js
${DITHER_RECIPE}
\`\`\`

## 7. The cell

\`\`\`css
${CELL_RECIPE}
\`\`\`

## 8. Type

${table(
  ['Role', 'Family', 'Size', 'Line', 'Use'],
  TYPE_SCALE.map((row) => [row.role, row.family, row.size, row.line, row.use]),
)}

## 9. Tokens

\`\`\`json
${TOKENS_JSON}
\`\`\`

Three layers (primitive → semantic → component), namespaced \`--hg-*\`. The night surface is
\`html[data-huginn='night']\`: the field keeps its vermilion and the paper inverts.

## 10. Voice

${VOICE_SAMPLES.map((s) => `- **${s.ctx}.** ${s.line}${s.bad ? ` (Not: ${s.bad})` : ''}`).join('\n')}

## 11. Audit

${table(
  ['Check', 'Result', 'Evidence'],
  AUDIT_ROWS.map((row) => [row.check, row.result, row.evidence]),
)}

Known gaps:

${GAPS.map((gap) => `- ${gap}`).join('\n')}
`

  return new Response(brand, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
