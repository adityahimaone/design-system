export type NavItem = { id: string; label: string }

/**
 * Twelve sections. `tide` and `instruments` are ids no other case uses — they
 * are the two sections this system actually needs, because a tidal observatory
 * has a data layer and an instrument, and a generic "applications" section
 * would have said nothing.
 */
export const NAV: readonly NavItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'material', label: 'Material' },
  { id: 'tide', label: 'Tide' },
  { id: 'marks', label: 'Marks' },
  { id: 'palette', label: 'Palette' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'A number without a time on it is a decoration. Every reading in Cove carries the hour it was taken.',
  },
  {
    beat: 'Enemy',
    line: 'The dashboard that glows for no reason: a gradient in the hero, a gauge that animates to look alive, a dark mode chosen because dark is fashionable.',
  },
  {
    beat: 'Mark',
    line: 'The cove is the cut; the reading is the light that arrived in it.',
  },
  {
    beat: 'Material',
    line: 'Ink and lumen. Flat panels, hairlines, no glass, no shadow — the only light in the interface is the signal, and the signal is a state.',
  },
  {
    beat: 'Voice',
    line: 'Read it, do not sell it. State the value, the unit and the time, then stop.',
  },
  {
    beat: 'Gap',
    line: 'No live feed. The readings on this page are a fixed sample, and the page says so where it shows them.',
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
    title: 'Night is the default, not a theme',
    decision:
      'The base ramp is the abyss. Daylight is the override, and it is a second palette rather than an inverted one.',
    because:
      'This is an instrument read after dark. If light is the exception, every default state has to be designed for the dark instead of falling out of a filter.',
    notWhen:
      'A reading is printed, or shown on a wall display in daylight. Then the daylight ramp is the base and the night ramp is the exception.',
    breaksNext:
      'If someone adds a `dark:` variant, there are now two overrides and one base. The ramp names are `night` and `day`; there is no `dark`.',
  },
  {
    title: 'The signal is a state, never a surface',
    decision:
      'Lumen appears only where a value is live: a filled gauge, a sparkline stroke, a status dot, a primary action. It never fills a panel, a heading or a hero.',
    because:
      'One glowing element reads as "this is happening". Twelve glowing elements read as decoration, and then the glow stops meaning anything.',
    notWhen:
      'The mark itself. The mark carries lumen at rest because it is the brand, not a reading.',
    breaksNext:
      'If a second accent is introduced for a second state, the palette needs a third role. Today there are exactly two: lumen for live, ember for threshold.',
  },
  {
    title: 'Elevation is value, not shadow',
    decision:
      'A raised surface is a lighter fill plus a hairline. There is no drop shadow anywhere in the system.',
    because:
      'On a near-black ground a shadow is invisible, so a designer reaches for a glow, and a glow reads as data. Value and a hairline say "raised" without saying "live".',
    notWhen:
      'A floating layer over a photograph — the hero plate and the footer plate carry a single soft shadow so they separate from the image.',
    breaksNext:
      'If a modal needs to sit above a panel, it must be separated by a scrim, not by a bigger shadow.',
  },
  {
    title: 'Numbers are mono and tabular',
    decision:
      'Every value, unit and timestamp is set in JetBrains Mono with tabular figures. Prose never uses it.',
    because:
      'A column of readings has to align on the decimal to be scanned. A proportional face makes 1.14 and 1.41 the same width and the same blur.',
    notWhen:
      'A number inside a sentence — "the tide turns at 04:12" — stays in the reading face.',
    breaksNext:
      'If mono is used for a paragraph because it looks technical, the page becomes a terminal costume.',
  },
  {
    title: 'The cut is drawn, not outlined',
    decision:
      'The mark is two filled shapes: a carved corner and the reading nested in its cut, held apart by six units of ground.',
    because:
      'An outline dies at 16px and a stroke cannot be both the edge and the gap. Filled shapes survive the favicon.',
    notWhen: 'Never. The mono reproduction is still two fills, not an outline.',
    breaksNext:
      'If the six-unit channel closes, the reading merges into the block and the mark becomes an L with a bump.',
  },
]

export type Rule = { rule: string; note: string }

