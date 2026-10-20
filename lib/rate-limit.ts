/**
 * Tiny in-memory fixed-window rate limiter shared by the portfolio API routes.
 *
 * Same trade-off as the original contact-route limiter: state lives on
 * globalThis so it survives hot reloads and is shared across route modules in
 * one isolate. Serverless instances do not share it — good enough abuse
 * damping for a portfolio, not a substitute for an edge-level WAF.
 */

type RateEntry = { windowStart: number; count: number };

const STORE_KEY = "__portfolioApiRateLimit";

type RateLimitGlobal = typeof globalThis & {
  [STORE_KEY]?: Map<string, RateEntry>;
};

const store: Map<string, RateEntry> =
  (globalThis as RateLimitGlobal)[STORE_KEY] || new Map();

(globalThis as RateLimitGlobal)[STORE_KEY] = store;

/**
 * Records one request for `key` and reports whether it exceeds `max` calls
 * per `windowMs`. The first call in a fresh window always passes.
 */
export function isRateLimited(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

/** Best-effort client key: first forwarded IP, then x-real-ip, then a bucket. */
export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return (
    forwarded.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
