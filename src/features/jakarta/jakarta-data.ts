/**
 * Jakarta — Kota Kolaborasi. Case 11.
 *
 * The content layer for the case page. Everything numeric here was produced by a
 * script in the design-system workspace (`jakarta/scripts/`): the contrast pairs
 * by `build-tokens.mjs`, the mark measurements by `geometry.mjs`, the audit rows
 * by `verify-mark.mjs` and `figma-smoke.mjs`. Nothing in this file is estimated.
 */

export const META = {
  number: '11',
  name: 'Jakarta',
  version: '1.1',
  /** The campaign line. Until now the system had an argument but no slogan. */
  campaign: 'Bergerak Menuju Era Baru Jakarta',
  campaignYear: 'HUT ke–499 Kota Jakarta',
  /** The public one-liner. It is the campaign line, not the design thesis. */
  essence: 'Bergerak Menuju Era Baru Jakarta — HUT ke–499.',
  /** The design argument. It explains the identity; it is not the slogan. */
  thesis: 'A city of junctions, not a city of monuments.',
  href: '/design-system/jakarta',
  tagline: 'Bergerak Menuju Era Baru Jakarta.',
  description:
    'A city identity for Jakarta’s 499th year: one stroke that turns a corner, nine district ramps named after Jakarta places, and an audit that publishes the six pairs that fail.',
  status: 'Shipped · 2026',
  role: 'Identity · design system · wayfinding · docs',
  material: 'Enamel + vinyl + one orange',
  tags: ['City', 'Transit', 'Nine Ramps', 'Wayfinding'],
} as const

/**
 * The campaign copy. The hero carries the slogan and one line — the two long
 * paragraphs are the client's verbatim campaign text and live in `llms.txt`
 * rather than on the page, because a hero that explains itself is not a hero.
 */
export const CAMPAIGN = {
  /**
   * The year, back in the hero — but as a settled eyebrow, not as the headline.
   * The headline is one quiet line-set now, so the anniversary can sit above it
   * at 10,5px with letterspacing and do the captioning the display used to
   * shout.
   */
  eyebrow: META.campaignYear,
  headline: ['Bergerak Menuju', 'Era Baru Jakarta'],
  /** Three sentences, four words each. It is the system in one breath. */
  sub: 'Sembilan distrik. Sepuluh warna. Satu kisi.',
  lede: 'Selamat datang di perayaan 499 tahun Jakarta, sebuah momentum bersejarah di mana kita bersatu dalam semangat “Bergerak Menuju Era Baru Jakarta”. Terinspirasi oleh pancaran warna-warni dinamis pada logo tahun ini yang melambangkan energi tak terbatas dan keragaman, Jakarta kini melangkah menuju ambang lima abad usianya dengan visi yang lebih modern, inklusif, dan berkelanjutan.',
  body: 'Mari bersama-sama merayakan transformasi kota tercinta yang terus bertumbuh melampaui batas, menyatukan setiap langkah kolaborasi untuk mengukir sejarah baru yang membangun di setiap sudut ibu kota.',
} as const

/**
 * The ten colours of the hero field: the nine district ramps at their 100 step,
 * plus the ink that grounds them, in the order the sweep paints them. This list
 * is the single source for the field, for the flat stretch it becomes at the
 * floor of the hero, and for the rule that opens the applications section — if
 * the palette changes, all three change, and none can drift.
 */
export const HERO_FIELD = [
  { token: 'langit', hex: '#2830D0' },
  { token: 'laut', hex: '#148BCD' },
  { token: 'ancol', hex: '#9378F9' },
  { token: 'doger', hex: '#F194AF' },
  { token: 'menteng', hex: '#F53D3F' },
  { token: 'senja', hex: '#F7481B' },
  { token: 'kebayoran', hex: '#FCD260' },
  { token: 'daun', hex: '#00A062' },
  { token: 'aspal', hex: '#323941' },
  { token: 'tinta', hex: '#1B2126' },
] as const

/**
 * One district colour per section, spent as decoration only: the numeral chip,
 * the rule above the head, the tick on every block label. No colour here ever
 * carries body type.
 *
 * Every ink below is a computed pair, printed rather than nudged — the chip is
 * 11px/600, so it needs 4,5:1:
 *
 *   langit     kertas 7,89   aspal    kertas 10,64   kebayoran tinta 11,24
 *   senja      tinta  4,56   ancol    tinta   4,87   daun      tinta  4,80
 *   doger      tinta  7,43   tinta    kertas 14,80
 *   laut       hitam  5,57   menteng  hitam   5,68   ← tinta reads 4,34 / 4,35
 *
 * The two `hitam` entries are the honest ones: tinta on Laut Sunda and Merah
 * Menteng misses 4,5 for small type, and pure black clears it. The pair is
 * recorded here so the next agent does not "fix" it back to tinta.
 */
