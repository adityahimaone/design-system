import tokens from './tokens.json'

/**
 * Bluewater Freight — the case's content.
 *
 * Palette, type, contrast and the mark are read straight out of tokens.json so
 * the specimen and the stylesheet physically cannot disagree; the gate that
 * compares them has nothing to catch. The prose lives here because it is
 * argument, not measurement.
 */

export const META = tokens.meta
export const MARK = tokens.mark

export const NAV = [
  { id: 'charter', label: 'Charter' },
  { id: 'keel', label: 'Keel' },
  { id: 'grain', label: 'Grain' },
  { id: 'signal', label: 'Signal' },
  { id: 'type', label: 'Type' },
  { id: 'manifest', label: 'Manifest' },
  { id: 'wake', label: 'Wake' },
  { id: 'chart', label: 'Chart' },
  { id: 'survey', label: 'Survey' },
] as const

/** The waybill that runs under the hero. Every number is mono and tabular. */
export const VOYAGE = [
  { key: 'Vessel', value: 'MV LONGVIEW' },
  { key: 'Voyage', value: 'BW-0412' },
  { key: 'Laden', value: '18,240 TEU' },
  { key: 'Departure', value: 'SGSIN · 04:12' },
  { key: 'Arrival', value: 'NLRTM · +21d' },
] as const

export const HERO_STATS = [
  { label: 'Deep-sea routes', value: '38' },
  { label: 'Vessels under charter', value: '412' },
  { label: 'Berth punctuality', value: '96.4%' },
  { label: 'Ports served', value: '21' },
] as const

export const CHARTER = [
  'Bluewater Freight moves things that cannot be late. The brand has one job: make a passage legible before a customer asks about it. So the system is built like a chart, not a photograph — one horizon rule, one hull, and a single bright mark that appears only where something is actually moving.',
  'There is no second accent, no gradient, no glass. The sea is nearly black because the sea is nearly black. The wake is the only light in the frame, and it is rationed: it belongs to the number that changed, the route that is running, the button that commits.',
] as const

export const ESSENCE = [
  { key: 'Essence', value: META.essence },
  { key: 'Promise', value: META.promise },
  { key: 'Track', value: 'Constructed — the sea is a chart, not a picture' },
  { key: 'Material', value: 'Deep water, silver wake, one 1px rule' },
  { key: 'Family', value: 'Hull and waterline' },
] as const

export const BEATS = [
  {
    id: 'crossing',
    title: 'Crossing',
    line: 'The horizon does the work. A full-bleed photograph, one scrim, and the passage name set over it — no card, no frame, nothing floating.',
  },
  {
    id: 'charter',
    title: 'Charter',
    line: 'What the brand promises: you will know where the cargo is before you have to ask. Every surface after this one answers that.',
  },
  {
    id: 'grain',
    title: 'Grain',
    line: 'Three photographs, each keyed to the same near-black ground. They are evidence, not decoration — a horizon, a hull, a wake.',
  },
  {
    id: 'keel',
    title: 'Keel',
    line: 'A waterline rule split by a passage, over a hollow keel. Two drawings: one for the page, one that survives 16px.',
  },
  {
    id: 'signal',
    title: 'Signal',
    line: 'One accent, rationed. It marks movement. In daylight it darkens, because silver on fog is 1.91:1 and honesty beats a fixed hex.',
  },
  {
    id: 'manifest',
    title: 'Manifest',
    line: 'Archivo for names, Geist for reading, Geist Mono for anything a customer might read aloud. Numbers never get a display face.',
  },
  {
    id: 'wake',
    title: 'Wake',
    line: 'The parts: a manifest table, a field, two buttons, a status rail. Zero radius on every loud surface; 2px only where a finger lands.',
  },
  {
    id: 'chart',
    title: 'Chart',
    line: 'A route draws itself once, in the signal, over a 1px grid. Motion is a single reveal, never a loop, and it stops for reduced motion.',
  },
  {
    id: 'survey',
    title: 'Survey',
    line: 'What was measured, what failed, and what this case could not verify. The audit names its own gaps.',
  },
] as const

