import { useRef, useEffect } from "react";
import { getCachedData, setCachedData } from "./cache";

interface UseFetchWithCacheOptions {
  cacheKey: string;
  cacheDuration?: number;
  fetchFn: (background?: boolean) => Promise<void>;
  immediate?: boolean;
}

/**
 * Hook to handle fetching with caching and preventing duplicate calls
 */
export function useFetchWithCache({
  cacheKey,
  cacheDuration = 30000,
  fetchFn,
  immediate = true,
}: UseFetchWithCacheOptions) {
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchWithProtection = async (background: boolean = false) => {
    // Prevent duplicate fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      await fetchFn(background);
    } finally {
      fetchingRef.current = false;
    }
  };

  const loadFromCacheOrFetch = <T,>(
    setData: (data: T) => void,
    setLoading: (loading: boolean) => void
  ): boolean => {
    const cached = getCachedData<T>(cacheKey, cacheDuration);
    if (cached) {
      setData(cached);
      setLoading(false);
      // Only fetch in background if cache is older than 10 seconds
      try {
        const cacheEntry = JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
        const cacheAge = Date.now() - (cacheEntry.timestamp || 0);
        if (cacheAge > 10000 && mountedRef.current && !fetchingRef.current) {
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              fetchWithProtection(true);
            }
          }, 1000);
        }
      } catch {
        // Ignore cache parsing errors
      }
      return true; // Data loaded from cache
    }
    return false; // Need to fetch
  };

  return {
    fetchWithProtection,
    loadFromCacheOrFetch,
    mountedRef,
  };
}

