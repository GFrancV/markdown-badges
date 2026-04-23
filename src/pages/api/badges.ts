import type { APIRoute } from "astro";

import { filterBadges, getBadges } from "@/services/badges";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

export const GET: APIRoute = ({ url }) => {
  const search = url.searchParams.get("search");
  const limitParam = url.searchParams.get("limit");

  const parsed = limitParam !== null ? parseInt(limitParam, 10) : NaN;
  const limit = Math.min(
    Math.max(1, Number.isNaN(parsed) ? DEFAULT_LIMIT : parsed),
    MAX_LIMIT,
  );

  try {
    const badges = search ? filterBadges({ query: search }) : getBadges();
    const data = badges.slice(0, limit);

    return Response.json(
      { total: badges.length, limit, count: data.length, data },
      { headers: CORS_HEADERS },
    );
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
};
