import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "outline" | "accent" | "solid"

const VARIANT: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground border-transparent",
  outline: "bg-transparent text-muted-foreground border-border",
  accent: "bg-accent text-accent-foreground border-transparent",
  solid: "bg-foreground text-background border-transparent",
}

function Badge({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1 border px-1.5 py-0.5",
        "font-mono text-[9px] leading-none uppercase tracking-[0.16em] whitespace-nowrap",
        "transition-colors duration-200 [&_svg]:size-2.5",
        VARIANT[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
