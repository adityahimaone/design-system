'use client'

import { useState } from 'react'

import { BACKDROP, FIGURES, STAGE_PALETTE } from '../porphyry-data'
import styles from '../porphyry.module.css'
import { PorphyryMark } from './brand'
import PorphyryStage from './stage'

/**
 * The specimen wrapper. The stage is a client ornament; remounting it is the
 * only way to replay the sequence without a second API on the component.
 */
export function PorphyrySpecimen() {
  const [run, setRun] = useState(0)

  return (
    <div className={styles.stageWrap}>
      <div className={styles.stageFrame}>
        <PorphyryStage
          key={run}
          height="clamp(520px, 76vh, 760px)"
          figures={FIGURES}
          backdrop={BACKDROP}
          palette={STAGE_PALETTE}
          tone="noir"
          duotone
          tilt={2.5}
          wordmark="Porphyry"
          face="cinzel"
          tagline="A page composed like a stage."
          eyebrow="Case 10 · MMXXVI"
          brand={
            <PorphyryMark size={24} compact accent={STAGE_PALETTE.accent} />
          }
          nav={[
            { label: 'Story', href: '#story' },
            { label: 'Cast', href: '#cast' },
            { label: 'Stone', href: '#stone' },
            { label: 'Type', href: '#type' },
          ]}
          plate="Pl. X"
          loadingLabel="Marble"
          cta={{ label: 'Read the system', href: '#story' }}
          fontHref={null}
        />
      </div>
      <div className={styles.stageTools}>
        <span>Live specimen · the loader is the wordmark</span>
        <button
          type="button"
          className={styles.stageReplay}
          onClick={() => setRun((n) => n + 1)}
        >
          Replay the stage
        </button>
      </div>
    </div>
  )
}