export const MATERIAL_RULES: readonly Rule[] = [
  { rule: 'Ground', note: 'One ink: abyss #060B18. A single radial wash at the top of the page, 6% lumen, no more.' },
  { rule: 'Panel', note: 'Deep #0B1326, a 1px hairline at 14% haze, radius 12. No shadow, no blur, no border radius above 18.' },
  { rule: 'Raised', note: 'Raise #111D36 for a hovered row or an active tab. The hairline stays; only the fill moves.' },
  { rule: 'Hairline', note: '1px, never 2. It is a rule between two panels, not a divider between two ideas.' },
  { rule: 'No glass', note: 'There is no backdrop-filter in this system except the topbar, which blurs 12px so type can pass under it.' },
  { rule: 'One light', note: 'Lumen appears on live values only. If a screenshot has three glowing things, one of them is wrong.' },
]

export type Reading = {
  id: string
  label: string
  value: string
  unit: string
  time: string
  delta: string
  state: 'live' | 'slack' | 'alarm'
}

export const READINGS: readonly Reading[] = [
  { id: 'level', label: 'Water level', value: '1.42', unit: 'm', time: '02:10', delta: '+0.06', state: 'live' },
  { id: 'swell', label: 'Swell height', value: '0.84', unit: 'm', time: '02:10', delta: '−0.12', state: 'live' },
  { id: 'period', label: 'Period', value: '9.6', unit: 's', time: '02:10', delta: '+0.4', state: 'live' },
  { id: 'temp', label: 'Sea temperature', value: '12.8', unit: '°C', time: '02:05', delta: '0.0', state: 'slack' },
  { id: 'wind', label: 'Wind', value: '18', unit: 'kn', time: '02:10', delta: '+3', state: 'alarm' },
]

/** A fixed 24-hour sample. The page says it is a sample wherever it is drawn. */
export const TIDE_CURVE: readonly number[] = [
  0.62, 0.71, 0.83, 0.96, 1.08, 1.19, 1.28, 1.34, 1.36, 1.33, 1.26, 1.16, 1.04, 0.93, 0.84, 0.78,
  0.75, 0.77, 0.83, 0.92, 1.01, 1.09, 1.16, 1.22,
]

export const TIDE_RULES: readonly Rule[] = [
  { rule: 'One value per card', note: 'A reading card holds one number, one unit and one time. Two numbers make a table, and a table belongs in the log.' },
  { rule: 'Time is part of the value', note: 'A value without a timestamp is not a reading. The time sits in the same line, in haze, never as a tooltip.' },
  { rule: 'The gauge is a rail, not a dial', note: 'A vertical rail with a filled segment and a tick at the threshold. No needles, no arcs, no speedometer.' },
  { rule: 'Sparklines carry no axes', note: 'Twenty-four points, one stroke, no grid, no labels. The card prints min, max and now underneath.' },
  { rule: 'Stale is visible', note: 'A reading older than its interval drops to haze and loses the lumen dot. It does not fade out — it stops claiming to be live.' },
]

export const MARK_SPECS: readonly { key: string; value: string }[] = [
  { key: 'Grid', value: '64 units, 8-unit margins' },
  { key: 'Block', value: 'M8 8H56V30H30V56H8Z — 48 × 48, cut 26 × 26' },
  { key: 'Reading', value: 'M36 36H50V50H36Z — 14 × 14, six units of ground on every side' },
  { key: 'Compact', value: 'M8 8H56V33H33V56H8Z — one shape, arms thickened to 25 units' },
  { key: 'Channel', value: '6 units, 9.4% of the grid, never closed' },
  { key: 'Colour', value: 'Block in ink, reading in lumen. Reverse swaps ink for abyss.' },
  { key: 'Forbidden', value: 'Rounded corners, a stroke, a third shape, a glow behind the reading.' },
]

export const MARK_GATE: readonly { rule: string; pass: boolean; note: string }[] = [
  { rule: 'Zero circles', pass: true, note: 'Two quadrilaterals, no arc anywhere in the family.' },
  { rule: 'Fill only', pass: true, note: 'No path carries a stroke; the channel is negative space.' },
  { rule: 'Two primitives', pass: true, note: 'Block and reading. The compact is one.' },
  { rule: 'One accent', pass: true, note: 'Lumen on the reading, and nowhere else in the mark.' },
  { rule: 'Channel ≥ 8%', pass: true, note: 'Six units on the 64 grid is 9.4%.' },
  { rule: 'Reads at 16px', pass: true, note: 'The compact drops the reading and thickens the arms; tested at 16.' },
  { rule: 'No live text', pass: true, note: 'The wordmark is outlined from Sora SemiBold and frozen as paths.' },
]

