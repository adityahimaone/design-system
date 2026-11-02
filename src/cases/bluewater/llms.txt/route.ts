import { NextResponse } from 'next/server'

import { DECISIONS, GAPS, NAV } from '@/features/bluewater/bluewater-data'
import tokens from '@/features/bluewater/tokens.json'

export const dynamic = 'force-static'

export function GET() {
  const body = [
    `# Bluewater Freight`,
    '',
    tokens.meta.oneSentence,
    '',
    `Case: ${tokens.meta.case} · namespace ${tokens.meta.namespace} · ${tokens.meta.track} track`,
    '',
    '## Sections',
    ...NAV.map((s) => `- ${s.label} (#${s.id})`),
    '',
    '## Decisions',
    ...DECISIONS.map((d) => `- **${d.took}** over ${d.over} — ${d.why}`),
    '',
    '## Tokens',
    ...tokens.primitives.map(
      (p) => `- \`${tokens.meta.namespace}${p.name}\`: ${p.value} — ${p.role}`,
    ),
    '',
    '## Gaps',
    ...GAPS.map((g) => `- ${g}`),
    '',
    '## Outputs',
    '- `features/bluewater/tokens.json` — tokens, contrast pairs, DNA, mark spec',
    '- `features/bluewater/bluewater-tokens.css` — `--bw-` declarations and the fog scope',
    '- `public/brand/bluewater/` — mark family, plates, brand board',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
