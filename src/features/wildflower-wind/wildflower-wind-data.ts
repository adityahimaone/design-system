import tokens from './tokens.json'

/**
 * Every number on the page comes from `tokens.json`, generated from the case's
 * `tokens/wildflower-wind.tokens.json` by `scripts/build-tokens.mjs`. Nothing here
 * is typed twice: if a pair's ratio moves, the page says so.
 */

export const META = {
  number: '13',
  name: 'Wildflower Wind',
  href: '/design-system/wildflower-wind',
  tagline: 'A meadow, seen through a pane of glass.',
  essence: 'A seed house under glass.',
  intro:
    'A seed house sells a future it cannot photograph. So the identity does not show the flower. It shows the flower through glass: four petals still holding, one already gone, and the crossing where they overlap gone dark.',
  backdrop: '/brand/wildflower-wind/photos/field-main.webp',
  board: '/brand/wildflower-wind/wildflower-wind-brandkit.png',
  boardAlt:
    'The Wildflower Wind board: five translucent petals with one taken, the wordmark in Instrument Serif, nine swatches and two plates of the same meadow.',
  specimen: '/brand/wildflower-wind/specimen.html',
  audit: '/brand/wildflower-wind/audit.md',
  design: '/brand/wildflower-wind/DESIGN.md',
} as const

export const NAV = [
  ['premise', 'Premise'],
  ['calyx', 'Calyx'],
  ['light', 'Light'],
  ['setting', 'Setting'],
  ['season', 'Season'],
  ['ledger', 'Ledger'],
] as const

export const DEFS = [
  {
    k: 'Belief',
    v: 'Arrangement is the enemy of a meadow. A good page looks gathered, not composed.',
  },
  {
    k: 'Enemy',
    v: 'Two defaults: the symmetrical bouquet with a script logotype, and the opaque white card that hides whatever is behind it. One is pretty. The other is furniture.',
  },
  {
    k: 'Material',
    v: 'Frosted glass over a meadow. Every surface is translucent, every edge catches light on one side only, and whatever is behind stays visible through it.',
  },
  {
    k: 'Test',
    v: 'Reject the work if it could be flattened onto white without losing anything.',
  },
] as const

export const DECISIONS = [
  {
    n: '01',
    title: 'The mark is glass, so the overlap is the ink.',
    because:
      'Five translucent petals multiply where they cross. The darkest thing in the mark is the crossing, not a stroke — which is the whole argument in one rule.',
    notWhen:
      'The surface prints in one colour. Then the petals go solid and the crossings are cut out instead.',
    breaks: 'Giving a petal a solid fill. The glass becomes a sticker.',
  },
  {
    n: '02',
    title: 'Every surface is a pane, and a pane has one lit edge.',
    because:
      'Light comes from the top-left of the field. A border on all four sides is a card; one bright edge and one long shadow is glass.',
    notWhen:
      'The surface sits inside a photograph, where there is no page light — then use the scrim, not a border.',
    breaks: 'Adding a second shadow direction. Two lights make a drop shadow.',
  },
  {
    n: '03',
    title: 'Radius is nested, never uniform.',
    because:
      'A 12px corner inside a 28px pane reads as a lens. The same 12px inside a 40px pane reads as a mistake — the inner radius has to be the outer minus the padding.',
    notWhen: 'The element is smaller than twice the radius. Then it is a pill.',
    breaks: 'Rounding every corner to the same value. That is a card grid with soft edges.',
  },
  {
    n: '04',
    title: 'The photograph is the light, not the background.',
    because:
      'The meadow is blurred to 64px behind everything. It exists so the glass has something to bend, and it never competes with a word.',
    notWhen: 'The crop would put a horizon through the text. Move the pane, not the photograph.',
    breaks: 'Putting a sharp photograph inside a pane. Then it is a picture, not light.',
  },
] as const

/** a  angle · r base radius · l length · w half-width · b bend — the whole family */
export const PLACEMENT = [
  { n: '01', a: '2°', r: '4.6', l: '21.0', w: '0.35', b: '0.10', ink: 'glass' },
  { n: '02', a: '76°', r: '5.4', l: '19.5', w: '0.35', b: '0.14', ink: 'glass' },
  { n: '03', a: '148°', r: '4.8', l: '20.5', w: '0.35', b: '0.08', ink: 'glass' },
  { n: '04', a: '228°', r: '6.0', l: '18.5', w: '0.35', b: '0.16', ink: 'glass' },
  { n: '05', a: '296°', r: '16.6', l: '10.5', w: '0.38', b: '0.20', ink: 'signal' },
] as const

export const MARK_FILES = [
  { file: 'mark.svg', label: 'Primary', note: '24px floor', size: 92 },
  { file: 'mark-compact.svg', label: 'Compact', note: 'a different drawing', size: 60 },
  { file: 'glyph.svg', label: 'Glyph', note: 'favicon', size: 40 },
  { file: 'mark-mono.svg', label: 'One ink', note: 'print', size: 60 },
  { file: 'mark-reverse.svg', label: 'Reverse', note: 'on ink', size: 60, dark: true },
] as const

export const PRIMITIVES = tokens.primitives.map((p) => ({
  name: p.name,
  hex: p.value,
  role: p.role,
  /** the light-scope material, pinned — a swatch must not flip with the theme */
  light: p.value,
}))

/** the swatch label colour: everything is dark ink except the two deep values */
const LIGHT_LABEL = new Set(['haze', 'glass', 'gold', 'sky', 'petal'])
export const labelOn = (name: string) => (LIGHT_LABEL.has(name) ? '#2a1e33' : '#fbf9ff')

export const PAIRS = tokens.contrast.map((c) => ({
  label: c.label.replace(/ —.*$/, ''),
  job: (c.label.split(' — ')[1] ?? '').trim(),
  fg: c.fg,
  bg: c.bg,
  ratio: c.ratio,
  pass: c.pass,
}))

export const TYPE = tokens.type.map((t) => ({
  name: t.name,
  face: t.value,
  size: t.size,
  leading: t.leading,
  tracking: t.tracking,
  weight: t.weight,
  use: t.use,
}))

export const STATS = [
  { k: 'Primitives', v: '9' },
  { k: 'Pairs computed', v: String(tokens.contrast.length) },
  { k: 'Published as failing', v: String(tokens.contrast.filter((c) => !c.pass).length) },
  { k: 'Mark files', v: '15' },
] as const

export const PROVED = [
  'Fifteen contrast pairs recomputed from hex at build time; the stated ratios are the computed ones.',
  'Nine primitives in tokens.json match the token CSS at the same value, in both scopes.',
  'The mark at 16px is a different drawing — four placements, not five.',
  'The wordmark is outlines from Instrument Serif. No font file can change the name.',
] as const

export const NOT_VERIFIED = [
  'Glass on a low-contrast display. Backdrop blur varies by GPU and browser; the pane is designed to hold without it.',
  'The meadow photograph behind the page. It was supplied for this system and carries no licence record.',
  'Print. A translucent mark on coated stock is a different problem from a translucent mark on a screen.',
  'Figma parity. The plugin carries variables and styles, not the blend modes that make the petals glass.',
] as const

export const GAPS = [
  'gold on haze, 2.19:1 — graphic only. It may never carry a label, including a tin’s variety name.',
  'sky on haze, 1.47:1 — surface only. Never a rule, never an icon that must be read.',
  'Backdrop blur is unverified below Safari 16.4 and Firefox 103.',
  'The cast has four members. A fifth — a petal that cracks — was drawn and dropped: it read as damage.',
] as const
