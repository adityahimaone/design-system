import type { Metadata } from 'next'
import Link from 'next/link'

import '@/features/hachure/hachure-tokens.css'

import {
  DitherField,
  DitherStudy,
  ElevationStudy,
  FooterDemo,
  HachureForm,
  HachureLockup,
  HachureMark,
  HachureWordmark,
  HachureControls,
} from '@/features/hachure'
import tokens from '@/features/hachure/tokens.json'
import styles from '@/features/hachure/hachure.module.css'

export const metadata: Metadata = {
  title: 'Hachure — Design System',
  description:
    'Case 05: a cartographic interface system for terrain, weather and field data. Six ridges from one seed, seven tones from one paper, and a footer drawn as a range you can read an altitude off.',
  alternates: {
    canonical: '/design-system/hachure',
    types: { 'text/markdown': '/design-system/hachure/llms.txt' },
  },
  openGraph: {
    title: 'Hachure — Design System',
    description: 'Relief drawn by density, never by shadow.',
    url: '/design-system/hachure',
    type: 'website',
    images: [
      {
        url: '/brand/hachure/hachure-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Hachure brand board: a 3 × 3 identity deck on a night table — the lit-crest mark, the outlined mono wordmark, the dither plate, the seven-tone ramp and the form kit.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hachure — Design System',
    description: 'Relief drawn by density, never by shadow.',
    images: ['/brand/hachure/hachure-brandkit.png'],
  },
}

type Token = { name: string; value: string; role: string }
type Pair = {
  label: string
  theme: string
  a: string
  b: string
  ratio: number
  level: string
  use: string
}
type TypeToken = {
  role: string
  face: string
  weight: string
  size: string
  leading: string
  tracking: string
  use: string
}
type SpaceToken = { name: string; value: string; use: string }
type MotionToken = { name: string; value: string; use: string }

const primitives = tokens.primitives as Token[]
const light = tokens.semantic.light as Token[]
const contrast = tokens.contrast as Pair[]
const typeScale = tokens.type as TypeToken[]
const spaceScale = tokens.space as SpaceToken[]
const motionScale = tokens.motion as MotionToken[]

const measured = contrast.length
const failing = contrast.filter((pair) => pair.level === 'Fail')
const rangeAccent = contrast.find(
  (pair) => pair.label === 'Range accent as type',
)

const NAV = [
  { id: 'rule', label: 'Rule' },
  { id: 'material', label: 'Material' },
  { id: 'mark', label: 'Mark' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'specimen', label: 'Specimen' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

const CONTENTS = [
  { id: 'rule', label: 'Rule' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'material', label: 'Material' },
  { id: 'mark', label: 'Mark' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'parts', label: 'Parts' },
  { id: 'motion', label: 'Motion' },
  { id: 'specimen', label: 'Specimen' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

const FUSIONS = [
  {
    n: '01',
    name: 'Terrain console',
    note: 'rejected — night radar, already a cliché',
    kept: false,
  },
  {
    n: '02',
    name: 'Editorial riso zine',
    note: 'rejected — that is case 04, and it earned it',
    kept: false,
  },
  {
    n: '03',
    name: 'Data-relief dashboard',
    note: 'borrowed — the chart honesty, not the product',
    kept: false,
  },
  {
    n: '04',
    name: 'Cartographic survey sheet',
    note: 'kept — margins, hachure, one loud field',
    kept: true,
  },
  {
    n: '05',
    name: 'Mist-lens explorer',
    note: 'borrowed — the pointer reveal, as an interaction',
    kept: false,
  },
  {
    n: '06',
    name: 'Bento relief cards',
    note: 'rejected — dither as garnish in a rounded box',
    kept: false,
  },
]

/* V4.0: nine drawn across four rounds, one kept. The rejections are the guide,
   so they are on the page rather than in a commit message. */
const EXPLORATIONS = [
  { n: '01', name: 'Stepped silhouette', note: 'a staircase at 16px' },
  { n: '02', name: 'One diagonal stroke', note: 'reads as a pen, not a slope' },
  { n: '03', name: 'Two map-key bars', note: 'a bar chart with a legend' },
  {
    n: '04',
    name: 'Quantised right edge',
    note: 'a torn sheet of paper',
  },
  { n: '05', name: 'Banded solid', note: 'five stripes, still a list icon' },
  { n: '06', name: 'Thick contour arc', note: 'a rainbow' },
  {
    n: '07',
    name: 'Weight ramp ×3',
    note: 'flip it and the meaning flips: a diagram, not a mark',
  },
  {
    n: '08',
    name: 'Heavy base, lit summit',
    note: 'reads as bedrock under a cap',
  },
  { n: '09', name: 'Solid mass, lit crest', note: 'kept' },
]

const TIMELINE = [
  { at: '0000', what: 'Frame guides draw down', how: 'scaleY, 1.4s' },
  {
    at: '0140',
    what: 'Brand mark and name rise out of blur',
    how: 'translate + filter, 900ms',
  },
  {
    at: '0380',
    what: 'Ridge 1 develops, back to front',
    how: 'tone sweep, 1.3s',
  },
  {
    at: '0550',
    what: 'Ridge 2 at +170ms, then each in turn',
    how: '170ms apart',
  },
  { at: '1250', what: 'Copyright and credit line', how: '260ms' },
  {
    at: '1600',
    what: 'Altimeter armed; mist keeps drifting',
    how: 'no further entrance',
  },
]

const componentTokens = [
  { label: 'radius', value: '0px' },
  { label: 'hairline', value: '1px' },
  { label: 'field height', value: '46px' },
  { label: 'focus ring', value: '2px / 3px offset' },
  { label: 'dither cell', value: '2px' },
  { label: 'reveal', value: '1,400ms' },
]

function SectionHead({
  id,
  number,
  label,
  title,
  lead,
}: {
  id: string
  number: string
  label: string
  title: string
  lead: string
}) {
  return (
    <div className={styles.sectionHead}>
      <div>
        <p className={styles.label}>
          {number} <span aria-hidden="true">/</span> {label}
        </p>
        <h2 id={`${id}-title`} className={styles.headline}>
          {title}
        </h2>
      </div>
      <p className={styles.sectionLead}>{lead}</p>
    </div>
  )
}

export default function HachurePage() {
  const faceName = (face: string) => (face === 'mono' ? 'Geist Mono' : 'Geist')
  const spacing = spaceScale
    .map((token) => `${token.name}:${token.value}`)
    .join('  ')

  return (
    <div className={styles.page} id="top" data-hachure-root data-theme="light">
      <a className={styles.skip} href="#main">
        Skip to the sheet
      </a>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <HachureLockup />
          <nav className={styles.navLinks} aria-label="Case contents">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <HachureControls />
        </div>
      </header>

      <main id="main">
        {/* The hero is the top edge of the sheet: the range across the full
            viewport, its printed margin, then the title on paper. The field is
            a row of its own rather than a layer behind the copy — the engine
            puts the highest crest at 16% of its box, so a field stretched
            behind the type lifts the terrain into the lead paragraph. A row
            cannot collide at any width. */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <DitherField
            className={styles.heroField}
            tones={tokens.tones.light}
            tonesDark={tokens.tones.dark}
            seed={7}
            layers={6}
            mist={0.9}
            fadeFrom={0.5}
            duration={1800}
          />

          <div className={styles.heroMargin}>
            <div className={styles.heroMarginInner}>
              <span className={styles.marginTick}>Sheet 05</span>
              <span className={styles.marginScale}>
                <span>0</span>
                <span className={styles.plateScaleBar} aria-hidden="true" />
                <span>1 km</span>
              </span>
              <span className={styles.marginItem}>1:25 000</span>
              <span className={styles.marginItem}>47°12′N 8°41′E</span>
              <span className={styles.marginItem}>
                seed 7 · six ridges · seven tones
              </span>
            </div>
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                Case 05 / Identity and interface system
              </p>
              <h1 id="hero-title" className={styles.heroTitle}>
                Relief drawn by density,
                <br />
                <em>never by shadow.</em>
              </h1>
              <p className={styles.heroLead}>
                Hachure is a cartographic interface system for terrain, weather
                and field data. Six ridges from one seed, seven tones from one
                paper, and a footer that is a range you can read an altitude
                off. The component was supplied; the <b>system</b> is the
                decision about what to do with it.
              </p>
              <div className={styles.actions}>
                <a className={styles.button} href="#specimen">
                  Open the specimen <span aria-hidden="true">↓</span>
                </a>
                <a className={styles.quietButton} href="#rule">
                  Read the rule
                </a>
              </div>

              <nav className={styles.contentsMobile} aria-label="Contents">
                {CONTENTS.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <div className={styles.shell}>
          <p className={styles.heroNote}>
            The hero field is drawn live by the same engine as the footer: seed
            7, six ridges, seven tones, 2px cells. It runs the full width of the
            viewport and is trimmed at the bottom to a printed margin, because
            that is where a sheet ends.
          </p>

          <dl className={styles.facts} aria-label="Case facts">
            <div className={styles.fact}>
              <dt>Grid</dt>
              <dd>64 grid / one crest</dd>
            </div>
            <div className={styles.fact}>
              <dt>Tones</dt>
              <dd>7 — tone 1 is the paper</dd>
            </div>
            <div className={styles.fact}>
              <dt>Bands</dt>
              <dd>3 — range reserved</dd>
            </div>
            <div className={styles.fact}>
              <dt>Component</dt>
              <dd>Ridgeline dither footer</dd>
            </div>
          </dl>
        </div>

        <div className={styles.shell}>
          {/* 01 — the rule */}
          <section
            className={styles.section}
            id="rule"
            aria-labelledby="rule-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>01</span>
              <span className={styles.railLabel}>The rule</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="rule"
                number="01"
                label="The rule"
                title="A map, not a mountain."
                lead="The supplied component is not a footer with peaks on it. It is a tone engine: ridged noise, an 8×8 Bayer matrix and a palette whose first step is the paper. Giving it an interface meant finding the part of the physical world that already thinks in density."
              />

              <div className={styles.direction}>
                <div className={styles.prose}>
                  <p>
                    Dither is fashionable again, and most of it is decoration: a
                    picture, a grain overlay, a hover. Hachure starts from the
                    opposite end. If tone is an index into a short palette, then{' '}
                    <strong>depth is not a filter</strong> — it is how many of
                    the seven steps a surface is allowed to use.
                  </p>
                  <p>
                    The fusion that survived is the survey sheet: hachure
                    strokes that encode slope, contour intervals that encode
                    hierarchy, a benchmark stamped with a number, and a margin
                    that is nothing but measurements. It is a printed artefact
                    that already refuses shadows, gradients and rounded corners
                    — so the component stops being a mountain and becomes the
                    largest plate in a system that was always tonal.
                  </p>
                  <p>
                    Two things were borrowed and two were refused. From
                    data-relief mapping: the chart has to be honest, so every
                    contrast pair on this page is measured in the build rather
                    than typed beside the colour. From the mist lens: the
                    pointer can part the range, which is the one interaction the
                    surface earns. Refused: the night radar console (a cliché
                    with worse contrast) and the bento card (dither as garnish
                    in a rounded box).
                  </p>
                </div>

                <ul
                  className={styles.fusions}
                  aria-label="Six fusions considered"
                >
                  {FUSIONS.map((item) => (
                    <li
                      key={item.n}
                      className={styles.fusion}
                      data-kept={item.kept}
                    >
                      <span>{item.n}</span>
                      <b>{item.name}</b>
                      <em>{item.note}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.defaults}>
                <h3>Three defaults, refused</h3>
                <div className={styles.defaultsGrid}>
                  <article>
                    <h4>No soft shadow</h4>
                    <p>
                      A shadow is the default way to say “this sits above”. Here
                      a hairline and a bench tone say it, and the only thing
                      that reaches altitude is the footer.
                    </p>
                  </article>
                  <article>
                    <h4>No gradient sky</h4>
                    <p>
                      A CSS gradient cannot be printed. Every tonal step is a
                      discrete palette index, so the plate survives a
                      screenshot, a PDF and a browser with no blending.
                    </p>
                  </article>
                  <article>
                    <h4>No peak logo</h4>
                    <p>
                      The isosceles triangle is the most used mark in this
                      category. The kept profile is asymmetric, kneed and prints
                      into paper — see 04.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          {/* 02 — foundation */}
          <section
            className={styles.section}
            id="foundation"
            aria-labelledby="foundation-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>02</span>
              <span className={styles.railLabel}>Foundation</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="foundation"
                number="02"
                label="Foundation"
                title="Three bands, one of them reserved."
                lead="The system has three elevations because an interface has three kinds of meaning. The range is the highest band and it is reserved for exactly one surface, so arriving there means the page has ended."
              />

              <ElevationStudy tones={tokens.tones.light} />

              <ul className={styles.rules} aria-label="Elevation rules">
                <li>
                  <b>01</b>
                  <div>
                    <h4>Nothing sits below ground</h4>
                    <p>
                      There is no negative elevation. No shadow, no floating
                      card, no modal that pretends to be closer to the reader
                      than the page.
                    </p>
                  </div>
                </li>
                <li>
                  <b>02</b>
                  <div>
                    <h4>Bench is a place, not a jump</h4>
                    <p>
                      A bench is one tone and one hairline. Panels, inputs and
                      table headers sit on it; they do not earn a second border
                      or a lift.
                    </p>
                  </div>
                </li>
                <li>
                  <b>03</b>
                  <div>
                    <h4>The range is spent once</h4>
                    <p>
                      Only the site footer may use the dither plate. Using it in
                      a hero would spend the whole system&apos;s one loud field
                      on the first screen.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 03 — material */}
          <section
            className={styles.section}
            id="material"
            aria-labelledby="material-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>03</span>
              <span className={styles.railLabel}>Material</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="material"
                number="03"
                label="Material"
                title="Seven tones, no blur."
                lead="Every value on the plate is one of seven palette indices, chosen per cell by an 8×8 Bayer threshold. Tone 1 is the paper itself, which is why the range can dissolve into the page instead of fading out of it."
              />

              <DitherStudy tones={tokens.tones.light} />

              <div className={styles.rampBlock}>
                <div>
                  <p className={styles.label}>The ramp, light</p>
                  <div className={styles.toneRamp}>
                    {tokens.tones.light.map((tone, index) => (
                      <div key={tone} className={styles.toneStep}>
                        <i style={{ background: tone }} aria-hidden="true" />
                        <b>{String(index + 1).padStart(2, '0')}</b>
                        <code>{tone}</code>
                      </div>
                    ))}
                  </div>
                  <p className={styles.toneNote}>
                    Tone 5 is the accent and the only tone allowed to set type:{' '}
                    {rangeAccent
                      ? `${rangeAccent.ratio.toFixed(2)}:1`
                      : '4.82:1'}{' '}
                    on stock. Tones 1–4 are decoration only. Tones 6–7 never
                    carry a word.
                  </p>
                </div>

                <div>
                  <p className={styles.label}>The ramp, night</p>
                  <div className={styles.toneRamp}>
                    {tokens.tones.dark.map((tone, index) => (
                      <div key={tone} className={styles.toneStep}>
                        <i style={{ background: tone }} aria-hidden="true" />
                        <b>{String(index + 1).padStart(2, '0')}</b>
                        <code>{tone}</code>
                      </div>
                    ))}
                  </div>
                  <p className={styles.toneNote}>
                    Night is not the light ramp inverted. The ridges get lighter
                    as they come nearer, the way a moonlit face catches the
                    light, and the accent moves to tone 5 of this ramp — 5.06:1
                    on night paper.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 04 — mark */}
          <section
            className={styles.section}
            id="mark"
            aria-labelledby="mark-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>04</span>
              <span className={styles.railLabel}>Mark</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="mark"
                number="04"
                label="The mark"
                title="Relief, drawn in mass."
                lead="Three drawings have held this square. The first was a letter. The second used bar height to mean rise, which is the grammar of a bar chart. The third was seven sheared strokes — equal lengths, offset climbing right, so nothing was plotted and the lean was the slope. The reasoning was sound and the drawing still lost: measured against its seven siblings at 112px, Hachure was the only mark built from hairlines. So the mass came back and the hachure moved into the silhouette. One solid section through rising ground, one crest lit by the sheet, nothing hatched inside."
              />

              <div className={styles.markGrid}>
                <div className={styles.markStage}>
                  <HachureMark size={240} title="The mark on a 64 grid" />
                  <span className={styles.markStageNote}>
                    64 grid / crest 7 / rise 24
                  </span>
                </div>

                <div className={styles.markFamily}>
                  <div className={styles.familyRow}>
                    <div className={styles.familyItem}>
                      <HachureMark size={64} title="Primary mark" />
                      <span className={styles.label}>Primary</span>
                    </div>
                    <div className={styles.familyItem}>
                      <HachureMark size={32} title="Mark at 32px" />
                      <span className={styles.label}>32</span>
                    </div>
                    <div className={styles.familyItem}>
                      <HachureMark size={16} title="Favicon at 16px" />
                      <span className={styles.label}>16</span>
                    </div>
                    <div className={styles.familyItem}>
                      <HachureMark size={32} mono title="Mono ridge" />
                      <span className={styles.label}>Mono</span>
                    </div>
                  </div>

                  <p className={styles.familyNote}>
                    One drawing, every size — there is no compact variant. The
                    seven-stroke mark needed a 32-grid redraw because its
                    2.2-unit channels closed into a block below 24px; this one
                    has no channel to close, so 16px and 512px are the same
                    geometry. <span className={styles.mono}>mono</span> collapses
                    the crest to the ink. Clear space is 3 units left and right,
                    5 above, 7 below. The mark is fill-only: no ring, no stroke,
                    no circle.
                  </p>

                  <div>
                    <p className={styles.label} style={{ marginBottom: 10 }}>
                      V4.0 bake-off / nine drawn, one kept
                    </p>
                    <ul className={styles.explorations}>
                      {EXPLORATIONS.map((item) => (
                        <li key={item.n} data-kept={item.note === 'kept'}>
                          <span>{item.n}</span>
                          <span>{item.name}</span>
                          <em>{item.note}</em>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className={styles.label} style={{ marginBottom: 8 }}>
                      Construction
                    </p>
                    <p className={styles.familyNote}>
                      Flat bottom at{' '}
                      <span className={styles.mono}>y57</span>, vertical sides at{' '}
                      <span className={styles.mono}>x3</span> and{' '}
                      <span className={styles.mono}>x61</span>, a top edge
                      climbing <span className={styles.mono}>24</span> units over{' '}
                      <span className={styles.mono}>58</span> — a 22° slope. The
                      crest is a <span className={styles.mono}>7</span>-unit band
                      cut from that edge, so the highest surface of the
                      silhouette is the lichen and the accent is the ground, not
                      a stripe laid on it. The wordmark is Geist Mono 700,
                      outlined once, never live text.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={styles.plate}
                style={{ marginTop: 28, maxWidth: 420 }}
              >
                <div className={styles.plateTop}>
                  <span className={styles.plateTick}>Lockup</span>
                  <span>{`${Math.round(268.66)} × 56`}</span>
                </div>
                <div style={{ padding: '22px 18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <HachureMark size={46} />
                    <HachureWordmark height={26} />
                  </div>
                  <span
                    className={styles.markStageNote}
                    style={{ display: 'block', marginTop: 14 }}
                  >
                    Mark and wordmark, 16-unit gap
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 05 — colour */}
          <section
            className={styles.section}
            id="colour"
            aria-labelledby="colour-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>05</span>
              <span className={styles.railLabel}>Colour</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="colour"
                number="05"
                label="Colour"
                title="One loud field, nine materials."
                lead="The palette is short because a printed sheet is short: one stock, one ink, one loud lichen, one survey red. Colour is assigned by role, and the loud one is a fill — never a letter."
              />

              <div className={styles.colourGrid}>
                {primitives.map((token) => (
                  <div className={styles.chip} key={token.name}>
                    <div
                      className={styles.chipPatch}
                      style={{ background: token.value }}
                      aria-hidden="true"
                    />
                    <div className={styles.chipMeta}>
                      <b>{token.name}</b>
                      <code>{token.value.toUpperCase()}</code>
                      <span>{token.role}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.rampBlock}>
                <div>
                  <p className={styles.label}>Roles, light</p>
                  <ul className={styles.rules}>
                    <li>
                      <b>01</b>
                      <div>
                        <h4>Lichen is a fill</h4>
                        <p>
                          As type it measures{' '}
                          {(failing[0]?.ratio ?? 1.4).toFixed(2)}:1 on stock. It
                          appears as the one loud field per view, and as a mark
                          — never as a paragraph, a label or a link.
                        </p>
                      </div>
                    </li>
                    <li>
                      <b>02</b>
                      <div>
                        <h4>Moss carries the sentence</h4>
                        <p>
                          The darker green (5.51:1) is the type-safe accent:
                          links, eyebrows and numerals. The dither&apos;s tone 5
                          follows it so the footer and the page agree.
                        </p>
                      </div>
                    </li>
                    <li>
                      <b>03</b>
                      <div>
                        <h4>Survey red is functional</h4>
                        <p>
                          Errors only. It never appears in the identity, because
                          a system that cries wolf in its own logo cannot use
                          red to say something is wrong.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className={styles.label}>Roles, night</p>
                  <ul className={styles.rules}>
                    <li>
                      <b>01</b>
                      <div>
                        <h4>Night is paper, not void</h4>
                        <p>
                          The dark surface is still a stock: #0A110D, a
                          green-black, not #000. Type is warm white, and the
                          rules stay visible.
                        </p>
                      </div>
                    </li>
                    <li>
                      <b>02</b>
                      <div>
                        <h4>Lichen becomes type-safe</h4>
                        <p>
                          At night the loud field measures 12.3:1 on the paper,
                          so it may carry type — but it is still a field first,
                          and a link second.
                        </p>
                      </div>
                    </li>
                    <li>
                      <b>03</b>
                      <div>
                        <h4>The alert lightens</h4>
                        <p>
                          Survey red is unreadable on night paper, so the alert
                          role moves to a chalky #F0917F. The rule is the role,
                          not the hex.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 06 — type */}
          <section
            className={styles.section}
            id="type"
            aria-labelledby="type-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>06</span>
              <span className={styles.railLabel}>Type</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="type"
                number="06"
                label="Type"
                title="Mono carries the measurements."
                lead="A survey margin is nothing but numbers, so the display face is the mono one and the reading face is Geist. Two families, both already loaded by the host — no new webfont, no display face setting a paragraph."
              />

              <div className={styles.typeGrid}>
                <div>
                  <p className={styles.specimenBig}>
                    Aa
                    <span>
                      Geist Mono 700
                      <br />
                      −0.03em / 0.92
                    </span>
                  </p>

                  <table className={styles.scaleTable}>
                    <caption className={styles.visuallyHidden}>
                      Type scale
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Role</th>
                        <th scope="col">Face</th>
                        <th scope="col">Size / leading / tracking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {typeScale.map((row) => (
                        <tr key={row.role}>
                          <td>{row.role}</td>
                          <td>{faceName(row.face)}</td>
                          <td>
                            {row.size} / {row.leading} / {row.tracking}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.typeSpecimen}>
                  <p>
                    The sheet reads the way a map margin reads: what it is,
                    where it is, what it is measured against, and who signed it.
                  </p>
                  <p>
                    Body copy is Geist at 17px on a 1.6 leading, held to about
                    68 characters. The mono is kept for anything that is a
                    measurement — heights, coordinates, seeds, row and column
                    counts — and every changing number is set tabular so it does
                    not shuffle while it updates.
                  </p>
                  <div className={styles.altimeterSample}>
                    <b>2,480 m</b>
                    <span>
                      The footer&apos;s altimeter. It is the one place on the
                      site where a number is read off a surface, so it is also
                      the one place with a pointer.
                    </span>
                  </div>
                  <p className={styles.ruleCallout}>
                    <strong>Lichen as type is banned, and measured:</strong>{' '}
                    {(failing[0]?.ratio ?? 1.4).toFixed(2)}:1 on stock, under
                    the 3:1 floor even for display. The type-safe green is moss{' '}
                    <span className={styles.mono}>#4A6B33</span> at 5.51:1. If a
                    label must feel loud, make the field lichen and print the
                    words in ink (10.67:1).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 07 — parts */}
          <section
            className={styles.section}
            id="parts"
            aria-labelledby="parts-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>07</span>
              <span className={styles.railLabel}>Parts</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="parts"
                number="07"
                label="Parts"
                title="Controls with a margin, not a shadow."
                lead="Native elements with a printed skin: square corners, one-pixel borders, a focus ring that shows on paper and on night, and a form written in the survey's own words — states and all."
              />

              <div className={styles.partsGrid}>
                <div>
                  <div className={styles.partsBlock}>
                    <p className={styles.label}>Actions</p>
                    <div className={styles.partsRow}>
                      <button type="button" className={styles.button}>
                        File a report
                      </button>
                      <button type="button" className={styles.quietButton}>
                        Save draft
                      </button>
                      <button type="button" className={styles.ghostButton}>
                        Discard
                      </button>
                    </div>
                  </div>

                  <div className={styles.partsBlock}>
                    <p className={styles.label}>Labels</p>
                    <div className={styles.partsRow}>
                      <span className={styles.tag} data-tone="a">
                        Spot height
                      </span>
                      <span className={styles.tag} data-tone="b">
                        Ridge
                      </span>
                      <span className={styles.tag} data-tone="quiet">
                        Provisional
                      </span>
                    </div>
                  </div>

                  <div className={styles.partsBlock}>
                    <p className={styles.label}>Selection</p>
                    <div className={styles.partsRow}>
                      <label className={styles.switch}>
                        <input type="checkbox" defaultChecked />
                        <span>Altimeter</span>
                      </label>
                      <label className={styles.check}>
                        <input type="checkbox" defaultChecked />
                        <span>Quote this report</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.partsBlock}>
                    <p className={styles.label}>Field states</p>
                    <div className={styles.states}>
                      <div className={styles.stateRow}>
                        <span className={styles.label}>Default</span>
                        <input type="text" defaultValue="Piz Badile" readOnly />
                      </div>
                      <div className={styles.stateRow}>
                        <span className={styles.label}>Focus</span>
                        <input
                          type="text"
                          defaultValue="field@survey.example"
                          data-state="focus"
                          readOnly
                        />
                      </div>
                      <div className={styles.stateRow}>
                        <span className={styles.label}>Invalid</span>
                        <input
                          type="text"
                          defaultValue="8849,1"
                          data-state="invalid"
                          readOnly
                        />
                      </div>
                      <div className={styles.stateRow}>
                        <span className={styles.label}>Disabled</span>
                        <input
                          type="text"
                          defaultValue="Datum locked"
                          data-state="disabled"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formPanel}>
                  <div className={styles.formPanelHead}>
                    <h3>File a site report</h3>
                    <span className={styles.label}>Form specimen</span>
                  </div>
                  <p className={styles.formLead}>
                    Submit it empty to see the summary, then tab through: the
                    ring is always visible, every error names its own recovery,
                    and focus moves to the first thing to fix.
                  </p>
                  <HachureForm />
                </div>
              </div>
            </div>
          </section>

          {/* 08 — motion */}
          <section
            className={styles.section}
            id="motion"
            aria-labelledby="motion-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>08</span>
              <span className={styles.railLabel}>Motion</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="motion"
                number="08"
                label="Motion"
                title="One reveal, then stillness."
                lead="The only entrance in the system is the print developing. It runs once, when the footer is first seen, and after that the page is allowed to be still — apart from the mist, which drifts at a speed you can turn to zero."
              />

              <div className={styles.motion}>
                <div
                  className={styles.timeline}
                  aria-label="Footer reveal storyboard"
                >
                  {TIMELINE.map((step) => (
                    <div key={step.at} className={styles.timelineRow}>
                      <span>{step.at}ms</span>
                      <b>{step.what}</b>
                      <em>{step.how}</em>
                    </div>
                  ))}
                </div>

                <div className={styles.motionNotes}>
                  <h3>Three motion rules</h3>
                  <p>
                    <b>Motion explains a change.</b> The reveal says “this
                    surface is printed in layers”. Nothing else on the page
                    needs to move to say anything.
                  </p>
                  <p>
                    <b>One thing at a time.</b> Ridges arrive 170ms apart, back
                    to front, so the eye can follow the order. Two simultaneous
                    entrances read as noise.
                  </p>
                  <p>
                    <b>Reduced motion resolves.</b> With{' '}
                    <span className={styles.mono}>prefers-reduced-motion</span>{' '}
                    the range is already developed, the mist holds still, the
                    pointer clearing is off, and the altimeter still reads — it
                    never needed the animation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 09 — specimen */}
        <section
          className={styles.specimenSection}
          id="specimen"
          aria-labelledby="specimen-title"
        >
          <div className={styles.shell}>
            <div className={styles.specimenIntro}>
              <div>
                <p className={styles.label}>09 / Specimen</p>
                <h2 id="specimen-title" className={styles.headline}>
                  The range, full bleed.
                </h2>
              </div>
              <p>
                The real component, not a screenshot of one. Scroll it into view
                and the plate develops back to front. Move across it: the mist
                parts, the ridges tilt in parallax, and the crest under the
                pointer reads its height.
              </p>
            </div>
          </div>

          <FooterDemo
            tones={{ light: tokens.tones.light, dark: tokens.tones.dark }}
          />
        </section>

        <div className={styles.shell}>
          {/* 10 — tokens */}
          <section
            className={styles.section}
            id="tokens"
            aria-labelledby="tokens-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>10</span>
              <span className={styles.railLabel}>Tokens</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="tokens"
                number="10"
                label="Tokens"
                title="One source, three tiers."
                lead="Primitives are materials; semantic roles are decisions; component values are shapes. The CSS and JSON are generated from features/hachure/tokens.json, and every contrast ratio below is computed from the values rather than typed beside them."
              />

              <div className={styles.tokenGrid}>
                <article className={styles.tokenCard}>
                  <p className={styles.label}>01 / Primitives</p>
                  <h3>Materials</h3>
                  <p>
                    Stock, inks and the one loud field. Nothing here knows what
                    it is for.
                  </p>
                  <div className={styles.swatchList}>
                    {primitives.map((token) => (
                      <div className={styles.swatchRow} key={token.name}>
                        <i
                          style={{ background: token.value }}
                          aria-hidden="true"
                        />
                        <span>{token.name}</span>
                        <code>{token.value}</code>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.tokenCard}>
                  <p className={styles.label}>02 / Semantic</p>
                  <h3>Roles</h3>
                  <p>
                    Stable names for surfaces, ink, rules, focus and the range
                    accent.
                  </p>
                  <div className={styles.swatchList}>
                    {light.slice(0, 11).map((token) => (
                      <div className={styles.swatchRow} key={token.name}>
                        <i
                          style={{ background: token.value }}
                          aria-hidden="true"
                        />
                        <span>{token.name}</span>
                        <code>{token.value}</code>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.tokenCard}>
                  <p className={styles.label}>03 / Component</p>
                  <h3>Press settings</h3>
                  <p>Values that describe the sheet rather than a colour.</p>
                  <div className={styles.swatchList}>
                    {componentTokens.map((token) => (
                      <div className={styles.swatchRow} key={token.label}>
                        <i
                          style={{ background: 'var(--hx-rule)' }}
                          aria-hidden="true"
                        />
                        <span>{token.label}</span>
                        <code>{token.value}</code>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className={styles.rampBlock}>
                <div>
                  <p className={styles.label}>Type</p>
                  <ul className={styles.rules}>
                    {typeScale.map((row, index) => (
                      <li key={row.role}>
                        <b>{String(index + 1).padStart(2, '0')}</b>
                        <div>
                          <h4>
                            {row.role} · {row.size}
                          </h4>
                          <p>
                            {faceName(row.face)} {row.weight} · {row.leading}{' '}
                            leading · {row.tracking} · {row.use}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={styles.label}>Space and motion</p>
                  <ul className={styles.rules}>
                    <li>
                      <b>01</b>
                      <div>
                        <h4>space · 4 → 104px</h4>
                        <p>{spacing}</p>
                      </div>
                    </li>
                    {motionScale.map((row, index) => (
                      <li key={row.name}>
                        <b>{String(index + 2).padStart(2, '0')}</b>
                        <div>
                          <h4>
                            {row.name} · {row.value}
                          </h4>
                          <p>{row.use}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.visuallyHidden}>
                    Measured contrast pairs, computed from the token values
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Pair</th>
                      <th scope="col">Ratio</th>
                      <th scope="col">Where it is used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrast.map((pair) => (
                      <tr key={`${pair.theme}-${pair.label}`}>
                        <th scope="row">{pair.label}</th>
                        <td>
                          {pair.ratio.toFixed(2)}:1
                          <span
                            className={styles.level}
                            data-level={pair.level}
                          >
                            {pair.level}
                          </span>
                        </td>
                        <td>{pair.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.downloads}>
                <a href="/brand/hachure/hachure-tokens.css" download>
                  Tokens CSS ↓
                </a>
                <a href="/brand/hachure/hachure-tokens.json" download>
                  Tokens JSON ↓
                </a>
                <a href="/brand/hachure/hachure-brandkit.png" download>
                  Brand board ↓
                </a>
                <a href="/brand/hachure/mark.svg" download>
                  Mark SVG ↓
                </a>
                <a href="/brand/hachure/wordmark.svg" download>
                  Wordmark ↓
                </a>
                <a href="/brand/hachure/lockup.svg" download>
                  Lockup ↓
                </a>
              </div>
            </div>
          </section>

          {/* 11 — audit */}
          <section
            className={styles.section}
            id="audit"
            aria-labelledby="audit-title"
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railNumber}>11</span>
              <span className={styles.railLabel}>Audit</span>
              <span className={styles.railRule} />
            </div>
            <div>
              <SectionHead
                id="audit"
                number="11"
                label="Audit"
                title="Measured, or it is not a claim."
                lead="A specimen that hides its gaps is a brochure. These are the numbers this page can defend, the files they live in, and the checks that were not run."
              />

              <div className={styles.auditGrid}>
                <article className={styles.auditCard}>
                  <p className={styles.label}>Measured</p>
                  <h3>Numbers</h3>
                  <ul>
                    <li>
                      {measured} contrast pairs are computed from the token
                      values by the build. Every pair passes AA except{' '}
                      {failing.length === 1
                        ? `one: ${failing[0].label} at ${failing[0].ratio.toFixed(2)}:1`
                        : 'the ones listed as Fail'}
                      , which the colour rule forbids from carrying type.
                    </li>
                    <li>
                      The range accent — tone 5 — measures 4.82:1 in light and
                      5.06:1 at night. That is why it is the only tone allowed
                      to set the footer&apos;s links, badges and focus ring.
                    </li>
                    <li>
                      The footer is fed an explicit palette, so it never falls
                      back to the component&apos;s stock defaults. The night
                      plate is its own ramp, not an inversion.
                    </li>
                    <li>
                      Every edge, mark, wordmark, favicon and favicon cell is an
                      SVG drawing. The page loads no images at runtime.
                    </li>
                    <li>
                      The mark is one solid mass and one lit crest, on the same 64
                      grid as the field; the 16px favicon is that same drawing,
                      not a compact redraw.
                    </li>
                  </ul>
                </article>

                <article className={styles.auditCard}>
                  <p className={styles.label}>Files</p>
                  <h3>Where it lives</h3>
                  <ul>
                    <li>
                      Tokens: <code>features/hachure/tokens.json</code> →{' '}
                      <code>hachure-tokens.css</code> and the public JSON.
                    </li>
                    <li>
                      Marks: <code>public/brand/hachure/</code> — mark, mono,
                      wordmark, lockup, favicons.
                    </li>
                    <li>
                      Board: <code>design/brand/hachure/brandkit.html</code> →{' '}
                      <code>hachure-brandkit.png</code> at 1500 × 1125.
                    </li>
                    <li>
                      Component:{' '}
                      <code>components/ui/ridgeline-dither-footer.tsx</code>,
                      supplied; one ref-sync effect was added for the React
                      Compiler lint, behaviour unchanged.
                    </li>
                    <li>
                      Field:{' '}
                      <code>features/hachure/components/dither-field.tsx</code>{' '}
                      wraps that engine for the two full-bleed exposures, adding{' '}
                      <code>develop</code>, <code>fadeFrom</code> and a theme
                      watcher — a canvas cannot inherit a CSS variable.
                    </li>
                    <li>
                      Generators: <code>scripts/build-hachure-brand.mjs</code>,{' '}
                      <code>scripts/hachure-wordmark.py</code>,{' '}
                      <code>scripts/render-hachure-board.mjs</code>,{' '}
                      <code>scripts/shoot-hachure-docs.mjs</code>.
                    </li>
                    <li>
                      Case docs: <code>design/brand/hachure/brief.md</code>,{' '}
                      <code>design/brand/hachure/DESIGN.md</code> and{' '}
                      <code>docs/hachure-design-system-audit.md</code>.
                    </li>
                  </ul>
                </article>
              </div>

              <p className={styles.gap}>
                <strong>Not verified:</strong> print. The palette is a screen
                approximation of a two-ink survey sheet; halftone at 2px, paper
                absorption and the real lichen ink have not been proofed. The
                altimeter reads a generated elevation, not a surveyed one. The
                component&apos;s{' '}
                <span className={styles.mono}>backdrop-filter</span> badge has
                not been checked in Safari, and there is no automated
                accessibility scan. No photographs are used, and none are
                promised.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.colophon}>
        <div className={styles.colophonBody}>
          <div className={styles.shell}>
            <div className={styles.colophonInner}>
              <HachureMark size={34} title="Hachure" />
              <div className={styles.colophonLinks}>
                <Link href="/design-system">Case library</Link>
                <Link href="/design-engineering">Design engineering</Link>
                <a href="/design-system/hachure/llms.txt">Markdown twin</a>
                <a href="/brand/hachure/hachure-tokens.json">Tokens</a>
                <a href="#top">Back to top ↑</a>
              </div>
            </div>
            <p className={styles.colophonNote}>
              Hachure is a fictional survey practice. The mark, favicons and
              board are drawn from geometry; the wordmark is Geist Mono 700,
              outlined and never set as live text. The footer is the supplied{' '}
              <span className={styles.mono}>ridgeline-dither-footer</span>,
              re-tokenised through its palette prop rather than rebuilt. The
              range is the same field as the hero, seeded differently and left
              to run off the bottom edge of the sheet. Case 05 / 2026.
            </p>
          </div>
        </div>

        <DitherField
          className={styles.footerField}
          tones={tokens.tones.light}
          tonesDark={tokens.tones.dark}
          seed={11}
          layers={6}
          mist={0.86}
          fadeFrom={0.44}
          duration={1400}
        />
      </footer>
    </div>
  )
}
