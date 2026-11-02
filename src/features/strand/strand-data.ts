export type NavItem = { id: string; label: string }

/**
 * Eleven sections, and every id here is rendered. `glass`, `horizon` and
 * `palette` are the ids that belong to this system alone; a neighbouring case
 * cannot borrow them without changing what its page argues.
 */
export const NAV: readonly NavItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'glass', label: 'Glass' },
  { id: 'marks', label: 'Marks' },
  { id: 'horizon', label: 'Horizon' },
  { id: 'palette', label: 'Palette' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
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
    title: 'The pane is the surface, the plate is the page',
    decision:
      'Chrome, containers and controls are panes of sea-glass. Any paragraph longer than two lines sits on a solid plate inside that pane.',
    because:
      'Glass is a material, not a texture. Blurred ground behind body copy makes contrast a function of the photograph underneath it — measured, not assumed, and never stable.',
    notWhen:
      'A caption, a label or a single line may sit directly on the pane. A paragraph may not.',
    breaksNext:
      'If the blur is unsupported the pane falls back to a solid fill of the same tint, so the layout and the contrast never change.',
  },
  {
    title: 'One signal, at two percent',
    decision:
      'Sun (#A85A22) is the only saturated colour: primary action, focus ring, the upper plane of the mark. It stays under 2% of the viewport.',
    because:
      'A dune at low light has one warm note in a field of grey-blue. A second accent would make the page a dashboard and the photograph a decoration.',
    notWhen:
      'Tags use the sun wash (#F6E6D8). The wash is a tint of the signal, never a second colour.',
    breaksNext:
      'Night raises the signal to #E9A469 and keeps the share identical; only lightness moves.',
  },
  {
    title: 'Two planes and a strand that never closes',
    decision:
      'The mark is two solid planes with a 6-unit channel between them. The gap is the identity; it is not a stroke, not a shadow and not a divider.',
    because:
      'Strand means the shore between the tide marks. Drawing the gap rather than the objects is the only version of this idea that survives at 16px.',
    notWhen:
      'The compact drawing widens the channel to 7 units and drops the fine alignment. It never closes the gap to gain weight.',
    breaksNext:
      'Monochrome reproduction keeps both planes at one ink; the channel still reads because it is negative space.',
  },
  {
    title: 'The coast appears twice',
    decision:
      'The photograph enters at the entrance (hero, framed) and at the departure (footer, full-bleed). Nowhere else.',
    because:
      'A place repeated through a page becomes wallpaper. Two appearances make an arrival and a leaving; a third makes a background.',
    notWhen:
      'The glass demo may sit on the same vista because it is demonstrating the material, not decorating a section.',
    breaksNext:
      'The footer image is a CSS background, so a failed request leaves the dune ground and the pane — not a gradient pretending to be a photograph.',
  },
]

/** Rendered verbatim in the recipe block and copied to the clipboard. */
export const GLASS_RECIPE = `/* the pane — one effect, measured once */
.pane {
  border-radius: 22px;
  border: 1px solid var(--st-glass-edge);
  background: var(--st-glass-fill);      /* 158deg white gradient */
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
  backdrop-filter: blur(24px) saturate(1.7);
  box-shadow:
    inset 0 1px 0 var(--st-glass-sheen), /* the specular top edge */
    0 28px 64px -34px rgb(19 35 42 / 0.45);
}

/* the plate — where a paragraph is allowed to live */
.plate {
  background: var(--st-plate);
  border-radius: 10px;
  color: var(--st-fg);
}`

export const GLASS_RULES = [
  {
    title: 'One pane per view',
    body: 'A pane is a container, not a decoration. Two panes stacked inside each other double the blur and halve the legibility.',
  },
  {
    title: 'The edge is brighter than the ground',
    body: 'A 1px border at 78% white, plus a 1px inset highlight. The edge is light catching a cut edge — never a grey outline.',
  },
  {
    title: 'The shadow is long and low',
    body: 'One shadow, 64px blur at −34px spread, 45% ink. It grounds the pane; it never haloes it.',
  },
  {
    title: 'No motion inside the material',
    body: 'The pane does not drift, parallax or shimmer. Hover raises the sheen by 6% over 260ms and stops.',
  },
]

