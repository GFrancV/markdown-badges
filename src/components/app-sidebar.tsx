import {
  BoxIcon,
  CloudIcon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import { type ComponentProps, useEffect, useRef } from "react";

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
import {
  getBadgeCategories,
  getBadgeCountByCategory,
  getCategoryBySlug,
  slugifyCategory,
} from "@/services/badges";
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
    {
      name: "API",
      url: "/docs/api",
      icon: CloudIcon,
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
  const { pathname } = useSidebar();
  const activeCategoryRef = useRef<HTMLLIElement>(null);

  const activeSlug = pathname?.startsWith("/categories/")
    ? pathname.slice("/categories/".length)
    : undefined;
  const activeCategory = activeSlug ? getCategoryBySlug(activeSlug) : undefined;
  const isValidCategory = !!activeCategory;

  useEffect(() => {
    if (isValidCategory && activeCategoryRef.current) {
      activeCategoryRef.current.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
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
                      <span>{item.name}</span>
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
                    <SidebarMenuButton
                      asChild
                      isActive={cat === activeCategory}
                    >
                      <a href={`/categories/${slugifyCategory(cat)}`}>
                        <span>{cat}</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge isActive={cat === activeCategory}>
                      {badgeCountByCategory[cat]}
                    </SidebarMenuBadge>
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
              <SidebarMenuButton asChild isActive={pathname === item.url}>
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
