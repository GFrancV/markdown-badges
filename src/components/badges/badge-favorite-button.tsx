import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

export function BadgeFavoriteButton({
  badge,
  className,
}: {
  badge: Badge;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(badge.id);

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        toggle(badge);
      }}
      variant="ghost"
      size="xs"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        className,
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <HeartIcon className="size-4" fill={active ? "currentColor" : "none"} />
    </Button>
  );
}
