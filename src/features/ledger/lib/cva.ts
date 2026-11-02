/**
 * A 60-line `cva`.
 *
 * The shadcn primitives in this feature were written against
 * `class-variance-authority`, which is a 5 KB dependency for one job: pick a
 * class string from a variant map and merge a base. This repo already carries a
 * Tailwind build and a `cn`; adding another package for a lookup table was not
 * worth the install, so the four components that need it (button, badge, item,
 * sidebar) import this instead.
 *
 * It implements the whole surface those four use — `variants`,
 * `defaultVariants`, `compoundVariants` and `VariantProps` — and nothing else.
 * If a component ever needs real cva (slots, config composition), install the
 * package and delete this file rather than growing it.
 */
type ClassValue = string | null | undefined | false

type VariantMap = Record<string, Record<string, ClassValue>>

type Config<V extends VariantMap> = {
  variants?: V
  defaultVariants?: { [K in keyof V]?: keyof V[K] }
  compoundVariants?: Array<{ [K in keyof V]?: keyof V[K] } & { class?: ClassValue }>
}

type Props<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K]
} & { class?: ClassValue; className?: ClassValue }

export type VariantProps<F> = F extends (props?: infer P) => string
  ? NonNullable<P>
  : never

export function cva<V extends VariantMap>(
  base?: ClassValue,
  config?: Config<V>,
) {
  return (props: Props<V> = {}): string => {
    const out: ClassValue[] = [base]
    const variants = (config?.variants ?? {}) as VariantMap
    const defaults = (config?.defaultVariants ?? {}) as Record<string, unknown>

    for (const [name, values] of Object.entries(variants)) {
      const chosen = (props as Record<string, unknown>)[name] ?? defaults[name]
      if (typeof chosen === 'string' && values[chosen]) {
        out.push(values[chosen])
      }
    }

    for (const compound of config?.compoundVariants ?? []) {
      const { class: cls, ...conditions } = compound
      const matches = Object.entries(conditions).every(
        ([name, value]) =>
          ((props as Record<string, unknown>)[name] ?? defaults[name]) === value,
      )
      if (matches) out.push(cls)
    }

    return out.filter(Boolean).join(' ')
  }
}
