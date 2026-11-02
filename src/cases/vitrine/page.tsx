import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import '@/features/vitrine/vitrine-tokens.css'

import {
  DECISIONS,
  DITHER_AUDIT,
  GAPS,
  MARK_FAMILIES,
  MARK_GATE,
  MOTION,
  NAV,
  OUTPUT_CONTRACT,
  SKILL_RESOURCES,
  STORY_BEATS,
  TYPE_GATE,
  VOICE,
  type MarkPath,
} from '@/features/vitrine/audit'
import { CopyButton } from '@/features/vitrine/components/actions'
import { CaseChrome } from '@/features/vitrine/components/case-chrome'
import {
  VitrineLockup,
  VitrineMark,
  VitrineStacked,
  VitrineWordmark,
} from '@/features/vitrine/components/brand'
import { DitherLens } from '@/features/vitrine/components/dither-lens'
import { FormDemo } from '@/features/vitrine/components/form-demo'
import { ThemeToggle } from '@/features/vitrine/components/theme-toggle'
import tokens from '@/features/vitrine/tokens.json'
import styles from '@/features/vitrine/vitrine.module.css'

export const metadata: Metadata = {
  title: 'Vitrine — Design System',
  description:
    'Vitrine v2.5 is a glass-and-dither design system: a half-light V mark, three token layers, ten form controls and a case study. A glass case for a low-resolution light.',
  alternates: {
    canonical: '/design-system/vitrine',
    types: { 'text/markdown': '/design-system/vitrine/llms.txt' },
  },
  openGraph: {
    title: 'Vitrine — Design System',
    description:
      'A glass case for a low-resolution light. A v2.5 half-light V mark, tokens, form controls and the audit behind them.',
    type: 'website',
    url: '/design-system/vitrine',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Vitrine brand board: the half-light V mark, one glass arm and one Signal arm, Case and Frost palette, Signal field, type and form specimen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitrine — Design System',
    description:
      'Glass is the container. Dither is the label. The form is the proof.',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Vitrine brand board: the half-light V mark, one glass arm and one Signal arm, Case and Frost palette, Signal field, type and form specimen',
      },
    ],
  },
}

type Token = {
  name: string
  value: string
  resolved?: string
  role: string
}

const primitives = tokens.primitives as Token[]
const semanticLight = tokens.semantic.light as Token[]
const semanticDark = tokens.semantic.dark as Token[]
const componentsLight = tokens.components.light as Token[]
const componentsDark = tokens.components.dark as Token[]
const typeTokens = tokens.type as Token[]

const TOKEN_COUNT =
  Object.keys(tokens.theme).length +
  primitives.length +
  semanticLight.length +
  semanticDark.length +
  componentsLight.length +
  componentsDark.length +
  typeTokens.length +
  tokens.space.length +
  tokens.radius.length +
  tokens.motion.length

const SEMANTIC_PREVIEW = [
  'bg',
  'fg',
  'muted',
  'border',
  'surface',
  'accent',
  'focus',
  'danger',
  'glass-fill',
  'dither-ink',
]

const SEMANTIC_TABLE = semanticLight.map((light) => ({
  light,
  dark: semanticDark.find((token) => token.name === light.name),
}))

const COLOUR_MAIN = [
  { name: 'case', ratio: 'Case on Frost' },
  { name: 'frost', ratio: 'Frost on Case' },
  { name: 'signal', ratio: 'Case on Signal' },
  { name: 'iris', ratio: 'Iris on Frost' },
  { name: 'clay', ratio: 'Clay on Frost' },
  { name: 'mint', ratio: 'Mint on Case' },
].map((item) => {
  const token = primitives.find((candidate) => candidate.name === item.name)
  const pair = tokens.contrast.find(
    (candidate) => candidate.label === item.ratio,
  )
  return {
    name: item.name,
    value: token?.value ?? '',
    role: token?.role ?? '',
    ratio: pair?.ratio ?? 0,
    use: pair?.use ?? '',
  }
})

const RESOURCE_SUMMARY = {
  present: SKILL_RESOURCES.filter((resource) => resource.present).length,
  used: SKILL_RESOURCES.filter((resource) => resource.status === 'used').length,
  substituted: SKILL_RESOURCES.filter(
    (resource) => resource.status === 'substituted',
  ).length,
  untouched: SKILL_RESOURCES.filter(
    (resource) => resource.status === 'not used',
  ).length,
}

const CONTRACT_SUMMARY = {
  shipped: OUTPUT_CONTRACT.filter((item) => item.status === 'shipped').length,
  total: OUTPUT_CONTRACT.length,
}

const GATE_SUMMARY = {
  passed: MARK_GATE.filter((check) => check.result === 'pass').length,
  total: MARK_GATE.length,
}

function SectionHead({
  id,
  number,
  label,
  title,
  lead,
}: {
  id: string
  number: string
  label: string
  title: React.ReactNode
  lead: string
}) {
  return (
    <div className={styles.sectionHead}>
      <p className={styles.sectionLabel}>
        <span>{number}</span> {label}
      </p>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {title}
      </h2>
      <p className={styles.sectionLead}>{lead}</p>
    </div>
  )
}

