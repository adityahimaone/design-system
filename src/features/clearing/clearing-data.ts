export type NavItem = { id: string; label: string }

export const NAV: readonly NavItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'material', label: 'Material' },
  { id: 'marks', label: 'Marks' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'applications', label: 'Applications' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'Watching is the work. Recording a sighting should cost nothing — the app is a notebook with a memory, not a feed.',
  },
  {
    beat: 'Enemy',
    line: 'Apps that turn a deer into a data point: streaks, counts, leaderboards, a notification at dusk.',
  },
  {
    beat: 'Mark',
    line: 'An animal standing on a ground line. A sighting, not a sticker — the figure is small because the place is large.',
  },
  {
    beat: 'Material',
    line: 'Painted emerald ground, one pane of frosted glass, cream light, and a single gold-green glint.',
  },
  {
    beat: 'Voice',
    line: 'Plain, specific, unhurried, first person. A person who was there, telling you what happened.',
  },
  {
    beat: 'Proof',
    line: '8.71:1 cream on emerald, 6.27:1 the lowest body pair, a compact mark that reads at 16px, and a wordmark with no live text.',
  },
  {
    beat: 'Gap',
    line: 'No form kit, no print proof of the field card, and six inks that cannot carry a categorical chart.',
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
    title: 'A figure on a line, never in a tile',
    decision:
      'The mark sits on a tapered horizon stroke. No rounded tile, no badge, no glow, no cropped circle.',
    because:
      'A tile frames an object; a line places it somewhere. A sighting has a location, and that is the whole product.',
    notWhen:
      'Square avatars under 16px use the compact drawing — never a crop of the primary.',
    breaksNext:
      'Night mode: the figure and the horizon must invert together, so both are one currentColor path.',
  },
  {
    title: 'One pane per view, copy on a solid plate',
    decision:
      'Glass appears once per view and only over the painting. Sentences sit on a solid plate inside the pane.',
    because:
      'The painting’s meadow is four times lighter than its trees; type directly on that blur fails and looks accidental.',
    notWhen:
      'Tables, long reading, print, or any surface with no image behind it. Those are solid, always.',
    breaksNext:
      'Reduced transparency and no-backdrop-filter browsers: drop the blur, keep the fill.',
  },
  {
    title: 'Emerald is a field, glow is punctuation',
    decision:
      'Emerald fills surfaces; it never sets body text. Glow marks one thing per view. Hart is rare: focus ring and one warning.',
    because:
      'Cream on emerald is 8.71:1 — the only pair that survives a photograph behind it. Moss is 4.42:1 and therefore graphics-only.',
    notWhen:
      'Print field cards: emerald at full coverage is expensive, so the card uses a cream ground and emerald ink.',
    breaksNext:
      'Charts: six brand inks are not a categorical scale, so a four-step tint ramp comes first.',
  },
  {
    title: 'An outlined wordmark with a disc tittle',
    decision:
      'Iowan Old Style outlined from the font file, tracking −14 units, the i-tittle replaced by the light disc.',
    because:
      'A font failure must not change the name, and the disc is the cheapest join between the name and the mark.',
    notWhen:
      'Below 40px the reading face carries the name; the drawn wordmark is never squeezed.',
    breaksNext: 'Localisation: the cut exists only in the Latin wordmark.',
  },
]

export type Ink = {
  token: string
  name: string
  hex: string
  /** Terse line under the chip on the swatch board. */
  short: string
  job: string
  contrast: string
  /** Light ink — needs a bark label on the chip, not a cream one. */
  onDark?: boolean
}

export const PALETTE: readonly Ink[] = [
  {
    token: '--cl-bark',
    name: 'Bark',
    hex: '#0E211C',
    short: 'Text, 14.35:1',
    job: 'Text and ink. The darkest thing on the page.',
    contrast: '14.35:1 on cream',
  },
  {
    token: '--cl-emerald',
    name: 'Emerald',
    hex: '#0F4A3C',
    short: 'Loud field, one per view',
    job: 'The one loud field per view. Primary buttons.',
    contrast: '8.71:1 with cream',
  },
  {
    token: '--cl-moss',
    name: 'Moss',
    hex: '#2F7A5E',
    short: 'Graphic only, not text',
    job: 'Graphics and chart fills only — never text.',
    contrast: '4.42:1 — below body',
  },
  {
    token: '--cl-glow',
    name: 'Glow',
    hex: '#CBDD82',
    short: 'Punctuation, 11.34:1',
    job: 'Punctuation. One glint per view; the night accent.',
    contrast: '11.34:1 with bark',
    onDark: true,
  },
  {
    token: '--cl-cream',
    name: 'Cream',
    hex: '#F3EDDE',
    short: 'Paper, the light',
    job: 'Paper and light. The ground everything sits on.',
    contrast: '—',
    onDark: true,
  },
  {
    token: '--cl-hart',
    name: 'Hart',
    hex: '#A9713F',
    short: 'Rare: focus, one warning',
    job: 'Rare: focus ring, one warning. Text only as #8A5527.',
    contrast: '3.51:1 / 5.27:1',
    onDark: true,
  },
]

