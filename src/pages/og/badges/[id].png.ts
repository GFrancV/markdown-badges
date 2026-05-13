import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { createElement } from "react";

import { BadgeOg } from "@/components/og/badge-og";

export const prerender = false;

function toPngUrl(url: string): string {
  if (url.includes(".svg")) return url.replace(".svg", ".png");
  const qi = url.indexOf("?");
  return qi !== -1 ? url.slice(0, qi) + ".png" + url.slice(qi) : url + ".png";
}

function readPngDimensions(buf: ArrayBuffer): {
  width: number;
  height: number;
} {
  const view = new DataView(buf);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id || "undefined-badge";

  const badge = await getEntry("badges", id);
  if (badge === undefined) return new Response(null, { status: 404 });

  let badgeImage: string | null = null;
  let badgeDims: { width: number; height: number } | null = null;

  try {
    const pngUrl = toPngUrl(badge.data.url);
    const res = await fetch(pngUrl, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const buf = await res.arrayBuffer();
      badgeDims = readPngDimensions(buf);
      const b64 = Buffer.from(buf).toString("base64");
      badgeImage = `data:image/png;base64,${b64}`;
    }
  } catch {}

  return new ImageResponse(
    createElement(BadgeOg, { badge: badge.data, badgeImage, badgeDims }),
    { width: 1200, height: 630 },
  );
};
