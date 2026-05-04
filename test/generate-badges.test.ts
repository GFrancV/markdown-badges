/**
 * Test suite for generate-badges.js
 *
 * Covers three layers:
 *  1. Output validation  — the generated scripts/badges.json satisfies the schema
 *  2. Negative cases     — validateBadge() correctly rejects malformed data
 *  3. Unit tests         — pure helpers (stripEmoji, nameToId, extractUrl, parseTableRow,
 *                          stripMarkdownEscapes, sanitizeId)
 */

import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import {
  extractUrl,
  nameToId,
  parseTableRow,
  sanitizeId,
  stripEmoji,
  stripMarkdownEscapes,
  validateBadge,
} from "../scripts/utils";

// ── Load generated output ────────────────────────────────────────────────────

type Badge = {
  id: string;
  name: string;
  url: string;
  markdown: string;
  category: string;
};

const __dir = dirname(fileURLToPath(import.meta.url));
const rootPath = resolve(__dir, "..");
const BADGES_PATH = join(rootPath, "data", "badges.json");

let badges: Badge[] = [];

beforeAll(() => {
  if (!existsSync(BADGES_PATH)) {
    throw new Error(
      `data/badges.json not found.\nRun "node scripts/generate-badges.js" first.`,
    );
  }
  badges = JSON.parse(readFileSync(BADGES_PATH, "utf-8"));
});

// ── 1. Output validation (happy path) ────────────────────────────────────────

