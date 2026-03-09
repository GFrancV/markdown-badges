import { filter as fuzzy } from "fuzzyjs";

import badges from "@/data/badges.json";

type BadgeFilters = {
  query?: string;
  category?: string;
};

const matchesQuery = (query?: string) => (badge: Badge) => {
  if (!query) return true;

  return fuzzy(query, {
    iterator: (b: Badge) => b.name,
  })(badge);
};

const matchesCategory = (category?: string) => (badge: Badge) =>
  !category || badge.category.includes(category);

export function filterBadges(filters: BadgeFilters): Badge[] {
  const allBadges = getBadges();
  const queryPredicate = matchesQuery(filters.query);
  const categoryPredicate = matchesCategory(filters.category);

  return allBadges.filter(
    (badge) => queryPredicate(badge) && categoryPredicate(badge),
  );
}

export function getBadges(): Badge[] {
  return badges;
}

export function getBadgeById(id: string): Badge | undefined {
  return getBadges().find((badge) => badge.id === id);
}

export function getBadgeCategories(): string[] {
  return [...new Set(getBadges().flatMap((badge) => badge.category))];
}

export function getRelatedBadges(id: string, limit = 4): Badge[] {
  const badge = getBadgeById(id);
  if (!badge) return [];

  const categorySet = new Set(badge.category);

  return getBadges()
    .filter((b) => b.id !== id)
    .map((b) => ({
      badge: b,
      score: b.category.filter((c) => categorySet.has(c)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ badge }) => badge);
}
