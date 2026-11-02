/**
 * Riso Co. — the case file, v4.0.
 *
 * Every number in this file was measured, not chosen: the ratios come from the
 * semantic layer (see CONTRAST_PAIRS), the grid numbers from the mark geometry,
 * the durations from the motion tokens. If a value changes here it must change
 * in `riso-tokens.css` in the same commit.
 */

export type NavItem = { id: string; label: string }

export const NAV: readonly NavItem[] = [
  { id: 'pin', label: 'The pin' },
  { id: 'tear', label: 'The tear' },
  { id: 'marks', label: 'Marks' },
  { id: 'ink', label: 'Ink' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
  { id: 'sheet', label: 'The sheet' },
]

export const META = {
  name: 'Riso Co.',
  caseNumber: 'Case 04',
  version: 'v4.0',
  date: '29 Oct 2026',
  promise: 'One pin holds the sheet. The tear is what the second drum prints.',
  oneSentence:
    'A pinned sheet torn from the pin: the tear is the seam the second drum prints, and nothing else on the page is allowed to be a special effect.',
} as const

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'A print shop is a promise about paper. One pin holds the sheet while the second drum runs; the registration is the craft, not the noise.',
  },
  {
    beat: 'Enemy',
    line: 'The risograph look as a filter — grain overlays, blend modes and drop shadows pretending to be ink. If it would print the same on a screen, it is not a print system.',
  },
  {
    beat: 'Mark',
    line: 'A sheet pinned at the top and torn from the pin. The right flap sits 4,3 out of register because the other drum printed it.',
  },
  {
    beat: 'Material',
    line: 'Uncoated vellum, one fluorescent orange drum, one federal blue drum, a steel pin, and a safelight for the dark surface.',
  },
  {
    beat: 'Voice',
    line: 'Press notes, not marketing: lowercase, specific, with the run number and the stock. Never an exclamation mark.',
  },
  {
    beat: 'Proof',
    line: '15.26:1 carbon on vellum, 5.16:1 on the orange drum, 3.63:1 on blue — which is why blue never carries small type — and a compact that reads at 16px.',
  },
  {
    beat: 'Gap',
    line: 'No halftone engine: the tear is a clip-path, not a generated deckle. The overprint is a path, not a blend, and there is no print proof on real stock.',
  },
]

export type Decision = {
  title: string
  decision: string
  because: string
  notWhen: string
  breaksNext: string
}

export const DECISIONS: readonly Decision[] = [
  {
    title: 'The pin is the only element that crosses the tear',
    decision:
      'Two flaps, one diamond. Nothing else in the mark bridges the seam, and the pin is always the darkest ink on the sheet.',
    because:
      'The pin is the reason the sheet is held at all. Without it the two flaps read as an abstract split; with it they read as one sheet that was pinned and then tore.',
    notWhen:
      'One-ink stamps: the pin becomes a punched hole (fill-rule evenodd) instead of a third colour. At 16px it closes up, so the compact drops it entirely.',
    breaksNext:
      'Screen printing on a dark stock: the pin has to invert to paper, which flips the whole mark and the reverse file has to be re-cut.',
  },
  {
    title: 'Zero radius, on every surface',
    decision:
      'Cards, fields, buttons, chips, stages: no corner is rounded. The only curves in the system are the ones a tear makes.',
    because:
      'A sheet has corners. Rounding them turns a printed sheet into an app card, and the whole identity is a claim about paper.',
    notWhen:
      'Never for the sheet itself. The one exception is a native control the browser draws (checkbox, radio, scrollbar) — do not fight those, restyle the wrapper.',
    breaksNext:
      'Focus rings: a rounded ring on a square control reads as a different system, so the ring is square and 2px, offset 2px.',
  },
  {
    title: 'Two drums, never three',
    decision:
      'Orange and blue are the only chromatic inks. The third colour is overprint, which exists only where the two cross, and carbon carries every word.',
    because:
      'A risograph has two drums. Adding a third accent to fix a contrast problem is how a print system becomes a brand palette.',
    notWhen:
      'Charts and any categorical encoding: two drums cannot carry six series, so a tint ramp has to come first and it does not exist yet.',
    breaksNext:
      'The dark surface: the drums stay the same hex and the paper inverts, because ink does not change under a safelight.',
  },
  {
    title: 'The tear edge is a mask, not an image',
    decision:
      'One clip-path polygon, seven teeth, amplitude tied to the band height. No PNG, no SVG filter, no texture file.',
    because:
      'A bitmap edge cannot scale, cannot recolour and cannot be diffed. The polygon is four numbers and it prints the same at 390 and 1440.',
    notWhen:
      'Print output: a real deckle is torn by hand, and this is a simulation. The print proof has to use a physical tear.',
    breaksNext:
      'Amplitude: if it does not scale with the band the teeth read as a mistake at 390. It is set in `em` of the band, not in px.',
  },
]

