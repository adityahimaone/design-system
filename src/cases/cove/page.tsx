import type { Metadata } from 'next'
import { Fragment } from 'react'

import {
  AUDIT_ROWS,
  BUDGET_RULES,
  CONTRAST_PAIRS,
  DECISIONS,
  DETACH_FLOOR,
  DETACH_SCORES,
  GAPS,
  INSTRUMENTS,
  LOG_ROWS,
  MARK_GATE,
  MARK_SPECS,
  MATERIAL_RULES,
  MOTION_RULES,
  OUTPUT_CONTRACT,
  PALETTE,
  READINGS,
  STATS,
  STORY_BEATS,
  TIDE_CURVE,
  TIDE_RULES,
  TIDE_THRESHOLD,
  TOKENS_CSS,
  TOKENS_JSON,
  TYPE_GATE,
  TYPE_SCALE,
  VOICE_SAMPLES,
  type Decision,
} from '@/features/cove/cove-data'
import { CopyButton } from '@/features/cove/components/actions'
import { CoveLockup, CoveMark } from '@/features/cove/components/brand'
import { Code } from '@/features/cove/components/code'
import { CoveContents } from '@/features/cove/components/contents'
import { CoveChrome } from '@/features/cove/components/cove-chrome'
import { PartsDemo } from '@/features/cove/components/form-demo'
import {
  Alert,
  Gauge,
  ReadingCard,
  Sparkline,
  TideChart,
} from '@/features/cove/components/instruments'
import { CoveThemeToggle } from '@/features/cove/components/theme-toggle'
import styles from '@/features/cove/cove.module.css'

export const metadata: Metadata = {
  title: 'Cove — Case 09 | Design System',
  description:
    'Cove is a tidal observatory design system: a night-first ground, one lumen signal that only appears on live data, mono tabular readings, and a mark cut from two filled blocks.',
  alternates: {
    canonical: '/design-system/cove',
    types: { 'text/markdown': '/design-system/cove/llms.txt' },
  },
  openGraph: {
    title: 'Cove — Case 09 | Design System',
    description:
      'The cove is the cut; the reading is the light that arrived in it. Night-first, one signal, no glass.',
    type: 'website',
    url: '/design-system/cove',
    images: [
      {
        url: '/brand/cove/cove-brandkit.png',
        width: 3000,
        height: 2250,
        alt: 'The Cove brand board: the carved-corner mark, the outlined cove wordmark, the night and day ramps, and the gauge.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cove — Case 09 | Design System',
    description:
      'A night-first instrument for reading water: one signal, mono figures, a mark cut from two blocks.',
    images: ['/brand/cove/cove-brandkit.png'],
  },
}

const BRAND = '/brand/cove'

/** The whole material, in the six declarations that matter. */
const MATERIAL_RECIPE = `/* ground — one ink, one wash at the top of the page */
--cv-bg: #060B18;
--cv-wash: radial-gradient(
  120% 60% at 50% 0%, rgb(63 227 198 / 0.06), transparent 70%);

/* panel — value, a hairline, a 12px radius, no shadow */
--cv-plate: #0B1326;
--cv-panel-edge: 1px solid rgb(150 180 240 / 0.14);
--cv-radius-md: 12px;

/* raised — the fill moves, the edge does not */
--cv-raise: #111D36;`

function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12.5h6.5L13 6l3 11 2.5-4.5H21"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="square"
      />
    </svg>
  )
}

function DecisionCard({ decision }: { decision: Decision }) {
  const [lead, ...rest] = decision.breaksNext.split(': ')

  return (
    <div className={styles.decision}>
      <h3>{decision.title}</h3>
      <dl>
        <dt>Decision</dt>
        <dd>{decision.decision}</dd>
        <dt>Because</dt>
        <dd>{decision.because}</dd>
        <dt>Not when</dt>
        <dd>{decision.notWhen}</dd>
        <dt>Breaks next</dt>
        <dd>
          {rest.length ? (
            <>
              <em>{lead}:</em> {rest.join(': ')}
            </>
          ) : (
            decision.breaksNext
          )}
        </dd>
      </dl>
    </div>
  )
}