const STATUS_TONE = {
  pass: styles.status_pass,
  note: styles.status_note,
  used: styles.status_used,
  substituted: styles.status_substituted,
  unused: styles.status_unused,
  shipped: styles.status_shipped,
} as const

function StatusPill({
  tone,
  children,
}: {
  tone: keyof typeof STATUS_TONE
  children: React.ReactNode
}) {
  return (
    <span className={`${styles.statusPill} ${STATUS_TONE[tone]}`}>
      {children}
    </span>
  )
}

function InlineMark({
  paths,
  label,
}: {
  paths: readonly MarkPath[]
  label: string
}) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label}>
      {paths.map((path, index) => (
        <path
          key={`${path.d}-${index}`}
          d={path.d}
          fillRule="evenodd"
          fill={path.accent ? 'var(--vt-signal)' : 'currentColor'}
        />
      ))}
    </svg>
  )
}

export default function DesignSystemPage() {
  return (
    <div className={`${styles.page} vt-scope`} id="top">
      <CaseChrome />
      <a href="#collection" className={styles.skipLink}>
        Skip to the system
      </a>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a
            href="#top"
            className={styles.navBrand}
            aria-label="Vitrine, back to top"
          >
            <VitrineLockup priority />
          </a>
          <nav className={styles.navLinks} aria-label="Case contents">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle className={styles.navTheme} />
        </div>
      </header>

      <main id="collection">
        <section
          className={`${styles.hero} ${styles.onCase}`}
          aria-labelledby="hero-title"
        >
          <div className={styles.heroDither} aria-hidden>
            <DitherLens />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden />
                Case 02 / v2.5 design system
              </p>
              <h1 id="hero-title" className={styles.heroTitle}>
                A glass case for a{' '}
                <span className={styles.signalText}>low‑resolution</span> light.
              </h1>
              <p className={styles.heroLead}>
                Vitrine is a design system for depth you can read: one
                half-light V, one glass container, one halftone light, and a
                form kit that refuses to disappear into the blur.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#marks">
                  See the five marks <span aria-hidden>↗</span>
                </a>
                <a className={styles.ghostButton} href="#forms">
                  Try the controls
                </a>
              </div>
              <dl className={styles.heroStats}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + dither</dd>
                </div>
                <div>
                  <dt>Mark</dt>
                  <dd>Half-light V</dd>
                </div>
                <div>
                  <dt>Tokens</dt>
                  <dd>{TOKEN_COUNT}</dd>
                </div>
                <div>
                  <dt>Controls</dt>
                  <dd>10</dd>
                </div>
              </dl>
            </div>

            <aside className={`${styles.heroPlate} ${styles.glassPanel}`}>
              <div className={styles.ditherEdge} aria-hidden />
              <div className={styles.plateHead}>
                <span className={styles.cardLabel}>Case file / v2.5</span>
                <span className={styles.liveTag}>
                  <span aria-hidden /> Live specimen
                </span>
              </div>
              <div className={styles.plateBrand}>
                <VitrineMark size={56} />
                <div>
                  <VitrineWordmark height={26} />
                  <p className={styles.plateSub}>
                    Identity &amp; interface system
                  </p>
                </div>
              </div>
              <dl className={styles.plateSpecs}>
                <div>
                  <dt>Material</dt>
                  <dd>Glass + dither</dd>
                </div>
                <div>
                  <dt>Family</dt>
                  <dd>Architectural monogram</dd>
                </div>
                <div>
                  <dt>Contrast</dt>
                  <dd>17.9:1</dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>2.5 / 2026</dd>
                </div>
              </dl>
              <div className={styles.plateFoot}>
                <span>Case 02</span>
                <a href="/brand/vitrine/vitrine-brandkit.png" download>
                  Board <span aria-hidden>↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.metaStrip} aria-label="Case metadata">
          <span>Identity / Vitrine v2.5</span>
          <span>Mark / Half-light V</span>
          <span>Type / Space Grotesk + Geist</span>
          <span>Status / Shipped</span>
        </div>

        <section
          id="foundation"
          className={styles.section}
          aria-labelledby="foundation-title"
        >
          <SectionHead
            id="foundation"
            number="01"
            label="Foundation"
            title={
              <>
                Depth without
                <br />
                fog.
              </>
            }
            lead="The case holds one object; the clearance is the design. This is the argument the rest of the page has to keep: a container, a label, and a form that stays readable."
          />

          <div className={styles.storyGrid}>
            <div className={styles.storySpine}>
              <p className={styles.cardLabel}>Story spine / seven beats</p>
              <dl className={styles.storyBeats}>
                {STORY_BEATS.map((beat) => (
                  <div key={beat.beat} className={styles.storyBeat}>
                    <dt>{beat.beat}</dt>
                    <dd>{beat.line}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className={styles.storyStatement}>
              <div>
                <p className={styles.cardLabel} style={{ color: '#93a3ac' }}>
                  One sentence
                </p>
                <blockquote>
                  Vitrine keeps <em>depth</em> readable: a half-light V, a glass
                  container, and a light that never sits under the words.
                </blockquote>
              </div>
              <div className={styles.storyStatementFoot}>
                <span>Reject it if a second loud field appears</span>
                <span>2026</span>
              </div>
            </aside>
          </div>

          <div className={styles.decisionHead}>
            <div>
              <p className={styles.cardLabel}>Decision cards</p>
              <h3>Eight rules, each with a failure</h3>
            </div>
            <p className={styles.tableNote}>
              Decision / because / not when / breaks next. The last line is the
              audit backlog.
            </p>
          </div>

          <div className={styles.decisionGrid}>
            {DECISIONS.map((decision) => (
              <article key={decision.title} className={styles.decisionCard}>
                <h4>{decision.title}</h4>
                <dl className={styles.decisionRows}>
                  <div className={styles.decisionRow}>
                    <dt>Decision</dt>
                    <dd>{decision.decision}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Because</dt>
                    <dd>{decision.because}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Not when</dt>
                    <dd>{decision.notWhen}</dd>
                  </div>
                  <div className={styles.decisionRow}>
                    <dt>Breaks next</dt>
                    <dd>{decision.breaksNext}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section
          id="marks"
          className={styles.section}
          aria-labelledby="marks-title"
        >
          <SectionHead
            id="marks"
            number="02"
            label="Marks"
            title={
              <>
                One letter,
                <br />
                two materials.
              </>
            }
            lead="The V is the case in section: one arm is glass, one is the light. Two solid primitives; the compact drops the Signal arm rather than shrinking the split into a speck."
          />

          <div className={styles.marksLayout}>
            <div className={`${styles.markStage} ${styles.onCase}`}>
              <div className={styles.markStageTop}>
                <span className={styles.cardLabel}>Construction / 64 grid</span>
                <span className={styles.stageTag}>v2.5</span>
              </div>
              <div className={styles.markStageCenter}>
                <VitrineMark size={190} />
                <VitrineLockup />
              </div>
              <div className={styles.markStageFoot}>
                <span>Frame / 8 units</span>
                <span>Vertex / 32 / 34</span>
                <span>Plinth / 16 × 22</span>
                <span>Primitives / 2</span>
              </div>
            </div>

            <aside className={styles.markNotes}>
              <p className={styles.cardLabel}>Hard gate / six checks</p>
              <p>
                The family is <strong>architectural monogram</strong>: one V,
                split vertically. The ink arm is the glass, the Signal arm is
                the light. The plinth is flat; the letter is the case in
                section. Remove the Signal arm and the V still stands.
              </p>
              <div className={styles.gateGrid}>
                {MARK_GATE.map((check) => (
                  <div key={check.gate} className={styles.gateCard}>
                    <div className={styles.gateCardHead}>
                      <strong>
                        {check.gate}. {check.title}
                      </strong>
                      <StatusPill tone="pass">Pass</StatusPill>
                    </div>
                    <p>{check.evidence}</p>
                  </div>
                ))}
              </div>
              <div className={styles.applicationNote}>
                <code>score-mark.py</code> returns PASS: no circle, no stroke,
                two primitives in the primary, one in the compact, and a
                silhouette that covers 32% of the grid at 32px.
              </div>
            </aside>
          </div>

          <div className={styles.bakeoffHead}>
            <div>
              <p className={styles.cardLabel}>Five families / one material</p>
              <h3>Why the V won</h3>
            </div>
            <p className={styles.tableNote}>
              All five passed the scorer. The choice is silhouette and meaning,
              not a defect.
            </p>
          </div>

          <div className={styles.bakeoffGrid}>
            {MARK_FAMILIES.map((family) => (
              <article
                key={family.id}
                className={styles.bakeoffCard}
                data-kept={family.verdict === 'kept'}
              >
                <div className={styles.bakeoffTop}>
                  <div className={styles.bakeoffMark}>
                    <InlineMark
                      paths={family.paths}
                      label={`${family.name} mark`}
                    />
                  </div>
                  <span className={styles.bakeoffFamily}>{family.family}</span>
                </div>
                <div>
                  <p className={styles.bakeoffName}>{family.name}</p>
                  <StatusPill
                    tone={family.verdict === 'kept' ? 'pass' : 'unused'}
                  >
                    {family.verdict}
                  </StatusPill>
                </div>
                <p className={styles.bakeoffReason}>{family.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="material"
          className={styles.section}
          aria-labelledby="material-title"
        >
          <SectionHead
            id="material"
            number="03"
            label="Material"
            title={
              <>
                Glass holds.
                <br />
                Dither tells.
              </>
            }
            lead="The panel is a translucent fill with a cut edge, a top specular and a hard 1px shadow. The dither is a dot field beside it, never a gradient pretending to be one."
          />

          <div className={styles.materialGrid}>
            <div className={`${styles.materialStage} ${styles.onCase}`}>
              <div className={styles.stageDither} aria-hidden />
              <div className={styles.stageTop}>
                <span className={styles.cardLabel} style={{ color: '#93a3ac' }}>
                  Material study / 01
                </span>
                <span className={styles.stageTag}>backdrop-filter</span>
              </div>
              <div className={`${styles.stageCard} ${styles.glassPanel}`}>
                <div className={styles.stageCardHead}>
                  <VitrineMark size={30} decorative />
                  <span>Glass panel</span>
                </div>
                <p>
                  A translucent sheet with a 1px cut edge and a top highlight.
                  The dots stay outside the text block.
                </p>
                <div className={styles.stageField}>
                  <span>you@studio.com</span>
                  <span className={styles.stageFieldFocus} aria-hidden>
                    focus
                  </span>
                </div>
                <div className={styles.stageButton}>Request a key</div>
              </div>
              <div className={styles.stageLayers}>
                <span>01 Fill</span>
                <span>02 Edge</span>
                <span>03 Specular</span>
                <span>04 Hard shadow</span>
              </div>
            </div>

            <div className={styles.materialNotes}>
              <p className={styles.cardLabel}>The recipe</p>
              <ol className={styles.recipe}>
                <li>
                  <span>Fill</span>
                  <code>var(--vt-glass-fill)</code>
                  <p>
                    58% white on light, 9% white on case. Never a solid card
                    with a blur bolted on.
                  </p>
                </li>
                <li>
                  <span>Edge</span>
                  <code>1px var(--vt-glass-edge)</code>
                  <p>
                    A cut edge, not a glow. It is what tells the eye the sheet
                    has a boundary.
                  </p>
                </li>
                <li>
                  <span>Specular</span>
                  <code>inset 0 1px 0 var(--vt-glass-highlight)</code>
                  <p>
                    One highlight, top only. A second one turns the material
                    into plastic.
                  </p>
                </li>
                <li>
                  <span>Shadow</span>
                  <code>0 1px 0 var(--vt-glass-edge)</code>
                  <p>
                    The hard 1px line is the brand. The soft lift is lighting,
                    not decoration.
                  </p>
                </li>
              </ol>

              <div className={styles.doDont}>
                <div>
                  <p className={styles.doDontTitle}>Do</p>
                  <ul>
                    <li>Use glass for a container with one object.</li>
                    <li>Keep the dither outside the text block.</li>
                    <li>Let one Signal field carry the page.</li>
                  </ul>
                </div>
                <div>
                  <p className={styles.doDontTitle}>Don’t</p>
                  <ul>
                    <li>Put body copy on a translucent card.</li>
                    <li>Dither the input surface.</li>
                    <li>Add a second loud field.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="colour"
          className={styles.section}
          aria-labelledby="colour-title"
        >
          <SectionHead
            id="colour"
            number="04"
            label="Colour"
            title={
              <>
                Roles,
                <br />
                not swatches.
              </>
            }
            lead="Each colour has one job. Signal is the only field allowed to shout; the rest are grounds, text roles or status accents. Every pair below is measured before it carries text."
          />

          <div className={styles.colourGrid}>
            {COLOUR_MAIN.map((colour) => (
              <article key={colour.name} className={styles.colourCard}>
                <div
                  className={styles.colourSwatch}
                  style={{ background: colour.value }}
                  aria-hidden
                />
                <div className={styles.colourBody}>
                  <p className={styles.colourName}>{colour.name}</p>
                  <p className={styles.colourValue}>
                    {colour.value} · {colour.ratio.toFixed(2)}:1
                  </p>
                  <p className={styles.colourRole}>{colour.role}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.colourRule}>
            <span>One loud field / Signal</span>
            <span>Glass is a material, not a colour</span>
            <span>Body 4.5:1 · large 3:1</span>
          </div>

          <div className={styles.tableBlock}>
            <div className={styles.tableHead}>
              <div>
                <p className={styles.cardLabel}>Contrast</p>
                <h3>Pairs that ship</h3>
              </div>
              <p className={styles.tableNote}>
                Accents are checked before they carry text. Clay is an error
                role, not a field.
              </p>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  Colour pairs with measured contrast ratios and intended use
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Pair</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Use</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.contrast.map((pair) => (
                    <tr key={pair.label}>
                      <th scope="row">
                        <span className={styles.pairCell}>
                          <span
                            className={styles.pairChip}
                            style={{ background: pair.bg }}
                            aria-hidden
                          >
                            <span style={{ color: pair.fg }}>Aa</span>
                          </span>
                          {pair.label}
                        </span>
                      </th>
                      <td>
                        <span className={styles.ratio}>
                          {pair.ratio.toFixed(2)}:1
                        </span>
                      </td>
                      <td>{pair.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          id="type"
          className={styles.section}
          aria-labelledby="type-title"
        >
          <SectionHead
            id="type"
            number="05"
            label="Type"
            title={
              <>
                Display for
                <br />
                names.
              </>
            }
            lead="Three voices, one job each: Space Grotesk for names, Geist for sentences, Geist Mono for facts. The wordmark is outlined, so a missing font cannot change the logo."
          />

          <div className={styles.typeBlock}>
            <div className={styles.typeBlockHead}>
              <p className={styles.cardLabel}>Specimen</p>
              <p className={styles.typeBlockNote}>
                Space Grotesk / Geist / Geist Mono
              </p>
            </div>
            <p className={styles.typeSpecimen}>vitrine</p>
            <div className={styles.typeRows}>
              <div>
                <span>Display</span>
                <strong className={styles.typeDisplay}>
                  Space Grotesk 700
                </strong>
                <code>64–190 / -0.055em</code>
              </div>
              <div>
                <span>Reading</span>
                <strong className={styles.typeReading}>
                  Depth without fog.
                </strong>
                <code>Geist 400 / 16–18</code>
              </div>
              <div>
                <span>Label</span>
                <strong className={styles.typeMono}>Material / 04</strong>
                <code>Geist Mono 500 / 0.14em</code>
              </div>
            </div>
            <ul className={styles.typeGate}>
              {TYPE_GATE.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="forms"
          className={styles.section}
          aria-labelledby="forms-title"
        >
          <SectionHead
            id="forms"
            number="06"
            label="Forms"
            title={
              <>
                Controls that
                <br />
                survive the material.
              </>
            }
            lead="Ten native controls in one specimen form. Keyboard labels, visible focus, hint text, an error summary and a live status message. The material is glass; the control is still a control."
          />

          <div className={styles.formsLayout}>
            <div className={styles.formPanel}>
              <div className={styles.ditherEdge} aria-hidden />
              <div className={styles.formPanelHead}>
                <div>
                  <p className={styles.cardLabel}>Form / 01</p>
                  <h3>Request access</h3>
                </div>
                <span className={styles.formBadge}>Specimen</span>
              </div>
              <p className={styles.formLead}>
                This is the whole kit in one place: text, email, password,
                select, radio group, textarea, checkbox, switch, range and file.
                Submit with the fields empty to see the error summary.
              </p>
              <FormDemo />
            </div>

            <aside className={styles.formAside}>
              <p className={styles.cardLabel}>Anatomy</p>
              <ol className={styles.anatomy}>
                <li>
                  <span>01</span>
                  <div>
                    <strong>Label</strong>
                    <p>Always visible. The placeholder never replaces it.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Control</strong>
                    <p>
                      Native input, select, textarea, radio, checkbox, range,
                      file.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Hint</strong>
                    <p>Quiet, but never the only place a requirement lives.</p>
                  </div>
                </li>
                <li>
                  <span>04</span>
                  <div>
                    <strong>Error</strong>
                    <p>
                      Linked with aria-describedby; the summary takes focus.
                    </p>
                  </div>
                </li>
              </ol>

              <div className={styles.stateList}>
                <p className={styles.cardLabel}>States</p>
                <div className={styles.stateChips}>
                  <span>Default</span>
                  <span>Hover</span>
                  <span className={styles.stateFocus}>Focus</span>
                  <span className={styles.stateInvalid}>Invalid</span>
                  <span className={styles.stateDisabled}>Disabled</span>
                </div>
              </div>

              <div className={styles.asideNote}>
                <p>
                  Theme DNA: hard edge, square tile, solid ring, cosy density.
                  The field reads <code>--vt-field-*</code> tokens; the mark
                  reads the same material.
                </p>
                <CopyButton
                  text={`<input className="vt-input" aria-describedby="email-hint" />`}
                  label="Copy input"
                  copiedLabel="Input copied"
                />
              </div>

              <div className={styles.asideNote}>
                <p>
                  Focus is a 3px ring plus a border change. It is never removed,
                  and it is never the only state.
                </p>
                <a
                  className={styles.textLink}
                  href="/brand/vitrine/vitrine-forms.css"
                  download
                >
                  Download the form kit <span aria-hidden>↓</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="motion"
          className={styles.section}
          aria-labelledby="motion-title"
        >
          <SectionHead
            id="motion"
            number="07"
            label="Motion"
            title={
              <>
                One ease.
                <br />A finished still.
              </>
            }
            lead="Movement is a physical response, not a personality. Press and hover in 120ms, state in 240ms, entrance in 480ms. Under reduced motion the shader holds a finished frame."
          />

          <div className={styles.motionGrid}>
            {MOTION.map((item) => (
              <article key={item.name} className={styles.motionCard}>
                <p className={styles.motionValue}>{item.value}</p>
                <p>{item.name}</p>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="voice"
          className={styles.section}
          aria-labelledby="voice-title"
        >
          <SectionHead
            id="voice"
            number="08"
            label="Voice"
            title={
              <>
                Museum labels,
                <br />
                not marketing.
              </>
            }
            lead="The voice is precise, lit and unhurried. It says what happened and what to do next. The empty state and the error are where the brand is actually tested."
          />

          <div className={styles.voiceGrid}>
            <article className={styles.voiceCard}>
              <h3>We are / We are not</h3>
              <ul className={styles.voiceList}>
                <li>
                  <strong>We are</strong> {VOICE.weAre}
                </li>
                <li>
                  <strong>We are not</strong> {VOICE.weAreNot}
                </li>
              </ul>
              <p className={styles.voiceQuote}>
                The case holds one object. The rest is clearance.
              </p>
            </article>

            <article className={styles.voiceCard}>
              <h3>Say / Don’t say</h3>
              <ul className={styles.voiceList}>
                {VOICE.say.map((line) => (
                  <li key={line}>
                    <strong>Say</strong> {line}
                  </li>
                ))}
                {VOICE.dontSay.map((line) => (
                  <li key={line}>
                    <strong>Don’t say</strong> {line}
                  </li>
                ))}
              </ul>
              <div className={styles.voiceContext}>
                <p>
                  <strong>Success</strong> Request staged. This specimen does
                  not call a server.
                </p>
                <p>
                  <strong>Error</strong> Use at least 8 characters.
                </p>
                <p>
                  <strong>Headline</strong> A glass case for a low-resolution
                  light.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="applications"
          className={styles.section}
          aria-labelledby="applications-title"
        >
          <SectionHead
            id="applications"
            number="09"
            label="Applications"
            title={
              <>
                One mark,
                <br />
                every size.
              </>
            }
            lead="The compact V carries the identity below 32px; the primary carries the split above it. Clear space is half the mark height. The favicon is the one place the Signal field leads."
          />

          <div className={styles.applicationsGrid}>
            <article className={styles.applicationCard}>
              <p className={styles.cardLabel}>Lockups</p>
              <div className={styles.applicationRow}>
                <div>
                  <VitrineLockup />
                  <p className={styles.applicationLabel}>
                    Horizontal / 139 × 34
                  </p>
                </div>
                <div>
                  <VitrineStacked height={88} />
                  <p className={styles.applicationLabel}>Stacked / 106 × 88</p>
                </div>
              </div>
              <div className={styles.applicationRow}>
                {[16, 32, 64, 128].map((size) => (
                  <div key={size}>
                    <VitrineMark size={size} decorative />
                    <p className={styles.applicationLabel}>{size}px</p>
                  </div>
                ))}
              </div>
              <p className={styles.applicationNote}>
                The full mark is used at 32px and above. The compact is a
                separate one-path V for 16–24px; it drops the Signal arm rather
                than shrinking the split into a speck.
              </p>
              <div className={styles.applicationDownloads}>
                <a href="/brand/vitrine/mark.svg" download>
                  Mark SVG
                </a>
                <a href="/brand/vitrine/lockup.svg" download>
                  Lockup SVG
                </a>
                <a href="/brand/vitrine/lockup-stacked.svg" download>
                  Stacked SVG
                </a>
                <a href="/brand/vitrine/wordmark.svg" download>
                  Wordmark SVG
                </a>
              </div>
            </article>

            <article className={styles.applicationCard}>
              <p className={styles.cardLabel}>Favicon and app icon</p>
              <div className={styles.applicationRow}>
                {[16, 32, 48].map((size) => (
                  <div key={size}>
                    <span className={styles.iconChip}>
                      <Image
                        src={`/brand/vitrine/favicon-${size}.png`}
                        width={size}
                        height={size}
                        alt={`Vitrine favicon at ${size} pixels`}
                      />
                    </span>
                    <p className={styles.applicationLabel}>{size}px</p>
                  </div>
                ))}
                <div>
                  <Image
                    src="/brand/vitrine/icon-192.png"
                    width={72}
                    height={72}
                    alt="Vitrine app icon"
                    style={{ display: 'block' }}
                  />
                  <p className={styles.applicationLabel}>App / 192</p>
                </div>
              </div>
              <p className={styles.applicationNote}>
                The favicon is a Signal field and the compact mark so it
                survives dark browser chrome. The app icon returns to the Case
                field and the full mark.
              </p>
              <div className={styles.applicationDownloads}>
                <a href="/brand/vitrine/favicon.ico" download>
                  Favicon ICO
                </a>
                <a href="/brand/vitrine/icon.svg" download>
                  Icon SVG
                </a>
                <a href="/brand/vitrine/icon-192.png" download>
                  Icon 192
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          id="tokens"
          className={styles.section}
          aria-labelledby="tokens-title"
        >
          <SectionHead
            id="tokens"
            number="10"
            label="Tokens"
            title={
              <>
                Four layers,
                <br />
                one source.
              </>
            }
            lead="Theme DNA feeds primitive values, primitives feed semantic roles, and roles feed component decisions. The CSS and the JSON are generated from features/vitrine/tokens.json, so the page and the download cannot drift."
          />

          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>00 / Theme DNA</span>
                <span className={styles.tokenCount}>
                  {Object.keys(tokens.theme).length}
                </span>
              </div>
              <h3>The same edge for mark and field</h3>
              <p>
                One small object drives the case, the field radius, the focus
                ring and the label. Change it here, not in a screenshot.
              </p>
              <div className={styles.componentList}>
                {Object.entries(tokens.theme).map(([name, value]) => (
                  <div key={name} className={styles.componentRow}>
                    <code>--vt-dna-{name}</code>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>01 / Primitive</span>
                <span className={styles.tokenCount}>{primitives.length}</span>
              </div>
              <h3>Named values</h3>
              <p>
                Case, Frost, Graphite, Signal, Iris, Clay. Raw values only; no
                role in the name.
              </p>
              <div className={styles.swatchGrid}>
                {primitives.map((token) => (
                  <div key={token.name} className={styles.swatchChip}>
                    <span
                      className={styles.swatchColor}
                      style={{ background: `var(--vt-${token.name})` }}
                      aria-hidden
                    />
                    <span className={styles.swatchName}>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>02 / Semantic</span>
                <span className={styles.tokenCount}>
                  {semanticLight.length * 2}
                </span>
              </div>
              <h3>Roles, light and dark</h3>
              <p>
                One role, two values. Components read these names, not the
                primitives.
              </p>
              <div className={styles.tokenMiniTable}>
                {SEMANTIC_PREVIEW.map((name) => {
                  const light = semanticLight.find(
                    (token) => token.name === name,
                  )
                  const dark = semanticDark.find((token) => token.name === name)
                  return (
                    <div key={name} className={styles.tokenMiniRow}>
                      <code>--vt-{name}</code>
                      <span
                        className={styles.miniChip}
                        style={{ background: light?.value }}
                        title={light?.value}
                      />
                      <span
                        className={styles.miniChip}
                        style={{ background: dark?.value }}
                        title={dark?.value}
                      />
                    </div>
                  )
                })}
              </div>
              <p className={styles.tokenNote}>
                10 of {semanticLight.length} roles shown; the table and the
                download have all {semanticLight.length}.
              </p>
            </article>

            <article className={styles.tokenCard}>
              <div className={styles.tokenCardHead}>
                <span className={styles.tokenLayer}>03 / Component</span>
                <span className={styles.tokenCount}>
                  {componentsLight.length * 2}
                </span>
              </div>
              <h3>Decisions, not palettes</h3>
              <p>
                Field, button, card and chip read from the semantic layer. The
                field kit reads the theme DNA.
              </p>
              <div className={styles.componentList}>
                {componentsLight.map((light) => {
                  const dark = componentsDark.find(
                    (token) => token.name === light.name,
                  )
                  return (
                    <div key={light.name} className={styles.componentRow}>
                      <code>--vt-{light.name}</code>
                      <span>{light.value}</span>
                      <span className={styles.componentDark}>
                        dark: {dark?.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          </div>

          <div className={styles.tokenDownloads}>
            <a href="/brand/vitrine/vitrine-tokens.css" download>
              Download CSS <span aria-hidden>↓</span>
            </a>
            <a href="/brand/vitrine/vitrine-tokens.json" download>
              Download JSON <span aria-hidden>↓</span>
            </a>
            <a href="/brand/vitrine/vitrine-forms.css" download>
              Download forms <span aria-hidden>↓</span>
            </a>
            <a href="/brand/vitrine/vitrine-brandkit.png" download>
              Download board <span aria-hidden>↓</span>
            </a>
            <span className={styles.tokenTotal}>
              {TOKEN_COUNT} declarations
            </span>
          </div>

          <div className={styles.tableBlock}>
            <div className={styles.tableHead}>
              <div>
                <p className={styles.cardLabel}>Semantic tokens</p>
                <h3>One role, two themes</h3>
              </div>
              <CopyButton
                text={semanticLight
                  .slice(0, 6)
                  .map((token) => `--vt-${token.name}: ${token.value};`)
                  .join('\n')}
                label="Copy sample"
                copiedLabel="Sample copied"
              />
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  Vitrine semantic tokens, light and dark values, and their role
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Light</th>
                    <th scope="col">Dark</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANTIC_TABLE.map(({ light, dark }) => (
                    <tr key={light.name}>
                      <th scope="row">
                        <code>--vt-{light.name}</code>
                      </th>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: light.value }}
                            aria-hidden
                          />
                          {light.resolved ?? light.value}
                        </span>
                      </td>
                      <td>
                        <span className={styles.valueCell}>
                          <span
                            className={styles.valueDot}
                            style={{ background: dark?.value }}
                            aria-hidden
                          />
                          {dark?.resolved ?? dark?.value}
                        </span>
                      </td>
                      <td>{light.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          id="audit"
          className={styles.section}
          aria-labelledby="audit-title"
        >
          <SectionHead
            id="audit"
            number="11"
            label="Audit"
            title={
              <>
                What the method
                <br />
                asked for.
              </>
            }
            lead="The v2.4 skill lists its resources, the dithercn skill lists its engine, and the mark scorer gives a verdict. Both were checked on disk. Present is not the same as used, and a pass is not the same as a good idea."
          />

          <div className={styles.auditSummary}>
            <div>
              <span className={styles.auditNumber}>
                {GATE_SUMMARY.passed}/{GATE_SUMMARY.total}
              </span>
              <p>Hard-gate checks pass</p>
            </div>
            <div>
              <span className={styles.auditNumber}>PASS</span>
              <p>Mark score / no failures</p>
            </div>
            <div>
              <span className={styles.auditNumber}>
                {RESOURCE_SUMMARY.present}/{SKILL_RESOURCES.length}
              </span>
              <p>v2.4 resources present</p>
            </div>
            <div>
              <span className={styles.auditNumber}>{GAPS.length}</span>
              <p>Gaps named below</p>
            </div>
          </div>

          <div className={styles.auditWide}>
            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>A / Skill resources</p>
                  <h3>Every advertised path</h3>
                </div>
                <span className={styles.auditMeta}>
                  {RESOURCE_SUMMARY.used} used · {RESOURCE_SUMMARY.substituted}{' '}
                  substituted · {RESOURCE_SUMMARY.untouched} not used
                </span>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>
                    v2.4 brand-system resources, whether they are present, and
                    how the Vitrine build used them
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Resource</th>
                      <th scope="col">Present</th>
                      <th scope="col">Use</th>
                      <th scope="col">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SKILL_RESOURCES.map((resource) => (
                      <tr key={resource.path}>
                        <th scope="row">
                          <code>
                            {resource.path.replace(
                              'skills/sunnyside-brand-system/',
                              '',
                            )}
                          </code>
                        </th>
                        <td>
                          <StatusPill tone={resource.present ? 'pass' : 'note'}>
                            {resource.present ? 'Yes' : 'No'}
                          </StatusPill>
                        </td>
                        <td>
                          <StatusPill
                            tone={
                              resource.status === 'used'
                                ? 'used'
                                : resource.status === 'substituted'
                                  ? 'substituted'
                                  : 'unused'
                            }
                          >
                            {resource.status}
                          </StatusPill>
                        </td>
                        <td>
                          {resource.evidence}
                          {resource.note ? (
                            <span className={styles.tableSub}>
                              {resource.note}
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>B / Output contract</p>
                  <h3>What the kit contains</h3>
                </div>
                <span className={styles.auditMeta}>
                  {CONTRACT_SUMMARY.shipped}/{CONTRACT_SUMMARY.total} shipped
                </span>
              </div>
              <ul className={styles.contractList}>
                {OUTPUT_CONTRACT.map((item) => (
                  <li key={item.item}>
                    <StatusPill tone="shipped">Shipped</StatusPill>
                    <div>
                      <strong>{item.item}</strong>
                      <code>{item.evidence}</code>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className={styles.auditGrid}>
            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>C / Dithercn</p>
                  <h3>Engine and skill check</h3>
                </div>
                <span className={styles.auditMeta}>1 custom field</span>
              </div>
              <ul className={styles.passList}>
                {DITHER_AUDIT.map((item) => (
                  <li key={item.item}>
                    <StatusPill tone={item.status === 'pass' ? 'pass' : 'note'}>
                      {item.status === 'pass' ? 'Pass' : 'Note'}
                    </StatusPill>
                    <div>
                      <strong>{item.item}</strong>
                      <code>{item.evidence}</code>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.auditCard}>
              <div className={styles.auditCardHead}>
                <div>
                  <p className={styles.cardLabel}>D / Gaps</p>
                  <h3>What is not here</h3>
                </div>
                <span className={styles.auditMeta}>Named, not hidden</span>
              </div>
              <ol className={styles.gapList}>
                {GAPS.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ol>
              <div className={styles.auditLinks}>
                <a
                  href="/design-system/vitrine/llms.txt"
                  className={styles.textLink}
                >
                  Read the raw Markdown twin <span aria-hidden>↗</span>
                </a>
                <a href="/sunnyside" className={styles.textLink}>
                  Compare with Sunnyside <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.onCase}`}>
        <div className={styles.footerTop}>
          <VitrineWordmark height={44} />
          <p className={styles.footerStatement}>
            One case. One object.
            <br />
            The rest is clearance.
          </p>
        </div>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.cardLabel}>Brand</p>
            <a href="/brand/vitrine/lockup.svg" download>
              Lockup SVG
            </a>
            <a href="/brand/vitrine/mark.svg" download>
              Mark SVG
            </a>
            <a href="/brand/vitrine/favicon.ico" download>
              Favicon ICO
            </a>
            <a href="/brand/vitrine/vitrine-brandkit.png" download>
              Brand board
            </a>
          </div>
          <div>
            <p className={styles.cardLabel}>System</p>
            <a href="/brand/vitrine/vitrine-tokens.css" download>
              Tokens CSS
            </a>
            <a href="/brand/vitrine/vitrine-tokens.json" download>
              Tokens JSON
            </a>
            <a href="/brand/vitrine/vitrine-forms.css" download>
              Form kit CSS
            </a>
            <a href="/design-system/vitrine/llms.txt">Markdown twin</a>
            <a href="#top">Back to top</a>
          </div>
          <div>
            <p className={styles.cardLabel}>Elsewhere</p>
            <a href="https://dithercn.dev" target="_blank" rel="noreferrer">
              dithercn <span aria-hidden>↗</span>
            </a>
            <Link href="/design-system">
              Case library <span aria-hidden>↗</span>
            </Link>
            <Link href="/sunnyside">
              Sunnyside <span aria-hidden>↗</span>
            </Link>
            <Link href="/design-engineering">
              Design engineering <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>Vitrine 2.5 · 2026 · Aditya Himawan</span>
          <span>Half-light V · no generated imagery</span>
        </div>
      </footer>
    </div>
  )
}
