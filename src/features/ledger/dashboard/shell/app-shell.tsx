import { SidebarInset, SidebarProvider } from "@/features/ledger/ui/sidebar";
import { AppHeader } from "@/features/ledger/dashboard/shell/app-header";
import { AppSidebar } from "@/features/ledger/dashboard/shell/app-sidebar";
import { CanvasBackdrop } from "@/features/ledger/dashboard/shell/canvas-backdrop";

export function AppShell({
  children,
  pathname = "#/dashboard",
}: {
  children: React.ReactNode;
  pathname?: string;
}) {
  return (
    <SidebarProvider className="relative">
      <CanvasBackdrop />
      <AppSidebar pathname={pathname} />
      <SidebarInset className="relative min-w-0 bg-transparent">
        <AppHeader pathname={pathname} />
        <div className="flex min-w-0 flex-1 flex-col gap-5 px-4 pb-10 md:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
