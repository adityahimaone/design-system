/**
 * Vesper — the page's content, kept out of the page.
 *
 * Ported from the generated proof page (`design-system/vesper/index.html` in the
 * design-system repo, built by `vesper/scripts/build-page.mjs`). The copy here is
 * the copy there; what changed is that a demo is now a `kind` the page switches
 * on instead of a string of HTML, so nothing is injected with
 * `dangerouslySetInnerHTML`.
 *
 * Numbers are not written down twice: contrast pairs, primitives and the type
 * scale are read from `tokens.json`, and the bake-off scores from `scores.json`.
 */

export const META = {
  name: 'Vesper',
  number: '14',
  version: '1.0.0',
  href: '/design-system/vesper',
  specimen: '/brand/vesper/specimen.html',
  audit: '/brand/vesper/audit.md',
  board: '/brand/vesper/vesper-brandkit.png',
  boardAlt:
    'The Vesper brand board: the four-point star resting on a horizon bar, the cobalt and cream palette, the type specimens and six companion marks.',
  title: 'Vesper — a two-ink design system',
  tagline: 'Two inks. One horizon.',
  essence: 'Two inks, one horizon, and the star that stayed.',
  promise:
    'Everything made with this looks printed at night, not rendered in it.',
  description:
    'Vesper is a two-ink print system for the evening: cobalt and cream, a four-point star resting on the horizon, a 64-unit grid, and a mark that is never redrawn by a theme. Fourteen contrast pairs recomputed from hex, with the three that fail published instead of fixed.',
  lede: 'Vesper is a design system for things used after dark — on-call consoles, ledgers, documentation nobody reads at noon. It prints in cobalt and cream, puts a star on the horizon, and refuses every glow the last five years taught us to add.',
} as const

export const NAV = [
  { href: '#premise', label: 'Idea' },
  { href: '#star', label: 'Mark' },
  { href: '#ink', label: 'Colour' },
  { href: '#surfaces', label: 'Surfaces' },
  { href: '#voice', label: 'Type' },
  { href: '#kit', label: 'Kit' },
  { href: '#sheet', label: 'Tokens' },
] as const

/** The bench under the hero: five numbers, and one of them is zero on purpose. */
export const STATS = [
  { figure: '2', label: 'inks' },
  { figure: '64', label: 'unit grid' },
  { figure: '14', label: 'contrast pairs' },
  { figure: '6', label: 'cast marks' },
  { figure: '0', label: 'gradients' },
] as const

export const PREMISE = [
  {
    term: 'Belief',
    body: 'Interface light should be printed, not emitted. If a surface cannot be reproduced on uncoated stock with two passes, it is decoration.',
  },
  {
    term: 'Enemy',
    body: 'The AI dashboard: a frosted pane floating over a violet gradient, every edge lit, no horizon anywhere. Expensive-looking, and it never says where you are.',
  },
  {
    term: 'Material',
    body: 'Cobalt and cream on uncoated stock, with a pale blue second impression that only appears where the press slipped.',
  },
  {
    term: 'Reject it when',
    body: 'Anyone can say “it looks like every other AI product and I cannot tell which page I am on.” That sentence is the whole test.',
  },
] as const

export type Decision = {
  decision: string
  because: string
  notWhen: string
  breaks: string
}

