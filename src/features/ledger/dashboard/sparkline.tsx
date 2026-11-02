/**
 * A 64×20 inline sparkline. No chart library, no client JS: the whole thing is
 * one path, so it prints, screenshots and survives scripts-off.
 */
export function Sparkline({
  data,
  className,
  width = 64,
  height = 20,
}: {
  data: readonly number[];
  className?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * step;
    const y = height - 1 - ((value - min) / span) * (height - 2);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  const line = `M${points.join(" L")}`;
  const area = `${line} L${width} ${height} L0 ${height} Z`;

  // Deterministic id: the same series always gets the same gradient.
  let hash = 0;
  for (const value of data) hash = (hash * 31 + value) % 100000;
  const gradientId = `spark-${hash}`;

  return (
    <svg
      aria-hidden
      className={className}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}
