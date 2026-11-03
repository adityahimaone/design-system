'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/* ── the curved row ──────────────────────────────────────────────
 * One row of tiles streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end tile curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * strips sit still inside their tile, each turned its own few degrees
 * round the cylinder's axis, and the tile (preserve-3d) is what moves: one
 * rotateY about that same axis carries the whole tile along the arc. A
 * tile is one animation, so its strips can never drift apart or show
 * different images. Only a tile's delay differs, and that sets where on
 * the arc it sits. The band is transform-only on the compositor; the fade
 * is a static mask over it.
 *
 * The only JS is a ResizeObserver that sizes the loop, and a handler that
 * hands a tile its next image each time it wraps, out of sight.
 * ─────────────────────────────────────────────────────────────── */

const SLICES = 16

/**
 * Camera distance, in cylinder radii.
 *
 * A tile sitting at angle θ projects to a width proportional to
 *
 *   C · [(C − 1 + cosθ)·cosθ + sin²θ] / (C − 1 + cosθ)²
 *
 * and that factor is what makes or breaks the row. At C = 1.6 a tile at the
 * 64° bend projects 1.9× wider than the same tile at the centre: the ends
 * balloon, their neighbours look shrunken beside them, and because the gap
 * is an arc it swells with the tile — the band stops reading as one ribbon
 * and starts reading as scattered cards that collide. Solving for the C at
 * which a tile projects the same width at 0° as at the bend gives C ≈ 2.8;
 * across the whole sweep the factor then varies by under 1%, so every tile
 * keeps its size and every gap keeps its width, at any viewport.
 */
const CAMERA = 2.8

/**
 * Cylinder radius, as a share of the hero's width, that puts the frame's
 * edge `bend` radians round the arc as seen through the camera:
 * r·sinθ · CAMERA / (CAMERA − 1 + cosθ) = width / 2, solved for r.
 */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend))
}

// A tile is never wider than this share of the hero, so a phone still
// shows its neighbours instead of one tile edge to edge.
const MAX_WIDTH = 55

// Below NARROW the band gets a smaller tile and a gentler bend; below PHONE
// it also lifts, because the content stacks and the only clear lane is
// between the headline and the paragraph. At full strength on an 820px
// tablet a single cover fills half the frame and reads as an accident.
const NARROW = 940
const PHONE = 700

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number
) {
  const narrow = width < NARROW
  const phone = width < PHONE
  const t = tile * (phone ? 0.64 : narrow ? 0.72 : 1)
  const b = narrow ? Math.min(bend, (50 * Math.PI) / 180) : bend
  const h = Math.min((t / 100) * height, ((MAX_WIDTH / 100) * width) / aspect)
  const radius = width * arc(b)
  const flat = { columns: 4, sweep: 0, unit: 0, limit: 0, tile: t, bend: b, phone }
  if (!(h > 0) || !(radius > 0)) return flat
  const deg = (rad: number) => (rad * 180) / Math.PI
  const unit = deg(h / radius)
  const pitch = (aspect + gap / 100) * unit
  const limit = deg(b) + (aspect * unit) / 2
  // Coverage, not span. Tiles run from −sweep to +sweep, so at either end of
  // the cycle one side of the row is a whole pitch short of the frame — the
  // hole then travels across the band as the row advances, which reads as a
  // gap that opens and closes. Two reserve tiles, one per end, keep the
  // frame filled at every phase.
  const columns = Math.min(60, Math.max(4, Math.ceil((2 * deg(b)) / pitch) + 2))
  const round = (n: number) => +n.toFixed(4)
  const sweep = round((columns * pitch) / 2)
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
    tile: t,
    bend: b,
    phone,
  }
}

export type TiltedGridImage = {
  src: string
  /** Only used if you drop the decorative treatment; the band is aria-hidden. */
  alt?: string
}