export type MarkSpec = { label: string; value: string }

export const MARK_SPECS: readonly MarkSpec[] = [
  { label: 'Bounding box', value: '52 × 46 · 64 grid' },
  { label: 'Solid primitives', value: '2 — sun plane, marine plane' },
  { label: 'Strand', value: '6 units · 9.4% of the grid' },
  { label: 'Shear', value: '6 units over 18 · 18.4°' },
  { label: 'Overhang', value: '8 units, upper plane right' },
  { label: 'Compact', value: 'Separate drawing · 7-unit strand' },
  { label: 'Craft gate', value: 'PASS · zero circles, fill-only' },
]

export const MARK_GATE = [
  {
    rule: 'Zero circles / zero Venn',
    pass: true,
    note: 'Two sheared quadrilaterals; no arc appears anywhere in the family',
  },
  {
    rule: 'Fill-only, no stroke',
    pass: true,
    note: 'Two solid fills. The strand is a gap, not a 1px line that dies at 16px',
  },
  {
    rule: '2–4 primitives',
    pass: true,
    note: 'Exactly two, and the compact uses the same two',
  },
  {
    rule: 'One accent, structural',
    pass: true,
    note: 'Sun is the upper plane, not a dot resting on the mark. Remove it and half the landscape is gone',
  },
  {
    rule: '16px compact',
    pass: true,
    note: 'A separate drawing with a 7-unit channel; the fine 8-unit overhang is dropped on purpose',
  },
  {
    rule: 'Monochrome-first',
    pass: true,
    note: 'Both planes at one ink still read as two masses with a channel',
  },
]

/** The cast: four readings of the same two planes, on a 24 grid. */
export type CastMark = { id: string; name: string; job: string; paths: readonly string[] }

export const CAST: readonly CastMark[] = [
  {
    id: 'slack',
    name: 'Slack',
    job: 'Water level, nothing moving',
    paths: ['M4 6h12l3 3v2H4z', 'M4 14h12l3 3v2H4z'],
  },
  {
    id: 'rising',
    name: 'Rising',
    job: 'Incoming tide, one plane lifting',
    paths: ['M9 5h7l3 3v2H9z', 'M4 14h16v5H4z'],
  },
  {
    id: 'ebb',
    name: 'Ebb',
    job: 'Outgoing tide, the lower plane leads',
    paths: ['M4 6h16v5H4z', 'M4 14h10l3 3v2H4z'],
  },
  {
    id: 'low',
    name: 'Low',
    job: 'Low water, a single plane and a mark',
    paths: ['M4 14h16v5H4z', 'M4 6h5v5H4z'],
  },
]

export type HorizonRule = { rule: string; decision: string; because: string }

export const HORIZON_RULES: readonly HorizonRule[] = [
  {
    rule: 'Two placements, never three',
    decision:
      'Framed at the entrance, full-bleed at the departure. The image appears nowhere in between except inside the glass demo, where it is the material under test.',
    because:
      'A field photograph repeated through a page stops being a place and becomes wallpaper.',
  },
  {
    rule: 'No type on the photograph',
    decision:
      'Every readable word in the footer sits in a pane. The image carries no headline, no logotype, no caption burned into the pixels.',
    because:
      'Contrast over an image is a guess that changes with every crop. Contrast on a pane is 15.7:1 and does not move.',
  },
  {
    rule: 'Full-bleed means full-bleed',
    decision:
      'The footer background spans the viewport edge to edge, under the scrollbar gutter, with no max-width wrapper and no rounded corners.',
    because:
      'A photograph inset inside a 1200px shell reads as a card. The coast is the one thing on this page that is allowed to leave the grid.',
  },
  {
    rule: 'The fallback is the ground',
    decision:
      'If the asset fails, the footer keeps its dune ground, its pane and its text. Nothing is lost but the photograph.',
    because:
      'A CSS gradient pretending to be a photograph is the most obvious tell that a system was never tested offline.',
  },
]

