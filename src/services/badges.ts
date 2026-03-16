import { filter as fuzzy } from "fuzzyjs";

import badges from "@/data/badges.json";

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
