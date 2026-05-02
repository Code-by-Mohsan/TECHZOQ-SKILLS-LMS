const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return function check(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = hits.get(identifier);

    if (!entry || now > entry.resetAt) {
      hits.set(identifier, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count };
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) {
      hits.delete(key);
    }
  }
}, 60_000);
