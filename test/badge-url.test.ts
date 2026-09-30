import { describe, expect, it } from "vitest";
import {
  buildBadgeUrl,
  contrastLogoColor,
  DEFAULT_BADGE,
  escapeMarkdownText,
  escapeShieldsText,
  parseBadgeParams,
  serializeBadgeParams,
  type BadgeConfig,
} from "../src/lib/badge-url";

const base: BadgeConfig = {
  name: "GitHub",
  showIcon: true,
  logo: "github",
  logoColor: "#ffffff",
  labelColor: "#000000",
  color: "#000000",
  style: "for-the-badge",
};

describe("escapeShieldsText", () => {
  it("escapes shields separators", () => {
    expect(escapeShieldsText("Next-Auth")).toBe("Next--Auth");
    expect(escapeShieldsText("my_lib")).toBe("my__lib");
    expect(escapeShieldsText("a b")).toBe("a_b");
  });

  it("percent-encodes the rest", () => {
    expect(escapeShieldsText("C#/ñ")).toBe("C%23%2F%C3%B1");
  });
});

describe("escapeMarkdownText", () => {
  it("prevents breaking out of the image alt text", () => {
    expect(escapeMarkdownText("x](https://evil.example) [y")).toBe(
      String.raw`x\](https://evil.example) \[y`,
    );
    expect(escapeMarkdownText(String.raw`a\b`)).toBe(String.raw`a\\b`);
  });
});

describe("contrastLogoColor", () => {
  it("picks black on light brands and white on dark ones", () => {
    expect(contrastLogoColor("F7DF1E")).toBe("#000000"); // JavaScript
    expect(contrastLogoColor("FFFFFF")).toBe("#000000");
    expect(contrastLogoColor("181717")).toBe("#ffffff"); // GitHub
    expect(contrastLogoColor("5FA04E")).toBe("#ffffff"); // Node.js
  });
});

describe("buildBadgeUrl", () => {
  it("builds the full url", () => {
    expect(buildBadgeUrl(base)).toBe(
      "https://img.shields.io/badge/GitHub-1000?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=000000&color=000000",
    );
  });

  it("omits logo params when icon is hidden or empty", () => {
    for (const cfg of [{ ...base, showIcon: false }, { ...base, logo: "" }]) {
      const url = buildBadgeUrl(cfg);
      expect(url).not.toContain("logo=");
      expect(url).not.toContain("logoColor=");
    }
  });

  it("sanitizes colors and style", () => {
    const url = buildBadgeUrl({
      ...base,
      labelColor: "red;",
      color: "#12",
      logoColor: "javascript:",
      style: "evil" as BadgeConfig["style"],
    });
    expect(url).toContain("labelColor=000000");
    expect(url).toContain("color=000000");
    expect(url).toContain("logoColor=ffffff");
    expect(url).toContain("style=for-the-badge");
  });
});

describe("badge params", () => {
  it("round-trips a config", () => {
    const cfg: BadgeConfig = {
      name: "Next-Auth & co",
      showIcon: false,
      logo: "nodedotjs",
      logoColor: "#123abc",
      labelColor: "#ff0000",
      color: "#00ff00",
      style: "flat-square",
    };
    expect(parseBadgeParams(`?${serializeBadgeParams(cfg)}`)).toEqual(cfg);
  });

  it("defaults empty params", () => {
    expect(parseBadgeParams("")).toEqual(DEFAULT_BADGE);
  });

  it("falls back on invalid values", () => {
    expect(
      parseBadgeParams("?style=evil&labelColor=zzz&logoColor=12&color=%3Cx"),
    ).toEqual(DEFAULT_BADGE);
  });

  it("keeps a cleared logo across reloads", () => {
    const cfg = { ...DEFAULT_BADGE, logo: "" };
    expect(parseBadgeParams(`?${serializeBadgeParams(cfg)}`).logo).toBe("");
  });

  it("treats any icon value other than 0 as shown", () => {
    expect(parseBadgeParams("?icon=1").showIcon).toBe(true);
    expect(parseBadgeParams("?icon=0").showIcon).toBe(false);
  });

  it("drops non-slug logos", () => {
    expect(parseBadgeParams("?logo=%3Cscript%3E").logo).toBe(
      DEFAULT_BADGE.logo,
    );
  });
});