export const SECTION_ACCENTS = {
  idea: { token: 'langit-100', hex: '#2830D0', ink: '#F7F4EE' },
  mark: { token: 'senja-100', hex: '#F7481B', ink: '#1B2126' },
  palette: { token: 'laut-100', hex: '#148BCD', ink: '#000000' },
  type: { token: 'ancol-100', hex: '#9378F9', ink: '#1B2126' },
  apps: { token: 'daun-100', hex: '#00A062', ink: '#1B2126' },
  tokens: { token: 'aspal-100', hex: '#323941', ink: '#F7F4EE' },
  audit: { token: 'menteng-100', hex: '#F53D3F', ink: '#000000' },
} as const

export type SectionAccentKey = keyof typeof SECTION_ACCENTS

/** The four stats carry the colours the sections did not spend, in order. */
export const STAT_ACCENTS = ['kebayoran', 'doger', 'ancol', 'laut'] as const

export const STATS = [
  { value: '0,989', label: 'IoU against the supplied mark' },
  { value: '46', label: 'Primitives, nine ramps' },
  { value: '8/14', label: 'Contrast pairs passing on paper' },
  { value: '24px', label: 'Smallest primary mark' },
] as const

export type Beat = { kicker: string; title: string; body: string }

export const STORY_BEATS: readonly Beat[] = [
  {
    kicker: 'One',
    title: 'The city is the junction',
    body: 'Jakarta is not seen from one place. It is the place where a toll road crosses a river, where a kampung meets a tower, where five modes of transport meet at Dukuh Atas. A monument says “look at me”. A junction says “you can get there from here”. The identity is built on the second sentence.',
  },
  {
    kicker: 'Two',
    title: 'A stroke that turns',
    body: 'The mark is a single stroke that travels down, turns a corner and stops. The corner is 2S on the outside and 1S on the inside, so the turn is a fact of the drawing rather than a rounded rectangle. The stop is a filled disc at 1,38S, the one element that is not the stroke.',
  },
  {
    kicker: 'Three',
    title: 'The palette is a map',
    body: 'Nine ramps, each named after a place the colour was taken from: Langit Senayan, Laut Sunda, Merah Menteng, Senja Palmerah, Aspal Sudirman, Terang Kebayoran, Menteng Daun, Sinar Ancol, Doger Mayestik. Primitives are places. Semantics are jobs. Nothing downstream names a hue.',
  },
  {
    kicker: 'Four',
    title: 'Six of nine cannot set type',
    body: 'Measured on paper, six district colours fail 4,5:1 and two of them fail 3:1. That is not a flaw to fix — it is the rule that makes the palette usable: a district colour is a ground, a mark, a field or a stripe, never a word. Everything in this page obeys it, including the button.',
  },
  {
    kicker: 'Five',
    title: 'One family, three voices',
    body: 'Plus Jakarta Sans, variable, 200–800. Display is 800 with −0,045em tracking; reading is 400 at 16,5px; labels are the same family at 11,5px with 0,16em tracking. No second face, no serif, no mono display. The hierarchy is weight and space, which is what a city can actually print.',
  },
]

export type Principle = {
  name: string
  gloss: string
  line: string
  forbids: string
}

export const PRINCIPLES: readonly Principle[] = [
  {
    name: 'Kolaborasi',
    gloss: 'Collaboration',
    line: 'Every surface assumes more than one author. The system is a set of rules two offices can both use without asking.',
    forbids: 'A layout that only works with the original artwork.',
  },
  {
    name: 'Ketahanan',
    gloss: 'Resilience',
    line: 'The mark has to survive enamel in the sun, a 16px favicon and a photograph taken at night. Legibility first, expression second.',
    forbids: 'A drawing that needs a specific background to be read.',
  },
  {
    name: 'Keberagaman',
    gloss: 'Diversity',
    line: 'Nine districts, nine colours, no hierarchy between them. No single colour is “the Jakarta colour”.',
    forbids: 'One accent promoted above the other eight.',
  },
  {
    name: 'Kemajuan',
    gloss: 'Progress',
    line: 'The system has to hold a live transit feed and a printed poster without changing its voice.',
    forbids: 'A component that only exists on a screen.',
  },
]

