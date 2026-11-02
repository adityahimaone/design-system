/**
 * Huginn — the case file, v3.0.
 *
 * The system is one primitive (a 14-unit cell on a 3-unit gap) applied to a
 * painting, a name and a mark. Every ratio below is measured from the semantic
 * layer; every grid number comes from the mark geometry. Change a value here and
 * change it in `huginn-tokens.css` in the same commit.
 */

export type NavItem = { id: string; label: string }

export const NAV: readonly NavItem[] = [
  { id: 'cell', label: 'The cell' },
  { id: 'dissolve', label: 'The dissolve' },
  { id: 'marks', label: 'Marks' },
  { id: 'field', label: 'The field' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
  { id: 'surface', label: 'The surface' },
]

export const META = {
  name: 'Huginn',
  caseNumber: 'Case 03',
  version: 'v3.0',
  date: '29 Oct 2026',
  promise: 'A picture becomes cells. A name becomes cells.',
  oneSentence:
    'Everything Huginn prints is a cell — the painting, the name and the mark — and one cell always leaves the grid, because that is what thought does.',
} as const

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'A studio’s material is the grid. A photograph, a name and a mark all become the same cells, so nothing has to be styled to look printed — it is printed.',
  },
  {
    beat: 'Enemy',
    line: 'The editorial dark-mode portfolio: a big serif, a duotone photograph, a gradient at the fold. And “dither” used as a texture overlay instead of a rendering rule.',
  },
  {
    beat: 'Mark',
    line: 'Five cells hold the picture. The sixth has left the grid and is printed vermilion, because thought flies out and comes back by supper.',
  },
  {
    beat: 'Material',
    line: 'One vermilion field, ink black, bone paper, an ordered dither at 22 rows, and a cobalt focus ring as the only cold note in the system.',
  },
  {
    beat: 'Voice',
    line: 'Colophon voice: declarative, dated, sourced. A studio that names the painting, the museum and the licence on its own footer.',
  },
  {
    beat: 'Proof',
    line: '18.85:1 ink on bone, 4.54:1 bone on the field — which is why the field never carries small type — a mark that reads at 16px, and a wordmark drawn in cells with no font.',
  },
  {
    beat: 'Gap',
    line: 'The dither is a canvas, not a halftone screen. There is no print proof, no cast (the track is constructed), and the cell drawing is Latin-only.',
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
    title: 'The cell is the only primitive',
    decision:
      'One 14-unit square on a 3-unit gap, on a 64 grid. The mark, the dither and the wordmark are all that square repeated.',
    because:
      'A grid that can draw a painting can draw a name and a mark. A second primitive would be a second style, and the page would need a rule for when to use which.',
    notWhen:
      'The footer’s dither is a pixel canvas, not a cell grid — it is the same rule at 1px, not a new shape. Do not mix the two scales in one composition.',
    breaksNext:
      'At 16px the 3-unit gap disappears into the ink, so the compact redraws three cells at 8 units. It is not a scale-down.',
  },
  {
    title: 'One cell always leaves the grid',
    decision:
      'The sixth cell sits 6 units off the grid and is the only vermilion in the mark. In the one-colour stamp it is still off-grid, just in ink.',
    because:
      'A grid with no exception is a texture. The exception is what makes it a mark, and it is the only place the field colour is allowed inside the logo.',
    notWhen:
      'Any layout that snaps the mark to a 14px cell grid re-aligns the escapee and kills the idea. Place it by its box, never by its cells.',
    breaksNext:
      'A mark used at 16px on a busy photograph: the escapee becomes a speck and the reading is “six dots”, not “one leaving”.',
  },
  {
    title: 'Vermilion is a field, never a paragraph',
    decision:
      'The field is a full band or a full card. Type on it is bone at 24px and up, or ink at any size.',
    because:
      'Bone on the field measures 4.54:1 — it passes AA for body text by 0.04 and fails the moment the field is printed at less than full coverage. Ink on the field is 4.15:1 and only clears large text.',
    notWhen:
      'Captions, metadata and form notes: those move off the field onto bone. The field never carries a 13px line.',
    breaksNext:
      'A second loud field on the same page. Two vermilion bands cancel each other, and the page loses its one shout.',
  },
  {
    title: 'The wordmark is drawn in cells, not set',
    decision:
      'The name is 22 rows of cells, outlined, at a fixed 950 × 200 box. There is no blackletter font on this page and no live text in any logo file.',
    because:
      'A font failure must not change the name, and the cells are the same primitive as the mark — the wordmark is not a second idea, it is the mark spelled out.',
    notWhen:
      'Below 40px the mono carries the name. The cell drawing is never squeezed to fit a header.',
    breaksNext:
      'A second script: the cell drawing is Latin-only, and there is no rule yet for a name that needs two.',
  },
]

