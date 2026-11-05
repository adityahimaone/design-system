import type { Metadata } from 'next'

import { CopyButton, NightToggle } from '@/features/vesper/vesper-controls'
import {
  BAKE_OFF,
  CAST,
  DECISIONS,
  FIGURES,
  GAPS,
  KIT_ROWS,
  META,
  NAV,
  PREMISE,
  SPECIMENS,
  STATS,
  SURFACES,
} from '@/features/vesper/vesper-data'
import {
  CastFigure,
  CastGrain,
  CastHorizon,
  CastLamp,
  CastMoon,
  CastRay,
  Glyph,
  Lockup,
  LockupStacked,
  Mark,
  MarkCompact,
} from '@/features/vesper/vesper-marks'
import scores from '@/features/vesper/scores.json'
import tokens from '@/features/vesper/tokens.json'

const BRAND = '/brand/vesper'

export const metadata: Metadata = {
  title: 'Vesper — a two-ink design system',
  description: META.description,
  alternates: {
    canonical: META.href,
    types: { 'text/markdown': `${META.href}/llms.txt` },
  },
  openGraph: {
    title: 'Vesper — a two-ink design system',
    description: META.tagline,
    type: 'website',
    url: META.href,
    images: [
      { url: META.board, width: 1500, height: 1125, alt: META.boardAlt },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vesper — a two-ink design system',
    description: META.tagline,
    images: [META.board],
  },
}

const Arrow = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M2 10 L10 2 M4 2 h6 v6" />
  </svg>
)

const CAST_MARKS = {
  moon: CastMoon,
  lamp: CastLamp,
  horizon: CastHorizon,
  figure: CastFigure,
  ray: CastRay,
  grain: CastGrain,
} as const

const Rail = ({ n, label }: { n: string; label: string }) => (
  <div className="vs-rail">
    <span className="vs-n vs-mono">{n}</span>
    <span className="vs-lbl">{label}</span>
  </div>
)

const shipped = scores.find((s) => s.id === 'horizon-star')
const rank = scores.findIndex((s) => s.id === 'horizon-star') + 1

const LEDGER: { check: string; result: React.ReactNode; status: string }[] = [
  {
    check: 'Contrast',
    result: `${tokens.contrast.length} pairs recomputed from hex; every stated ratio matches; ${tokens.meta.failingPairs} failing pairs published with the job they may not do.`,
    status: 'pass',
  },
  {
    check: 'Palette is one source',
    result: `All ${tokens.primitives.length} primitives in tokens.json are declared in the token CSS at the same value.`,
    status: 'pass',
  },
  {
    check: 'Font registered',
    result: (
      <>
        Fraunces, Archivo and DM Mono are declared in this page and loaded from{' '}
        <span className="vs-mono">features/vesper/fonts</span>; no network
        request.
      </>
    ),
    status: 'pass',
  },
  {
    check: 'Mark at 16px',
    result:
      'The compact is a different drawing — 2.6-unit bow, 5-unit bar — not the primary scaled. Rendered at 16 and inspected.',
    status: 'pass',
  },
  {
    check: 'Bake-off scored',
    result: `${scores.length} concepts rasterised at 128, 40 and 16 and measured on eight checks. The shipped mark ranks ${rank} of ${scores.length}; its one failure is published above rather than tuned away.`,
    status: 'pass',
  },
  {
    check: 'Reduced motion',
    result: (
      <>
        Under <span className="vs-mono">prefers-reduced-motion</span> every
        reveal is already at its final frame; the field is a still image, so the
        still frame is the design.
      </>
    ),
    status: 'pass',
  },
  {
    check: 'Detach',
    result:
      'Not run against the sibling cases in this repo. The display face (Fraunces) and the material (two-ink stipple) are unused by them, but that is an argument, not a measurement.',
    status: 'not verified',
  },
  {
    check: 'Figma export',
    result: (
      <>
        Not built. The tokens are ready for{' '}
        <span className="vs-mono">figma-forge.mjs</span>; nothing has been
        exported, so nothing is claimed.
      </>
    ),
    status: 'not built',
  },
  {
    check: 'Browser QA',
    result:
      '1440 and 390 checked for horizontal overflow. No automated sweep runs in CI.',
    status: 'partial',
  },
]