export const DECISIONS: readonly Decision[] = [
  {
    decision: 'Two flat inks. No gradient, no glow.',
    because:
      'A gradient is a photograph of light. A second flat ink is a print of it — and it survives a photocopy, a screenshot and a cheap projector.',
    notWhen: 'A photograph is the subject, not the ground.',
    breaks:
      'Someone adds a radial gradient to a hero “for depth”. Depth is not a brand.',
  },
  {
    decision: 'The horizon is a filled bar, never a stroke.',
    because:
      'A 1px stroke disappears at 16px and at eight metres. A 4-unit bar holds its weight at both, and it is what the mark stands on.',
    notWhen:
      'The rule belongs to a document — then it is a hairline, not the horizon.',
    breaks: 'A border creeps onto the mark, and the bar becomes a box.',
  },
  {
    decision: 'The star is never redrawn, only re-inked.',
    because:
      'The geometry is fixed at 64 units. A theme flip swaps which of the two files is used — ink or cream — and never the drawing, which is why the reverse ships as a separate file.',
    notWhen:
      'The mark sits on a photograph: use mark-reverse at full opacity, not a blend mode.',
    breaks:
      '`filter: invert()` on a logo — it inverts the anti-aliasing too — or a “responsive” mark that redraws itself.',
  },
  {
    decision: 'Square plates. One pill, and only for navigation.',
    because:
      'A printed plate has corners. The pill is the one surface that is not printed — it floats, so it curves.',
    notWhen: 'A touch target falls under 44px, where a square reads as a miss.',
    breaks:
      'Every card rounded to 12px “to feel modern”, and the pill stops meaning anything.',
  },
]

export type SurfaceKind =
  | 'stipple'
  | 'dither'
  | 'ghost'
  | 'glass'
  | 'ledger'
  | 'tear'

export type Surface = {
  id: SurfaceKind
  title: string
  verdict: string
  body: string
  rejected?: boolean
}

export const SURFACES: readonly Surface[] = [
  {
    id: 'stipple',
    title: 'Stipple field',
    verdict: 'Shipped — the hero',
    body: '340 streamlines leave one point above the lamp, each curving the same way, drawn as 60,000 cream ticks at 0.6–1.4px. Density falls with radius, so the light has a direction instead of a vignette. Generated as a raster: the same texture in SVG would be 60,000 elements.',
  },
  {
    id: 'dither',
    title: 'Ordered dither',
    verdict: 'Shipped — section dividers',
    body: 'A 4 × 4 Bayer matrix over a cobalt-to-cream ramp. Where the system needs a fade, it prints one: 16 thresholds, two inks, no blur. It reads as a gradient at arm’s length and as dots at 30cm, which is the point.',
  },
  {
    id: 'ghost',
    title: 'Register ghost',
    verdict: 'Shipped — display type only',
    body: 'A 0.055em second impression of display type in the cream ink, as a text-shadow. It is the misregistration of a two-pass press, kept to display sizes: at 18px it reads as a mistake, at 66px as a decision.',
  },
  {
    id: 'glass',
    title: 'Frosted pane',
    verdict: 'Rejected',
    body: 'Tried first, because the reference does it well: a 14px backdrop blur over the field with a 1px cream rim. On a stipple it turns 60,000 marks into a smudge — the texture the whole system is built on is exactly what a blur destroys. It is shown here so nobody re-proposes it.',
    rejected: true,
  },
  {
    id: 'ledger',
    title: 'Ruled ledger',
    verdict: 'Shipped — the token sheet',
    body: 'A 1px rule every 32px in `line-subtle`, with the cream wash laid over it. Every table in the system sits on this: the rule is the plate, the row is the object, and the outer padding is removed rather than the inner.',
  },
  {
    id: 'tear',
    title: 'Cut edge',
    verdict: 'Rejected',
    body: 'A clip-path with 2–4% amplitude teeth. It reads as paper, but this system is printed, not torn: every edge in the artwork is a clean cut, and a torn edge would be a second metaphor competing with the horizon.',
    rejected: true,
  },
]

export const SPECIMENS = {
  display: ['Evening', 'arrives early', 'out here.'],
  reading: [
    'The lamp is not the point. The point is that you can see four feet of the path in front of you, and that the next four feet will be lit by the time you get there. A design system that promises more than that is selling a spotlight.',
    'So the type is set for reading at night: 18px, 1.62 leading, and a measure that stops at 66 characters — because a line that runs to 90 is a line you re-read twice.',
  ],
  label:
    'Every label sits above the thing it names, never beside it. The tracking is 0.16em because at 11.5px a 0.08em label reads as a mistake in a screenshot, and this system gets screenshotted into decks all day.',
} as const