export type Ink = {
  token: string
  name: string
  hex: string
  short: string
  job: string
  contrast: string
}

export const PALETTE: readonly Ink[] = [
  {
    token: '--hg-field',
    name: 'Field',
    hex: '#E2281B',
    short: '4.54:1 with bone',
    job: 'The one loud field per page. Bands, plates, the escapee.',
    contrast: '4.54:1 with bone',
  },
  {
    token: '--hg-ink',
    name: 'Ink',
    hex: '#100F0E',
    short: '18.85:1 on bone',
    job: 'Every word, every rule, every cell that stays in the grid.',
    contrast: '18.85:1',
  },
  {
    token: '--hg-bone',
    name: 'Bone',
    hex: '#FFFDF9',
    short: 'The raised sheet',
    job: 'The lightest paper. Type on the field, cards, plates.',
    contrast: '18.85:1 with ink',
  },
  {
    token: '--hg-chalk',
    name: 'Chalk',
    hex: '#F4EFE5',
    short: 'The page ground',
    job: 'The reading ground. Everything sits on chalk before it sits on bone.',
    contrast: '16.71:1 with ink',
  },
  {
    token: '--hg-sheet',
    name: 'Sheet',
    hex: '#EBE5D8',
    short: 'Sunken, never text',
    job: 'Inset panels and the wordmark plate. Never a text ground below 13px.',
    contrast: '15.26:1 with ink',
  },
  {
    token: '--hg-cobalt',
    name: 'Cobalt',
    hex: '#1B2DB0',
    short: '8.94:1 — focus only',
    job: 'The only cold note. Focus rings and one link state; never decoration.',
    contrast: '8.94:1 on chalk',
  },
]

export const CONTRAST_PAIRS: readonly {
  pair: string
  ratio: string
  use: string
  fail?: boolean
}[] = [
  { pair: 'ink on bone', ratio: '18.85:1', use: 'Body and display, any size' },
  { pair: 'ink on chalk', ratio: '16.71:1', use: 'The page ground' },
  { pair: 'ink on sheet', ratio: '15.26:1', use: 'Inset panels' },
  {
    pair: 'bone on the field',
    ratio: '4.54:1',
    use: 'Large text on the field only',
  },
  {
    pair: 'ink on the field',
    ratio: '4.15:1',
    use: 'Large text only — 24px and up',
  },
  {
    pair: 'vermilion as type',
    ratio: '6.80:1',
    use: 'Eyebrows, numerals, links',
  },
  {
    pair: 'cobalt on chalk',
    ratio: '8.94:1',
    use: 'Focus ring and one link state',
  },
  { pair: 'muted on chalk', ratio: '6.50:1', use: 'Captions, colophon, meta' },
  { pair: 'chalk on ink', ratio: '16.71:1', use: 'The night surface' },
  {
    pair: 'field lift on ink',
    ratio: '6.24:1',
    use: 'Vermilion type at night',
  },
  {
    pair: 'bone-mute on chalk',
    ratio: '1.59:1',
    use: 'Disabled only. Never a label',
    fail: true,
  },
]

export type MarkSpec = { key: string; value: string }

