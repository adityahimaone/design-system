import { JAKARTA_PRIMARY } from './brand'
import { WORDMARK_BOX, WORDMARK_PATHS } from '../wordmark-paths'
import { HERO_FIELD } from '../jakarta-data'
import styles from '../jakarta.module.css'

/**
 * The JakLingko card, drawn from scratch in the Jakarta tokens.
 *
 * It is a card, not a poster: ID-1 proportions (1,586:1), a 34-unit radius, the
 * district ribbon along the top edge where a real card prints its issuer band,
 * a chip and a contactless mark at the height a card holds them, the number in a
 * mono grouping at the bottom left, and the operator panel on the right with the
 * mark knocked out of it. Every value is a token; the only inks written
 * literally are the chip's contact lines, because those are one material rather
 * than a role.
 */

/* A card logo is small. The lockup is 34 units of a 1000-unit card — 2,9mm on
   the real 85,6mm object — which is the size an issuer mark actually prints at,
   not the size a poster would use. */
const LOCKUP_HEIGHT = 34
const LOCKUP_X = 58
const LOCKUP_Y = 54
const MARK_SCALE = LOCKUP_HEIGHT / JAKARTA_PRIMARY.box.h
const WORDMARK_CAP = LOCKUP_HEIGHT * 0.72
const WORDMARK_SCALE = WORDMARK_CAP / WORDMARK_BOX.h
const WORDMARK_X =
  LOCKUP_X +
  (JAKARTA_PRIMARY.box.w * LOCKUP_HEIGHT) / JAKARTA_PRIMARY.box.h +
  LOCKUP_HEIGHT * 1.6 * (100 / JAKARTA_PRIMARY.box.h)

const CARD_W = 1000
const CARD_H = 630
const PANEL_X = 632
const ACCENT_X = PANEL_X - 6

