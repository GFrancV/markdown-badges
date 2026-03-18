import { ClipboardIcon, FolderHeartIcon, SearchIcon } from "lucide-react";

import { BadgeCard } from "@/components/badges/badge-card";
import { ClientProviders } from "@/components/client-providers";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useFavorites } from "@/context/favorites-context";

export function BadgeFavorites() {
  return (
    <ClientProviders>
      <BadgeFavoritesContent />
    </ClientProviders>
  );
}

function BadgeFavoritesContent() {
  const { favorites, copyAll } = useFavorites();

  return favorites.length === 0 ? (
    <div className="flex w-full max-w-sm flex-col items-center justify-center gap-2.5 text-center m-auto">
      <div className="rounded-lg bg-muted text-foreground p-4">
        <FolderHeartIcon width={32} height={32} className="size-8" />
      </div>
      <Typography as="h2" size="h3">
        No Favorites Yet
      </Typography>
      <Typography variant="muted">
        Start adding badges to your favorites by clicking the heart icon on any
        badge.
      </Typography>
      <Button asChild>
        <a href="/">
          <SearchIcon className="size-4" />
          Browse Badges
        </a>
      </Button>
    </div>
  ) : (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <Typography as="h1" size="h1" className="mb-4">
            Favorite Badges
          </Typography>
          <div className="flex items-center gap-2">
            <FolderHeartIcon width={20} height={20} className="size-5" />
            <Typography variant="muted">
              {favorites.length} badge{favorites.length > 1 ? "s" : ""}
            </Typography>
          </div>
        </div>
        <Button variant="outline" onClick={copyAll}>
          <ClipboardIcon />
          Copy All
        </Button>
      </header>
      <section>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          {favorites.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </section>
    </>
  );
}
