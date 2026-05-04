import { filter as fuzzy } from "fuzzyjs";

import badges from "~/data/badges.json";

type BadgeFilters = {
  query?: string | null;
  category?: string | null;
};

const matchesQuery = (query?: string | null) => (badge: Badge) => {
  if (!query) return true;

  return fuzzy(query, {
    iterator: (b: Badge) => b.name,
  })(badge);
};

const matchesCategory = (category?: string | null) => (badge: Badge) =>
  !category || badge.category === category;

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

export function getBadgeCategories(): string[] {
  return [...new Set(getBadges().map((badge) => badge.category))];
}

export function getBadgeCountByCategory(): Record<string, number> {
  return getBadges().reduce(
    (acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getRelatedBadges(badge: Badge, maxBadges: number = 4): Badge[] {
  return getBadges()
    .filter((b) => b.category === badge.category && b.id !== badge.id)
    .slice(0, maxBadges);
}