export const CONTRAST_PAIRS: readonly {
  pair: string
  ratio: string
  use: string
}[] = [
  {
    pair: 'bark on cream',
    ratio: '14.35:1',
    use: 'Body and display, any size',
  },
  {
    pair: 'cream on emerald',
    ratio: '8.71:1',
    use: 'The one loud field; buttons',
  },
  {
    pair: 'glow on emerald',
    ratio: '6.88:1',
    use: 'Accent text on the loud field',
  },
  { pair: 'bark on glow', ratio: '11.34:1', use: 'Focus chips, night buttons' },
  {
    pair: 'secondary on cream',
    ratio: '6.27:1',
    use: 'Captions, labels, meta',
  },
  {
    pair: 'hart on cream',
    ratio: '3.51:1',
    use: 'Large text and graphics only — never a paragraph',
  },
]

export type CastMark = {
  id: string
  name: string
  job: string
  span: string
  index: string
}

export const CAST: readonly CastMark[] = [
  {
    id: 'dawn',
    name: 'Dawn',
    job: 'Time of day, on an entry.',
    span: 'span4',
    index: '01 · light',
  },
  {
    id: 'trail',
    name: 'Trail',
    job: 'A trace you did not see made.',
    span: 'span3',
    index: '02 · movement',
  },
  {
    id: 'leaf',
    name: 'Leaf',
    job: 'A plant note, beside a species name.',
    span: 'span5',
    index: '03 · species',
  },
  {
    id: 'drop',
    name: 'Drop',
    job: 'Weather, never a mood.',
    span: 'span4',
    index: '04 · weather',
  },
  {
    id: 'ripple',
    name: 'Ripple',
    job: 'A recording, or sound carrying.',
    span: 'span4',
    index: '05 · sound',
  },
]

export type MarkSpec = { key: string; value: string }

export const MARK_SPECS: readonly MarkSpec[] = [
  { key: 'Header', value: '34px mark · 20px wordmark' },
  { key: 'Minimum', value: '24px mark · 110px lockup' },
  { key: 'Compact', value: '16px — a separate drawing' },
  { key: 'Clear space', value: 'x = half the mark height, all four sides' },
  { key: 'Favicon', value: '16 · 32 · 180, from the compact' },
  { key: 'Grid', value: '64 units · ground 51.8–55.4' },
]

export type RejectedMark = { name: string; note: string }

