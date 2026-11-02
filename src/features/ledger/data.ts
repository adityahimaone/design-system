/**
 * One source for the case's identity. The case library, the landing gallery and
 * the case page all read these fields, so a rename cannot leave a stale card.
 */
export const LEDGER = {
  name: 'Ledger',
  system: 'Tactile Glass & Crisp Grid',
  version: 'v1.1',
  tagline: 'The surface is the only decoration.',
  description:
    'A commerce dashboard built on shadcn/ui, and the design system it comes from. One frosted panel at 65% card, one hairline grid, one indigo signal used only for state, and tabular figures wherever money appears. The shell is a single 56px line, and a WebGL mesh field sits behind the glass — a whisper in light, the surface itself in dark.',
  status: 'Shipped · 2026',
  role: 'Design system · dashboard · shadcn · WebGL',
  material: 'Indigo harbor + glass + one signal',
  href: '/design-system/ledger',
  dashboardHref: '/design-system/ledger/dashboard',
  tags: ['Glass', 'Indigo', 'shadcn', 'WebGL'],
} as const
