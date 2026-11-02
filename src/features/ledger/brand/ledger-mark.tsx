/**
 * Ledger mark — the grid holds, one tile floats.
 *
 * Constructed track: three filled cells and one cell lifted off the grid, set
 * in the signal ink so the lift survives at 16px. The gap is 1 unit on a 24-unit
 * box; the lifted tile is 1 unit smaller than its siblings and offset by 1, so
 * it reads as a tile coming off the surface rather than a hole in it.
 *
 * `accent` is the lifted tile only. On the harbor plate it is `--lg-indigo-300`
 * against a white grid; on paper it is the harbor indigo against the ink.
 */
export function LedgerMark({
  className,
  size = 20,
  accent = "var(--lg-indigo-300, currentColor)",
}: {
  className?: string;
  size?: number;
  accent?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="8" rx="2" width="8" x="1" y="1" />
      <rect fill="currentColor" height="8" rx="2" width="8" x="15" y="1" />
      <rect fill="currentColor" height="8" rx="2" width="8" x="1" y="15" />
      <rect fill={accent} height="7" rx="1.75" width="7" x="16" y="16" />
    </svg>
  );
}
