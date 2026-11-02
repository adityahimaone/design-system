import Image from 'next/image'

import { JakartaGlyph, JakartaMark } from './brand'
import { TransitCard } from './transit-card'
import styles from '../jakarta.module.css'

/**
 * Four applications, built from the tokens rather than drawn as pictures: a
 * smart-city screen, an offline transit card, a wayfinding panel and a bus
 * livery. Each one is the system doing a job, not a mockup of a brand.
 *
 * The wall is a bento, not a column: the phone is a tall stage, the card is the
 * wide plate beside it, the panel and the livery share the floor. Every card
 * carries its own number, its job and the three roles it spends — so the
 * section reads as a specification sheet, not a gallery of renders.
 */

type Token = readonly [name: string, hex: string]

const TOKENS = {
  phone: [
    ['tinta', '#1B2126'],
    ['senja-100', '#F7481B'],
    ['laut-100', '#148BCD'],
  ],
  card: [
    ['laut-100', '#148BCD'],
    ['kebayoran-100', '#FCD260'],
    ['kertas', '#F7F4EE'],
  ],
  sign: [
    ['kertas', '#F7F4EE'],
    ['tinta', '#1B2126'],
    ['senja-100', '#F7481B'],
  ],
  livery: [
    ['kapur', '#FFFFFF'],
    ['laut-100', '#148BCD'],
    ['daun-100', '#00A062'],
  ],
} as const satisfies Record<string, readonly Token[]>

