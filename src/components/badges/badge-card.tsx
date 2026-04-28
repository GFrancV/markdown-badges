import { memo } from "react";

import { BadgeFavoriteButton } from "@/components/badges/badge-favorite-button";
import { useBadgeSidebar } from "@/components/badges/badge-sidebar";
import { CopyClipboardButton } from "@/components/copy-clipboard-button";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

export const BadgeCard = memo(function BadgeCard({ badge }: { badge: Badge }) {
  const { name, url, category } = badge;

  const { isFavorite } = useFavorites();
  const { open } = useBadgeSidebar();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => open(badge)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(badge);
        }
      }}
      className="relative group bg-card cursor-pointer rounded-md border border-transparent transition p-4 pt-6 text-center flex flex-col hover:bg-primary/10 hover:border-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-primary/10"
    >
      <img
        src={url}
        alt={`${name} badge`}
        width="80"
        height="20"
        className="h-5 w-auto mx-auto mb-4"
        loading="lazy"
      />

      <Typography as="p" className="mb-2">
        {name}
      </Typography>

      <Button
        asChild
        variant="outline"
        size="sm"
        className="text-muted-foreground"
      >
        <a href={`/?category=${category}`} onClick={(e) => e.stopPropagation()}>
          {category}
        </a>
      </Button>

      <div className="absolute top-0.5 right-0.5 transition duration-300 flex flex-col items-center gap-0.5">
        <CopyClipboardButton content={`![${name}](${url})`} />
        <BadgeFavoriteButton
          badge={badge}
          className={cn(
            isFavorite(badge.id)
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
            "transition duration-300",
          )}
        />
      </div>
    </div>
  );
});