export type VoiceRow = {
  register: string
  sounds: string
  sample: string
  not: string
}

export const VOICE: readonly VoiceRow[] = [
  {
    register: 'Warm',
    sounds: 'A neighbour explaining a route, not a kiosk.',
    sample: 'Bus 1A arrives in four minutes. It stops at Harmoni, then Blok M.',
    not: '“Service disruption event in progress.”',
  },
  {
    register: 'Progressive',
    sounds: 'Forward-looking without claiming the future has arrived.',
    sample: 'This stop now takes the same card as the MRT.',
    not: '“A seamless smart-city mobility ecosystem.”',
  },
  {
    register: 'Inclusive',
    sounds: 'Names the person, not the category.',
    sample: 'If you use a wheelchair, use the lift at Exit B.',
    not: '“Accessibility is a core value.”',
  },
  {
    register: 'Authoritative',
    sounds: 'States the fact, then the instruction. No hedging.',
    sample: 'The road is closed until 05:00. Take Jl. Sabang instead.',
    not: '“We apologise for any inconvenience caused.”',
  },
]

export type MarkSpec = {
  name: string
  drawing: string
  viewBox: string
  measures: readonly [string, string][]
  min: string
  use: string
}

export const MARK_SPECS: readonly MarkSpec[] = [
  {
    name: 'Primary',
    drawing:
      'The full stroke, the 2:1 corner and the stop, with 1S of clear space baked into the viewBox.',
    viewBox: '650 × 576',
    measures: [
      ['Stroke', 'S = 100'],
      ['Outer corner', '2S'],
      ['Inner corner', '1S'],
      ['Stop', '1,38S'],
      ['Gap', '0,62S'],
      ['Clear space', '1S, inside the box'],
    ],
    min: '24px digital · 8mm print',
    use: 'Signage, livery, covers, the wordmark lockup.',
  },
  {
    name: 'Compact',
    drawing:
      'A separate drawing, not a scaled primary: 0,78S stop, 0,44S gap, flush right, no clear space in the box.',
    viewBox: '450 × 376',
    measures: [
      ['Stop', '0,78S'],
      ['Gap', '0,44S'],
      ['Padding', 'none — the box is the ink'],
      ['IoU vs primary', '0,918'],
    ],
    min: '16px digital',
    use: 'Favicons, tab bars, the 16–23px band where the primary closes up.',
  },
  {
    name: 'Glyph',
    drawing:
      'One shape knocked out of a plate. The only drawing in the family with a single contour.',
    viewBox: '32 × 32',
    measures: [
      ['Plate', '32 × 32, Senja'],
      ['Ink', 'Pure white, knocked out'],
      ['Contours', 'one'],
    ],
    min: '16px',
    use: 'App icon, avatar, the 16px slot.',
  },
]

export const MARK_RULES: readonly { rule: string; why: string }[] = [
  {
    rule: 'Do not stretch or condense.',
    why: 'The corner radii are multiples of S. Scaling one axis turns a turn into an oval.',
  },
  {
    rule: 'Do not rotate the mark.',
    why: 'The stroke runs down and turns right. Rotated, it reads as a different letter.',
  },
  {
    rule: 'Do not recolour the stop.',
    why: 'One drawing, one ink. The stop is the same colour as the stroke, always.',
  },
  {
    rule: 'Do not place it on a district colour.',
    why: 'Six of nine fail 3:1 against white. Put it on paper, ink or a photograph with a scrim.',
  },
  {
    rule: 'Do not add a shadow or a gradient.',
    why: 'The mark is a flat drawing; a shadow makes it a logo with a light source.',
  },
  {
    rule: 'Do not set the wordmark inside the mark.',
    why: 'The lockup exists. Stacking type into the stroke closes the gap the drawing depends on.',
  },
  {
    rule: 'Do not use the primary below 24px.',
    why: 'The gap closes at 0,62S. Below 24px the compact or the glyph is the correct drawing.',
  },
  {
    rule: 'Do not rebuild it from a different corner radius.',
    why: 'A 2:1 corner is the mark. A 3:1 corner is a different, softer object.',
  },
]

export type Ramp = {
  key: string
  name: string
  place: string
  job: string
  hex: readonly [string, string, string, string]
  onPaper: number
  verdict: 'body' | 'large' | 'ground'
}