const weakest = DETACH_SCORES.reduce(
  (low, row) => (row.score < low.score ? row : low),
  DETACH_SCORES[0],
)

export default function CovePage() {
  return (
    <div className={styles.root} id="top">
      <CoveChrome />

      <a className={styles.skip} href="#main">
        Skip to the system
      </a>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={`${styles.shell} ${styles.topbarInner}`}>
          <a className={styles.brand} href="#top" aria-label="Cove, back to top">
            <img
              src={`${BRAND}/mark.svg`}
              width={26}
              height={26}
              alt=""
              aria-hidden="true"
              className={styles.onlyNight}
            />
            <img
              src={`${BRAND}/mark-reverse.svg`}
              width={26}
              height={26}
              alt=""
              aria-hidden="true"
              className={styles.onlyDay}
            />
            <span className={styles.brandName}>cove</span>
          </a>

          <nav className={styles.topnav} aria-label="Sections">
            <a href="#tide">Tide</a>
            <a href="#marks">Marks</a>
            <a href="#palette">Palette</a>
            <a href="#instruments">Instruments</a>
            <a href="#tokens">Tokens</a>
          </nav>

          <CoveThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* ── Hero: full bleed ─────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroMedia} aria-hidden="true" />
          <div className={styles.heroScrim} aria-hidden="true" />

          <div className={`${styles.shell} ${styles.heroInner}`}>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>
                  Brand kit &amp; design system · v2.0 · 29 Oct 2026
                </p>
                <h1 className={styles.heroTitle}>
                  The cove is the cut. The reading is <em>the light</em> that
                  arrived in it.
                </h1>
                <p className={styles.heroLede}>
                  Cove is an instrument for reading water after dark: one
                  signal, mono figures, and a time on every number. Night is not
                  a theme here — it is the default surface, and daylight is the
                  exception that has to be designed second.
                </p>
                <div className={styles.heroMeta}>
                  <span className={styles.pill}>
                    <b>112</b> token declarations
                  </span>
                  <span className={styles.pill}>
                    <b>17.19:1</b> ink on abyss
                  </span>
                  <span className={styles.pill}>
                    <b>2%</b> signal budget
                  </span>
                  <span className={styles.pill}>
                    <b>0</b> shadows on panels
                  </span>
                </div>
              </div>

              <div className={styles.heroPlate}>
                <div className={styles.heroPlateTop}>
                  <CoveLockup height={20} />
                  <span>Station 04 · sample</span>
                </div>
                <dl className={styles.heroPlateRows}>
                  {READINGS.slice(0, 4).map((reading) => (
                    <div key={reading.id} className={styles.heroPlateRow}>
                      <dt>{reading.label}</dt>
                      <dd>
                        {reading.value}
                        <small>{reading.unit}</small>
                      </dd>
                      <dd className={styles.plateTime}>{reading.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className={styles.heroStats}>
              {STATS.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.layout}`}>
          <CoveContents />

          <div className={styles.content}>
            {/* ── 01 Foundation ────────────────────────────────────────── */}
            <section id="foundation">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>01 — Foundation</p>
                <h2>A number without a time on it is decoration.</h2>
                <p>
                  Everything below follows from one belief, one enemy and one
                  material. If a part does not serve the belief, it is
                  decoration, and decoration is what this system was built to
                  refuse.
                </p>
              </div>

              <div className={styles.belief}>
                {STORY_BEATS.slice(0, 3).map((beat) => (
                  <div key={beat.beat}>
                    <h3>{beat.beat}</h3>
                    <p>{beat.line}</p>
                  </div>
                ))}
              </div>

              <div className={styles.sentence}>
                <small>The sentence this work can be rejected against</small>
                <p>
                  Cove is a tidal observatory for people who read water, that
                  keeps every value as a reading with a time on it instead of a
                  dashboard that glows, made of an abyssal ground and one lumen
                  signal.
                </p>
              </div>

              <div className={styles.cards4}>
                {DECISIONS.map((decision) => (
                  <DecisionCard key={decision.title} decision={decision} />
                ))}
              </div>
            </section>

            {/* ── 02 Material ──────────────────────────────────────────── */}
            <section id="material">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>02 — Material</p>
                <h2>Ink and lumen. No glass, no shadow, one light.</h2>
                <p>
                  Elevation is a value step plus a hairline, because on a
                  near-black ground a shadow is invisible and a glow reads as
                  data. The only floating layer in the system is the plate over
                  the hero photograph, and it is the only element allowed a
                  shadow.
                </p>
              </div>

              <div className={styles.materialGrid}>
                <div className={styles.demoPanel}>
                  <div className={styles.demoPlate}>
                    <div className={styles.demoPlateHead}>
                      <b>Ground</b>
                      <code>--cv-bg</code>
                    </div>
                    <div className={styles.demoPlateValue}>
                      <strong>0</strong>
                      <span>step</span>
                    </div>
                  </div>

                  <div className={styles.demoPlate} data-state="hairline">
                    <div className={styles.demoPlateHead}>
                      <b>Panel</b>
                      <code>--cv-plate + hairline</code>
                    </div>
                    <div className={styles.demoPlateValue}>
                      <strong>1.42</strong>
                      <span>m</span>
                    </div>
                    <div className={styles.demoPlateBar}>
                      <i style={{ width: '71%' }} />
                    </div>
                  </div>

                  <div className={styles.demoPlate} data-state="raise">
                    <div className={styles.demoPlateHead}>
                      <b>Raised</b>
                      <code>--cv-raise</code>
                    </div>
                    <div className={styles.demoPlateValue}>
                      <strong>18</strong>
                      <span>kn</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className={styles.blockLabel}>Rules</p>
                  <ul className={styles.rules}>
                    {MATERIAL_RULES.map((rule) => (
                      <li key={rule.rule}>
                        <Tick />
                        <span>
                          <b>{rule.rule}.</b> {rule.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.codeHead}>
                  <span>The recipe</span>
                  <CopyButton text={MATERIAL_RECIPE} />
                </div>
                <pre>
                  <Code source={MATERIAL_RECIPE} />
                </pre>
              </div>
            </section>

            {/* ── 03 Tide ──────────────────────────────────────────────── */}
            <section id="tide">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>03 — Tide</p>
                <h2>The data layer is the identity.</h2>
                <p>
                  A tidal system that draws its charts like a marketing page has
                  no identity, only a palette. The curve below is a fixed
                  24-hour sample — twenty-four numbers, one per hour — and the
                  page says so wherever it appears.
                </p>
              </div>

              <div className={styles.tideGrid}>
                <div className={styles.tideChart}>
                  <div className={styles.tideChartHead}>
                    <b>Water level · 24 h sample</b>
                    <span>min 0.62 · max 1.36 · now 1.42 m</span>
                  </div>
                  <TideChart values={TIDE_CURVE} threshold={TIDE_THRESHOLD} />
                  <div className={styles.tideAxis}>
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>

                <div className={styles.tideRules}>
                  {TIDE_RULES.map((rule) => (
                    <div key={rule.rule} className={styles.tideRule}>
                      <b>{rule.rule}</b>
                      <span>{rule.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.readingRow}>
                {READINGS.map((reading) => (
                  <ReadingCard key={reading.id} reading={reading} />
                ))}
              </div>

              <p className={styles.note}>
                Five readings, one card each. The dot is the only thing that
                moves: <code>2.4s</code>, one element per view, and it stops
                under <code>prefers-reduced-motion</code>. A stale reading drops
                to haze and loses the dot — it does not fade out, it stops
                claiming to be live.
              </p>
            </section>

            {/* ── 04 Marks ─────────────────────────────────────────────── */}
            <section id="marks">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>04 — Marks</p>
                <h2>Two filled shapes, six units apart.</h2>
                <p>
                  A carved corner and the reading nested in its cut, held apart
                  by six units of ground. Nine drawings were made; eight lost,
                  most of them to the 16px test. The survivor is the only one
                  that still read as a cove when it was the size of a favicon.
                </p>
              </div>

              <div className={styles.logoCard}>
                <div className={styles.stage}>
                  <div className={styles.stageClear}>
                    <img
                      src={`${BRAND}/lockup.svg`}
                      alt="Cove lockup: the carved-corner mark with the reading nested in its cut, beside the outlined wordmark"
                      width={330}
                      height={128}
                      className={styles.onlyNight}
                    />
                    <img
                      src={`${BRAND}/lockup-reverse.svg`}
                      alt="Cove lockup on the day ground"
                      width={330}
                      height={128}
                      className={styles.onlyDay}
                    />
                  </div>
                  <div className={styles.stageRail}>
                    <span>Logo / 01 · mark + wordmark</span>
                    <span>64 grid · channel 6</span>
                  </div>
                </div>

                <div className={styles.logoBody}>
                  <div>
                    <p className={styles.blockLabel}>Specs</p>
                    <dl className={styles.specs}>
                      {MARK_SPECS.map((spec) => (
                        <Fragment key={spec.key}>
                          <dt>{spec.key}</dt>
                          <dd>{spec.value}</dd>
                        </Fragment>
                      ))}
                      <dt>Files</dt>
                      <dd>
                        <code>public/brand/cove/</code>
                      </dd>
                    </dl>
                    <div className={styles.downloads}>
                      <a href={`${BRAND}/mark.svg`} download>
                        Mark .svg
                      </a>
                      <a href={`${BRAND}/lockup.svg`} download>
                        Lockup .svg
                      </a>
                      <a href={`${BRAND}/mark-compact.svg`} download>
                        Compact .svg
                      </a>
                      <a href={`${BRAND}/wordmark.svg`} download>
                        Wordmark .svg
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className={styles.blockLabel}>Sizes</p>
                    <div className={styles.partRow}>
                      <CoveMark size={64} />
                      <CoveMark size={32} />
                      <CoveMark size={24} compact />
                      <CoveMark size={16} compact />
                    </div>
                    <p className={styles.note}>
                      At 16 and 24 the compact drawing drops the reading and
                      thickens the arms to 25 units, because a 14-unit block
                      cannot survive a 3.5px gap. That is a deliberate
                      degradation, not a downscale.
                    </p>
                  </div>
                </div>
              </div>

              <p className={styles.blockLabel} style={{ marginTop: 26 }}>
                The mark gate
              </p>
              <div className={styles.gate}>
                {MARK_GATE.map((row) => (
                  <div key={row.rule} className={styles.gateRow}>
                    <span
                      className={`${styles.gateMark} ${row.pass ? '' : styles.gateFail}`}
                      aria-hidden
                    >
                      {row.pass ? '✓' : '✕'}
                    </span>
                    <div>
                      <b>
                        {row.rule}
                        <span className={styles.srOnly}>
                          {row.pass ? ' — pass' : ' — fail'}
                        </span>
                      </b>
                      <span>{row.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 05 Palette ───────────────────────────────────────────── */}
            <section id="palette">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>05 — Palette</p>
                <h2>Four values of ink, one signal, one alarm.</h2>
                <p>
                  The night ramp is a value ladder — abyss, deep, raise — and the
                  daylight ramp is a second palette, not an inversion. Lumen is
                  not a brand colour; it is the state of being live.
                </p>
              </div>

              <div className={styles.swatches}>
                {PALETTE.map((ink) => (
                  <div key={ink.token} className={styles.swatch}>
                    <div
                      className={styles.chip}
                      style={{ background: ink.value, color: ink.ink }}
                    >
                      <span>{ink.token.replace('--cv-', '')}</span>
                    </div>
                    <div className={styles.meta}>
                      <b>{ink.name}</b>
                      <code>{ink.value}</code>
                      {ink.role}
                    </div>
                  </div>
                ))}
              </div>

              <table>
                <caption>Measured pairs — computed, not estimated</caption>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Allowed use</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST_PAIRS.map((pair) => (
                    <tr key={pair.pair}>
                      <td>{pair.pair}</td>
                      <td className={styles.num}>{pair.ratio}</td>
                      <td>{pair.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.loudDemo}>
                <div>
                  <p>
                    &ldquo;The signal is a state, never a surface. If a
                    screenshot has three glowing things, one of them is
                    wrong.&rdquo;
                  </p>
                  <small>Abyss on lumen · 12.18:1 · the only loud field</small>
                </div>
                <img
                  src={`${BRAND}/mark-reverse.svg`}
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <p className={styles.blockLabel} style={{ marginTop: 26 }}>
                Signal budget
              </p>
              <ul className={styles.budget}>
                {BUDGET_RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>

            {/* ── 06 Type ──────────────────────────────────────────────── */}
            <section id="type">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>06 — Type</p>
                <h2>
                  Display for names, reading for sentences, mono for facts.
                </h2>
                <p>
                  Three families, no fourth. Sora names the sections, Geist
                  reads the sentences, and JetBrains Mono carries every number —
                  with tabular figures, because a column of readings has to
                  align on the decimal to be scanned.
                </p>
              </div>

              <div className={styles.typeGrid}>
                <div className={styles.typeCol}>
                  <span className={styles.label}>Display · Sora 600</span>
                  <p className={`${styles.spec} ${styles.displaySpec}`}>
                    Aa 02:10
                  </p>
                  <p>
                    Names and section headings. 600 only, tracking −0.035em at
                    display sizes, one hero line per page.
                  </p>
                </div>
                <div className={styles.typeCol}>
                  <span className={styles.label}>Reading · Geist 400</span>
                  <p className={`${styles.spec} ${styles.readSpec}`}>
                    Aa 02:10
                  </p>
                  <p>
                    Body 17px at 1.62, 66ch measure. Nothing is set lighter than
                    regular, and prose never uses the mono face.
                  </p>
                </div>
                <div className={styles.typeCol}>
                  <span className={styles.label}>Label · JetBrains 500</span>
                  <p className={`${styles.spec} ${styles.monoSpec}`}>02:10</p>
                  <p>
                    Times, values, units, eyebrows, axis labels. Tabular figures
                    on every changing number.
                  </p>
                </div>
              </div>

              <table>
                <caption>Scale</caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Size / line</th>
                    <th scope="col">Face</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPE_SCALE.map((row) => (
                    <tr key={row.token}>
                      <td className={styles.num}>{row.token}</td>
                      <td className={styles.num}>{row.size}</td>
                      <td>{row.face}</td>
                      <td>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.measureDemo}>
                <p>
                  The tide turned at 04:12 and the level fell six centimetres in
                  the hour after it. Nothing about that sentence belongs in a
                  heading: the turn is the reading, and the number that carries
                  it is set in mono so a column of them can be scanned. Cove
                  keeps the hour and the unit, and prints the station only once.
                </p>
                <aside>
                  Measure: 68 characters at 17px.
                  <br />
                  <code>text-wrap: pretty</code> on paragraphs,{' '}
                  <code>balance</code> on headings.
                </aside>
              </div>

              <div className={styles.gate} style={{ marginTop: 12 }}>
                {TYPE_GATE.map((row) => (
                  <div key={row.rule} className={styles.gateRow}>
                    <span className={styles.gateMark} aria-hidden>
                      {row.pass ? '✓' : '✕'}
                    </span>
                    <div>
                      <b>{row.rule}</b>
                      <span>{row.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 07 Parts ─────────────────────────────────────────────── */}
            <section id="parts">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>07 — Parts</p>
                <h2>Four primitives, cut from the same sheet.</h2>
                <p>
                  Radius 12 on panels and 8 on controls, one hairline, no shadow.
                  Every control is at least 40px tall because it is used at
                  night, one-handed, and often wet.
                </p>
              </div>

              <PartsDemo />

              <p className={styles.note}>
                Focus is a 2px lumen ring at 2px offset, on every control. It is
                the one place the signal is allowed to appear without a value
                behind it.
              </p>
            </section>

            {/* ── 08 Instruments ───────────────────────────────────────── */}
            <section id="instruments">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>08 — Instruments</p>
                <h2>Five parts that only exist to show a number.</h2>
                <p>
                  This section is the reason the case is not a colour page. Each
                  instrument has one job and one rule, and none of them animates
                  to look alive — the fill settles once, on mount, and stops.
                </p>
              </div>

              <div className={styles.instGrid}>
                <div className={styles.instCard}>
                  <div className={styles.instHead}>
                    <h3>{INSTRUMENTS[0].name}</h3>
                    <span>01</span>
                  </div>
                  <Gauge
                    value={1.42}
                    max={2}
                    threshold={1.5}
                    unit="m"
                    time="02:10"
                    label="Water level"
                  />
                  <p className={styles.instJob}>{INSTRUMENTS[0].job}</p>
                  <p className={styles.instRule}>{INSTRUMENTS[0].rule}</p>
                </div>

                <div className={styles.instCard}>
                  <div className={styles.instHead}>
                    <h3>{INSTRUMENTS[1].name}</h3>
                    <span>02</span>
                  </div>
                  <Sparkline
                    values={TIDE_CURVE}
                    label="Twenty-four hour water level, no axes"
                  />
                  <div className={styles.sparkMeta}>
                    <span>min 0.62</span>
                    <span>max 1.36</span>
                    <span>now 1.42</span>
                  </div>
                  <p className={styles.instJob}>{INSTRUMENTS[1].job}</p>
                  <p className={styles.instRule}>{INSTRUMENTS[1].rule}</p>
                </div>

                <div className={styles.instCard}>
                  <div className={styles.instHead}>
                    <h3>{INSTRUMENTS[2].name}</h3>
                    <span>03</span>
                  </div>
                  <ReadingCard reading={READINGS[1]} />
                  <p className={styles.instJob}>{INSTRUMENTS[2].job}</p>
                  <p className={styles.instRule}>{INSTRUMENTS[2].rule}</p>
                </div>

                <div className={styles.instCard}>
                  <div className={styles.instHead}>
                    <h3>{INSTRUMENTS[3].name}</h3>
                    <span>04</span>
                  </div>
                  <div className={styles.log}>
                    {LOG_ROWS.map((row) => (
                      <div
                        key={`${row.time}-${row.label}`}
                        className={styles.logRow}
                      >
                        <span className={styles.logTime}>{row.time}</span>
                        <span className={styles.logName}>{row.label}</span>
                        <span className={styles.logVal}>{row.value}</span>
                        <span
                          className={[
                            styles.dot,
                            row.state === 'slack' ? styles.dotSlack : '',
                            row.state === 'alarm' ? styles.dotAlarm : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          aria-hidden
                        />
                      </div>
                    ))}
                  </div>
                  <p className={styles.instRule}>{INSTRUMENTS[3].rule}</p>
                </div>

                <div className={styles.instCard}>
                  <div className={styles.instHead}>
                    <h3>{INSTRUMENTS[4].name}</h3>
                    <span>05</span>
                  </div>
                  <Alert
                    title="Wind crossed 15 kn at 01:48"
                    body="Readings above the limit are marked. The panel stays deep — an alarm is not a red card."
                  />
                  <p className={styles.instJob}>{INSTRUMENTS[4].job}</p>
                  <p className={styles.instRule}>{INSTRUMENTS[4].rule}</p>
                </div>
              </div>
            </section>

            {/* ── 09 Motion ────────────────────────────────────────────── */}
            <section id="motion">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>09 — Motion</p>
                <h2>Five durations, one curve, a finished still.</h2>
                <p>
                  Motion is a fill settling, not a performance. The bars below
                  exist to show the timings; in the product nothing loops except
                  the live dot.
                </p>
              </div>

              <div className={styles.motionGrid}>
                {MOTION_RULES.map((rule) => (
                  <div key={rule.name} className={styles.dur}>
                    <b data-long={rule.value.length > 8}>{rule.value}</b>
                    <span>
                      <strong>{rule.name}</strong>
                      <br />
                      {rule.note}
                    </span>
                    <div className={styles.bar} aria-hidden>
                      <i style={{ width: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.settleDemo}>
                <div className={styles.settle}>
                  <b>Gauge · settles once</b>
                  <Gauge
                    value={0.84}
                    max={2}
                    threshold={1.5}
                    unit="m"
                    time="02:10"
                    label="Swell height"
                  />
                </div>
                <div className={styles.settle}>
                  <b>Sparkline · draws once</b>
                  <Sparkline
                    values={TIDE_CURVE}
                    label="Twenty-four hour water level, drawn once"
                  />
                  <div className={styles.sparkMeta}>
                    <span>1.5px stroke</span>
                    <span>no area fill</span>
                  </div>
                </div>
              </div>

              <p className={styles.note}>
                <code>--cv-ease-out: cubic-bezier(0.16, 1, 0.3, 1)</code> — fast
                out, no bounce. Under <code>prefers-reduced-motion</code> every
                duration collapses to 0.01ms and the still frame is the designed
                state.
              </p>
            </section>

            {/* ── 10 Voice ─────────────────────────────────────────────── */}
            <section id="voice">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>10 — Voice</p>
                <h2>Read it. Do not sell it.</h2>
                <p>
                  The voice is a person who took the reading. It states the
                  value, the unit and the time, then stops. It does not
                  congratulate, does not describe the weather as a mood, and
                  never says &ldquo;oops&rdquo;.
                </p>
              </div>

              <div className={styles.voiceGrid}>
                <dl className={styles.voiceCard}>
                  <div>
                    <dt>We are</dt>
                    <dd>exact, unhurried, first person, numeric</dd>
                  </div>
                  <div>
                    <dt>We are not</dt>
                    <dd>hyped, poetic about water, apologetic, jargon-first</dd>
                  </div>
                  <div>
                    <dt>Say</dt>
                    <dd>
                      &ldquo;1.42 m at 02:10. Rising 6 cm in the last hour.&rdquo;
                    </dd>
                  </div>
                  <div>
                    <dt>Don&rsquo;t say</dt>
                    <dd>&ldquo;The tide is looking great tonight!&rdquo;</dd>
                  </div>
                </dl>

                <div className={styles.voiceSamples}>
                  {VOICE_SAMPLES.map((sample) => (
                    <div key={sample.ctx} className={styles.sample}>
                      <div className={styles.ctx}>{sample.ctx}</div>
                      <p>{sample.good}</p>
                      <span className={styles.bad}>{sample.bad}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 11 Tokens ────────────────────────────────────────────── */}
            <section id="tokens">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>11 — Tokens</p>
                <h2>One source, two exports, one excerpt.</h2>
                <p>
                  The block below is an excerpt of the generated sheet — 112
                  declarations live in the file, and the file is what you should
                  copy. Nothing in the system reads a raw hex; every part reads a
                  semantic name.
                </p>
              </div>

              <div className={styles.tokenGrid}>
                <div>
                  <div className={styles.codeHead}>
                    <span>cove-tokens.css · excerpt</span>
                    <CopyButton text={TOKENS_CSS} />
                  </div>
                  <pre>
                    <Code source={TOKENS_CSS} />
                  </pre>
                </div>
                <div>
                  <div className={styles.codeHead}>
                    <span>cove-tokens.json · excerpt</span>
                    <CopyButton text={TOKENS_JSON} />
                  </div>
                  <pre>
                    <Code source={TOKENS_JSON} language="json" />
                  </pre>
                </div>
              </div>

              <p className={styles.note}>
                Full files:{' '}
                <a href={`${BRAND}/cove-tokens.css`}>cove-tokens.css</a> ·{' '}
                <a href={`${BRAND}/cove-tokens.json`}>cove-tokens.json</a> ·{' '}
                <a href="/design-system/cove/llms.txt">llms.txt</a>
              </p>

              <table>
                <caption>Output contract</caption>
                <thead>
                  <tr>
                    <th scope="col">Path</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {OUTPUT_CONTRACT.map((row) => (
                    <tr key={row.path}>
                      <td className={styles.num}>{row.path}</td>
                      <td>{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ── 12 Audit ─────────────────────────────────────────────── */}
            <section id="audit">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>12 — Audit</p>
                <h2>What is verified, and what is not.</h2>
                <p>
                  Every claim above points at a file or a measurement.
                  Everything else is listed as open — a guide that hides its gaps
                  is a brochure.
                </p>
              </div>

              <table>
                <caption>Checks</caption>
                <thead>
                  <tr>
                    <th scope="col">Check</th>
                    <th scope="col">Result</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_ROWS.map((row) => (
                    <tr key={row.check}>
                      <td>{row.check}</td>
                      <td
                        className={
                          row.state === 'pass'
                            ? styles.pass
                            : row.state === 'open'
                              ? styles.open
                              : styles.noteCell
                        }
                      >
                        {row.result}
                      </td>
                      <td>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.detach}>
                <div className={styles.detachHead}>
                  <span>Detach scorecard · 100 points</span>
                  <span>floor {DETACH_FLOOR}</span>
                </div>
                {DETACH_SCORES.map((row) => (
                  <div
                    key={row.ref}
                    className={styles.detachRow}
                    data-fail={row.score < DETACH_FLOOR}
                  >
                    <b>{row.ref}</b>
                    <div className={styles.detachTrack}>
                      <i style={{ width: `${row.score}%` }} />
                    </div>
                    <span className={styles.detachScore}>{row.score}</span>
                  </div>
                ))}
                <p className={styles.detachNote}>
                  The weakest pair is {weakest.ref} at {weakest.score}, against a
                  floor of {DETACH_FLOOR}. {weakest.finding}
                </p>
              </div>

              <p className={styles.blockLabel} style={{ marginTop: 26 }}>
                Still open
              </p>
              <ul className={styles.gaps}>
                {GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer: full bleed ─────────────────────────────────────────── */}
      <footer className={styles.foot}>
        <div className={styles.footMedia} aria-hidden="true" />
        <div className={styles.footScrim} aria-hidden="true" />

        <div className={`${styles.shell} ${styles.footInner}`}>
          <div className={styles.footGrid}>
            <div>
              <img
                src={`${BRAND}/lockup.svg`}
                alt="Cove"
                width={260}
                height={100}
                className={`${styles.footLockup} ${styles.onlyNight}`}
              />
              <img
                src={`${BRAND}/lockup-reverse.svg`}
                alt="Cove"
                width={260}
                height={100}
                className={`${styles.footLockup} ${styles.onlyDay}`}
              />
              <p className={styles.footLine}>
                The cove is the cut. The reading is{' '}
                <em>the light that arrived</em> in it.
              </p>
            </div>

            <div className={styles.footCols}>
              <div className={styles.footCol}>
                <h4>System</h4>
                <ul>
                  <li>
                    <a href="#foundation">Foundation</a>
                  </li>
                  <li>
                    <a href="#material">Material</a>
                  </li>
                  <li>
                    <a href="#tide">Tide</a>
                  </li>
                  <li>
                    <a href="#instruments">Instruments</a>
                  </li>
                </ul>
              </div>
              <div className={styles.footCol}>
                <h4>Assets</h4>
                <ul>
                  <li>
                    <a href={`${BRAND}/mark.svg`} download>
                      mark.svg
                    </a>
                  </li>
                  <li>
                    <a href={`${BRAND}/lockup.svg`} download>
                      lockup.svg
                    </a>
                  </li>
                  <li>
                    <a href={`${BRAND}/cove-brandkit.png`}>brand board</a>
                  </li>
                  <li>
                    <a href={`${BRAND}/cove-tokens.css`}>tokens.css</a>
                  </li>
                </ul>
              </div>
              <div className={styles.footCol}>
                <h4>Reading</h4>
                <ul>
                  <li>
                    <span>Station 04 · north arm</span>
                  </li>
                  <li>
                    <span>sample · 29 Oct 2026</span>
                  </li>
                  <li>
                    <span>night ramp · 02:10</span>
                  </li>
                  <li>
                    <a href="/design-system/cove/llms.txt">llms.txt</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footBottom}>
            <span>
              Cove · brand kit &amp; design system · v2.0 · 29 Oct 2026
            </span>
            <span>
              <a href="/design-system">All cases</a> ·{' '}
              <a href="/design-system/cove/llms.txt">llms.txt</a> ·{' '}
              <a href="#top">Back to top</a>
            </span>
            <span>Case 09 · night-first · 112 tokens</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
