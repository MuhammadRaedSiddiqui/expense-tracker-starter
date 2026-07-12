const idempotencyCache = new Map();

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENTRIES = 10000;

// Clean expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of idempotencyCache) {
    if (now > entry.expiresAt) {
      idempotencyCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // Every hour

export function idempotent() {
  return (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
      return next();
    }

    const cacheKey = `${req.userId}:${idempotencyKey}`;
    const cached = idempotencyCache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      return res.status(cached.statusCode).json(cached.body);
    }

    // Intercept the response to cache it
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (idempotencyCache.size >= MAX_ENTRIES) {
          const firstKey = idempotencyCache.keys().next().value;
          idempotencyCache.delete(firstKey);
        }

        idempotencyCache.set(cacheKey, {
          statusCode: res.statusCode,
          body,
          expiresAt: Date.now() + CACHE_TTL,
        });
      }
      return originalJson(body);
    };

    next();
  };
}
