import { useState, useEffect, useRef } from "react";
import { VehicleCategory } from "../types";
import { CACHE_KEYS, CACHE_DURATIONS } from "../constants";
import { getCachedData, setCachedData } from "@/lib/cache";
import apiClient from "@/lib/api";

export function useCategories() {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        // Try cache first
        const cached = getCachedData<VehicleCategory[]>(
          CACHE_KEYS.CATEGORIES,
          CACHE_DURATIONS.CATEGORIES,
        );

        if (cached) {
          setCategories(cached);
          setLoading(false);
          fetchingRef.current = false;
          return;
        }

        // Fetch from API
        const response = await apiClient.get("/categories");
        const data = response.data.categories;

        setCategories(data);
        setCachedData(CACHE_KEYS.CATEGORIES, data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
