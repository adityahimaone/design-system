import {
  AUDIT_ROWS,
  CONTRAST_PAIRS,
  DECISIONS,
  GAPS,
  MARK_SPECS,
  META,
  PALETTE,
  REGISTER_RECIPE,
  REJECTED_MARKS,
  STORY_BEATS,
  TEAR_RECIPE,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/riso/riso-data'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Riso Co. — design system, brand guide and audit (${META.version})

> ${META.promise}

Riso Co. is ${META.caseNumber} in the Sunnyside portfolio: a two-drum print system at
https://adityahimaone.space/design-system/riso.

## 1. The one idea

**${META.oneSentence}**

- Track: constructed — offset geometric planes, fill only, no stroke.
- Material: uncoated vellum, one fluorescent orange drum, one federal blue drum, a steel pin.
- Signature: a sheet pinned at the top and torn from the pin, the right flap 4,3 out of
  register because the other drum printed it.
- Enemy: the risograph look as a filter — grain overlays, blend modes, drop shadows
  pretending to be ink.

## 2. The story, in seven beats

${STORY_BEATS.map((beat) => `- **${beat.beat}.** ${beat.line}`).join('\n')}

## 3. Decisions

${DECISIONS.map(
  (d) =>
    `### ${d.title}\n\n- **Decision.** ${d.decision}\n- **Because.** ${d.because}\n- **Not when.** ${d.notWhen}\n- **Breaks next.** ${d.breaksNext}`,
).join('\n\n')}

## 4. Marks

The mark is three shapes: drum A's flap, drum B's flap (slid 4,3), and the pin. The pin is
the only element that crosses the tear.

${table(
  ['Property', 'Value'],
  MARK_SPECS.map((spec) => [spec.key, spec.value]),
)}

Files: \`public/brand/riso/\` — \`mark.svg\`, \`mark-compact.svg\`, \`mark-mono.svg\`,
\`mark-reverse.svg\`, \`glyph.svg\`, \`wordmark.svg\`, \`lockup.svg\`, \`lockup-reverse.svg\`,
\`favicons/\`. The wordmark is outlined; no logo file contains live text.

Rejected, and why:

${REJECTED_MARKS.map((mark) => `- **${mark.name}.** ${mark.note}`).join('\n')}

## 5. Ink

${table(
  ['Token', 'Name', 'Hex', 'Contrast', 'Job'],
  PALETTE.map((ink) => [ink.token, ink.name, ink.hex, ink.contrast, ink.job]),
)}

Measured pairs:

${table(
  ['Pair', 'Ratio', 'Use'],
  CONTRAST_PAIRS.map((pair) => [pair.pair, pair.ratio, pair.use]),
)}

The two failing pairs are published on purpose: fluorescent orange as type (2.96:1) and
steel as a border (2.03:1). Both are fills only.

## 6. Type

${table(
  ['Role', 'Family', 'Size', 'Line', 'Use'],
  TYPE_SCALE.map((row) => [row.role, row.family, row.size, row.line, row.use]),
)}

Display type carries a 2.2px second impression:

\`\`\`css
${REGISTER_RECIPE}
\`\`\`

## 7. The tear

\`\`\`css
${TEAR_RECIPE}
\`\`\`

## 8. Tokens

\`\`\`json
${TOKENS_JSON}
\`\`\`

Three layers (primitive → semantic → component), namespaced \`--rs-*\`. The dark surface is
\`html[data-riso='safelight']\`: the drums keep their hex and the paper inverts.

## 9. Voice

${VOICE_SAMPLES.map((s) => `- **${s.ctx}.** ${s.line}${s.bad ? ` (Not: ${s.bad})` : ''}`).join('\n')}

## 10. Audit

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
