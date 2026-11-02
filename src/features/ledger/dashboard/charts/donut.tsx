type Slice = {
  key: string
  category: string
  share: number
  fill: string
}

/**
 * A donut drawn with `stroke-dasharray` on one circle per slice.
 *
 * No library, and no arcs to compute: each slice is a dash of the same circle,
 * offset by everything before it. The 2px gap between slices is the system's
 * hairline, not a padding angle — the same 1px rule the cards use, scaled to
 * the ring.
 */
export function Donut({
  data,
  size = 188,
  thickness = 26,
  label,
  value,
}: {
  data: readonly Slice[]
  size?: number
  thickness?: number
  label?: string
  value?: string
}) {
  const total = data.reduce((sum, slice) => sum + slice.share, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const gap = 2

  let cursor = 0

  return (
    <svg
      aria-label={
        label
          ? `${label}: ${data.map((slice) => `${slice.category} ${slice.share}%`).join(', ')}`
          : undefined
      }
      className="block"
      height={size}
      role="img"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--border)"
          strokeOpacity={0.5}
          strokeWidth={thickness}
        />
        {data.map((slice) => {
          const length = (slice.share / total) * circumference
          const dash = Math.max(0, length - gap)
          const offset = cursor
          cursor += length
          return (
            <circle
              cx={size / 2}
              cy={size / 2}
              fill="none"
              key={slice.key}
              r={radius}
              stroke={slice.fill}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeWidth={thickness}
            />
          )
        })}
      </g>

      {label || value ? (
        <g>
          <text
            className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.12em]"
            textAnchor="middle"
            x={size / 2}
            y={size / 2 - 6}
          >
            {label}
          </text>
          <text
            className="fill-foreground text-[15px] font-semibold"
            textAnchor="middle"
            x={size / 2}
            y={size / 2 + 14}
          >
            {value}
          </text>
        </g>
      ) : null}
    </svg>
  )
}
