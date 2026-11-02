import type { SVGProps } from 'react'

/**
 * The mark inline, so the header and the footer never wait for an image. The
 * block is the current ink; the threshold is the mark accent — gold on the
 * stage, gold ink on vellum. The stage passes its own gold explicitly, because
 * its palette is a prop rather than the page tokens.
 */
export function PorphyryMark({
  size = 28,
  title,
  accent = 'var(--po-mark-accent)',
  compact = false,
  ...rest
}: {
  size?: number
  title?: string
  accent?: string
  compact?: boolean
} & SVGProps<SVGSVGElement>) {
  const block = compact ? 'M10 6H44L54 16V58H10V6Z' : 'M12 6H44L52 14V58H12V6Z'
  const opening = compact ? 'M20 44L26 14H38L44 44Z' : 'M22 44L27 14H37L42 44Z'
  const threshold = compact
    ? { x: 20, width: 24, height: 9 }
    : { x: 22, width: 20, height: 8 }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" fillRule="evenodd" d={`${block} ${opening}`} />
      <rect
        x={threshold.x}
        y={44}
        width={threshold.width}
        height={threshold.height}
        fill={accent}
      />
    </svg>
  )
}

/** The one-ink glyph: the block and its opening, with the threshold removed. */
export function PorphyryGlyph({
  size = 28,
  title,
  ...rest
}: { size?: number; title?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 6H44L52 14V58H12V6ZM22 44L27 14H37L42 44Z"
      />
    </svg>
  )
}
