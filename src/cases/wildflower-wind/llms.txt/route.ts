import { NextResponse } from 'next/server'

import tokens from '@/features/wildflower-wind/tokens.json'
import { DECISIONS, GAPS, META, PLACEMENT } from '@/features/wildflower-wind/wildflower-wind-data'

export const dynamic = 'force-static'

/**
 * The agent-readable twin of the case page. Every claim here is read from
 * `tokens.json`, so it cannot drift from the sheet the page draws.
 */
export function GET() {
  const body = [
    `# Wildflower Wind — Case ${META.number}`,
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
    META.intro,
    '',
    'A seed house sells a future it cannot photograph, so the identity does not show the flower —',
    'it shows the moment the flower stops holding on. The gap is the brand, and the one rule:',
    'if a layout could be centred without losing anything, it is wrong.',
    '',
    '## The mark is a placement table',
    '',
    '| Petal | Angle | Base r | Length | Width | Bend | Ink |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...PLACEMENT.map((p) => `| ${p.n} | ${p.a} | ${p.r} | ${p.l} | ${p.w} | ${p.b} | ${p.ink} |`),
    '',
    'Four petals hold the calyx at 74°, 72° and 80°; the fifth sits 134° away, small, further out.',
    'The compact at 16px is a different drawing (four placements), never a scaled primary.',
    '',
    '## Decisions',
    '',
    ...DECISIONS.map((d) => `- **${d.title}** — ${d.because} Not when: ${d.notWhen} Breaks next: ${d.breaks}`),
    '',
    '## Primitives',
    '',
    ...tokens.primitives.map((p) => `- \`${tokens.meta.namespace}${p.name}\`: ${p.value} — ${p.role}`),
    '',
    '## Contrast (recomputed from hex)',
    '',
    ...tokens.contrast.map(
      (c) => `- ${c.label}: ${c.ratio.toFixed(2)}:1 — ${c.pass ? 'pass' : 'FAILS, do not use as text'}`,
    ),
    '',
    '## Type',
    '',
    ...tokens.type.map(
      (t) => `- \`${t.name}\`: ${t.value} ${t.weight} · ${t.size}px · lh ${t.leading} · ls ${t.tracking}em — ${t.use}`,
    ),
    '',
    '## Known gaps',
    '',
    ...GAPS.map((g) => `- ${g}`),
    '',
    '## Files',
    '',
    '- `/brand/wildflower-wind/specimen.html` — the full ten-section specimen',
    '- `/brand/wildflower-wind/mark.svg` — the primary mark (and compact, glyph, mono, reverse)',
    '- `/brand/wildflower-wind/wildflower-wind-brandkit.png` — the board, 1500 × 1125',
    '- `/brand/wildflower-wind/wildflower-wind-tokens.json` — the token sheet',
    '- `/brand/wildflower-wind/audit.md` — what is proved and what is not',
    '',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
