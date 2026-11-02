import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-input bg-foreground/[0.02] px-3 py-2 text-sm shadow-[inset_0_1px_2px_0_rgb(0_0_0/0.04)] transition-[color,background-color,border-color,box-shadow] duration-200 outline-none",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/20",
        "focus-visible:border-foreground/60 focus-visible:bg-background/60 focus-visible:ring-[3px] focus-visible:ring-foreground/15",
        "disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
        "dark:border-white/12 dark:bg-white/[0.03] dark:hover:border-white/20 dark:focus-visible:border-white/55 dark:focus-visible:bg-white/[0.05] dark:focus-visible:ring-white/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
