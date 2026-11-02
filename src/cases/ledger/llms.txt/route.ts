import { LEDGER } from '@/features/ledger'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const body = `# Ledger — ${LEDGER.system} (${LEDGER.version})

> ${LEDGER.tagline}

Ledger is case 09 in the Sunnyside design-system library: a commerce dashboard
built on shadcn/ui (radix), Tailwind v4 and one WebGL field, documented at
${LEDGER.href}. The live dashboard is ${LEDGER.dashboardHref}.

## 1. The one idea

**The surface is the only decoration.** A dashboard is mostly numbers, so the
system spends its budget on one frosted plane, one hairline grid and one state
colour — then gets out of the way. There is no second card style, no gradient
chrome, and no accent used for decoration.

## 2. Tokens

Three layers, scoped to \`[data-ledger]\` so the portfolio's own shadcn role
tokens are untouched at \`:root\`.

${table(
  ['Layer', 'What it names', 'Example'],
  [
    ['Primitive', 'the material, once', '--lg-harbor-050: oklch(0.970 0.008 271.3)'],
    ['Semantic', 'the job', '--background: var(--lg-harbor-050)'],
    ['Surface', 'the recipe', '.glass-panel { card 65% + 24px blur + 1px hairline }'],
  ],
)}

Radius: \`0.75rem\` for every card and field. Type: Geist Sans, Geist Mono for
labels and axes, tabular figures wherever a number appears.

## 3. Surfaces

- \`.glass-panel\` — \`color-mix(in oklab, var(--card) 65%, transparent)\`,
  \`backdrop-filter: blur(24px) saturate(140%)\`, \`border: 1px solid rgb(0 0 0 / .06)\`
  (\`white / .08\` in dark), \`box-shadow: inset 0 1px 0 0 rgb(255 255 255 / .15)\`.
- \`.glass-float\` — the same glass at 82% popover, plus a 24px drop. Popovers,
  menus, tooltips.
- Fields go **in**, not up: 2% ink fill, 1px border, 2px inner shadow. Focus
  lifts the border to 60% ink and adds a 3px ring at 15% — never colour.

## 4. Measured

${table(
  ['Pair', 'Light', 'Dark'],
  [
    ['foreground on canvas', '17.29:1', '17.26:1'],
    ['foreground on glass', '18.30:1', '16.69:1'],
    ['muted on canvas', '4.93:1', '8.71:1'],
    ['muted on glass', '5.22:1', '8.42:1'],
    ['signal-ink on its wash', '10.56:1', '7.01:1'],
    ['primary on card', '10.44:1', '5.70:1'],
  ],
)}

Computed OKLCh → linear sRGB → WCAG against the composited surface, not a
nominal white. Horizontal overflow measured 0 at 1440 / 1024 / 390.

One pair fails on purpose: \`chart-4\` #b9c8ee on glass measures 1.93:1. It is a
fill, not ink — only legible as the fourth step of an ordered ramp.

## 5. The material

Harbor water, not zinc. Every neutral carries chroma toward hue 267 at the
lightness a zinc step would have had, so the paper reads cool rather than grey.
One signal hue, harbor indigo \`#19398d\`, does three jobs and no others: it fills
the primary action, it marks state, and it orders the charts. A second hue
appears once, as the remainder slice of a donut — a remainder is not a category.

## 6. Known gaps

1. Contrast against the moving field is not measured; no body text sits on it.
2. No drawn wordmark — the name is set in Geist, only the mark is fixed.
3. The preview plate on the case page is a static capture and goes stale when
   the dashboard changes.
4. Mobile tables scroll inside their own container; the document does not.

## 7. Files

- \`features/ledger/ledger-tokens.css\` — the three layers, scoped.
- \`features/ledger/tokens.json\` — the same values, plus the hex each one renders.
- \`features/ledger/palette.ts\` — what the case page reads; a missing token throws.
- \`scripts/check-palette.mjs\` — proves css, tokens and page agree.
- \`features/ledger/ui/*\` — shadcn primitives, restyled for this system.
- \`features/ledger/dashboard/*\` — the dashboard; charts are hand-drawn SVG.
- \`features/ledger/case/ledger-case.tsx\` — the case page.
- \`app/design-system/ledger/page.tsx\` — the route.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
