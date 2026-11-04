import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* ── Command ───────────────────────────────────────────────────────────────
   shadcn's Command is normally a wrapper around cmdk. cmdk is not in this
   project's dependency set, so the same contract is implemented here on Radix
   Dialog plus a small match registry: items self-report whether they satisfy
   the query, which lets <CommandEmpty> know when the whole list is dry.

   API kept identical to shadcn's so a future `npx shadcn add command` is a
   drop-in replacement: Command, CommandDialog, CommandInput, CommandList,
   CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut.
                                                                              */

type Ctx = {
  query: string
  setQuery: (v: string) => void
  count: number
  report: (id: string, matched: boolean) => void
}

const CommandContext = React.createContext<Ctx | null>(null)
const GroupContext = React.createContext<{ report: (id: string, matched: boolean) => void } | null>(
  null,
)

/* a tiny set-backed tally shared by <Command> and every <CommandGroup>: items
   self-report, the tally decides whether the empty state or the group heading
   is still worth showing */
function useTally() {
  const [count, setCount] = React.useState(0)
  const set = React.useRef<Set<string>>(new Set())
  const report = React.useCallback((id: string, isMatch: boolean) => {
    const s = set.current
    const had = s.has(id)
    if (isMatch && !had) {
      s.add(id)
      setCount(s.size)
    } else if (!isMatch && had) {
      s.delete(id)
      setCount(s.size)
    }
  }, [])
  return { count, report }
}

function useCommand() {
  const ctx = React.useContext(CommandContext)
  if (!ctx) throw new Error("Command components must be used inside <Command>")
  return ctx
}

function Command({ className, ...props }: React.ComponentProps<"div">) {
  const [query, setQuery] = React.useState("")
  const { count, report } = useTally()

  const ctx = React.useMemo(
    () => ({ query, setQuery, count, report }),
    [query, count, report],
  )

  return (
    <CommandContext.Provider value={ctx}>
      <div
        data-slot="command"
        className={cn("flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground", className)}
        {...props}
      />
    </CommandContext.Provider>
  )
}

function CommandDialog({
  children,
  open,
  onOpenChange,
  title = "Search",
  description = "Jump to a case, a skill or a section",
  hotkey = true,
  className,
  ...props
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  hotkey?: boolean
  className?: string
} & Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "children">) {
  const [inner, setInner] = React.useState(false)
  const isControlled = open !== undefined
  const shown = isControlled ? open : inner
  const setShown = (v: boolean) => {
    if (!isControlled) setInner(v)
    onOpenChange?.(v)
  }

  React.useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShown(!shown)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  return (
    <DialogPrimitive.Root open={shown} onOpenChange={setShown}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-[12vh] left-1/2 z-50 w-[min(680px,calc(100vw-32px))] -translate-x-1/2",
            "border border-border bg-popover text-popover-foreground",
            "max-h-[min(560px,72vh)] overflow-hidden",
            className,
          )}
          {...props}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
          <Command>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function CommandInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const { query, setQuery } = useCommand()
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const t = window.setTimeout(() => ref.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-3 border-b border-border px-5"
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        data-slot="command-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "h-14 w-full bg-transparent text-[15px] text-foreground outline-none",
          "placeholder:text-muted-foreground/70",
          className,
        )}
        {...props}
      />
      <kbd className="hidden shrink-0 border border-border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground sm:block">
        ESC
      </kbd>
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]:not([hidden])'),
    )
    if (!items.length) return
    e.preventDefault()
    const at = items.indexOf(document.activeElement as HTMLElement)
    const next =
      e.key === "ArrowDown"
        ? items[(at + 1) % items.length]
        : items[(at - 1 + items.length) % items.length]
    next?.focus()
  }

  return (
    <div
      data-slot="command-list"
      role="listbox"
      onKeyDown={onKeyDown}
      className={cn("max-h-[min(440px,58vh)] overflow-y-auto overscroll-contain p-2", className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const { count } = useCommand()
  if (count > 0) return null
  return (
    <div
      data-slot="command-empty"
      className={cn(
        "px-4 py-10 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function CommandGroup({
  heading,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { heading?: string }) {
  const { count, report } = useTally()
  const value = React.useMemo(() => ({ report }), [report])

  /* The children stay mounted while the group is hidden, so they can report a
     match and bring the group back. Hiding the whole block (rather than just
     the heading) keeps the list from opening a gap where a group used to be. */
  return (
    <GroupContext.Provider value={value}>
      <div
        data-slot="command-group"
        className={cn("py-1", className)}
        style={count === 0 ? { display: "none" } : undefined}
        {...props}
      >
        {heading ? (
          <div className="px-3 pt-2 pb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    </GroupContext.Provider>
  )
}

function CommandItem({
  value,
  onSelect,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect" | "value"> & {
  value?: string
  onSelect?: (value: string) => void
}) {
  const { query, report } = useCommand()
  const group = React.useContext(GroupContext)
  const id = React.useId()

  const text = String(
    value ?? (typeof children === "string" ? children : ""),
  ).toLowerCase()
  const isMatch = !query.trim() || text.includes(query.trim().toLowerCase())

  React.useEffect(() => {
    report(id, isMatch)
    group?.report(id, isMatch)
  }, [id, isMatch, report, group])

  if (!isMatch) return null

  return (
    <div
      data-slot="command-item"
      role="option"
      aria-selected={false}
      tabIndex={0}
      onClick={() => onSelect?.(value ?? "")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onSelect?.(value ?? "")
        }
      }}
      className={cn(
        "flex cursor-default items-center gap-3 px-3 py-2.5 outline-none select-none",
        "text-[13px] text-foreground",
        "hover:bg-secondary focus:bg-foreground focus:text-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-separator"
      role="separator"
      className={cn("-mx-2 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto font-mono text-[10px] tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