export type Ink = {
  token: string
  name: string
  hex: string
  short: string
  job: string
  contrast: string
  onDark?: boolean
}

export const PALETTE: readonly Ink[] = [
  {
    token: '--rs-carbon',
    name: 'Carbon',
    hex: '#1B1712',
    short: '15.26:1 on vellum',
    job: 'Every word, every rule, the pin. The reading ink.',
    contrast: '15.26:1',
  },
  {
    token: '--rs-drum-a',
    name: 'Drum A',
    hex: '#F2542D',
    short: '5.16:1 with carbon',
    job: 'The first pass. Loud fields, poster fills, one per view.',
    contrast: '5.16:1 with carbon',
  },
  {
    token: '--rs-drum-b',
    name: 'Drum B',
    hex: '#1D63FF',
    short: '3.63:1 — large only',
    job: 'The second pass and the misregistered ghost. Never small type.',
    contrast: '3.63:1 with carbon',
  },
  {
    token: '--rs-overprint',
    name: 'Overprint',
    hex: '#2B192E',
    short: 'Where the drums cross',
    job: 'The third colour. Only where both passes land on the same fibre.',
    contrast: '—',
  },
  {
    token: '--rs-paper',
    name: 'Vellum',
    hex: '#F1EDE4',
    short: 'The stock',
    job: 'The ground. 270gsm unbleached, the only sheet.',
    contrast: '—',
    onDark: true,
  },
  {
    token: '--rs-steel',
    name: 'Steel',
    hex: '#A3A9B2',
    short: '2.03:1 — graphics only',
    job: 'The pushpin needle and nothing else. Never a border.',
    contrast: '2.03:1',
  },
]

export const CONTRAST_PAIRS: readonly {
  pair: string
  ratio: string
  use: string
  fail?: boolean
}[] = [
  {
    pair: 'carbon on vellum',
    ratio: '15.26:1',
    use: 'Body and display, any size',
  },
  {
    pair: 'carbon on drum A',
    ratio: '5.16:1',
    use: 'Every word printed on the orange sheet',
  },
  {
    pair: 'carbon on drum B',
    ratio: '3.63:1',
    use: 'Large text only — 24px and up',
  },
  { pair: 'orange as type', ratio: '4.87:1', use: 'Eyebrows, numerals, links' },
  {
    pair: 'blue as type',
    ratio: '8.45:1',
    use: 'Links and the second pass in text',
  },
  {
    pair: 'press note on vellum',
    ratio: '5.19:1',
    use: 'Captions, run numbers, meta',
  },
  {
    pair: 'fluorescent orange as type',
    ratio: '2.96:1',
    use: 'Fills only. Never letters',
    fail: true,
  },
  {
    pair: 'steel on vellum',
    ratio: '2.03:1',
    use: 'The needle. Never a border',
    fail: true,
  },
]

export type MarkSpec = { key: string; value: string }

export const MARK_SPECS: readonly MarkSpec[] = [
  { key: 'Grid', value: '64 units · sheet 8–55' },
  { key: 'Register', value: '4,3 — drum B from drum A' },
  { key: 'Seam', value: '6 points · 5 teeth' },
  { key: 'Pin', value: '11 unit diamond, carbon' },
  { key: 'Minimum', value: '24px mark · 110px lockup' },
  { key: 'Compact', value: '16px — two shapes, no pin' },
  { key: 'Clear space', value: 'x = the pin width, all four sides' },
]

