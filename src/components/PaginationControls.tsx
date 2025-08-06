import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  showAll: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumbers: number[];
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onToggleShowAll: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  className?: string;
  compact?: boolean;
  isLoading?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  showAll,
  hasNextPage,
  hasPreviousPage,
  pageNumbers,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  onToggleShowAll,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  onLastPage,
  className = "",
  compact = false,
  isLoading = false,
}: PaginationControlsProps) {
  if (totalItems === 0) {
    return null;
  }

  // Don't show pagination if there's only one page and not showing all
  if (totalPages <= 1 && !showAll) {
    return null;
  }

  const getPaginationText = () => {
    if (totalItems === 0) {
      return "No items found";
    }

    if (showAll || totalItems <= pageSize) {
      return `Showing all ${totalItems} ${totalItems === 1 ? "item" : "items"}`;
    }

    return `Showing ${startIndex}-${endIndex} of ${totalItems} items`;
  };

  const renderPageNumbers = () => {
    if (showAll || compact || pageNumbers.length <= 1) return null;

    return (
      <div className="flex items-center space-x-2">
        {/* First Page Arrow */}
        {hasPreviousPage && currentPage > 2 && (
          <button
            type="button"
            className="p-1 text-pinto-gray-4 hover:text-pinto-green transition-colors"
            onClick={onFirstPage}
            aria-label="First page"
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </button>
        )}

        {/* Previous Arrow */}
        {hasPreviousPage && (
          <button
            type="button"
            className="p-1 text-pinto-gray-4 hover:text-pinto-green transition-colors"
            onClick={onPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          return (
            <button
              type="button"
              key={pageNumber}
              className={`px-2 py-1 text-sm transition-colors ${
                isActive ? "text-pinto-green font-medium" : "text-pinto-gray-4 hover:text-pinto-green"
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Arrow */}
        {hasNextPage && (
          <button
            type="button"
            className="p-1 text-pinto-gray-4 hover:text-pinto-green transition-colors"
            onClick={onNextPage}
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}

        {/* Last Page Arrow */}
        {hasNextPage && currentPage < totalPages - 1 && (
          <button
            type="button"
            className="p-1 text-pinto-gray-4 hover:text-pinto-green transition-colors"
            onClick={onLastPage}
            aria-label="Last page"
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className} ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Left side - Info and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="pinto-sm text-pinto-gray-4">{isLoading ? "Loading..." : getPaginationText()}</div>

        {!compact && (
          <div className="flex items-center gap-2">
            <span className="pinto-sm text-pinto-gray-4">Items per page:</span>
            <Select
              value={showAll ? "all" : pageSize.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  onToggleShowAll();
                } else {
                  onPageSizeChange(Number(value));
                }
              }}
            >
              <SelectTrigger className="w-20 h-8 border-pinto-gray-3 text-pinto-gray-4 hover:border-pinto-gray-4 focus:border-pinto-gray-4 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-pinto-gray-4 hover:text-pinto-gray-5 hover:bg-pinto-gray-1 data-[state=checked]:bg-pinto-green-4 data-[state=checked]:text-white"
                  >
                    {size}
                  </SelectItem>
                ))}
                <SelectItem
                  value="all"
                  className="text-pinto-gray-4 hover:text-pinto-gray-5 hover:bg-pinto-gray-1 data-[state=checked]:bg-pinto-green-4 data-[state=checked]:text-white"
                >
                  All
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right side - Navigation */}
      {!showAll && totalPages > 1 && (
        <div className="flex items-center gap-4">
          {/* Page numbers only */}
          {renderPageNumbers()}
        </div>
      )}

      {/* Show All toggle for compact mode */}
      {compact && totalItems > PAGE_SIZE_OPTIONS[0] && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowAll}
          className="text-pinto-gray-4 hover:text-pinto-gray-5 border-pinto-gray-3 hover:border-pinto-gray-4"
        >
          {showAll ? `Show ${pageSize} per page` : "Show All"}
        </Button>
      )}
    </div>
  );
}

export default PaginationControls;
