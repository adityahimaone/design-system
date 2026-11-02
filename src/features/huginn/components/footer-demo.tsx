'use client'

import * as React from 'react'

import WildHuntFooter from '@/components/ui/wild-hunt-footer'

import styles from '../huginn.module.css'

const PRESETS = [
  { id: 'vermilion', label: 'Vermilion' },
  { id: 'ink', label: 'Ink' },
  { id: 'bone', label: 'Bone' },
] as const

type Preset = (typeof PRESETS)[number]['id']

/**
 * The specimen, not a mock of it: the real Wild Hunt footer, fed the real
 * tokens and the studio's own plate.
 *
 * The painting is local (`public/brand/huginn/`) because the component's default
 * points at a CDN, and a brand page that needs the network to show its own
 * artwork is not a brand page.
 */
export function HuginnFooterDemo() {
  const [preset, setPreset] = React.useState<Preset>('vermilion')
  const [dissolve, setDissolve] = React.useState(40)

  return (
    <div className={styles.footerSpecimen}>
      <div className={`${styles.shell} ${styles.footerControls}`}>
        <div className={styles.specimenGroup}>
          <span className={styles.label}>Field</span>
          <div className={styles.segmented} role="group" aria-label="Field">
            {PRESETS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={preset === option.id}
                onClick={() => setPreset(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.specimenGroup}>
          <span className={styles.label}>Dissolve</span>
          <span className={styles.seed}>{dissolve}%</span>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() =>
              setDissolve((value) => (value >= 80 ? 20 : value + 10))
            }
          >
            More cells ↻
          </button>
        </div>

        <p className={styles.specimenNote}>
          Scroll it into view. The painting dissolves into the field by an
          ordered dither, the wordmark resolves out of the same cells, and the
          flourish writes through it.
        </p>
      </div>

      <div className={styles.specimenStage}>
        <WildHuntFooter
          wordmark="HUGINN"
          image={{
            src: '/brand/huginn/asgardsreien-1872.jpg',
            alt: 'Åsgårdsreien, the Wild Hunt of Odin, by Peter Nicolai Arbo, 1872',
            position: '50% 26%',
            cutout: '/brand/huginn/asgardsreien-riders.webp',
          }}
          imageHeight={0.62}
          dissolve={dissolve / 100}
          tagline="Thought flies out at dawn · over the whole of the world · and is back by supper"
          sideNote="Founded 2019 · Oslo & Reykjavík · a studio for slow software"
          preset={preset}
          tracking={2}
          grain={0.55}
          height="min(92svh, 780px)"
          fontFamily="var(--hg-font-mono)"
          monoFamily="var(--hg-font-mono)"
          columns={[
            {
              title: 'Work',
              links: [
                { label: 'Index', href: '#cell' },
                { label: 'Archive', href: '#marks' },
                { label: 'Journal', href: '#type' },
              ],
            },
            {
              title: 'Studio',
              links: [
                { label: 'About', href: '#cell' },
                { label: 'Process', href: '#dissolve' },
                { label: 'Careers', href: '#audit' },
              ],
            },
            {
              title: 'Elsewhere',
              links: [
                { label: 'Instagram', href: '#surface' },
                { label: 'Are.na', href: '#surface' },
                { label: 'GitHub', href: '#surface' },
              ],
            },
            {
              title: 'Contact',
              links: [
                {
                  label: 'hello@huginn.studio',
                  href: 'mailto:hello@huginn.studio',
                },
                { label: '+47 22 00 41 00', href: 'tel:+4722004100' },
              ],
            },
          ]}
          colophon="Painting: Peter Nicolai Arbo, Åsgårdsreien (The Wild Hunt of Odin), 1872. Nasjonalmuseet, Oslo. Public domain. The blackletter is drawn in cells; nothing on this sheet is a font."
          legal="© 2026 Huginn Studio"
          backToTop
          sigils
          interactive
        />
      </div>
    </div>
  )
}