export const RAMPS: readonly Ramp[] = [
  {
    key: 'langit',
    name: 'Langit Senayan',
    place: 'Senayan sky',
    job: 'Night, links, focus',
    hex: ['#2830D0', '#454CE3', '#656CF2', '#858BF9'],
    onPaper: 7.89,
    verdict: 'body',
  },
  {
    key: 'laut',
    name: 'Laut Sunda',
    place: 'Sunda sea',
    job: 'Transit, information',
    hex: ['#148BCD', '#46A8DB', '#7AC5EA', '#A6DEF7'],
    onPaper: 3.41,
    verdict: 'large',
  },
  {
    key: 'menteng',
    name: 'Merah Menteng',
    place: 'Menteng red',
    job: 'Alert, closure, emergency',
    hex: ['#F53D3F', '#FF6162', '#FF9192', '#FEA8A9'],
    onPaper: 3.4,
    verdict: 'large',
  },
  {
    key: 'senja',
    name: 'Senja Palmerah',
    place: 'Palmerah dusk',
    job: 'Primary accent, civic action',
    hex: ['#F7481B', '#FF663E', '#FF9275', '#FFB19D'],
    onPaper: 3.24,
    verdict: 'large',
  },
  {
    key: 'aspal',
    name: 'Aspal Sudirman',
    place: 'Sudirman asphalt',
    job: 'Ink, secondary text, hairlines',
    hex: ['#323941', '#515B67', '#6E7884', '#8995A3'],
    onPaper: 10.64,
    verdict: 'body',
  },
  {
    key: 'kebayoran',
    name: 'Terang Kebayoran',
    place: 'Kebayoran light',
    job: 'Heritage, festival, highlight field',
    hex: ['#FCD260', '#FDDE8B', '#FDE9B2', '#FFF2D2'],
    onPaper: 1.32,
    verdict: 'ground',
  },
  {
    key: 'daun',
    name: 'Menteng Daun',
    place: 'Menteng leaf',
    job: 'Park, sustainability, open data',
    hex: ['#00A062', '#2DB26C', '#6BCB7A', '#A1E086'],
    onPaper: 3.08,
    verdict: 'large',
  },
  {
    key: 'ancol',
    name: 'Sinar Ancol',
    place: 'Ancol light',
    job: 'Leisure, events, secondary digital',
    hex: ['#9378F9', '#AE9BFA', '#C8BDFB', '#DAD4FC'],
    onPaper: 3.04,
    verdict: 'large',
  },
  {
    key: 'doger',
    name: 'Doger Mayestik',
    place: 'Mayestik doger',
    job: 'Youth, culture, campaign surface',
    hex: ['#F194AF', '#F4ADC2', '#F7C3D3', '#F9D7E3'],
    onPaper: 1.99,
    verdict: 'ground',
  },
]

export type SemanticRow = {
  token: string
  light: string
  night: string
  job: string
}

export const SEMANTIC: readonly SemanticRow[] = [
  { token: 'surface', light: 'kertas', night: 'malam-100', job: 'The page' },
  {
    token: 'surface-raised',
    light: 'kapur',
    night: 'malam-200',
    job: 'A card on the page',
  },
  { token: 'text', light: 'tinta', night: 'kertas', job: 'Body copy' },
  {
    token: 'text-muted',
    light: 'aspal-200',
    night: 'aspal-400',
    job: 'Secondary copy',
  },
  {
    token: 'text-faint',
    light: 'aspal-300',
    night: 'aspal-300',
    job: 'Tertiary, large only',
  },
  {
    token: 'rule',
    light: 'garis',
    night: 'malam-300',
    job: 'A divider that carries no meaning',
  },
  {
    token: 'rule-strong',
    light: 'aspal-300',
    night: 'aspal-400',
    job: 'A hairline that does',
  },
  {
    token: 'accent',
    light: 'senja-100',
    night: 'senja-200',
    job: 'Civic action',
  },
  {
    token: 'accent-ink',
    light: 'tinta',
    night: 'tinta',
    job: 'Type on the accent',
  },
  { token: 'transit', light: 'laut-100', night: 'laut-200', job: 'Transit' },
  {
    token: 'park',
    light: 'daun-100',
    night: 'daun-200',
    job: 'Parks, open data',
  },
  {
    token: 'heritage',
    light: 'kebayoran-100',
    night: 'kebayoran-100',
    job: 'Heritage',
  },
  { token: 'digital', light: 'doger-100', night: 'doger-200', job: 'Digital' },
  {
    token: 'night',
    light: 'langit-100',
    night: 'langit-300',
    job: 'Night, links',
  },
  {
    token: 'alert',
    light: 'menteng-100',
    night: 'menteng-200',
    job: 'Alert, closure',
  },
  {
    token: 'focus',
    light: 'langit-100',
    night: 'kebayoran-100',
    job: 'Focus ring',
  },
]

