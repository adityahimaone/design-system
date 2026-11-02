import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {
  AUDIT_ROWS,
  BUDGET_RULES,
  CAST,
  DECISIONS,
  DETACH_FLOOR,
  DETACH_SCORES,
  GAPS,
  GLASS_RECIPE,
  GLASS_RULES,
  HORIZON_RULES,
  HORIZON_SPEC,
  MARK_GATE,
  MARK_SPECS,
  MOTION_RULES,
  OUTPUT_CONTRACT,
  PALETTE,
  STORY_BEATS,
  TYPE_GATE,
  TYPE_SCALE,
  VOICE_SAMPLES,
} from '@/features/strand/strand-data'
import { CopyButton } from '@/features/strand/components/actions'
import {
  CastGlyph,
  StrandLockup,
  StrandMark,
  StrandWordmark,
} from '@/features/strand/components/brand'
import { Code } from '@/features/strand/components/code'
import { StrandContents } from '@/features/strand/components/contents'
import { FormDemo } from '@/features/strand/components/form-demo'
import { StrandThemeToggle } from '@/features/strand/components/theme-toggle'
import tokens from '@/features/strand/tokens.json'
import styles from '@/features/strand/strand.module.css'

export const metadata: Metadata = {
  title: 'Strand — Case 07 | Design System',
  description:
    'Strand v2.0 is a coastal interface system made of sea-glass: one pane over dune light, marine ink, a single sun-warm signal, two planes with a six-unit strand between them, and a full-bleed coast for a footer.',
  alternates: {
    canonical: '/design-system/strand',
    types: { 'text/markdown': '/design-system/strand/llms.txt' },
  },
  openGraph: {
    title: 'Strand — Case 07 | Design System',
    description:
      'Two planes, and the strand between them. Sea-glass panes over dune light, one sun-warm signal, and a coast that appears twice.',
    type: 'website',
    url: '/design-system/strand',
    images: [
      {
        url: '/brand/strand/strand-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Strand brand board: two sheared planes with a six-unit channel, the outlined strand wordmark, six inks and the sea-glass recipe.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strand — Case 07 | Design System',
    description: 'Two planes, and the strand between them.',
    images: ['/brand/strand/strand-brandkit.png'],
  },
}

const STATS = [
  { value: '127', label: 'Token declarations' },
  { value: '15.7:1', label: 'Body on the pane' },
  { value: '6', label: 'Unit strand, never closed' },
  { value: '11', label: 'Sections, all rendered' },
]

export default function StrandPage() {
  const cssSample = `:root {
  /* the ground, and the pane over it */
  --st-bg: #F3F0E8;
  --st-glass-fill: linear-gradient(
    158deg,
    rgb(255 255 255 / 0.84),
    rgb(255 255 255 / 0.58)
  );
  --st-glass-edge: rgb(255 255 255 / 0.78);
  --st-glass-blur: 24px;

  /* ink, one signal, one rare cool */
  --st-fg: #13232A;
  --st-muted: #57696E;
  --st-signal: #A85A22;
  --st-rare: #2F5F6B;

  /* geometry */
  --st-radius-lg: 22px;
  --st-radius-md: 14px;
  --st-duration-base: 260ms;
}`

  const jsonSample = JSON.stringify(
    {
      name: tokens.meta.name,
      version: tokens.meta.version,
      material: tokens.meta.material,
      theme: {
        material: tokens.theme.material,
        radius: tokens.theme.radius,
        edge: tokens.theme.edge,
      },
      signal: '#A85A22',
      contrast: tokens.contrast.slice(0, 2).map((c) => ({
        pair: c.label,
        ratio: c.ratio,
      })),
    },
    null,
    2,
  )

  return (
    <div className={styles.root}>
      <div className={styles.wash} aria-hidden />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <div className={styles.page}>
        <header className={styles.topbar}>
          <div className={`${styles.shell} ${styles.topbarInner}`}>
            <Link className={styles.brand} href="/design-system/strand">
              <StrandMark size={28} decorative />
              <span className={styles.brandName}>strand</span>
            </Link>

            <nav className={styles.topnav} aria-label="Sections">
              <a href="#glass">Glass</a>
              <a href="#marks">Marks</a>
              <a href="#palette">Palette</a>
              <a href="#parts">Parts</a>
              <a href="#audit">Audit</a>
              <Link href="/design-system">Case library ↗</Link>
            </nav>

            <div className={styles.topbarTools}>
              <StrandThemeToggle />
            </div>
          </div>
        </header>

        <main id="main">
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.shell}>
              <div className={styles.heroGrid}>
                <div>
                  <p className={styles.eyebrow}>Case 07 · Coastal interface system</p>
                  <h1 id="hero-title">
                    Two planes, and the <em>strand</em> between them.
                  </h1>
                  <p className={styles.lede}>
                    Strand is a design system for reading in daylight. Every surface is a
                    pane of sea-glass over dune light, the ink is the colour of deep water,
                    and one sun-warm signal marks the place where something happens.
                  </p>
                  <div className={styles.heroMeta}>
                    <span className={styles.pill}>
                      Version <b>2.0</b>
                    </span>
                    <span className={styles.pill}>
                      Material <b>Sea glass</b>
                    </span>
                    <span className={styles.pill}>
                      Display <b>Instrument Sans</b>
                    </span>
                    <span className={styles.pill}>
                      Contrast <b>AA+</b>
                    </span>
                  </div>
                </div>

                <div className={styles.heroMedia}>
                  <Image
                    src="/brand/strand/strand-vista.webp"
                    alt="A dune ridge meeting a flat sea at low light, the horizon a single straight line."
                    width={1672}
                    height={941}
                    priority
                    sizes="(max-width: 1040px) 100vw, 520px"
                  />
                  <div className={`${styles.pane} ${styles.heroPane}`}>
                    <StrandLockup height={26} className={styles.heroLockup} />
                    <span className={styles.heroPaneText}>
                      North strand
                      <br />
                      Marker 04 · 18:40
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.heroStats}>
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className={`${styles.pane} ${styles.paneQuiet} ${styles.stat}`}
                  >
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className={`${styles.shell} ${styles.layout}`}>
            <StrandContents />

            <div>
              {/* 1 · foundation */}
              <section id="foundation">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>01 · Foundation</p>
                  <h2>A quiet interface is a material decision.</h2>
                  <p>
                    Strand began with one photograph: a dune ridge, a flat sea, and a
                    horizon that does not move. The system keeps that arrangement — a
                    lighter plane above, a heavier plane below, and a gap that is never
                    filled — and turns it into glass, ink and one warm signal.
                  </p>
                </div>

                <div className={styles.belief}>
                  <div className={`${styles.pane} ${styles.paneQuiet}`}>
                    <h3>Two planes</h3>
                    <p>
                      The mark, the pane and the page are all built from the same
                      arrangement: two masses and a channel. Nothing overlaps; everything
                      is separated by a gap.
                    </p>
                  </div>
                  <div className={`${styles.pane} ${styles.paneQuiet}`}>
                    <h3>One pane</h3>
                    <p>
                      Glass is the only effect. There is no grain, no gradient mesh, no
                      noise and no second material. Restraint is what makes the one effect
                      legible.
                    </p>
                  </div>
                  <div className={`${styles.pane} ${styles.paneQuiet}`}>
                    <h3>One signal</h3>
                    <p>
                      Sun appears where something happens — a primary action, a focus ring,
                      the upper plane of the mark — and stays under two percent of the
                      viewport.
                    </p>
                  </div>
                </div>

                <div className={`${styles.pane} ${styles.sentence}`}>
                  <p>
                    Strand is a coastal interface system for reading in daylight: every
                    surface is a pane of sea-glass over dune light, the ink is the colour of
                    deep water, and one sun-warm signal marks the place where something
                    happens.
                  </p>
                  <small>The one sentence · reject the work against this</small>
                </div>

                <div className={styles.cards4}>
                  {DECISIONS.map((d) => (
                    <div
                      key={d.title}
                      className={`${styles.pane} ${styles.paneQuiet} ${styles.decision}`}
                    >
                      <p className={styles.decisionTitle}>{d.title}</p>
                      <dl>
                        <dt>Decision</dt>
                        <dd>{d.decision}</dd>
                        <dt>Because</dt>
                        <dd>{d.because}</dd>
                        <dt>Not when</dt>
                        <dd>{d.notWhen}</dd>
                        <dt>Breaks next</dt>
                        <dd>
                          <em>{d.breaksNext}</em>
                        </dd>
                      </dl>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2 · glass */}
              <section id="glass">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>02 · Glass</p>
                  <h2>One pane, and the plate that keeps it honest.</h2>
                  <p>
                    A pane is a container with a material. A plate is a surface that holds a
                    paragraph. The rule that makes glass usable rather than decorative is
                    that the two never swap jobs.
                  </p>
                </div>

                <div className={styles.materialGrid}>
                  <div className={styles.demoGlass}>
                    <Image
                      src="/brand/strand/strand-vista.webp"
                      alt="Dune grass against the sea, used as the ground under a pane of glass."
                      width={1672}
                      height={941}
                      sizes="(max-width: 1040px) 100vw, 600px"
                    />
                    <div className={styles.pane}>
                      <div className={styles.plate}>
                        <strong>Pane over photograph</strong>
                        <p>
                          The blur samples the dune behind it. The paragraph sits on a solid
                          plate inside the pane, so its contrast is 15.7:1 no matter what
                          the photograph does.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <ul className={styles.rules}>
                      {GLASS_RULES.map((r) => (
                        <li key={r.title}>
                          <b>{r.title}</b>
                          <span>{r.body}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={styles.note}>
                      Measured on the composite: marine ink on a pane at 78% white over the
                      dune ground is 15.7:1. The night pane at 10% white over #0A1114 is
                      12.6:1.
                    </p>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.codeHead}>
                    <span>The recipe</span>
                    <CopyButton text={GLASS_RECIPE} label="Copy CSS" />
                  </div>
                  <pre>
                    <Code source={GLASS_RECIPE} />
                  </pre>
                </div>
              </section>

              {/* 3 · marks */}
              <section id="marks">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>03 · Marks</p>
                  <h2>Two planes, one strand.</h2>
                  <p>
                    The upper plane is sand, the lower is sea, and the six-unit channel
                    between them is the only part of the mark that is not drawn. It is a
                    gap, not a stroke — which is why it survives at 16px.
                  </p>
                </div>

                <div className={`${styles.pane} ${styles.logoCard}`}>
                  <div className={styles.stage}>
                    <div className={styles.stageClear}>
                      <StrandMark size={168} variant="reverse" />
                    </div>
                    <div className={styles.stageRail}>
                      <span>64 grid · 52 × 46</span>
                      <span>Fill only · no stroke</span>
                      <span>Strand 6 units</span>
                    </div>
                  </div>

                  <div className={styles.logoBody}>
                    <div>
                      <dl className={styles.specs}>
                        {MARK_SPECS.map((s) => (
                          <div key={s.label} style={{ display: 'contents' }}>
                            <dt>{s.label}</dt>
                            <dd>{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className={styles.downloads}>
                        <a href="/brand/strand/mark.svg" download>
                          mark.svg
                        </a>
                        <a href="/brand/strand/mark-compact.svg" download>
                          compact
                        </a>
                        <a href="/brand/strand/mark-mono.svg" download>
                          mono
                        </a>
                        <a href="/brand/strand/favicon.ico" download>
                          favicon
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className={styles.iconsRow}>
                        <figure>
                          <StrandMark size={48} compact />
                          <figcaption>48</figcaption>
                        </figure>
                        <figure>
                          <StrandMark size={32} compact />
                          <figcaption>32</figcaption>
                        </figure>
                        <figure>
                          <StrandMark size={24} compact />
                          <figcaption>24</figcaption>
                        </figure>
                        <figure>
                          <StrandMark size={16} compact />
                          <figcaption>16</figcaption>
                        </figure>
                      </div>
                      <p className={styles.note}>
                        Below 28px the component swaps to the compact drawing: a wider
                        channel, no fine overhang. It is a second drawing, not a downscale,
                        because a 6-unit gap at 16px is 1.5 device pixels and needs help.
                      </p>
                    </div>
                  </div>

                  <div className={styles.doDont}>
                    <div className={styles.yes}>
                      <b>Do</b>
                      Keep the channel empty. Let the two planes sit on the 64 grid, sheared
                      18.4°, with the upper plane overhanging the lower by eight units.
                    </div>
                    <div className={styles.no}>
                      <b>Don’t</b>
                      Close the gap to gain weight, outline either plane, add a third mass,
                      rotate the mark, or place it on a busy photograph without a pane.
                    </div>
                  </div>
                </div>

                <div className={`${styles.pane} ${styles.wordmarkCard}`}>
                  <div className={styles.wmClear}>
                    <StrandWordmark height={44} />
                  </div>
                  <div className={styles.scaleRow}>
                    <figure>
                      <StrandWordmark height={44} />
                      <figcaption>44 · footer</figcaption>
                    </figure>
                    <figure>
                      <StrandWordmark height={26} />
                      <figcaption>26 · topbar</figcaption>
                    </figure>
                    <figure>
                      <StrandWordmark height={16} />
                      <figcaption>16 · metadata</figcaption>
                    </figure>
                  </div>
                  <p className={styles.note}>
                    Lowercase, outlined from Helvetica Neue Medium at −22/1000 tracking, and
                    frozen as paths. A missing webfont cannot change the logo — the display
                    face is Instrument Sans, but the wordmark is a drawing.
                  </p>
                </div>

                <div className={styles.drawer}>
                  {CAST.map((c) => (
                    <div
                      key={c.id}
                      className={`${styles.pane} ${styles.paneQuiet} ${styles.castTile}`}
                    >
                      <CastGlyph paths={c.paths} />
                      <b>{c.name}</b>
                      <span>{c.job}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.ruleNote}>
                  <b>The cast is punctuation, not a second logo set.</b> Four readings of the
                  same two planes, one 45° cut on every right end, used only as state
                  glyphs beside a tide reading. They never appear without a label and never
                  replace the mark.
                </div>
              </section>

              {/* 4 · horizon */}
              <section id="horizon">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>04 · Horizon</p>
                  <h2>The coast appears twice.</h2>
                  <p>
                    A framed entrance and a full-bleed departure. The footer is the one
                    element on this page allowed to leave the 1180px grid — it spans the
                    viewport, edge to edge, with no radius and no wrapper.
                  </p>
                </div>

                <div className={styles.horizonGrid}>
                  <div>
                    {HORIZON_RULES.map((r) => (
                      <div key={r.rule} className={styles.horizonRule}>
                        <h3>{r.rule}</h3>
                        <p>{r.decision}</p>
                        <p>{r.because}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className={`${styles.pane} ${styles.horizonSpec}`}>
                      {HORIZON_SPEC.map((s) => (
                        <div key={s.key} className={styles.horizonSpecRow}>
                          <span className={styles.horizonSpecKey}>{s.key}</span>
                          <span className={styles.horizonSpecValue}>{s.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.footPreview}>
                      <Image
                        src="/brand/strand/dune-quiet-divider.webp"
                        alt="The footer photograph: a quiet dune divider between sand and sea."
                        width={1916}
                        height={821}
                        sizes="(max-width: 1040px) 100vw, 420px"
                      />
                      <div className={`${styles.pane} ${styles.footPreviewPane}`}>
                        Full-bleed · 100vw
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5 · palette */}
              <section id="palette">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>05 · Palette</p>
                  <h2>Six inks, and a two percent budget.</h2>
                  <p>
                    Four of the six are quiet enough to fill a page. One is the signal. One
                    is the rare cool note that appears once per section, if at all.
                  </p>
                </div>

                <div className={styles.swatches}>
                  {PALETTE.map((s) => (
                    <div key={s.name} className={styles.swatch}>
                      <div
                        className={styles.swatchChip}
                        style={{ background: s.value, color: s.ink }}
                      >
                        <span>{s.value}</span>
                      </div>
                      <div className={styles.swatchMeta}>
                        <b>{s.name}</b>
                        <code>{s.token}</code>
                        <p style={{ marginTop: 6 }}>{s.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.block}>
                  <table>
                    <caption>Contrast, measured on the declared composite</caption>
                    <thead>
                      <tr>
                        <th scope="col">Pair</th>
                        <th scope="col">Ratio</th>
                        <th scope="col">Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.contrast.map((c) => (
                        <tr key={c.label}>
                          <td>{c.label}</td>
                          <td className={`${styles.num} ${styles.pass}`}>{c.ratio}:1</td>
                          <td>{c.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.loudDemo}>
                  <div>
                    <p>The signal is a verb: it appears where something happens.</p>
                    <small>Sun #A85A22 · 2% of the viewport · never body text</small>
                  </div>
                  <StrandMark size={52} variant="reverse" />
                </div>

                <ul className={styles.gaps} style={{ marginTop: 18 }}>
                  {BUDGET_RULES.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>

              {/* 6 · type */}
              <section id="type">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>06 · Type</p>
                  <h2>A grotesk that keeps its voice down.</h2>
                  <p>
                    Instrument Sans for names and headings, Geist for reading, Geist Mono
                    for labels and every number in this document. Three jobs, three faces,
                    no decorative fourth.
                  </p>
                </div>

                <div className={styles.typeGrid}>
                  <div className={styles.typeCol}>
                    <span className={styles.label}>Display · Instrument Sans</span>
                    <p className={`${styles.typeSpec} ${styles.displaySpec}`}>Strand</p>
                    <p>
                      600 at display size, −0.035em tracking. One per page. It is allowed to
                      be large because nothing else is.
                    </p>
                  </div>
                  <div className={styles.typeCol}>
                    <span className={styles.label}>Reading · Geist</span>
                    <p className={`${styles.typeSpec} ${styles.readingSpec}`}>Tide height</p>
                    <p>
                      400 at 17px, 1.62 line height, 66 characters. Body never sits on glass
                      without a plate beneath it.
                    </p>
                  </div>
                  <div className={styles.typeCol}>
                    <span className={styles.label}>Label · Geist Mono</span>
                    <p className={`${styles.typeSpec} ${styles.monoSpec}`}>04 · 18:40</p>
                    <p>
                      500 at 11px, 0.14em tracking, uppercase. Every measurement in the
                      system is set in it, with tabular numerals.
                    </p>
                  </div>
                </div>

                <div className={styles.block}>
                  <table>
                    <caption>Scale</caption>
                    <thead>
                      <tr>
                        <th scope="col">Role</th>
                        <th scope="col">Token</th>
                        <th scope="col">Value</th>
                        <th scope="col">Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TYPE_SCALE.map((t) => (
                        <tr key={t.name}>
                          <td>{t.name}</td>
                          <td>
                            <code>{t.token}</code>
                          </td>
                          <td className={styles.num}>{t.size}</td>
                          <td>{t.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.measureDemo}>
                  <p>
                    The tide came in at 18:40 and stopped at the fourth marker, where the
                    sand turns from dry to dark. Two hours later the line had moved eleven
                    metres and the wind had not changed. A reading like this is the only kind
                    of sentence this interface is built to hold: a measurement, a time, and
                    the place it was taken.
                  </p>
                  <aside>
                    <b className={styles.blockLabel} style={{ display: 'block' }}>
                      Measure
                    </b>
                    66 characters at 17px. The paragraph is 4 lines at 1440 and 7 at 390 —
                    long enough to prove the measure, short enough to stay on the plate.
                  </aside>
                </div>

                <div className={styles.block}>
                  <table>
                    <caption>Type gate</caption>
                    <thead>
                      <tr>
                        <th scope="col">Rule</th>
                        <th scope="col">State</th>
                        <th scope="col">Implementation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TYPE_GATE.map((t) => (
                        <tr key={t.rule}>
                          <td>{t.rule}</td>
                          <td className={styles.pass}>{t.pass ? 'PASS' : 'FAIL'}</td>
                          <td>{t.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 7 · parts */}
              <section id="parts">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>07 · Parts</p>
                  <h2>Controls cut from the same pane.</h2>
                  <p>
                    Eleven native controls, styled through component tokens. The focus ring
                    is a gap and a ring, never a glow; the primary button is the only place
                    the signal becomes a surface.
                  </p>
                </div>

                <div className={styles.parts}>
                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.part}`}>
                    <div className={styles.plabel}>
                      <span>Buttons</span>
                      <span>3 states</span>
                    </div>
                    <div className={styles.btnRow}>
                      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Save reading
                      </button>
                      <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>
                        Export
                      </button>
                      <button type="button" className={`${styles.btn} ${styles.btnQuiet}`}>
                        Discard
                      </button>
                    </div>
                  </div>

                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.part}`}>
                    <div className={styles.plabel}>
                      <span>Segmented + chips</span>
                      <span>Selected</span>
                    </div>
                    <div className={styles.segmented} role="tablist" aria-label="Range">
                      <button type="button" role="tab" aria-selected="true">
                        Day
                      </button>
                      <button type="button" role="tab" aria-selected="false">
                        Week
                      </button>
                      <button type="button" role="tab" aria-selected="false">
                        Month
                      </button>
                    </div>
                    <div className={styles.chips}>
                      <span className={`${styles.chipState} ${styles.isSlack}`}>
                        <i aria-hidden /> Slack
                      </span>
                      <span className={`${styles.chipState} ${styles.isRising}`}>
                        <i aria-hidden /> Rising
                      </span>
                      <span className={`${styles.chipState} ${styles.isSun}`}>
                        <i aria-hidden /> Live
                      </span>
                    </div>
                  </div>

                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.part}`}>
                    <div className={styles.plabel}>
                      <span>Row</span>
                      <span>Hover</span>
                    </div>
                    <div className={styles.entry}>
                      <CastGlyph paths={CAST[2].paths} size={26} className={styles.entryMark} />
                      <div>
                        <b>Ebb · marker 11</b>
                        <span>1.42 m · 06:12</span>
                      </div>
                      <time>18:40</time>
                    </div>
                    <div className={styles.entry}>
                      <CastGlyph paths={CAST[0].paths} size={26} className={styles.entryMark} />
                      <div>
                        <b>Slack · marker 04</b>
                        <span>2.06 m · 12:04</span>
                      </div>
                      <time>12:04</time>
                    </div>
                  </div>

                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.part}`}>
                    <div className={styles.plabel}>
                      <span>Empty</span>
                      <span>No reading</span>
                    </div>
                    <div className={styles.empty}>
                      <StrandMark size={34} compact className={styles.emptyMark} />
                      <p>No readings yet. The next tide is logged at 06:12.</p>
                    </div>
                  </div>

                  <div className={styles.partWide}>
                    <div className={styles.plabel} style={{ marginBottom: 10 }}>
                      <span>Form kit · native controls, component tokens</span>
                      <span>5 states</span>
                    </div>
                    <FormDemo />
                  </div>
                </div>
              </section>

              {/* 8 · motion */}
              <section id="motion">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>08 · Motion</p>
                  <h2>The pane brightens; the page does not move.</h2>
                  <p>
                    One curve, three durations, no transform on hover. A control that shifts
                    the layout makes a still page feel unstable, and this page is arguing for
                    stillness.
                  </p>
                </div>

                <div className={styles.motionGrid}>
                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.dur}`}>
                    <b>160 ms</b>
                    <span>Press, colour, toggle</span>
                    <div className={styles.durBar} />
                  </div>
                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.dur}`}>
                    <b>260 ms</b>
                    <span>Sheen, hover, theme cross-fade</span>
                    <div className={styles.durBar} />
                  </div>
                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.dur}`}>
                    <b>420 ms</b>
                    <span>Sheet and page change</span>
                    <div className={styles.durBar} />
                  </div>
                </div>

                <div className={styles.liftDemo}>
                  <div className={`${styles.pane} ${styles.lift}`}>
                    <b>Hover the pane</b>
                    <span>The sheen rises 6%, the shadow lengthens. Nothing translates.</span>
                  </div>
                  <div className={`${styles.pane} ${styles.lift}`}>
                    <b>Focus a control</b>
                    <span>A 2px gap then a 2px ring, in the signal. Never a glow.</span>
                  </div>
                  <div className={`${styles.pane} ${styles.lift}`}>
                    <b>Change the surface</b>
                    <span>Colour only, 260ms. The layout is identical in both surfaces.</span>
                  </div>
                </div>

                <div className={styles.block}>
                  <table>
                    <caption>Motion rules</caption>
                    <thead>
                      <tr>
                        <th scope="col">Rule</th>
                        <th scope="col">Value</th>
                        <th scope="col">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOTION_RULES.map((m) => (
                        <tr key={m.rule}>
                          <td>{m.rule}</td>
                          <td>
                            <code>{m.value}</code>
                          </td>
                          <td>{m.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 9 · voice */}
              <section id="voice">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>09 · Voice</p>
                  <h2>State the reading, then stop.</h2>
                  <p>
                    The interface is a logbook, not a host. It gives you the number, the
                    time and the place, and it does not congratulate you for reading them.
                  </p>
                </div>

                <div className={styles.voiceGrid}>
                  <div className={`${styles.pane} ${styles.paneQuiet} ${styles.voiceCard}`}>
                    <div>
                      <dt>Register</dt>
                      <dd>Measured, unhurried, specific.</dd>
                    </div>
                    <div>
                      <dt>Person</dt>
                      <dd>Second person, sparingly.</dd>
                    </div>
                    <div>
                      <dt>Numbers</dt>
                      <dd>Always with a unit and a time.</dd>
                    </div>
                    <div>
                      <dt>Never</dt>
                      <dd>Weather metaphors in product copy.</dd>
                    </div>
                    <div>
                      <dt>Enemy</dt>
                      <dd>The cheerful empty state.</dd>
                    </div>
                  </div>

                  <div className={styles.voiceSamples}>
                    {VOICE_SAMPLES.map((s) => (
                      <div key={s.ctx} className={styles.sample}>
                        <div className={styles.sampleCtx}>{s.ctx}</div>
                        <p>{s.good}</p>
                        <span className={styles.sampleBad}>{s.bad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 10 · tokens */}
              <section id="tokens">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>10 · Tokens</p>
                  <h2>One source, three layers.</h2>
                  <p>
                    Primitive, semantic, component. The generated stylesheet is the only
                    file the page reads; the JSON beside it is the same source in a form a
                    script can diff.
                  </p>
                </div>

                <div className={styles.tokenGrid}>
                  <div>
                    <div className={styles.codeHead}>
                      <span>strand-tokens.css</span>
                      <CopyButton text={cssSample} label="Copy" />
                    </div>
                    <pre>
                      <Code source={cssSample} />
                    </pre>
                  </div>
                  <div>
                    <div className={styles.codeHead}>
                      <span>tokens.json</span>
                      <CopyButton text={jsonSample} label="Copy" />
                    </div>
                    <pre>
                      <Code source={jsonSample} language="json" />
                    </pre>
                  </div>
                </div>

                <div className={styles.block}>
                  <table>
                    <caption>Output contract</caption>
                    <thead>
                      <tr>
                        <th scope="col">Path</th>
                        <th scope="col">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTPUT_CONTRACT.map((o) => (
                        <tr key={o.path}>
                          <td>
                            <code>{o.path}</code>
                          </td>
                          <td>{o.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 11 · audit */}
              <section id="audit">
                <div className={styles.secHead}>
                  <p className={styles.eyebrow}>11 · Audit</p>
                  <h2>What passed, and what this page cannot claim.</h2>
                  <p>
                    Every claim below points at a file, a token or a measured pair. One gate
                    does not pass — detach against Clearing — and it is shown at the score it
                    earned rather than at the score it was aiming for.
                  </p>
                </div>

                <table className={styles.auditTable}>
                  <caption>Gate</caption>
                  <thead>
                    <tr>
                      <th scope="col">Check</th>
                      <th scope="col">Result</th>
                      <th scope="col">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_ROWS.map((r) => (
                      <tr key={r.check}>
                        <td>{r.check}</td>
                        <td className={r.state === 'pass' ? styles.pass : styles.open}>
                          {r.result}
                        </td>
                        <td>{r.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.block}>
                  <p className={styles.blockLabel}>
                    Detach, against the weakest neighbour · floor {DETACH_FLOOR}
                  </p>
                  <div className={styles.detach}>
                    {DETACH_SCORES.map((d) => (
                      <div key={d.ref} className={styles.detachRow}>
                        <span>{d.ref}</span>
                        <b className={d.score >= DETACH_FLOOR ? styles.pass : styles.open}>
                          {d.score}/100
                        </b>
                        <span>{d.finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.block}>
                  <p className={styles.blockLabel}>Mark gate</p>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Rule</th>
                        <th scope="col">State</th>
                        <th scope="col">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MARK_GATE.map((m) => (
                        <tr key={m.rule}>
                          <td>{m.rule}</td>
                          <td className={styles.pass}>{m.pass ? 'PASS' : 'FAIL'}</td>
                          <td>{m.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.block}>
                  <p className={styles.blockLabel}>Named gaps</p>
                  <ul className={styles.gaps}>
                    {GAPS.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.block}>
                  <p className={styles.blockLabel}>Story spine</p>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Beat</th>
                        <th scope="col">Thesis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORY_BEATS.map((s) => (
                        <tr key={s.beat}>
                          <td>{s.beat}</td>
                          <td>{s.line}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className={styles.foot}>
          <div className={styles.footImg} aria-hidden />
          <div className={styles.footScrim} aria-hidden />

          <div className={`${styles.shell} ${styles.footInner}`}>
            <div className={`${styles.pane} ${styles.footPane}`}>
              <p className={styles.footEyebrow}>Case 07 · Strand · v2.0</p>
              <p className={styles.footQuote}>Where the dunes meet the tide.</p>
              <p className={styles.footSub}>
                Sea-glass over dune light, one sun-warm signal, and a strand that is never
                closed. Built as a specimen first, a component library second.
              </p>
              <div className={styles.footLinks}>
                <a href="/brand/strand/mark.svg" download>
                  Download the mark
                </a>
                <a href="/brand/strand/strand-tokens.css" download>
                  Tokens
                </a>
                <Link href="/design-system">All cases</Link>
              </div>
            </div>
          </div>

          <div className={styles.footBar}>
            <div className={`${styles.shell} ${styles.footBarInner}`}>
              <StrandLockup height={22} variant="reverse" />
              <div className={styles.footBarLinks}>
                <a href="#main">Back to top</a>
                <a href="/design-system/strand/llms.txt">llms.txt</a>
                <span>© 2026 Aditya Himawan</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