export const MARK_SPECS = [
  { size: '140px', file: 'mark.svg', note: 'Grounds, covers, the board' },
  { size: '48px', file: 'mark.svg', note: 'Section marks, footer' },
  {
    size: '24px',
    file: 'mark.svg',
    note: 'The smallest the hollow keel holds',
  },
  {
    size: '16px',
    file: 'mark-compact.svg',
    note: 'Favicon. A different drawing, not a scale',
  },
] as const

export const MARK_RULES = [
  {
    rule: 'Two drawings, never one scaled',
    detail:
      'The primary mark has hollow keel arms 7 units wide — 1.75px at 16px. The compact fills the keel and thickens the rule to 10 units so the silhouette survives a favicon. Scaling the primary down produces a smudge, not a smaller mark.',
  },
  {
    rule: 'The passage is the only colour',
    detail:
      'The 6 × 11 notch in the waterline is the single place the signal appears inside the mark. Every other part is one ink. A three-colour mark would need a third meaning, and this system has exactly one.',
  },
  {
    rule: 'Reverse is a redraw, not a filter',
    detail:
      'On fog grounds the ink becomes slate and the signal becomes wake-deep. CSS inversion would have turned the silver wake into a muddy amber, so the reverse files are drawn, not filtered.',
  },
  {
    rule: 'Clear space is half the rule',
    detail:
      'Minimum clear space equals half the waterline height (4 units). Nothing crosses the horizon line — no tagline, no icon, no rule.',
  },
] as const

export const MATERIAL_RULES = [
  {
    title: 'Deep water',
    body: 'The ground is #040B14 and it stays there. Panels are one fathom up, never a tint of the accent. A photograph is keyed into the same value so the seam disappears.',
  },
  {
    title: 'Silver wake',
    body: 'One accent, #8FB6D6, and it means movement: a live route, a changed number, the action you are about to commit. It never fills a large area, and it never becomes a second brand colour.',
  },
  {
    title: 'One rule',
    body: 'Every separation is a 1px line at 13% ink, or 28% under a heading. No shadows, no elevation, no rounded containers. Depth comes from value, not from blur.',
  },
] as const

export const FIELD_RULES = [
  { key: 'Horizon', value: 'The hero is 100vw and 92svh. Nothing insets it.' },
  {
    key: 'Scrim',
    value: 'One linear scrim, 62% abyss at the base, 8% at the top.',
  },
  {
    key: 'Photograph',
    value: 'always cover, always keyed to #040B14 at the edges',
  },
  { key: 'Overlay ink', value: 'foam, never pure white' },
] as const

export const TYPE_SAMPLES = [
  {
    voice: 'Display',
    family: 'Archivo',
    stack: "var(--font-archivo), 'Archivo', sans-serif",
    role: 'Names, headings, the promise',
    sample: 'North Atlantic',
    meta: 'variable · tracking -0.03em · not below 20px',
    weights: '620 regular-use · 700 only above 48px',
    sizes:
      'clamp(2.8rem, 6.2vw, 4.6rem) hero · clamp(1.7rem, 2.9vw, 2.3rem) section',
    tracking: '-0.03em display, 0 at h3',
    leading: '1.06 headings',
    floor:
      'Never below 20px — the counters close and it stops reading as signage.',
    para: 'Freight signage is grotesque and slightly wide. Archivo keeps its counters open at 20px on a scrimmed photograph, which is the size the promise actually ships at.',
  },
  {
    voice: 'Reading',
    family: 'Inter',
    stack: "var(--font-inter), 'Inter', sans-serif",
    role: 'Body copy and interface text',
    sample: 'The passage clears Ushant at 04:12 and holds 18 knots.',
    meta: '400/500 · leading 1.6 · 17px',
    weights: '400 body · 500 emphasis only, never faux-bold',
    sizes:
      '1.0625rem body · 0.9375rem dense table cells · 0.8125rem control labels',
    tracking: '0 — nothing here is tracked',
    leading: '1.6 body',
    floor:
      '16px minimum on any input: below that iOS zooms the viewport on focus.',
    para: 'The reading face is deliberately the plainest thing in the system. Nothing in a chart should be asked to perform; the numbers are mono and the names are display, so body copy has one job left.',
  },
  {
    voice: 'Mono',
    family: 'Geist Mono',
    stack: "var(--font-geist-mono), 'Geist Mono', monospace",
    role: 'Waybills, ETAs, tonnage, axis labels',
    sample: 'BW-0412 · 18,240 TEU · ETA +21d',
    meta: 'tabular · tracking 0.16em when caps',
    weights: '400 only — one weight, one job',
    sizes: '0.6875rem caps labels · 1.375rem a live manifest number',
    tracking: '0.16em in caps, 0.01em in running figures',
    leading: '1.7 in caps blocks',
    floor:
      'Never set in sentence case above 20px; it is a label voice, not a headline.',
    para: 'Every figure that can change is mono and tabular so a column of ETAs cannot shimmer as it updates. Caps labels carry 0.16em tracking; running figures carry almost none.',
  },
] as const

