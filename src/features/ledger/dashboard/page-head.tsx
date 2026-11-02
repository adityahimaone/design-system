import { Button } from "@/features/ledger/ui/button";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

export function PageHead() {
  return (
    <div className="flex flex-col gap-4 pt-1 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
          Overview · 30 Sep — 30 Oct
        </p>
        <h1 className="text-[26px] font-semibold leading-none tracking-[-0.025em] md:text-[30px]">
          Commerce overview
        </h1>
        <p className="max-w-lg text-pretty text-[13px] text-muted-foreground">
          Revenue, returns and category mix across the storefront. Figures are
          gross, net of refunds, in USD.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="h-8 cursor-pointer gap-1.5 border-border/60 bg-background/40 text-xs backdrop-blur-sm"
          size="sm"
          variant="outline"
        >
          Last 30 days
          <IconPlaceholder
            className="size-3.5 text-muted-foreground"
            lucide="ChevronDownIcon"
          />
        </Button>
        <Button className="h-8 cursor-pointer gap-1.5 text-xs" size="sm">
          Export
          <IconPlaceholder className="size-3.5" lucide="DownloadIcon" />
        </Button>
      </div>
    </div>
  );
}