export type Swatch = { name: string; value: string; token: string; role: string; ink: string }

export const PALETTE: readonly Swatch[] = [
  { name: 'Abyss', value: '#060B18', token: '--cv-abyss', role: 'The night ground. Deep water at 02:00.', ink: '#E9F0FF' },
  { name: 'Deep', value: '#0B1326', token: '--cv-deep', role: 'Panel fill — one step up from the ground.', ink: '#E9F0FF' },
  { name: 'Raise', value: '#111D36', token: '--cv-raise', role: 'Hovered row, active tab.', ink: '#E9F0FF' },
  { name: 'Ink', value: '#E9F0FF', token: '--cv-ink', role: 'Primary text. Moon on water.', ink: '#0A1224' },
  { name: 'Haze', value: '#8FA3C4', token: '--cv-haze', role: 'Secondary text, axis labels, captions.', ink: '#060B18' },
  { name: 'Lumen', value: '#3FE3C6', token: '--cv-lumen', role: 'The signal. Live data only.', ink: '#04211C' },
  { name: 'Ember', value: '#FF7E9D', token: '--cv-ember', role: 'Threshold crossed. A state, never decoration.', ink: '#2A0512' },
  { name: 'Tide', value: '#0A7367', token: '--cv-tide', role: 'The signal, daylight ramp.', ink: '#FFFFFF' },
]

export const BUDGET_RULES: readonly string[] = [
  'Lumen covers 2% of the viewport at most: the mark, the gauge fill, one live dot per card, one primary action.',
  'Ember is a threshold, not a mood. It appears on the reading that crossed a limit and on nothing else.',
  'Haze is the only grey. A fourth neutral is a sign that the value structure has drifted.',
  'No gradient ever carries meaning. The one wash at the top of the page is the water column, not a highlight.',
]

export type TypeRow = { token: string; size: string; face: string; use: string }

export const TYPE_SCALE: readonly TypeRow[] = [
  { token: 'display', size: '76 / 1.02', face: 'Sora 600', use: 'The hero line, once per page' },
  { token: 'h2', size: '38 / 1.1', face: 'Sora 600', use: 'Section headings' },
  { token: 'h3', size: '18 / 1.3', face: 'Sora 500', use: 'Card and block headings' },
  { token: 'body', size: '17 / 1.62', face: 'Geist 400', use: 'Reading copy' },
  { token: 'small', size: '15 / 1.55', face: 'Geist 400', use: 'Dense copy, table cells' },
  { token: 'caption', size: '13 / 1.45', face: 'Geist 400', use: 'Captions and control labels' },
  { token: 'label', size: '11 / 1.2', face: 'JetBrains 500', use: 'Mono caps: eyebrows, axis labels' },
  { token: 'reading', size: '24 / 1.1', face: 'JetBrains 500', use: 'A live number in a gauge' },
]

export const TYPE_GATE: readonly { rule: string; pass: boolean; note: string }[] = [
  { rule: 'Three families, three jobs', pass: true, note: 'Sora names, Geist reads, JetBrains measures.' },
  { rule: 'Body at 17px', pass: true, note: '1.0625rem with a 1.62 line height, measured at 66ch.' },
  { rule: 'No weight under 400', pass: true, note: 'Sora 600 is display only; nothing is set lighter than regular.' },
  { rule: 'Tabular figures', pass: true, note: 'Every value uses font-variant-numeric: tabular-nums.' },
  { rule: 'Measure 60–75ch', pass: true, note: 'Prose is capped at 66ch; a table is not prose.' },
  { rule: 'Wordmark is a drawing', pass: true, note: 'Outlines from Sora SemiBold at −30/1000, frozen as paths.' },
]

export type Instrument = {
  id: string
  name: string
  job: string
  rule: string
}

export const INSTRUMENTS: readonly Instrument[] = [
  { id: 'gauge', name: 'Gauge', job: 'One value against its range, with the threshold marked.', rule: 'The fill is lumen; the track is a 16% haze rail; the threshold is a single tick, not a zone.' },
  { id: 'spark', name: 'Sparkline', job: 'Twenty-four points of history, no axes.', rule: 'One stroke at 1.5px. No area fill, no dots, no gradient under the line.' },
  { id: 'card', name: 'Reading card', job: 'One number, its unit, its time, its delta.', rule: 'The value is the largest thing in the card; the label is the smallest.' },
  { id: 'log', name: 'Log row', job: 'A reading that has already happened.', rule: 'Mono time on the left, value right-aligned, state as a dot — never as a row colour.' },
  { id: 'alert', name: 'Threshold alert', job: 'A reading that crossed a limit.', rule: 'Ember on the value and the dot. The panel stays deep; an alarm is not a red card.' },
]

