import { memo, type MouseEvent } from "react";

import { BadgeFavoriteButton } from "@/components/badges/badge-favorite-button";
import { useBadgeSidebar } from "@/components/badges/badge-sidebar";
import { CopyClipboardButton } from "@/components/copy-clipboard-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

type BadgeCardProps = {
  badge: Badge;
  selectable?: boolean;
  isSelected?: boolean;
  onToggle?: (badge: Badge) => void;
};

export const BadgeCard = memo(function BadgeCard({
  badge,
  selectable = false,
  isSelected = false,
  onToggle,
}: BadgeCardProps) {
  const { name, url, category } = badge;

  const { isFavorite } = useFavorites();
  const { open } = useBadgeSidebar();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (selectable && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onToggle?.(badge);
      return;
    }
    open(badge);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(badge);
        }
      }}
      className={cn(
        "relative group bg-card cursor-pointer rounded-md border border-transparent transition p-4 pt-6 text-center flex flex-col hover:bg-primary/10 hover:border-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-primary/10",
        isSelected && "bg-primary/10 border-primary/80",
      )}
    >
      {selectable && (
        <Checkbox
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(badge);
          }}
          className={cn(
            "absolute top-0.5 left-0.5 ",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          checked={isSelected}
          aria-label={isSelected ? "Deselect badge" : "Select badge"}
          aria-pressed={isSelected}
        />
      )}

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
