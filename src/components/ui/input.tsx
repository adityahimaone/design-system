import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 bg-transparent px-0 py-2 text-[15px] text-foreground",
        "border-0 border-b border-input",
        "transition-colors duration-200 outline-none",
        "placeholder:text-muted-foreground/70",
        "selection:bg-accent selection:text-accent-foreground",
        "focus-visible:border-b-2 focus-visible:border-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