export const MOTION_RULES: readonly { name: string; value: string; note: string }[] = [
  { name: 'Press', value: '120ms', note: 'Colour and a 1px fill shift. Nothing translates.' },
  { name: 'Hover', value: '200ms', note: 'Fill steps from deep to raise. The hairline does not move.' },
  { name: 'Settle', value: '380ms', note: 'A gauge fill and a sparkline draw once, on mount, with the same curve.' },
  { name: 'Pulse', value: '2.4s', note: 'Only the live dot breathes. One element per view, never the whole card.' },
  { name: 'Ease', value: 'cubic-bezier(0.16, 1, 0.3, 1)', note: 'One curve for everything that moves.' },
]

export const VOICE_SAMPLES: readonly { ctx: string; good: string; bad: string }[] = [
  { ctx: 'Reading', good: '1.42 m at 02:10 · rising 6 cm in the last hour.', bad: 'Tide is looking great tonight! 🌊' },
  { ctx: 'Threshold', good: 'Wind crossed 15 kn at 01:48. Readings above the limit are marked.', bad: 'Uh oh! It’s windy out there!' },
  { ctx: 'Empty', good: 'No readings since 23:00. The station logs again at first light.', bad: 'Nothing to show yet.' },
  { ctx: 'Error', good: 'The station did not answer at 02:10. Last good reading: 01:58.', bad: 'Something went wrong.' },
  { ctx: 'Primary action', good: 'Log this reading', bad: 'Let’s go!' },
]

export const AUDIT_ROWS: readonly { check: string; result: string; state: 'pass' | 'open' | 'note'; evidence: string }[] = [
  { check: 'Contrast, night', result: '17.19:1', state: 'pass', evidence: 'Ink on abyss, measured in tokens.json' },
  { check: 'Contrast, panel', result: '16.18:1', state: 'pass', evidence: 'Ink on the reading panel' },
  { check: 'Signal as text', result: '12.18:1', state: 'pass', evidence: 'Lumen on abyss — the only luminous type' },
  { check: 'Secondary text', result: '7.68:1', state: 'pass', evidence: 'Haze on abyss' },
  { check: 'Daylight body', result: '16.47:1', state: 'pass', evidence: 'Slate on mist, the second ramp' },
  { check: 'Daylight signal', result: '5.06:1', state: 'pass', evidence: 'Tide on mist — darkened until it passed' },
  { check: 'Mark gate', result: 'PASS', state: 'pass', evidence: 'Zero circles, fill-only, two primitives, one accent' },
  { check: 'Mark at 16px', result: 'PASS', state: 'pass', evidence: 'Compact is one shape with 25-unit arms' },
  { check: 'Typography', result: 'PASS', state: 'pass', evidence: 'Three families, one measure, no weight under 400' },
  { check: 'Focus', result: 'PASS', state: 'pass', evidence: '2px lumen ring, 2px offset, on every control' },
  { check: 'Reduced motion', result: 'PASS', state: 'pass', evidence: 'Pulse and settle disabled at the root' },
  { check: 'Detach', result: '70 · floor 70', state: 'note', evidence: 'Measured against four siblings; Strand is the weakest pair, Clearing has no tokens.json' },
  { check: 'Live feed', result: 'Not built', state: 'open', evidence: 'The readings are a fixed sample, labelled as one' },
]

export const DETACH_FLOOR = 70

/**
 * Measured, not estimated: `node skills/sunnyside-brand-system/scripts/detach-check.mjs
 * --new features/cove/tokens.json --ref features/strand/tokens.json --ref
 * features/hachure/tokens.json --ref features/riso/tokens.json --ref
 * features/vitrine/tokens.json`.
 *
 * Clearing is missing from this table on purpose. It ships no `tokens.json`, so
 * the gate has nothing to read and any number here would be invented. The
 * comparison against Clearing is a design argument, not a measurement, and the
 * gaps list says so.
 */
