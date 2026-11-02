import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/ledger/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/features/ledger/ui/item";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

const actions = [
  {
    title: "Add product",
    description: "Create a new SKU.",
    href: "#",
    icon: (
      <IconPlaceholder
        aria-hidden="true"
        hugeicons="Add01Icon"
        lucide="PackagePlusIcon"
        phosphor="PackageIcon"
        remixicon="RiAddBoxLine"
        tabler="IconPackageImport"
      />
    ),
  },
  {
    title: "Review unfulfilled",
    description: "Orders waiting to ship.",
    href: "#",
    icon: (
      <IconPlaceholder
        aria-hidden="true"
        hugeicons="DeliveryTruck01Icon"
        lucide="TruckIcon"
        phosphor="TruckIcon"
        remixicon="RiTruckLine"
        tabler="IconTruckDelivery"
      />
    ),
  },
  {
    title: "Store settings",
    description: "Payments, checkouts etc.",
    href: "#",
    icon: (
      <IconPlaceholder
        aria-hidden="true"
        hugeicons="Settings02Icon"
        lucide="SettingsIcon"
        phosphor="GearSixIcon"
        remixicon="RiSettings3Line"
        tabler="IconSettings"
      />
    ),
  },
  {
    title: "Export sales",
    description: "CSV for accountings.",
    href: "#",
    icon: (
      <IconPlaceholder
        aria-hidden="true"
        hugeicons="Download01Icon"
        lucide="DownloadIcon"
        phosphor="DownloadSimpleIcon"
        remixicon="RiDownloadLine"
        tabler="IconDownload"
      />
    ),
  },
] as const;

export function QuickActions() {
  return (
    <Card className="panel-hover flex-1">
      <CardHeader className="px-5 pt-5">
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Shortcuts to same destinations.</CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        <ItemGroup className="gap-0.5">
          {actions.map((a) => (
            <Item
              asChild
              className="cursor-pointer rounded-lg px-2 transition-colors duration-200 hover:bg-foreground/[0.02] dark:hover:bg-white/[0.03]"
              key={a.title}
              size="sm"
            >
              <a href={a.href}>
                <ItemMedia
                  className="border-border/60 bg-background/50 text-muted-foreground"
                  variant="icon"
                >
                  {a.icon}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="tracking-tight">{a.title}</ItemTitle>
                  <ItemDescription className="line-clamp-1 text-[11px]">
                    {a.description}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <IconPlaceholder
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-muted-foreground/60"
                    hugeicons="ArrowRight01Icon"
                    lucide="ChevronRightIcon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                    tabler="IconChevronRight"
                  />
                </ItemActions>
              </a>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
