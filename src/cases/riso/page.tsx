import type { Metadata } from 'next'
import { Fragment } from 'react'

import {
  AUDIT_ROWS,
  CONTRAST_PAIRS,
  DECISIONS,
  GAPS,
  MARK_SPECS,
  META,
  PALETTE,
  PARTS,
  REGISTER_RECIPE,
  REJECTED_MARKS,
  STORY_BEATS,
  TEAR_RECIPE,
  TOKENS_CSS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE_SAMPLES,
  type Decision,
} from '@/features/riso/riso-data'
import { RisoMark, RisoPin } from '@/features/riso/components/brand'
import { RisoClock } from '@/features/riso/components/clock'
import { RisoContents } from '@/features/riso/components/contents'
import { CopyButton } from '@/features/riso/components/copy'
import { RisoFooterDemo } from '@/features/riso/components/footer-demo'
import { RisoParts } from '@/features/riso/components/parts-demo'
import { RisoThemeToggle } from '@/features/riso/components/theme-toggle'
import styles from '@/features/riso/riso.module.css'

export const metadata: Metadata = {
  title: 'Riso Co. — Case 04 | Design System',
  description:
    'A pinned sheet torn from the pin: the tear is the seam the second drum prints. Two drums, one sheet, a compact that reads at 16px, and an audit that names what it could not verify.',
  alternates: {
    canonical: '/design-system/riso',
    types: { 'text/markdown': '/design-system/riso/llms.txt' },
  },
  openGraph: {
    title: 'Riso Co. — Case 04 | Design System',
    description:
      'One pin holds the sheet. The tear is what the second drum prints.',
    type: 'website',
    url: '/design-system/riso',
    images: [
      {
        url: '/brand/riso/riso-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Riso Co. brand board: the pinned sheet torn from the pin, the two drums, the outlined wordmark and the tear edge.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riso Co. — Case 04 | Design System',
    description:
      'Two drums, one sheet, one tear. A print system that does not use a single filter.',
    images: ['/brand/riso/riso-brandkit.png'],
  },
}

const BRAND = '/brand/riso'

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

export default function RisoPage() {
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
            aria-label="Riso Co., back to top"
          >
            <RisoMark size={26} title="" />
            <span>riso co.</span>
          </a>

          <nav className={styles.topnav} aria-label="Sections">
            <a href="#marks">Marks</a>
            <a href="#ink">Ink</a>
            <a href="#type">Type</a>
            <a href="#parts">Parts</a>
            <a href="#tokens">Tokens</a>
          </nav>

          <RisoThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* ── Hero: the sheet, pinned and torn ─────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroSheet}>
            <RisoPin size={48} className={styles.heroPin} />

            <div className={`${styles.shell} ${styles.heroInner}`}>
              {/* the footer's chrome row, printed at the top of the sheet */}
              <div className={styles.heroChrome}>
                <span className={styles.chromeIcons}>
                  <a href="#top" aria-label="Back to the top of the sheet">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 14.5 12 8.5l6 6" />
                    </svg>
                  </a>
                  <a href="#marks" aria-label="Instagram">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <rect x="3.5" y="3.5" width="17" height="17" />
                      <circle cx="12" cy="12" r="3.8" />
                      <circle cx="17.1" cy="6.9" r="0.6" fill="currentColor" />
                    </svg>
                  </a>
                  <a href="#ink" aria-label="X">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M5 4.5h3.6l10.4 15H15.4zM18.6 4.5 13.4 10.4M5.4 19.5l5.4-6.2" />
                    </svg>
                  </a>
                </span>
                <span className={styles.live}>
                  <span className={styles.dot} aria-hidden="true" />
                  taking print orders
                </span>
                <span className={styles.chromeMeta}>
                  run 0412 · 270gsm vellum
                  <RisoClock />
                </span>
              </div>

              <div>
                <p className={styles.eyebrow}>
                  Brand kit &amp; design system · {META.date}
                </p>
                <h1 className={styles.display}>
                  One pin holds the sheet. <em>The tear</em> is what the second
                  drum prints.
                </h1>
              </div>

              <div className={styles.heroFoot}>
                <div className={styles.heroLede}>
                  <p className={styles.lede}>
                    Riso Co. is a two-drum print shop, and this is the system it
                    prints with. The mark is a sheet pinned at the top and torn
                    from the pin; the right flap sits 4,3 out of register
                    because the other drum made it. No grain overlays, no blend
                    modes, no shadow pretending to be ink.
                  </p>
                  <div className={styles.heroActions}>
                    <a className={styles.btn} href="#marks">
                      Read the marks
                    </a>
                    <a
                      className={`${styles.btn} ${styles.btnQuiet}`}
                      href="#sheet"
                    >
                      See the sheet
                    </a>
                  </div>
                </div>

                <div className={styles.heroMark}>
                  <RisoMark
                    size={176}
                    onDrum
                    title="Riso Co. mark printed on drum A"
                  />
                  <span>printed on drum A · register 4,3</span>
                </div>
              </div>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <b>3</b>
                  <span>shapes: two flaps, one pin</span>
                </div>
                <div className={styles.stat}>
                  <b>5</b>
                  <span>teeth in the seam</span>
                </div>
                <div className={styles.stat}>
                  <b>2.2</b>
                  <span>px of register on type</span>
                </div>
                <div className={styles.stat}>
                  <b>1</b>
                  <span>effect: the misregistration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.layout}`}>
          <RisoContents />

          <div>
            {/* ── 01 The pin ───────────────────────────────────────────── */}
            <section id="pin">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>01</b> The pin
                </p>
                <h2>A sheet is only interesting while something holds it.</h2>
                <p>
                  Seven beats and four decisions. Everything below follows from
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
                    The previous version of this system argued about two passes.
                    This one argues about paper: a sheet that can be pinned,
                    torn and printed twice. That is a narrower claim, and it is
                    the one the footer was already making.
                  </p>
                </div>
              </div>

              <div className={styles.decisions}>
                {DECISIONS.map((decision) => (
                  <DecisionCard key={decision.title} decision={decision} />
                ))}
              </div>
            </section>

            {/* ── 02 The tear ──────────────────────────────────────────── */}
            <section id="tear">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>02</b> The tear
                </p>
                <h2>The tear is a polygon, and the ghost is a text-shadow.</h2>
                <p>
                  Two effects carry the whole material: a clip-path that cuts a
                  torn edge, and a 2.2px second impression on display type. Both
                  are geometry, so both survive a screenshot, a PDF and a
                  browser with no blend modes.
                </p>
              </div>

              <div className={styles.tearStage}>
                <div className={`${styles.tearBand} ${styles.bandA}`}>
                  <span>Drum A · fluorescent orange</span>
                  <span>5.16:1 with carbon</span>
                </div>
                <div className={`${styles.tearBand} ${styles.bandB}`}>
                  <span>Drum B · federal blue</span>
                  <span>3.63:1 — large text only</span>
                </div>
                <div className={`${styles.tearBand} ${styles.bandC}`}>
                  <span>Carbon · the reading ink</span>
                  <span>15.26:1 on vellum</span>
                </div>
              </div>

              <div className={styles.registerDemo}>
                <span>With the register</span>
                <b>Run 0412 — torn to size</b>
                <span>Without it</span>
                <i>Run 0412 — torn to size</i>
              </div>

              <div className={styles.codeGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>tear · clip-path</span>
                    <CopyButton text={TEAR_RECIPE} />
                  </div>
                  <pre>
                    <code>{TEAR_RECIPE}</code>
                  </pre>
                </div>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>register · text-shadow</span>
                    <CopyButton text={REGISTER_RECIPE} />
                  </div>
                  <pre>
                    <code>{REGISTER_RECIPE}</code>
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
                <h2>
                  Two flaps and one pin. Nothing crosses the tear but the pin.
                </h2>
                <p>
                  Constructed track, offset planes: the sheet is cut once, the
                  second drum slides it 4,3, and the pin is the only element
                  allowed to bridge the seam. Five concepts were drawn; four
                  lost.
                </p>
              </div>

              <div className={styles.logoCard}>
                <div className={styles.stage}>
                  {}
                  <img
                    src={`${BRAND}/lockup-mono.svg`}
                    alt="Riso Co. lockup: the pinned sheet beside the outlined wordmark"
                    width={320}
                    height={80}
                  />
                </div>
                <div className={styles.rail}>
                  <span>Logo / 01 · mark + wordmark</span>
                  <span>64 grid · register 4,3</span>
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
                        <code>public/brand/riso/</code>
                      </dd>
                    </dl>
                    <div className={styles.downloads}>
                      <a href={`${BRAND}/mark.svg`} download>
                        Mark .svg
                      </a>
                      <a href={`${BRAND}/lockup.svg`} download>
                        Lockup .svg
                      </a>
                      <a href={`${BRAND}/lockup-mono.svg`} download>
                        Lockup, 1 ink .svg
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
                      At 16px the pin closes up and the channel becomes a
                      hairline, so the compact is a separate drawing: two
                      shapes, a wider gap, no pin. It is not a scale-down.
                    </p>
                  </div>
                </div>

                <div className={styles.doDont}>
                  <div className={styles.yes}>
                    <b>Do</b>
                    Print the mark on the orange sheet with{' '}
                    <code>lockup-on-drum.svg</code> — carbon and paper, the way
                    a black drum behaves on an orange stock.
                  </div>
                  <div className={styles.no}>
                    <b>Don&rsquo;t</b>
                    Place the two-drum mark on drum A. Orange on orange is 1:1
                    and the left flap disappears.
                  </div>
                </div>
              </div>

              <div className={styles.wordmarkCard}>
                <div className={styles.clear}>
                  {}
                  <img
                    src={`${BRAND}/wordmark.svg`}
                    alt="Riso Co. wordmark"
                    width={300}
                    height={62}
                  />
                </div>
                <div className={styles.scaleRow}>
                  <figure>
                    {}
                    <img
                      src={`${BRAND}/wordmark.svg`}
                      width={160}
                      height={33}
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
                    Space Grotesk 700, outlined from the font file. The reading
                    face takes over below 40px; the drawn name is never
                    squeezed.
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
                  <b>One rule.</b> The pin is the only element that crosses the
                  tear. If a variant needs a second bridging shape — a stitch, a
                  tape, a highlight — it is a different mark, not a variant.
                </div>
              </div>
            </section>

            {/* ── 04 Ink ───────────────────────────────────────────────── */}
            <section id="ink">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>04</b> Ink
                </p>
                <h2>Six inks, and two of them are not allowed to set type.</h2>
                <p>
                  Fluorescent orange and federal blue are drums, not accents:
                  they fill, they never carry a paragraph. Carbon carries every
                  word. The ratios below are computed from the semantic layer,
                  not typed by hand.
                </p>
              </div>

              <div className={styles.inkGrid}>
                {PALETTE.map((ink) => (
                  <div className={styles.inkChip} key={ink.token}>
                    {/* The hex is printed under the chip, not on it: a 10px label
                        on a mid-tone swatch cannot clear 4.5:1 on either ink. */}
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
                The two red rows are the honest ones: fluorescent orange as type
                and steel as a border both fail. They are listed because a
                palette that only publishes its passes is a brochure.
              </p>
            </section>

            {/* ── 05 Type ──────────────────────────────────────────────── */}
            <section id="type">
              <div className={styles.secHead}>
                <p className={styles.secNum}>
                  <b>05</b> Type
                </p>
                <h2>A grotesque for the sheet, a mono for the press notes.</h2>
                <p>
                  Space Grotesk sets every display line because its flat
                  terminals hold a 2.2px ghost without turning into a smudge.
                  Geist reads; Geist Mono counts.
                </p>
              </div>

              <div className={styles.typeSpecimens}>
                <div className={styles.specimen}>
                  <span>Display · 44–80</span>
                  <p className={styles.spDisplay} style={{ margin: 0 }}>
                    Torn to size
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>H2 · 28–40</span>
                  <p className={styles.spH2} style={{ margin: 0 }}>
                    Two drums, one sheet
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Body · 17/1.6</span>
                  <p className={styles.spBody} style={{ margin: 0 }}>
                    The press takes 40MB and prints in two passes. Send artwork
                    at the final size, with 3mm bleed, and tell us the stock —
                    we keep 270gsm vellum in the drawer and order everything
                    else.
                  </p>
                </div>
                <div className={styles.specimen}>
                  <span>Label · 11 mono</span>
                  <p className={styles.spMono} style={{ margin: 0 }}>
                    Run 0412 · 270gsm · two drums
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
                <h2>Six primitives, cut from the same sheet.</h2>
                <p>
                  Buttons, fields, the pin, the sheet card, chips and tabs.
                  Every one of them is square, every state is visible without
                  colour alone, and the focus ring is 2px carbon offset 2px.
                </p>
              </div>

              <RisoParts />

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
                  names the stock and the drums; the semantic layer names the
                  job; the component layer is the only place a button is allowed
                  to know what colour it is.
                </p>
              </div>

              <div className={styles.tokenGrid}>
                <div className={styles.code}>
                  <div className={styles.codeHead}>
                    <span>riso-tokens.css</span>
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
                The dark surface is{' '}
                <code>html[data-riso=&quot;safelight&quot;]</code>, not a second
                palette: the drums keep their hex and the paper inverts.
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
                  Nine passes, one partial, two open. A guide that hides its
                  gaps is a brochure, so the gaps are listed in full underneath.
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

        {/* ── 09 The sheet: the closing band, edge to edge ─────────────── */}
        <section id="sheet" className={styles.footerBand}>
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <b>09</b> The sheet
              </p>
              <h2>The page ends in the thing the mark is made of.</h2>
              <p>
                The pushpin-and-tear footer, fed the real tokens: the pin drops,
                the sheet rips from the pin outward, and the chrome assembles
                behind it. Every colour and every duration comes from the token
                layer — including the sheet the hero is printed on.
              </p>
            </div>
          </div>

          <RisoFooterDemo />
        </section>
      </main>

      <footer className={styles.endcap}>
        <div className={`${styles.shell} ${styles.endcapInner}`}>
          <span>
            Riso Co. · {META.caseNumber} · {META.version} · {META.date}
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
