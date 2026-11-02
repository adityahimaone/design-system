import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {
  BwLockup,
  BwMark,
  BwStacked,
  BwWordmark,
} from '@/features/bluewater/components/brand'
import { BwRampToggle } from '@/features/bluewater/components/theme-toggle'
import {
  AUDIT,
  BEATS,
  CHARTER,
  CHART,
  CHART_AXIS,
  CONTRAST,
  DECISIONS,
  DETACH,
  ESSENCE,
  FIELD_RULES,
  GAPS,
  HERO_STATS,
  MANIFEST_ROWS,
  MARK_RULES,
  MARK_SPECS,
  MATERIAL_RULES,
  META,
  NAV,
  PALETTE_DARK,
  PALETTE_LIGHT,
  PARTS,
  TYPE_LADDER,
  TYPE_RULES,
  TYPE_SAMPLES,
  VOYAGE,
} from '@/features/bluewater/bluewater-data'
import styles from '@/features/bluewater/bluewater.module.css'

export const metadata: Metadata = {
  title: 'Bluewater Freight — Case 12 | Design System',
  description:
    'Bluewater Freight is a passage system for maritime operators: a near-black sea, one silver wake that marks only what is moving, 1px chart rules and mono tabular numbers.',
  alternates: {
    canonical: '/design-system/bluewater',
    types: { 'text/markdown': '/design-system/bluewater/llms.txt' },
  },
  openGraph: {
    title: 'Bluewater Freight — Case 12 | Design System',
    description:
      'The wake is the only bright thing. A fullwidth crossing, a hull-and-waterline mark in two drawings, one rationed accent, and an audit that names its own gaps.',
  },
}

/* ── the chart ──────────────────────────────────────────────────────────────
   Drawn from the data, not a screenshot: 14 days of distance made good. The
   grid is 1px at 7% ink; the route is the only signal on the plate. */

const CHART_W = 640
const CHART_H = 180
const CHART_PAD = { l: 8, r: 8, t: 14, b: 18 }
const CHART_MIN = 200
const CHART_MAX = 460

const chartX = (i: number) =>
  CHART_PAD.l + (i * (CHART_W - CHART_PAD.l - CHART_PAD.r)) / (CHART.length - 1)
const chartY = (v: number) =>
  CHART_H -
  CHART_PAD.b -
  ((v - CHART_MIN) / (CHART_MAX - CHART_MIN)) *
    (CHART_H - CHART_PAD.t - CHART_PAD.b)

const chartPath = CHART.map(
  (v, i) =>
    `${i === 0 ? 'M' : 'L'}${chartX(i).toFixed(1)} ${chartY(v).toFixed(1)}`,
).join(' ')
const chartGrid = [CHART_MIN, 265, 330, 395, CHART_MAX]

