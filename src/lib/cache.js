/**
 * Simple in-memory cache for API responses
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum number of cache entries
  }

  /**
   * Generate cache key from function name and arguments
   */
  generateKey(name, args) {
    return `${name}:${JSON.stringify(args)}`;
  }

  /**
   * Get cached value if exists and not expired
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with TTL (time-to-live in milliseconds)
   */
  set(key, data, ttl = 60000) {
    // Enforce max cache size (LRU-like behavior)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
    });
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern) {
    if (!pattern) {
      // Clear all cache
      this.cache.clear();
      return;
    }

    // Remove entries matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
const cache = new Cache();

/**
 * Wrap an async function with caching
 * @param {Function} fn - Async function to cache
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds (default: 60000)
 * @param {string} options.key - Custom cache key (optional)
 * @param {boolean} options.enabled - Enable/disable caching (default: true)
 */
export function withCache(fn, options = {}) {
  const { ttl = 60000, key: customKey, enabled = true } = options;

  return async (...args) => {
    if (!enabled) {
      return fn(...args);
    }

    const cacheKey = customKey || cache.generateKey(fn.name, args);

    // Try to get from cache
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      console.log(`[Cache] Hit: ${cacheKey}`);
      return cached;
    }

    // Cache miss - fetch data
    console.log(`[Cache] Miss: ${cacheKey}`);
    const result = await fn(...args);

    // Store in cache
    cache.set(cacheKey, result, ttl);

    return result;
  };
}

/**
 * Invalidate cache by pattern
 */
export function invalidateCache(pattern) {
  cache.invalidate(pattern);
  console.log(`[Cache] Invalidated: ${pattern || 'all'}`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.getStats();
}

export default cache;
