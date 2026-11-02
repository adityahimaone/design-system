import type { Metadata } from 'next'
import { Fragment } from 'react'

import {
  AUDIT_ROWS,
  CONTRAST_PAIRS,
  DECISIONS,
  DETACH,
  GAPS,
  MARK_SPECS,
  MASK_RECIPE,
  META,
  NAV,
  PALETTE,
  PARTS,
  PRINT_RECIPE,
  REJECTED_MARKS,
  STAGE_SPECS,
  STORY_BEATS,
  TOKENS_CSS,
  TYPE_SCALE,
  VOICE_SAMPLES,
  type Decision,
} from '@/features/porphyry/porphyry-data'
import {
  PorphyryGlyph,
  PorphyryMark,
} from '@/features/porphyry/components/brand'
import { CopyButton } from '@/features/porphyry/components/copy'
import { PorphyryParts } from '@/features/porphyry/components/parts'
import { PorphyrySpecimen } from '@/features/porphyry/components/specimen'
import { PorphyryThemeToggle } from '@/features/porphyry/components/theme-toggle'
import styles from '@/features/porphyry/porphyry.module.css'
import tokens from '@/features/porphyry/tokens.json'

export const metadata: Metadata = {
  title: 'Porphyry — Case 10 | Design System',
  description:
    'A page composed like a stage: one stone, one light, and a cast of marble figures keyed off their own ground by luminance. Cinzel inscriptions, Jost reading, gold as the only signal, and an audit that names what it could not verify.',
  alternates: {
    canonical: '/design-system/porphyry',
    types: { 'text/markdown': '/design-system/porphyry/llms.txt' },
  },
  openGraph: {
    title: 'Porphyry — Case 10 | Design System',
    description:
      'A page composed like a stage: one stone, one light, and a cast in front of the word.',
    type: 'website',
    url: '/design-system/porphyry',
    images: [
      {
        url: '/brand/porphyry/porphyry-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Porphyry brand board: the stone block with its gold threshold, the porphyry and marble palette, the Cinzel wordmark and the stage palette.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porphyry — Case 10 | Design System',
    description:
      'One stone, one light, one cast. A classical stage for modern interfaces.',
    images: ['/brand/porphyry/porphyry-brandkit.png'],
  },
}

const BRAND = '/brand/porphyry'
const TOKENS_JSON = JSON.stringify(tokens, null, 2)

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

export default function PorphyryPage() {
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
            aria-label="Porphyry, back to top"
          >
            <PorphyryMark size={26} title="" compact />
            <span className={styles.brandName}>Porphyry</span>
          </a>

          <nav className={styles.topnav} aria-label="Sections">
            <a href="#stage">Stage</a>
            <a href="#cast">Cast</a>
            <a href="#mark">Mark</a>
            <a href="#stone">Stone</a>
            <a href="#parts">Parts</a>
            <a href="#tokens">Tokens</a>
          </nav>

          <PorphyryThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* ── The stage: the specimen ───────────────────────────────────── */}
        <section className={styles.stageSection} id="stage">
          <div className={styles.shell}>
            <div className={styles.stageHead}>
              <span>
                <em>Fig. 01</em> · the stage, live
              </span>
              <span>One loader · one word · three keyed figures</span>
            </div>
          </div>

          <div className={styles.shell}>
            <PorphyrySpecimen />
          </div>

          <div className={`${styles.shell} ${styles.heroFoot}`}>
            <div>
              <p className={styles.eyebrow}>
                Brand kit &amp; design system · Case 10 · {META.date}
              </p>
              <h1 className={styles.display}>
                A page composed like a{' '}
                <span className={styles.script}>stage</span>.
              </h1>
              <p className={styles.lede}>
                Porphyry is an interface system built as a diorama, not a
                document. <strong>One stone ground</strong>, one gold light, and
                a cast of marble photographs that are keyed off their own black
                ground by luminance. The wordmark is the loader: it fills with
                marble from the floor, then holds the room while the cast rises
                in front of it.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.btn} href="#story">
                  Read the argument
                </a>
                <a className={`${styles.btn} ${styles.btnQuiet}`} href="#mark">
                  See the mark
                </a>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <b>2</b>
                <span>shapes in the mark: stone block, gold threshold</span>
              </div>
              <div className={styles.stat}>
                <b>8</b>
                <span>unit gold threshold, the only light</span>
              </div>
              <div className={styles.stat}>
                <b>3</b>
                <span>keyed figures, each on its own depth</span>
              </div>
              <div className={styles.stat}>
                <b>1</b>
                <span>effect: the two-ink stage</span>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.layout}`}>
          <nav className={styles.contents} aria-label="Contents">
            <p className={styles.contentsTitle}>Contents</p>
            <ol className={styles.contentsList}>
              {NAV.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    {item.label}
                    <b>{String(i + 1).padStart(2, '0')}</b>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            {/* ── 01 Story ─────────────────────────────────────────────── */}
            <section className={styles.section} id="story">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>01</b> The argument
                </p>
                <h2>The screen is a room, not a document.</h2>
                <p>
                  Seven beats and six decisions. Everything below follows from
                  them; if a component does not serve the belief, it is
                  decoration.
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
                    The supplied component was a preloader: a black stage, a
                    meander ring, marble statues and a word filling with stone.
                    The temptation was to keep it as a curtain in front of the
                    page. The narrower claim is to make the stage{' '}
                    <em>the page</em>, and let the loader be the wordmark — a
                    specimen you can replay, not a toll gate.
                  </p>
                  <p className={styles.note}>Enemy: {META.enemy}</p>
                </div>
              </div>

              <div className={styles.decisions}>
                {DECISIONS.map((decision) => (
                  <DecisionCard key={decision.title} decision={decision} />
                ))}
              </div>
            </section>

            {/* ── 02 Cast ──────────────────────────────────────────────── */}
            <section className={styles.section} id="cast">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>02</b> The cast
                </p>
                <h2>
                  The photograph is the cast. Its own black ground is the mask.
                </h2>
                <p>
                  No cut-outs and no alpha edges: the image is a normal
                  photograph, and its luminance becomes the mask through a
                  linear transfer. Threshold 0.2, softness 0.16 — a soft edge
                  round a hard key, so the marble keeps a little air.
                </p>
              </div>

              <div className={styles.castDemo}>
                <figure className={`${styles.castPlate} ${styles.castRaw}`}>
                  <img
                    src={`${BRAND}/cast/flowers.jpg`}
                    alt="A marble figure holding flowers, the original photograph on its black ground"
                  />
                  <figcaption>
                    The photograph
                    <span>1200 × 1885 · black ground</span>
                  </figcaption>
                </figure>
                <figure className={`${styles.castPlate} ${styles.castKeyed}`}>
                  <img
                    src={`${BRAND}/cast/flowers.jpg`}
                    alt="The same figure keyed off its ground and graded as a two-ink print"
                  />
                  <figcaption>
                    The keyed print
                    <span>threshold 0.2 · gold highlight</span>
                  </figcaption>
                </figure>
              </div>

              <div className={styles.castList}>
                <div>
                  <b>The Apollo Belvedere</b>
                  <span>near figure, mirrored</span>
                  <code>depth 1.25</code>
                  <code>h 58%</code>
                </div>
                <div>
                  <b>Hercules</b>
                  <span>near figure</span>
                  <code>depth 1.15</code>
                  <code>h 66%</code>
                </div>
                <div>
                  <b>The standing figure</b>
                  <span>behind the word, the back wall</span>
                  <code>depth 0.80</code>
                  <code>h 96%</code>
                </div>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>The stage, measured</p>
                <dl className={styles.specs}>
                  {STAGE_SPECS.map((spec) => (
                    <Fragment key={spec.key}>
                      <dt>{spec.key}</dt>
                      <dd>{spec.value}</dd>
                    </Fragment>
                  ))}
                </dl>
              </div>

              <div className={styles.codeGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>key · luminance to mask</span>
                    <CopyButton text={MASK_RECIPE} />
                  </div>
                  <pre>
                    <code>{MASK_RECIPE}</code>
                  </pre>
                </div>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>grade · two-ink print</span>
                    <CopyButton text={PRINT_RECIPE} />
                  </div>
                  <pre>
                    <code>{PRINT_RECIPE}</code>
                  </pre>
                </div>
              </div>

              <p className={styles.note}>
                The backdrop is a fourth photograph, blurred and darkened, and
                it never receives the full grade — it is the room, not the cast.
              </p>
            </section>

            {/* ── 03 Mark ──────────────────────────────────────────────── */}
            <section className={styles.section} id="mark">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>03</b> The mark
                </p>
                <h2>
                  A stage opening cut into one block of stone. The gold is the
                  floor.
                </h2>
                <p>
                  Constructed track, architectural block: two filled shapes,
                  zero strokes. The block is the frame; the trapezoid opening is
                  the stage; the gold threshold is the only light. Seven
                  concepts were drawn; six lost.
                </p>
              </div>

              <div className={styles.logoCard}>
                <div className={styles.logoStage}>
                  <img
                    src={`${BRAND}/lockup-reverse.svg`}
                    alt="Porphyry lockup: the portal beside the inscribed Cinzel wordmark"
                    width={336}
                    height={64}
                  />
                </div>
                <div className={styles.rail}>
                  <span>Logo / 01 · mark + wordmark</span>
                  <span>64 grid · 2 shapes · 1 accent</span>
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
                    </dl>
                    <div className={styles.downloads}>
                      <a href={`${BRAND}/mark.svg`} download>
                        Mark .svg
                      </a>
                      <a href={`${BRAND}/lockup.svg`} download>
                        Lockup .svg
                      </a>
                      <a href={`${BRAND}/lockup-reverse.svg`} download>
                        Lockup on stage .svg
                      </a>
                      <a href={`${BRAND}/mark-compact.svg`} download>
                        Compact .svg
                      </a>
                      <a href={`${BRAND}/mark-mono.svg`} download>
                        Stamp .svg
                      </a>
                      <a href={`${BRAND}/wordmark.svg`} download>
                        Wordmark .svg
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className={styles.blockLabel}>At size</p>
                    <div className={styles.iconsRow}>
                      <figure>
                        <img
                          src={`${BRAND}/mark-reverse.svg`}
                          width={48}
                          height={48}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>48</figcaption>
                      </figure>
                      <figure>
                        <img
                          src={`${BRAND}/mark-reverse.svg`}
                          width={32}
                          height={32}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>32</figcaption>
                      </figure>
                      <figure>
                        <img
                          src={`${BRAND}/mark-compact-reverse.svg`}
                          width={16}
                          height={16}
                          alt=""
                          aria-hidden="true"
                        />
                        <figcaption>16</figcaption>
                      </figure>
                      <figure>
                        <PorphyryGlyph
                          size={40}
                          style={{ color: 'var(--po-marble)' }}
                        />
                        <figcaption>1 ink</figcaption>
                      </figure>
                    </div>
                    <p className={styles.note}>
                      At 16px the 8-unit threshold becomes 2px, so the compact
                      is a separate drawing: a 44-unit block and a 24 × 9
                      threshold. It is not the primary mark scaled down.
                    </p>
                  </div>
                </div>

                <div className={styles.doDont}>
                  <div className={styles.yes}>
                    <b>Do</b>
                    Use <code>lockup-reverse.svg</code> on the stage. The marble
                    block and the gold threshold are the two-material mark, read
                    at full contrast.
                  </div>
                  <div className={styles.no}>
                    <b>Don&rsquo;t</b>
                    Place the ink lockup on the stage. The block is 1.1:1
                    against the ground and the opening disappears into the room.
                  </div>
                </div>
              </div>

              <div className={styles.wordmarkCard}>
                <div className={styles.clear}>
                  <img
                    src={`${BRAND}/wordmark-reverse.svg`}
                    alt="Porphyry wordmark"
                    width={300}
                    height={37}
                  />
                </div>
                <div className={styles.scaleRow}>
                  <figure>
                    <img
                      className={styles.wordmarkOnStage}
                      src={`${BRAND}/wordmark-reverse.svg`}
                      width={160}
                      height={20}
                      alt=""
                    />
                    <img
                      className={styles.wordmarkOnVellum}
                      src={`${BRAND}/wordmark-ink.svg`}
                      width={160}
                      height={20}
                      alt=""
                    />
                    <figcaption>160 · hero</figcaption>
                  </figure>
                  <figure>
                    <img
                      className={styles.wordmarkOnStage}
                      src={`${BRAND}/wordmark-reverse.svg`}
                      width={80}
                      height={10}
                      alt=""
                    />
                    <img
                      className={styles.wordmarkOnVellum}
                      src={`${BRAND}/wordmark-ink.svg`}
                      width={80}
                      height={10}
                      alt=""
                    />
                    <figcaption>80 · header</figcaption>
                  </figure>
                  <figure>
                    <img
                      className={styles.wordmarkOnStage}
                      src={`${BRAND}/wordmark-reverse.svg`}
                      width={40}
                      height={5}
                      alt=""
                    />
                    <img
                      className={styles.wordmarkOnVellum}
                      src={`${BRAND}/wordmark-ink.svg`}
                      width={40}
                      height={5}
                      alt=""
                    />
                    <figcaption>40 · minimum</figcaption>
                  </figure>
                  <p className={styles.note} style={{ margin: 0 }}>
                    Cinzel 500, outlined from the font file at 0.085em. The
                    reading face takes over below 40px; the inscription is never
                    squeezed.
                  </p>
                </div>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>Seven drawn, six lost</p>
                <ul className={styles.rejectList}>
                  {REJECTED_MARKS.map((mark) => (
                    <li key={mark.name}>
                      <b>{mark.name}</b>
                      <span>{mark.note}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.ruleNote}>
                  <b>One rule.</b> The gold threshold is the only light in the
                  mark. If a variant needs a second lit element — a star, a
                  rule, a highlight — it is a different mark, not a variant.
                </div>
              </div>
            </section>

            {/* ── 04 Stone ─────────────────────────────────────────────── */}
            <section className={styles.section} id="stone">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>04</b> The stone
                </p>
                <h2>One stone, one light, one paper. Nothing else.</h2>
                <p>
                  Gold is the only accent; porphyry is a field and never a
                  paragraph. The stage is the default surface and the vellum is
                  the proof surface, not a second identity. Ratios are computed
                  from the semantic layer, not typed by hand.
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
                      {ink.job}
                      <br />
                      <span>{ink.contrast}</span>
                    </p>
                  </div>
                ))}
              </div>

              <table className={styles.contrastTable}>
                <caption className={styles.srOnly}>
                  Measured contrast pairs
                </caption>
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
                The two red rows are the honest ones: gold on porphyry and the
                stone ornament on the stage both fail as type. They are listed
                because a palette that only publishes its passes is a brochure.
              </p>
            </section>

            {/* ── 05 Type ──────────────────────────────────────────────── */}
            <section className={styles.section} id="type">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>05</b> The type
                </p>
                <h2>An inscription, a gallery label, and one signature.</h2>
                <p>
                  Cinzel sets every argument because its Roman capitals are the
                  stone the system is named for. Jost reads and measures; it is
                  the modern gallery label beside the object. Pinyon Script
                  appears once per page at most.
                </p>
              </div>

              <div className={styles.typeSpecimens}>
                <div className={styles.specimen}>
                  <span>Display · Cinzel 400 · 41–80</span>
                  <p className={styles.spDisplay} style={{ margin: 0 }}>
                    One light
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>H2 · Cinzel 400 · 29–43</span>
                  <p className={styles.spH2} style={{ margin: 0 }}>
                    A page composed like a stage
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Body · Jost 400 · 17/1.6</span>
                  <p className={styles.spBody} style={{ margin: 0 }}>
                    The stage is a near-black porphyry ground, not pure black.
                    Marble is the reading ink, warm rather than white. Gold
                    appears only where the system wants you to look: an eyebrow,
                    a focus ring, the lit threshold.
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Signature · Pinyon Script · once</span>
                  <p className={styles.spScript} style={{ margin: 0 }}>
                    Porphyry
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
            <section className={styles.section} id="parts">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>06</b> The parts
                </p>
                <h2>Square controls, cut from the same sheet.</h2>
                <p>
                  Native elements first. Buttons, fields, a select, a switch, a
                  radio well, chips and one card. Every state is visible without
                  colour alone, the focus ring is 2px gold offset 2px, and the
                  switch keeps the platform&rsquo;s checkbox underneath.
                </p>
              </div>

              <PorphyryParts />

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
            <section className={styles.section} id="tokens">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>07</b> The tokens
                </p>
                <h2>Copy this. Do not hand-edit it.</h2>
                <p>
                  One source, three layers, two surfaces. The primitive layer
                  names the stone and the light; the semantic layer names the
                  job; the component layer is the only place a button is allowed
                  to know what colour it is.
                </p>
              </div>

              <div className={styles.codeGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>porphyry-tokens.css</span>
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
                The vellum is <code>html[data-po=&quot;vellum&quot;]</code>, not
                a second palette: the stone keeps its hex, the gold becomes
                porphyry as type, and the paper becomes the ground.
              </p>
            </section>

            {/* ── 08 Audit ─────────────────────────────────────────────── */}
            <section className={styles.section} id="audit">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>08</b> The audit
                </p>
                <h2>What is verified, and what is not.</h2>
                <p>
                  Ten measured passes, one partial and one open item. A guide
                  that hides its gaps is a brochure, so the gaps are listed in
                  full underneath, including the things this page cannot prove.
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

              <div className={styles.block}>
                <p className={styles.blockLabel}>Detach gate · every sibling</p>
                <table className={styles.detachTable}>
                  <caption className={styles.srOnly}>
                    The separation score against each existing system
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Against</th>
                      <th scope="col">Score</th>
                      <th scope="col">Breakdown</th>
                      <th scope="col">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DETACH.map((row) => (
                      <tr key={row.ref}>
                        <td>{row.ref}</td>
                        <td>{row.score}/100</td>
                        <td>{row.parts}</td>
                        <td>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={styles.note}>
                  The weakest pair is the number that matters. Reproduce it with{' '}
                  <code>
                    node scripts/detach-check.mjs --new
                    features/porphyry/tokens.json --ref …
                  </code>
                  ; the worst pair is Hachure at 73, and the reason is that
                  neither side declares the full twelve-key DNA object, not that
                  the two pages look alike.
                </p>
              </div>

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

        {/* ── 09 The stage, edge to edge ───────────────────────────────── */}
        <section className={styles.footerBand}>
          <div className={`${styles.shell} ${styles.footerInner}`}>
            <div>
              <div className={styles.footerMark}>
                <img
                  src={`${BRAND}/lockup-reverse.svg`}
                  alt="Porphyry lockup, marble and gold"
                  width={336}
                  height={64}
                />
              </div>
              <p className={styles.footerText} style={{ marginTop: 18 }}>
                <b>{META.oneSentence}</b>
                The stage is the page; the loader is the word. Marble is the
                reading ink, gold is the only light, and the cast is keyed from
                photographs that were already on a black ground.
              </p>
            </div>
            <p className={styles.footerText}>
              <b>Ars longa, vita brevis.</b>
              Case 10 · {META.version} · {META.date}
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.endcap}>
        <div className={`${styles.shell} ${styles.endcapInner}`}>
          <span>
            Porphyry · {META.caseNumber} · {META.version} · {META.date}
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
