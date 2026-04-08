/**
 * In-memory rate limiter with sliding window per IP.
 *
 * For production at scale, replace with Redis-backed implementation.
 * For a single-instance Next.js deployment this is sufficient.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();

  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  const cutoff = now - windowMs * 2;

  for (const [key, entry] of store.entries()) {
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Max requests allowed within the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Optional prefix to namespace different limiters */
  prefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check and consume a rate limit token for the given key (usually IP).
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const fullKey = config.prefix ? `${config.prefix}:${key}` : key;

  cleanup(config.windowMs);

  let entry = store.get(fullKey);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(fullKey, entry);
  }

  // Remove timestamps outside the current window
  const windowStart = now - config.windowMs;

  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const resetMs = oldestInWindow + config.windowMs - now;

    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetMs: config.windowMs,
  };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIP(request: Request): string {
  return (
    (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()) ||
    (request.headers.get('x-real-ip')) ||
    '127.0.0.1'
  );
}

/* ===== Pre-configured limiters ===== */

/** Status lookup: 10 requests per minute per IP */
export const STATUS_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
  prefix: 'status',
};

/** Contact form: 5 submissions per 10 minutes per IP */
export const CONTACT_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
  prefix: 'contact',
};

/** Admin auth: 5 attempts per 5 minutes per IP */
export const ADMIN_AUTH_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 5 * 60 * 1000,
  prefix: 'admin-auth',
};

/** Chat messages: 20 messages per minute per IP */
export const CHAT_MESSAGE_LIMIT: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60 * 1000,
  prefix: 'chat-message',
};
