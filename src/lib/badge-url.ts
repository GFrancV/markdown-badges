import { escapeHtmlAttr, sanitizeColorHex } from "@/lib/sanitize";

export const BADGE_STYLES = [
  "flat",
  "flat-square",
  "plastic",
  "for-the-badge",
  "social",
] as const;
export type BadgeStyle = (typeof BADGE_STYLES)[number];

export interface BadgeConfig {
  name: string;
  showIcon: boolean;
  logo: string;
  logoColor: string;
  labelColor: string;
  color: string;
  style: BadgeStyle;
}

export const DEFAULT_BADGE: BadgeConfig = {
  name: "GitHub",
  showIcon: true,
  logo: "github",
  logoColor: "#ffffff",
  labelColor: "#000000",
  color: "#000000",
  style: "for-the-badge",
};

// A few real slugs contain "_" (e.g. hive_blockchain)
const SLUG_PATTERN = /^[a-z0-9_]+$/;
// Control, format (zero-width, bidi) and line-separator characters: invisible
// in the input, but they survive into the copied snippets (a blank line
// breaks the markdown image)
const UNSAFE_TEXT = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]+/gu;
const MAX_NAME_LENGTH = 100;

function isBadgeStyle(value: string | null): value is BadgeStyle {
  return BADGE_STYLES.includes(value as BadgeStyle);
}

// shields.io uses "-" and "_" as separators in the path
export function escapeShieldsText(text: string): string {
  return encodeURIComponent(
    text.replaceAll("-", "--").replaceAll("_", "__").replaceAll(" ", "_"),
  );
}

// Keeps user text inside the `![alt](url)` brackets
export function escapeMarkdownText(text: string): string {
  return text.replaceAll(/[\\[\]]/g, "\\$&");
}

// White or black logo, whichever reads better on the brand color
export function contrastLogoColor(hex: string): string {
  const n = parseInt(hex, 16);
  const luminance =
    (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
}

export function buildBadgeUrl(c: BadgeConfig): string {
  const d = DEFAULT_BADGE;
  const params = new URLSearchParams({
    style: isBadgeStyle(c.style) ? c.style : d.style,
  });
  if (c.showIcon && c.logo) {
    params.set("logo", c.logo);
    params.set("logoColor", sanitizeColorHex(c.logoColor, d.logoColor).slice(1));
  }
  params.set("labelColor", sanitizeColorHex(c.labelColor, d.labelColor).slice(1));
  params.set("color", sanitizeColorHex(c.color, d.color).slice(1));
  return `https://img.shields.io/badge/${escapeShieldsText(c.name)}-1000?${params}`;
}

export function buildMarkdownSnippet(name: string, badgeUrl: string): string {
  return `![${escapeMarkdownText(name)}](${badgeUrl})`;
}

export function buildImgSnippet(name: string, badgeUrl: string): string {
  return `<img src="${badgeUrl}" alt="${escapeHtmlAttr(`${name} badge`)}">`;
}

// Generator state <-> page query string (colors stored without "#")
export function serializeBadgeParams(c: BadgeConfig): string {
  const params = new URLSearchParams({
    name: c.name,
    logo: c.logo,
    logoColor: c.logoColor.slice(1),
    labelColor: c.labelColor.slice(1),
    color: c.color.slice(1),
    style: c.style,
  });
  if (!c.showIcon) params.set("icon", "0");
  return params.toString();
}

export function parseBadgeParams(search: string): BadgeConfig {
  const p = new URLSearchParams(search);
  const d = DEFAULT_BADGE;
  const hex = (key: string, fallback: string) =>
    sanitizeColorHex(`#${p.get(key)}`, fallback);
  const logo = p.get("logo") ?? d.logo;
  const style = p.get("style");

  return {
    name: (p.get("name") ?? d.name)
      .replaceAll(UNSAFE_TEXT, " ")
      .slice(0, MAX_NAME_LENGTH),
    showIcon: p.get("icon") !== "0",
    logo: logo === "" || SLUG_PATTERN.test(logo) ? logo : d.logo,
    logoColor: hex("logoColor", d.logoColor),
    labelColor: hex("labelColor", d.labelColor),
    color: hex("color", d.color),
    style: isBadgeStyle(style) ? style : d.style,
  };
}
