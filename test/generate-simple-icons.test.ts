import { readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { gzipSync } from "zlib";
import { slimIcons, titleToSlug } from "../scripts/utils";

const OUTPUT = join(
  resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  "public",
  "simple-icons.json",
);

describe("titleToSlug", () => {
  it("matches simple-icons slugs", () => {
    expect(titleToSlug(".ENV")).toBe("dotenv");
    expect(titleToSlug("Node.js")).toBe("nodedotjs");
    expect(titleToSlug("C++")).toBe("cplusplus");
    expect(titleToSlug("AT&T")).toBe("atandt");
    expect(titleToSlug("Visual Studio Code")).toBe("visualstudiocode");
    expect(titleToSlug("Citroën")).toBe("citroen");
  });
});

describe("slimIcons", () => {
  it("keeps title/slug/hex, prefers explicit slug, dedupes", () => {
    expect(
      slimIcons([
        { title: "Node.js", hex: "5FA04E", source: "x", aliases: {} },
        { title: "Sat.1", slug: "sat1", hex: "FFF" },
        { title: "Node.js", hex: "000000" },
      ]),
    ).toEqual([
      { title: "Node.js", slug: "nodedotjs", hex: "5FA04E" },
      { title: "Sat.1", slug: "sat1", hex: "FFF" },
    ]);
  });

  it("throws on non-array payload", () => {
    expect(() => slimIcons({ icons: [] })).toThrow();
  });
});

describe("public/simple-icons.json", () => {
  const icons = JSON.parse(readFileSync(OUTPUT, "utf8"));

  it("is small and well-formed", () => {
    // Transfer size is what matters; raw size grows with upstream
    expect(gzipSync(readFileSync(OUTPUT)).length).toBeLessThanOrEqual(80 * 1024);
    expect(icons.length).toBeGreaterThan(1000);
    for (const icon of icons) {
      expect(Object.keys(icon).sort()).toEqual(["hex", "slug", "title"]);
    }
    expect(new Set(icons.map((i: { slug: string }) => i.slug)).size).toBe(
      icons.length,
    );
  });
});
