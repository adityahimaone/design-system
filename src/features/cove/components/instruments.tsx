import type { Reading } from '../cove-data'
import styles from '../cove.module.css'

/* ---------- geometry ---------- */

type Point = { x: number; y: number }

function buildPoints(
  values: readonly number[],
  width: number,
  height: number,
  pad: number,
): Point[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  return values.map((value, index) => ({
    x: pad + (innerW * index) / (values.length - 1),
    y: pad + innerH - ((value - min) / span) * innerH,
  }))
}

function linePath(points: Point[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
}

/* ---------- sparkline: twenty-four points, no axes ---------- */

export function Sparkline({
  values,
  width = 320,
  height = 80,
  pad = 6,
  label,
}: {
  values: readonly number[]
  width?: number
  height?: number
  pad?: number
  label: string
}) {
  const points = buildPoints(values, width, height, pad)
  const last = points[points.length - 1]

  return (
    <svg
      className={styles.spark}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <path
        d={linePath(points)}
        fill="none"
        stroke="var(--cv-signal)"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r={2.5} fill="var(--cv-signal)" />
    </svg>
  )
}

/* ---------- the tide chart: the one place with a baseline ---------- */

export function TideChart({
  values,
  threshold = 1.2,
  width = 640,
  height = 216,
  pad = 18,
}: {
  values: readonly number[]
  threshold?: number
  width?: number
  height?: number
  pad?: number
}) {
  const points = buildPoints(values, width, height, pad)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const yFor = (v: number) =>
    pad + (height - pad * 2) - ((v - min) / span) * (height - pad * 2)

  const line = linePath(points)
  const area = `${line} L${points[points.length - 1].x.toFixed(2)} ${height - pad} L${points[0].x.toFixed(2)} ${height - pad} Z`
  const thresholdY = yFor(threshold)

  return (
    <svg
      className={styles.tideChartSvg}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="A fixed twenty-four hour water-level sample, peaking at 1.36 metres at 08:00 and turning again at 17:00. The 1.20 metre threshold is crossed twice."
      preserveAspectRatio="none"
    >
      {/* A flat 8% wash, not a gradient: the water column, not a highlight. */}
      <path d={area} fill="var(--cv-signal)" opacity={0.08} />
      <line
        x1={pad}
        y1={thresholdY}
        x2={width - pad}
        y2={thresholdY}
        stroke="var(--cv-alarm)"
        strokeWidth={1}
        strokeDasharray="4 4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={line}
        fill="none"
        stroke="var(--cv-signal)"
        strokeWidth={1.5}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={points[8].x}
        cy={points[8].y}
        r={3}
        fill="var(--cv-signal)"
      />
      <text
        x={pad}
        y={thresholdY - 7}
        fill="var(--cv-alarm)"
        fontSize={10}
        fontFamily="var(--cv-font-mono)"
        letterSpacing="0.08em"
      >
        1.20 THRESHOLD
      </text>
    </svg>
  )
}

/* ---------- gauge: a rail, not a dial ---------- */

const RANGES: Record<string, number> = {
  level: 2,
  swell: 2,
  period: 16,
  temp: 20,
  wind: 40,
}

export function Gauge({
  value,
  max,
  threshold,
  unit,
  time,
  label,
  alarm = false,
}: {
  value: number
  max: number
  threshold: number
  unit: string
  time: string
  label: string
  alarm?: boolean
}) {
  const fill = Math.min(1, Math.max(0.02, value / max))
  const tick = Math.min(1, Math.max(0, threshold / max))

  return (
    <div className={styles.gauge}>
      <div
        className={styles.gaugeRail}
        role="img"
        aria-label={`${label}: ${value} ${unit} of a ${max} ${unit} range, threshold ${threshold} ${unit}`}
      >
        <span
          className={styles.gaugeFill}
          style={{
            height: `${fill * 100}%`,
            background: alarm ? 'var(--cv-alarm)' : undefined,
          }}
        />
        <span
          className={styles.gaugeTick}
          style={{ bottom: `${tick * 100}%` }}
          aria-hidden
        />
      </div>
      <div className={styles.gaugeRead}>
        <strong>{value}</strong>
        <span>{unit}</span>
        <em>{alarm ? `over ${threshold}` : time}</em>
      </div>
    </div>
  )
}

/* ---------- reading card ---------- */

function direction(delta: string, state: Reading['state']) {
  if (state === 'alarm') return 'alarm'
  if (delta.startsWith('+')) return 'up'
  if (delta.startsWith('−') || delta.startsWith('-')) return 'down'
  return 'flat'
}

export function ReadingCard({ reading }: { reading: Reading }) {
  const max = RANGES[reading.id] ?? 2
  const fill = Math.min(1, Math.max(0.02, Number(reading.value) / max))
  const dir = direction(reading.delta, reading.state)

  return (
    <article className={styles.reading}>
      <div className={styles.readingTop}>
        <span className={styles.readingLabel}>{reading.label}</span>
        <span
          className={[
            styles.dot,
            reading.state === 'slack' ? styles.dotSlack : '',
            reading.state === 'alarm' ? styles.dotAlarm : '',
            reading.state === 'live' ? styles.liveDot : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden
        />
      </div>
      <p className={styles.readingValue}>
        <strong>{reading.value}</strong>
        <span>{reading.unit}</span>
      </p>
      <div className={styles.readingRail} aria-hidden>
        <i
          style={{ width: `${fill * 100}%` }}
          data-state={reading.state}
        />
      </div>
      <div className={styles.readingFoot}>
        <span>{reading.time}</span>
        <span className={styles.readingDelta} data-dir={dir}>
          {reading.delta}
        </span>
      </div>
    </article>
  )
}

/* ---------- threshold alert ---------- */

export function Alert({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className={styles.alert} role="status">
      <span className={`${styles.dot} ${styles.dotAlarm}`} aria-hidden />
      <div>
        <b>{title}</b>
        <p>{body}</p>
      </div>
    </div>
  )
}