/** The four figures the type section quotes, and the four rules the kit draws. */
export const FIGURES = [
  { pair: 'Cobalt on chalk', ratio: '8.05' },
  { pair: 'Lampblack on chalk', ratio: '15.93' },
  { pair: 'Dusk on night', ratio: '8.88' },
  { pair: 'Stock on chalk', ratio: '1.32' },
] as const

export const KIT_ROWS = [
  { label: 'Star arm, horizontal', value: '46', unit: 'units' },
  { label: 'Star arm, vertical', value: '40', unit: 'units' },
  { label: 'Horizon bar', value: '44', unit: 'units' },
  { label: 'Compact bar', value: '40', unit: 'units' },
  { label: 'Clear space', value: '4', unit: 'units' },
  { label: 'Lockup gap', value: '18', unit: 'units' },
] as const

export type CastId = 'moon' | 'lamp' | 'horizon' | 'figure' | 'ray' | 'grain'

export const CAST: readonly { id: CastId; name: string; use: string }[] = [
  {
    id: 'moon',
    name: 'The moon, off-centre',
    use: 'Editorial openers · never the logo',
  },
  { id: 'lamp', name: 'The object itself', use: 'Empty states · 48px and up' },
  {
    id: 'horizon',
    name: 'The line, and what sits on it',
    use: 'Section openers · diagrams',
  },
  {
    id: 'figure',
    name: 'Someone already out there',
    use: 'Onboarding · presence',
  },
  { id: 'ray', name: 'Light, before the object', use: 'Loading · 32px and up' },
  {
    id: 'grain',
    name: 'The stipple, as a unit',
    use: 'Pattern fills · never at 16px',
  },
]

export type LedgerRow = {
  check: string
  result: string
  status: 'pass' | 'not verified' | 'not built' | 'partial' | 'not run'
}

export const GAPS = [
  {
    title: 'Known gap · the field is a raster',
    body: 'The stipple is a 1600 × 900 PNG, 883 KB. It is generated, so it can be regenerated at any size, but it will not scale to a 5K hero without a second render.',
  },
  {
    title: 'Known gap · no dark field',
    body: 'The night scope flips the page, but the field asset stays cobalt. A true night field would need a second render with the inks swapped, and that has not been done.',
  },
  {
    title: 'Known gap · one weight of display',
    body: 'Fraunces is loaded as a variable font from 300 to 700, but the specimens only use 300 and 400. The heavier end is untested at display size.',
  },
  {
    title: 'Known gap · cast is unlicensed for product',
    body: 'The six companion marks are drawn for this system and free to use inside it. They have not been checked against existing trademarks.',
  },
  {
    title: 'Known gap · the scorer cannot see meaning',
    body: 'It measures whether a shape survives 16px, not whether it says lamp. Horn and Post top the table on survival and lost the bake-off on reading. That judgement is not in the table and is not pretended to be.',
  },
  {
    title: 'Known gap · one flag left standing',
    body: "The shipped mark's mass sits 8.4% below centre. Its ink box is centred on the grid (x 9–55, y 8–56), so it seats correctly in a slot, and the weight is low because the horizon is at the bottom — but the flag is published rather than waived.",
  },
] as const

export const BAKE_OFF = {
  heading: 'Eleven concepts, scored.',
  intro:
    'Each concept was rasterised at 128, 40 and 16 in a browser and measured: ink coverage at 16px, how many separate pieces survive there, how much of its ink it keeps between 40 and 16, whether parts merge, centroid offset, grid use, and overlap with every other concept. Eight pass-or-fail checks, no weights.',
  after:
    'two concepts survive downscaling better and lost anyway, because a scorer can measure whether a shape holds at 16px and cannot measure whether it says',
  afterEm: 'lamp',
  note: 'rendered in Chrome, measured on the pixel grid, no model involved',
} as const
