import { useState, useCallback } from "react";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotalItems: (total: number) => void;
  setItemsPerPage: (perPage: number) => void;
  itemsPerPage: number;
}

/**
 * Custom hook for pagination logic
 * @param initialPage - Starting page number (default: 1)
 * @param initialItemsPerPage - Items per page (default: 10)
 * @returns Pagination state and controls
 */
export function usePagination(
  initialPage = 1,
  initialItemsPerPage = 10,
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  return {
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    setTotalItems,
    setItemsPerPage,
    itemsPerPage,
  };
}