export function TransitCard() {
  return (
    <svg
      className={styles.cardSvg}
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      role="img"
      aria-labelledby="jk-card-title"
    >
      <title id="jk-card-title">
        The JakLingko card: a cream card with the ten district colours printed
        along its top edge, the outlined Jakarta lockup and a gold chip on the
        paper, and a Laut Sunda operator panel with the mark knocked out of it.
        Number 4990 2026 0001.
      </title>

      <defs>
        <clipPath id="jk-card-face">
          <rect width={CARD_W} height={CARD_H} rx="34" />
        </clipPath>
        <clipPath id="jk-card-panel">
          <rect x={PANEL_X} width={CARD_W - PANEL_X} height={CARD_H} />
        </clipPath>
      </defs>

      <g clipPath="url(#jk-card-face)">
        {/* the face — warm paper, the same stock as the page */}
        <rect width={CARD_W} height={CARD_H} fill="var(--jk-kertas, #F7F4EE)" />

        {/* the operator field, one Senja edge, and the mark knocked out of it */}
        <g clipPath="url(#jk-card-panel)">
          <rect
            x={PANEL_X}
            width={CARD_W - PANEL_X}
            height={CARD_H}
            fill="var(--jk-laut-100, #148BCD)"
          />

          {/* The mark knocked out of the operator field, whole and centred in
              it. A nested svg with the mark's own viewBox, so the knockout is
              the same drawing as the lockup and not an eyeballed scale. */}
          <svg
            x={(PANEL_X + (CARD_W - PANEL_X - 300) / 2).toFixed(1)}
            y="176"
            width="300"
            height={((300 * JAKARTA_PRIMARY.box.h) / JAKARTA_PRIMARY.box.w).toFixed(1)}
            viewBox={`0 0 ${JAKARTA_PRIMARY.box.w} ${JAKARTA_PRIMARY.box.h}`}
            fill="var(--jk-kertas, #F7F4EE)"
            opacity="0.16"
          >
            <path d={JAKARTA_PRIMARY.path} />
            <circle
              cx={JAKARTA_PRIMARY.stop.cx}
              cy={JAKARTA_PRIMARY.stop.cy}
              r={JAKARTA_PRIMARY.stop.r}
            />
          </svg>

          {/* one route, right angles only — the mark's grammar at card scale,
              kept in the lower third where nothing else is drawn */}
          <path
            d="M660 512H764V566"
            fill="none"
            stroke="var(--jk-kertas, #F7F4EE)"
            strokeWidth="7"
            strokeOpacity="0.55"
          />
          <circle cx="764" cy="566" r="8" fill="var(--jk-kertas, #F7F4EE)" />
        </g>

        <rect
          x={ACCENT_X}
          width="6"
          height={CARD_H}
          fill="var(--jk-senja-100, #F7481B)"
        />

        {/* The issuer ribbon: the ten district colours, 14 units deep, run the
            full width of the card above both faces — the one place a card
            always prints the identity, and the fair way to say "ten colours"
            without turning the face into a diagram. */}
        {HERO_FIELD.map((stop, index) => (
          <rect
            key={stop.token}
            x={(index * CARD_W) / HERO_FIELD.length}
            y="0"
            width={CARD_W / HERO_FIELD.length + 1}
            height="14"
            fill={stop.hex}
          />
        ))}

        {/* the city lockup, on the paper, at issuer size */}
        <g
          transform={`translate(${LOCKUP_X} ${LOCKUP_Y}) scale(${MARK_SCALE})`}
          fill="var(--jk-tinta, #1B2126)"
        >
          <path d={JAKARTA_PRIMARY.path} />
          <circle
            cx={JAKARTA_PRIMARY.stop.cx}
            cy={JAKARTA_PRIMARY.stop.cy}
            r={JAKARTA_PRIMARY.stop.r}
          />
        </g>
        <g
          transform={`translate(${WORDMARK_X} ${
            LOCKUP_Y + LOCKUP_HEIGHT - WORDMARK_CAP
          }) scale(${WORDMARK_SCALE})`}
          fill="var(--jk-tinta, #1B2126)"
        >
          {WORDMARK_PATHS.map((glyph) => (
            <path key={glyph.t} transform={glyph.t} d={glyph.d} />
          ))}
        </g>

        <text className={styles.cardMicro} x={LOCKUP_X} y="112">
          KOTA KOLABORASI · HUT KE–499
        </text>

        {/* chip — the one gold on the card, drawn flat with its contacts */}
        <g transform="translate(58 168)">
          <rect
            width="76"
            height="56"
            rx="9"
            fill="var(--jk-kebayoran-100, #FCD260)"
          />
          <g stroke="#8A6A22" strokeWidth="1.6" strokeOpacity="0.45">
            <path d="M0 19H76" />
            <path d="M0 37H76" />
            <path d="M25 0V56" />
            <path d="M51 0V56" />
          </g>
          <rect
            width="76"
            height="56"
            rx="9"
            fill="none"
            stroke="#8A6A22"
            strokeOpacity="0.32"
            strokeWidth="1.4"
          />
        </g>

        {/* contactless: four arcs, drawn rather than typeset */}
        <g
          transform="translate(152 178)"
          fill="none"
          stroke="var(--jk-tinta, #1B2126)"
          strokeWidth="3.4"
          strokeLinecap="round"
          opacity="0.42"
        >
          <path d="M0 8Q10 23 0 38" />
          <path d="M12 2Q25 23 12 44" />
          <path d="M24 -5Q39 23 24 51" />
        </g>

        <path
          d="M58 296H600"
          stroke="var(--jk-tinta, #1B2126)"
          strokeWidth="1.5"
          strokeOpacity="0.14"
        />

        <text className={styles.cardLabel} x="58" y="332">
          KARTU WARGA
        </text>
        <text className={styles.cardNumber} x="58" y="374">
          4990 2026 0001
        </text>
        <text className={styles.cardMeta} x="58" y="404">
          BERLAKU SAMPAI 12/2031
        </text>

        {/* hologram: one foil disc, beside the number where a card puts it */}
        <g transform="translate(544 358)">
          <circle r="30" fill="var(--jk-kebayoran-300, #FDE9B2)" />
          <circle
            r="30"
            fill="none"
            stroke="var(--jk-kebayoran-100, #FCD260)"
            strokeWidth="2.5"
          />
          <g transform="scale(0.028)" opacity="0.7">
            <g transform={`scale(${MARK_SCALE})`}>
              <path d={JAKARTA_PRIMARY.path} fill="var(--jk-tinta, #1B2126)" />
              <circle
                cx={JAKARTA_PRIMARY.stop.cx}
                cy={JAKARTA_PRIMARY.stop.cy}
                r={JAKARTA_PRIMARY.stop.r}
                fill="var(--jk-tinta, #1B2126)"
              />
            </g>
          </g>
        </g>

        <text className={styles.cardMicro} x="58" y="556">
          JAKLINGKO · TRANSJAKARTA · KARTU TARIF TERPADU · 2026
        </text>

        {/* the operator panel's own voice: a fare badge, the name, the fine print */}
        <g transform="translate(660 44)">
          <rect
            width="150"
            height="30"
            rx="15"
            fill="var(--jk-kebayoran-100, #FCD260)"
          />
          <text
            x="75"
            y="20"
            textAnchor="middle"
            fill="var(--jk-tinta, #1B2126)"
            style={{
              fontFamily: 'var(--jk-font-display)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '2.4px',
            }}
          >
            KORIDOR 1
          </text>
        </g>

        {/* One word, 21/800 — large type, so cream on Laut clears 3:1 (3,41).
            The fine print does not live here: 8px cream on Laut reads 3,41 and
            fails, so the terms print on the paper, where aspal-200 reads 6,29. */}
        <text className={styles.cardOperator} x="980" y="576" textAnchor="end">
          JAKLINGKO
        </text>

        {/* an inner hairline so the card keeps its edge on a dark plate */}
        <rect
          x="0.75"
          y="0.75"
          width={CARD_W - 1.5}
          height={CARD_H - 1.5}
          rx="33"
          fill="none"
          stroke="var(--jk-tinta, #1B2126)"
          strokeOpacity="0.14"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