export type RejectedMark = { name: string; note: string }

export const REJECTED_MARKS: readonly RejectedMark[] = [
  {
    name: 'Two offset parallelograms',
    note: 'The v3 mark: a registration diagram, not a sheet. It said "two passes" and nothing about paper.',
  },
  {
    name: 'A pushpin alone',
    note: 'Legible at 64, a thumbtack clip-art at 16. It names the object instead of the act.',
  },
  {
    name: 'Halftone dot field',
    note: 'A gradient with no silhouette. It would need a second mark to be a logo.',
  },
  {
    name: 'Torn strip across the tile',
    note: 'Reads as a page curl and dies at 32px; the tear became decoration rather than structure.',
  },
  {
    name: 'Drum with a printed sheet',
    note: 'A diagram of the machine. Riso is the sheet, not the equipment.',
  },
]

export type TypeRow = {
  role: string
  family: string
  size: string
  line: string
  use: string
}

export const TYPE_SCALE: readonly TypeRow[] = [
  {
    role: 'display',
    family: 'Space Grotesk 700',
    size: '44–80px',
    line: '0.98',
    use: 'One per page',
  },
  {
    role: 'h2',
    family: 'Space Grotesk 700',
    size: '28–40px',
    line: '1.08',
    use: 'Section heads',
  },
  {
    role: 'h3',
    family: 'Space Grotesk 500',
    size: '19px',
    line: '1.3',
    use: 'Card titles',
  },
  {
    role: 'body',
    family: 'Geist 400',
    size: '17px',
    line: '1.6',
    use: 'Reading, 60–75ch',
  },
  {
    role: 'small',
    family: 'Geist 400',
    size: '15px',
    line: '1.55',
    use: 'UI copy, card body',
  },
  {
    role: 'caption',
    family: 'Geist Mono 400',
    size: '13px',
    line: '1.45',
    use: 'Press notes, run numbers',
  },
  {
    role: 'label',
    family: 'Geist Mono 500',
    size: '11px',
    line: '1.2',
    use: 'Mono caps, 0.18em',
  },
]

export type Part = { name: string; job: string }

export const PARTS: readonly Part[] = [
  {
    name: 'Button',
    job: 'Primary is carbon; the second drum is a quiet field, never a second primary.',
  },
  {
    name: 'Field',
    job: 'A cut sheet: 1px perimeter, no radius, label above, note below.',
  },
  {
    name: 'Pin',
    job: 'The only switch. A diamond that fills when pressed, and says so in words.',
  },
  {
    name: 'Sheet',
    job: 'A card with one torn edge — the edge is the only ornament a card gets.',
  },
  {
    name: 'Chip',
    job: 'A run number or a stock. Mono caps, 1px rule, no fill.',
  },
  {
    name: 'Tabs',
    job: 'Two passes: the active tab is printed, the inactive one is the ghost.',
  },
]

export type AuditRow = {
  check: string
  result: string
  evidence: string
  state: 'pass' | 'open' | 'scope'
}

export const AUDIT_ROWS: readonly AuditRow[] = [
  {
    check: 'mark / 32px',
    result: 'Pass',
    evidence: 'Both flaps and the pin legible on vellum and on stage',
    state: 'pass',
  },
  {
    check: 'compact / 16px',
    result: 'Pass',
    evidence: 'Separate drawing: two shapes, wider channel, no pin',
    state: 'pass',
  },
  {
    check: 'wordmark',
    result: 'Pass',
    evidence: 'Outlined from Space Grotesk; no <text> in any logo file',
    state: 'pass',
  },
  {
    check: 'register',
    result: 'Pass',
    evidence: 'Drum B is 4,3 from drum A in the mark and 2.2px in type',
    state: 'pass',
  },
  {
    check: 'contrast',
    result: 'Pass',
    evidence:
      '8 pairs computed; 3.63:1 is the lowest, and it is large-text only',
    state: 'pass',
  },
  {
    check: 'tear mask',
    result: 'Pass',
    evidence: 'clip-path polygon, amplitude in em; survives 390 and 1440',
    state: 'pass',
  },
  {
    check: 'reduced motion',
    result: 'Pass',
    evidence: 'The footer stops tearing; the still frame is the design',
    state: 'pass',
  },
  {
    check: '390px',
    result: 'Pass',
    evidence: 'Single column, no horizontal scroll, no clipped teeth',
    state: 'pass',
  },
  {
    check: 'forms',
    result: 'Partial',
    evidence: 'Field tokens ship; the error summary and file field do not',
    state: 'scope',
  },
  {
    check: 'print proof',
    result: 'Open',
    evidence: 'No pull on real stock; drum coverage is unmeasured',
    state: 'open',
  },
  {
    check: 'visual regression',
    result: 'Open',
    evidence: 'No baseline images; manual review only',
    state: 'open',
  },
]