export const HORIZON_SPEC = [
  { key: 'Hero asset', value: 'strand-vista.webp · 1672 × 941 · framed 16:10' },
  { key: 'Footer asset', value: 'dune-quiet-divider.webp · 1916 × 821 · 2.33:1' },
  { key: 'Footer frame', value: '100vw · min-height 620px · object-fit cover, 50% 58%' },
  { key: 'Overlay', value: 'Pane, max 560px, left-aligned at the shell gutter' },
  { key: 'Scrim', value: 'Linear 180deg, transparent 40% → 55% night at the base' },
  { key: 'Motion', value: 'Static. No parallax, no zoom on scroll, in either surface.' },
]

export type Swatch = {
  name: string
  value: string
  token: string
  role: string
  ink: string
}

export const PALETTE: readonly Swatch[] = [
  {
    name: 'Dune',
    value: '#F3F0E8',
    token: '--st-dune',
    role: 'The ground. Dry sand at four in the afternoon.',
    ink: '#13232A',
  },
  {
    name: 'Quartz',
    value: '#FFFFFF',
    token: '--st-quartz',
    role: 'The pane fill and the reading plate inside it.',
    ink: '#13232A',
  },
  {
    name: 'Marine',
    value: '#13232A',
    token: '--st-marine',
    role: 'Ink. Deep water at the horizon, never pure black.',
    ink: '#EFEDE6',
  },
  {
    name: 'Haze',
    value: '#57696E',
    token: '--st-haze',
    role: 'Secondary text, labels, the rail. 5.75:1 on quartz.',
    ink: '#EFEDE6',
  },
  {
    name: 'Sun',
    value: '#A85A22',
    token: '--st-sun',
    role: 'The one signal. Action, focus, the mark’s upper plane.',
    ink: '#FFFFFF',
  },
  {
    name: 'Depth',
    value: '#2F5F6B',
    token: '--st-depth',
    role: 'The rare cool ink, used once per section at most.',
    ink: '#FFFFFF',
  },
]

export const BUDGET_RULES = [
  'The signal is a verb: it appears where something happens, not where something is.',
  'Above 2% of the viewport the page stops being quiet. The budget is the quietness.',
  'Depth never touches the signal. Two accents is two brands.',
  'Night raises the signal’s lightness and keeps every share identical.',
]

export const TYPE_SCALE = [
  { name: 'Display', token: '--st-scale-display', size: 'clamp(2.5rem, 6vw, 4.4rem)', use: 'Hero, one per page' },
  { name: 'H2', token: '--st-scale-h2', size: 'clamp(1.55rem, 2.8vw, 2.3rem)', use: 'Section titles' },
  { name: 'H3', token: '--st-scale-h3', size: 'clamp(1.15rem, 1.6vw, 1.35rem)', use: 'Block and card titles' },
  { name: 'Body', token: '--st-scale-body', size: '1.0625rem / 1.62', use: 'Reading, capped at 66ch' },
  { name: 'Caption', token: '--st-scale-caption', size: '0.875rem / 1.5', use: 'Captions, rail, table cells' },
  { name: 'Label', token: '--st-scale-label', size: '0.6875rem · 0.14em', use: 'Mono caps on eyebrows and specs' },
]

export const TYPE_GATE = [
  { rule: 'Three families, three jobs', pass: true, note: 'Instrument Sans (display), Geist (reading), Geist Mono (labels)' },
  { rule: 'Display leading', pass: true, note: '0.98 unitless on the hero, 1.12 on section titles' },
  { rule: 'Reading measure', pass: true, note: 'Body capped at 66ch; captions at 46ch' },
  { rule: 'Weight below 18px', pass: true, note: 'Never below 400; labels are 500 mono, not 300' },
  { rule: 'Numerals', pass: true, note: 'tabular-nums on every ratio, token count and size' },
  { rule: 'Punctuation', pass: true, note: 'Typographic quotes and apostrophes throughout the copy' },
]

export type MotionRule = { rule: string; value: string; note: string }