export type FailureRow = { pair: string; ratio: string; therefore: string }

export const FAILURES: readonly FailureRow[] = [
  {
    pair: 'accent on surface',
    ratio: '3,24:1',
    therefore: 'A rule, a band, a bullet, a 24px word. Never 14px body copy.',
  },
  {
    pair: 'transit on surface',
    ratio: '3,41:1',
    therefore: 'Transit labels are set in ink with a blue dot, never in blue.',
  },
  {
    pair: 'alert on surface',
    ratio: '3,40:1',
    therefore: 'The alert field is red; the alert text is ink.',
  },
  {
    pair: 'park on surface',
    ratio: '3,08:1',
    therefore: 'Passes 3:1 by 0,08. Graphics and 24px only.',
  },
  {
    pair: 'digital on surface',
    ratio: '1,99:1',
    therefore: 'Surface only. Never type, at any size.',
  },
  {
    pair: 'heritage on surface',
    ratio: '1,32:1',
    therefore: 'Surface only. Not “hard to read” — invisible.',
  },
]

export type TypeRow = {
  role: string
  size: string
  leading: string
  tracking: string
  weight: string
  use: string
}

export const TYPE_SCALE: readonly TypeRow[] = [
  {
    role: 'display-1',
    size: '104',
    leading: '0,90',
    tracking: '−0,045em',
    weight: '800',
    use: 'One per page, hero only',
  },
  {
    role: 'display-2',
    size: '72',
    leading: '0,94',
    tracking: '−0,040em',
    weight: '800',
    use: 'Section openers',
  },
  {
    role: 'h1',
    size: '48',
    leading: '1,02',
    tracking: '−0,032em',
    weight: '700',
    use: 'Page titles',
  },
  {
    role: 'h2',
    size: '34',
    leading: '1,10',
    tracking: '−0,024em',
    weight: '700',
    use: 'Sub-sections',
  },
  {
    role: 'h3',
    size: '24',
    leading: '1,20',
    tracking: '−0,016em',
    weight: '600',
    use: 'Card titles',
  },
  {
    role: 'h4',
    size: '19',
    leading: '1,30',
    tracking: '−0,010em',
    weight: '600',
    use: 'Labels with weight',
  },
  {
    role: 'body-l',
    size: '20',
    leading: '1,55',
    tracking: '−0,008em',
    weight: '400',
    use: 'Lede paragraphs',
  },
  {
    role: 'body',
    size: '16,5',
    leading: '1,62',
    tracking: '0',
    weight: '400',
    use: 'Reading copy',
  },
  {
    role: 'body-s',
    size: '14,5',
    leading: '1,55',
    tracking: '0,002em',
    weight: '400',
    use: 'Captions, tables',
  },
  {
    role: 'caption',
    size: '11,5',
    leading: '1,40',
    tracking: '0,160em',
    weight: '600',
    use: 'Eyebrows, all caps',
  },
  {
    role: 'button',
    size: '15',
    leading: '1,00',
    tracking: '0,010em',
    weight: '600',
    use: 'Controls',
  },
]

export const SCALE_TOKENS = [
  ['space', '0 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 176'],
  ['radius', '0 · 2 · 8 · 18 · full'],
  ['shadow', '1 hairline · 2 card · 3 float'],
  ['motion', 'fast 120ms · base 220ms · slow 380ms · cubic-bezier(.2,.7,.1,1)'],
] as const

/** Every value below is the token value, not a drawing of it. */
export const SPACE_SCALE = [
  { step: '0', value: 0 },
  { step: '1', value: 4 },
  { step: '2', value: 8 },
  { step: '3', value: 12 },
  { step: '4', value: 16 },
  { step: '5', value: 24 },
  { step: '6', value: 32 },
  { step: '7', value: 48 },
  { step: '8', value: 64 },
  { step: '9', value: 96 },
  { step: '10', value: 128 },
  { step: '11', value: 176 },
] as const

export const RADIUS_SCALE = [
  { step: '0', value: '0px', note: 'a sign, a plate' },
  { step: '1', value: '2px', note: 'a photograph' },
  { step: '2', value: '8px', note: 'a card, a button' },
  { step: '3', value: '18px', note: 'a sheet, a phone' },
  { step: 'full', value: '999px', note: 'a pill, a badge' },
] as const

