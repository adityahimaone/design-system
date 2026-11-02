import styles from '../hachure.module.css'
import { RangeThumb } from './range-thumb'

/**
 * The depth model, drawn as a section. There are three bands because there are
 * three levels of meaning in the interface, and the range is reserved: if
 * anything else could use it, reaching it would stop meaning anything.
 */
export function ElevationStudy({ tones }: { tones: string[] }) {
  return (
    <div className={styles.bands}>
      <article className={styles.band} data-band="range">
        <div className={styles.bandAxis}>
          <b>400–3,000</b>
          <span>m</span>
        </div>
        <div className={styles.bandBody}>
          <div className={styles.bandHead}>
            <h3>Range</h3>
            <span className={styles.tag} data-tone="quiet">
              Reserved
            </span>
          </div>
          <p>
            The footer, and only the footer. Six ridges, drifting mist, an
            altimeter. Nothing else in the system may climb this band, so
            arriving at it means the page has ended.
          </p>
        </div>
        <div className={styles.bandSample}>
          <RangeThumb tones={tones} />
          <span className={styles.bandSampleNote}>
            a strip of the plate / 2px cells
          </span>
        </div>
      </article>

      <article className={styles.band} data-band="bench">
        <div className={styles.bandAxis}>
          <b>40</b>
          <span>m</span>
        </div>
        <div className={styles.bandBody}>
          <div className={styles.bandHead}>
            <h3>Bench</h3>
            <span className={styles.tag} data-tone="a">
              Inset
            </span>
          </div>
          <p>
            Panels, inputs, table headers, the specimen frame. One hairline and
            one step darker than the page — a bench is a place a tool sits, not
            a card that floats.
          </p>
        </div>
        <div className={styles.bandSample} aria-hidden="true">
          <div className={styles.bandPanel}>
            <span className={styles.label}>Bench panel</span>
            <div className={styles.bandField}>
              <span>46.2044° N</span>
              <span>6.1432° E</span>
            </div>
            <div className={styles.bandRule}>
              <span>Station</span>
              <span>Datum</span>
            </div>
          </div>
        </div>
      </article>

      <article className={styles.band} data-band="ground">
        <div className={styles.bandAxis}>
          <b>0</b>
          <span>m</span>
        </div>
        <div className={styles.bandBody}>
          <div className={styles.bandHead}>
            <h3>Ground</h3>
          </div>
          <p>
            The page itself. Survey stock, plain rules, reading type. Everything
            starts here and nothing sits below it: there is no shadow under the
            system, and no card pretending to be a metre off the desk.
          </p>
        </div>
        <div className={styles.bandSample} aria-hidden="true">
          <div className={styles.bandGround}>
            <span className={styles.label}>Ground</span>
            <p>Reading copy on stock. A link is underlined, not floating.</p>
            <span className={styles.bandLink}>a link, on the ground</span>
          </div>
        </div>
      </article>
    </div>
  )
}
