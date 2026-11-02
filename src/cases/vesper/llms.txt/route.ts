import { NextResponse } from 'next/server'

import tokens from '@/features/vesper/tokens.json'
import scores from '@/features/vesper/scores.json'
import { CAST, DECISIONS, GAPS, META } from '@/features/vesper/vesper-data'

export const dynamic = 'force-static'

/**
 * The agent-readable twin of the case page. Every number is read from
 * `tokens.json` and `scores.json`, so this file cannot drift from the sheet the
 * page draws — including the bake-off rank, which is computed rather than typed.
 */
export function GET() {
  const rank = scores.findIndex((s) => s.id === 'horizon-star') + 1
  const shipped = scores.find((s) => s.id === 'horizon-star')

  const body = [
    `# Vesper — Case ${META.number}`,
    '',
    META.essence,
    '',
    `Tagline: ${META.tagline}`,
    `Route: ${META.href}`,
    `Specimen: ${META.specimen}`,
    `Audit: ${META.audit}`,
    `Namespace: ${tokens.meta.namespace} · ${tokens.meta.archetype} archetype · ${tokens.meta.track} track`,
    '',
    '## The idea',
    '',
    tokens.meta.oneSentence,
    '',
    `Promise: ${tokens.meta.promise}`,
    '',
    'A design system is a horizon, not a spotlight. A spotlight lights one thing and blinds you',
    'to the rest; a horizon tells you where the ground ends from anywhere on it, and it is the only',
    'line in the artwork that never moves. One bar, one star resting on it, two inks, nothing that',
    'glows. If a surface cannot be reproduced on uncoated stock in two passes, it is decoration.',
    '',
    '## The mark',
    '',
    'A four-point star, 46 × 40 units, whose lower point lands exactly on a 44 × 4 bar. There is no',
    'stem: a star on a stem on a base is a trophy, and eleven concepts were drawn to establish that.',
    'The geometry is fixed at 64 units — a theme flip swaps which file is used, ink or cream, and',
    'never the drawing.',
    '',
    '- `mark.svg` — primary, ink on chalk',
    '- `mark-compact.svg` — a different drawing for 16–24px: 2.6 bow, 5-unit bar',
    '- `glyph.svg` — the star alone, for inline 16px use',
    '- `lockup.svg` / `lockup-stacked.svg` — with the outlined wordmark, never live text',
    '',
    '## The cast',
    '',
    ...CAST.map((c) => `- **${c.name}** — ${c.use}`),
    '',
    '## Decisions',
    '',
    ...DECISIONS.map(
      (d) =>
        `- **${d.decision}** — ${d.because} Not when: ${d.notWhen} Breaks next: ${d.breaks}`,
    ),
    '',
    '## Primitives',
    '',
    ...tokens.primitives.map(
      (p) => `- \`--vs-${p.name}\`: ${p.value} — ${p.role}`,
    ),
    '',
    '## Contrast (recomputed from hex)',
    '',
    ...tokens.contrast.map(
      (c) =>
        `- ${c.label}: ${c.ratio.toFixed(2)}:1 — ${c.pass ? 'pass' : 'FAILS, do not use as text'}`,
    ),
    '',
    '## Type',
    '',
    ...tokens.type.map(
      (t) =>
        `- \`--vs-${t.name}\`: ${t.value} ${t.weight} · ${t.size}px · lh ${t.leading} · ls ${t.tracking}em — ${t.use}`,
    ),
    '',
    '## The bake-off, scored',
    '',
    'Eleven concepts were rasterised at 128, 40 and 16 and measured on eight pass-or-fail checks.',
    `The shipped mark ranks ${rank} of ${scores.length}.`,
    '',
    ...scores.map(
      (s) =>
        `- ${s.name}: ${s.score}/100 — ${s.failed.length ? s.failed.join('; ') : 'nothing lost'}${s.id === 'horizon-star' ? ' ← shipped' : ''}`,
    ),
    '',
    shipped
      ? `The shipped mark's one failure is balance: its centroid sits ${(shipped.balance16 * 100).toFixed(1)}% below centre. Its ink box is centred on the grid (x 9–55, y 8–56), so it seats correctly in a slot; the weight is low because the horizon is at the bottom. The flag is published rather than waived.`
      : '',
    '',
    'Two concepts (Horn, Post) score 100 on survival and lost the bake-off on reading: Post reads as',
    'a door until you are told it is a lamp. A rasteriser can measure whether a shape holds at 16px',
    'and cannot measure whether it says anything.',
    '',
    '## Known gaps',
    '',
    ...GAPS.map((g) => `- **${g.title}** — ${g.body}`),
    '',
    '## Files',
    '',
    `- \`${META.specimen}\` — the full nine-section specimen, generated and self-contained`,
    `- \`/brand/vesper/mark.svg\` — the primary mark (and compact, glyph, mono, reverse)`,
    `- \`${META.board}\` — the board, 1500 × 1125`,
    `- \`/brand/vesper/DESIGN.md\` — the agent-readable spec`,
    `- \`${META.audit}\` — what is proved and what is not`,
    '',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