export const MARK_SPECS: readonly MarkSpec[] = [
  { key: 'Grid', value: '64 units · 14 unit cell · 3 unit gap' },
  { key: 'Cells', value: '5 in the grid, 1 leaving' },
  { key: 'Escape', value: '6 units off-grid, vermilion' },
  { key: 'Minimum', value: '24px mark · 110px lockup' },
  { key: 'Compact', value: '16px — three cells at 8 units' },
  { key: 'Clear space', value: 'x = one cell, all four sides' },
  { key: 'Wordmark', value: '22 rows of cells, 950 × 200' },
]

export type RejectedMark = { name: string; note: string }

export const REJECTED_MARKS: readonly RejectedMark[] = [
  {
    name: 'Two brackets and a keystone',
    note: 'The v2 mark: an architectural diagram. It said “framed”, not “cells”, and the diamond did the work of an accent.',
  },
  {
    name: 'A blackletter H',
    note: 'A typed initial in a box. The wordmark already carries the letterform; the mark has to carry the grid.',
  },
  {
    name: 'Raven in cells',
    note: 'A 5 × 6 bird. Legible at 64, a smudge at 24, and it turned the studio into a birdwatching brand.',
  },
  {
    name: 'A single cell with a hole',
    note: 'One square reads as an app icon. The idea needs at least two cells to be about a grid.',
  },
  {
    name: 'Halftone gradient square',
    note: 'A texture, not a silhouette. It would need a second mark to be a logo, and the footer already owns the dither.',
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
    family: 'Bodoni Moda 400',
    size: '44–84px',
    line: '1',
    use: 'One per page',
  },
  {
    role: 'h2',
    family: 'Bodoni Moda 400',
    size: '28–42px',
    line: '1.1',
    use: 'Section heads',
  },
  {
    role: 'h3',
    family: 'Bodoni Moda 500',
    size: '20px',
    line: '1.25',
    use: 'Plate titles',
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
    use: 'UI copy, plate body',
  },
  {
    role: 'caption',
    family: 'Geist Mono 400',
    size: '13px',
    line: '1.45',
    use: 'Colophon, sources',
  },
  {
    role: 'label',
    family: 'Geist Mono 500',
    size: '11px',
    line: '1.2',
    use: 'Mono caps, 0.2em',
  },
]

export type Part = { name: string; job: string }

export const PARTS: readonly Part[] = [
  {
    name: 'Button',
    job: 'Ink on chalk, or bone on the field. Two weights, never two loud buttons.',
  },
  {
    name: 'Slip',
    job: 'A field printed on a slip: 1px perimeter, label above, note below.',
  },
  {
    name: 'Cell',
    job: 'The switch is two cells. Pressed fills the second one and says so.',
  },
  {
    name: 'Plate',
    job: 'A card with one cell cut from a corner — the only ornament a plate gets.',
  },
  {
    name: 'Index',
    job: 'A number and a source. Mono caps, one rule, no fill.',
  },
  {
    name: 'Tabs',
    job: 'Two surfaces: the active tab is ink, the inactive one is the sheet.',
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
    evidence: 'Five cells and the escapee read on chalk and on ink',
    state: 'pass',
  },
  {
    check: 'compact / 16px',
    result: 'Pass',
    evidence: 'Separate drawing: three cells at 8 units, wider gap',
    state: 'pass',
  },
  {
    check: 'wordmark',
    result: 'Pass',
    evidence: '22 rows of cells, outlined; no <text> in any logo file',
    state: 'pass',
  },
  {
    check: 'escape',
    result: 'Pass',
    evidence: '6 units off-grid in every variant, including the stamp',
    state: 'pass',
  },
  {
    check: 'contrast',
    result: 'Pass',
    evidence:
      '10 pairs computed; 4.15:1 is the lowest, and it is large-text only',
    state: 'pass',
  },
  {
    check: 'dither',
    result: 'Pass',
    evidence:
      'Ordered 4 × 4 Bayer on canvas; the plate below is the same matrix in CSS',
    state: 'pass',
  },
  {
    check: 'reduced motion',
    result: 'Pass',
    evidence: 'The footer stops dissolving; the still frame is the design',
    state: 'pass',
  },
  {
    check: '390px',
    result: 'Pass',
    evidence:
      'Single column, no horizontal scroll, the field band keeps its edge',
    state: 'pass',
  },
  {
    check: 'forms',
    result: 'Partial',
    evidence: 'Slip tokens ship; the error summary and file field do not',
    state: 'scope',
  },
  {
    check: 'cast',
    result: 'Out of scope',
    evidence: 'Constructed track — a cell cast would be a second logo set',
    state: 'scope',
  },
  {
    check: 'print proof',
    result: 'Open',
    evidence: 'No pull on real stock; field coverage is unmeasured',
    state: 'open',
  },
]

