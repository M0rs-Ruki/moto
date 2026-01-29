import { useMemo } from "react";

/**
 * Custom hook to filter and search through an array of items
 * @param items - Array of items to filter
 * @param searchTerm - Search query
 * @param searchFields - Array of field names to search in
 * @returns Filtered array
 */
export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
): T[] {
  return useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowercaseSearch = searchTerm.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowercaseSearch);
        }
        if (typeof value === "number") {
          return value.toString().includes(lowercaseSearch);
        }
        return false;
      }),
    );
  }, [items, searchTerm, searchFields]);
}
