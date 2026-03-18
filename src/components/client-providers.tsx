import type { ReactNode } from "react";

import { FavoritesProvider } from "@/context/favorites-context";
import { BadgeSidebarProvider } from "./badges/badge-sidebar";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      <BadgeSidebarProvider>{children}</BadgeSidebarProvider>
    </FavoritesProvider>
  );
}
