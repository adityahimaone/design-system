"use client";

import { Button } from "@/features/ledger/ui/button";
import { Separator } from "@/features/ledger/ui/separator";
import { AppBreadcrumbs } from "@/features/ledger/dashboard/shell/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/features/ledger/dashboard/shell/sidebar-trigger";
import { navLinks } from "@/features/ledger/dashboard/shell/app-shared";
import { NavUser } from "@/features/ledger/dashboard/shell/nav-user";
import { ThemeToggle } from "@/features/ledger/dashboard/shell/theme-toggle";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

export function AppHeader({ pathname }: { pathname?: string }) {
  const activeItem = navLinks.find((item) => item.path === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-border/50 border-b bg-background/70 px-4 backdrop-blur-md md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <CustomSidebarTrigger />
        <Separator
          className="mx-1 h-4 bg-border/70 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-2 py-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em] sm:inline-flex">
          <span className="size-1.5 rounded-full bg-signal" />
          Live
        </span>
        <ThemeToggle />
        <Button
          aria-label="Notifications"
          className="relative size-8 text-muted-foreground transition-colors duration-200 hover:text-foreground"
          size="icon"
          variant="ghost"
        >
          <IconPlaceholder
            hugeicons="Notification03Icon"
            lucide="BellIcon"
            phosphor="BellIcon"
            remixicon="RiNotification3Line"
            tabler="IconBell"
          />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-signal ring-2 ring-background" />
        </Button>
        <Separator
          className="mx-1 h-4 bg-border/70 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  );
}