/** The ladder, read from tokens so the specimen cannot drift from the CSS. */
export const TYPE_LADDER = tokens.type.filter((t) =>
  t.name.startsWith('scale-'),
)

export const TYPE_RULES = [
  {
    rule: 'One tracked voice, and it is caps',
    detail:
      'Tracking exists in two places only: -0.03em on display, +0.16em on mono caps. Body copy is never tracked — letterspacing a paragraph is how a design system pretends to have a voice.',
  },
  {
    rule: 'The number is mono, the name is display',
    detail:
      'A manifest row sets the port in Inter, the vessel in Archivo and the tonnage in Geist Mono. That split is the whole typographic system: nothing is asked to be both legible and authoritative.',
  },
  {
    rule: 'Measure stops at 62 characters',
    detail:
      'Prose is capped at 62ch and lede at 58ch. On a 1440 viewport that is roughly 34 words a line at body size — the point where the eye still returns to the left edge without a guide.',
  },
  {
    rule: 'Two weights per family, never three',
    detail:
      'Archivo runs 400 and 620; Inter 400 and 500; Geist Mono 400 only. A third weight is a decision nobody asked for, and it always arrives as emphasis that should have been structure.',
  },
] as const

export const PARTS = [
  {
    name: 'Manifest row',
    detail:
      '1px rule, mono number right-aligned and tabular, the signal only on a live state.',
  },
  {
    name: 'Field',
    detail:
      '0.7 abyss fill, 28% ink edge, signal focus ring at 2px offset — never a glow.',
  },
  {
    name: 'Button',
    detail:
      'signal fill with wake-ink label, 0 radius, 44px tall. The quiet button is a rule and nothing else.',
  },
  {
    name: 'Status rail',
    detail:
      'A 2px bar in the signal on the row that moved. No dot, no pill, no badge.',
  },
] as const

export const MANIFEST_ROWS = [
  {
    ref: 'BW-0412',
    port: 'Singapore → Rotterdam',
    teu: '18,240',
    eta: '+21d',
    state: 'Under way',
  },
  {
    ref: 'BW-0388',
    port: 'Shanghai → Long Beach',
    teu: '21,006',
    eta: '+14d',
    state: 'Under way',
  },
  {
    ref: 'BW-0401',
    port: 'Busan → Antwerp',
    teu: '16,880',
    eta: '+26d',
    state: 'At anchor',
  },
  {
    ref: 'BW-0355',
    port: 'Jebel Ali → Santos',
    teu: '9,412',
    eta: '+31d',
    state: 'Laden',
  },
  {
    ref: 'BW-0430',
    port: 'Valparaíso → Auckland',
    teu: '6,204',
    eta: '+11d',
    state: 'Cleared',
  },
] as const

/** 14 days of a single route's daily distance-made-good, in nautical miles. */
export const CHART = [
  312, 348, 361, 340, 402, 421, 398, 355, 288, 246, 322, 388, 411, 427,
]

export const CHART_AXIS = ['D1', 'D3', 'D5', 'D7', 'D9', 'D11', 'D13'] as const

