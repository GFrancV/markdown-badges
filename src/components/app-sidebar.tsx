import { BoxIcon, HeartIcon, HomeIcon, InfoIcon } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { getBadgeCategories, getBadgeCountByCategory } from "@/services/badges";
import { AppLogo } from "./app-logo";
import { ScrollArea } from "./ui/scroll-area";

const nav = {
  navMain: [
    {
      name: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      name: "Favorites",
      url: "/favorites",
      icon: HeartIcon,
    },
    {
      name: "Generator",
      url: "/generator",
      icon: BoxIcon,
    },
  ],
  navFooter: [
    {
      name: "About",
      url: "/about",
      icon: InfoIcon,
    },
  ],
} as const;

// Module-level constants: computed once at import time (server + client), never on re-render
const categories = getBadgeCategories();
const badgeCountByCategory = getBadgeCountByCategory();

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { pathname, category: ssrCategory } = useSidebar();
  const activeCategoryRef = useRef<HTMLLIElement>(null);

  // Initialized from the server-validated SSR prop — no hydration mismatch.
  // Category is always valid here because Layout.astro filters invalid values before passing them down.
  const [activeCategory, setActiveCategory] = useState<string | undefined>(ssrCategory);

  useEffect(() => {
    const syncCategoryFromUrl = () => {
      const cat = new URLSearchParams(window.location.search).get("category") || undefined;
      setActiveCategory(cat);
    };

    // popstate: browser back/forward navigation
    window.addEventListener("popstate", syncCategoryFromUrl);
    // locationchange: dispatched by search.tsx after every replaceState call
    window.addEventListener("locationchange", syncCategoryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCategoryFromUrl);
      window.removeEventListener("locationchange", syncCategoryFromUrl);
    };
  }, []);

  const isValidCategory = !!activeCategory && categories.includes(activeCategory);

  useEffect(() => {
    if (isValidCategory && activeCategoryRef.current) {
      activeCategoryRef.current.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [activeCategory, isValidCategory]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <AppLogo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.navMain.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={!isValidCategory && pathname === item.url}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <Typography as="span">{item.name}</Typography>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="flex flex-col flex-1 min-h-0">
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <SidebarMenu>
                {categories.map((cat) => (
                  <SidebarMenuItem
                    key={cat}
                    ref={cat === activeCategory ? activeCategoryRef : undefined}
                  >
                    <SidebarMenuButton asChild isActive={cat === activeCategory}>
                      <a href={`/?category=${cat}`}>
                        <Typography as="span">{cat}</Typography>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{badgeCountByCategory[cat]}</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {nav.navFooter.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
