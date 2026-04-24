const COLOR_HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function sanitizeColorHex(value: string, fallback: string): string {
  return COLOR_HEX_PATTERN.test(value) ? value : fallback;
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
