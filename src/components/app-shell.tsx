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
      <SidebarInset className="overflow-hidden">
        <AppHeader />
        <div className="-top-80 -right-80 w-190 h-190 absolute pointer-events-none bg-radial to-transparent to-65% from-primary/12" />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
