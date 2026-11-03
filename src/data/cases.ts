import { LEDGER } from '@/features/ledger/data'

export type DesignCase = {
  slug: string
  number: string
  name: string
  href: string
  tagline: string
  description: string
  status: string
  role: string
  material: string
  cover: string
  coverAlt: string
  tags: readonly string[]
  tone:
    | 'sunnyside'
    | 'vitrine'
    | 'huginn'
    | 'riso'
    | 'hachure'
    | 'cove'
    | 'strand'
    | 'clearing'
    | 'ledger'
    | 'porphyry'
    | 'jakarta'
    | 'bluewater'
    | 'wildflower'
    | 'vesper'
    | 'halation'
    | 'tavola'
    | 'arete'
    | 'quieta'
    | 'firstlight'
    | 'manifest'
}

export const SUNNYSIDE_URL =
  (typeof process !== 'undefined' && process.env?.PUBLIC_SUNNYSIDE_URL) ||
  'https://adityahimaone.space'

/**
 * The documented design-system cases. Sunnyside anchors the shelf at index 0;
 * everything after it runs newest first.
 *
 * The array order is the display order for both the gallery and the landing-page shelf.
 * `number` is the case's permanent identity (its own brand docs and tokens quote it).
 */
export const DESIGN_CASES: readonly DesignCase[] = [
  {
    slug: 'sunnyside',
    number: '01',
    name: 'Sunnyside',
    href: `${SUNNYSIDE_URL}/sunnyside`,
    tagline: 'A studio wall, not a template.',
    description:
      'Warm paper, dark ink, one cobalt field and a sticker drawer. A sun cut from paper, a marker wordmark, and an archive wing that shares one shell.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · frontend · docs',
    material: 'Paper + ink + cobalt',
    cover: '/brand/sunnyside-brandkit.png',
    coverAlt:
      'The Sunnyside brand kit: paper and ink identity board with the sun mark, palette, type specimens and favicon sizes.',
    tags: ['Paper', 'Cobalt', 'Marker', 'Stickers'],
    tone: 'sunnyside',
  },
  {
    slug: 'quieta',
    number: '17',
    name: 'Quieta',
    href: '/design-system/quieta',
    tagline: 'Quiet residences · Detail image beside content.',
    description:
      'Warm stone homes for a brand that sells and lets houses by letting people look at them closely. Lime plaster, honed travertine, terracotta and olive shade, a Kuwayama threshold mark with a separate 16px compact drawing, three published contrast failures, and a residence ledger that recalculates between acquiring and leasing.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · parametric mark · property workbench · docs',
    material: 'Lime plaster + honed travertine + terracotta clay',
    cover: '/brand/quieta/quieta-brandkit.png',
    coverAlt:
      'The Quieta 6-panel brand board: a lime-plastered threshold elevation with the reverse lockup, the Kuwayama 64-unit roof-and-wall mark, 7 warm-stone OKLCH primitives, three type voices, six architectural cast marks, and the four laws.',
    tags: ['Warm Stone', 'Property', 'Threshold Mark', 'OKLCH Dusk'],
    tone: 'quieta',
  },
  {
    slug: 'manifest',
    number: '19',
    name: 'Manifest',
    href: '/design-system/manifest',
    tagline: 'Every parcel leaves a paper trail.',
    description:
      'A shipping identity built from the three supplied photographs: corrugated kraft, brick oxide and chambray indigo. The mark is one carton with the outbound arrow carved out of it as a boolean counter-form, with a separate 16px drawing and six companion cast marks on the same cut line. Ten primitives, a daylight-kraft and night-depot scope, six explored surfaces (four shipped, two rejected), a waybill ledger with tabular figures, and a contrast table that publishes the three pairs it fails.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · parametric mark · shipping surfaces · waybill kit · docs',
    material: 'Corrugated kraft + brick oxide + chambray indigo',
    cover: '/brand/manifest/manifest-brandkit.png',
    coverAlt:
      'The Manifest 6-panel brand board: a chambray-shirt parcel handoff against a red brick wall with the reverse lockup, the boolean carton mark and its MANIFEST wordmark, ten OKLCH primitives, three type voices, six companion cast marks, and the four laws.',
    tags: ['Logistics', 'Kraft', 'Brick', 'Counter-form'],
    tone: 'manifest',
  },
  {
    slug: 'arete',
    number: '18',
    name: 'Arête',
    href: '/design-system/arete',
    tagline: 'Paper-cut alpine · every layer is a cut.',
    description:
      'An alpine cartography atelier built from two papers: ivory cartridge stock and one ultramarine ink. Sculptural ridges are stacked rather than rendered — the supplied torn-paper collage (white peak, grey layer, black ridge, one cobalt seam) rebuilt as a floating ribbon over a grounded mass, parted by a single 5-unit seam. Four named surfaces (cut sheet, lifted layer, vellum overlay, deckle edge), a snow-capped Kuwayama mark with a separate 16px massif, and a contrast ledger that publishes the three pairs it fails.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · parametric mark · paper surfaces · interactive route workbench · docs',
    material: 'Ivory cartridge stock + ultramarine ink + one oxide blaze',
    cover: '/brand/arete/arete-brandkit.png',
    coverAlt:
      'The Arête 6-panel brand board: the supplied paper-cut alpine collage with reverse lockup, the layered-ridge Kuwayama mark and its ARÊTE wordmark, seven OKLCH primitives, three voices, six companion cut marks, and the paper laws.',
    tags: ['Paper-cut', 'Alpine', 'Ultramarine', 'Cartography'],
    tone: 'arete',
  },
  {
    slug: 'tavola',
    number: '16',
    name: 'Tavola',
    href: '/design-system/tavola',
    tagline: 'Around the table · Coastal lunch in afternoon light.',
    description:
      'Sunlit coastal dining carved from ivory linen tablecloths, warm terracotta, blood orange zest and unhurried views of the Tyrrhenian sea. An interlocking communal table-and-sun parametric mark, dual-scope OKLCH daylight-to-dusk chromatic architecture, and an editorial dining specimen.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · parametric mark · interactive workbench · docs',
    material: 'Woven ivory linen + sunlit terracotta + sea cobalt',
    cover: '/brand/tavola/tavola-brandkit.png',
    coverAlt:
      'The Tavola 6-panel brand board: sunlit coastal lunch table with reverse lockup, Kuwayama 64-grid mark scale strip, 7 OKLCH primitives, 3 voices, 6-mark coastal cast, and architectural laws.',
    tags: ['Coastal Dining', 'Ivory Linen', 'Parametric Mark', 'OKLCH Daylight'],
    tone: 'tavola',
  },
  {
    slug: 'halation',
    number: '15',
    name: 'Halation',
    href: '/design-system/halation',
    tagline: 'Light does not stop at the edge of what it lights.',
    description:
      'An interface identity of reeded prismatic glass: a ribbed pane with one reed of coral light that runs past its edge to the edge of the canvas. Coral and ink are sampled from the prismatic field, porcelain and wine from the ember field, and the same eighteen primitives carry a day scope and a night scope. Every pane tints and refracts rather than only blurring; coral measures 3.02:1 on porcelain, so it is assigned the job of graphic and the failure is printed.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · mark family · tokens · docs',
    material: 'Reeded glass + porcelain + one coral spill',
    cover: '/brand/halation/halation-brandkit.png',
    coverAlt:
      'The Halation board: the ribbed pane mark with its coral spill on a wine plate, six primitives, the Syne display line, and the mark at 48, 32 and 16.',
    tags: ['Reeded glass', 'Liquid glass', 'Dual scope', 'Computed contrast'],
    tone: 'halation',
  },
  {
    slug: 'vesper',
    number: '14',
    name: 'Vesper',
    href: '/vesper',
    tagline: 'Two inks. One horizon.',
    description:
      'A two-ink print system for the evening: a cobalt sky and a cream ground, a four-point star resting on a horizon bar, and a 64-unit grid with no stem anywhere. Stipple and ordered dither are generated rather than traced, the night scope is a scope and never a second palette, and the mark is re-inked rather than redrawn. Eleven logo concepts were rasterised at 128, 40 and 16 and scored; the chosen mark ranks fourth, and the page says so.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · mark family · scorer · docs',
    material: 'Cobalt + cream on uncoated stock, one second impression',
    cover: '/brand/vesper/vesper-brandkit.png',
    coverAlt:
      'The Vesper board: the four-point star resting on a horizon bar in cobalt and cream, the eight primitives, the type specimens and six companion marks.',
    tags: ['Two inks', 'Stipple', 'Computed contrast', 'Scored bake-off'],
    tone: 'vesper',
  },
  {
    slug: 'wildflower-wind',
    number: '13',
    name: 'Wildflower Wind',
    href: '/wildflower-wind',
    tagline: 'A meadow, seen through a pane of glass.',
    description:
      'A seed house under glass: five translucent petals that multiply where they cross, so the darkest thing in the mark is the crossing and not a stroke. A haze ground, panes with one lit edge and a long shadow, nested radii, and a violet that is the cosmos refracted rather than the pink in the photograph. Fifteen contrast pairs recomputed from hex, with the two that fail published instead of fixed.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · mark family · docs',
    material: 'Frosted glass + haze + one refracted violet',
    cover: '/brand/wildflower-wind/wildflower-wind-brandkit.png',
    coverAlt:
      'The Wildflower Wind board: five translucent glass petals with one taken, the wordmark in Instrument Serif, nine swatches from haze to refracted violet, and two plates of the same meadow.',
    tags: ['Glass', 'Seed house', 'Blur', 'Computed contrast'],
    tone: 'wildflower',
  },
  {
    slug: 'bluewater',
    number: '12',
    name: 'Bluewater Freight',
    href: '/bluewater',
    tagline: 'The wake is the only bright thing.',
    description:
      'A passage system for maritime operators: a near-black sea, one silver wake that marks only what is moving, 1px chart rules, zero radius, and mono tabular numbers. A fullwidth crossing, a hull-and-waterline mark in two drawings, and an audit that publishes the one contrast pair it refuses to hide.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · docs',
    material: 'Deep water + silver wake + chart rule',
    cover: '/brand/bluewater/bluewater-brandkit.webp',
    coverAlt:
      'The Bluewater Freight hero: last light over open water with a container ship small on the horizon.',
    tags: ['Maritime', 'Chart', 'Zero radius', 'Mono'],
    tone: 'bluewater',
  },
  {
    slug: 'jakarta',
    number: '11',
    name: 'Jakarta',
    href: '/jakarta',
    tagline: 'Bergerak Menuju Era Baru Jakarta.',
    description:
      'One stroke that turns a corner and one stop where it turns, drawn from a single unit S. Nine district ramps named after Jakarta places, a palette that is a map rather than a mood, and the six contrast pairs that fail published instead of fixed. Enamel, vinyl, a transit card and a bus.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · wayfinding · docs',
    material: 'Enamel + vinyl + one orange',
    cover: '/brand/jakarta/jakarta-brandkit.webp',
    coverAlt:
      'The Jakarta brand board: the junction mark on paper, ink and Senja, nine district ramps in four steps, the outlined wordmark and the night scope.',
    tags: ['City', 'Transit', 'Nine Ramps', 'Wayfinding'],
    tone: 'jakarta',
  },
  {
    slug: 'porphyry',
    number: '10',
    name: 'Porphyry',
    href: '/porphyry',
    tagline: 'A page composed like a stage: one stone, one light, one cast.',
    description:
      'A classical diorama as an interface system. A stage opening cut into a block of stone, with a gold threshold, a loader that fills the wordmark with marble from the floor, three photographs keyed off their own black ground by luminance, a real vellum theme, a ten-part form kit and a detach score against every sibling.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · stage · form kit',
    material: 'Porphyry + marble + gold leaf + one dark stage',
    cover: '/brand/porphyry/porphyry-brandkit.png',
    coverAlt:
      'The Porphyry brand board: the stone block with its gold threshold, the porphyry and marble palette, the outlined Cinzel wordmark, the keyed statue and the stage tokens.',
    tags: ['Porphyry', 'Marble', 'Gold Leaf', 'Stage'],
    tone: 'porphyry',
  },
  {
    slug: 'ledger',
    number: '09',
    name: LEDGER.name,
    href: '/ledger',
    tagline: LEDGER.tagline,
    description: LEDGER.description,
    status: LEDGER.status,
    role: LEDGER.role,
    material: LEDGER.material,
    cover: '/brand/ledger/ledger-brandkit.png',
    coverAlt:
      'The Ledger brand board: the grid mark with one lifted tile, the indigo harbor ramp, the glass recipe, the type scale and a dashboard specimen.',
    tags: LEDGER.tags,
    tone: 'ledger',
  },
  {
    slug: 'clearing',
    number: '08',
    name: 'Clearing',
    href: '/clearing',
    tagline: 'A sighting, not a sticker.',
    description:
      'Painted emerald light seen through one pane of glass. A drawn stag on a tapered horizon, an outlined wordmark whose i-tittle is a light disc, five cast marks on one cut line, and an audit that names what it could not verify. No form kit, by request.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · docs',
    material: 'Painted emerald + cream + glass',
    cover: '/brand/clearing/clearing-brandkit.png',
    coverAlt:
      'The Clearing brand board: the stag on a tapered horizon, the outlined clearing wordmark with a disc tittle, six inks sampled from the painting, and the glass recipe.',
    tags: ['Painted', 'Emerald', 'Glass', 'Wildlife'],
    tone: 'clearing',
  },
  {
    slug: 'strand',
    number: '07',
    name: 'Strand',
    href: '/strand',
    tagline: 'Where the dunes meet the tide.',
    description:
      'A quiet coastal interface system: flat white quartz reading plates, marine basalt ink, one shallow-tide green signal, a Dune Crest S monogram, ten native controls and a panoramic vista framing hero and footer.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · form kit',
    material: 'Quartz sand + marine basalt + shallow tide',
    cover: '/brand/strand/strand-brandkit.png',
    coverAlt:
      'The Strand brand board: the architectural S mark, coastal shoreline palette, quartz reading plates and form kit.',
    tags: ['Coastal', 'Minimalist', 'Monogram', 'Forms'],
    tone: 'strand',
  },
  {
    slug: 'cove',
    number: '06',
    name: 'Cove',
    href: '/cove',
    tagline: 'A calmer kind of depth.',
    description:
      'One glass layer over one blue field, a solid reading plate, a squared C with an ice waterline, ten native controls and a measured audit. Case 06 asks what happens when glass is minimal instead of everywhere.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · liquid glass',
    material: 'Blue glass + ice',
    cover: '/brand/cove/cove-brandkit.png',
    coverAlt:
      'The Cove brand board: the squared C mark with an ice inlay, the Abyss and Foam palette, Instrument Serif and Sans, the glass recipe and the form kit.',
    tags: ['Liquid Glass', 'Blue', 'Instrument Serif', 'Forms'],
    tone: 'cove',
  },
  {
    slug: 'hachure',
    number: '05',
    name: 'Hachure',
    href: '/hachure',
    tagline: 'Relief drawn by density, never by shadow.',
    description:
      'A cartographic interface system built from the supplied ridgeline footer: six ridges from one seed, seven tones from one paper, a lichen-capped ridge of solid bars, and a footer you can read an altitude off. Every contrast pair is measured in the build.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · dither engine · form kit',
    material: 'Survey paper + lichen + ordered dither',
    cover: '/brand/hachure/hachure-brandkit.png',
    coverAlt:
      'The Hachure brand board: a 3 × 3 identity deck on a night table — the solid ridge mark, the outlined mono wordmark, the dither plate, the seven-tone ramp, the field sheet and the form kit.',
    tags: ['Hachure', 'Bayer Dither', 'Survey', 'Altimeter'],
    tone: 'hachure',
  },
  {
    slug: 'riso',
    number: '04',
    name: 'Riso Co.',
    href: '/riso',
    tagline:
      'One pin holds the sheet. The tear is what the second drum prints.',
    description:
      'A sheet pinned at the top and torn from the pin: the right flap sits 4,3 out of register because the other drum made it. Two drums, never three, zero rounded corners, a tear edge cut from one clip-path, and sixteen contrast pairs measured in the build — including the two that fail.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · form kit · print proof',
    material: 'Vellum + two drums + one pin',
    cover: '/brand/riso/riso-brandkit.png',
    coverAlt:
      'The Riso Co. brand board: the pinned sheet torn from the pin, the orange and blue drums, the outlined wordmark at three favicon sizes, and a torn edge cut from one polygon.',
    tags: ['Risograph', 'Pinned Sheet', 'Two Drums', 'Tear'],
    tone: 'riso',
  },
  {
    slug: 'huginn',
    number: '03',
    name: 'Huginn Studio',
    href: '/huginn',
    tagline: 'A picture becomes cells. A name becomes cells.',
    description:
      'One 14-unit cell draws Arbo’s Åsgårdsreien through an ordered dither, draws the wordmark in 22 rows, and draws the mark — five cells hold the picture and the sixth has left the grid. No font in the logo, no rounded corners, and an audit that names what it could not verify.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · marks · dither',
    material: 'Vermilion field + ink + bone',
    cover: '/brand/huginn/huginn-brandkit.png',
    coverAlt:
      'The Huginn brand board: the vermilion field with the cell-drawn wordmark, the cell mark with one cell off the grid, and the painting dissolving into the field through an ordered dither.',
    tags: ['Cells', 'Dither', 'Vermilion', 'Print'],
    tone: 'huginn',
  },
  {
    slug: 'vitrine',
    number: '02',
    name: 'Vitrine',
    href: '/vitrine',
    tagline: 'A glass case for a low-resolution light.',
    description:
      'Glass containers, a dithered information layer, a half-light V mark, ten native form controls and an honest audit. Case 02 asks whether depth can stay legible.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · forms · dither',
    material: 'Glass + dither + Signal',
    cover: '/brand/vitrine/vitrine-brandkit.png',
    coverAlt:
      'The Vitrine brand board: the half-light V mark, one glass arm and one Signal arm, Case and Frost palette, Signal field, type specimens, favicon and form specimen.',
    tags: ['Glass', 'Dither', 'Case', 'Forms'],
    tone: 'vitrine',
  },
  {
    slug: 'firstlight',
    number: '19',
    name: 'Firstlight',
    href: '/design-system/firstlight',
    tagline: 'A daylight-first system for people operations.',
    description:
      'Warm stock instead of white, a hairline instead of a shadow, one ember accent for anything that needs a decision, and a mark that is a horizon bar carrying a four-point star at every size. Ten primitives, fourteen measured pairs with three published fails, a Silk field behind the hero, and a roster, a leave queue and a pay run built from the five components the kit actually ships.',
    status: 'Shipped · 2026',
    role: 'Identity · design system · tokens · product surface',
    material: 'Warm stock + ink + ember',
    cover: '/brand/firstlight/firstlight-brandkit.png',
    coverAlt:
      'The Firstlight 6-panel brand board: a printed sunrise plate with the reverse lockup, the horizon-bar and resting-star mark on ink, eight OKLCH primitives with their ratio verdicts, three type voices, six companion marks, and the four surface laws.',
    tags: ['Print', 'Daylight', 'HRIS', 'Tokens'],
    tone: 'firstlight',
  },
]
