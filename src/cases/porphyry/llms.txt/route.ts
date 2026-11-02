import {
  AUDIT_ROWS,
  CONTRAST_PAIRS,
  DECISIONS,
  DETACH,
  GAPS,
  MARK_SPECS,
  MASK_RECIPE,
  META,
  PALETTE,
  PRINT_RECIPE,
  STORY_BEATS,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/porphyry/porphyry-data'
import tokens from '@/features/porphyry/tokens.json'

const TOKENS_JSON = JSON.stringify(tokens, null, 2)

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Porphyry — design system, brand guide and audit (${META.version})

> ${META.promise}

Porphyry is ${META.caseNumber} in the Sunnyside portfolio: a classical stage for
modern interfaces at https://adityahimaone.space/design-system/porphyry.

## 1. The one idea

**${META.oneSentence}**

- Track: constructed — architectural block, fill only, no stroke.
- Material: porphyry stone, lit marble, gold leaf, one dark stage.
- Signature: a stage opening cut into a block of porphyry, with one gold threshold
  and a quarried corner, and a loader that fills the word with marble.
- Enemy: ${META.enemy}

## 2. The story, in seven beats

${STORY_BEATS.map((beat) => `- **${beat.beat}.** ${beat.line}`).join('\n')}

## 3. Decisions

${DECISIONS.map(
  (d) =>
    `### ${d.title}\n\n- **Decision.** ${d.decision}\n- **Because.** ${d.because}\n- **Not when.** ${d.notWhen}\n- **Breaks next.** ${d.breaksNext}`,
).join('\n\n')}

## 4. The mark

Two filled shapes on the 64 grid: a stone block with a trapezoid opening and an
8-unit gold threshold; the top-right corner is cut as it came out of the quarry.
The compact mark is a separate drawing.

${table(
  ['Property', 'Value'],
  MARK_SPECS.map((spec) => [spec.key, spec.value]),
)}

Files: \`public/brand/porphyry/\` — \`mark.svg\`, \`mark-compact.svg\`,
\`mark-compact-reverse.svg\`, \`mark-mono.svg\`, \`mark-reverse.svg\`, \`glyph.svg\`,
\`wordmark.svg\`, \`wordmark-ink.svg\`, \`wordmark-reverse.svg\`, \`lockup.svg\`,
\`lockup-reverse.svg\`, \`lockup-mono.svg\`, \`favicon.svg\`. Every logo file is
outlined; none contains live text. The marks are not the meander ring: that is
the loading ornament, not the identity.

## 5. Stone

${table(
  ['Token', 'Name', 'Hex', 'Contrast', 'Job'],
  PALETTE.map((ink) => [ink.token, ink.name, ink.hex, ink.contrast, ink.job]),
)}

Measured pairs:

${table(
  ['Pair', 'Ratio', 'Use'],
  CONTRAST_PAIRS.map((pair) => [pair.pair, pair.ratio, pair.use]),
)}

Two pairs fail on purpose: gold on porphyry (4.28:1) and the stone ornament on
the stage (3.10:1). Both are ornament only.

## 6. Type

${table(
  ['Role', 'Family', 'Size', 'Line', 'Use'],
  TYPE_SCALE.map((row) => [row.role, row.family, row.size, row.line, row.use]),
)}

Cinzel sets the inscription; Jost reads and measures; Pinyon Script appears at
most once per page.

## 7. The cast

${MASK_RECIPE}

${PRINT_RECIPE}

## 8. Tokens

\`\`\`json
${TOKENS_JSON}
\`\`\`

Three layers (primitive → semantic → component), namespaced \`--po-*\`. The stage
is the default surface; the vellum is \`html[data-po='vellum']\`, not a second
palette.

## 9. Detach gate

${table(
  ['Against', 'Score', 'Breakdown'],
  DETACH.map((row) => [row.ref, `${row.score}/100`, row.parts]),
)}

The weakest pair is the number that matters: 73/100 against Hachure.

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
