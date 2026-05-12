import { describe, expect, it } from "vitest";

import badges from "~/data/badges.json";
import {
  filterBadges,
  getBadgeCategories,
  getCategoryBySlug,
  slugifyCategory,
} from "@/services/badges";

// --- slugifyCategory ---

describe("slugifyCategory", () => {
  it("lowercases all characters", () => {
    expect(slugifyCategory("CI")).toBe("ci");
    expect(slugifyCategory("SaaS")).toBe("saas");
    expect(slugifyCategory("IDEs")).toBe("ides");
    expect(slugifyCategory("ORM")).toBe("orm");
  });

  it("converts spaces to hyphens", () => {
    expect(slugifyCategory("Artificial Intelligence")).toBe(
      "artificial-intelligence",
    );
    expect(slugifyCategory("Operating System")).toBe("operating-system");
    expect(slugifyCategory("Home Automation")).toBe("home-automation");
  });

  it("converts slashes to hyphens", () => {
    expect(slugifyCategory("ML/AI")).toBe("ml-ai");
    expect(slugifyCategory("ML/DL")).toBe("ml-dl");
  });

  it("collapses consecutive separators into one hyphen", () => {
    expect(slugifyCategory("A  B")).toBe("a-b");
    expect(slugifyCategory("A / B")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugifyCategory(" Leading")).toBe("leading");
    expect(slugifyCategory("Trailing ")).toBe("trailing");
  });

  it("produces URL-safe output (no spaces, slashes, or special chars)", () => {
    const categories = getBadgeCategories();
    for (const cat of categories) {
      const slug = slugifyCategory(cat);
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

// --- getCategoryBySlug ---

describe("getCategoryBySlug", () => {
  it("resolves known slugs back to their original category name", () => {
    expect(getCategoryBySlug("artificial-intelligence")).toBe(
      "Artificial Intelligence",
    );
    expect(getCategoryBySlug("ml-ai")).toBe("ML/AI");
    expect(getCategoryBySlug("ml-dl")).toBe("ML/DL");
    expect(getCategoryBySlug("operating-system")).toBe("Operating System");
    expect(getCategoryBySlug("saas")).toBe("SaaS");
    expect(getCategoryBySlug("ides")).toBe("IDEs");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCategoryBySlug("not-a-category")).toBeUndefined();
    expect(getCategoryBySlug("")).toBeUndefined();
    expect(getCategoryBySlug("artificial_intelligence")).toBeUndefined();
  });

  it("round-trips every category: slug → name → slug stays identical", () => {
    const categories = getBadgeCategories();
    for (const cat of categories) {
      const slug = slugifyCategory(cat);
      const resolved = getCategoryBySlug(slug);
      expect(resolved).toBe(cat);
      expect(slugifyCategory(resolved!)).toBe(slug);
    }
  });
});

// --- getBadgeCategories ---

describe("getBadgeCategories", () => {
  it("returns a non-empty array", () => {
    const categories = getBadgeCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("contains no duplicate category names", () => {
    const categories = getBadgeCategories();
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("all category slugs are unique — no route collisions", () => {
    const categories = getBadgeCategories();
    const slugs = categories.map(slugifyCategory);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("every badge category is included", () => {
    const categories = new Set(getBadgeCategories());
    for (const badge of badges as Badge[]) {
      for (const cat of badge.categories) {
        expect(categories.has(cat)).toBe(true);
      }
    }
  });
});

// --- filterBadges ---

describe("filterBadges", () => {
  it("returns all badges when no filters are applied", () => {
    const all = filterBadges({});
    expect(all.length).toBe((badges as Badge[]).length);
  });

  it("filters by category — every result contains that category", () => {
    const results = filterBadges({ category: "Artificial Intelligence" });
    expect(results.length).toBeGreaterThan(0);
    for (const badge of results) {
      expect(badge.categories).toContain("Artificial Intelligence");
    }
  });

  it("returns an empty array for a category that does not exist", () => {
    expect(filterBadges({ category: "NonExistentXYZ" })).toHaveLength(0);
  });

  it("filters by text query", () => {
    const results = filterBadges({ query: "github" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("applies both query and category together", () => {
    const categories = getBadgeCategories();
    const firstCategory = categories[0];
    const allInCategory = filterBadges({ category: firstCategory });
    const filtered = filterBadges({
      query: allInCategory[0].name,
      category: firstCategory,
    });
    expect(filtered.length).toBeGreaterThan(0);
    for (const badge of filtered) {
      expect(badge.categories).toContain(firstCategory);
    }
  });
});
