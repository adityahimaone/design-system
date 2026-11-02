import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  AUDIT_ROWS,
  CAMPAIGN,
  DECISIONS,
  FAILURES,
  GAPS,
  HERO_FIELD,
  MARK_RULES,
  MARK_SPECS,
  META,
  MOTION_SCALE,
  OUTPUT_CONTRACT,
  PHOTOS,
  PRINCIPLES,
  RADIUS_SCALE,
  RAMPS,
  SEMANTIC,
  SECTION_ACCENTS,
  type SectionAccentKey,
  SHADOW_SCALE,
  SPACE_SCALE,
  SHIP_CONDITIONS,
  STATS,
  STAT_ACCENTS,
  STORY_BEATS,
  TOKENS_CSS,
  TOKENS_JSON,
  TYPE_SCALE,
  VOICE,
} from '@/features/jakarta/jakarta-data'
import { Applications } from '@/features/jakarta/components/applications'
import {
  JakartaGlyph,
  JakartaLockup,
  JakartaMark,
  JakartaMarkCompact,
} from '@/features/jakarta/components/brand'
import { CopyButton } from '@/features/jakarta/components/copy'
import { JakartaThemeToggle } from '@/features/jakarta/components/theme-toggle'
import styles from '@/features/jakarta/jakarta.module.css'