export const MOTION_RULES: readonly MotionRule[] = [
  {
    rule: 'Duration ladder',
    value: '160 / 260 / 420 ms',
    note: 'Fast for colour, base for the sheen and the theme cross-fade, slow for a sheet. Nothing above 420.',
  },
  {
    rule: 'Properties',
    value: 'colour, border, opacity, box-shadow',
    note: 'No transform on hover. A control that moves the layout makes a still page feel unstable.',
  },
  {
    rule: 'Easing',
    value: 'cubic-bezier(0.22, 1, 0.36, 1)',
    note: 'One curve out, one in-out. No bounce, no spring, no overshoot.',
  },
  {
    rule: 'Reduced motion',
    value: 'transition: none',
    note: 'Honoured at the root. The vista is static in both surfaces, so nothing is lost.',
  },
]

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'A quiet interface is a material decision, not a mood. You choose what the surface is made of, and then you stop decorating it.',
  },
  {
    beat: 'Enemy',
    line: 'Glass as ornament: a frosted pill on every card, a gradient behind every heading, an interface that refracts nothing and hides everything.',
  },
  {
    beat: 'Mark',
    line: 'Two sheared planes with a six-unit channel between them. The upper plane is sand, the lower is sea, and the channel is the strand — the only part of the mark that is not drawn.',
  },
  {
    beat: 'Material',
    line: 'One pane of sea-glass over dune light: a 158° white gradient, 24px of blur, a specular top edge and one long shadow. Paragraphs sit on solid plates inside it.',
  },
  {
    beat: 'Voice',
    line: 'Measured and unhurried. State the reading, then stop. No weather metaphors in product copy.',
  },
  {
    beat: 'Proof',
    line: '15.7:1 body contrast on the pane composite, 127 token declarations, eleven native controls, and a mark that passes the craft gate with two primitives and no stroke.',
  },
  {
    beat: 'Gap',
    line: 'The coast is two still photographs, not a live tide feed. The blur is composited by the browser, so the measured ratios assume the pane at its declared opacity.',
  },
]

export type VoiceSample = { ctx: string; good: string; bad: string }

export const VOICE_SAMPLES: readonly VoiceSample[] = [
  {
    ctx: 'Empty state',
    good: 'No readings yet. The next tide is logged at 06:12.',
    bad: 'Oops! Looks like there’s nothing here yet — hang tight!',
  },
  {
    ctx: 'Primary action',
    good: 'Save reading',
    bad: 'Let’s save this!',
  },
  {
    ctx: 'Error',
    good: 'That height is above the 4.2 m mark. Use a value between 0 and 4.2.',
    bad: 'Invalid input.',
  },
  {
    ctx: 'Confirmation',
    good: 'Reading saved to the 29 October log.',
    bad: 'Success! 🎉',
  },
]

export type AuditRow = { check: string; result: string; state: 'pass' | 'open' | 'note'; evidence: string }

export const AUDIT_ROWS: readonly AuditRow[] = [
  { check: 'Contrast', result: '15.7:1 body', state: 'pass', evidence: 'Marine on the pane composite, measured in tokens.json' },
  { check: 'Contrast, night', result: '12.6:1 body', state: 'pass', evidence: 'Night ink on the night pane composite' },
  { check: 'Signal as text', result: '6.8:1', state: 'pass', evidence: 'Sun ink on quartz — the only sun used for a label' },
  { check: 'Mark gate', result: 'PASS', state: 'pass', evidence: 'Zero circles, fill-only, two primitives, one accent' },
  { check: 'Mark at 16px', result: 'PASS', state: 'pass', evidence: 'Separate compact drawing, 7-unit channel' },
  { check: 'Typography', result: 'PASS', state: 'pass', evidence: 'Six type checks, one measure, no weight below 400' },
  { check: 'Focus', result: 'PASS', state: 'pass', evidence: 'Gap ring on every control; native outline removed only where replaced' },
  { check: 'Reduced motion', result: 'PASS', state: 'pass', evidence: 'Root-level duration override, no transform animations' },
  { check: 'Blur fallback', result: 'PASS', state: 'pass', evidence: '@supports not → solid tint of the same value' },
  { check: 'Footer full-bleed', result: 'PASS', state: 'pass', evidence: '100vw background, no max-width ancestor, no radius' },
  { check: 'Detach vs Cove', result: '81/100', state: 'pass', evidence: 'Hue 154° apart; Instrument Sans against Instrument Serif; 4 of 11 ids absent' },
  { check: 'Detach vs Hachure', result: '73/100', state: 'pass', evidence: 'Hue 55° apart; glass against hachure; Hachure declares no DNA keys' },
  { check: 'Detach vs Vitrine', result: '75/100', state: 'pass', evidence: 'Both declare glass; separated by hue 59°, radius, labels and section order' },
  { check: 'Detach vs Riso', result: '69/100', state: 'open', evidence: 'Accent hues 17° apart and Riso’s chroma is nearly double — below the 70 floor' },
  { check: 'Detach vs Clearing', result: '59/100', state: 'open', evidence: 'Sun sits 9° from hart and night-sun on the same hue — the one real failure' },
  { check: 'Dark pane measured', result: 'Assumed', state: 'open', evidence: 'Ratios use the declared 10% white composite, not a live sample' },
  { check: 'Tide data', result: 'Not built', state: 'open', evidence: 'No feed; the readings in the copy are static examples' },
]

