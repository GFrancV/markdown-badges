import { sanitizeColorHex } from "@/lib/sanitize";

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

// shields.io uses "-" and "_" as separators in the path
export function escapeShieldsText(text: string): string {
  return encodeURIComponent(
    text.replaceAll("-", "--").replaceAll("_", "__").replaceAll(" ", "_"),
  );
}

export function buildBadgeUrl(c: BadgeConfig): string {
  const style = BADGE_STYLES.includes(c.style) ? c.style : "for-the-badge";
  const params = new URLSearchParams({ style });
  if (c.showIcon && c.logo) {
    params.set("logo", c.logo);
    params.set("logoColor", sanitizeColorHex(c.logoColor, "#ffffff").slice(1));
  }
  params.set("labelColor", sanitizeColorHex(c.labelColor, "#000000").slice(1));
  params.set("color", sanitizeColorHex(c.color, "#000000").slice(1));
  return `https://img.shields.io/badge/${escapeShieldsText(c.name)}-1000?${params}`;
}