export type TiltedGridHeroProps = {
  /** Images run along the row in order. Short lists simply repeat. */
  images: TiltedGridImage[]
  /** Seconds for the row to advance by one tile. @default 4 */
  speed?: number
  /** Tile height, as a percentage of the hero's height. @default 26 */
  tileHeight?: number
  /** Tile width divided by tile height. @default 16 / 9 */
  aspectRatio?: number
  /** Space between tiles, as a percentage of a tile's height. @default 6 */
  gap?: number
  /** Vertical centre of the row, as a percentage of the hero's height. @default 56 */
  axis?: number
  /** How far the row has bent round by the frame's edge, in degrees. @default 80 */
  curve?: number
  /** Width of the fade at each end, as a percentage of the hero's width. @default 12 */
  fade?: number
  /** Content rendered above the band. */
  children?: React.ReactNode
  className?: string
}

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const bandRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const orbit = `tgh-o-${id}`
  const tile = `tgh-t-${id}`
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180

  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(null)
  const [shown, setShown] = React.useState<Record<number, number>>({})

  // The band is its own size container, so a caller can give it a lane of its
  // own and the tiles will size to that lane rather than to the whole frame.
  // Measure the band, not the root, or the arc is spaced for the wrong height.
  React.useEffect(() => {
    const el = bandRef.current ?? ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend)
      setLayout((prev) =>
        prev?.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit
          ? prev
          : next
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [tileHeight, aspectRatio, gap, bend])

  // Fetch every image up front. A tile picks up its next one just before
  // it comes back into view, too late to start loading it then.
  React.useEffect(() => {
    for (const { src } of images) new Image().src = src
  }, [images])

  // Every tile is placed by its own negative delay, so the row is only a row if
  // every tile's animation started on the same frame. Mounting a provisional
  // count and then adding the tiles the real measurement asks for breaks that:
  // the late arrivals start a second or two behind, and their neighbours ride
  // closer to them than the pitch allows — one gap pinched shut, and it moves
  // as the row advances. So nothing is rendered until the band has been
  // measured; the band is already faded out until then, and the whole row
  // mounts in one commit, on one frame, at one start time.
  const ready = layout !== null

  const { columns, sweep, unit, limit, tile: tileSize, bend: bent, phone } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend)

  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileSize}cqh, ${+((MAX_WIDTH / aspectRatio).toFixed(4))}cqw))`

  const r = 100 * arc(bent)
  const axisAt = phone ? +(axis * 1).toFixed(3) : axis
  const radius = `${+r.toFixed(3)}cqw`
  const turn = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4)
  const duration = columns * speed
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    // A page-level `prefers-reduced-motion` reset — the `animation-duration:
    // 0.001ms !important` most systems ship — collapses every tile back to its
    // untransformed box, which stacks the whole row on one spot: the band
    // becomes a pile of covers rather than a curve. Give the tiles their own
    // duration back and hold them still instead. Paused at its own delay each
    // tile is already at its angle, so the band freezes as a finished still —
    // the still frame is the design, not an accident. The duration travels in
    // `--tgh-dur`, which the reset does not touch, and `.tgh__band .tile`
    // outranks the reset's `.page *`.
    `@media(prefers-reduced-motion:reduce){.tgh__band .${tile}{` +
    `animation-duration:var(--tgh-dur)!important;` +
    `animation-iteration-count:infinite!important;` +
    `animation-play-state:paused!important}}`

  const share = aspectRatio / SLICES
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`

  return (
    <div
      ref={ref}
      className={cn('tgh', className)}
      {...props}
      style={{ containerType: 'inline-size', ...props.style }}
    >
      <style>{css}</style>

      <div
        ref={bandRef}
        aria-hidden
        className="tgh__band"
        style={{
          opacity: layout ? 1 : 0,
          containerType: 'size',
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axisAt}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {ready &&
          Array.from({ length: columns }, (_, t) => {
            const first = columns - 1 - t
            const img = images[(shown[t] ?? first) % Math.max(images.length, 1)]
            return (
              <div
                key={t}
                className={cn(tile, 'tgh__tile')}
                style={
                  {
                    '--tgh-dur': `${duration}s`,
                    left: `calc(50% - ${u(aspectRatio / 2)})`,
                    top: `calc(${axisAt}% - ${u(0.5)})`,
                    width: u(aspectRatio),
                    height: u(1),
                    transformStyle: 'preserve-3d',
                    animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
                  } as React.CSSProperties
                }
                onAnimationIteration={(e) => {
                  const lap = Math.round(e.elapsedTime / duration)
                  setShown((prev) => {
                    const next = lap * columns + first
                    return prev[t] === next ? prev : { ...prev, [t]: next }
                  })
                }}
              >
                {Array.from({ length: SLICES }, (_, k) => (
                  <div
                    key={k}
                    className={cn(
                      'tgh__slice',
                      k === 0 && 'tgh__slice--first',
                      k === SLICES - 1 && 'tgh__slice--last'
                    )}
                    style={{
                      left: u((aspectRatio - share) / 2),
                      width: k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                      height: u(1),
                      transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                    }}
                  >
                    {img ? (
                      <img
                        src={img.src}
                        alt={k === 0 ? (img.alt ?? '') : ''}
                        draggable={false}
                        className="tgh__img"
                        style={{
                          left: u(-k * share),
                          width: u(aspectRatio),
                          height: u(1),
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            )
          })}
      </div>

      {children}
    </div>
  )
}

export default TiltedGridHero
