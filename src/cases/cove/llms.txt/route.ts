import {
  AUDIT_ROWS,
  BUDGET_RULES,
  CONTRAST_PAIRS,
  DECISIONS,
  DETACH_FLOOR,
  DETACH_SCORES,
  GAPS,
  INSTRUMENTS,
  MARK_GATE,
  MARK_SPECS,
  MATERIAL_RULES,
  MOTION_RULES,
  OUTPUT_CONTRACT,
  PALETTE,
  STORY_BEATS,
  TIDE_RULES,
  TYPE_GATE,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/cove/cove-data'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

const weakest = DETACH_SCORES.reduce(
  (low, row) => (row.score < low.score ? row : low),
  DETACH_SCORES[0],
)

export function GET() {
  const brand = `# Cove — design system, brand guide and audit (v2.0)

> The cove is the cut; the reading is the light that arrived in it.

Cove is Case 09 in the Sunnyside portfolio: a night-first tidal-observatory design
system at https://adityahimaone.space/design-system/cove.

## 1. The one idea

**A number without a time on it is decoration.** Cove is for people who read water:
every value is a reading, and a reading carries the hour it was taken. There is no
live feed on this page — the readings are a fixed 24-point sample and the page says so
wherever it draws them.

${table(
  ['Beat', 'Line'],
  STORY_BEATS.map((beat) => [beat.beat, beat.line]),
)}

- Namespace: \`cv\`, tokens are \`--cv-*\`, scope is \`.cv-scope\`.
- Ramps: \`night\` (the base) and \`day\` (the override, selected by \`html[data-cove='day']\`).
- Not this: glass everywhere, a glow on a heading, a gauge that animates to look alive,
  a dark mode chosen because dark is fashionable.

## 2. Mark

The mark is **a carved corner with the reading nested in its cut**: two filled shapes on a
64-unit grid, separated by six units of ground. No stroke, no circle, no third shape.

${table(
  ['Spec', 'Value'],
  MARK_SPECS.map((spec) => [spec.key, spec.value]),
)}

The gate, as measured:

${table(
  ['Rule', 'Result', 'Note'],
  MARK_GATE.map((row) => [row.rule, row.pass ? 'PASS' : 'FAIL', row.note]),
)}

The wordmark is Sora SemiBold outlined to paths at −30/1000 tracking and frozen in
\`features/cove/wordmark-path.ts\`. It cannot swap, because a logo that swaps is not a logo.

## 3. Material

**Ink and lumen.** Flat panels, hairlines, no glass and no shadow — the only light in the
interface is the signal, and the signal is a state.

${table(
  ['Rule', 'Note'],
  MATERIAL_RULES.map((rule) => [rule.rule, rule.note]),
)}

The one exception is documented rather than hidden: a plate floating over a photograph
(the hero plate, the footer lockup) carries a single soft shadow, because on a
photograph a hairline alone does not separate.

## 4. Tide — the data layer

${table(
  ['Rule', 'Note'],
  TIDE_RULES.map((rule) => [rule.rule, rule.note]),
)}

## 5. Palette

${table(
  ['Name', 'Token', 'Hex', 'Role'],
  PALETTE.map((ink) => [ink.name, ink.token, ink.value, ink.role]),
)}

Measured pairs (WCAG 2.1, sRGB → linear → relative luminance, computed by
\`scripts/generate-cove-tokens.mjs\`):

${table(
  ['Pair', 'Ratio', 'Allowed use'],
  CONTRAST_PAIRS.map((pair) => [pair.pair, pair.ratio, pair.use]),
)}

Signal budget:

${BUDGET_RULES.map((rule) => `- ${rule}`).join('\n')}

## 6. Type

Three families, three jobs: Sora names, Geist reads, JetBrains Mono measures.

${table(
  ['Token', 'Size / line', 'Face', 'Use'],
  TYPE_SCALE.map((row) => [row.token, row.size, row.face, row.use]),
)}

${table(
  ['Rule', 'Result', 'Note'],
  TYPE_GATE.map((row) => [row.rule, row.pass ? 'PASS' : 'FAIL', row.note]),
)}

## 7. Instruments

${table(
  ['Instrument', 'Job', 'Rule'],
  INSTRUMENTS.map((item) => [item.name, item.job, item.rule]),
)}

## 8. Motion

${table(
  ['Name', 'Value', 'Note'],
  MOTION_RULES.map((rule) => [rule.name, rule.value, rule.note]),
)}

Under \`prefers-reduced-motion\` every duration collapses to 0.01ms and the still frame is
the designed state.

## 9. Voice

${table(
  ['Context', 'Say', 'Do not say'],
  VOICE_SAMPLES.map((sample) => [sample.ctx, sample.good, sample.bad]),
)}

## 10. Decisions

${DECISIONS.map(
  (decision) => `### ${decision.title}

- **Decision:** ${decision.decision}
- **Because:** ${decision.because}
- **Not when:** ${decision.notWhen}
- **Breaks next:** ${decision.breaksNext}`,
).join('\n\n')}

## 11. Tokens

One source, two exports. \`features/cove/tokens.json\` generates
\`features/cove/cove-tokens.css\` and the two files in \`public/brand/cove/\`.

- CSS: https://adityahimaone.space/brand/cove/cove-tokens.css
- JSON: https://adityahimaone.space/brand/cove/cove-tokens.json

## 12. Audit

${table(
  ['Check', 'Result', 'Evidence'],
  AUDIT_ROWS.map((row) => [row.check, row.result, row.evidence]),
)}

### Detach scorecard

Cove v2.0 was scored against every sibling with \`scripts/detach-check.mjs\` (100 points,
floor ${DETACH_FLOOR}):

${table(
  ['Compared with', 'Score', 'Finding'],
  DETACH_SCORES.map((row) => [row.ref, String(row.score), row.finding]),
)}

The weakest pair is **${weakest.ref} at ${weakest.score}**, against a floor of ${DETACH_FLOOR}.

## 13. Still open

${GAPS.map((gap) => `- ${gap}`).join('\n')}

## 14. Files

${table(
  ['Path', 'Role'],
  OUTPUT_CONTRACT.map((row) => [row.path, row.role]),
)}

---

Source of truth: \`features/cove/\` and \`public/brand/cove/\` in the Sunnyside repository.
This file is generated from the same data the page renders, so it cannot drift.
`

  return new Response(brand, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
