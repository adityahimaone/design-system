import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Input — the field is a recess in the glass, not another pane of it.
 *
 * State is carried by the border first, the ring second, so the control still
 * reads on a busy field behind a translucent panel.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-foreground/[0.02] px-3 py-1 text-sm shadow-[inset_0_1px_2px_0_rgb(0_0_0/0.04)] transition-[color,background-color,border-color,box-shadow] duration-200 outline-none",
        "placeholder:text-muted-foreground/70 selection:bg-foreground selection:text-background",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
        "hover:border-foreground/20",
        "focus-visible:border-foreground/60 focus-visible:bg-background/60 focus-visible:ring-[3px] focus-visible:ring-foreground/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
        "dark:border-white/12 dark:bg-white/[0.03] dark:hover:border-white/20 dark:focus-visible:border-white/55 dark:focus-visible:bg-white/[0.05] dark:focus-visible:ring-white/15 dark:disabled:bg-white/[0.02]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
