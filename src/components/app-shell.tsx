import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({
  children,
  pathname,
  category,
}: {
  children: ReactNode;
  pathname?: string;
  category?: string;
}) {
  return (
    <SidebarProvider pathname={pathname} category={category}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
