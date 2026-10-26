/**
 * Builds data/badges.json (gitignored) from the committed sources, offline:
 *   data/badges.upstream.json — snapshot written by scripts/sync-upstream.js
 *   data/badges.custom.json   — project-owned badges, merged on top
 *
 * Run with:  node scripts/generate-badges.js
 * Output:    data/badges.json
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { mergeCustomBadges } from "./utils.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(rootDir, "data");
const upstreamPath = join(dataDir, "badges.upstream.json");
const customPath = join(dataDir, "badges.custom.json");
const outputPath = join(dataDir, "badges.json");

const upstream = JSON.parse(readFileSync(upstreamPath, "utf-8"));
const custom = existsSync(customPath)
  ? JSON.parse(readFileSync(customPath, "utf-8"))
  : [];

const { badges, overridden } = mergeCustomBadges(upstream, custom);
for (const id of overridden) {
  console.warn(`  ℹ custom badge overrides upstream "${id}"`);
}

writeFileSync(outputPath, JSON.stringify(badges, null, 2), "utf-8");
console.log(
  `Written ${badges.length} badges (${upstream.length} upstream + ${custom.length} custom) to ${outputPath}`,
);
