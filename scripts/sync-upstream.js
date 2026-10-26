/**
 * Fetches the Ileriayo/markdown-badges README and extracts all badge definitions
 * into a committed snapshot with the schema expected by src/content.config.ts:
 *   { id, name, url, markdown, categories }
 * Only the weekly workflow (or a manual run) touches the network; builds read
 * the snapshot via scripts/generate-badges.js.
 *
 * Run with:  node scripts/sync-upstream.js
 * Output:    data/badges.upstream.json
 */

import { mkdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  CATEGORY_MAP,
  extractUrl,
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

  // ── Write output ─────────────────────────────────────────────────────────────
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const dataDir = join(rootDir, "data");
  const outputPath = join(dataDir, "badges.upstream.json");
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(upstream, null, 2), "utf-8");
  console.log(`
Written ${upstream.length} upstream badges to ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
