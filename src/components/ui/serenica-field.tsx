"use client"

// The live field — the same six ridges the footer holds still, painted per
// pixel into offscreen canvases and composited. It is the page's opening
// specimen: the range rises once on arrival, then the pointer moves the
// layers apart by depth. Nothing glows, nothing blurs: the inks are flat and
// the only motion is parallax, so a screenshot is a finished print.
//
//   hero: C · relation below — the field is the artwork, the type sits under it

import * as React from "react"
import {
  mrfClamp,
  mrfCrestAt,
  mrfEase,
  mrfHex,
  mrfLayerSpec,
  mrfNoiseTable,
  mrfPaintLayer,
  type MrfPaintOptions,
} from "./meadow-rise-footer"

export type FieldTheme = "day" | "night" | "auto"

interface FieldProps {
  seed?: number
  theme?: FieldTheme
  /** CSS height of the stage. */
  height?: string
  /** Shown bottom-left on the plate. "" hides the stamp. */
  stamp?: string
  className?: string
}

const DAY = {
  sky: "#E9ECE3",
  haze: "#E9ECE3",
  ink: "#11140D",
  hills: [
    ["#C4CDB8", "#AEBBA0"],
    ["#9DAE84", "#6E8257"],
    ["#7D8F63", "#4A5F2B"],
    ["#5E7440", "#374A20"],
    ["#415325", "#25330F"],
    ["#2C3B1B", "#161E0E"],
  ] as [string, string][],
}

const NIGHT = {
  sky: "#0F1611",
  haze: "#16211A",
  ink: "#E7EBE1",
  hills: [
    ["#3A4A38", "#2E3D2D"],
    ["#2C3B2B", "#22301F"],
    ["#22301F", "#1A2618"],
    ["#1A2618", "#141E13"],
    ["#141E13", "#0F1710"],
    ["#0F1710", "#0A100B"],
  ] as [string, string][],
}

export default function SerenicaField({ seed = 3, theme = "day", height = "clamp(360px, 56vh, 560px)", stamp = "", className = "" }: FieldProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const [scope, setScope] = React.useState<FieldTheme>(theme)

  // "auto" follows the page's own scope attribute, the way the footer does.
  React.useEffect(() => {
    if (theme !== "auto") {
      setScope(theme)
      return
    }
    const read = () => {
      const host = hostRef.current
      const night = !!host && (host.closest("[data-sr='night']") !== null || document.documentElement.classList.contains("dark"))
      setScope(night ? "night" : "day")
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    if (hostRef.current?.parentElement) mo.observe(hostRef.current.parentElement, { attributes: true, attributeFilter: ["data-sr"] })
    const root = hostRef.current?.closest("[data-sr]")
    if (root) mo.observe(root, { attributes: true, attributeFilter: ["data-sr"] })
    return () => mo.disconnect()
  }, [theme])

  React.useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const P = scope === "night" ? NIGHT : DAY
    const rgb = (c: string) => mrfHex(c) || [0, 0, 0]
    const skyC = rgb(P.sky)
    const hazeC = rgb(P.haze)
    const inkC = rgb(P.ink)
    const hillC = P.hills.map((h) => [rgb(h[0]), rgb(h[1])])
    const css = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
    const n = hillC.length
    const noise = mrfNoiseTable(seed)
    const specs = hillC.map((_, i) => mrfLayerSpec(i, n, seed))
    const MX = 30

    let W = 1
    let H = 1
    let cs = 1
    type Layer = { c: HTMLCanvasElement; top: number; w: number; h: number }
    let layers: (Layer | null)[] = []
    let built = ""
    let raf = 0
    let start = 0
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    let last = 0

    const build = () => {
      layers = specs.map((spec, i) => {
        let minC = Infinity
        for (let x = -MX; x <= W + MX; x += 3) minC = Math.min(minC, mrfCrestAt(spec, x, W, H))
        const top = Math.floor(minC - 4)
        const s = Math.min(window.devicePixelRatio || 1, spec.q > 0.5 ? 1.5 : 1.1)
        const w = Math.ceil((W + MX * 2) * s)
        const h = Math.ceil((H - top) * s)
        const c = document.createElement("canvas")
        const g = h > 0 ? c.getContext("2d") : null
        if (!g) return null
        c.width = w
        c.height = h
        let detailTo = H
        if (i + 1 < n) {
          let maxC = -Infinity
          for (let x = -MX; x <= W + MX; x += 3) maxC = Math.max(maxC, mrfCrestAt(specs[i + 1], x, W, H))
          detailTo = Math.min(detailTo, maxC + 60)
        }
        const o: MrfPaintOptions = {
          s,
          mx: MX,
          top,
          W,
          H,
          spec,
          lit: hillC[i][0],
          shadow: hillC[i][1],
          haze: hazeC,
          noise,
          flat: 0.55,
          detailTo,
        }
        const img = g.createImageData(w, h)
        mrfPaintLayer(img.data, w, h, o)
        g.putImageData(img, 0, 0)
        return { c, top, w: w / s, h: h / s }
      })
    }

    const draw = (now: number) => {
      ctx.setTransform(cs, 0, 0, cs, 0, 0)
      ctx.fillStyle = css(skyC)
      ctx.fillRect(0, 0, W, H)

      const t = start ? now - start : 0
      for (let i = 0; i < n; i++) {
        const L = layers[i]
        if (!L) continue
        const e = reduced ? 1 : mrfEase((t - i * 90) / 1200)
        const rise = (1 - e) * H * (0.16 + 0.05 * i)
        const lx = -px * (2 + i * 5)
        const ly = -py * (1 + i * 2)
        ctx.globalAlpha = e < 0.02 ? 0 : 1
        ctx.drawImage(L.c, -MX + lx, L.top + rise + ly, L.w, L.h)
      }
      ctx.globalAlpha = 1
      // ground line: the nearest ridge stops hard, as print does
      ctx.fillStyle = css(hillC[n - 1][1])
      ctx.fillRect(0, H - 1, W, 1)
    }

    const tick = (now: number) => {
      raf = 0
      px += (tx - px) * 0.07
      py += (ty - py) * 0.07
      const moving = Math.abs(tx - px) > 0.0005 || Math.abs(ty - py) > 0.0005
      const rising = start > 0 && now - start < 1900
      if (rising || moving || now - last > 40) {
        draw(now)
        last = now
      }
      if (rising || moving) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const measure = () => {
      W = Math.max(1, host.clientWidth)
      H = Math.max(1, host.clientHeight)
      cs = Math.min(window.devicePixelRatio || 1, 2)
      const cw = Math.round(W * cs)
      const ch = Math.round(H * cs)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }
      const sig = `${W}x${H}`
      if (sig !== built) {
        built = sig
        build()
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      tx = mrfClamp((e.clientX - r.left) / Math.max(1, r.width)) - 0.5
      ty = mrfClamp((e.clientY - r.top) / Math.max(1, r.height)) - 0.5
      wake()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      wake()
    }

    measure()
    draw(performance.now())

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !start) {
          start = performance.now()
          wake()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(host)
    const ro = new ResizeObserver(() => {
      measure()
      draw(performance.now())
    })
    ro.observe(host)
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
    }
  }, [seed, scope])

  return (
    <div ref={hostRef} className={`sr-field ${className}`} style={{ height }}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {stamp ? <span className="sr-field__stamp">{stamp}</span> : null}
    </div>
  )
}
