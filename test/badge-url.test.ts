import { describe, expect, it } from "vitest";
import {
  buildBadgeUrl,
  escapeShieldsText,
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
