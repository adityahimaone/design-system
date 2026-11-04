import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/* Kanon ships 0px radius and no resting shadow, so the shadcn button recipe is
   stripped back to: one hairline, one accent fill, mono caps. Variants are a
   plain record rather than cva — one fewer dependency for the same result. */

type Variant = "default" | "outline" | "ghost" | "accent" | "link"
type Size = "sm" | "default" | "lg" | "icon"

const VARIANT: Record<Variant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 aria-expanded:bg-primary/90",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
  accent:
    "bg-accent text-accent-foreground hover:brightness-95 aria-expanded:brightness-95",
  link: "bg-transparent text-foreground underline underline-offset-4 hover:no-underline",
}

const SIZE: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[11px]",
  default: "h-10 gap-2 px-4 text-[12px]",
  lg: "h-12 gap-2 px-6 text-[13px]",
  icon: "size-10",
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-mono font-medium uppercase tracking-[0.14em] transition-colors duration-200 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  )
}

export { Button }
export type { Variant as ButtonVariant, Size as ButtonSize }