export const AUDIT = [
  {
    item: 'Palette is one source',
    verdict: 'Pass',
    note: 'tokens.json and bluewater-tokens.css declare the same 13 primitives; the page draws its swatches from the JSON.',
  },
  {
    item: 'Contrast, measured',
    verdict: 'Pass',
    note: 'Fifteen pairs measured at WCAG 2.x. Fourteen pass AA at the size they ship at; the fifteenth is the next row.',
  },
  {
    item: 'One pair published as failing',
    verdict: 'Pass',
    note: 'Night wake on fog is 1.91:1. It is documented as prohibited for text rather than darkened until the number looked acceptable.',
  },
  {
    item: 'Display face is unique',
    verdict: 'Pass',
    note: 'Archivo is used by no other case. Ten sibling display faces were checked before it was chosen.',
  },
  {
    item: 'Mark at 16px',
    verdict: 'Pass',
    note: 'Judged on a rendered sheet at 1×, not in a vector editor: the compact drawing holds, the primary does not.',
  },
  {
    item: 'Fullwidth hero',
    verdict: 'Pass',
    note: 'The hero is 100vw and 92svh with no container, verified at 390, 768 and 1440.',
  },
  {
    item: 'Motion respects the preference',
    verdict: 'Pass',
    note: 'The route reveal is disabled under prefers-reduced-motion; nothing in the system loops.',
  },
] as const

export const GAPS = [
  'The photographs are client-supplied stock, not commissioned. A real operator would shoot its own hulls — the three images carry different sea states and only one of them was shot at the hour the palette claims.',
  'No data layer exists behind the manifest or the chart. Every number on this page is typed, so the table proves a shape, not a feed.',
  'The system has been checked at three viewport widths, not on a real device. Touch targets are 44px by construction, not by measurement.',
  'Waybill printing,EDI 214 payloads and the B/L document set were not designed. Freight brands live and die in those artefacts, and this kit stops at the screen.',
  'The mark has not been tested embroidered, cut in vinyl on a container livery, or set in one colour on standard marine grey.',
] as const

export const DECISIONS = [
  {
    took: 'A horizon rule over a wave, a compass or an anchor',
    over: 'The literal sea symbols',
    why: 'Every maritime brand reaches for an anchor or a wave. A waterline with a hull under it is the same idea told as a diagram: the rule is the horizon, the keel is the vessel, the notch is where the water is disturbed.',
  },
  {
    took: 'Archivo at 620 weight',
    over: 'A condensed grotesque or a serif',
    why: 'Freight signage is grotesque and slightly wide. Archivo holds its counters at 20px on a scrimmed photograph, which is the size the promise actually ships at.',
  },
  {
    took: 'One accent, proven failing in daylight',
    over: 'A night and a day accent invented separately',
    why: 'Inventing two silvers would have hidden the problem. Publishing the 1.91:1 failure and shipping a darker daylight value keeps one accent with one rule.',
  },
  {
    took: 'Zero radius everywhere loud',
    over: 'The usual 12px panel',
    why: 'A chart has square corners. Radius reads as consumer software, and this brand is a working document.',
  },
] as const

export const DETACH = {
  floor: 70,
  score: 77,
  note: 'Scored against every sibling with a tokens.json. The weakest match is Cove at 77 — both systems run a cool near-black ground. Bluewater separates on the rest: constructed track, 1px chart rules instead of glass panels, zero radius, and an Inter/Archivo pairing rather than a single grotesque.',
  rows: [
    {
      case: 'Cove',
      score: 77,
      why: 'shared cool dark ground; different track, signal, geometry and mark',
    },
    {
      case: 'Strand',
      score: 84,
      why: 'both coastal; Strand is sea glass and 12px plates, Bluewater is chart rules and square',
    },
    {
      case: 'Ledger',
      score: 88,
      why: 'both read as documents; Ledger is zinc, glass and a pill',
    },
    {
      case: 'Jakarta',
      score: 96,
      why: 'unrelated: one orange stroke, enamel, nine district ramps',
    },
  ],
} as const

export const PALETTE_DARK = tokens.primitives.slice(0, 8)
export const PALETTE_LIGHT = tokens.primitives.slice(8)
export const CONTRAST = tokens.contrast
export const TYPE_SCALE = tokens.type