export default function BluewaterPage() {
  return (
    <main className={styles.page} id="top">
      <a className={styles.skip} href="#charter">
        Skip to the charter
      </a>

      <header className={styles.topbar}>
        <Link
          href="/design-system"
          aria-label="Back to the design-system library"
        >
          <BwLockup height={22} />
        </Link>
        <nav className={styles.navLinks} aria-label="Sections">
          {NAV.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
        <BwRampToggle />
      </header>

      {/* ── crossing · the fullwidth hero ───────────────────────────────── */}
      <section
        className={styles.crossing}
        id="crossing"
        aria-labelledby="crossing-title"
      >
        <div className={styles.crossingMedia}>
          <Image
            src="/brand/bluewater/crossing.webp"
            alt="Open water at last light, a container ship small on the horizon"
            fill
            priority
            loading="eager"
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '50% 62%' }}
          />
        </div>
        <div className={styles.crossingScrim} aria-hidden />

        <div className={styles.crossingBody}>
          <p
            className={styles.eyebrow}
            style={{ color: 'rgb(233 241 248 / 0.7)' }}
          >
            Case 12 · Deep-sea freight
          </p>
          <h1 className={styles.crossingLine} id="crossing-title">
            The wake is the only <em>bright</em> thing.
          </h1>
          <p className={styles.crossingLede}>
            Bluewater Freight moves cargo that cannot be late. One near-black
            sea, one silver wake, and a 1px rule that carries every number a
            customer might read aloud.
          </p>

          <dl className={styles.voyage}>
            {VOYAGE.map((v) => (
              <div key={v.key} className={styles.voyageItem}>
                <dt className={styles.voyageKey}>{v.key}</dt>
                <dd className={styles.voyageValue}>{v.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.crossingStats}>
          {HERO_STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── charter ─────────────────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="charter"
        aria-labelledby="charter-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>01 · Charter</p>
            <h2 className={styles.h2} id="charter-title">
              Read the passage, not the picture.
            </h2>
          </div>

          <div className={styles.charterGrid}>
            <div>
              {CHARTER.map((p) => (
                <p key={p.slice(0, 24)} className={styles.prose}>
                  {p}
                </p>
              ))}
            </div>

            <dl className={styles.essenceList}>
              {ESSENCE.map((e) => (
                <div key={e.key} className={styles.essenceRow}>
                  <dt className={styles.essenceKey}>{e.key}</dt>
                  <dd className={styles.essenceValue}>{e.value}</dd>
                </div>
              ))}
            </dl>

            <figure className={styles.sideFig}>
              <Image
                className={styles.sideFigImg}
                src="/brand/bluewater/side-charter.webp"
                alt="A container ship low on the horizon at last light"
                width={880}
                height={1100}
                sizes="(max-width: 900px) 90vw, 17rem"
              />
              <figcaption className={styles.sideFigCap}>
                Plate 01 · the vessel is the smallest thing in the frame
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── grain · the photographs ─────────────────────────────────────── */}
      <section
        className={styles.section}
        id="grain"
        aria-labelledby="grain-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>02 · Grain</p>
            <h2 className={styles.h2} id="grain-title">
              Three photographs, one ground.
            </h2>
            <p className={styles.lede}>
              A horizon, a hull, a wake. Each is keyed into the same near-black
              so the seam between photograph and page does not exist. Nothing
              here is decoration: every image is a thing the brand actually
              operates.
            </p>
          </div>

          <div className={styles.grainGrid}>
            <div className={styles.grainWide}>
              <figure className={styles.figure}>
                <Image
                  src="/brand/bluewater/wake.webp"
                  alt="A ship's hull cutting a white wake through dark water"
                  width={1672}
                  height={941}
                  sizes="(max-width: 760px) 100vw, 60vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <figcaption>Wake · the only bright thing</figcaption>
              </figure>
            </div>
            <figure className={styles.figure}>
              <Image
                src="/brand/bluewater/horizon.webp"
                alt="A wide seascape under broken cloud, distant mountains on the left"
                width={1916}
                height={821}
                sizes="(max-width: 760px) 100vw, 36vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <figcaption>Horizon · quiet, 16:7</figcaption>
            </figure>
            <figure className={styles.figure}>
              <Image
                src="/brand/bluewater/hero.webp"
                alt="Last light over open water with a container ship on the horizon"
                width={1672}
                height={941}
                sizes="(max-width: 760px) 100vw, 36vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <figcaption>Crossing · hero plate</figcaption>
            </figure>
          </div>

          <h3 className={styles.subhead}>Field recipe</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <tbody>
                {FIELD_RULES.map((r) => (
                  <tr key={r.key}>
                    <th scope="row" style={{ width: '10rem' }}>
                      {r.key}
                    </th>
                    <td className={styles.mono}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── keel · the mark ─────────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="keel"
        aria-labelledby="keel-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>03 · Keel</p>
            <h2 className={styles.h2} id="keel-title">
              A waterline, a hull, and one passage.
            </h2>
            <p className={styles.lede}>
              The rule is the horizon. The hollow shape under it is the vessel.
              The notch in the rule is the only place the wake is allowed inside
              the mark — 6 units wide, cut down into the hull, so the water is
              visibly disturbed rather than simply drawn.
            </p>
          </div>

          <div className={styles.markGrid}>
            {MARK_SPECS.map((m) => (
              <div key={m.size} className={styles.markTile}>
                {m.size === '140px' ? (
                  <BwMark size={140} />
                ) : m.size === '48px' ? (
                  <BwMark size={48} />
                ) : m.size === '24px' ? (
                  <BwMark size={24} />
                ) : (
                  <BwMark size={16} />
                )}
                <span className={styles.markTileCaption}>{m.size}</span>
                <span className={styles.markTileNote}>{m.note}</span>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Lockups</h3>
          <div className={styles.markGrid}>
            <div className={styles.markTile}>
              <BwLockup height={30} />
              <span className={styles.markTileCaption}>
                Horizontal · 415.76 × 64
              </span>
            </div>
            <div className={styles.markTile}>
              <BwStacked height={78} />
              <span className={styles.markTileCaption}>
                Stacked · 337.76 × 106
              </span>
            </div>
            <div className={styles.markTile}>
              <BwWordmark height={22} />
              <span className={styles.markTileCaption}>
                Wordmark · Archivo 620, outlined
              </span>
            </div>
          </div>

          <div className={styles.withSide}>
            <div className={styles.ruleList}>
              {MARK_RULES.map((r) => (
                <div key={r.rule} className={styles.rule}>
                  <h4 className={styles.ruleTitle}>{r.rule}</h4>
                  <p className={styles.ruleBody}>{r.detail}</p>
                </div>
              ))}
            </div>

            <figure className={styles.sideFig}>
              <Image
                className={styles.sideFigImg}
                src="/brand/bluewater/side-keel.webp"
                alt="A hull cutting a white wake through dark water"
                width={880}
                height={1100}
                sizes="(max-width: 900px) 90vw, 17rem"
              />
              <figcaption className={styles.sideFigCap}>
                Plate 03 · the wake is the passage, drawn once
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── signal · palette + contrast ─────────────────────────────────── */}
      <section
        className={styles.section}
        id="signal"
        aria-labelledby="signal-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>04 · Signal</p>
            <h2 className={styles.h2} id="signal-title">
              One accent, rationed.
            </h2>
            <p className={styles.lede}>
              Silver wake means movement: a route that is running, a number that
              changed, the action you are about to commit. It never fills a
              large area and it never becomes a second brand colour. In daylight
              it darkens to #17608C, because #8FB6D6 on fog is 1.91:1 —
              measured, published, and prohibited for text rather than quietly
              replaced.
            </p>
          </div>

          <h3 className={styles.subhead}>Deep — the default ramp</h3>
          <div className={styles.paletteGrid}>
            {PALETTE_DARK.map((c) => (
              <div key={c.name} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ background: c.value }}
                  aria-hidden
                />
                <span>
                  <span className={styles.swatchName}>{c.name}</span>
                  <br />
                  <span className={styles.swatchHex}>{c.value}</span>
                  <span className={styles.swatchRole}>{c.role}</span>
                </span>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Fog — the daylight scope</h3>
          <div className={styles.paletteGrid}>
            {PALETTE_LIGHT.map((c) => (
              <div key={c.name} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{ background: c.value }}
                  aria-hidden
                />
                <span>
                  <span className={styles.swatchName}>{c.name}</span>
                  <br />
                  <span className={styles.swatchHex}>{c.value}</span>
                  <span className={styles.swatchRole}>{c.role}</span>
                </span>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Contrast, measured</h3>
          <div className={styles.withSide}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Use</th>
                    <th scope="col" className={styles.num}>
                      Ratio
                    </th>
                    <th scope="col">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST.map((c) => {
                    const fail = c.ratio < 4.5
                    return (
                      <tr key={c.label}>
                        <td>{c.label}</td>
                        <td
                          style={{
                            color: 'var(--bw-text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {c.use}
                        </td>
                        <td className={styles.num}>{c.ratio.toFixed(2)}</td>
                        <td>
                          <span className={fail ? styles.fail : styles.pass}>
                            {fail ? 'Fails' : 'Passes'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <figure className={styles.sideFig}>
              <Image
                className={styles.sideFigImg}
                src="/brand/bluewater/side-signal.webp"
                alt="Open water under a dark, broken sky"
                width={880}
                height={1100}
                sizes="(max-width: 900px) 90vw, 17rem"
              />
              <figcaption className={styles.sideFigCap}>
                Plate 02 · keyed to abyss so the plate has no edge
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── type · the specimen ─────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="type"
        aria-labelledby="type-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>05 · Type</p>
            <h2 className={styles.h2} id="type-title">
              Archivo names, Inter reads, mono counts.
            </h2>
            <p className={styles.lede}>
              Three voices with no overlap: the display face is never used for a
              paragraph, the reading face is never used for a number, and the
              mono face never sets a sentence. Below is each one at the size it
              actually ships, with the measurements beside it.
            </p>
          </div>

          <div className={styles.typeSpec}>
            {TYPE_SAMPLES.map((t) => (
              <div key={t.voice} className={styles.typeRow}>
                <div className={styles.typeRail}>
                  <span className={styles.typeRailKey}>{t.voice}</span>
                  <p className={styles.typeRailFamily}>{t.family}</p>
                  <p className={styles.typeRailVal}>{t.weights}</p>
                  <p className={styles.typeRailVal}>{t.tracking}</p>
                  <p className={styles.typeRailVal}>{t.leading}</p>
                </div>

                <div className={styles.typeStage}>
                  <p
                    className={
                      t.voice === 'Display'
                        ? styles.typeSampleXL
                        : t.voice === 'Mono'
                          ? styles.typeSampleM
                          : styles.typeSampleL
                    }
                  >
                    {t.sample}
                  </p>
                  <p className={styles.typeNote}>{t.para}</p>
                  <p className={styles.typeNote}>{t.floor}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>The ladder</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Token</th>
                  <th scope="col">Value</th>
                  <th scope="col">Where it is allowed</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_LADDER.map((t) => (
                  <tr key={t.name}>
                    <td className={styles.mono}>
                      {t.name.replace('scale-', '')}
                    </td>
                    <td className={styles.mono}>{`--bw-${t.name}`}</td>
                    <td className={styles.mono}>{t.value}</td>
                    <td
                      style={{
                        color: 'var(--bw-text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {t.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.typeFoot}>
            {TYPE_SAMPLES.map((t) => (
              <div key={t.voice} className={styles.typeFootCell}>
                <span className={styles.typeFootKey}>{t.voice} · sizes</span>
                <span className={styles.typeFootVal}>{t.sizes}</span>
                <span className={styles.typeFootKey}>{t.voice} · stack</span>
                <code className={styles.typeFootCode}>{t.stack}</code>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Rules</h3>
          <div className={styles.ruleList}>
            {TYPE_RULES.map((r) => (
              <div key={r.rule} className={styles.rule}>
                <h4 className={styles.ruleTitle}>{r.rule}</h4>
                <p className={styles.ruleBody}>{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── manifest · type and the table it types ──────────────────────── */}
      <section
        className={styles.section}
        id="manifest"
        aria-labelledby="manifest-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>06 · Manifest</p>
            <h2 className={styles.h2} id="manifest-title">
              Archivo for names. Geist for reading. Mono for numbers.
            </h2>
          </div>

          <div className={styles.typeGrid}>
            {TYPE_SAMPLES.map((t) => (
              <div key={t.voice} className={styles.typeCard}>
                <span className={styles.typeVoice}>{t.voice}</span>
                <span
                  className={`${styles.typeSample} ${
                    t.voice === 'Display'
                      ? styles.typeSampleDisplay
                      : t.voice === 'Mono'
                        ? styles.typeSampleMono
                        : ''
                  }`}
                >
                  {t.sample}
                </span>
                <span className={styles.typeMeta}>
                  {t.family} · {t.meta}
                </span>
                <span
                  className={styles.typeMeta}
                  style={{ textTransform: 'none', letterSpacing: 0 }}
                >
                  {t.role}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.manifestTable}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption
                  style={{
                    textAlign: 'left',
                    fontFamily: 'var(--bw-font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--bw-text-secondary)',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--bw-line)',
                  }}
                >
                  Live manifest · the signal marks the row that is moving
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Waybill</th>
                    <th scope="col">Passage</th>
                    <th scope="col" className={styles.num}>
                      TEU
                    </th>
                    <th scope="col">ETA</th>
                    <th scope="col">State</th>
                  </tr>
                </thead>
                <tbody>
                  {MANIFEST_ROWS.map((r) => (
                    <tr key={r.ref}>
                      <td
                        className={`${styles.mono} ${r.state === 'Under way' ? styles.railCell : ''}`}
                      >
                        {r.ref}
                      </td>
                      <td>{r.port}</td>
                      <td className={styles.num}>{r.teu}</td>
                      <td className={styles.num}>{r.eta}</td>
                      <td>
                        <span
                          className={`${styles.state} ${r.state === 'Under way' ? styles.stateLive : ''}`}
                        >
                          {r.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── wake · the parts ────────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="wake"
        aria-labelledby="wake-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>07 · Wake</p>
            <h2 className={styles.h2} id="wake-title">
              Zero radius everywhere loud; 2px only where a finger lands.
            </h2>
          </div>

          <div className={styles.partsGrid}>
            <div className={styles.partList}>
              {PARTS.map((p) => (
                <div key={p.name} className={styles.partItem}>
                  <h3 className={styles.partName}>{p.name}</h3>
                  <p className={styles.partDetail}>{p.detail}</p>
                </div>
              ))}
            </div>

            <div className={styles.kit}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="bw-waybill">
                  Waybill
                </label>
                <input
                  id="bw-waybill"
                  className={styles.input}
                  defaultValue="BW-0412"
                  placeholder="BW-0000"
                  spellCheck={false}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="bw-port">
                  Discharge port
                </label>
                <input
                  id="bw-port"
                  className={styles.input}
                  placeholder="NLRTM"
                  spellCheck={false}
                />
              </div>
              <div className={styles.kitRow}>
                <button type="button" className={styles.btn}>
                  Track passage
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnQuiet}`}
                >
                  Copy waybill
                </button>
              </div>
              <div
                className={styles.kitRow}
                style={{ justifyContent: 'space-between' }}
              >
                <span className={styles.fieldLabel}>Ramp</span>
                <BwRampToggle />
              </div>
            </div>
          </div>

          <h3 className={styles.subhead}>Material rules</h3>
          <div className={styles.ruleList}>
            {MATERIAL_RULES.map((m) => (
              <div key={m.title} className={styles.rule}>
                <h4 className={styles.ruleTitle}>{m.title}</h4>
                <p className={styles.ruleBody}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── chart · motion ──────────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="chart"
        aria-labelledby="chart-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>08 · Chart</p>
            <h2 className={styles.h2} id="chart-title">
              The route draws itself once, then stops.
            </h2>
            <p className={styles.lede}>
              One reveal on first paint, 340ms, one curve out. Nothing in this
              system loops, pulses or shimmers — a vessel is either moving or it
              is not, and a chart that breathes is lying about which.
            </p>
          </div>

          <div className={styles.chartPlate}>
            <div className={styles.chartHead}>
              <div>
                <h3 className={styles.h3}>MV Longview · distance made good</h3>
                <span className={styles.typeMeta}>
                  nautical miles per day · voyage BW-0412
                </span>
              </div>
              <span className={styles.chartLegend}>
                <span className={styles.legendDot} aria-hidden />
                14-day mean 360 nm
              </span>
            </div>

            <svg
              className={styles.chartSvg}
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              role="img"
              aria-label={`Distance made good over 14 days, from ${CHART[0]} to ${CHART[CHART.length - 1]} nautical miles, minimum ${Math.min(...CHART)}, maximum ${Math.max(...CHART)}.`}
            >
              {chartGrid.map((v) => (
                <line
                  key={v}
                  x1={CHART_PAD.l}
                  x2={CHART_W - CHART_PAD.r}
                  y1={chartY(v)}
                  y2={chartY(v)}
                  stroke="var(--bw-grid)"
                  strokeWidth={1}
                />
              ))}
              <line
                x1={CHART_PAD.l}
                x2={CHART_W - CHART_PAD.r}
                y1={chartY(CHART_MIN)}
                y2={chartY(CHART_MIN)}
                stroke="var(--bw-rule)"
                strokeWidth={1}
              />
              <path
                className={styles.route}
                d={chartPath}
                fill="none"
                stroke="var(--bw-accent)"
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {CHART.map((v, i) => (
                <circle
                  key={i}
                  cx={chartX(i)}
                  cy={chartY(v)}
                  r={i === CHART.length - 1 ? 3 : 1.75}
                  fill={
                    i === CHART.length - 1
                      ? 'var(--bw-accent)'
                      : 'var(--bw-surface-plate)'
                  }
                  stroke="var(--bw-accent)"
                  strokeWidth={1.25}
                />
              ))}
            </svg>
            <div className={styles.chartAxis} aria-hidden>
              {CHART_AXIS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── survey · the audit ──────────────────────────────────────────── */}
      <section
        className={styles.section}
        id="survey"
        aria-labelledby="survey-title"
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>09 · Survey</p>
            <h2 className={styles.h2} id="survey-title">
              What was measured, and what this case could not verify.
            </h2>
            <p className={styles.lede}>
              An audit that only lists passes is marketing. The gaps below are
              the honest ones: no commissioned photography, no live feed behind
              the manifest, no print or EDI artefacts, and no physical test of
              the mark.
            </p>
          </div>

          <div className={styles.auditBlock}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Check</th>
                    <th scope="col">Verdict</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT.map((a) => (
                    <tr key={a.item}>
                      <td style={{ width: '16rem' }}>{a.item}</td>
                      <td style={{ width: '6rem' }}>
                        <span className={styles.pass}>{a.verdict}</span>
                      </td>
                      <td
                        style={{
                          color: 'var(--bw-text-secondary)',
                          fontSize: '0.875rem',
                        }}
                      >
                        {a.note}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Detach from every sibling</td>
                    <td>
                      <span className={styles.pass}>{DETACH.score} / 100</span>
                    </td>
                    <td
                      style={{
                        color: 'var(--bw-text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {DETACH.note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className={styles.subhead}>Gaps this case names</h3>
          <ol className={styles.gaps}>
            {GAPS.map((g) => (
              <li key={g.slice(0, 28)}>{g}</li>
            ))}
          </ol>

          <h3 className={styles.subhead}>Decisions</h3>
          <div className={styles.decisions}>
            {DECISIONS.map((d) => (
              <div key={d.took} className={styles.decision}>
                <p className={styles.decisionTook}>{d.took}</p>
                <p className={styles.decisionOver}>over {d.over}</p>
                <p className={styles.decisionWhy}>{d.why}</p>
              </div>
            ))}
          </div>

          <h3 className={styles.subhead}>Beats</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <tbody>
                {BEATS.map((b) => (
                  <tr key={b.id}>
                    <th scope="row" style={{ width: '9rem' }}>
                      {b.title}
                    </th>
                    <td style={{ color: 'var(--bw-text-secondary)' }}>
                      {b.line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <BwStacked height={92} />
            <p className={styles.footerLine}>{META.promise}</p>
          </div>
        </div>

        <div className={styles.footerRailWrap}>
          <div className={`${styles.wrap} ${styles.footerRail}`}>
            {VOYAGE.map((v) => (
              <span key={v.key} className={styles.footerRailCell}>
                <span className={styles.footerRailKey}>{v.key}</span>
                <span className={styles.footerRailVal}>{v.value}</span>
              </span>
            ))}
          </div>
          <div className={`${styles.wrap} ${styles.footerColophon}`}>
            <p className={styles.footerNote}>
              {META.name} · {META.case} · v{META.version} · {META.essence}
            </p>
            <p className={styles.footerNote}>
              Photographs supplied with the brief. Archivo, Inter and Geist Mono
              under the SIL Open Font License.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
