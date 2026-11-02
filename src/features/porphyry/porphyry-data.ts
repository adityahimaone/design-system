export const META = {
  name: 'Porphyry',
  caseNumber: 'Case 10',
  version: '1.0.0',
  date: 'October 2026',
  href: '/design-system/porphyry',
  essence: 'Porphyry, marble, gold leaf and one dark stage.',
  promise:
    'A classical stage for modern interfaces: one stone, one light, a cast that stands in front of the word.',
  oneSentence:
    'A page composed like a stage: one stone, one light, and a cast that stands in front of the word.',
  material: 'Porphyry + marble + gold leaf + one dark stage',
  track: 'Constructed — architectural block',
  family: 'architectural block',
  enemy:
    'The template: flat cards on a grey field, depth faked with shadows, light faked with a gradient.',
  signature:
    'A stage opening cut into a block of porphyry, with one gold threshold and a quarried corner.',
  licence:
    'Cinzel, Jost and Pinyon Script are SIL Open Font License. The statues are Unsplash stock, credited in the audit.',
}

export const NAV = [
  { id: 'stage', label: 'Stage' },
  { id: 'story', label: 'Story' },
  { id: 'cast', label: 'Cast' },
  { id: 'mark', label: 'Mark' },
  { id: 'stone', label: 'Stone' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
] as const

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: StoryBeat[] = [
  {
    beat: 'The belief',
    line: 'A screen can be composed like a stage: a ground, a light, and figures that stand on their own depth.',
  },
  {
    beat: 'The enemy',
    line: 'The template. Flat cards on a grey field, depth faked with a drop shadow, light faked with a gradient.',
  },
  {
    beat: 'The word',
    line: 'The wordmark is the back wall. It arrives as an outline, fills with marble from the floor, then holds the room while the cast rises in front of it.',
  },
  {
    beat: 'The cast',
    line: 'Photographs of marble are keyed off their own black ground by luminance. No cut-outs, no alpha channels, no stock silhouette.',
  },
  {
    beat: 'The material',
    line: 'Porphyry is imperial stone: deep, red, and not a neutral. Marble is the lit ink. Gold is punctuation, never a paragraph.',
  },
  {
    beat: 'The rule',
    line: 'One light, one loud field, zero radius. Depth is an event in time, not a texture on a card.',
  },
  {
    beat: 'The gap',
    line: 'This is a screen, not a press proof. The two-ink print is composited in software; no gold leaf was harmed.',
  },
]

export type Decision = {
  title: string
  decision: string
  because: string
  notWhen: string
  breaksNext: string
}

export const DECISIONS: Decision[] = [
  {
    title: 'A dark stage, with a vellum proof surface',
    decision:
      'The system defaults to the stage (a near-black porphyry ground) and keeps a full light theme for reading and printing.',
    because:
      'Light has to be an event. On a light page, a glow is a decoration; on a dark stage, it is the only source of depth.',
    notWhen:
      'The surface is a long document, a table, or anything read for more than a few minutes. Switch to vellum: ink on vellum is 15.4:1.',
    breaksNext:
      'The day someone adds a third surface. Two grounds are a system; three is a theme switcher with no opinion.',
  },
  {
    title: 'Gold is the only accent',
    decision:
      'Gold carries every signal: the lit edge of the mark, eyebrows, focus, the primary action. Porphyry is a field, never an accent.',
    because:
      'A stone ground plus a gold light is the whole palette argument. A second accent would turn the stage into a poster.',
    notWhen:
      'Gold is set on porphyry (4.28:1) or used for body copy. Use marble on the stone and gold on the stage.',
    breaksNext:
      'An alert that needs a warm colour. Ember exists for invalid only; it is not a second accent, and it should never appear on marketing copy.',
  },
  {
    title: 'Key the figures by luminance, not by cut-out',
    decision:
      'Each statue is an ordinary photograph on a black ground, masked by its own luminance. The softness and threshold are props.',
    because:
      'A photograph can be swapped without redrawing. The figure is not a PNG with an alpha edge; it is a print transfer that can be graded.',
    notWhen:
      'The subject was shot on white, or the ground is not near-black. Then the mask keeps the room and deletes the statue.',
    breaksNext:
      'A photograph with a bright window behind the figure. The threshold cannot tell a highlight from the subject.',
  },
  {
    title: 'The mark is cut, not rounded',
    decision:
      'A block with a trapezoid opening: the stone is the frame, the gold threshold is the floor, and the top-right corner is cut as it came out of the quarry. Zero radius on the mark, the cards, the fields and the buttons.',
    because:
      'The block is architecture. A radius would make it a tile; the one place softness appears is the light, not the geometry.',
    notWhen:
      'A native control on the host platform (a checkbox, a radio, a file picker). The system does not repaint what the OS owns.',
    breaksNext:
      'A host component whose focus ring is round. Keep the ring but match the token; do not round the field to meet it.',
  },
  {
    title: 'The compact mark is a separate drawing',
    decision:
      'At 16px the opening widens to 24 units and the threshold to 9. It is not the primary mark scaled down.',
    because:
      'At 16px the 8-unit threshold becomes 2px and the opening loses its taper. The compact widens both so the portal survives.',
    notWhen:
      'The mark is only ever used at 32px or larger. Then the primary drawing is enough.',
    breaksNext:
      'A 12px favicon. Use the glyph, which drops the gold and keeps the silhouette.',
  },
  {
    title: 'Motion is a curtain, not a flourish',
    decision:
      'One authored sequence: outlines, marble fill, flood, cast, sheen. Under reduced motion the same beats resolve to their end state at once.',
    because:
      'The sequence is the argument — the word is the wall, the cast is in front. If it is decorative, it is a video with a skip link.',
    notWhen:
      'The page is a tool. Then the loader is 200ms of opacity, or nothing at all.',
    breaksNext:
      'A second animated idea. Two timelines means neither one is the signature.',
  },
]

export type Swatch = {
  token: string
  name: string
  hex: string
  job: string
  contrast: string
  note: string
}

export const PALETTE: Swatch[] = [
  {
    token: '--po-stage',
    name: 'Stage',
    hex: '#160a0f',
    job: 'The dark of the auditorium',
    contrast: '16.18:1 with marble',
    note: 'The ground. Never pure black: porphyry keeps a red shadow.',
  },
  {
    token: '--po-porphyry',
    name: 'Porphyry',
    hex: '#7a1f3d',
    job: 'The loud field',
    contrast: '8.39:1 with marble',
    note: 'Imperial stone. A surface, never a paragraph.',
  },
  {
    token: '--po-porphyry-deep',
    name: 'Stone shadow',
    hex: '#4a1226',
    job: 'The shadow inside the stone',
    contrast: '12.48:1 with marble',
    note: 'For inset plates and quiet loud bands.',
  },
  {
    token: '--po-gold',
    name: 'Gold leaf',
    hex: '#c9a45c',
    job: 'The signal: one light',
    contrast: '8.25:1 on stage',
    note: 'The only accent. Focus, eyebrows, the lit edge.',
  },
  {
    token: '--po-gold-bright',
    name: 'Gold, lit',
    hex: '#e3c98e',
    job: 'The edge of the light',
    contrast: '12.00:1 on stage',
    note: 'The sheen at the top of the gold, never a second accent.',
  },
  {
    token: '--po-marble',
    name: 'Marble',
    hex: '#f2ead9',
    job: 'Lit marble; the reading ink',
    contrast: '16.18:1 on stage',
    note: 'Warm, never white. Pure white cracks against the stone.',
  },
  {
    token: '--po-marble-dim',
    name: 'Marble, second',
    hex: '#b7a99b',
    job: 'Captions and meta',
    contrast: '8.45:1 on stage',
    note: 'The second ink. Still an ink, not a disabled state.',
  },
  {
    token: '--po-vellum',
    name: 'Vellum',
    hex: '#f4ecdd',
    job: 'The proof surface',
    contrast: '15.40:1 with ink',
    note: 'The page when it is paper. The only light ground.',
  },
  {
    token: '--po-ink',
    name: 'Ink',
    hex: '#241017',
    job: 'The reading ink on vellum',
    contrast: '15.40:1 on vellum',
    note: 'Not black: the same red shadow as the stage.',
  },
  {
    token: '--po-porphyry-ink',
    name: 'Stone ornament',
    hex: '#a6395c',
    job: 'The stone as type on the stage',
    contrast: '3.10:1 — fails',
    note: 'Ornament only. Published because a palette that hides its fails is a brochure.',
  },
]

export type ContrastPair = {
  pair: string
  ratio: string
  use: string
  fail?: boolean
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { pair: 'Marble on stage', ratio: '16.18:1', use: 'Body and display' },
  { pair: 'Gold on stage', ratio: '8.25:1', use: 'Signal type and links' },
  { pair: 'Marble-dim on stage', ratio: '8.45:1', use: 'Captions and meta' },
  {
    pair: 'Marble on porphyry',
    ratio: '8.39:1',
    use: 'Text on the loud field',
  },
  { pair: 'Marble on stone shadow', ratio: '12.48:1', use: 'Inset plates' },
  {
    pair: 'Ink on vellum',
    ratio: '15.40:1',
    use: 'Body and display, light theme',
  },
  {
    pair: 'Porphyry on vellum',
    ratio: '8.56:1',
    use: 'Signal type, light theme',
  },
  {
    pair: 'Gold ink on vellum',
    ratio: '5.63:1',
    use: 'Gold as type, light theme',
  },
  { pair: 'Ink on gold', ratio: '7.70:1', use: 'Primary button label' },
  {
    pair: 'Gold on porphyry',
    ratio: '4.28:1',
    use: 'Never type. A hairline only',
    fail: true,
  },
  {
    pair: 'Stone ornament on stage',
    ratio: '3.10:1',
    use: 'Ornament. Never letters',
    fail: true,
  },
]

export type TypeRow = {
  role: string
  family: string
  size: string
  line: string
  use: string
}

export const TYPE_SCALE: TypeRow[] = [
  {
    role: 'Display',
    family: 'Cinzel 400–600',
    size: 'clamp 41–80',
    line: '1.02',
    use: 'Inscriptions: the wordmark, the hero line, section titles',
  },
  {
    role: 'H2',
    family: 'Cinzel 400',
    size: 'clamp 29–43',
    line: '1.1',
    use: 'The argument under each numeral',
  },
  {
    role: 'H3',
    family: 'Jost 500',
    size: '20',
    line: '1.25',
    use: 'Card titles, form legends',
  },
  {
    role: 'Body',
    family: 'Jost 400',
    size: '17',
    line: '1.6',
    use: 'Reading. Measure 62–72 characters',
  },
  {
    role: 'Small',
    family: 'Jost 400',
    size: '15',
    line: '1.55',
    use: 'Captions and secondary copy',
  },
  {
    role: 'Label',
    family: 'Jost 500',
    size: '11',
    line: '1.4 · 0.22em caps',
    use: 'Eyebrows, field labels, table heads',
  },
  {
    role: 'Figure',
    family: 'Jost 500 · tabular',
    size: '13',
    line: '1.4',
    use: 'Ratios, counts, plate numbers',
  },
  {
    role: 'Signature',
    family: 'Pinyon Script 400',
    size: '1.5em, inline',
    line: '1',
    use: 'One word at a time. Never a paragraph',
  },
]

export type MarkSpec = { key: string; value: string }

export const MARK_SPECS: MarkSpec[] = [
  { key: 'Grid', value: '64 units, 8-unit margin' },
  { key: 'Block', value: '40 × 52 units, stone' },
  { key: 'Opening', value: 'trapezoid, 20 → 10 units, 30 tall' },
  { key: 'Threshold', value: '20 × 8 units, gold, fill only' },
  { key: 'Corner', value: '8-unit quarried cut, top right' },
  { key: 'Compact', value: '44 × 52 block, 24 × 9 threshold' },
  { key: 'Stamp', value: 'One ink, currentColor' },
  { key: 'Wordmark', value: 'Cinzel 500, outlined, 0.085em' },
  { key: 'Minimum', value: '24px mark · 40px wordmark · 16px compact' },
  { key: 'Files', value: 'public/brand/porphyry/' },
]

export type Rejected = { name: string; note: string }

export const REJECTED_MARKS: Rejected[] = [
  {
    name: 'The old gilded P',
    note: 'The previous mark: a typed P in a frame. The gold bowl was doing all the work, and the letter said nothing the wordmark did not already say.',
  },
  {
    name: 'The meander ring',
    note: 'The Greek key around a circle is the component’s best ornament and the worst logo: a badge, an orbit, a stamp. It stays in the stage as a loading device.',
  },
  {
    name: 'The curtain',
    note: 'Two stone curtains and a gold seam. At 16px the seam and the gap merge into a pause icon; the stage read disappears.',
  },
  {
    name: 'The capital',
    note: 'Abacus, gold shadow gap, shaft, plinth. It reads as a T, or a table, before it reads as a column.',
  },
  {
    name: 'The arch P',
    note: 'A Didone P with a gold foot. Much better than the old letter, but still a letter; the wordmark already carries the name.',
  },
  {
    name: 'The gold doorway',
    note: 'Filling the opening with gold made the strongest 16px mark and the weakest identity: the stone became a frame around a gold wedge.',
  },
]

export type StageSpec = { key: string; value: string }

export const STAGE_SPECS: StageSpec[] = [
  { key: 'Stage', value: 'clamp(560px, 86vh, 780px), definite height' },
  { key: 'Cast', value: '3 keyed photographs + 1 softened backdrop' },
  {
    key: 'Mask',
    value: 'luminance → linear transfer, threshold 0.2, softness 0.16',
  },
  {
    key: 'Grade',
    value: 'two-ink print: stage ground → gold-bright highlight',
  },
  { key: 'Light', value: '7 shafts + ≤140 dust motes on one canvas' },
  { key: 'Word', value: 'Cinzel 400, fitted to 92% of the stage width' },
  { key: 'Tilt', value: '2.5°, pointer-eased; 0 under reduced motion' },
  { key: 'Exit', value: 'clip-path curtain 1.2s, cast lifts 12%' },
]

export type Part = { name: string; job: string }

export const PARTS: Part[] = [
  {
    name: 'Button',
    job: 'Gold fill, ink label, square. One primary per view.',
  },
  {
    name: 'Quiet button',
    job: 'Transparent with a current-colour rule. Never a second accent.',
  },
  {
    name: 'Field',
    job: 'A sunken slab with a 1px engraved edge; the label sits outside it.',
  },
  {
    name: 'Select',
    job: 'Native select on a slab. The system does not rebuild the platform.',
  },
  {
    name: 'Switch',
    job: 'A gold lever with a visible on/off word, not colour alone.',
  },
  {
    name: 'Card',
    job: 'A raised plate with one engraved rule. No shadow: the light is the depth.',
  },
  {
    name: 'Chip',
    job: 'A square tag for the cast material. Filled or outlined, never rounded.',
  },
  {
    name: 'Plate',
    job: 'The specimen frame: a vexillum number, a caption and a rule.',
  },
]

export type VoiceSample = { ctx: string; line: string; bad?: string }

export const VOICE_SAMPLES: VoiceSample[] = [
  {
    ctx: 'Hero',
    line: 'A page composed like a stage: one stone, one light, a cast in front of the word.',
    bad: 'Unleash the power of classical design.',
  },
  {
    ctx: 'Empty state',
    line: 'The stage is empty. Add a figure and it will stand on its own depth.',
  },
  {
    ctx: 'Field error',
    line: 'This title is longer than the plate. Cut it to 48 characters, or set a second line.',
  },
  {
    ctx: 'Release note',
    line: 'v1.0 — the stage, the cast, the compact P. The meander stays in the loader.',
  },
]

export type AuditRow = {
  check: string
  result: string
  state: 'pass' | 'scope' | 'open'
  evidence: string
}

export const AUDIT_ROWS: AuditRow[] = [
  {
    check: 'Detach gate vs six siblings',
    result: 'Pass · weakest 73/100',
    state: 'pass',
    evidence: 'node scripts/detach-check.mjs — see the table below',
  },
  {
    check: 'No zero-circle mark, no fill + stroke',
    result: 'Pass',
    state: 'pass',
    evidence: 'mark.svg: 2 filled shapes, 0 strokes, one 8-unit gold threshold',
  },
  {
    check: 'Compact is a separate drawing',
    result: 'Pass',
    state: 'pass',
    evidence: 'mark-compact.svg: 44-unit block, 24 × 9 threshold',
  },
  {
    check: 'Wordmark is outlined',
    result: 'Pass',
    state: 'pass',
    evidence: 'wordmark.svg — 8 glyph paths from Cinzel, no <text>',
  },
  {
    check: 'Contrast pairs measured',
    result: '11 pairs · 2 published fails',
    state: 'pass',
    evidence: 'WCAG luminance on the semantic layer',
  },
  {
    check: 'Type gate (body 17, labels 11, measure)',
    result: 'Pass',
    state: 'pass',
    evidence: 'Jost 17/1.6 · Cinzel display only',
  },
  {
    check: 'Reduced motion resolves the stage',
    result: 'Pass',
    state: 'pass',
    evidence: 'Playwright: phase landing after 0.9s, counter opacity 0',
  },
  {
    check: 'Form states and focus',
    result: 'Pass',
    state: 'pass',
    evidence:
      'submit → “Plate saved”; invalid aria + text; first Tab ring 2px gold',
  },
  {
    check: 'Browser pass 1440 / 390',
    result: 'Pass · 0 errors',
    state: 'pass',
    evidence: 'No console errors, no failed requests, no overflow',
  },
  {
    check: 'Mark score (16 / 32 / 64)',
    result: 'Pass',
    state: 'pass',
    evidence: 'score-mark.py: PASS porphyry',
  },
  {
    check: 'Screen-reader stage',
    result: 'Partial',
    state: 'open',
    evidence: 'aria-busy + a live region; no formal SR pass was recorded',
  },
  {
    check: 'Print proof of the two inks',
    result: 'Not verified',
    state: 'open',
    evidence: 'The grade is composited, not printed',
  },
]

export const GAPS = [
  'The statues are Unsplash stock (Apollo Belvedere by Nayani Teixeira, Hercules by Şafak Atalay, the standing figure by Clarence E. Hsu, David by Jack Hunter). The luminance key assumes a black ground; a differently lit photograph will fail.',
  'The stage has no server-rendered equivalent. It is a client ornament above a static page; the page is readable without it.',
  'The two-ink grade is a software composite (SVG mask + two blend layers). It has not been proofed on a press, and the gold leaf is a colour, not a foil.',
  'The vellum theme is complete, but the stage component keeps its own palette prop. There are two token paths into the same stage; only the page chrome flips with the theme.',
  'No automated axe run and no assistive-technology transcript. The browser pass is Chrome at 1440 and 390; Safari and Firefox were not run.',
]

export const FIGURES = [
  {
    src: '/brand/porphyry/cast/apollo.jpg',
    alt: 'The Apollo Belvedere, photographed against black',
    x: 20,
    y: 101,
    h: 58,
    depth: 1.25,
    flip: true,
    phone: false,
  },
  {
    src: '/brand/porphyry/cast/hercules.jpg',
    alt: 'The torso of a marble Hercules',
    x: 82,
    y: 102,
    h: 66,
    depth: 1.15,
    phone: false,
  },
  {
    src: '/brand/porphyry/cast/flowers.jpg',
    alt: 'A marble figure holding flowers, on a pedestal',
    x: 52,
    y: 101,
    h: 96,
    depth: 0.8,
  },
] as const

export const BACKDROP = '/brand/porphyry/cast/david.jpg'

export const STAGE_PALETTE = {
  stage: '#2a0d1a',
  ground: '#140a0e',
  text: '#f2ead9',
  muted: '#b7a99b',
  accent: '#c9a45c',
  word: '#f2ead9',
  rule: '#4a3238',
  glow: '#ffd9a0',
  highlight: '#f0d7a4',
}

export const TOKENS_CSS = `.po-scope {
  --po-stage: #160a0f;
  --po-porphyry: #7a1f3d;
  --po-gold: #c9a45c;
  --po-gold-bright: #e3c98e;
  --po-marble: #f2ead9;
  --po-marble-dim: #b7a99b;
  --po-vellum: #f4ecdd;
  --po-ink: #241017;
  --po-rule-dark: #4a3238;

  --po-surface: var(--po-stage);
  --po-text: var(--po-marble);
  --po-text-muted: var(--po-marble-dim);
  --po-rule: var(--po-rule-dark);
  --po-accent: var(--po-gold);
  --po-accent-bright: var(--po-gold-bright);
  --po-focus: var(--po-gold);

  --po-font-display: 'Cinzel', 'Times New Roman', serif;
  --po-font-reading: 'Jost', 'Futura', sans-serif;
  --po-font-script: 'Pinyon Script', cursive;

  --po-radius: 0;
  --po-rule-width: 1px;
  --po-ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html[data-po='vellum'] .po-scope {
  --po-surface: var(--po-vellum);
  --po-text: var(--po-ink);
  --po-text-muted: var(--po-vellum-muted);
  --po-rule: var(--po-rule-light);
  --po-accent: var(--po-porphyry);
  --po-focus: var(--po-porphyry);
}`

export const MASK_RECIPE = `<!-- The photograph's own luminance becomes the mask. -->
<filter id="key" color-interpolation-filters="sRGB">
  <feColorMatrix type="matrix"
    values="0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0.2126 0.7152 0.0722 0 0
            0      0      0      1 0" />
  <feComponentTransfer>
    <feFuncR type="linear" slope="6.25" intercept="-0.75" />
    <feFuncG type="linear" slope="6.25" intercept="-0.75" />
    <feFuncB type="linear" slope="6.25" intercept="-0.75" />
  </feComponentTransfer>
</filter>

<mask id="figure" maskUnits="userSpaceOnUse"
      maskContentUnits="userSpaceOnUse"
      width="420" height="720" style="mask-type:luminance">
  <image href="/cast/flowers.jpg" width="420" height="720"
         preserveAspectRatio="none" filter="url(#key)" />
</mask>

<!-- threshold 0.2 · softness 0.16 → slope 6.25, intercept −0.75 -->
<div style="mask: url(#figure)"> … </div>`

export const PRINT_RECIPE = `/* The two-ink print: the ground lightens, the highlight multiplies.
   Two flat layers, no gradient pretending to be ink. */
.fig img { filter: grayscale(1) contrast(1.12); }

.fig .duo-a {
  background: var(--po-stage);     /* the darkest ink */
  mix-blend-mode: lighten;
}

.fig .duo-b {
  background: var(--po-highlight); /* the lit marble */
  mix-blend-mode: multiply;
}

/* The result is a print transfer, not a photograph:
   threshold keying cuts the ground; the grade collapses the middle. */`

export type DetachRow = {
  ref: string
  score: number
  parts: string
  note: string
}

export const DETACH: DetachRow[] = [
  {
    ref: 'Ledger',
    score: 82,
    parts:
      'hue 12 · value 15 · material 15 · geo 15 · type 10 · structure 5 · copy 10',
    note: 'Ledger declares no accent primitives, so hue scored neutral. The two systems share no audience.',
  },
  {
    ref: 'Riso Co.',
    score: 81,
    parts:
      'hue 25 · value 8 · material 3 · geo 15 · type 10 · structure 10 · copy 10',
    note: 'Riso predates the DNA object, so material could not be compared; the display face and the sections did the work.',
  },
  {
    ref: 'Cove',
    score: 82,
    parts:
      'hue 25 · value 2 · material 15 · geo 12 · type 10 · structure 9 · copy 9',
    note: 'Closest in value structure — two dark-first systems. Material and structure separate them.',
  },
  {
    ref: 'Strand',
    score: 83,
    parts:
      'hue 22 · value 5 · material 15 · geo 12 · type 10 · structure 9 · copy 9',
    note: 'Gold sits 22° from Strand’s copper. Under the 25° line, so the value and structure had to carry it.',
  },
  {
    ref: 'Vitrine',
    score: 87,
    parts:
      'hue 25 · value 8 · material 15 · geo 15 · type 10 · structure 5 · copy 9',
    note: 'Vitrine is light-first glass; the stage is its inverse.',
  },
  {
    ref: 'Hachure',
    score: 73,
    parts:
      'hue 25 · value 5 · material 3 · geo 15 · type 10 · structure 5 · copy 10',
    note: 'The weakest pair: Hachure also declares no DNA object, and its paper ground is mid-value. 73 is the honest floor.',
  },
]