export const REJECTED_MARKS: readonly RejectedMark[] = [
  {
    name: 'Antler arch',
    note: 'A coat hook at 16px, a generic outdoors symbol at 240.',
  },
  {
    name: 'Three deer in line',
    note: 'A diagram of a photograph, and a smudge at 24px.',
  },
  {
    name: 'Hoof print pair',
    note: 'A tracking app; indistinguishable from a stock paw print.',
  },
  {
    name: 'Canopy lens',
    note: 'Says forest, not wildlife. No character, no pause.',
  },
  {
    name: 'Fern spiral',
    note: 'The category’s most obvious cliché; could be skincare.',
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
    family: 'Iowan Old Style',
    size: '40–68px',
    line: '1.05',
    use: 'One per page',
  },
  {
    role: 'h2',
    family: 'Iowan Old Style',
    size: '28–38px',
    line: '1.1',
    use: 'Section heads',
  },
  {
    role: 'h3',
    family: 'Iowan Old Style',
    size: '19px',
    line: '1.3',
    use: 'Card titles',
  },
  {
    role: 'body',
    family: 'Geist',
    size: '17px',
    line: '1.6',
    use: 'Reading, 60–75ch',
  },
  {
    role: 'small',
    family: 'Geist',
    size: '15px',
    line: '1.55',
    use: 'UI copy, card body',
  },
  {
    role: 'caption',
    family: 'Geist',
    size: '13px',
    line: '1.45',
    use: 'Meta, figure captions',
  },
  {
    role: 'label',
    family: 'Geist Mono',
    size: '11px',
    line: '1.2',
    use: 'Mono, 0.16em, uppercase',
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
    evidence: 'Figure and ground line both legible on cream and on stage',
    state: 'pass',
  },
  {
    check: 'compact / 16px',
    result: 'Pass',
    evidence: 'Separate drawing: two legs, two antler beams',
    state: 'pass',
  },
  {
    check: 'wordmark',
    result: 'Pass',
    evidence: 'Outlined from Iowan; no <text> in any logo file',
    state: 'pass',
  },
  {
    check: 'cast',
    result: 'Pass',
    evidence: '5 marks, one cut line 3.2, one job each',
    state: 'pass',
  },
  {
    check: 'contrast',
    result: 'Pass',
    evidence: '8 pairs computed; 6.27:1 lowest body pair',
    state: 'pass',
  },
  {
    check: 'glass fallback',
    result: 'Pass',
    evidence: '@supports + prefers-reduced-transparency',
    state: 'pass',
  },
  {
    check: 'reduced motion',
    result: 'Pass',
    evidence: 'Durations collapse; the still frame is the design',
    state: 'pass',
  },
  {
    check: '390px',
    result: 'Pass',
    evidence: 'Single column, no horizontal scroll',
    state: 'pass',
  },
  {
    check: 'forms',
    result: 'Out of scope',
    evidence: 'Excluded for v1.0 — no field tokens shipped',
    state: 'scope',
  },
  {
    check: 'visual regression',
    result: 'Open',
    evidence: 'No baseline images; manual review only',
    state: 'open',
  },
]

export const GAPS: readonly string[] = [
  'A print proof of the field card: emerald coverage and paper stock are unproven.',
  'No form kit — the error summary, field edges and password states do not exist yet.',
  'Charts: six inks are not a categorical scale; a four-step tint ramp is needed first.',
  'The wordmark’s cut is Latin-only; there is no rule for a second script.',
  'The night surface is authored and reviewed on screen, not diffed against a baseline.',
]

export const GLASS_RECIPE = `/* frosted, not liquid */
.pane {
  background: var(--cl-glass-fill);  /* 55% */
  backdrop-filter: blur(18px) saturate(1.35);
  border: 1px solid var(--cl-glass-edge);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .3);
}
@supports not (backdrop-filter: blur(1px)) {
  .pane { background: var(--cl-surface-raised); }
}`

export const TOKENS_CSS = `/* 1 · primitive */
--cl-bark:    #0E211C;
--cl-emerald: #0F4A3C;
--cl-moss:    #2F7A5E;
--cl-glow:    #CBDD82;
--cl-cream:   #F3EDDE;
--cl-hart:    #A9713F;

/* 2 · semantic */
--cl-surface-page: var(--cl-cream);
--cl-surface-loud: var(--cl-emerald);
--cl-text-primary: var(--cl-bark);
--cl-accent-glint: var(--cl-glow);
--cl-focus-ring:   var(--cl-hart);

/* 3 · component */
--cl-button-bg:  var(--cl-surface-loud);
--cl-button-ink: var(--cl-cream);`

export const TOKENS_JSON = `{
  "name": "Clearing",
  "version": "1.0",
  "track": "drawn",
  "material": "painted glass",
  "mark": {
    "grid": 64,
    "ground": 52,
    "scale": 0.72,
    "antlerCut": 2.7,
    "sizes": { "header": 34, "minimum": 24,
               "compact": 16, "stage": 130 }
  },
  "motion": { "fast": 120, "ui": 200, "slow": 320 }
}`

export const VOICE_SAMPLES: readonly {
  ctx: string
  line: string
  bad?: string
}[] = [
  {
    ctx: 'Headline',
    line: 'Three hinds, eleven seconds of light. That is the whole entry.',
  },
  {
    ctx: 'Error',
    line: 'The photo did not upload. The note is saved — you can add the photo later.',
    bad: 'Oops! Something went wrong.',
  },
  {
    ctx: 'Success',
    line: 'Recorded at 06:40. Weather attached from the nearest station, 2km east.',
  },
]