function TokenRow({ tokens }: { tokens: readonly Token[] }) {
  return (
    <ul className={styles.appTokens}>
      {tokens.map(([name, hex]) => (
        <li key={name}>
          <i style={{ background: hex }} aria-hidden />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  )
}

export function Applications() {
  return (
    <div className={styles.apps}>
      <figure className={`${styles.appCard} ${styles.appPhone}`}>
        <div className={styles.appPlate} data-stage="ink">
          <span className={styles.stageMark} aria-hidden>
            <JakartaMark size={300} decorative />
          </span>

          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <div className={styles.phoneStatus}>
                <span>07:42</span>
                <span className={styles.phoneSignal} aria-hidden>
                  ▮▮▮
                </span>
              </div>

              <div className={styles.phoneHead}>
                <JakartaMark size={20} decorative />
                <div>
                  <b>JAKARTA</b>
                  <span>Kota Kolaborasi</span>
                </div>
              </div>

              <div className={styles.phoneBody}>
                <div className={`${styles.pcard} ${styles.pcardInk}`}>
                  <div className={styles.pcardTop}>
                    <h5>TransJakarta · 1A</h5>
                    <span className={styles.liveDot} aria-hidden />
                  </div>
                  <p className={styles.pcardBig}>
                    4<span>min</span>
                  </p>
                  <div className={styles.proute} aria-hidden>
                    <i />
                    <span />
                    <i />
                    <span />
                    <i className={styles.prouteEnd} />
                  </div>
                  <div className={styles.prow}>
                    <span>Harmoni → Blok M</span>
                    <b>Rp 3.500</b>
                  </div>
                </div>

                <div className={`${styles.pcard} ${styles.pcardAccent}`}>
                  <h5>Lapor warga</h5>
                  <p className={styles.pcardLine}>
                    Jalan berlubang, Jl. Sabang
                  </p>
                  <div className={styles.prow}>
                    <span>Diteruskan ke Bina Marga</span>
                    <b>#24-0817</b>
                  </div>
                </div>

                <div className={styles.pcard}>
                  <div className={styles.prow}>
                    <span>
                      <span className={styles.badge} data-ink="night">
                        MRT
                      </span>
                      Bundaran HI
                    </span>
                    <b>2 min</b>
                  </div>
                  <div className={styles.prow}>
                    <span>
                      <span className={styles.badge} data-ink="transit">
                        KRL
                      </span>
                      Sudirman
                    </span>
                    <b>6 min</b>
                  </div>
                  <div className={styles.prow}>
                    <span>
                      <span className={styles.badge} data-ink="park">
                        LRT
                      </span>
                      Dukuh Atas
                    </span>
                    <b>9 min</b>
                  </div>
                </div>
              </div>

              <div className={styles.phoneTabs}>
                <span data-on="true">Beranda</span>
                <span>Rute</span>
                <span>Lapor</span>
                <span>Akun</span>
              </div>
            </div>
          </div>
        </div>

        <figcaption className={styles.appCap}>
          <div className={styles.appCapTop}>
            <span className={styles.appIndex}>01</span>
            <b>Jakarta Smart City</b>
            <span className={styles.appKicker}>Screen</span>
          </div>
          <p>
            One screen, three jobs, one accent. The dark card answers “when”,
            the orange card answers “what do I do”, the white card is reference.
            Colour carries the hierarchy, so the type does not have to shout.
          </p>
          <TokenRow tokens={TOKENS.phone} />
        </figcaption>
      </figure>

      <figure className={`${styles.appCard} ${styles.appWide}`}>
        <div className={styles.appPlate} data-stage="ink">
          <div className={styles.cardPlate}>
            <TransitCard />
          </div>
        </div>

        <figcaption className={styles.appCap}>
          <div className={styles.appCapTop}>
            <span className={styles.appIndex}>02</span>
            <b>JakLingko card</b>
            <span className={styles.appKicker}>Card</span>
          </div>
          <p>
            Drawn from scratch, not traced, at card proportions: the ten-colour
            issuer ribbon along the top edge, the outlined lockup at 2,9mm — mark
            and wordmark as paths, never type — a chip, a contactless mark, the
            number in tabular mono and a foil disc. The operator’s name sits on
            the Laut panel; the city’s logo owns the paper.
          </p>
          <TokenRow tokens={TOKENS.card} />
        </figcaption>
      </figure>

      <figure className={`${styles.appCard} ${styles.appSign}`}>
        <div className={styles.appPlate} data-stage="paper">
          <div className={styles.sign}>
            <div className={styles.signHead}>
              <JakartaGlyph size={26} />
              <span>Halte Bundaran HI</span>
            </div>

            <div className={styles.signRow}>
              <span className={styles.signArrow} aria-hidden>
                →
              </span>
              <div>
                <b>Blok M</b>
                <span>400 m · 5 min</span>
              </div>
            </div>

            <div className={styles.signRow}>
              <span className={styles.signArrow} data-quiet="true" aria-hidden>
                ↑
              </span>
              <div>
                <b>MRT Bundaran HI</b>
                <span>80 m</span>
              </div>
            </div>

            <div className={styles.signFoot}>
              <span className={styles.badge} data-ink="transit">
                1A
              </span>
              <span className={styles.badge} data-ink="night">
                MRT
              </span>
              <span className={styles.badge} data-ink="park">
                LRT
              </span>
              <span className={styles.signTime}>07:42</span>
            </div>
          </div>
        </div>

        <figcaption className={styles.appCap}>
          <div className={styles.appCapTop}>
            <span className={styles.appIndex}>03</span>
            <b>Halte Bundaran HI</b>
            <span className={styles.appKicker}>Panel</span>
          </div>
          <p>
            Ink on paper, one arrow in Senja, mode badges carrying their own
            colour as a field with ink inside. At 1,4 m the destination is the
            only thing that has to be read; everything else is confirmation.
          </p>
          <TokenRow tokens={TOKENS.sign} />
        </figcaption>
      </figure>

      <figure className={`${styles.appCard} ${styles.appLivery}`}>
        <div className={styles.appPlate} data-stage="sunken">
          <div className={styles.livery}>
            <div className={styles.busPlate}>
              <Image
                src="/brand/jakarta/transjakarta-bus.webp"
                alt="A TransJakarta bus in side elevation: dark window band, blue skirt and white body, with the Jakarta glyph applied to the white panel beside the operator’s wordmark."
                width={900}
                height={900}
                sizes="(max-width: 700px) 90vw, 340px"
              />
              <span className={styles.busMark} aria-hidden>
                <JakartaGlyph size={64} />
              </span>
            </div>

            <div className={styles.liveryRibbon} aria-hidden>
              <span>Koridor 1</span>
              <b>Blok M — Kota</b>
              <i />
            </div>
          </div>
        </div>

        <figcaption className={styles.appCap}>
          <div className={styles.appCapTop}>
            <span className={styles.appIndex}>04</span>
            <b>Bus 1A livery</b>
            <span className={styles.appKicker}>Livery</span>
          </div>
          <p>
            The supplied vector, unaltered except for one piece of vinyl. The
            bus is the operator’s; the mark on its white panel is the city’s,
            set beside the wordmark at the same optical weight.
          </p>
          <TokenRow tokens={TOKENS.livery} />
        </figcaption>
      </figure>
    </div>
  )
}