export const DETACH_SCORES: readonly { ref: string; score: number; finding: string }[] = [
  {
    ref: 'Strand',
    score: 70,
    finding:
      'The weakest pair, and exactly at the floor. Hue is 117° away and the display face differs, but the value ladder is the closest of any sibling (mean L 0.55 against 0.61) and nine of twelve section ids are shared — the structure dimension is what nearly fails here.',
  },
  {
    ref: 'Hachure',
    score: 73,
    finding:
      'Geometry and copy carry the score. Hachure predates the DNA object, so the material could only be compared through its primitives — 0 of 12 DNA keys are declared on both sides, which the gate reports as a limitation rather than a pass.',
  },
  {
    ref: 'Riso Co.',
    score: 74,
    finding:
      'Chroma is nearly double Riso’s (0.073 against 0.127), so the palettes do not collide even where the hue arcs come close. No section ids are shared.',
  },
  {
    ref: 'Vitrine',
    score: 75,
    finding:
      'Ten of twelve DNA keys differ. Type is the weakest dimension: both systems reach for a geometric grotesque, and only the mono label face separates them.',
  },
]

export const GAPS: readonly string[] = [
  'There is no live feed. Every reading on this page is a fixed sample drawn from a 24-point array, and the cards say "sample" where a real product would say the station id.',
  'The night ground is close to pure black. On an OLED phone at low brightness the panels separate well; on a cheap TN panel in daylight they flatten to one value. The hairline is what carries the structure there.',
  'The hero and footer photographs are 1916 × 821 WebP files, not an art-directed set. Above 2× they upscale, and the day ramp reaches them through a mist scrim rather than a second exposure.',
  'Sora and JetBrains Mono are served through next/font, so the hero line can swap on first paint. The wordmark cannot, because it is outlined.',
  'The compact mark drops the reading to survive 16px, so the favicon and the mark are not the same drawing. That is a deliberate degradation, not a downscale.',
  'Clearing ships no tokens.json, so the detach gate could not score the pair that matters most. Everything claimed about Cove being unlike Clearing is a design argument — serif against mono labels, cream against abyss, one pane of glass against flat panels — not a measurement.',
]

export const OUTPUT_CONTRACT: readonly { path: string; role: string }[] = [
  { path: 'public/brand/cove/mark.svg', role: 'Primary mark: block and reading on the 64 grid' },
  { path: 'public/brand/cove/mark-compact.svg', role: 'One-shape drawing for 16–24px' },
  { path: 'public/brand/cove/mark-reverse.svg', role: 'Abyss block for a light ground' },
  { path: 'public/brand/cove/mark-mono.svg', role: 'One-ink reproduction' },
  { path: 'public/brand/cove/wordmark.svg', role: 'Outlined cove wordmark' },
  { path: 'public/brand/cove/lockup.svg', role: 'Horizontal lockup' },
  { path: 'public/brand/cove/lockup-stacked.svg', role: 'Stacked lockup' },
  { path: 'public/brand/cove/icon.svg', role: 'App tile: mark on the abyss' },
  { path: 'public/brand/cove/favicon.ico', role: '16 / 32 / 48 multi-resolution favicon' },
  { path: 'public/brand/cove/cove-tokens.css', role: '112 token declarations' },
  { path: 'public/brand/cove/cove-tokens.json', role: 'The same source, machine-readable' },
  { path: 'public/brand/cove/hero.webp', role: 'Full-bleed hero photograph' },
  { path: 'public/brand/cove/footer.webp', role: 'Full-bleed footer photograph' },
]

export const STATS: readonly { value: string; label: string }[] = [
  { value: '112', label: 'Token declarations' },
  { value: '17.2:1', label: 'Ink on the abyss' },
  { value: '2%', label: 'Signal budget, whole page' },
  { value: '12', label: 'Sections, all rendered' },
]

/** The level that the sample crosses twice. The chart draws it, the page says it. */
export const TIDE_THRESHOLD = 1.2

export type ContrastPair = {
  pair: string
  ratio: string
  use: string
}