export const SHADOW_SCALE = [
  { step: '1', note: 'hairline', use: 'a pressed edge' },
  { step: '2', note: 'card', use: 'a card on paper' },
  { step: '3', note: 'float', use: 'a sheet above the page' },
] as const

export const MOTION_SCALE = [
  { step: 'fast', ms: 120, use: 'colour, border, hover' },
  { step: 'base', ms: 220, use: 'a panel, a disclosure' },
  { step: 'slow', ms: 380, use: 'a photograph, a page' },
] as const

export type Photo = {
  src: string
  alt: string
  title: string
  place: string
  role: string
  width: number
  height: number
}

export const PHOTOS: readonly Photo[] = [
  {
    src: '/brand/jakarta/photos/semanggi.webp',
    alt: 'The Semanggi interchange at blue hour, its flyovers lit and traffic drawn as continuous lines.',
    title: 'Junction',
    place: 'Semanggi, blue hour',
    role: 'Hero. The argument of the identity in one frame: roads that meet, not a monument.',
    width: 1600,
    height: 1067,
  },
  {
    src: '/brand/jakarta/photos/monas.webp',
    alt: 'Monas and Merdeka Square from above, midday, the obelisk casting a short shadow over the park.',
    title: 'The plan',
    place: 'Gambir, midday',
    role: 'Heritage. Used small, at the bottom of a page, never as the whole identity.',
    width: 1600,
    height: 1067,
  },
  {
    src: '/brand/jakarta/photos/rooftops.webp',
    alt: 'Towers behind kampung rooftops, daytime, the two scales of the city in one frame.',
    title: 'Two cities',
    place: 'Rooftops and towers',
    role: 'Civic. The supplied “Kota Tua heritage” slot; captioned by what it shows.',
    width: 1600,
    height: 1067,
  },
  {
    src: '/brand/jakarta/photos/nightline.webp',
    alt: 'Night skyline with an elevated road drawn as light trails across the frame.',
    title: 'After the last bus',
    place: 'Light trails',
    role: 'Night scope. The photograph the night surface is calibrated against.',
    width: 1600,
    height: 1067,
  },
  {
    src: '/brand/jakarta/photos/scbd.webp',
    alt: 'The SCBD street canyon at midday, glass towers on both sides and a bus at the far end.',
    title: 'The corridor',
    place: 'SCBD, midday',
    role: 'Transit. Where a wayfinding sign has to work: backlit, at an angle, in glare.',
    width: 1600,
    height: 1067,
  },
]

export type AuditRow = {
  check: string
  result: 'Pass' | 'Partial' | 'Open'
  evidence: string
}

