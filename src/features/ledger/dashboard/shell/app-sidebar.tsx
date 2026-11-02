"use client";

import { LedgerMark } from "@/features/ledger/brand/ledger-mark";
import { Button } from "@/features/ledger/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/features/ledger/ui/sidebar";
import { NavGroup } from "@/features/ledger/dashboard/shell/nav-group";
import { footerNavLinks, navGroups } from "@/features/ledger/dashboard/shell/app-shared";
import { LatestChange } from "@/features/ledger/dashboard/shell/latest-change";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

export function AppSidebar({ pathname }: { pathname?: string }) {
  return (
    <Sidebar collapsible="icon">
      {/* 56px, same as the top bar: one continuous hairline across the shell. */}
      <SidebarHeader className="h-14 justify-center border-border/50 border-b px-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <SidebarMenuButton
          asChild
          className="h-9 gap-2.5 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
        >
          <a href="#/dashboard">
            <span className="ledger-tile flex size-7 shrink-0 items-center justify-center rounded-[7px]">
              <LedgerMark size={15} />
            </span>
            <span className="font-medium tracking-tight group-data-[collapsible=icon]:hidden">
              Ledger
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-3 group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="p-0">
          <SidebarMenuItem className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              className="min-w-0 flex-1 bg-primary font-medium text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground group-data-[collapsible=icon]:flex-none"
              tooltip="Add product"
            >
              <IconPlaceholder
                hugeicons="PlusSignIcon"
                lucide="PlusIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                tabler="IconPlus"
              />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Add product
              </span>
            </SidebarMenuButton>
            <div className="shrink-0 group-data-[collapsible=icon]:hidden">
              <Button
                aria-label="Search store"
                className="size-8 border-border/60 bg-transparent text-muted-foreground transition-colors duration-200 hover:text-foreground"
                size="icon"
                variant="outline"
              >
                <IconPlaceholder
                  hugeicons="SearchIcon"
                  lucide="SearchIcon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                  tabler="IconSearch"
                />
                <span className="sr-only">Search store</span>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup
            key={`sidebar-group-${index}`}
            {...group}
            pathname={pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-border/50 border-t px-2 pt-3 group-data-[collapsible=icon]:px-0">
        <LatestChange />
        <SidebarMenu className="mt-1">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                isActive={item.path === pathname}
                size="sm"
                tooltip={item.title}
              >
                <a href={item.path}>
                  {item.icon}
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
