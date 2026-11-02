'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type Datum = { label: string; value: number }

const PAD = { top: 14, right: 10, bottom: 26, left: 46 }

/**
 * Round a max up to the next step on a 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 8 / 10
 * ladder. A coarser ladder (1/2/5) put a 4.8% return rate on a 0–10% axis and
 * flattened the line into the baseline.
 */
function niceCeil(value: number): number {
  if (value <= 0) return 1
  const exponent = Math.floor(Math.log10(value))
  const magnitude = 10 ** exponent
  const normalised = value / magnitude
  const ladder = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
  const step = ladder.find((candidate) => normalised <= candidate) ?? 10
  return step * magnitude
}

/**
 * Monotone cubic (Fritsch–Carlson). A plain Catmull-Rom overshoots on a series
 * that flattens out, which draws revenue below zero; this one cannot overshoot.
 */
function monotonePath(points: { x: number; y: number }[]): string {
  const n = points.length
  if (n < 2) return ''

  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i += 1) {
    dx[i] = points[i + 1].x - points[i].x
    slope[i] = (points[i + 1].y - points[i].y) / (dx[i] || 1)
  }

  const tangent: number[] = [slope[0]]
  for (let i = 1; i < n - 1; i += 1) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent[i] = 0
    } else {
      tangent[i] = (slope[i - 1] + slope[i]) / 2
    }
  }
  tangent[n - 1] = slope[n - 2]

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < n - 1; i += 1) {
    const third = dx[i] / 3
    const c1x = points[i].x + third
    const c1y = points[i].y + tangent[i] * third
    const c2x = points[i + 1].x - third
    const c2y = points[i + 1].y - tangent[i + 1] * third
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${points[i + 1].x.toFixed(2)} ${points[i + 1].y.toFixed(2)}`
  }
  return d
}

/**
 * A hand-drawn area chart.
 *
 * No chart library: the system's whole argument is that the surface carries the
 * information, and a 120 KB dependency to draw one monotone line was the wrong
 * trade. This renders at real pixel sizes (ResizeObserver, not a scaled
 * viewBox), so the 10px mono ticks stay 10px.
 */
export function AreaChart({
  data,
  height = 260,
  label,
  className,
  formatY,
  formatValue,
  formatX,
}: {
  data: readonly Datum[]
  height?: number
  label: string
  className?: string
  formatY: (value: number) => string
  formatValue: (value: number) => string
  formatX: (label: string, index: number) => string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const gradientId = `lg-area-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0
      setWidth(Math.round(next))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const geo = useMemo(() => {
    if (!width || data.length < 2) return null

    const innerW = Math.max(24, width - PAD.left - PAD.right)
    const innerH = Math.max(24, height - PAD.top - PAD.bottom)
    const maxValue = Math.max(...data.map((d) => d.value))
    const ceiling = niceCeil(maxValue * 1.06)

    const px = (index: number) =>
      PAD.left + (index / (data.length - 1)) * innerW
    const py = (value: number) =>
      PAD.top + innerH - (value / ceiling) * innerH

    const points = data.map((datum, index) => ({
      ...datum,
      x: px(index),
      y: py(datum.value),
    }))

    const line = monotonePath(points)
    const baseline = PAD.top + innerH
    const area = `${line} L ${points[points.length - 1].x.toFixed(2)} ${baseline} L ${points[0].x.toFixed(2)} ${baseline} Z`

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
      value: ceiling * ratio,
      y: py(ceiling * ratio),
    }))

    const wanted = Math.max(3, Math.min(7, Math.floor(innerW / 92)))
    const step = Math.max(1, Math.round((data.length - 1) / (wanted - 1)))
    const xTicks: number[] = []
    for (let i = 0; i < data.length; i += step) xTicks.push(i)
    const last = data.length - 1
    if (xTicks[xTicks.length - 1] !== last) xTicks.push(last)

    return { innerW, innerH, points, line, area, baseline, yTicks, xTicks }
  }, [width, height, data])

  const activePoint = active !== null ? geo?.points[active] : undefined

  return (
    <div
      className={cn('relative w-full', className)}
      ref={wrapRef}
      style={{ height }}
    >
      {geo ? (
        <>
          <svg
            aria-label={label}
            className="block h-full w-full overflow-visible"
            height={height}
            onPointerLeave={() => setActive(null)}
            onPointerMove={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              const local = event.clientX - box.left - PAD.left
              const ratio = local / geo.innerW
              const index = Math.round(ratio * (data.length - 1))
              setActive(Math.max(0, Math.min(data.length - 1, index)))
            }}
            role="img"
            width={width}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.26" />
                <stop offset="55%" stopColor="var(--chart-1)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {geo.yTicks.map((tick) => (
              <text
                className="fill-muted-foreground font-mono text-[10px] tracking-[0.08em]"
                dominantBaseline="middle"
                key={tick.y}
                textAnchor="end"
                x={PAD.left - 8}
                y={tick.y}
              >
                {formatY(tick.value)}
              </text>
            ))}

            <path d={geo.area} fill={`url(#${gradientId})`} />
            <path
              d={geo.line}
              fill="none"
              stroke="var(--chart-1)"
              strokeLinecap="round"
              strokeWidth={1.75}
            />
            <line
              stroke="var(--border)"
              strokeWidth={1}
              x1={PAD.left}
              x2={width - PAD.right}
              y1={geo.baseline}
              y2={geo.baseline}
            />

            {geo.xTicks.map((index) => (
              <text
                className="fill-muted-foreground font-mono text-[10px] tracking-[0.08em]"
                key={index}
                textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
                x={geo.points[index].x}
                y={height - 6}
              >
                {formatX(data[index].label, index)}
              </text>
            ))}

            {activePoint ? (
              <g>
                <line
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={PAD.top}
                  y2={geo.baseline}
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill="var(--chart-1)"
                  r={3.5}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              </g>
            ) : null}
          </svg>

          {activePoint ? (
            <div
              className="glass-float pointer-events-none absolute top-2 z-10 min-w-36 rounded-lg px-3 py-2"
              style={{
                left: Math.min(
                  Math.max(activePoint.x - 72, 4),
                  Math.max(width - 148, 4),
                ),
              }}
            >
              <p className="font-medium text-xs">
                {formatX(activePoint.label, active ?? 0)}
              </p>
              <div className="mt-1 flex items-center justify-between gap-6">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-0.5 w-3 rounded-full bg-chart-1" />
                  {label}
                </span>
                <span className="fig text-[11px] font-medium">
                  {formatValue(activePoint.value)}
                </span>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