export const GAPS: readonly string[] = [
  'No print proof: orange coverage on 270gsm vellum is unmeasured, and the tear is a simulation.',
  'No halftone engine. Every dot on this page is a square or a rule.',
  'The error summary, the file field and the password toggle are not built.',
  'Two drums cannot carry a categorical chart; a four-step tint ramp is needed first.',
  'The safelight surface is reviewed on screen, not diffed against a baseline.',
]

export const VOICE_SAMPLES: readonly {
  ctx: string
  line: string
  bad?: string
}[] = [
  {
    ctx: 'Headline',
    line: 'Run 0412. Two drums, forty sheets, one tear.',
  },
  {
    ctx: 'Press note',
    line: 'Orange first, blue second. Carbon last, because it covers.',
  },
  {
    ctx: 'Error',
    line: 'The file is 84MB. This press takes 40MB, so it will not run.',
    bad: 'Oops! Something went wrong.',
  },
]

export const TEAR_RECIPE = `/* the tear edge — one polygon, no image */
.tear {
  --teeth: 7;
  --amp: 6px;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--amp)),
    calc(100% - 100% / var(--teeth) * 1) 100%,
    calc(100% - 100% / var(--teeth) * 2) calc(100% - var(--amp)),
    /* … seven teeth, alternating */
    0 calc(100% - var(--amp))
  );
}`

export const REGISTER_RECIPE = `/* the ghost — a second impression, 2.2px up and right */
.display {
  text-shadow: var(--rs-register) calc(var(--rs-register) * -1) 0
    var(--rs-ghost);
}
/* it is a text-shadow, not a blend mode: it prints, and it survives
   a screenshot, a PDF and a browser with no mix-blend-mode. */`

export const TOKENS_CSS = `/* 1 · primitive */
--rs-paper:    #f1ede4;
--rs-carbon:   #1b1712;
--rs-drum-a:   #f2542d;
--rs-drum-b:   #1d63ff;
--rs-overprint:#2b192e;
--rs-steel:    #a3a9b2;

/* 2 · semantic */
--rs-surface:        var(--rs-paper);
--rs-surface-loud:   var(--rs-drum-a);
--rs-text:           var(--rs-carbon);
--rs-accent:         #c22e08;
--rs-accent-second:  #0e3f8f;
--rs-ghost:          var(--rs-drum-b);
--rs-pin:            var(--rs-carbon);
--rs-focus:          var(--rs-carbon);

/* 3 · component */
--rs-button-bg:  var(--rs-carbon);
--rs-button-ink: var(--rs-paper);
--rs-field-bg:   var(--rs-paper-light);
--rs-field-edge: #8c8274;`

export const TOKENS_JSON = `{
  "name": "Riso Co.",
  "version": "4.0.0",
  "track": "constructed",
  "family": "offset geometric planes",
  "material": "uncoated vellum + two drums",
  "mark": {
    "grid": 64,
    "sheet": [8, 8, 55, 55],
    "register": [4, 3],
    "pin": 11,
    "sizes": { "header": 32, "minimum": 24,
               "compact": 16, "stage": 132 }
  },
  "motion": { "fast": 110, "ui": 180, "slow": 320 }
}`
