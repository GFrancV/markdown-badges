/**
 * Fetches the Ileriayo/markdown-badges README and extracts all badge definitions
 * into badges.json with the schema expected by src/content.config.ts:
 *   { id, name, url, markdown, categories }
 * Project-owned badges in data/badges.custom.json are merged on top.
 *
 * Run with:  node scripts/generate-badges.js
 * Output:    data/badges.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  CATEGORY_MAP,
  extractUrl,
  mergeCustomBadges,
  nameToId,
  parseTableRow,
  sanitizeId,
  stripEmoji,
  stripMarkdownEscapes,
} from "./utils.js";

const README_URL =
  "https://raw.githubusercontent.com/Ileriayo/markdown-badges/master/README.md";

async function main() {
  console.log("Fetching README…");
  const res = await fetch(README_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const text = await res.text();

  const lines = text.split("\n");
  const upstream = [];
  const seenIds = new Set();
  let currentCategory = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // ── Category heading (###) ───────────────────────────────────────────────
    const headingMatch = trimmed.match(/^###\s+(.+)$/);
    if (headingMatch) {
      const raw = stripEmoji(headingMatch[1]);
      currentCategory = CATEGORY_MAP[raw] ?? raw;
      continue;
    }

    // ── Table rows (only within a category section) ──────────────────────────
    if (!currentCategory) continue;

    const cells = parseTableRow(line);
    if (!cells) continue;

    // Strip markdown backslash escapes (e.g. Pop!\_OS → Pop!_OS) so the stored
    // name is the clean display name, not the raw markdown-table source.
    const name = stripMarkdownEscapes(cells[0]);
    const markdownCol = cells[2];

    // The markdown column wraps the badge string in backticks: `![Alt](url)`
    const backtickMatch = markdownCol.match(/`([^`]+)`/);
    if (!backtickMatch) continue;

    const markdown = backtickMatch[1].trim();
    const url = extractUrl(markdown);
    if (!url) continue;

    // Validate URL (schema requires z.url())
    try {
      new URL(url);
    } catch {
      console.warn(`  ⚠ Skipping "${name}" — malformed URL: ${url}`);
      continue;
    }

    // sanitizeId encodes # → %23, ? → %3F, \ → %5C so the ID is safe
    // to use as an Astro static route path segment.
    const id = sanitizeId(nameToId(name));

    // Same URL already exists → merge the new category into that entry.
    const existingByUrl = upstream.find((b) => b.url === url);
    if (existingByUrl) {
      if (!existingByUrl.categories.includes(currentCategory)) {
        existingByUrl.categories.push(currentCategory);
        console.warn(`  ℹ "${name}": merged category "${currentCategory}" (same URL)`);
      }
      continue;
    }

    // Same name/ID but different URL (e.g. Bitcoin in Blockchain vs Cryptocurrency
    // with slightly different badge colours) → merge categories, keep first URL.
    const existingById = upstream.find((b) => b.id === id);
    if (existingById) {
      if (!existingById.categories.includes(currentCategory)) {
        existingById.categories.push(currentCategory);
        console.warn(`  ℹ "${name}": merged category "${currentCategory}" (same name, different URL)`);
      }
      continue;
    }

    seenIds.add(id);
    upstream.push({ id, name, url, markdown, categories: [currentCategory] });
  }

  // ── Merge project-owned badges (never touched by the upstream sync) ─────────
  const __filename = fileURLToPath(import.meta.url);
  const __dir = dirname(__filename);
  const rootDir = resolve(__dir, "..");
  const dataDir = join(rootDir, "data");
  const outputPath = join(dataDir, "badges.json");
  const customPath = join(dataDir, "badges.custom.json");

  const custom = existsSync(customPath)
    ? JSON.parse(readFileSync(customPath, "utf-8"))
    : [];
  const { badges, overridden } = mergeCustomBadges(upstream, custom);
  console.log(`\nMerged ${custom.length} custom badges from ${customPath}`);
  for (const id of overridden) {
    console.warn(`  ℹ custom badge overrides upstream "${id}"`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const categories = [...new Set(badges.flatMap((b) => b.categories))];
  console.log(
    `\nTotal ${badges.length} badges across ${categories.length} categories:`,
  );
  for (const cat of categories) {
    const count = badges.filter((b) => b.categories.includes(cat)).length;
    console.log(`  ${cat}: ${count}`);
  }

  // ── Write output ─────────────────────────────────────────────────────────────
  mkdirSync(dataDir, { recursive: true });

  writeFileSync(outputPath, JSON.stringify(badges, null, 2), "utf-8");
  console.log(`\nWritten to ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
