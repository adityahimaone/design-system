'use client'

import { DitherShader } from '@/lib/dither'

import { cn } from '@/lib/utils'

import styles from '../vitrine.module.css'

/**
 * The signature dither: a refraction lens. The field is a caustic ring map
 * measured in square units; the colour field runs iris at the core to signal
 * at the rim. It is a field of its own on the dithercn engine — no example was
 * installed, because none of them is a lens case.
 *
 * The hero container masks the left and top so the headline never sits on dots.
 */
const LENS_FIELD = `
float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 c = (uv - vec2(0.60, 0.52)) * vec2(aspect, 1.0);
  float r = length(c);
  float warp = fbm(c * 2.2 + vec2(t * 0.025, t * 0.018));
  float rings = 0.5 + 0.5 * sin(r * 23.0 - t * 0.4 + warp * 4.0);
  float caustic = pow(rings, 2.2);
  float lens = 1.0 - smoothstep(0.28, 0.44, r);
  float rim = 1.0 - smoothstep(0.0, 0.012, abs(r - 0.39));
  float bloom = exp(-dot(c, c) * 9.0);
  float streak = exp(-pow((uv.y - 0.62 + 0.16 * uv.x) * 7.0, 2.0));
  float tone = lens * (0.12 + 0.72 * caustic) + rim * 0.55 + bloom * 0.22 + streak * 0.12;
  tone *= smoothstep(0.0, 0.14, uv.y) * smoothstep(0.0, 0.14, 1.0 - uv.y);
  return clamp(tone, 0.0, 0.92);
}
`

const LENS_COLOR = `
vec3 colorField(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 c = (uv - vec2(0.60, 0.52)) * vec2(aspect, 1.0);
  float r = length(c);
  float mixv = smoothstep(0.08, 0.38, r);
  return mix(paletteColor(0.0).rgb, paletteColor(1.0).rgb, mixv);
}
`

export function DitherLens({ className }: { className?: string }) {
  return (
    <DitherShader
      field={LENS_FIELD}
      colorField={LENS_COLOR}
      palette={['--vt-bg', '--vt-iris', '--vt-signal']}
      matrix="bayer8"
      levels={17}
      cell={4}
      speed={0.7}
      stillTime={6}
      fps={30}
      className={cn(styles.ditherCanvas, className)}
      fallback={<span className={styles.ditherFallback} aria-hidden />}
    />
  )
}