export const AUDIT_ROWS: readonly AuditRow[] = [
  {
    check: 'Mark redrawn, not traced',
    result: 'Pass',
    evidence:
      'The supplied 6000 × 5008 bitmap and the SVG are rasterised at 600 × 501 and compared: 0,989 IoU. 768 px of surplus in the original, 473 in the redraw, all antialiasing along the arc.',
  },
  {
    check: 'Mark at 32px',
    result: 'Pass',
    evidence:
      'Hook, 2:1 corner and stop resolve on paper, on ink and on Senja. Checked at 96, 48, 32 and 24px on the real grounds.',
  },
  {
    check: 'Compact at 16px',
    result: 'Partial',
    evidence:
      'A separate drawing — 0,78S stop, 0,44S gap, no clear space — holding at 16 and 24 (0,918 IoU against the primary’s 0,989: the difference is the redesign). It keeps two shapes, so the “fewer shapes than the primary” gate is not met. The one-shape drawing is the glyph, and the glyph is what ships at 16px.',
  },
  {
    check: 'Wordmark',
    result: 'Pass',
    evidence:
      'Outlined from the variable TTF at wght 800 with −0,045em tracking. No <text> element in any file in the brand folder.',
  },
  {
    check: 'Contrast — light',
    result: 'Partial',
    evidence:
      'Computed from the semantic layer: six district colours fail and are published below. A seventh pair, text-faint on paper at 4,09:1, is also a failure — every tertiary label on the page now ships in text-muted at 6,29:1 and the faint token is reserved for 24px and up.',
  },
  {
    check: 'Contrast — night',
    result: 'Pass',
    evidence:
      '14 pairs, 13 pass. The one failure is Langit-300 as a label on Malam-100 at 4,23:1 — large text only.',
  },
  {
    check: 'Accent is never type',
    result: 'Pass',
    evidence:
      'No small accent type remains: every accent label is a bar, rule, chip, dot or underline, and the only type on an accent ground is ink on Senja at 4,56:1 (the primary button and the wall index chips).',
  },
  {
    check: 'Hero field + plate',
    result: 'Pass',
    evidence:
      'Ten hard-stop bands on a 112° axis; the Semanggi plate is masked at the reading edge and blended luminosity; the mark is repeated at hoarding scale. The copy sits on one 620px tinted plate — cream on the worst band measures 5,20:1 at 0.55 tint, 5,64:1 at 0.58 with backdrop blur — with one type colour, one 40px/600 headline and a 10,5px eyebrow. The field is torn off instead of stopped: the photograph dissolves before the floor, the last stretch is flat palette, and the bottom edge of the hero is cut on a sixteen-tooth line of unequal width and depth with paper showing through. No second object, no skew, no second tear.',
  },
  {
    check: 'Applications wall',
    result: 'Pass',
    evidence:
      'A 12-column bento — 4 + 8 on both rows at 1440, 1 + 2 at 1000, one column at 700. Each artifact sits on a 28px grid plate with a numbered caption and three token chips. The JakLingko card is drawn from scratch at ID-1 proportions: the ten-colour issuer ribbon along the top edge, the outlined lockup at issuer size (2,9mm), a chip, contactless, the number in a tabular grouping and a foil disc on the paper, with the Laut operator panel — mark knocked out, one right-angle route, one operator word at 3,41:1 large text — and no small cream type on Laut, which would fail. Card lift is 3px with a shadow shift, removed under reduced motion; the index chips are ink on Senja at 4,56:1.',
  },
  {
    check: 'Font registered',
    result: 'Pass',
    evidence:
      'Plus Jakarta Sans, variable, wght 200–800, latin subset, 27 kB, embedded as a base64 data URI and applied to body.',
  },
  {
    check: 'Reduced motion',
    result: 'Pass',
    evidence:
      'Durations collapse, the reveal state is applied immediately, image hover transforms are removed and the app cards stop lifting. The still frame is the finished composition.',
  },
  {
    check: '390 and 1440',
    result: 'Pass',
    evidence:
      'Single column at 390; scrollWidth − clientWidth = 0 at 390, 768 and 1440. Hero is 726px at 390 and 880px at 1440. The app wall folds at 1000 and 700; rail hidden below 1320; tables reflow to stacked rows.',
  },
  {
    check: 'Night scope',
    result: 'Pass',
    evidence:
      'html[data-jk="night"] swaps the semantic layer only. All 46 primitives identical in both scopes; nothing is mode-prefixed.',
  },
  {
    check: 'Figma export',
    result: 'Pass',
    evidence:
      'figma-smoke exits 0: 6 pages, 87 variables, 11 text styles, 10 components. 87 = 46 primitives + 21 semantic + 12 space + 5 radius + 3 motion, exactly.',
  },
  {
    check: 'Photography brief vs assets',
    result: 'Partial',
    evidence:
      'The brief assigns one supplied file to “Kota Tua heritage”. The file is a daytime skyline over kampung rooftops. It is captioned by content; the heritage slot is unfilled.',
  },
  {
    check: 'Print proof',
    result: 'Open',
    evidence:
      'No pull on enamel or vinyl, no CMYK conversion tested. Senja at 3,24:1 is a screen measurement; on matte vinyl in afternoon sun it will be worse.',
  },
  {
    check: 'Audience testing',
    result: 'Open',
    evidence:
      'No resident, driver or district officer has seen this. Every claim about clarity is a hypothesis.',
  },
]

export const GAPS = [
  'No citizen has seen it. The palette is the client’s; the argument is a designer’s.',
  'No print proof. Enamel and vinyl behave differently from a screen.',
  'No Pegon or Arabic script. Plus Jakarta Sans covers Latin only, and a Jakarta identity that cannot set a street name in Pegon is incomplete.',
  'No motion identity. The durations exist; a signature transition does not.',
  'No accessibility review by a person who uses it. Contrast is computed; wayfinding under glare, at 1,4 m, with low vision, is not.',
] as const

export const SHIP_CONDITIONS = [
  {
    n: '01',
    title: 'A physical proof',
    body: 'The mark at 24px, printed on enamel, photographed in daylight. Not a screen render of a print.',
  },
  {
    n: '02',
    title: 'A reading test',
    body: 'The type scale read at 1,4 metres, by people who are not designers, under afternoon glare.',
  },
  {
    n: '03',
    title: 'One rebuilt poster',
    body: 'A district office rebuilding a poster from the tokens — without help, and without calling us.',
  },
] as const

