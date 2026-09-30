// Generated at build time by scripts/generate-simple-icons.js
export async function getIcons(signal?: AbortSignal): Promise<SimpleIcon[]> {
  const req = await fetch("/simple-icons.json", { signal });
  if (!req.ok) throw new Error(`Failed to load icons: HTTP ${req.status}`);
  return req.json();
}