describe("badges.json — output validation", () => {
  describe("file integrity", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(badges)).toBe(true);
      expect(badges.length).toBeGreaterThan(0);
    });

    it("contains at least 800 badges", () => {
      // sanity guard: upstream README currently has 880+
      expect(badges.length).toBeGreaterThanOrEqual(800);
    });

    it("spans at least 40 categories", () => {
      const cats = new Set(badges.map((b) => b.category));
      expect(cats.size).toBeGreaterThanOrEqual(40);
    });
  });

  describe("schema — required fields", () => {
    it("every badge has id, name, url, markdown, category", () => {
      for (const badge of badges) {
        expect(badge, `badge: ${JSON.stringify(badge)}`).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          url: expect.any(String),
          markdown: expect.any(String),
          category: expect.any(String),
        });
      }
    });

    it("no field is an empty string", () => {
      for (const badge of badges) {
        expect(badge.id.trim(), `empty id in ${badge.name}`).not.toBe("");
        expect(badge.name.trim(), `empty name`).not.toBe("");
        expect(badge.url.trim(), `empty url in ${badge.name}`).not.toBe("");
        expect(
          badge.markdown.trim(),
          `empty markdown in ${badge.name}`,
        ).not.toBe("");
        expect(
          badge.category.trim(),
          `empty category in ${badge.name}`,
        ).not.toBe("");
      }
    });
  });

  describe("id format", () => {
    it("all IDs are lowercase", () => {
      const wrong = badges.filter((b) => b.id !== b.id.toLowerCase());
      expect(wrong.map((b) => b.id)).toEqual([]);
    });

    it("no ID contains whitespace", () => {
      const wrong = badges.filter((b) => /\s/.test(b.id));
      expect(wrong.map((b) => b.id)).toEqual([]);
    });

    it("all IDs are unique (no duplicates)", () => {
      const ids = badges.map((b) => b.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  describe("url validity", () => {
    it("all URLs are syntactically valid", () => {
      const invalid = badges.filter((b) => {
        try {
          new URL(b.url);
          return false;
        } catch {
          return true;
        }
      });
      expect(invalid.map((b) => ({ name: b.name, url: b.url }))).toEqual([]);
    });

    it("all URLs point to shields.io (img.shields.io or shields.io)", () => {
      const wrong = badges.filter((b) => {
        try {
          const host = new URL(b.url).hostname;
          return host !== "img.shields.io" && host !== "shields.io";
        } catch {
          return true;
        }
      });
      expect(wrong.map((b) => b.name)).toEqual([]);
    });
  });

  describe("markdown format", () => {
    it("all markdown strings start with ![", () => {
      const wrong = badges.filter((b) => !b.markdown.startsWith("!["));
      expect(wrong.map((b) => b.name)).toEqual([]);
    });

    it("all markdown strings follow ![Alt](url) format", () => {
      const badFormat = badges.filter(
        (b) => !/^!\[.*?\]\(https?:\/\/.+\)$/.test(b.markdown.trim()),
      );
      expect(badFormat.map((b) => b.name)).toEqual([]);
    });

    it("url field matches the URL embedded in markdown", () => {
      const mismatch = badges.filter((b) => {
        const inMarkdown = extractUrl(b.markdown);
        return inMarkdown !== b.url;
      });
      expect(mismatch.map((b) => b.name)).toEqual([]);
    });
  });

  describe("category format", () => {
    it("no category contains emoji", () => {
      const withEmoji = badges.filter((b) =>
        /\p{Extended_Pictographic}/u.test(b.category),
      );
      expect(
        withEmoji.map((b) => ({ name: b.name, category: b.category })),
      ).toEqual([]);
    });

    it("no category is whitespace-only", () => {
      const blank = badges.filter((b) => b.category.trim() === "");
      expect(blank.map((b) => b.name)).toEqual([]);
    });
  });

  describe("known badges — smoke tests", () => {
    it("contains the Claude badge", () => {
      const badge = badges.find((b) => b.id === "claude");
      expect(badge).toBeDefined();
      expect(badge?.category).toBe("Artificial Intelligence");
    });

    it('C++ → id "c++" (special chars preserved)', () => {
      const badge = badges.find((b) => b.name === "C++");
      expect(badge).toBeDefined();
      expect(badge?.id).toBe("c++");
    });

    it('C# → id "c%23" (# percent-encoded for URL safety)', () => {
      // Raw # in a URL path is treated as a fragment delimiter by browsers,
      // making /badges/c# resolve identically to /badges/c — the badge
      // would be unreachable. We encode it as %23 instead.
      const badge = badges.find((b) => b.name === "C#");
      expect(badge).toBeDefined();
      expect(badge?.id).toBe("c%23");
    });

    it('.NET → id ".net" (leading dot preserved)', () => {
      const badge = badges.find((b) => b.name === ".NET");
      expect(badge).toBeDefined();
      expect(badge?.id).toBe(".net");
    });

    it('Notepad++ → id "notepad++"', () => {
      const badge = badges.find((b) => b.name === "Notepad++");
      expect(badge).toBeDefined();
      expect(badge?.id).toBe("notepad++");
    });

    it('Pop!_OS → id "pop!_os" (markdown escape \\_ stripped from name)', () => {
      // In the upstream README the name appears as Pop!\_OS — the backslash
      // escapes the underscore in markdown tables. The stored name and ID
      // must use the clean form without the escape character.
      const badge = badges.find((b) => b.name === "Pop!_OS");
      expect(badge).toBeDefined();
      expect(badge?.id).toBe("pop!_os");
    });

    it("no badge ID contains URL-unsafe characters (# ? or \\)", () => {
      const unsafe = badges.filter((b) => /[#?\\]/.test(b.id));
      expect(unsafe.map((b) => b.id)).toEqual([]);
    });

    it("Wearables category has no emoji (regression: ⌚ U+231A)", () => {
      const wearable = badges.find((b) => b.category === "Wearables");
      expect(wearable).toBeDefined();
      expect(/\p{Extended_Pictographic}/u.test("Wearables")).toBe(false);
    });

    it("Quantum Programming category is correctly mapped", () => {
      const badge = badges.find((b) => b.category === "Quantum Programming");
      expect(badge).toBeDefined();
    });
  });
});

// ── 2. Negative cases — validateBadge() rejects malformed data ────────────────

describe("validateBadge — negative cases", () => {
  const VALID = {
    id: "test-badge",
    name: "Test Badge",
    url: "https://img.shields.io/badge/test-badge-blue",
    markdown: "![Test Badge](https://img.shields.io/badge/test-badge-blue)",
    category: "Testing",
  };

  it("accepts a fully valid badge (zero errors)", () => {
    expect(validateBadge(VALID)).toEqual([]);
  });

  it("rejects a badge missing the id field", () => {
    const { id, ...noId } = VALID;
    const errors = validateBadge(noId);
    expect(errors.some((e) => e.includes("id"))).toBe(true);
  });

  it("rejects a badge missing the name field", () => {
    const { name, ...noName } = VALID;
    expect(validateBadge(noName).some((e) => e.includes("name"))).toBe(true);
  });

  it("rejects a badge missing the url field", () => {
    const { url, ...noUrl } = VALID;
    expect(validateBadge(noUrl).some((e) => e.includes("url"))).toBe(true);
  });

  it("rejects a badge missing the markdown field", () => {
    const { markdown, ...noMd } = VALID;
    expect(validateBadge(noMd).some((e) => e.includes("markdown"))).toBe(true);
  });

  it("rejects a badge missing the category field", () => {
    const { category, ...noCat } = VALID;
    expect(validateBadge(noCat).some((e) => e.includes("category"))).toBe(true);
  });

  it("rejects a badge with an empty id", () => {
    expect(validateBadge({ ...VALID, id: "" }).length).toBeGreaterThan(0);
  });

  it("rejects a badge with a whitespace-only category", () => {
    expect(validateBadge({ ...VALID, category: "   " }).length).toBeGreaterThan(
      0,
    );
  });

  it("rejects a badge with an uppercase id", () => {
    const errors = validateBadge({ ...VALID, id: "Test-Badge" });
    expect(errors.some((e) => e.includes("lowercase"))).toBe(true);
  });

  it("rejects a badge with whitespace in the id", () => {
    const errors = validateBadge({ ...VALID, id: "test badge" });
    expect(errors.some((e) => e.includes("whitespace"))).toBe(true);
  });

  it("rejects a badge with a non-URL value in url", () => {
    const errors = validateBadge({ ...VALID, url: "not-a-url" });
    expect(errors.some((e) => e.includes("invalid URL"))).toBe(true);
  });

  it("rejects markdown that does not start with ![", () => {
    const errors = validateBadge({
      ...VALID,
      markdown: "[Test Badge](https://img.shields.io/badge/test)",
    });
    expect(errors.some((e) => e.includes("markdown"))).toBe(true);
  });

  it("rejects when url field does not match the URL inside markdown", () => {
    const errors = validateBadge({
      ...VALID,
      url: "https://img.shields.io/badge/a",
      markdown: "![Test](https://img.shields.io/badge/b)",
    });
    expect(errors.some((e) => e.includes("match"))).toBe(true);
  });

  it("rejects a category that still contains emoji (⌚)", () => {
    const errors = validateBadge({ ...VALID, category: "⌚ Wearables" });
    expect(errors.some((e) => e.includes("emoji"))).toBe(true);
  });

  it("rejects a category that still contains emoji (🤖)", () => {
    const errors = validateBadge({
      ...VALID,
      category: "🤖 Artificial Intelligence",
    });
    expect(errors.some((e) => e.includes("emoji"))).toBe(true);
  });

  it("rejects a badge whose id contains # (URL fragment delimiter)", () => {
    const errors = validateBadge({ ...VALID, id: "c#" });
    expect(errors.some((e) => e.includes("URL-unsafe"))).toBe(true);
  });

  it("rejects a badge whose id contains ? (URL query separator)", () => {
    const errors = validateBadge({ ...VALID, id: "foo?bar" });
    expect(errors.some((e) => e.includes("URL-unsafe"))).toBe(true);
  });

  it("rejects a badge whose id contains \\ (path separator / markdown escape)", () => {
    const errors = validateBadge({ ...VALID, id: "pop!\\_os" });
    expect(errors.some((e) => e.includes("URL-unsafe"))).toBe(true);
  });

  it("detects duplicate IDs in a collection", () => {
    const collection = [VALID, { ...VALID, name: "Different Name" }];
    const ids = collection.map((b) => b.id);
    const unique = new Set(ids);
    expect(unique.size).not.toBe(ids.length);
  });
});

// ── 3. Unit tests — pure helper functions ────────────────────────────────────

describe("stripEmoji", () => {
  it("removes standard emoji 🤖 (U+1F916)", () => {
    expect(stripEmoji("🤖 Artificial Intelligence")).toBe(
      "Artificial Intelligence",
    );
  });

  it("removes 📝 (U+1F4DD)", () => {
    expect(stripEmoji("📝 Blog")).toBe("Blog");
  });

  it("removes ⌚ (U+231A) — regression for missed emoji range", () => {
    expect(stripEmoji("⌚ Wearables")).toBe("Wearables");
  });

  it("removes ⚙️ (U+2699 + variation selector)", () => {
    expect(stripEmoji("⚙️ Hardware")).toBe("Hardware");
  });

  it("removes 🧑‍💻 ZWJ sequence", () => {
    expect(stripEmoji("🧑‍💻 Developer/Forums")).toBe("Developer/Forums");
  });

  it("removes 📚 (U+1F4DA)", () => {
    expect(stripEmoji("📚 Frameworks, Platforms and Libraries")).toBe(
      "Frameworks, Platforms and Libraries",
    );
  });

  it("preserves regular ASCII text unchanged", () => {
    expect(stripEmoji("Browsers")).toBe("Browsers");
  });

  it("preserves slashes and special chars used in category names", () => {
    expect(stripEmoji("Developer/Forums")).toBe("Developer/Forums");
  });

  it("trims leading/trailing whitespace left after emoji removal", () => {
    expect(stripEmoji("  🔗  Blockchain  ")).toBe("Blockchain");
  });
});

describe("nameToId", () => {
  it("lowercases single-word names", () => {
    expect(nameToId("ChatGPT")).toBe("chatgpt");
    expect(nameToId("YOLO")).toBe("yolo");
  });

  it("replaces spaces with hyphens", () => {
    expect(nameToId("Google Chrome")).toBe("google-chrome");
    expect(nameToId("Amazon Alexa")).toBe("amazon-alexa");
  });

  it("collapses multiple consecutive spaces into a single hyphen", () => {
    // /\s+/ matches one-or-more whitespace, so "A  B" → "a-b" (not "a--b")
    expect(nameToId("A  B")).toBe("a-b");
  });

  it("preserves + characters (C++, Notepad++)", () => {
    expect(nameToId("C++")).toBe("c++");
    expect(nameToId("Notepad++")).toBe("notepad++");
  });

  it("preserves # character (C#)", () => {
    expect(nameToId("C#")).toBe("c#");
  });

  it("preserves leading dot (.NET)", () => {
    expect(nameToId(".NET")).toBe(".net");
  });

  it("preserves dots in names (Micro.blog)", () => {
    expect(nameToId("Micro.blog")).toBe("micro.blog");
  });

  it("does not alter an already-lowercase id", () => {
    expect(nameToId("firebase")).toBe("firebase");
  });
});

describe("extractUrl", () => {
  it("extracts a plain shields.io URL", () => {
    expect(
      extractUrl(
        "![Claude](https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=claude&logoColor=white)",
      ),
    ).toBe(
      "https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=claude&logoColor=white",
    );
  });

  it("handles URLs with percent-encoded characters (%20, %2B)", () => {
    const url =
      "https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white";
    expect(extractUrl(`![C++](${url})`)).toBe(url);
  });

  it("returns null for a non-image markdown link [text](url)", () => {
    expect(
      extractUrl("[Claude](https://img.shields.io/badge/Claude)"),
    ).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractUrl("")).toBeNull();
  });

  it("returns null for plain text", () => {
    expect(extractUrl("no markdown here")).toBeNull();
  });

  it("returns null for an image with a relative path (no http)", () => {
    expect(extractUrl("![Logo](/images/logo.png)")).toBeNull();
  });

  it("ignores content after the closing parenthesis", () => {
    const url = "https://img.shields.io/badge/Test-blue";
    expect(extractUrl(`![Test](${url}) extra text`)).toBe(url);
  });
});

describe("parseTableRow", () => {
  it("returns null for the header row", () => {
    expect(parseTableRow("| Name | Badge | Markdown |")).toBeNull();
  });

  it("returns null for a separator row with dashes", () => {
    expect(parseTableRow("| --- | --- | --- |")).toBeNull();
    expect(parseTableRow("| :--- | :---: | ---: |")).toBeNull();
  });

  it("returns null for a non-table line", () => {
    expect(parseTableRow("This is a paragraph")).toBeNull();
    expect(parseTableRow("")).toBeNull();
  });

  it("returns null when there are fewer than 3 cells", () => {
    expect(parseTableRow("| OnlyOne |")).toBeNull();
    expect(parseTableRow("| One | Two |")).toBeNull();
  });

  it("parses a valid data row and returns trimmed cells", () => {
    const row =
      "| ChatGPT | ![ChatGPT](https://...) | `![ChatGPT](https://...)` |";
    const cells = parseTableRow(row);
    expect(cells).not.toBeNull();
    expect(cells[0]).toBe("ChatGPT");
    expect(cells[2]).toBe("`![ChatGPT](https://...)`");
  });

  it("trims extra whitespace from each cell", () => {
    const row = "|  Padded Name  |  badge  |  `markdown`  |";
    const cells = parseTableRow(row);
    expect(cells[0]).toBe("Padded Name");
    expect(cells[2]).toBe("`markdown`");
  });
});

describe("stripMarkdownEscapes", () => {
  it("strips backslash before underscore (Pop!\\_OS regression)", () => {
    expect(stripMarkdownEscapes("Pop!\\_OS")).toBe("Pop!_OS");
  });

  it("strips backslash before asterisk", () => {
    expect(stripMarkdownEscapes("foo\\*bar")).toBe("foo*bar");
  });

  it("strips backslash before hash", () => {
    expect(stripMarkdownEscapes("foo\\#bar")).toBe("foo#bar");
  });

  it("strips multiple escapes in one string", () => {
    expect(stripMarkdownEscapes("A\\_B\\*C")).toBe("A_B*C");
  });

  it("leaves strings with no backslash unchanged", () => {
    expect(stripMarkdownEscapes("C#")).toBe("C#");
    expect(stripMarkdownEscapes("C++")).toBe("C++");
    expect(stripMarkdownEscapes(".NET")).toBe(".NET");
    expect(stripMarkdownEscapes("Pop!_OS")).toBe("Pop!_OS");
  });

  it("removes a standalone double-backslash (escaped backslash in markdown)", () => {
    expect(stripMarkdownEscapes("a\\\\b")).toBe("a\\b");
  });
});

describe("sanitizeId", () => {
  it("encodes # as %23 (fragment identifier fix for C#)", () => {
    expect(sanitizeId("c#")).toBe("c%23");
  });

  it("encodes ? as %3F (query separator)", () => {
    expect(sanitizeId("foo?bar")).toBe("foo%3Fbar");
  });

  it("encodes backslash as %5C (path separator / markdown escape)", () => {
    expect(sanitizeId("pop!\\_os")).toBe("pop!%5C_os");
  });

  it("leaves safe characters unchanged (alphanumeric, hyphen, dot, +)", () => {
    expect(sanitizeId("google-chrome")).toBe("google-chrome");
    expect(sanitizeId("c++")).toBe("c++");
    expect(sanitizeId(".net")).toBe(".net");
    expect(sanitizeId("notepad++")).toBe("notepad++");
  });

  it("leaves forward slashes unchanged (intentional multi-segment paths)", () => {
    // IDs like jwt/json-web-token create valid nested paths with [‥‥id] route
    expect(sanitizeId("jwt/json-web-token")).toBe("jwt/json-web-token");
    expect(sanitizeId("shadcn/ui")).toBe("shadcn/ui");
  });

  it("handles multiple problematic characters in one id", () => {
    expect(sanitizeId("a#b?c\\d")).toBe("a%23b%3Fc%5Cd");
  });

  it("is idempotent when applied to an already-sanitized id", () => {
    expect(sanitizeId("c%23")).toBe("c%23");
  });
});
