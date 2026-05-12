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
  !category || badge.categories.includes(category);

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
  return [...new Set(getBadges().flatMap((badge) => badge.categories))];
}

export function getBadgeCountByCategory(): Record<string, number> {
  return getBadges().reduce(
    (acc, badge) => {
      badge.categories.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryBySlug(slug: string): string | undefined {
  return getBadgeCategories().find((cat) => slugifyCategory(cat) === slug);
}

export function getRelatedBadges(badge: Badge, maxBadges: number = 4): Badge[] {
  return getBadges()
    .filter(
      (b) =>
        b.id !== badge.id &&
        b.categories.some((cat) => badge.categories.includes(cat)),
    )
    .slice(0, maxBadges);
}
