/**
 * Fetches simple-icons metadata and writes a slim list for the generator:
 *   [{ title, slug, hex }]
 *
 * Run with:  node scripts/generate-simple-icons.js
 * Output:    public/simple-icons.json
 */

import { writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { slimIcons } from "./utils.js";

const ICONS_URL =
  "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/data/simple-icons.json";

async function main() {
  console.log("Fetching simple-icons…");
  const res = await fetch(ICONS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const icons = slimIcons(await res.json());

  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const outputPath = join(rootDir, "public", "simple-icons.json");
  writeFileSync(outputPath, JSON.stringify(icons), "utf-8");
  console.log(`Written ${icons.length} icons to ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
