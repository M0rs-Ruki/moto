export function setCachedData<T>(key: string, data: T): void {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error("Failed to cache data:", error);
  }
}

export function getCachedData<T>(key: string, maxAge: number): T | null {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > maxAge) {
      sessionStorage.removeItem(key);
      return null;
    }

    return data as T;
  } catch (error) {
    console.error("Failed to retrieve cached data:", error);
    return null;
  }
}

export function getCacheAge(key: string): number {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return Infinity;

    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp;
  } catch {
    return Infinity;
  }
}