export const GAPS: readonly string[] = [
  'No print proof: vermilion coverage on uncoated stock is unmeasured, and the dither is a canvas.',
  'No halftone screen: the 22-row dither is a rendering rule, not a separation.',
  'The error summary and the file field are not built.',
  'The cell drawing is Latin-only; there is no rule for a second script.',
  'The night surface is reviewed on screen, not diffed against a baseline.',
]

export const VOICE_SAMPLES: readonly {
  ctx: string
  line: string
  bad?: string
}[] = [
  {
    ctx: 'Headline',
    line: 'The painting becomes cells. So does the name.',
  },
  {
    ctx: 'Colophon',
    line: 'Painting: Peter Nicolai Arbo, Åsgårdsreien, 1872. Nasjonalmuseet, Oslo. Public domain.',
  },
  {
    ctx: 'Error',
    line: 'The upload stopped at 61%. Nothing was printed — send it again when the line is stable.',
    bad: 'Oops! Something went wrong.',
  },
]

export const DITHER_RECIPE = `/* ordered dither, 4 × 4 Bayer — the same matrix the footer paints */
const BAYER = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
]
const threshold = (x, y) => (BAYER[y % 4][x % 4] + 0.5) / 16
// a cell is printed when the picture is darker than its threshold
if (luma(x, y) < threshold(x, y)) ink(x, y)`

export const CELL_RECIPE = `/* the cell — one primitive, repeated */
--hg-cell: 14px;      /* 14 units on the 64 grid */
--hg-gap: 3px;        /* 3 units: the channel between cells */
--hg-escape: 6px;     /* the sixth cell leaves the grid by 6 units */

.mark { display: grid; grid-template-columns: repeat(3, var(--hg-cell));
        gap: var(--hg-gap); }`

export const TOKENS_CSS = `/* 1 · primitive */
--hg-field:   #e2281b;
--hg-ink:     #100f0e;
--hg-bone:    #fffdf9;
--hg-chalk:   #f4efe5;
--hg-sheet:   #ebe5d8;
--hg-cobalt:  #1b2db0;

/* 2 · semantic */
--hg-surface:        var(--hg-chalk);
--hg-surface-field:  var(--hg-field);
--hg-text:           var(--hg-ink);
--hg-text-muted:     #5c5449;
--hg-accent:         #a31810;
--hg-escape:         var(--hg-field);
--hg-focus:          var(--hg-cobalt);

/* 3 · component */
--hg-button-bg:  var(--hg-ink);
--hg-button-ink: var(--hg-chalk);
--hg-field-bg:   var(--hg-bone);
--hg-field-edge: #8d8271;`

export const TOKENS_JSON = `{
  "name": "Huginn",
  "version": "3.0.0",
  "track": "constructed",
  "family": "cell matrix",
  "material": "vermilion field + ordered cells",
  "mark": {
    "grid": 64,
    "cell": 14,
    "gap": 3,
    "cells": 5,
    "escape": [6, -6],
    "sizes": { "header": 32, "minimum": 24,
               "compact": 16, "stage": 132 }
  },
  "dither": { "matrix": "bayer-4x4", "rows": 22 },
  "motion": { "fast": 140, "ui": 220, "slow": 420 }
}`
