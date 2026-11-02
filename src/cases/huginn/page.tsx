import type { Metadata } from 'next'
import { Fragment } from 'react'

import {
  AUDIT_ROWS,
  CELL_RECIPE,
  CONTRAST_PAIRS,
  DECISIONS,
  DITHER_RECIPE,
  GAPS,
  MARK_SPECS,
  META,
  PALETTE,
  PARTS,
  REJECTED_MARKS,
  STORY_BEATS,
  TOKENS_CSS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
  type Decision,
} from '@/features/huginn/huginn-data'
import { HuginnMark } from '@/features/huginn/components/brand'
import { HuginnContents } from '@/features/huginn/components/contents'
import { CopyButton } from '@/features/huginn/components/copy'
import { DitherCanvas } from '@/features/huginn/components/dither-canvas'
import { DitherPlate } from '@/features/huginn/components/dither-plate'
import { HuginnFooterDemo } from '@/features/huginn/components/footer-demo'
import { HuginnParts } from '@/features/huginn/components/parts-demo'
import { HuginnThemeToggle } from '@/features/huginn/components/theme-toggle'
import styles from '@/features/huginn/huginn.module.css'

export const metadata: Metadata = {
  title: 'Huginn — Case 03 | Design System',
  description:
    'A picture becomes cells. A name becomes cells. One 14-unit cell draws the painting, the wordmark and the mark — and one cell always leaves the grid.',
  alternates: {
    canonical: '/design-system/huginn',
    types: { 'text/markdown': '/design-system/huginn/llms.txt' },
  },
  openGraph: {
    title: 'Huginn — Case 03 | Design System',
    description: 'A picture becomes cells. A name becomes cells.',
    type: 'website',
    url: '/design-system/huginn',
    images: [
      {
        url: '/brand/huginn/huginn-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Huginn brand board: the cell mark with one cell leaving the grid, the cell-drawn wordmark, the vermilion field and the ordered dither.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huginn — Case 03 | Design System',
    description:
      'One cell draws the painting, the name and the mark. The sixth one leaves.',
    images: ['/brand/huginn/huginn-brandkit.png'],
  },
}

const BRAND = '/brand/huginn'

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

export default function HuginnPage() {
  return (
    <div className={styles.root} id="top">
      <a className={styles.skip} href="#main">
        Skip to the system
      </a>

      <header className={styles.topbar}>
        <div className={`${styles.shell} ${styles.topbarInner}`}>
          <a
            className={styles.brand}
            href="#top"
            aria-label="Huginn, back to top"
          >
            <HuginnMark size={26} title="" />
            <span>Huginn</span>
          </a>

          <nav className={styles.topnav} aria-label="Sections">
            <a href="#marks">Marks</a>
            <a href="#field">Field</a>
            <a href="#type">Type</a>
            <a href="#parts">Parts</a>
            <a href="#tokens">Tokens</a>
          </nav>

          <HuginnThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* ── Hero: the painting, the field, the plate ─────────────────── */}
        <section className={styles.hero}>
          {/* the surface band's painting, dissolving down into the field by the
              same ordered matrix — the page opens the way the page closes */}
          <div className={styles.heroArt}>
            {}
            <img
              src={`${BRAND}/asgardsreien-1872.jpg`}
              alt=""
              aria-hidden="true"
            />
            <DitherCanvas />
          </div>

          <div className={styles.heroField}>
            <div className={`${styles.shell} ${styles.heroFieldInner}`}>
              <h1 className={styles.display}>
                The painting becomes cells. <em>So does the name.</em>
              </h1>

              <div className={styles.heroMark}>
                <HuginnMark
                  size={168}
                  onField
                  title="Huginn mark printed on the vermilion field"
                />
                <span>five cells stay · one leaves</span>
              </div>
            </div>
          </div>

          {/* every piece of small type sits on the plate, never on the field */}
          <div className={styles.heroPlate}>
            <div className={`${styles.shell} ${styles.plateInner}`}>
              <p className={styles.eyebrow}>
                Brand kit &amp; design system · {META.version} · {META.date}
              </p>

              <div className={styles.plateGrid}>
                <p className={styles.lede}>
                  Huginn is a print studio in Oslo and Reykjavík with one
                  primitive: a 14-unit cell. It draws Arbo&rsquo;s Wild Hunt, it
                  draws the wordmark, and it draws the mark — five cells hold
                  the picture, and the sixth has left the grid because thought
                  flies out.
                </p>

                <div className={styles.heroActions}>
                  <a className={styles.btn} href="#marks">
                    Read the marks
                  </a>
                  <a
                    className={`${styles.btn} ${styles.btnGhost}`}
                    href="#surface"
                  >
                    See the surface
                  </a>
                </div>
              </div>

              <div className={styles.plateStats}>
                <div className={styles.stat}>
                  <b>6</b>
                  <span>cells: five in the grid, one out</span>
                </div>
                <div className={styles.stat}>
                  <b>14</b>
                  <span>units per cell, on a 3-unit gap</span>
                </div>
                <div className={styles.stat}>
                  <b>22</b>
                  <span>rows of cells in the wordmark</span>
                </div>
                <div className={styles.stat}>
                  <b>1</b>
                  <span>loud field per page</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.layout}`}>
          <HuginnContents />

          <div>
            {/* ── 01 The cell ──────────────────────────────────────────── */}
            <section id="cell">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>01</b> The cell
                </p>
                <h2>One square, repeated, is the whole studio.</h2>
                <p>
                  Seven beats and four decisions. The claim is narrow on
                  purpose: a grid that can draw a painting can draw a name and a
                  mark, so nothing has to be styled to look printed.
                </p>
              </div>

              <div className={styles.storyGrid}>
                <dl className={styles.storyList}>
                  {STORY_BEATS.map((beat) => (
                    <div key={beat.beat}>
                      <dt>{beat.beat}</dt>
                      <dd>{beat.line}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <div className={styles.oneSentence}>
                    <p>{META.oneSentence}</p>
                    <span>The sentence the work can be rejected against</span>
                  </div>
                  <p className={styles.note}>
                    The previous version argued about a keystone and two
                    brackets — an architectural idea. This one argues about a
                    grid with one exception, which is the argument the footer
                    was already making at 22 rows.
                  </p>
                </div>
              </div>

              <div className={styles.decisions}>
                {DECISIONS.map((decision) => (
                  <DecisionCard key={decision.title} decision={decision} />
                ))}
              </div>
            </section>

            {/* ── 02 The dissolve ──────────────────────────────────────── */}
            <section id="dissolve">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>02</b> The dissolve
                </p>
                <h2>The painting does not fade. It thins out, cell by cell.</h2>
                <p>
                  An ordered 4 × 4 Bayer matrix decides which cells print: a
                  cell is inked when the picture is darker than its threshold.
                  The footer paints it on a canvas; the two plates below are the
                  same matrix evaluated in markup, with no JavaScript.
                </p>
              </div>

              <div className={styles.dissolveStage}>
                <div className={styles.dissolvePane}>
                  <h3>Plate · ink on chalk</h3>
                  <DitherPlate label="An ordered dither plate: a light source at the top left dissolving into cells" />
                  <div className={styles.dissolveLegend}>
                    <span>22 × 22 cells</span>
                    <span>bayer 4 × 4</span>
                  </div>
                </div>
                <div className={styles.dissolvePane}>
                  <h3>Plate · the field</h3>
                  <DitherPlate
                    field
                    label="The same plate printed in the vermilion field"
                  />
                  <div className={styles.dissolveLegend}>
                    <span>same matrix</span>
                    <span>one ink</span>
                  </div>
                </div>
              </div>

              <div className={styles.codeGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>dissolve · bayer</span>
                    <CopyButton text={DITHER_RECIPE} />
                  </div>
                  <pre>
                    <code>{DITHER_RECIPE}</code>
                  </pre>
                </div>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>cell · tokens</span>
                    <CopyButton text={CELL_RECIPE} />
                  </div>
                  <pre>
                    <code>{CELL_RECIPE}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* ── 03 Marks ─────────────────────────────────────────────── */}
            <section id="marks">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>03</b> Marks
                </p>
                <h2>Five cells hold the picture. The sixth has left.</h2>
                <p>
                  Constructed track, cell matrix: one 14-unit square on a 3-unit
                  gap, and one exception that is six units off the grid and
                  printed in the field. Five concepts were drawn; four lost.
                </p>
              </div>

              <div className={styles.logoCard}>
                <div className={styles.stage}>
                  {}
                  <img
                    src={`${BRAND}/lockup-reverse.svg`}
                    alt="Huginn lockup: the cell mark beside the cell-drawn wordmark"
                    width={340}
                    height={77}
                  />
                </div>
                <div className={styles.rail}>
                  <span>Logo / 01 · mark + wordmark</span>
                  <span>64 grid · escape 6 units</span>
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
                        <code>public/brand/huginn/</code>
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
                      <a href={`${BRAND}/mark-mono.svg`} download>
                        Stamp .svg
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
                      At 16px the 3-unit gap closes up, so the compact redraws
                      three cells at 8 units and widens the channel. The escapee
                      keeps its off-grid position in every variant, including
                      the one-colour stamp.
                    </p>
                  </div>
                </div>

                <div className={styles.doDont}>
                  <div className={styles.yes}>
                    <b>Do</b>
                    Place the mark by its box. The escapee is six units off the
                    grid on purpose, and it is the only thing in the logo that
                    is not aligned.
                  </div>
                  <div className={styles.no}>
                    <b>Don&rsquo;t</b>
                    Snap the mark to a 14px cell grid, add a seventh cell, or
                    recolour the escapee to anything but the field.
                  </div>
                </div>
              </div>

              <div className={styles.wordmarkCard}>
                <div className={styles.clear}>
                  {}
                  <img
                    src={`${BRAND}/wordmark.svg`}
                    alt="Huginn wordmark"
                    width={320}
                    height={67}
                  />
                </div>
                <div className={styles.scaleRow}>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={160}
                      height={34}
                      alt=""
                    />
                    <figcaption>160 · hero</figcaption>
                  </figure>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={80}
                      height={17}
                      alt=""
                    />
                    <figcaption>80 · header</figcaption>
                  </figure>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={40}
                      height={8}
                      alt=""
                    />
                    <figcaption>40 · minimum</figcaption>
                  </figure>
                  <p
                    className={styles.note}
                    style={{ margin: 0, maxWidth: '38ch' }}
                  >
                    Twenty-two rows of cells, outlined. There is no blackletter
                    font on this page; the name is the same primitive as the
                    mark, spelled out.
                  </p>
                </div>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>Five drawn, four lost</p>
                <ul className={styles.rejectList}>
                  {REJECTED_MARKS.map((mark) => (
                    <li key={mark.name}>
                      <b>{mark.name}</b>
                      <span>{mark.note}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.ruleNote}>
                  <b>One rule.</b> The cell is the only primitive. If a variant
                  needs a second shape — a rule, a diamond, a bracket — it is a
                  different mark, not a variant.
                </div>
              </div>
            </section>

            {/* ── 04 The field ─────────────────────────────────────────── */}
            <section id="field">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>04</b> The field
                </p>
                <h2>One vermilion plate per page. Nothing small goes on it.</h2>
                <p>
                  Bone on the field is 4.54:1 and ink on the field is 4.15:1 —
                  both pass, both only for large text. That is the rule the
                  whole colour system hangs on: the field is a poster, not a
                  background.
                </p>
              </div>

              <div className={styles.inkGrid}>
                {PALETTE.map((ink) => (
                  <div className={styles.inkChip} key={ink.token}>
                    <div
                      className={styles.swatch}
                      style={{ background: ink.hex }}
                      aria-hidden="true"
                    />
                    <b>{ink.name}</b>
                    <code>
                      {ink.token} · {ink.hex}
                    </code>
                    <p>
                      {ink.job} <br />
                      <span style={{ opacity: 0.8 }}>{ink.short}</span>
                    </p>
                  </div>
                ))}
              </div>

              <table className={styles.contrastTable}>
                <caption className="sr-only">Measured contrast pairs</caption>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST_PAIRS.map((pair) => (
                    <tr
                      key={pair.pair}
                      data-fail={pair.fail ? 'true' : undefined}
                    >
                      <td>{pair.pair}</td>
                      <td>{pair.ratio}</td>
                      <td>{pair.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.note}>
                The failing row is published on purpose: bone-mute on chalk is
                1.59:1 and is only ever a disabled edge, never a label.
              </p>
            </section>

            {/* ── 05 Type ──────────────────────────────────────────────── */}
            <section id="type">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>05</b> Type
                </p>
                <h2>A Didone for the argument, a grotesque for the reading.</h2>
                <p>
                  The cell grid sets the drawing; Bodoni Moda sets the claim,
                  because a studio that prints posters should sound like one.
                  Geist reads, and Geist Mono keeps the colophon honest.
                </p>
              </div>

              <div className={styles.typeSpecimens}>
                <div className={styles.specimen}>
                  <span>Display · 44–84</span>
                  <p className={styles.spDisplay} style={{ margin: 0 }}>
                    Åsgårdsreien, in cells
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>H2 · 28–42</span>
                  <p className={styles.spH2} style={{ margin: 0 }}>
                    The grid is the material
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Body · 17/1.6</span>
                  <p className={styles.spBody} style={{ margin: 0 }}>
                    Sixteen cells across, twenty-two down. The painting is the
                    source and the grid is the print: each cell is inked when
                    the picture is darker than its Bayer threshold, which is why
                    the sky thins out before the riders do.
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Label · 11 mono</span>
                  <p className={styles.spMono} style={{ margin: 0 }}>
                    Plate 03 · 1872 · Nasjonalmuseet
                  </p>
                </div>
              </div>

              <table className={styles.typeTable}>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Family</th>
                    <th scope="col">Size</th>
                    <th scope="col">Line</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPE_SCALE.map((row) => (
                    <tr key={row.role}>
                      <td>{row.role}</td>
                      <td>{row.family}</td>
                      <td>{row.size}</td>
                      <td>{row.line}</td>
                      <td>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ── 06 Parts ─────────────────────────────────────────────── */}
            <section id="parts">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>06</b> Parts
                </p>
                <h2>Six primitives, and every one of them is a rectangle.</h2>
                <p>
                  Buttons, slips, the cell switch, plates, index chips and tabs.
                  No radius, no shadow, and the focus ring is cobalt because it
                  is the one cold note in a warm system.
                </p>
              </div>

              <HuginnParts />

              <div className={styles.block}>
                <p className={styles.blockLabel}>What each part is for</p>
                <ul className={styles.rejectList}>
                  {PARTS.map((part) => (
                    <li key={part.name}>
                      <b>{part.name}</b>
                      <span>{part.job}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 07 Tokens ────────────────────────────────────────────── */}
            <section id="tokens">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>07</b> Tokens
                </p>
                <h2>Copy this. Do not hand-edit it.</h2>
                <p>
                  One source, three layers, two surfaces. The primitive layer
                  names the field and the papers; the semantic layer names the
                  job; the component layer is the only place a button is allowed
                  to know what colour it is.
                </p>
              </div>

              <div className={styles.tokenGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>huginn-tokens.css</span>
                    <CopyButton text={TOKENS_CSS} />
                  </div>
                  <pre>
                    <code>{TOKENS_CSS}</code>
                  </pre>
                </div>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>tokens.json</span>
                    <CopyButton text={TOKENS_JSON} />
                  </div>
                  <pre>
                    <code>{TOKENS_JSON}</code>
                  </pre>
                </div>
              </div>
              <p className={styles.note}>
                The night surface is{' '}
                <code>html[data-huginn=&quot;night&quot;]</code>, not a second
                palette: the field keeps its vermilion and the paper inverts.
              </p>
            </section>

            {/* ── 08 Audit ─────────────────────────────────────────────── */}
            <section id="audit">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>08</b> Audit
                </p>
                <h2>What is verified, and what is not.</h2>
                <p>
                  Eight passes, two out of scope, one open. A guide that hides
                  its gaps is a brochure, so the gaps are listed in full
                  underneath.
                </p>
              </div>

              <table className={styles.auditTable}>
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
                      <td>
                        <span
                          className={`${styles.state} ${
                            row.state === 'pass'
                              ? styles.statePass
                              : row.state === 'open'
                                ? styles.stateOpen
                                : styles.stateScope
                          }`}
                        >
                          {row.result}
                        </span>
                      </td>
                      <td>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className={styles.gaps}>
                {GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>

              <div className={styles.block}>
                <p className={styles.blockLabel}>Voice</p>
                <ul className={styles.voiceList}>
                  {VOICE_SAMPLES.map((sample) => (
                    <li key={sample.ctx}>
                      <b>{sample.ctx}</b>
                      <p>
                        {sample.line}
                        {sample.bad ? <em>Not: {sample.bad}</em> : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* ── 09 The surface: the closing band, edge to edge ───────────── */}
        <section id="surface" className={styles.footerBand}>
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <b>09</b> The surface
              </p>
              <h2>The page ends in the painting dissolving into the field.</h2>
              <p>
                The Wild Hunt footer, fed the real tokens and the studio&rsquo;s
                own plate: the dither resolves the painting into cells, the
                wordmark resolves out of the same cells, and the flourish writes
                through both. It is the hero, turned around.
              </p>
            </div>
          </div>

          <HuginnFooterDemo />
        </section>
      </main>

      <footer className={styles.endcap}>
        <div className={`${styles.shell} ${styles.endcapInner}`}>
          <span>
            Huginn · {META.caseNumber} · {META.version} · {META.date}
          </span>
          <span>
            <a href="/design-system">All design systems</a> ·{' '}
            <a href="#top">Back to top ↑</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
