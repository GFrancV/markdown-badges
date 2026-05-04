/**
 * Pure helper functions shared between generate-badges.js and the test suite.
 * Every function here must be side-effect free so it can be unit-tested.
 */

export const CATEGORY_MAP = {
  'Artificial Intelligence and Bots': 'Artificial Intelligence',
  'Developer/Forums': 'Forums',
  'Frameworks, Platforms and Libraries': 'Frameworks',
  'Hosting/SaaS': 'SaaS',
  'IDEs/Editors': 'IDEs',
  'Smartphone Brands': 'Smartphone',
  'Work/Jobs': 'Jobs',
  'Quantum Programming Frameworks and Libraries': 'Quantum Programming',
};

/**
 * Remove emoji codepoints and trim surrounding whitespace.
 * Covers the full Extended_Pictographic range (including ⌚ U+231A, ⚙️ U+2699,
 * ZWJ sequences like 🧑‍💻, and variation selectors).
 */
export function stripEmoji(str) {
  return str
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')  // variation selectors
    .replace(/‍/gu, '')               // ZWJ (U+200D)
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '') // skin-tone modifiers
    .trim();
}

/**
 * Strip markdown backslash escape sequences from a string.
 * In markdown table source, characters like _ are often escaped (\_) to prevent
 * accidental italic/bold formatting. The backslash is not part of the actual name.
 * Example: "Pop!\_OS" → "Pop!_OS"
 */
export function stripMarkdownEscapes(str) {
  return str.replace(/\\(.)/g, '$1');
}

/**
 * Convert a badge name to a slug id.
 * Rule: lowercase + spaces → hyphens. All other characters (+ # .) are kept as-is.
 * Examples: "C++" → "c++", ".NET" → ".net", "Google Chrome" → "google-chrome"
 * Call sanitizeId() on the result to make it safe for use as a URL path segment.
 */
export function nameToId(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Percent-encode characters that are unsafe in URL path segments.
 *
 * Characters encoded:
 *   #  → %23  (fragment identifier — browsers strip everything from # onwards,
 *               so /badges/c# is identical to /badges/c for the server)
 *   ?  → %3F  (query-string separator)
 *   \  → %5C  (non-standard in URLs; browsers normalize \ to /, creating
 *               unintended nested paths like /badges/pop!/_os)
 *
 * Forward slashes are intentionally NOT encoded: the [‥‥id] spread route
 * supports multi-segment paths, so IDs like "jwt/json-web-token" are valid.
 */
export function sanitizeId(id) {
  return id
    .replace(/#/g, '%23')
    .replace(/\?/g, '%3F')
    .replace(/\\/g, '%5C');
}

/**
 * Extract the https URL from a markdown image string: `![Alt Text](url)`.
 * Returns null if the input doesn't match the expected format.
 */
export function extractUrl(markdown) {
  const match = markdown.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  return match ? match[1] : null;
}

/**
 * Parse one pipe-delimited markdown table row into trimmed cell strings.
 * Returns null for header rows ("| Name |…"), separator rows ("| --- |…"),
 * or rows with fewer than 3 cells.
 */
export function parseTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;

  const cells = trimmed
    .split('|')
    .map(c => c.trim())
    .filter(Boolean);

  if (cells[0] === 'Name') return null;
  if (cells.every(c => /^[-:\s]+$/.test(c))) return null;

  return cells.length >= 3 ? cells : null;
}

/**
 * Validate a single badge object against the content.config.ts schema.
 * Returns an array of error messages; empty array means the badge is valid.
 */
export function validateBadge(badge) {
  const errors = [];

  const requiredFields = ['id', 'name', 'url', 'markdown', 'category'];
  for (const field of requiredFields) {
    if (!Object.hasOwn(badge, field)) {
      errors.push(`missing field: ${field}`);
      continue;
    }
    if (typeof badge[field] !== 'string' || badge[field].trim() === '') {
      errors.push(`empty or non-string field: ${field}`);
    }
  }

  if (badge.id && badge.id !== badge.id.toLowerCase()) {
    errors.push(`id is not lowercase: ${badge.id}`);
  }
  if (badge.id && /\s/.test(badge.id)) {
    errors.push(`id contains whitespace: ${badge.id}`);
  }
  if (badge.id && /[#?\\]/.test(badge.id)) {
    errors.push(`id contains URL-unsafe characters (# ? or \\): ${badge.id}`);
  }

  if (badge.url) {
    try {
      new URL(badge.url);
    } catch {
      errors.push(`invalid URL: ${badge.url}`);
    }
  }

  if (badge.markdown && !badge.markdown.startsWith('![')) {
    errors.push(`markdown does not start with ![: ${badge.markdown}`);
  }
  if (badge.markdown && badge.url) {
    const urlInMarkdown = extractUrl(badge.markdown);
    if (urlInMarkdown !== badge.url) {
      errors.push(`url field does not match URL in markdown`);
    }
  }

  if (badge.category && /\p{Extended_Pictographic}/u.test(badge.category)) {
    errors.push(`category contains emoji: ${badge.category}`);
  }

  return errors;
}
