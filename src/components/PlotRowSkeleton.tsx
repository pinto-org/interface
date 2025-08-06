import React from "react";
import { TableCell, TableRow } from "./ui/Table";

interface PlotRowSkeletonProps {
  isMobile: boolean;
}

export function PlotRowSkeleton(_props: PlotRowSkeletonProps) {
  return (
    <TableRow className="h-[4.5rem] bg-transparent items-center animate-pulse">
      <TableCell className="text-black font-[400] pr-0">
        {/* Desktop */}
        <div className="hidden sm:flex gap-1">
          <div className="flex flex-col items-start">
            <div className="hidden sm:flex sm:items-center sm:gap-1.5">
              <div className="h-6 w-6 bg-pinto-gray-2 rounded" />
              <div className="h-4 w-24 bg-pinto-gray-2 rounded" />
            </div>
            <div className="flex items-left gap-1 mt-2">
              <div className="h-4 w-4 bg-pinto-gray-2 rounded ml-2" />
              <div className="flex gap-1 -ml-1">
                <div className="h-4 w-4 bg-pinto-gray-2 rounded" />
                <div className="h-4 w-32 bg-pinto-gray-2 rounded" />
              </div>
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="flex-col sm:hidden items-center gap-1">
          <div className="flex sm:flex sm:items-center sm:gap-1.5">
            <div className="h-4 w-4 bg-pinto-gray-2 rounded mr-1 mt-1" />
            <div className="h-4 w-20 bg-pinto-gray-2 rounded" />
          </div>
          <div className="flex flex-col mt-1">
            <div className="flex items-left gap-1">
              <div className="h-3 w-3 bg-pinto-gray-2 rounded ml-1.5" />
              <div className="flex gap-1 -ml-1">
                <div className="h-3 w-3 bg-pinto-gray-2 rounded" />
                <div className="h-3 w-24 bg-pinto-gray-2 rounded" />
              </div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right pl-0">
        <div className="inline-flex items-center gap-1.5">
          <div className="hidden sm:block h-4 w-8 bg-pinto-gray-2 rounded" />
          <div className="h-4 w-16 bg-pinto-gray-2 rounded" />
          <div className="h-4 w-20 bg-pinto-gray-2 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

interface PlotsTableSkeletonProps {
  rows?: number;
  isMobile: boolean;
}

export function PlotsTableSkeleton({ rows = 5, isMobile }: PlotsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <PlotRowSkeleton key={`skeleton-row-${rows * 1000 + index}`} isMobile={isMobile} />
      ))}
    </>
  );
}

export default PlotRowSkeleton;
