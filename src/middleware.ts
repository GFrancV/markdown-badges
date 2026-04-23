import { defineMiddleware } from "astro:middleware";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

export const onRequest = defineMiddleware((context, next) => {
  if (!context.url.pathname.startsWith("/api/")) return next();

  const ip = getClientIp(context.request);
  const { allowed, retryAfter } = checkRateLimit(ip);
  console.log(ip);

  if (allowed) return next();

  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(MAX_REQUESTS),
      "X-RateLimit-Remaining": "0",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
