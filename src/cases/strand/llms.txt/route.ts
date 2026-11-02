import {
  DETACH_FLOOR,
  DETACH_SCORES,
  GAPS,
  MARK_GATE,
  OUTPUT_CONTRACT,
  STORY_BEATS,
  TYPE_GATE,
} from '@/features/strand/strand-data'
import tokens from '@/features/strand/tokens.json'

const palette = (rows: { name: string; value: string; role: string }[]) =>
  rows.map((t) => `\`--st-${t.name}\`: \`${t.value}\` — ${t.role}`).join('\n')

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Strand — design system, brand guide and audit (v2.0)

> Two planes, and the strand between them.

Strand is Case 07 in the Sunnyside portfolio: a coastal interface system at
https://adityahimaone.space/design-system/strand.

## 1. The one idea

**Sea-glass over dune light.** Every container is a pane: a 158° white gradient, 24px of
backdrop blur, a 1px specular edge and one long shadow. Paragraphs sit on solid plates
inside the pane. The mark is two sheared planes with a six-unit channel between them; the
channel is the strand, and it is the only part of the mark that is not drawn.

- Essence: two planes, and the strand between them.
- Promise: quiet glass over dune light, one sun-warm signal.
- Family: offset geometric planes (constructed track).
- Gate: v3.0 constructed — zero circles, fill-only, two primitives, one accent.
- Voice: measured, unhurried, specific.
- Not this: frosted pills on every card, gradient headings, glass that refracts nothing.

## 2. Material

One pane per view. \`--st-glass-fill\` is a 158° white gradient (0.84 → 0.58), the blur is
24px at 1.7 saturation, the edge is a 1px border at 78% white plus a 1px inset highlight,
and the shadow is 64px blur at −34px spread and 45% ink. A paragraph never sits on glass:
it sits on \`--st-plate\` inside the pane. Where \`backdrop-filter\` is unsupported the pane
falls back to a solid fill of the same tint, so contrast never changes.

## 3. Mark

Two planes on the 64 grid: \`M26 9H58L52 27H20Z\` (sun, upper) and \`M12 33H52L46 55H6Z\`
(marine, lower), separated by a six-unit channel — 9.4% of the grid. Both are sheared
18.4°, the upper overhangs the lower by eight units, and nothing is stroked. Below 28px a
separate compact drawing widens the channel to seven units and drops the fine alignment.

${table(
  ['Rule', 'Status', 'Note'],
  MARK_GATE.map((r) => [r.rule, r.pass ? 'PASS' : 'FAIL', r.note]),
)}

## 4. Story spine

${table(
  ['Beat', 'Thesis'],
  STORY_BEATS.map((s) => [s.beat, s.line]),
)}

## 5. Palette

### Dune (light)

${palette(tokens.semantic.light)}

### Night (dark)

${palette(tokens.semantic.dark)}

Measured contrast pairs (WCAG 2.1, sRGB, computed on the declared composite):

${table(
  ['Pair', 'Ratio', 'Use'],
  tokens.contrast.map((c) => [c.label, `${c.ratio}:1`, c.use]),
)}

## 6. Typography

Instrument Sans (display, 600, −0.035em), Geist (reading, 400 at 17px/1.62), Geist Mono
(labels, 500 at 11px, 0.14em). Three families, three jobs. The wordmark is Helvetica Neue
Medium outlined at −22/1000 tracking and frozen as paths — a drawing, not live text.

${table(
  ['Rule', 'Status', 'Implementation'],
  TYPE_GATE.map((t) => [t.rule, t.pass ? 'PASS' : 'FAIL', t.note]),
)}

## 7. Sections

foundation · glass · marks · horizon · palette · type · parts · motion · voice · tokens ·
audit. Every id is rendered; \`glass\`, \`horizon\` and \`palette\` belong to this system alone.

## 8. Output contract

${table(
  ['Path', 'Role'],
  OUTPUT_CONTRACT.map((o) => [o.path, o.role]),
)}

## 9. Detach, against the five neighbours

Floor ${DETACH_FLOOR}. Two pairs are below it and are reported as such.

${table(
  ['Reference', 'Score', 'Finding'],
  DETACH_SCORES.map((d) => [d.ref, `${d.score}/100`, d.finding]),
)}

## 10. Known gaps

${GAPS.map((g) => `- ${g}`).join('\n')}
`

  return new Response(brand, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
