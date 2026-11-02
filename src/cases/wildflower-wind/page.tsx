import type { Metadata } from 'next'
import Link from 'next/link'

import {
  DECISIONS,
  DEFS,
  GAPS,
  MARK_FILES,
  META,
  NAV,
  NOT_VERIFIED,
  PAIRS,
  PLACEMENT,
  PRIMITIVES,
  PROVED,
  STATS,
  TYPE,
  labelOn,
} from '@/features/wildflower-wind/wildflower-wind-data'
import styles from '@/features/wildflower-wind/wildflower-wind.module.css'

const MARK_BASE = '/brand/wildflower-wind'

export const metadata: Metadata = {
  title: 'Wildflower Wind — Case 13 | Design System',
  description:
    'A seed house under glass: five translucent petals that multiply where they cross, a haze ground, panes with one lit edge, and a violet that is the cosmos refracted. Fifteen contrast pairs recomputed from hex, two published as failing.',
  alternates: { canonical: '/design-system/wildflower-wind' },
  openGraph: {
    title: 'Wildflower Wind — Case 13 | Design System',
    description: 'A meadow, seen through a pane of glass.',
    images: [{ url: META.board, width: 1500, height: 1125, alt: META.boardAlt }],
  },
}

export default function WildflowerWindPage() {
  return (
    <div className={`${styles.root} wi-scope`}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <div className={styles.backdrop} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={META.backdrop} alt="" />
      </div>

      <header className={styles.topbar}>
        <Link className={styles.brand} href={META.href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${MARK_BASE}/mark-compact.svg`} alt="" width={26} height={26} />
          <span className={styles.brandName}>Wildflower Wind</span>
        </Link>
        <nav className={styles.topnav} aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <Link href="/design-system">Case library ↗</Link>
        </nav>
      </header>

      <main className={styles.shell} id="main">
        {/* ── hero ─────────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroTop}>
            <span className={styles.chip}>
              <i />
              Case {META.number} · Seed house · 2026
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.heroMark} src={`${MARK_BASE}/mark.svg`} alt="" width={116} height={116} />
          </div>

          <h1 className={styles.title} id="hero-title">
            Wildflower <em>Wind</em>
          </h1>
          <p className={styles.lede}>{META.intro}</p>

          <div className={styles.heroFoot}>
            {STATS.map((s) => (
              <span key={s.k}>
                {s.k} · {s.v}
              </span>
            ))}
          </div>
        </section>

        {/* ── premise ──────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="premise" aria-labelledby="premise-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>01</span>
            <span className={styles.sectionLabel}>Premise</span>
          </div>
          <h2 className={styles.h2} id="premise-title">
            Nothing here sits on top of anything.
          </h2>

          <div className={styles.grid2}>
            <div className={styles.prose}>
              <p>
                A pane of glass does not hide what is behind it, and it does not leave it alone either. It
                bends it, softens it, and catches one edge of light. That is the whole interface: a meadow
                that stays visible, and surfaces you read through rather than on.
              </p>
              <p>
                The mark is built the same way. Five translucent petals are laid down, and where two cross
                they multiply — so the flower has no outline and no ink of its own. It has a dark crossing
                and a lit rim, and the fifth petal is the one the wind already took.
              </p>
            </div>

            <dl className={styles.defs}>
              {DEFS.map((d) => (
                <div key={d.k}>
                  <dt>{d.k}</dt>
                  <dd>{d.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.cards}>
            {DECISIONS.map((d) => (
              <article className={styles.card} key={d.n}>
                <span className={styles.cardNum}>{d.n}</span>
                <h3>{d.title}</h3>
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
        </section>

        {/* ── calyx ────────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="calyx" aria-labelledby="calyx-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>02</span>
            <span className={styles.sectionLabel}>Calyx</span>
          </div>
          <h2 className={styles.h2} id="calyx-title">
            Five petals. One gone.
          </h2>
          <p className={styles.prose}>
            A petal is narrow at the base, widest at 72% of its length, rounded at the tip, and bent by
            8–16% of that length. Four hold the calyx at 74°, 72° and 80°; the fifth sits 134° away, small,
            further out, in the gap the wind opened. It is the only place the accent is allowed in the mark.
          </p>

          <div className={styles.markRow} style={{ marginTop: 30 }}>
            {MARK_FILES.map((m) => (
              <div
                className={`${styles.markTile} ${'dark' in m && m.dark ? styles.markTileDark : ''}`}
                key={m.file}
              >
                <span className={styles.k}>
                  {m.label} · {m.note}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${MARK_BASE}/${m.file}`} alt={`${m.label} mark`} width={m.size} height={m.size} />
              </div>
            ))}
          </div>

          <table className={styles.table}>
            <caption>The placement table — every file in the family is this, re-struck.</caption>
            <thead>
              <tr>
                <th>Petal</th>
                <th>Angle</th>
                <th>Base r</th>
                <th>Length</th>
                <th>Width</th>
                <th>Bend</th>
                <th>Fill</th>
              </tr>
            </thead>
            <tbody>
              {PLACEMENT.map((p) => (
                <tr key={p.n}>
                  <td>{p.n}</td>
                  <td>{p.a}</td>
                  <td>{p.r}</td>
                  <td>{p.l}</td>
                  <td>{p.w}</td>
                  <td>{p.b}</td>
                  <td>{p.ink}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── light ────────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="light" aria-labelledby="light-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>03</span>
            <span className={styles.sectionLabel}>Light</span>
          </div>
          <h2 className={styles.h2} id="light-title">
            Nine values, and one of them is the light.
          </h2>
          <p className={styles.prose}>
            The haze is the air the page sits in, the pane is what you read through, and the ink is the
            darkest thing the glass resolves to. The violet is the cosmos seen through the pane — refraction
            is why it is not pink. Gold and sky are light, never words: on this ground they cannot reach
            4.5:1, and pretending otherwise is how a palette becomes a brochure.
          </p>

          <div className={styles.sw}>
            {PRIMITIVES.map((p) => (
              <div className={styles.swi} key={p.name}>
                <div className={styles.chipSwatch} style={{ background: p.light }}>
                  <span style={{ color: labelOn(p.name) }}>{p.name}</span>
                </div>
                <div className={styles.meta}>
                  <b>{p.role.split('.')[0]}</b>
                  <code>{p.hex}</code>
                  <p>{p.role.split('.').slice(1).join('.').trim() || '—'}</p>
                </div>
              </div>
            ))}
          </div>

          <table className={styles.pairTable}>
            <thead>
              <tr>
                <th>Pair</th>
                <th style={{ textAlign: 'right' }}>Ratio</th>
                <th>Allowed job</th>
                <th style={{ textAlign: 'right' }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map((c) => (
                <tr key={c.label + c.fg} className={c.pass ? undefined : styles.fail}>
                  <td>
                    <span className={styles.dot} style={{ background: c.fg }} />
                    {c.label}
                  </td>
                  <td className={styles.num}>{c.ratio.toFixed(2)}:1</td>
                  <td className={styles.job}>{c.job || 'text'}</td>
                  <td className={`${styles.verdict} ${c.pass ? '' : styles.verdictFail}`}>
                    {c.pass ? 'Pass' : 'Fails'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── setting ──────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="setting" aria-labelledby="setting-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>04</span>
            <span className={styles.sectionLabel}>Setting</span>
          </div>
          <h2 className={styles.h2} id="setting-title">
            A field guide, held up to the light.
          </h2>

          <div className={styles.spec}>
            <div className={styles.capLine}>
              <span>display-1 · Instrument Serif 400 · 108px · lh 0.92 · ls −0.035em</span>
              <span>real size</span>
            </div>
            <div className={styles.specDisplay}>Wildflower</div>
          </div>

          <div className={styles.spec}>
            <div className={styles.capLine}>
              <span>body-1 · Instrument Sans 400 · 18px · lh 1.62 · 64ch</span>
              <span>reading</span>
            </div>
            <p className={styles.specRead}>
              The seed is the smallest thing a plant makes and the largest thing it promises. We pack them
              in April, from a field that is left alone from June, and we write the harvest on the tin in
              pencil because the weather always has the last word. Nothing in this catalogue is a guarantee.
              Everything in it is an invitation to a summer you have not had yet.
            </p>
          </div>

          <div className={styles.scale}>
            {TYPE.map((t) => (
              <div className={styles.scaleRow} key={t.name}>
                <span className={styles.scaleName}>{t.name}</span>
                <span
                  className={styles.scaleSample}
                  style={{
                    fontFamily:
                      t.face === 'Instrument Serif'
                        ? 'var(--wi-font-display)'
                        : t.face === 'IBM Plex Mono'
                          ? 'var(--wi-font-mono)'
                          : 'var(--wi-font-reading)',
                    fontSize: `var(--wi-${t.name}-s)`,
                    lineHeight: `var(--wi-${t.name}-lh)`,
                    letterSpacing: `var(--wi-${t.name}-ls)`,
                    fontWeight: `var(--wi-${t.name}-w)`,
                    textTransform: t.name === 'label' ? 'uppercase' : 'none',
                  }}
                >
                  {t.name === 'mono'
                    ? '--wi-signal: #8f2a90;'
                    : t.name === 'label'
                      ? 'Seed house · est. 2026'
                      : 'Wildflower Wind'}
                </span>
                <span className={styles.scaleSpec}>
                  {t.size} · {t.leading} · {t.tracking} · {t.weight}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── season ───────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="season" aria-labelledby="season-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>05</span>
            <span className={styles.sectionLabel}>Season</span>
          </div>
          <h2 className={styles.h2} id="season-title">
            What it looks like in the post.
          </h2>

          <div className={styles.bento}>
            <div className={styles.tin}>
              <div className={styles.tinTop}>
                <span>No. 04</span>
                <span>2.4 g</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${MARK_BASE}/mark-reverse.svg`} alt="" width={88} height={88} />
              <div className={styles.tinName}>
                Cosmos
                <br />
                <em>‘Purity’</em>
              </div>
            </div>

            <div className={styles.cardApp}>
              <div className="qt">“Sow thin, in May, where the wind already goes.”</div>
              <div className={styles.ft}>
                <span>Field note 04</span>
                <span>41°N</span>
              </div>
            </div>

            <div className={styles.tag}>
              <span style={{ fontFamily: 'var(--wi-font-mono)', fontSize: 9.5, letterSpacing: '0.12em' }}>
                RESERVED
              </span>
              <div className={styles.big}>
                Harvest
                <br />
                2026
              </div>
            </div>

            <div className={styles.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${MARK_BASE}/photos/field-left.webp`} alt="The meadow at first light" />
              <div className={styles.ov}>
                <span>Plate 01 · first light · 06:10</span>
                <span>Documented, never recoloured</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── ledger ───────────────────────────────────────────────────── */}
        <section className={`${styles.pane} ${styles.section}`} id="ledger" aria-labelledby="ledger-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>06</span>
            <span className={styles.sectionLabel}>Ledger</span>
          </div>
          <h2 className={styles.h2} id="ledger-title">
            What is proved, and what is not.
          </h2>

          <div className={styles.ledger}>
            <div className={`${styles.ledgerCol} ${styles.ledgerOk}`}>
              <h4>
                <i />
                Proved
              </h4>
              <ul>
                {PROVED.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.ledgerCol} ${styles.ledgerGap}`}>
              <h4>
                <i />
                Not verified
              </h4>
              <ul>
                {NOT_VERIFIED.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.ledgerCol} ${styles.ledgerFail}`}>
              <h4>
                <i />
                Known gaps
              </h4>
              <ul>
                {GAPS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── closing ──────────────────────────────────────────────────── */}
        <section className={styles.closing} aria-label="The meadow at dusk">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.plate} src={`${MARK_BASE}/photos/field-center.webp`} alt="The meadow at last light" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.wm} src={`${MARK_BASE}/wordmark-reverse.svg`} alt="Wildflower Wind" height={64} />
          <span className={styles.cap}>Plate 03 · last light · 19:35</span>
        </section>

        {/* ── footer ───────────────────────────────────────────────────── */}
        <footer className={`${styles.pane} ${styles.footer}`}>
          <div>
            <h4>The case</h4>
            <p>
              {META.essence} Nine values, fifteen contrast pairs recomputed from hex, two published as
              failing, and a mark whose ink is the place two petals cross.
            </p>
          </div>
          <div>
            <h4>Files</h4>
            <div className={styles.footerLinks}>
              <a href={META.specimen}>The full specimen ↗</a>
              <a href={META.audit}>The audit ↗</a>
              <a href={META.design}>DESIGN.md ↗</a>
            </div>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <div className={styles.footerLinks}>
              <Link href="/design-system">← Case library</Link>
              <a href="/brand/wildflower-wind/wildflower-wind-brandkit.png">The board ↗</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
