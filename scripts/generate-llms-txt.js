/**
 * Regenerates public/llms.txt from data/badges.json so the index of pages
 * and categories always reflects the current badge catalog.
 *
 * Run with:  node scripts/generate-llms-txt.js
 * Output:    public/llms.txt
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const SITE_URL = "https://markdown-badges.vercel.app";

// Mirrors src/services/badges.ts#slugifyCategory — kept in sync manually
// since this script runs standalone via plain Node, without TS/Vite.
function slugifyCategory(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dir = dirname(__filename);
  const rootDir = resolve(__dir, "..");

  const badges = JSON.parse(
    readFileSync(join(rootDir, "data", "badges.json"), "utf-8"),
  );

  const categories = [...new Set(badges.flatMap((b) => b.categories))];
  const countByCategory = badges.reduce((acc, badge) => {
    for (const cat of badge.categories) {
      acc[cat] = (acc[cat] || 0) + 1;
    }
    return acc;
  }, {});

  const categoryLines = categories
    .map((cat) => {
      const count = countByCategory[cat];
      const label = count === 1 ? "badge" : "badges";
      return `- [${cat}](${SITE_URL}/categories/${slugifyCategory(cat)}): ${count} ${label}`;
    })
    .join("\n");

  const content = `# Markdown Badges

> Search, browse, and copy ready-made Markdown badges (shields.io-style) for READMEs and other project docs.

Markdown Badges is a static catalog of ${badges.length} badges across ${categories.length} categories, sourced from the Ileriayo/markdown-badges GitHub repository. Badges can be searched, multi-selected and copied as Markdown, built from scratch in the generator using any simple-icons logo, or fetched programmatically via the public read-only API.

## Pages

- [Home](${SITE_URL}/): Search and browse all badges, filter by category, multi-select and copy.
- [Generator](${SITE_URL}/generator): Build a custom badge from any simple-icons logo, label, and colors.
- [Favorites](${SITE_URL}/favorites): Badges saved locally by the visitor.
- [API Reference](${SITE_URL}/docs/api): Public read-only HTTP API returning badge data as JSON, no auth required.
- [About](${SITE_URL}/about): Project background and attribution.

## Categories

${categoryLines}
`;

  const outputPath = join(rootDir, "public", "llms.txt");
  writeFileSync(outputPath, content, "utf-8");
  console.log(
    `Written to ${outputPath} (${badges.length} badges, ${categories.length} categories)`,
  );
}

main();