export const GAPS = [
  'Detach is the one gate this system does not clear. The floor is 70 and the worst pair is 59 against Clearing, because the sun (52°) sits nine degrees from Clearing’s hart (61°) and the night sun sits on the same hue. Moving the signal to ~35° would pass the threshold by nine degrees while landing within 27° of the same accent, so the number would improve and the resemblance would not. The accent is shared and the surfaces are not; that is the honest trade, and it is reported rather than rounded up.',
  'The footer photograph is a 1916 × 821 WebP, not a responsive art-directed set. On a 4K display it is upscaled by roughly 1.4×.',
  'The pane composite ratios are computed from the declared opacity and gradient midpoint. A browser that renders the gradient differently will land within a few tenths, not exactly on 15.7:1.',
  'Instrument Sans is served through next/font, so the first paint of a heading can swap. The wordmark is outlined and cannot swap.',
  'The budget figure (2%) is measured by hand on a 1440 × 900 viewport at the top of the page, not computed at runtime.',
  'The compact mark is a separate drawing, not a downscale. Between 20px and 28px the two drawings are not pixel-identical, and the crossover is chosen by the component, not by the reader.',
  'Blur is expensive on low-end mobile GPUs. The pane uses 24px, which is under the 30px threshold where frame time visibly degrades on a 2020-era device, but it has not been profiled on real hardware here.',
]

export const DETACH_SCORES = [
  { ref: 'Cove', score: 81, finding: 'Hue 154° apart; Instrument Sans against Instrument Serif; four section ids do not exist in Cove.' },
  { ref: 'Vitrine', score: 75, finding: 'Both declare glass. Separated by hue 59°, radius, label system and section order — not by material.' },
  { ref: 'Hachure', score: 73, finding: 'Hue 55° apart; glass against hachure. Hachure declares no DNA keys, so material and structure score neutral.' },
  { ref: 'Riso', score: 69, finding: 'Below the floor. Accent hues are 17° apart and Riso’s chroma is nearly double; separated by geometry and copy, not by hue.' },
  { ref: 'Clearing', score: 59, finding: 'The weakest pair. Sun is 9° from hart and night-sun sits on the same hue; every other axis differs.' },
]

export const DETACH_FLOOR = 70

export const OUTPUT_CONTRACT = [
  { path: 'public/brand/strand/mark.svg', role: 'Primary two-tone mark on the 64 grid' },
  { path: 'public/brand/strand/mark-compact.svg', role: 'Compact drawing for 16–24px' },
  { path: 'public/brand/strand/mark-reverse.svg', role: 'Reverse pair for the night surface' },
  { path: 'public/brand/strand/mark-mono.svg', role: 'One-ink reproduction' },
  { path: 'public/brand/strand/wordmark.svg', role: 'Outlined lowercase wordmark' },
  { path: 'public/brand/strand/lockup.svg', role: 'Horizontal lockup' },
  { path: 'public/brand/strand/lockup-stacked.svg', role: 'Stacked lockup' },
  { path: 'public/brand/strand/icon.svg', role: 'App tile: mark on dune ground' },
  { path: 'public/brand/strand/favicon.ico', role: '16 / 32 / 48 multi-resolution favicon' },
  { path: 'public/brand/strand/strand-tokens.css', role: '127 token declarations' },
  { path: 'public/brand/strand/strand-tokens.json', role: 'The same source, machine-readable' },
  { path: 'public/brand/strand/dune-quiet-divider.webp', role: 'Full-bleed footer photograph' },
]
