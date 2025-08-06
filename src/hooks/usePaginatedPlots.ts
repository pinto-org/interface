import { TokenValue } from "@/classes/TokenValue";
import { Plot } from "@/utils/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  showAll: boolean;
}

export interface PaginatedPlotsResult {
  // Data
  paginatedPlots: Plot[];
  totalPlots: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // State
  currentPage: number;
  pageSize: number;
  showAll: boolean;
  isLoading: boolean;

  // Actions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  toggleShowAll: () => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;

  // Pagination info
  startIndex: number;
  endIndex: number;
  pageNumbers: number[];
}

export interface UsePaginatedPlotsOptions {
  initialPageSize?: number;
  initialPage?: number;
  showAllByDefault?: boolean;
  isLoading?: boolean;
}

/**
 * Hook for client-side pagination of user plots/pods
 * Provides pagination controls, state management, and paginated data
 */
export function usePaginatedPlots(plots: Plot[], options: UsePaginatedPlotsOptions = {}): PaginatedPlotsResult {
  const { initialPageSize = 25, initialPage = 1, showAllByDefault = false, isLoading = false } = options;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [showAll, setShowAll] = useState(showAllByDefault);

  // Track plots length to detect changes
  const prevPlotsLengthRef = useRef(plots.length);

  // Reset to first page when plots change
  useEffect(() => {
    if (prevPlotsLengthRef.current !== plots.length) {
      setCurrentPage(1);
      prevPlotsLengthRef.current = plots.length;
    }
  }, [plots.length]);

  // Calculate pagination values
  const totalPlots = plots.length;
  const totalPages = Math.ceil(totalPlots / pageSize);

  // Get paginated data
  const paginatedPlots = useMemo(() => {
    if (showAll || totalPlots <= pageSize) {
      return plots;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalPlots);

    return plots.slice(startIndex, endIndex);
  }, [plots, currentPage, pageSize, showAll, totalPlots]);

  // Pagination info
  const startIndex = showAll ? 1 : (currentPage - 1) * pageSize + 1;
  const endIndex = showAll ? totalPlots : Math.min(currentPage * pageSize, totalPlots);
  const hasNextPage = currentPage < totalPages && !showAll;
  const hasPreviousPage = currentPage > 1 && !showAll;

  // Generate page numbers for pagination controls (show max 5 pages)
  const pageNumbers = useMemo(() => {
    if (showAll) {
      return [];
    }

    const maxPages = 5;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the start of the window
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const end = Math.min(totalPages, start + maxPages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, showAll]);

  // Action handlers
  const setPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleSetPageSize = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      // Adjust current page to maintain approximate position
      const currentStartIndex = (currentPage - 1) * pageSize;
      const newPage = Math.max(1, Math.ceil((currentStartIndex + 1) / newPageSize));
      setCurrentPage(newPage);
    },
    [currentPage, pageSize],
  );

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
    if (!showAll) {
      setCurrentPage(1);
    }
  }, [showAll]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  return {
    // Data
    paginatedPlots,
    totalPlots,
    totalPages,
    hasNextPage,
    hasPreviousPage,

    // State
    currentPage,
    pageSize,
    showAll,
    isLoading,

    // Actions
    setPage,
    setPageSize: handleSetPageSize,
    toggleShowAll,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,

    // Pagination info
    startIndex,
    endIndex,
    pageNumbers,
  };
}

/**
 * Helper hook to get pagination stats for display
 */
export function usePaginationStats(paginatedResult: PaginatedPlotsResult) {
  const { totalPlots, startIndex, endIndex, showAll } = paginatedResult;

  return useMemo(() => {
    if (totalPlots === 0) {
      return "No plots found";
    }

    if (showAll || totalPlots <= paginatedResult.pageSize) {
      return `Showing all ${totalPlots} ${totalPlots === 1 ? "plot" : "plots"}`;
    }

    return `Showing ${startIndex}-${endIndex} of ${totalPlots} plots`;
  }, [totalPlots, startIndex, endIndex, showAll, paginatedResult.pageSize]);
}