export type Decision = {
  title: string
  because: string
  notWhen: string
  breaksNext: string
}

export const DECISIONS: readonly Decision[] = [
  {
    title: 'One stroke, not a monogram',
    because:
      'A monogram names the city; a junction describes it. The stroke turns because the city does.',
    notWhen: 'A district office needs a seal that survives a stamp.',
    breaksNext: 'Any request to put a letterform inside the corner.',
  },
  {
    title: 'Nine ramps, no gradient',
    because:
      'A gradient is a mood. Nine flat ramps are a map you can name out loud.',
    notWhen: 'A single campaign needs one loud field for a week.',
    breaksNext: 'The moment a tenth district is added without a job.',
  },
  {
    title: 'District colour is never type',
    because:
      'Six of nine fail 4,5:1 on paper and two fail 3:1. The rule is the only thing that makes the palette usable.',
    notWhen:
      'Never — the exception is the 24px+ display word, and that is not body copy.',
    breaksNext:
      'A button labelled in white on Senja, which is 3,56:1 and fails.',
  },
  {
    title: 'Night is a scope, not a palette',
    because:
      'Primitives are places and places do not change at night. Only the semantic layer swaps.',
    notWhen:
      'A photograph needs its own dark plate — that is a treatment, not a scope.',
    breaksNext:
      'A second set of primitives named malam-*, which is how a palette doubles.',
  },
  {
    title: 'The wordmark is outlined',
    because:
      'A sign shop does not have the font, and a <text> element is a promise the file cannot keep.',
    notWhen:
      'Live type in an interface — that is the font doing its job, not the wordmark.',
    breaksNext: 'A translation of the name that needs new glyphs.',
  },
  {
    title: 'Dark on orange, not white',
    because:
      'White on Senja is 3,56:1 and fails; ink on Senja is 4,56:1 and passes. That is a measurement, not a taste.',
    notWhen:
      'A large graphic panel, where 3:1 is the requirement and white is louder.',
    breaksNext: 'A brand book that specifies white because it “looks cleaner”.',
  },
]

export const TOKENS_CSS = `:root {
  /* 1 · primitive — the material, named once. Places, not hues. */
  --jk-kertas: #F7F4EE;
  --jk-tinta: #1B2126;
  --jk-senja-100: #F7481B;
  --jk-laut-100: #148BCD;
  --jk-daun-100: #00A062;
  --jk-kebayoran-100: #FCD260;
  --jk-langit-100: #2830D0;

  /* 2 · semantic — the job. Never a raw hex downstream. */
  --jk-surface: var(--jk-kertas);
  --jk-text: var(--jk-tinta);
  --jk-text-muted: var(--jk-aspal-200);
  --jk-accent: var(--jk-senja-100);
  --jk-accent-ink: var(--jk-tinta);   /* 4,56:1 — not white, which fails */
  --jk-transit: var(--jk-laut-100);
  --jk-focus: var(--jk-langit-100);

  /* 3 · scale */
  --jk-space-5: 24px;
  --jk-radius-2: 8px;
  --jk-dur-base: 220ms;
  --jk-ease: cubic-bezier(.2,.7,.1,1);
}`

export const TOKENS_JSON = {
  name: 'Jakarta',
  version: '1.1',
  claim: 'A city of junctions, not a city of monuments.',
  primitive: 46,
  semantic: 21,
  type: 11,
  ramps: [
    'langit',
    'laut',
    'menteng',
    'senja',
    'aspal',
    'kebayoran',
    'daun',
    'ancol',
    'doger',
  ],
  accent: '#F7481B',
  accentInk: '#1B2126',
  mark: {
    unit: 100,
    viewBox: '0 0 650 576',
    stop: 1.38,
    gap: 0.62,
    minDigital: 24,
    minPrint: 8,
  },
} as const

export const OUTPUT_CONTRACT = [
  ['brief.md', 'the six-line brief, the decisions and what each one costs'],
  ['mark.svg', 'primary, compact, glyph, wordmark, lockup — ink and reverse'],
  [
    'tokens.css',
    '46 primitives, 21 semantic roles, eleven type roles, both scopes',
  ],
  ['tokens.json', 'the same values, DTCG-shaped, for the Figma export'],
  ['index.html', 'the specimen: one file, no network requests'],
  ['audit.md', 'seventeen checks, seven published failures, named gaps'],
] as const