export const metadata: Metadata = {
  title: 'Jakarta — Case 11 | Design System',
  description:
    'Jakarta’s 499th year, under the line Bergerak Menuju Era Baru Jakarta: one stroke that turns a corner, nine district ramps named after Jakarta places, and an audit that publishes the six pairs that fail.',
  alternates: {
    canonical: '/design-system/jakarta',
    types: { 'text/markdown': '/design-system/jakarta/llms.txt' },
  },
  openGraph: {
    title: 'Jakarta — Case 11 | Design System',
    description:
      'A city of junctions, not a city of monuments. Nine district ramps, one stroke, and the six contrast pairs that are published rather than fixed.',
    type: 'website',
    url: '/design-system/jakarta',
    images: [
      {
        url: '/brand/jakarta/jakarta-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Jakarta brand board: the junction mark, nine district ramps, the outlined wordmark and the night scope.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jakarta — Case 11 | Design System',
    description: 'A city of junctions, not a city of monuments.',
    images: ['/brand/jakarta/jakarta-brandkit.png'],
  },
}

const NAV = [
  ['idea', 'Idea'],
  ['mark', 'Mark'],
  ['palette', 'Palette'],
  ['type', 'Type'],
  ['apps', 'Applications'],
  ['tokens', 'Tokens'],
  ['audit', 'Audit'],
] as const

const jsonSample = JSON.stringify(TOKENS_JSON, null, 2)

/* The ten colours as one sweep, built from the same list the band uses, so the
   field and the band can never disagree about what the palette is. */
const FIELD_SWEEP = `linear-gradient(112deg, ${HERO_FIELD.map(
  (stop, index) =>
    `${stop.hex} ${((index / (HERO_FIELD.length - 1)) * 100).toFixed(1)}%`,
).join(', ')})`

/* The hero field is the same ten colours with hard stops: ten equal bands of
   flat district colour instead of a blended gradient. A gradient is a mood; a
   band is a map you can name out loud — which is the palette's own argument. */
const FIELD_BANDS = `linear-gradient(112deg, ${HERO_FIELD.map((stop, index) => {
  const from = (index / HERO_FIELD.length) * 100
  const to = ((index + 1) / HERO_FIELD.length) * 100
  return `${stop.hex} ${from.toFixed(2)}% ${to.toFixed(2)}%`
}).join(', ')})`

/* The field's colours by token, for the one place they are spent as a section
   accent rather than as the field itself. */
const FIELD_HEX = Object.fromEntries(
  HERO_FIELD.map((stop) => [stop.token, stop.hex]),
) as Record<string, string>

/* A section spends its district colour as decoration. The values come from
   SECTION_ACCENTS, where each chip ink is a printed contrast pair. */
function accentStyle(key: SectionAccentKey): CSSProperties {
  const accent = SECTION_ACCENTS[key]
  return {
    '--jk-sec': accent.hex,
    '--jk-sec-ink': accent.ink,
  } as CSSProperties
}

export default function JakartaCasePage() {
  return (
    <div className={`${styles.root} jk-scope`}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <header className={styles.topbar}>
        <div className={`${styles.shell} ${styles.topbarInner}`}>
          <Link className={styles.brand} href={META.href}>
            <JakartaMark size={24} decorative />
            <span className={styles.brandName}>jakarta</span>
          </Link>

          <nav className={styles.topnav} aria-label="Sections">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <Link href="/design-system">Case library ↗</Link>
          </nav>

          <div className={styles.tools}>
            <JakartaThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">
        {/* ── hero ─────────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroMedia} aria-hidden>
            <div
              className={styles.heroField}
              style={{ backgroundImage: FIELD_BANDS }}
            />
            <Image
              className={styles.heroDay}
              src="/brand/jakarta/photos/semanggi.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 70vw"
            />
            <Image
              className={styles.heroNight}
              src="/brand/jakarta/photos/nightline.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 70vw"
            />
            <div className={styles.heroGrain} />
            <div className={styles.heroScrim} />
          </div>

          {/* The mark at hoarding scale: the stroke that turns the corner is the
              page's own architecture, not a logo placed in a corner. It is a
              decorative second impression, so it carries no label and no ink of
              its own — it is the field, one step lighter. */}
          <JakartaMark size={760} decorative className={styles.heroMark} />

          <div className={styles.shell}>
            <div className={styles.heroInner}>
              {/* Minimal, in the field's tone: a tinted plate that lets the
                  bands through, one type colour, no cap and no offset. The
                  field is the colour; the plate is only what the words need
                  to stay legible. */}
              <div className={styles.heroPanel}>
                <p className={styles.heroEyebrow}>{CAMPAIGN.eyebrow}</p>
                <h1 id="hero-title" className={styles.heroTitle}>
                  <span>{CAMPAIGN.headline[0]}</span>
                  <span>{CAMPAIGN.headline[1]}</span>
                </h1>

                <div className={styles.heroPanelFoot}>
                  <p className={styles.heroSub}>{CAMPAIGN.sub}</p>
                  <div className={styles.heroActions}>
                    <a className={styles.heroCta} href="#apps">
                      Empat penerapan
                      <span aria-hidden>↓</span>
                    </a>
                    <a className={styles.heroLink} href="#palette">
                      Sepuluh warna
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The field is torn off, not stopped. The photograph dissolves as
              the field reaches the floor, so the last stretch of hero is flat
              palette — then the hero's own bottom edge is cut with an irregular
              tooth line and the page's paper shows through. One surface, one
              edge: there is nothing under the field to line up with. */}
          <div className={styles.heroFloor} aria-hidden />
        </section>

        <div className={styles.shell}>
          <dl className={styles.stats}>
            {STATS.map((stat, index) => {
              const accent = STAT_ACCENTS[index % STAT_ACCENTS.length]
              return (
                <div
                  key={stat.label}
                  className={styles.stat}
                  style={{ '--jk-sec': FIELD_HEX[accent] } as CSSProperties}
                  data-accent={accent}
                >
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>

        {/* ── 01 idea ──────────────────────────────────────────────────── */}
        <section
          id="idea"
          className={styles.sec}
          style={accentStyle('idea')}
          aria-labelledby="idea-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>01</span> Idea
              </p>
              <span className={styles.secMeta}>Story · voice · principles</span>
              <h2 id="idea-title" className={styles.secTitle}>
                The junction is the
                <br />
                unit of the identity.
              </h2>
            </div>

            <div className={styles.beats}>
              {STORY_BEATS.map((beat) => (
                <article key={beat.kicker} className={styles.beat}>
                  <p className={styles.beatKicker}>{beat.kicker}</p>
                  <h3>{beat.title}</h3>
                  <p>{beat.body}</p>
                </article>
              ))}
            </div>

            <div className={styles.split}>
              <div>
                <p className={styles.blockLabel}>
                  Four values, each with a veto
                </p>
                <div className={styles.principles}>
                  {PRINCIPLES.map((principle) => (
                    <div key={principle.name} className={styles.principle}>
                      <h4>
                        {principle.name}
                        <span>{principle.gloss}</span>
                      </h4>
                      <p>{principle.line}</p>
                      <p className={styles.veto}>
                        <b>Forbids</b> {principle.forbids}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className={styles.blockLabel}>
                  Voice — four registers, one accent
                </p>
                <div className={styles.voice}>
                  {VOICE.map((row) => (
                    <div key={row.register} className={styles.voiceRow}>
                      <div className={styles.voiceName}>
                        <b>{row.register}</b>
                        <span>{row.sounds}</span>
                      </div>
                      <p className={styles.voiceSay}>{row.sample}</p>
                      <p className={styles.voiceNot}>{row.not}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 mark ──────────────────────────────────────────────────── */}
        <section
          id="mark"
          className={`${styles.sec} ${styles.secInk}`}
          style={accentStyle('mark')}
          aria-labelledby="mark-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>02</span> Mark
              </p>
              <span className={styles.secMeta}>
                Geometry · clear space · minimums
              </span>
              <h2 id="mark-title" className={styles.secTitle}>
                One stroke, one turn,
                <br />
                one stop.
              </h2>
            </div>

            <div className={styles.specimens}>
              <figure className={styles.specimen} data-ground="paper">
                <JakartaMark size={168} decorative />
                <figcaption>
                  <b>Primary</b>
                  <span>paper · 650 × 576</span>
                </figcaption>
              </figure>
              <figure className={styles.specimen} data-ground="senja">
                <JakartaMark size={168} decorative />
                <figcaption>
                  <b>Primary, reverse</b>
                  <span>senja · graphics only</span>
                </figcaption>
              </figure>
              <figure className={styles.specimen} data-ground="ink">
                <JakartaMark size={168} decorative />
                <figcaption>
                  <b>Primary, reverse</b>
                  <span>ink · 14,8:1</span>
                </figcaption>
              </figure>
            </div>

            <div className={styles.sizes}>
              <div>
                <p className={styles.blockLabel}>
                  Minimums, on the real grounds
                </p>
                <div className={styles.sizeRow}>
                  {[48, 32, 24].map((size) => (
                    <span key={size} className={styles.sizeCell}>
                      <JakartaMark size={size} decorative />
                      <i>{size}</i>
                    </span>
                  ))}
                  <span className={styles.sizeCell} data-divider="true" />
                  {[24, 16].map((size) => (
                    <span key={`c${size}`} className={styles.sizeCell}>
                      <JakartaMarkCompact size={size} />
                      <i>{size}</i>
                    </span>
                  ))}
                  <span className={styles.sizeCell} data-divider="true" />
                  {[32, 16].map((size) => (
                    <span key={`g${size}`} className={styles.sizeCell}>
                      <JakartaGlyph size={size} />
                      <i>{size}</i>
                    </span>
                  ))}
                </div>
                <p className={styles.sizeNote}>
                  Primary to 24px, compact from 24px down, glyph at 16px. The
                  glyph is the only one-contour drawing in the family, which is
                  why it is the one that survives a favicon.
                </p>
              </div>

              <div>
                <p className={styles.blockLabel}>Lockup</p>
                <div className={styles.lockupPlate}>
                  <JakartaLockup height={44} />
                </div>
                <p className={styles.sizeNote}>
                  Cap height is 0,72 of the mark’s height, the gap is 1,6S, and
                  both drawings are composed — never a scaled screenshot of each
                  other.
                </p>
              </div>
            </div>

            <div className={styles.specTable}>
              {MARK_SPECS.map((spec) => (
                <div key={spec.name} className={styles.specRow}>
                  <div>
                    <h4>{spec.name}</h4>
                    <p>{spec.drawing}</p>
                    <p className={styles.specMin}>
                      <b>Minimum</b> {spec.min}
                    </p>
                    <p className={styles.specUse}>{spec.use}</p>
                  </div>
                  <dl>
                    {spec.measures.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                    <div>
                      <dt>ViewBox</dt>
                      <dd>{spec.viewBox}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <div className={styles.rules}>
              <p className={styles.blockLabel}>Eight ways to break it</p>
              <ol>
                {MARK_RULES.map((rule, index) => (
                  <li key={rule.rule}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <b>{rule.rule}</b>
                      <p>{rule.why}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── 03 palette ───────────────────────────────────────────────── */}
        <section
          id="palette"
          className={styles.sec}
          style={accentStyle('palette')}
          aria-labelledby="palette-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>03</span> Palette
              </p>
              <span className={styles.secMeta}>
                Nine ramps · four steps · both scopes
              </span>
              <h2 id="palette-title" className={styles.secTitle}>
                Nine districts,
                <br />
                one sheet.
              </h2>
            </div>

            <p className={styles.prose}>
              Nine ramps, four steps each, named after the places they were
              taken from. Primitives are places; semantics are jobs. The
              right-hand column is not an opinion — it is the computed ratio of
              that colour as text on paper, which is what decides whether it may
              ever be a word.
            </p>

            <div className={styles.ramps}>
              {RAMPS.map((ramp) => (
                <div key={ramp.key} className={styles.ramp}>
                  <div className={styles.rampName}>
                    <b>{ramp.name}</b>
                    <span>{ramp.place}</span>
                    <em>{ramp.job}</em>
                  </div>
                  <div className={styles.rampSteps}>
                    {ramp.hex.map((hex, step) => (
                      <div key={hex} className={styles.step}>
                        <span
                          className={styles.stepChip}
                          style={{ background: hex }}
                          aria-hidden
                        />
                        <span className={styles.stepHex}>
                          {step === 0
                            ? '100'
                            : step === 1
                              ? '200'
                              : step === 2
                                ? '300'
                                : '400'}
                        </span>
                        <code>{hex}</code>
                      </div>
                    ))}
                  </div>
                  <div
                    className={styles.rampVerdict}
                    data-verdict={ramp.verdict}
                  >
                    <b>{ramp.onPaper.toFixed(2).replace('.', ',')}:1</b>
                    <span>
                      {ramp.verdict === 'body'
                        ? 'body text'
                        : ramp.verdict === 'large'
                          ? 'large only'
                          : 'ground only'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.split}>
              <div>
                <p className={styles.blockLabel}>
                  The semantic layer — light and night
                </p>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Light</th>
                        <th>Night</th>
                        <th>Job</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SEMANTIC.map((row) => (
                        <tr key={row.token}>
                          <td>
                            <code>--jk-{row.token}</code>
                          </td>
                          <td>{row.light}</td>
                          <td>{row.night}</td>
                          <td className={styles.cellMuted}>{row.job}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className={styles.blockLabel}>
                  Six pairs that fail, published
                </p>
                <div className={styles.failures}>
                  {FAILURES.map((row) => (
                    <div key={row.pair} className={styles.failure}>
                      <div>
                        <b>{row.pair}</b>
                        <span>{row.ratio}</span>
                      </div>
                      <p>{row.therefore}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.callout}>
                  <p>
                    <b>This is the load-bearing finding.</b> Six of nine
                    district colours cannot set small type on paper, and two
                    cannot set type at all. The palette is the client’s and it
                    is not going to change, so the rule is what makes it usable:
                    a district colour is a ground, a mark, a field or a stripe —
                    never a word.
                  </p>
                  <p>
                    The corollary decided the button. White on Senja is 3,56:1
                    and fails; ink on Senja is 4,56:1 and passes. The primary
                    button is dark-on-orange. That is a measurement, not a taste
                    — and it happens to look like a sign, which is the right
                    answer for a city.
                  </p>
                  <p>
                    <b>A seventh failure is not a district colour.</b>{' '}
                    <code>text-faint</code> on paper measures 4,09:1, below the
                    4,5:1 body threshold. Every tertiary label on this page is
                    therefore set in <code>text-muted</code> at 6,29:1, and the
                    faint role is kept for 24px and up. An audit that only named
                    the district colours would have missed it.
                  </p>
                  <div className={styles.buttonRow}>
                    <span className={styles.btnPrimary}>Lapor warga</span>
                    <span className={styles.btnQuiet}>Lihat rute</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 type ──────────────────────────────────────────────────── */}
        <section
          id="type"
          className={styles.sec}
          style={accentStyle('type')}
          aria-labelledby="type-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>04</span> Type
              </p>
              <span className={styles.secMeta}>One family · eleven roles</span>
              <h2 id="type-title" className={styles.secTitle}>
                Weight does the work,
                <br />
                not a second face.
              </h2>
            </div>

            <div className={styles.typeSpec}>
              <p className={styles.typeBig}>Kota Kolaborasi</p>
              <p className={styles.typeMid}>
                Satu kota, sembilan distrik, satu kisi.
              </p>
              <p className={styles.typeBody}>
                Plus Jakarta Sans is a Jakarta typeface drawn by Tokotype. It
                was already the right answer before the palette was: a grotesque
                with open apertures, a tall x-height and a single-storey ‘a’
                that holds at 11px on a sign and at 104px on a wall. One family,
                three voices — display at 800, reading at 400, labels at 600
                with 0,16em tracking.
              </p>
              <div className={styles.numerals} aria-label="Numerals in use">
                <span>1A</span>
                <span>Rp 3.500</span>
                <span>07:42</span>
                <span>2026</span>
              </div>
            </div>

            <p className={styles.blockLabel}>
              Eleven roles, each set at its own size
            </p>

            <div className={styles.typeScale}>
              {TYPE_SCALE.map((row) => (
                <div key={row.role} className={styles.typeRow}>
                  <div className={styles.typeMeta}>
                    <code>text-{row.role}</code>
                    <span>
                      {row.size}px · {row.leading} · {row.tracking} ·{' '}
                      {row.weight}
                    </span>
                    <em>{row.use}</em>
                  </div>
                  <p
                    className={styles.typeSample}
                    style={
                      {
                        '--s': row.size.replace(',', '.'),
                        '--lh': row.leading.replace(',', '.'),
                        '--ls': row.tracking
                          .replace('−', '-')
                          .replace(',', '.'),
                        '--w': row.weight,
                        textTransform:
                          row.role === 'caption' ? 'uppercase' : undefined,
                      } as CSSProperties
                    }
                  >
                    Jakarta
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.foundations}>
              <div className={styles.foundation}>
                <p className={styles.blockLabel}>Radius — five steps</p>
                <div className={styles.radiusRow}>
                  {RADIUS_SCALE.map((item) => (
                    <div key={item.step} className={styles.radiusItem}>
                      <span style={{ borderRadius: item.value }} aria-hidden />
                      <b>radius-{item.step}</b>
                      <code>{item.value}</code>
                      <em>{item.note}</em>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.foundation}>
                <p className={styles.blockLabel}>Shadow — three elevations</p>
                <div className={styles.shadowRow}>
                  {SHADOW_SCALE.map((item) => (
                    <div key={item.step} className={styles.shadowItem}>
                      <span
                        style={{ boxShadow: `var(--jk-shadow-${item.step})` }}
                        aria-hidden
                      />
                      <b>shadow-{item.step}</b>
                      <em>
                        {item.note} · {item.use}
                      </em>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.foundations}>
              <div className={styles.foundation}>
                <p className={styles.blockLabel}>
                  Space — twelve steps, half scale
                </p>
                <div className={styles.spaceRows}>
                  {SPACE_SCALE.map((item) => (
                    <div key={item.step} className={styles.spaceRow}>
                      <span>{item.step}</span>
                      <span
                        className={styles.spaceBar}
                        style={{
                          width: `${Math.max(1.5, item.value / 1.76)}%`,
                        }}
                        aria-hidden
                      />
                      <code>{item.value}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.foundation}>
                <p className={styles.blockLabel}>
                  Motion — three durations, one curve
                </p>
                <div className={styles.motionRows}>
                  {MOTION_SCALE.map((item) => (
                    <div
                      key={item.step}
                      className={styles.motionRow}
                      style={{ '--dur': `${item.ms}ms` } as CSSProperties}
                    >
                      <span className={styles.motionTrack} aria-hidden>
                        <i />
                      </span>
                      <b>{item.step}</b>
                      <code>{item.ms}ms</code>
                      <em>{item.use}</em>
                    </div>
                  ))}
                  <p className={styles.motionEase}>
                    <code>cubic-bezier(.2,.7,.1,1)</code> — hover a row to run
                    it
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 applications ──────────────────────────────────────────── */}
        <section
          id="apps"
          className={`${styles.sec} ${styles.secApps}`}
          style={accentStyle('apps')}
          aria-labelledby="apps-title"
        >
          <div className={styles.sectionRule} aria-hidden>
            {HERO_FIELD.map((stop) => (
              <i key={stop.token} style={{ background: stop.hex }} />
            ))}
          </div>

          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>05</span> Applications
              </p>
              <span className={styles.secMeta}>
                Screen · card · panel · livery
              </span>
              <h2 id="apps-title" className={styles.secTitle}>
                On the screen,
                <br />
                on the street,
                <br />
                in the pocket.
              </h2>
            </div>

            <Applications />
          </div>
        </section>

        {/* ── 07 tokens ────────────────────────────────────────────────── */}
        <section
          id="tokens"
          className={styles.sec}
          style={accentStyle('tokens')}
          aria-labelledby="tokens-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>06</span> Tokens
              </p>
              <span className={styles.secMeta}>
                46 primitives · 21 roles · 11 type roles
              </span>
              <h2 id="tokens-title" className={styles.secTitle}>
                Three layers,
                <br />
                one source.
              </h2>
            </div>

            <div className={styles.split}>
              <div>
                <div className={styles.codeHead}>
                  <span>tokens.css</span>
                  <CopyButton text={TOKENS_CSS} label="Copy CSS" />
                </div>
                <pre className={styles.code}>
                  <code>{TOKENS_CSS}</code>
                </pre>
              </div>

              <div>
                <div className={styles.codeHead}>
                  <span>tokens.json</span>
                  <CopyButton text={jsonSample} label="Copy JSON" />
                </div>
                <pre className={styles.code}>
                  <code>{jsonSample}</code>
                </pre>

                <p className={styles.blockLabel} data-tight="true">
                  What the folder contains
                </p>
                <ul className={styles.contract}>
                  {OUTPUT_CONTRACT.map(([file, what]) => (
                    <li key={file}>
                      <code>{file}</code>
                      <span>{what}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.decisions}>
              <p className={styles.blockLabel}>
                Six decisions and what each one costs
              </p>
              <div className={styles.decisionGrid}>
                {DECISIONS.map((decision) => (
                  <article key={decision.title} className={styles.decision}>
                    <h4>{decision.title}</h4>
                    <p>
                      <b>Because</b> {decision.because}
                    </p>
                    <p>
                      <b>Not when</b> {decision.notWhen}
                    </p>
                    <p>
                      <b>Breaks next</b> {decision.breaksNext}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 audit ─────────────────────────────────────────────────── */}
        <section
          id="audit"
          className={styles.sec}
          style={accentStyle('audit')}
          aria-labelledby="audit-title"
        >
          <div className={styles.shell}>
            <div className={styles.secHead}>
              <p className={styles.secNum}>
                <span>07</span> Audit
              </p>
              <span className={styles.secMeta}>
                Seventeen checks · three partial · two open
              </span>
              <h2 id="audit-title" className={styles.secTitle}>
                What is proved,
                <br />
                and what is not.
              </h2>
            </div>

            <p className={styles.prose}>
              Seventeen checks. Each one is a command or a measurement, not an
              opinion. Five are not clean — three partial and two open — and one
              of the partials is the reason the palette works at all.
            </p>

            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.audit}`}>
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Result</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_ROWS.map((row) => (
                    <tr key={row.check}>
                      <td className={styles.auditCheck}>{row.check}</td>
                      <td>
                        <span
                          className={styles.res}
                          data-res={row.result.toLowerCase()}
                        >
                          {row.result}
                        </span>
                      </td>
                      <td className={styles.cellMuted}>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.split}>
              <div>
                <p className={styles.blockLabel}>
                  Named gaps — what this system does not have
                </p>
                <ul className={styles.gapList}>
                  {GAPS.map((gap) => (
                    <li key={gap}>{gap}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className={styles.blockLabel}>
                  What would have to be true to ship
                </p>
                <ol className={styles.shipList}>
                  {SHIP_CONDITIONS.map((item) => (
                    <li key={item.n}>
                      <span>{item.n}</span>
                      <div>
                        <b>{item.title}</b>
                        <p>{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={styles.shipEnd}>
                  If those three pass, the system is real. Until then it is a
                  very well-argued proposal, which is what a design system is
                  before it meets a bus shelter.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.foot}>
        {/* The photography lives here now: one plate under the colophon, at the
            bottom of the page, which is where the brief said a monument belongs —
            "Monas, used small, never as the whole identity". It is Monas, it is
            small, and it is the last thing on the page. */}
        <Image
          className={styles.footPlate}
          src={PHOTOS[1].src}
          alt=""
          fill
          sizes="100vw"
          aria-hidden
        />
        <div
          className={styles.footField}
          style={{ backgroundImage: FIELD_SWEEP }}
          aria-hidden
        />
        <div className={styles.footVeil} aria-hidden />

        <div className={styles.shell}>
          <div className={styles.footGrid}>
            <div>
              <JakartaLockup height={34} />
              <p className={styles.footClaim}>
                Jakarta — Kota Kolaborasi. A city identity and design system for
                the Special Capital Region of Jakarta, built for its 499th year
                under the line <em>Bergerak Menuju Era Baru Jakarta</em>.
              </p>
            </div>

            <div>
              <h4>Files</h4>
              <ul>
                <li>
                  <a href="/brand/jakarta/mark.svg">mark.svg</a>
                </li>
                <li>
                  <a href="/brand/jakarta/mark-compact.svg">mark-compact.svg</a>
                </li>
                <li>
                  <a href="/brand/jakarta/glyph.svg">glyph.svg</a>
                </li>
                <li>
                  <a href="/brand/jakarta/wordmark.svg">wordmark.svg</a>
                </li>
                <li>
                  <a href="/brand/jakarta/lockup.svg">lockup.svg</a>
                </li>
                <li>
                  <a href="/brand/jakarta/jakarta-brandkit.png">brand board</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Colophon</h4>
              <ul className={styles.colophon}>
                <li>
                  Type: Plus Jakarta Sans, variable, SIL Open Font License 1.1
                </li>
                <li>Palette: nine district ramps, Jakarta Color Scheme</li>
                <li>Photography: Unsplash contributors, per file</li>
                <li>Mark: redrawn from the supplied bitmap at 0,989 IoU</li>
              </ul>
            </div>
          </div>

          <div className={styles.footMark} aria-hidden>
            <JakartaMark size={40} decorative />
          </div>

          <div className={styles.footBase}>
            <span>Jakarta · Kota Kolaborasi · v1.0</span>
            <Link href="/design-system">← All cases</Link>
            <span>Built with tokens, not artwork</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
