import {
  AUDIT_ROWS,
  CAST,
  CONTRAST_PAIRS,
  DECISIONS,
  GAPS,
  GLASS_RECIPE,
  MARK_SPECS,
  PALETTE,
  REJECTED_MARKS,
  STORY_BEATS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/clearing/clearing-data'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const brand = `# Clearing — design system, brand guide and audit (v1.0)

> A field journal for the light between the trees.

Clearing is Case 08 in the Sunnyside portfolio: a painted-emerald design system at
https://adityahimaone.space/design-system/clearing.

## 1. The one idea

**A sighting is a painted page, not a database row.** Clearing is for people who watch
wildlife rather than collect it: no streaks, no counts, no leaderboards, no notification
at dusk. The interface is a notebook with a memory.

- Essence: painted emerald light, seen through one pane of glass.
- Promise: a sighting that takes twenty seconds in the field, gloves on, sun on the screen.
- Family: drawn track — a figure on a horizon, not a badge.
- Gate: one subject, one cut line, one flat fill, 2–3 inks, legible at 16px.
- Voice: plain, specific, unhurried, first person.
- Not this: neon gradients, glass everywhere, streak counters, cartoon wildlife.

## 2. Mark

The mark is **a stag on a horizon**: one drawn animal standing on a tapered ground line,
64-unit grid, figure scaled 0.72, antler cut 2.7. The line is a horizon, not a frame —
it may break the edge of a card.

${table(
  ['Spec', 'Value'],
  MARK_SPECS.map((spec) => [spec.key, spec.value]),
)}

Rejected subjects (drawn and discarded):

${table(
  ['Subject', 'Why it lost'],
  REJECTED_MARKS.map((mark) => [mark.name, mark.note]),
)}

## 3. Story spine

${table(
  ['Beat', 'Thesis'],
  STORY_BEATS.map((beat) => [beat.beat, beat.line]),
)}

## 4. Decisions

${DECISIONS.map(
  (d, i) => `### 4.${i + 1} ${d.title}

- **Decision:** ${d.decision}
- **Because:** ${d.because}
- **Not when:** ${d.notWhen}
- **Breaks next:** ${d.breaksNext}`,
).join('\n\n')}

## 5. Palette

${table(
  ['Token', 'Name', 'Hex', 'Job', 'Contrast'],
  PALETTE.map((ink) => [
    `\`${ink.token}\``,
    ink.name,
    `\`${ink.hex}\``,
    ink.job,
    ink.contrast,
  ]),
)}

Measured contrast pairs (WCAG 2.1, sRGB):

${table(
  ['Pair', 'Ratio', 'Allowed use'],
  CONTRAST_PAIRS.map((pair) => [pair.pair, pair.ratio, pair.use]),
)}

Night forest is the same six inks read in the dark: page \`#07130F\`, raised
\`#0C1D17\`, text \`#F0EAD9\`, loud field becomes Glow, focus ring becomes Glow.

## 6. Type

${table(
  ['Role', 'Family', 'Size', 'Line', 'Use'],
  TYPE_SCALE.map((row) => [row.role, row.family, row.size, row.line, row.use]),
)}

The wordmark is Iowan Old Style outlined from the font file, tracking −14 units, with the
i-tittle replaced by the light disc. No logo file contains live text.

## 7. The cast

Five marks, one cut line (3.2), one job each. The cast is punctuation, never structure:
it never carries a fact on its own, never sits over type, never appears in a favicon, and
never exceeds five marks in one composition.

${table(
  ['Mark', 'Job', 'Role'],
  CAST.map((mark) => [mark.name, mark.job, mark.index]),
)}

## 8. Material — the glass recipe

\`\`\`css
${GLASS_RECIPE}
\`\`\`

One pane per view, and copy sits on a solid plate inside it. The painting's meadow is four
times lighter than its trees, so type directly on the blur fails and looks accidental.

## 9. Voice

${table(
  ['Context', 'Line', 'Never'],
  VOICE_SAMPLES.map((sample) => [sample.ctx, sample.line, sample.bad ?? '—']),
)}

## 10. Tokens

\`\`\`json
${TOKENS_JSON}
\`\`\`

## 11. Audit

${table(
  ['Check', 'Result', 'Evidence'],
  AUDIT_ROWS.map((row) => [row.check, row.result, row.evidence]),
)}

## 12. Known gaps

${GAPS.map((gap) => `- ${gap}`).join('\n')}
`

  return new Response(brand, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
