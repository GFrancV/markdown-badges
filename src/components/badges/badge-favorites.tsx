import {
  ClipboardIcon,
  FolderHeartIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

import { BadgeCard } from "@/components/badges/badge-card";
import { ClientProviders } from "@/components/client-providers";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
  const { favorites, copyAll, clearAll } = useFavorites();

  return favorites.length === 0 ? (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderHeartIcon />
        </EmptyMedia>
        <EmptyTitle>No Favorites Yet</EmptyTitle>
        <EmptyDescription>
          Start adding badges to your favorites by clicking the heart icon on
          any badge.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <a href="/">
            <SearchIcon className="size-4" />
            Browse Badges
          </a>
        </Button>
      </EmptyContent>
    </Empty>
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
        <div className="flex items-center gap-2">
          <Button onClick={copyAll}>
            <ClipboardIcon />
            Copy All
          </Button>
          <Button variant="secondary" onClick={clearAll}>
            <TrashIcon />
            Clear All
          </Button>
        </div>
      </header>
      <section>
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
          {favorites.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </section>
    </>
  );
}
