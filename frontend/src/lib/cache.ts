/**
 * Simple caching utility for API responses
 * Uses sessionStorage to cache data with expiration
 */

const DEFAULT_CACHE_DURATION = 30000; // 30 seconds

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data if it exists and is still valid
 */
export function getCachedData<T>(
  cacheKey: string,
  maxAge: number = DEFAULT_CACHE_DURATION
): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsed: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - parsed.timestamp < maxAge) {
      return parsed.data;
    }

    // Cache expired, remove it
    sessionStorage.removeItem(cacheKey);
    return null;
  } catch {
    return null;
  }
}

/**
 * Set cached data with timestamp
 */
export function setCachedData<T>(cacheKey: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

/**
 * Clear cached data for a specific key
 */
export function clearCachedData(cacheKey: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(cacheKey);
  } catch {
    // Ignore errors
  }
}

/**
 * Clear all cached data
 */
export function clearAllCache(): void {
  if (typeof window === "undefined") return;
  try {
    // Clear all keys that start with "cache_"
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith("cache_")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore errors
  }
}
