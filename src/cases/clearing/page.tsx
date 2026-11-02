import type { Metadata } from 'next'
import { Fragment } from 'react'

import {
  AUDIT_ROWS,
  CAST,
  CONTRAST_PAIRS,
  DECISIONS,
  GAPS,
  GLASS_RECIPE,
  MARK_SPECS,
  PALETTE,
  TOKENS_CSS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
  type Decision,
} from '@/features/clearing/clearing-data'
import { CopyButton } from '@/features/clearing/components/actions'
import { ClearingChrome } from '@/features/clearing/components/clearing-chrome'
import { Code } from '@/features/clearing/components/code'
import { ClearingContents } from '@/features/clearing/components/contents'
import { ClearingThemeToggle } from '@/features/clearing/components/theme-toggle'
import styles from '@/features/clearing/clearing.module.css'

export const metadata: Metadata = {
  title: 'Clearing — Case 08 | Design System',
  description:
    'Clearing is a field-journal design system: painted emerald light, one pane of glass, cream reading plates, a drawn stag on a tapered horizon, and an audit that names what it could not verify.',
  alternates: {
    canonical: '/design-system/clearing',
    types: { 'text/markdown': '/design-system/clearing/llms.txt' },
  },
  openGraph: {
    title: 'Clearing — Case 08 | Design System',
    description:
      'A field journal for the light between the trees. Painted emerald, one pane of glass, and a sighting that takes twenty seconds in the field.',
    type: 'website',
    url: '/design-system/clearing',
    images: [
      {
        url: '/brand/clearing/clearing-brandkit.png',
        width: 3000,
        height: 2250,
        alt: 'The Clearing brand board: the stag on a tapered horizon, the outlined clearing wordmark with a disc tittle, six inks, and the glass recipe.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clearing — Case 08 | Design System',
    description:
      'Painted emerald, one pane of glass, a drawn stag on a horizon line. A field journal for people who watch wildlife.',
    images: ['/brand/clearing/clearing-brandkit.png'],
  },
}

const BRAND = '/brand/clearing'

function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        d="M4 12.5l5 5L20 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DecisionCard({ decision }: { decision: Decision }) {
  // "Breaks next" opens with a named condition, set in the rare ink.
  const [lead, ...rest] = decision.breaksNext.split(': ')

  return (
    <div className={styles.decision}>
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

export default function ClearingPage() {
  return (
    <div className={styles.root} id="top">
      <ClearingChrome />

      <a className={styles.skip} href="#main">
        Skip to the system
      </a>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={`${styles.shell} ${styles.topbarInner}`}>
          <a
            className={styles.brand}
            href="#top"
            aria-label="Clearing, back to top"
          >
            {}
            <img
              src={`${BRAND}/mark.svg`}
              width={30}
              height={30}
              alt=""
              aria-hidden="true"
            />
            <span>clearing</span>
          </a>

          <nav className={styles.topnav} aria-label="Sections">
            <a href="#marks">Marks</a>
            <a href="#colour">Colour</a>
            <a href="#type">Type</a>
            <a href="#parts">Parts</a>
            <a href="#tokens">Tokens</a>
          </nav>

          <ClearingThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.shell}>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>
                  Brand kit &amp; design system · v1.0 · 28 Oct 2026
                </p>
                <h1>
                  A field journal for the light <em>between the trees</em>.
                </h1>
                <p className={styles.lede}>
                  Clearing is for people who watch wildlife rather than collect
                  it. Painted emerald, one pane of glass, cream light — and a
                  sighting that takes twenty seconds in the field, gloves on,
                  sun on the screen.
                </p>
                <div className={styles.heroMeta}>
                  <span className={styles.pill}>
                    <b>27</b> tokens
                  </span>
                  <span className={styles.pill}>
                    <b>8.71:1</b> cream on emerald
                  </span>
                  <span className={styles.pill}>
                    <b>5</b> cast marks
                  </span>
                  <span className={styles.pill}>
                    <b>64</b> unit grid
                  </span>
                </div>
              </div>

              <div className={styles.heroMedia}>
                {}
                <img
                  src={`${BRAND}/painting.webp`}
                  alt="A painted emerald valley: three deer crossing a sunlit clearing between dark trees."
                  width={1656}
                  height={940}
                />
                <div className={`${styles.heroPane} ${styles.pane}`}>
                  {}
                  <img
                    src={`${BRAND}/lockup-horizontal-reverse.svg`}
                    alt="Clearing"
                    width={150}
                    height={59}
                  />
                  <span>
                    One pane
                    <br />
                    over painted light
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <b>6</b>
                <span>inks, each with one job</span>
              </div>
              <div className={styles.stat}>
                <b>3.2</b>
                <span>cut line, shared by the cast</span>
              </div>
              <div className={styles.stat}>
                <b>16</b>
                <span>px compact, tested on ink</span>
              </div>
              <div className={styles.stat}>
                <b>1</b>
                <span>effect: the pane. Nothing else</span>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.layout}`}>
          <ClearingContents />

          <div>
            {/* ── 01 Foundation ────────────────────────────────────────── */}
            <section id="foundation">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>01 — Foundation</p>
                <h2>Watching is the work.</h2>
                <p>
                  Everything below follows from one belief and one enemy. If a
                  component does not serve the belief, it is decoration.
                </p>
              </div>

              <div className={styles.belief}>
                <div>
                  <h3>Belief</h3>
                  <p>
                    Recording a sighting should cost nothing. The app is a
                    notebook with a memory, not a feed.
                  </p>
                </div>
                <div>
                  <h3>Enemy</h3>
                  <p>
                    Apps that turn a deer into a data point: streaks, counts,
                    leaderboards, notifications at dusk.
                  </p>
                </div>
                <div>
                  <h3>Material</h3>
                  <p>
                    Painted emerald ground, one translucent pane, cream light,
                    one glint. No second effect.
                  </p>
                </div>
              </div>

              <div className={styles.sentence}>
                <small>The sentence this work can be rejected against</small>
                <p>
                  Clearing is a field journal for people who watch wildlife,
                  that keeps a sighting as a painted page instead of a database
                  row, made of painted emerald light seen through one pane of
                  glass.
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
                <h2>One pane, over painted light.</h2>
                <p>
                  Glass is the only effect in the system. It carries chrome that
                  floats over the painting — never body copy, never a card in a
                  list, never two panes stacked.
                </p>
              </div>

              <div className={styles.materialGrid}>
                <div className={styles.demoGlass}>
                  {}
                  <img
                    src={`${BRAND}/painting.webp`}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className={styles.pane}>
                    <div className={styles.plate}>
                      <strong>Sighting 041 · Red deer</strong>
                      <p>
                        Three hinds crossed the clearing at 06:40, downwind. The
                        light held for eleven seconds.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className={styles.blockLabel}>Rules</p>
                  <ul className={styles.rules}>
                    <li>
                      <Tick />
                      <span>
                        <b>One pane per view.</b> If a second one appears, the
                        layout is wrong.
                      </span>
                    </li>
                    <li>
                      <Tick />
                      <span>
                        <b>Copy sits on a solid plate.</b> The pane holds chrome
                        and figures, not sentences.
                      </span>
                    </li>
                    <li>
                      <Tick />
                      <span>
                        <b>Measure the composite,</b> not the page behind it.
                        The meadow is 4× lighter than the trees.
                      </span>
                    </li>
                    <li>
                      <Tick />
                      <span>
                        <b>Never animate the blur.</b> Animate the plate inside
                        it, 200ms, one ease.
                      </span>
                    </li>
                    <li>
                      <Tick />
                      <span>
                        <b>Always ship a solid fallback</b> —{' '}
                        <code>@supports</code> and reduced transparency.
                      </span>
                    </li>
                  </ul>

                  <div className={styles.block}>
                    <div className={styles.codeHead}>
                      <span>The recipe</span>
                      <CopyButton text={GLASS_RECIPE} />
                    </div>
                    <pre>
                      <Code source={GLASS_RECIPE} />
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 03 Marks ─────────────────────────────────────────────── */}
            <section id="marks">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>03 — Marks</p>
                <h2>One animal, one ground line, nothing else.</h2>
                <p>
                  Drawn track: a stag cut from the painting&rsquo;s world,
                  standing on a tapered horizon. Six subjects were drawn; five
                  lost. The mark is a sighting, not a sticker.
                </p>
              </div>

              <div className={styles.logoCard}>
                <div className={styles.stage}>
                  <div className={styles.clear}>
                    {}
                    <img
                      src={`${BRAND}/lockup-horizontal-reverse.svg`}
                      alt="Clearing lockup: a stag on a horizon line beside the wordmark"
                      width={258}
                      height={102}
                    />
                  </div>
                  <div className={styles.rail}>
                    <span>Logo / 01 · mark + wordmark</span>
                    <span>64 grid · cut 2.7</span>
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
                        <code>public/brand/clearing/</code>
                      </dd>
                    </dl>
                    <div className={styles.downloads}>
                      <a href={`${BRAND}/mark.svg`} download>
                        Mark .svg
                      </a>
                      <a href={`${BRAND}/lockup-horizontal.svg`} download>
                        Lockup .svg
                      </a>
                      <a href={`${BRAND}/mark-compact.svg`} download>
                        Compact .svg
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className={styles.blockLabel}>At size</p>
                    <div className={styles.iconsRow}>
                      <figure>
                        {}
                        <img
                          src={`${BRAND}/mark.svg`}
                          width={48}
                          height={48}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>48</figcaption>
                      </figure>
                      <figure>
                        {}
                        <img
                          src={`${BRAND}/mark.svg`}
                          width={32}
                          height={32}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>32</figcaption>
                      </figure>
                      <figure>
                        {}
                        <img
                          src={`${BRAND}/mark-compact.svg`}
                          width={16}
                          height={16}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>16</figcaption>
                      </figure>
                      <figure>
                        {}
                        <img
                          src={`${BRAND}/mark-mono.svg`}
                          width={40}
                          height={40}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>1 ink</figcaption>
                      </figure>
                    </div>
                    <p className={styles.note}>
                      At 16px the primary mark becomes a smudge, so the compact
                      redraws the figure with two legs and two antler beams. It
                      is not a scale-down.
                    </p>
                  </div>
                </div>

                <div className={styles.doDont}>
                  <div className={styles.yes}>
                    <b>Do</b>
                    Let the ground line break the edge of a card. It is a
                    horizon, not a frame.
                  </div>
                  <div className={styles.no}>
                    <b>Don&rsquo;t</b>
                    Put the mark in a rounded tile, add a glow, or crop the line
                    to a square. That is a badge.
                  </div>
                </div>
              </div>

              <div className={styles.wordmarkCard}>
                <div className={styles.clear}>
                  {}
                  <img
                    src={`${BRAND}/wordmark.svg`}
                    alt="Clearing wordmark"
                    width={360}
                    height={111}
                  />
                </div>
                <div className={styles.scaleRow}>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={160}
                      height={49}
                      alt=""
                    />
                    <figcaption>160 · hero</figcaption>
                  </figure>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={80}
                      height={25}
                      alt=""
                    />
                    <figcaption>80 · header</figcaption>
                  </figure>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={40}
                      height={12}
                      alt=""
                    />
                    <figcaption>40 · minimum</figcaption>
                  </figure>
                  <p
                    className={styles.note}
                    style={{ margin: 0, maxWidth: '40ch' }}
                  >
                    Set in Iowan Old Style, outlined, with the tittle replaced
                    by the light disc. The reading face takes over below 40px —
                    the drawn name is never squeezed.
                  </p>
                </div>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>
                  The cast — punctuation, never structure
                </p>
                <div className={styles.drawer}>
                  {CAST.map((mark) => (
                    <div
                      key={mark.id}
                      className={`${styles.castTile} ${styles[mark.span]}`}
                    >
                      {}
                      <img
                        src={`${BRAND}/cast/${mark.id}.svg`}
                        width={64}
                        height={64}
                        alt=""
                        aria-hidden="true"
                      />
                      <b>{mark.name}</b>
                      <span>{mark.job}</span>
                      <small>{mark.index}</small>
                    </div>
                  ))}
                </div>
                <div className={styles.ruleNote}>
                  <b>One rule.</b> The cast is punctuation. It marks a time, a
                  trace, a species, a weather, a sound — five jobs, no more. It
                  never carries a fact on its own, never sits over type, never
                  goes in a favicon, and never exceeds five marks in one
                  composition.
                </div>
              </div>
            </section>

            {/* ── 04 Colour ────────────────────────────────────────────── */}
            <section id="colour">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>04 — Colour</p>
                <h2>Each ink has one job.</h2>
                <p>
                  Six colours lifted from the painting&rsquo;s physical world:
                  bark, canopy shadow, wet moss, sunlit leaf, paper sky, deer
                  flank. Roles are fixed; hex values are not a mood board.
                </p>
              </div>

              <div className={styles.swatches}>
                {PALETTE.map((ink) => (
                  <div key={ink.token} className={styles.swatch}>
                    <div
                      className={styles.chip}
                      style={{
                        background: ink.hex,
                        borderBottom:
                          ink.name === 'Cream'
                            ? '1px solid rgb(14 33 28 / 0.1)'
                            : undefined,
                      }}
                    >
                      <span
                        style={{ color: ink.onDark ? '#0E211C' : '#F3EDDE' }}
                      >
                        {ink.token.replace('--cl-', '')}
                      </span>
                    </div>
                    <div className={styles.meta}>
                      <b>{ink.name}</b>
                      <code>{ink.hex}</code>
                      <br />
                      {ink.short}
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
                    &ldquo;One loud field per view. If the page needs two, the
                    page has two ideas.&rdquo;
                  </p>
                  <small>
                    Cream on emerald · 8.71:1 · the only inverted surface
                  </small>
                </div>
                {}
                <img
                  src={`${BRAND}/mark-reverse.svg`}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </section>

            {/* ── 05 Type ──────────────────────────────────────────────── */}
            <section id="type">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>05 — Type</p>
                <h2>
                  Display for names, reading for sentences, mono for facts.
                </h2>
                <p>
                  Three families, no fourth. Iowan Old Style carries the names
                  because the brand is a book; the system sans carries the
                  interface because it must disappear in the field.
                </p>
              </div>

              <div className={styles.typeGrid}>
                <div className={styles.typeCol}>
                  <span className={styles.label}>
                    Display · Iowan Old Style
                  </span>
                  <p className={`${styles.spec} ${styles.displaySpec}`}>
                    Aa Kk 06:40
                  </p>
                  <p>
                    Names, section headings, the promise. 400 weight only.
                    Tracking −0.014em at display sizes.
                  </p>
                </div>
                <div className={styles.typeCol}>
                  <span className={styles.label}>Reading · system sans</span>
                  <p className={styles.spec} style={{ fontSize: '2.2rem' }}>
                    Aa Kk 06:40
                  </p>
                  <p>
                    Body 17px, 1.6 line-height, 66ch measure. Inputs and buttons
                    never below 14px.
                  </p>
                </div>
                <div className={styles.typeCol}>
                  <span className={styles.label}>Label · Geist Mono</span>
                  <p className={`${styles.spec} ${styles.monoSpec}`}>06:40</p>
                  <p>
                    Times, coordinates, token names, rail labels. Tabular
                    figures on every changing number.
                  </p>
                </div>
              </div>

              <table>
                <caption>Scale</caption>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Size</th>
                    <th scope="col">Line</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPE_SCALE.map((row) => (
                    <tr key={row.role}>
                      <td>{row.role}</td>
                      <td className={styles.num}>{row.size}</td>
                      <td>{row.line}</td>
                      <td>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.measureDemo}>
                <p>
                  A deer crossed the clearing at 06:40, downwind, and stopped
                  for eleven seconds before the light moved off the grass.
                  Nothing about that sentence belongs in a database row: the
                  pause is the record. Clearing keeps the pause and the weather,
                  and asks for a name only if you have one.
                </p>
                <aside>
                  Measure: 68 characters at 17px.
                  <br />
                  <code>text-wrap: pretty</code> on paragraphs,{' '}
                  <code>balance</code> on headings.
                </aside>
              </div>
            </section>

            {/* ── 06 Parts ─────────────────────────────────────────────── */}
            <section id="parts">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>06 — Parts</p>
                <h2>Six primitives, cut from the same sheet.</h2>
                <p>
                  The edge, radius and cut line come from the mark: 10–16px
                  corners, one hairline, no shadows except on the pane. The form
                  kit is intentionally out of scope for v1.0.
                </p>
              </div>

              <div className={styles.parts}>
                <div className={styles.part}>
                  <div className={styles.plabel}>
                    <span>Buttons</span>
                    <span>44px · pill</span>
                  </div>
                  <div className={styles.btnRow}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      type="button"
                    >
                      Record a sighting
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      type="button"
                    >
                      Open journal
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnQuiet}`}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className={styles.btnRow}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      type="button"
                    >
                      {}
                      <img
                        src={`${BRAND}/cast/dawn.svg`}
                        width={64}
                        height={64}
                        alt=""
                        aria-hidden="true"
                      />
                      Start at dawn
                    </button>
                  </div>
                </div>

                <div className={styles.part}>
                  <div className={styles.plabel}>
                    <span>Tabs</span>
                    <span>segmented, 34px</span>
                  </div>
                  <div
                    className={styles.segmented}
                    role="tablist"
                    aria-label="Journal views"
                  >
                    <button role="tab" aria-selected="true" type="button">
                      Journal
                    </button>
                    <button role="tab" aria-selected="false" type="button">
                      Map
                    </button>
                    <button role="tab" aria-selected="false" type="button">
                      Species
                    </button>
                  </div>
                  <div className={styles.chips}>
                    <span className={styles.chipState}>
                      <i />
                      In the field
                    </span>
                    <span className={`${styles.chipState} ${styles.glow}`}>
                      <i />
                      Recorded
                    </span>
                    <span className={`${styles.chipState} ${styles.hart}`}>
                      <i />
                      Draft
                    </span>
                  </div>
                </div>

                <div className={styles.part}>
                  <div className={styles.plabel}>
                    <span>Entry row</span>
                    <span>44px target</span>
                  </div>
                  <div className={styles.entry}>
                    {}
                    <img
                      src={`${BRAND}/cast/dawn.svg`}
                      width={32}
                      height={32}
                      alt=""
                      aria-hidden="true"
                    />
                    <div>
                      <b>Red deer · three hinds</b>
                      <span>Clearing, north edge · downwind</span>
                    </div>
                    <time dateTime="2026-10-28T06:40">06:40</time>
                  </div>
                  <div className={styles.entry}>
                    {}
                    <img
                      src={`${BRAND}/cast/trail.svg`}
                      width={32}
                      height={32}
                      alt=""
                      aria-hidden="true"
                    />
                    <div>
                      <b>Roe deer · tracks only</b>
                      <span>Mud line, west path</span>
                    </div>
                    <time dateTime="2026-10-27T18:12">18:12</time>
                  </div>
                </div>

                <div className={styles.part}>
                  <div className={styles.plabel}>
                    <span>Empty state</span>
                    <span>voice test</span>
                  </div>
                  <div className={styles.empty}>
                    {}
                    <img
                      src={`${BRAND}/cast/leaf.svg`}
                      width={40}
                      height={40}
                      alt=""
                      aria-hidden="true"
                    />
                    <p>
                      Nothing recorded yet. The first entry is usually a bird
                      you did not identify.
                    </p>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      type="button"
                      style={{ minHeight: 38 }}
                    >
                      Record one
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 07 Motion ────────────────────────────────────────────── */}
            <section id="motion">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>07 — Motion</p>
                <h2>Three durations, one ease, a finished still.</h2>
                <p>
                  Motion is a lift, not a performance. Nothing loops in the
                  product; the bars below only exist to show the timings, and
                  they stop under reduced motion.
                </p>
              </div>

              <div className={styles.motionGrid}>
                <div className={styles.dur}>
                  <b>120ms</b>
                  <span>Press, toggle, chip</span>
                  <div className={styles.bar} />
                </div>
                <div className={styles.dur}>
                  <b>200ms</b>
                  <span>Pane lift, hover, row</span>
                  <div className={styles.bar} />
                </div>
                <div className={styles.dur}>
                  <b>320ms</b>
                  <span>Sheet open, page change</span>
                  <div className={styles.bar} />
                </div>
              </div>

              <div className={styles.liftDemo}>
                <div className={styles.lift}>
                  Hover me — 3px, 200ms
                  <span>transform: translateY(-3px)</span>
                </div>
                <div className={styles.lift}>
                  Same on a card
                  <span>shadow grows, border stays</span>
                </div>
              </div>

              <p className={styles.note}>
                <code>--ease: cubic-bezier(0.2, 0.8, 0.2, 1)</code> — fast out,
                slow in, no bounce. Under <code>prefers-reduced-motion</code>{' '}
                every duration collapses to 0.01ms and the still frame is the
                designed state.
              </p>
            </section>

            {/* ── 08 Voice ─────────────────────────────────────────────── */}
            <section id="voice">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>08 — Voice</p>
                <h2>Plain, specific, unhurried.</h2>
                <p>
                  The voice is a person who was there. It does not congratulate
                  you, does not sell the outdoors, and never uses
                  &ldquo;oops&rdquo;.
                </p>
              </div>

              <div className={styles.voiceGrid}>
                <dl className={styles.voiceCard}>
                  <div>
                    <dt>We are</dt>
                    <dd>plain, specific, unhurried, first person</dd>
                  </div>
                  <div>
                    <dt>We are not</dt>
                    <dd>hyped, vague, apologetic, jargon-first</dd>
                  </div>
                  <div>
                    <dt>Say</dt>
                    <dd>&ldquo;Saved. You can close this tab.&rdquo;</dd>
                  </div>
                  <div>
                    <dt>Don&rsquo;t say</dt>
                    <dd>
                      &ldquo;Awesome! Your sighting was successfully
                      saved!&rdquo;
                    </dd>
                  </div>
                </dl>

                <div className={styles.voiceSamples}>
                  {VOICE_SAMPLES.map((sample) => (
                    <div key={sample.ctx} className={styles.sample}>
                      <div className={styles.ctx}>{sample.ctx}</div>
                      <p>{sample.line}</p>
                      {sample.bad ? (
                        <span className={styles.bad}>{sample.bad}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 09 Applications ──────────────────────────────────────── */}
            <section id="applications">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>09 — Applications</p>
                <h2>The pane over the painting, and the card in the pocket.</h2>
                <p>
                  One product moment, one print artefact, one favicon set. The
                  same six inks, the same hairline, the same mark.
                </p>
              </div>

              <div className={styles.apps}>
                <div className={styles.appJournal}>
                  {}
                  <img
                    src={`${BRAND}/painting.webp`}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className={styles.pane}>
                    <div className={styles.plate}>
                      <div className={styles.row}>
                        <b>Sighting 041</b>
                        <span>28 Oct · 06:40</span>
                      </div>
                      <p>
                        Three hinds crossed the clearing at 06:40, downwind. The
                        light held for eleven seconds, then moved off the grass.
                      </p>
                      <div className={styles.tags}>
                        <span>red deer</span>
                        <span>clearing</span>
                        <span>still</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.appCol}>
                  <div className={styles.fieldCard}>
                    <div className={styles.fcTop}>
                      {}
                      <img
                        src={`${BRAND}/mark.svg`}
                        width={30}
                        height={30}
                        alt=""
                        aria-hidden="true"
                      />
                      <span>Field card · 85 × 55mm</span>
                    </div>
                    <b>Red deer</b>
                    <div className={styles.fcMeta}>
                      <span>Cervus elaphus</span>
                      <span>06:40</span>
                      <span>Clearing, N edge</span>
                      <span>Still, 4°C</span>
                    </div>
                    <div className={styles.fcNote}>
                      Three hinds, downwind, eleven seconds of light.
                    </div>
                  </div>

                  <div className={styles.favicons}>
                    <figure>
                      {}
                      <img
                        src={`${BRAND}/mark-compact.svg`}
                        width={16}
                        height={16}
                        alt=""
                        aria-hidden="true"
                      />
                      <figcaption>16</figcaption>
                    </figure>
                    <figure>
                      {}
                      <img
                        src={`${BRAND}/mark-compact.svg`}
                        width={32}
                        height={32}
                        alt=""
                        aria-hidden="true"
                      />
                      <figcaption>32</figcaption>
                    </figure>
                    <figure>
                      {}
                      <img
                        src={`${BRAND}/mark.svg`}
                        width={56}
                        height={56}
                        alt=""
                        aria-hidden="true"
                      />
                      <figcaption>180</figcaption>
                    </figure>
                    <p
                      className={styles.note}
                      style={{ margin: 0, fontSize: 11 }}
                    >
                      Favicons use the compact drawing, never the lockup.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 10 Tokens ────────────────────────────────────────────── */}
            <section id="tokens">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>10 — Tokens</p>
                <h2>Copy this. Do not hand-edit it.</h2>
                <p>
                  One source, two exports: CSS for the product, JSON for design
                  tools. Contrast pairs travel with the tokens, so a palette
                  change cannot silently break a pair.
                </p>
              </div>

              <div className={styles.tokenGrid}>
                <div>
                  <div className={styles.codeHead}>
                    <span>clearing-tokens.css</span>
                    <CopyButton text={TOKENS_CSS} />
                  </div>
                  <pre>
                    <Code source={TOKENS_CSS} />
                  </pre>
                </div>
                <div>
                  <div className={styles.codeHead}>
                    <span>clearing-tokens.json</span>
                    <CopyButton text={TOKENS_JSON} />
                  </div>
                  <pre>
                    <Code source={TOKENS_JSON} language="json" />
                  </pre>
                </div>
              </div>

              <p className={styles.note}>
                Full files:{' '}
                <a href={`${BRAND}/clearing-tokens.css`}>clearing-tokens.css</a>{' '}
                ·{' '}
                <a href={`${BRAND}/clearing-tokens.json`}>
                  clearing-tokens.json
                </a>{' '}
                · <a href="/design-system/clearing/llms.txt">llms.txt</a>
              </p>
            </section>

            {/* ── 11 Audit ─────────────────────────────────────────────── */}
            <section id="audit">
              <div className={styles.secHead}>
                <p className={styles.eyebrow}>11 — Audit</p>
                <h2>What is verified, and what is not.</h2>
                <p>
                  Every claim above points at a file or a measurement.
                  Everything else is listed as open — a guide that hides its
                  gaps is a brochure.
                </p>
              </div>

              <table className={styles.auditTable}>
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
                          row.state === 'pass' ? styles.pass : styles.open
                        }
                      >
                        {row.result}
                      </td>
                      <td>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

      <footer>
        <div className={`${styles.shell} ${styles.footInner}`}>
          <span>
            Clearing · brand kit &amp; design system · v1.0 · 28 Oct 2026
          </span>
          <span>
            <a href="/design-system/clearing/llms.txt">llms.txt</a> ·{' '}
            <a href={`${BRAND}/clearing-brandkit.png`}>brand board</a> ·{' '}
            <a href={`${BRAND}/clearing-tokens.css`}>tokens</a>
          </span>
          <span>Drawn track · painted glass · 64 grid</span>
        </div>
      </footer>
    </div>
  )
}
