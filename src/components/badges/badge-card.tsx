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
      className="relative group bg-[#1e1e1e] cursor-pointer text-white rounded-sm border border-transparent transition p-6 text-center flex flex-col hover:bg-primary/20 hover:border-primary badget-element h-full"
    >
      <Typography as="h3" size="h4" className="mt-1 mb-3">
        {name}
      </Typography>
      <img
        src={url}
        alt={`${name} badge`}
        width="100"
        height="28"
        className="mt-auto h-7 w-auto mx-auto mb-4"
        loading="lazy"
      />
      <div className="mt-2">
        <Button
          variant="outline"
          className="rounded-full group-hover:border-primary group-hover:text-primary"
        >
          {category}
        </Button>
      </div>
      <div className="absolute top-1 right-1 transition duration-300 flex flex-col items-center gap-1">
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