/**
 * Every ratio here is computed from the hex values in `tokens.json` by
 * `scripts/generate-cove-tokens.mjs` — sRGB → linear → relative luminance, the
 * WCAG 2.1 formula. None of them is estimated by eye.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { pair: 'Ink on abyss', ratio: '17.19:1', use: 'Body copy, headings — the default reading pair' },
  { pair: 'Ink on deep', ratio: '16.18:1', use: 'Anything inside a panel' },
  { pair: 'Haze on abyss', ratio: '7.68:1', use: 'Captions, axis labels, secondary text' },
  { pair: 'Lumen on abyss', ratio: '12.18:1', use: 'A live value set as text. Nothing else' },
  { pair: 'Abyss on lumen', ratio: '12.18:1', use: 'Primary button label' },
  { pair: 'Ember on abyss', ratio: '8.16:1', use: 'A threshold crossed, as text' },
  { pair: 'Slate on mist', ratio: '16.47:1', use: 'Day ramp body copy' },
  { pair: 'Slate on quartz', ratio: '18.67:1', use: 'Day ramp copy on a panel' },
  { pair: 'Slate-mute on mist', ratio: '5.84:1', use: 'Day ramp captions' },
  { pair: 'Tide on mist', ratio: '5.06:1', use: 'Day ramp signal as text — AA at body size' },
  { pair: 'Quartz on tide', ratio: '5.74:1', use: 'Day ramp primary button label' },
]

export type LogRow = {
  time: string
  label: string
  value: string
  state: 'live' | 'slack' | 'alarm'
}

export const LOG_ROWS: readonly LogRow[] = [
  { time: '02:10', label: 'Water level', value: '1.42 m', state: 'live' },
  { time: '02:10', label: 'Wind', value: '18 kn', state: 'alarm' },
  { time: '02:10', label: 'Period', value: '9.6 s', state: 'live' },
  { time: '02:05', label: 'Sea temperature', value: '12.8 °C', state: 'slack' },
  { time: '01:58', label: 'Water level', value: '1.36 m', state: 'live' },
]

/* An excerpt, not the file. The generated sheet is 112 declarations and would
   be four screens of scrolling here; the download links below the block point
   at the whole thing, and the label above says "excerpt" so nobody copies this
   and wonders where `--cv-gauge-track` went. */
export const TOKENS_CSS = `/* 1 · primitive — night */
--cv-abyss:  #060B18;
--cv-deep:   #0B1326;
--cv-raise:  #111D36;
--cv-ink:    #E9F0FF;
--cv-haze:   #8FA3C4;
--cv-lumen:  #3FE3C6;
--cv-ember:  #FF7E9D;
--cv-tide:   #0A7367;

/* 2 · semantic — night is the base ramp */
--cv-bg:      var(--cv-abyss);
--cv-plate:   var(--cv-deep);
--cv-fg:      var(--cv-ink);
--cv-muted:   var(--cv-haze);
--cv-signal:  var(--cv-lumen);
--cv-alarm:   var(--cv-ember);
--cv-line:    rgb(150 180 240 / 0.14);

/* 3 · component — the only layer a part may read */
--cv-btn-primary-bg: var(--cv-signal);
--cv-btn-primary-fg: #04211C;
--cv-field-bg:       rgb(6 11 24 / 0.72);
--cv-gauge-track:    rgb(150 180 240 / 0.16);
--cv-spark-line:     var(--cv-signal);

/* 4 · daylight is an override, not an inversion */
html[data-cove='day'] .cv-scope {
  --cv-bg:     #EDF1F7;
  --cv-plate:  #FFFFFF;
  --cv-fg:     #0A1224;
  --cv-muted:  #4E5D7A;
  --cv-signal: #0A7367;
  --cv-alarm:  #B92F55;
}`

export const TOKENS_JSON = `{
  "name": "Cove",
  "version": "2.0.0",
  "namespace": "cv",
  "material": "ink-and-lumen",
  "ramps": ["night", "day"],
  "base": "night",
  "mark": {
    "grid": 64,
    "block": "M8 8H56V30H30V56H8Z",
    "reading": "M36 36H50V50H36Z",
    "compact": "M8 8H56V33H33V56H8Z",
    "channel": 6
  },
  "type": {
    "display": "Sora 600",
    "reading": "Geist 400",
    "label": "JetBrains Mono 500"
  },
  "signal": {
    "budget": "2% of viewport",
    "roles": [
      "live value", "primary action", "status dot"
    ]
  },
  "contrast": {
    "ink/abyss": 17.19,
    "ink/plate": 16.18,
    "haze/abyss": 7.68,
    "lumen/abyss": 12.18,
    "ember/abyss": 8.16,
    "slate/mist": 16.47,
    "tide/mist": 5.06
  }
}`