export default function VesperPage() {
  return (
    <div className="vs-scope" data-vesper="day">
      <a className="vs-skip" href="#premise">
        Skip to the idea
      </a>

      <div className="vs-nav">
        <a className="vs-brand" href="#field">
          <Mark />
          <b>Vesper</b>
        </a>
        <nav>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <NightToggle />
        <a className="vs-go" href="#ledger" aria-label="Audit">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
          >
            <path d="M2 10 L10 2 M4 2 h6 v6" />
          </svg>
        </a>
      </div>

      <header className="vs-field" id="field">
        {}
        <img
          src={`${BRAND}/field/stipple.png`}
          alt="A cobalt field of cream stipple rays converging on a silhouetted lamppost, with a crescent moon at upper right."
        />
        <div className="vs-stamp">
          <div className="vs-wrap">
            <span className="vs-mono">Vesper · two inks · 2026</span>
            <span className="vs-mono">Cobalt #1b3fa2 / stock #e6cfa8</span>
          </div>
        </div>
      </header>

      <section className="vs-opening">
        <div className="vs-wrap">
          <div className="vs-bench">
            {STATS.map((s) => (
              <div key={s.label}>
                <b>{s.figure}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <h1>
            Two inks.
            <br />
            One <em>horizon</em>.
          </h1>
          <p className="vs-lede">
            Vesper is a design system for things used after dark — on-call
            consoles, ledgers, documentation nobody reads at noon. It prints in{' '}
            <b>cobalt and cream</b>, puts a star on the horizon, and refuses
            every glow the last five years taught us to add.
          </p>
          <div className="vs-cta">
            <a className="vs-btn" href="#premise">
              <span className="vs-t">Read the idea</span>
              <span className="vs-a">
                <Arrow />
              </span>
            </a>
            <a className="vs-btn vs-ghost" href="#sheet">
              <span className="vs-t">Copy the tokens</span>
              <span className="vs-a">
                <Arrow />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="premise">
        <div className="vs-wrap">
          <Rail n="01" label="Premise" />
          <div className="vs-body">
            <h2>
              A design system is a horizon, not a <em>spotlight</em>.
            </h2>
            <p className="vs-big">
              A spotlight lights one thing and blinds you to the rest. A horizon
              tells you where the ground ends, from anywhere on it — and it is
              the only line in the artwork that never moves. Vesper is built
              from that line: one bar, one star resting on it, two inks, and
              nothing that glows.
            </p>

            <div className="vs-two">
              {PREMISE.map((p) => (
                <div key={p.term}>
                  <h4>{p.term}</h4>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>

            <div className="vs-decs">
              {DECISIONS.map((d) => (
                <article className="vs-dec" key={d.decision}>
                  <h3>{d.decision}</h3>
                  <dl>
                    <dt>Because</dt>
                    <dd>{d.because}</dd>
                    <dt>Not when</dt>
                    <dd>{d.notWhen}</dd>
                    <dt>Breaks next</dt>
                    <dd>{d.breaks}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="star">
        <div className="vs-wrap">
          <Rail n="02" label="The mark" />
          <div className="vs-body">
            <h2>
              The star came down and <em>stayed</em>.
            </h2>
            <p className="vs-big">
              Eleven concepts were drawn across two rounds on one grid. The
              first six all lost for the same reason: they stood on a plinth,
              and a head on a plinth is a trophy. Round two dropped the plinth
              and replaced it with the horizon. The winner is a star 46 units
              wide and 40 tall, whose lower point lands exactly on a 44 × 4 bar.
            </p>

            <div className="vs-logo-grid">
              <div className="vs-lg">
                <span className="vs-tag">Primary</span>
                <Mark />
              </div>
              <div className="vs-lg vs-night">
                <span className="vs-tag">Reverse</span>
                <Mark />
              </div>
              <div className="vs-lg vs-small">
                <span className="vs-tag">Compact · 16–24px</span>
                <MarkCompact />
              </div>
              <div className="vs-lg vs-small">
                <span className="vs-tag">Glyph</span>
                <Glyph />
              </div>
            </div>

            <div className="vs-lock">
              <div className="vs-lockrow">
                <Lockup />
                <span className="vs-meta">
                  Lockup
                  <br />
                  horizontal · 215 × 64
                </span>
              </div>
              <div className="vs-lockrow vs-night">
                <Lockup />
                <span className="vs-meta">
                  Lockup reverse
                  <br />
                  cream on cobalt
                </span>
              </div>
              <div className="vs-lockrow">
                <LockupStacked />
                <span className="vs-meta">
                  Stacked
                  <br />
                  133 × 99
                </span>
              </div>
            </div>

            <div className="vs-sizes">
              {[
                { px: 96, mark: <Mark />, label: '96' },
                { px: 48, mark: <Mark />, label: '48' },
                { px: 32, mark: <Mark />, label: '32' },
                { px: 24, mark: <MarkCompact />, label: '24 compact' },
                { px: 16, mark: <MarkCompact />, label: '16 compact' },
                { px: 16, mark: <Glyph />, label: '16 glyph' },
              ].map((s) => (
                <div className="vs-s" key={s.label}>
                  <span
                    style={{
                      width: s.px,
                      height: s.px,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {s.mark}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="vs-rules">
              <div>
                <b>Clear space</b>
                <p>
                  One horizon-bar height on all four sides — 4 units at the 64
                  grid. The bar is the unit; nothing else measures the mark.
                </p>
              </div>
              <div>
                <b>Never</b>
                <p>
                  No gradient fill, no drop shadow, no outline, no rotation, no{' '}
                  <span className="vs-mono">filter: invert()</span> on the
                  reverse file. The star is printed, not rendered.
                </p>
              </div>
              <div>
                <b>Below 24px</b>
                <p>
                  Use the compact — a different drawing, not a scale: fatter
                  arms and a 5-unit bar so the silhouette survives 16px.
                </p>
              </div>
            </div>

            <div className="vs-bakeoff">
              <h3>
                Eleven concepts, <em>scored</em>.
              </h3>
              <p className="vs-intro">
                {BAKE_OFF.intro}{' '}
                <b>
                  {shipped?.name} ranks {rank} of {scores.length}
                </b>{' '}
                — {BAKE_OFF.after} <em>{BAKE_OFF.afterEm}</em>.
              </p>
              <table className="vs-audit vs-scores">
                <thead>
                  <tr>
                    <th>Concept</th>
                    <th>What it loses</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s) => (
                    <tr
                      key={s.id}
                      className={
                        s.id === 'horizon-star' ? 'vs-ship' : undefined
                      }
                    >
                      <td>
                        {s.name}
                        {s.id === 'horizon-star' ? (
                          <>
                            {' '}
                            <span className="vs-flag">shipped</span>
                          </>
                        ) : null}
                      </td>
                      <td>
                        {s.failed.length
                          ? s.failed.join(' · ')
                          : 'nothing — clean at 128, 40 and 16'}
                      </td>
                      <td className="vs-val">{s.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="vs-bakenote">
                <span className="vs-mono">
                  node vesper/scripts/score-bakeoff.mjs
                </span>{' '}
                · {BAKE_OFF.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="ink">
        <div className="vs-wrap">
          <Rail n="03" label="Ink" />
          <div className="vs-body">
            <h2>
              Eight primitives. Two jobs each, and <em>three</em> refusals.
            </h2>
            <p className="vs-big">
              Every ratio below is recomputed from the hex values by{' '}
              <span className="vs-mono">build-tokens.mjs</span>, not typed. The
              three pairs that fail are printed with the job they may therefore
              not do — a palette that only publishes its passes is a brochure.
            </p>

            <div className="vs-swatches">
              {tokens.primitives.map((p) => (
                <div className="vs-swatch" key={p.name}>
                  <span className="vs-chip" style={{ background: p.value }} />
                  <div className="vs-nm">{p.name}</div>
                  <div className="vs-hex">{p.value}</div>
                  <div className="vs-rl">{p.role}</div>
                </div>
              ))}
            </div>

            <div className="vs-pairs">
              {tokens.contrast.map((c) => (
                <div
                  className={['vs-pair', c.pass ? '' : 'vs-fail']
                    .filter(Boolean)
                    .join(' ')}
                  key={c.label}
                >
                  <span
                    className="vs-sw"
                    style={{
                      background: c.fg,
                      boxShadow: 'inset 0 0 0 1px rgb(13 21 38 / .12)',
                    }}
                  />
                  <span
                    className="vs-sw"
                    style={{
                      background: c.bg,
                      boxShadow: 'inset 0 0 0 1px rgb(13 21 38 / .12)',
                    }}
                  />
                  <span className="vs-pl">{c.label}</span>
                  <span className="vs-rt vs-mono">{c.ratio.toFixed(2)}</span>
                  <span className="vs-jb vs-mono">{c.job}</span>
                </div>
              ))}
            </div>
            <div className="vs-pairs-note">
              <span>{tokens.contrast.length} pairs · computed from hex</span>
              <span>
                {tokens.meta.failingPairs} fail · assigned a job, not nudged
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="surfaces">
        <div className="vs-wrap">
          <Rail n="04" label="Surfaces" />
          <div className="vs-body">
            <h2>
              Six surfaces were tried. <em>Four</em> survived.
            </h2>
            <p className="vs-big">
              The artwork is a two-ink print, so every surface here has to
              survive being printed. Glass was tried first and rejected: a 14px
              blur turns 60,000 stipple marks into a smudge, and the stipple is
              the argument. The rejected two stay on the page so nobody
              re-proposes them in six months.
            </p>
            <div className="vs-surf">
              {SURFACES.map((s) => (
                <article
                  className={['vs-sc', s.rejected ? 'vs-rej' : '']
                    .filter(Boolean)
                    .join(' ')}
                  key={s.id}
                >
                  <div className="vs-demo">
                    {s.id === 'stipple' && (
                      <img
                        className="vs-demo-img"
                        src={`${BRAND}/field/stipple.png`}
                        alt="A cobalt field with cream stipple rays converging on a silhouetted lamppost under a crescent moon."
                      />
                    )}
                    {s.id === 'dither' && (
                      <div className="vs-demo-dither">
                        {}
                        <img
                          src={`${BRAND}/field/dither.png`}
                          alt="An ordered dither band transitioning from cobalt to cream."
                        />
                      </div>
                    )}
                    {s.id === 'ghost' && (
                      <div className="vs-demo-ghost">
                        <span>Vesper</span>
                        <span className="vs-ghost">Vesper</span>
                      </div>
                    )}
                    {s.id === 'glass' && (
                      <div className="vs-demo-glass">
                        {}
                        <img src={`${BRAND}/field/stipple.png`} alt="" />
                        <div className="vs-pane">
                          <b>Blur destroys the stipple.</b>
                          <span>14px backdrop-filter</span>
                        </div>
                      </div>
                    )}
                    {s.id === 'ledger' && (
                      <div className="vs-demo-ledger">
                        {tokens.primitives.slice(0, 4).map((p) => (
                          <div key={p.name}>
                            <span className="vs-mono">--vs-{p.name}</span>
                            <span className="vs-mono vs-val">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.id === 'tear' && (
                      <div className="vs-demo-tear">
                        <span>Torn, not cut</span>
                      </div>
                    )}
                  </div>
                  <div className="vs-txt">
                    <div className="vs-vt">
                      <b>{s.title}</b>
                      <span>{s.verdict}</span>
                    </div>
                    <p>{s.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="voice">
        <div className="vs-wrap">
          <Rail n="05" label="Type" />
          <div className="vs-body">
            <h2>
              Fraunces for the statement, Archivo for the <em>work</em>.
            </h2>
            <p className="vs-big">
              The display face is a soft old-style with an optical size axis,
              set at 300 and optically large: it looks like a book jacket from
              1962 that was reprinted last year. Archivo carries every interface
              string, and DM Mono carries every number a developer will copy.
            </p>

            <div style={{ marginTop: 36 }}>
              {tokens.type.map((t) => {
                const voice =
                  t.value === 'Fraunces'
                    ? 'display'
                    : t.value === 'Archivo'
                      ? 'reading'
                      : 'mono'
                const sample =
                  t.name === 'label'
                    ? 'HORIZON'
                    : t.name === 'mono'
                      ? '--vs-cobalt: #1b3fa2'
                      : t.name === 'figure'
                        ? '1,842'
                        : 'Evening'
                return (
                  <div className="vs-tscale" key={t.name}>
                    <div className="vs-tmeta vs-mono">
                      <b>{t.name}</b>
                      <span>
                        {t.value} · {t.weight} · {t.size}/{t.leading} ·{' '}
                        {t.tracking}em
                      </span>
                    </div>
                    <div
                      className="vs-tsample"
                      style={{
                        fontFamily: `var(--vs-font-${voice})`,
                        fontWeight: t.weight,
                        fontSize: `min(${t.size}px, 13vw)`,
                        lineHeight: t.leading,
                        letterSpacing: `${t.tracking}em`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {sample}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="vs-specimens">
              <div className="vs-spec">
                <h4>Display · 66 / 0.98 / −0.03em</h4>
                <p className="vs-display">
                  {SPECIMENS.display.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < SPECIMENS.display.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
              <div className="vs-spec">
                <h4>Reading · 18 / 1.62 / 66ch</h4>
                {SPECIMENS.reading.map((p) => (
                  <p className="vs-read" key={p.slice(0, 24)}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div
              className="vs-specimens"
              style={{ marginTop: 44, gridTemplateColumns: '.9fr 1.1fr' }}
            >
              <div className="vs-spec">
                <h4>Figures · tabular, right-aligned, never on a rule</h4>
                <table className="vs-figs">
                  <caption>Contrast, computed</caption>
                  <tbody>
                    {FIGURES.map((f) => (
                      <tr key={f.pair}>
                        <td>{f.pair}</td>
                        <td>{f.ratio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="vs-spec">
                <h4>Labels · 11.5 / 0.16em / uppercase</h4>
                <p
                  className="vs-read"
                  style={{ fontSize: 15.5, color: 'var(--vs-text-secondary)' }}
                >
                  Every label sits{' '}
                  <b style={{ color: 'var(--vs-text-primary)' }}>above</b> the
                  thing it names, never beside it. The tracking is 0.16em
                  because at 11.5px a 0.08em label reads as a mistake in a
                  screenshot, and this system gets screenshotted into decks all
                  day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="kit">
        <div className="vs-wrap">
          <Rail n="06" label="The kit" />
          <div className="vs-body">
            <h2>
              Controls that look pressed, not <em>rendered</em>.
            </h2>
            <p className="vs-big">
              Square plates, one pill, a 2px ring that is never removed, and an
              error state that appears twice — once in the summary, once on the
              field — because a single red border is a rumour, not an error.
            </p>

            <div className="vs-kit">
              <div className="vs-kc">
                <h4>Buttons</h4>
                <div className="vs-krow">
                  <a className="vs-btn" href="#kit">
                    <span className="vs-t">Request a demo</span>
                    <span className="vs-a">
                      <Arrow />
                    </span>
                  </a>
                  <a className="vs-btn vs-ghost" href="#kit">
                    <span className="vs-t">Watch it in action</span>
                    <span className="vs-a">
                      <Arrow />
                    </span>
                  </a>
                </div>
                <div className="vs-krow" style={{ marginTop: 14 }}>
                  <a className="vs-btn vs-small" href="#kit">
                    <span className="vs-t">Small</span>
                  </a>
                  <button
                    className="vs-btn vs-small vs-ghost"
                    disabled
                    style={{ opacity: 0.42, cursor: 'not-allowed' }}
                  >
                    <span className="vs-t">Disabled</span>
                  </button>
                </div>
              </div>

              <div className="vs-kc">
                <h4>Chips &amp; tags</h4>
                <div className="vs-krow">
                  <span className="vs-chip">
                    <i />
                    Two inks
                  </span>
                  <span className="vs-chip">
                    <i />
                    64 grid
                  </span>
                  <span className="vs-chip">
                    <i />0 gradients
                  </span>
                </div>
                <div className="vs-krow" style={{ marginTop: 12 }}>
                  <span
                    className="vs-chip"
                    style={{
                      borderStyle: 'dashed',
                      color: 'var(--vs-text-secondary)',
                    }}
                  >
                    <i style={{ background: 'var(--vs-text-secondary)' }} />
                    Unreleased
                  </span>
                  <span
                    className="vs-chip"
                    style={{
                      background: 'var(--vs-cobalt)',
                      color: 'var(--vs-chalk)',
                      borderColor: 'var(--vs-cobalt)',
                    }}
                  >
                    <i style={{ background: 'var(--vs-chalk)' }} />
                    Shipped
                  </span>
                </div>
              </div>

              <div className="vs-kc">
                <h4>Fields</h4>
                <div className="vs-errsum" role="alert">
                  <b>2 things need attention</b>
                  <ul>
                    <li>
                      <a href="#kit">Ink token</a> is not a hex value.
                    </li>
                    <li>
                      <a href="#kit">Horizon bar</a> must be 4 units.
                    </li>
                  </ul>
                </div>
                <div className="vs-fieldrow">
                  <label htmlFor="vesper-f1">Ink token</label>
                  <input
                    className="vs-inp"
                    id="vesper-f1"
                    defaultValue="cobalt"
                    aria-invalid="true"
                    aria-describedby="vesper-f1h"
                  />
                  <span className="vs-hint" id="vesper-f1h">
                    Use a primitive: chalk, stock, cobalt, night, lampblack.
                  </span>
                </div>
                <div className="vs-fieldrow" style={{ marginBottom: 0 }}>
                  <label htmlFor="vesper-f2">Bar weight</label>
                  <input className="vs-inp" id="vesper-f2" defaultValue="4" />
                </div>
              </div>

              <div className="vs-kc">
                <h4>Rows</h4>
                {KIT_ROWS.map((r) => (
                  <div className="vs-trow" key={r.label}>
                    <span>{r.label}</span>
                    <span className="vs-v">{r.value}</span>
                    <span className="vs-s">{r.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="vs-dither-divider" aria-hidden="true">
        {}
        <img src={`${BRAND}/field/dither.png`} alt="" />
      </div>

      <section className="vs-castband" id="cast">
        <div className="vs-wrap">
          <Rail n="07" label="The cast" />
          <div className="vs-body">
            <h2>Six companions, one cut line.</h2>
            <p>
              Companion marks are not logos. They are the vocabulary the
              identity speaks with when a page needs a picture and a photograph
              would be too heavy: a crescent, the lamp itself, the horizon,
              someone already out there, the light before the object, and the
              stipple as a unit. Every one is fill-only on the same 64 grid.
            </p>
            <div className="vs-castgrid">
              {CAST.map((c) => {
                const Component = CAST_MARKS[c.id]
                return (
                  <div className="vs-castcell" key={c.id}>
                    <Component />
                    <b>{c.name}</b>
                    <span>{c.use}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="sheet">
        <div className="vs-wrap">
          <Rail n="08" label="Tokens" />
          <div className="vs-body">
            <h2>
              One source. Three layers. <em>Two</em> scopes.
            </h2>
            <p className="vs-big">
              The primitives never change under the night scope — only the
              semantic layer moves, which is why a theme flip cannot drift the
              palette. Copy either block; both are generated from the same{' '}
              <span className="vs-mono">tokens.json</span>.
            </p>

            <div className="vs-sheet">
              <div className="vs-codeblk">
                <CopyButton target="vesper-prim" />
                <h4>Primitive</h4>
                <pre id="vesper-prim">
                  {tokens.primitives
                    .map((p) => `--vs-${p.name}: ${p.value};`)
                    .join('\n')}
                </pre>
              </div>
              <div className="vs-codeblk">
                <CopyButton target="vesper-sem" />
                <h4>Semantic · day</h4>
                <pre id="vesper-sem">
                  {tokens.semantic.light
                    .map((s) => `--vs-${s.name}: ${s.value};`)
                    .join('\n')}
                </pre>
              </div>
              <div className="vs-codeblk">
                <CopyButton target="vesper-night" />
                <h4>Semantic · night</h4>
                <pre id="vesper-night">
                  {tokens.semantic.night
                    .map((s) => `--vs-${s.name}: ${s.value};`)
                    .join('\n')}
                </pre>
              </div>
              <div className="vs-codeblk">
                <CopyButton target="vesper-typo" />
                <h4>Type</h4>
                <pre id="vesper-typo">
                  {tokens.type
                    .map(
                      (t) =>
                        `--vs-${t.name}: ${t.weight} ${t.size}px/${t.leading} '${t.value}';`,
                    )
                    .join('\n')}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-sec" id="ledger">
        <div className="vs-wrap">
          <Rail n="09" label="Ledger" />
          <div className="vs-body">
            <h2>
              What is proved, and what <em>is not</em>.
            </h2>
            <p className="vs-big">
              A guide that hides its gaps is a brochure. Everything below was
              run against the files in the design-system repo; the command is
              named so it can be re-run, and the failures are printed rather
              than rounded away.
            </p>

            <table className="vs-audit">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Result</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {LEDGER.map((row) => (
                  <tr key={row.check}>
                    <td>{row.check}</td>
                    <td>{row.result}</td>
                    <td className={row.status === 'pass' ? 'vs-ok' : 'vs-no'}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="vs-gaps">
              {GAPS.map((g) => (
                <div key={g.title}>
                  <h4>{g.title}</h4>
                  <p>{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="vs-wrap">
          <div className="vs-sig">
            <Mark />
            <b>Vesper</b>
          </div>
          <div className="vs-col">
            <b>Type</b>
            Fraunces (SIL OFL 1.1) · Archivo (SIL OFL 1.1) · DM Mono (SIL OFL
            1.1). The wordmark is outlined from Fraunces at wght 400 / opsz 144
            / SOFT 30 — never live text.
          </div>
          <div className="vs-col">
            <b>Artwork</b>
            Drawn from three surreal vintage prints supplied as the brief. The
            field is generated by <span className="vs-mono">field.mjs</span> at
            1600 × 900 from a fixed seed, not traced.
          </div>
          <div className="vs-col">
            <b>Built</b>
            {tokens.meta.version} · {tokens.contrast.length} contrast pairs ·{' '}
            {tokens.primitives.length} primitives · 26 brand files
            <br />
            <a href="/brand/vesper/vesper-figma.html" style={{ textDecoration: 'underline' }}>
              Figma HTML sheet ↗
            </a>{' '}
            · <span className="vs-mono">node vesper/scripts/build-page.mjs</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
