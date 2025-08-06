import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import CheckmarkCircle from "@/components/CheckmarkCircle";
import PaginationControls from "@/components/PaginationControls";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import useIsMobile from "@/hooks/display/useIsMobile";
import { usePaginatedPlots } from "@/hooks/usePaginatedPlots";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter, truncateHex } from "@/utils/format";
import { Plot } from "@/utils/types";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import React, { memo, useMemo } from "react";
import { PlotCluster } from "./types";

interface ClusterPlotsTableProps {
  cluster: PlotCluster;
  onPlotClick?: (plot: Plot) => void;
  showActions?: boolean;
  enablePagination?: boolean;
  initialPageSize?: number;
  compact?: boolean;
}

export const ClusterPlotsTable = memo(
  ({
    cluster,
    onPlotClick,
    showActions = false,
    enablePagination = true,
    initialPageSize = 10,
    compact = false,
  }: ClusterPlotsTableProps) => {
    const isMobile = useIsMobile();
    const harvestableIndex = useHarvestableIndex();

    const sortedPlots = useMemo(() => {
      // Sort plots by index (position in line)
      return [...cluster.plots].sort((a, b) => a.index.sub(b.index).toNumber());
    }, [cluster.plots]);

    // Set up pagination
    const pagination = usePaginatedPlots(sortedPlots, {
      initialPageSize: compact ? 5 : initialPageSize,
      showAllByDefault: !enablePagination,
      isLoading: false,
    });

    // Use paginated plots or all plots based on pagination setting
    const plotsToShow = enablePagination ? pagination.paginatedPlots : sortedPlots;

    if (cluster.plots.length === 0) {
      return (
        <div className="text-center py-8 text-pinto-gray-4">
          <p>No plots in this cluster</p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
            {plotsToShow.map((plot, index) => (
              <ClusterPlotRow
                key={plot.id || plot.index.toHuman()}
                plot={plot}
                harvestableIndex={harvestableIndex || TokenValue.ZERO}
                isMobile={isMobile}
                onClick={onPlotClick ? () => onPlotClick(plot) : undefined}
                showActions={showActions}
              />
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {enablePagination && sortedPlots.length > (compact ? 5 : initialPageSize) && (
          <div className="mt-4 flex justify-center">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalPlots}
              showAll={pagination.showAll}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              pageNumbers={pagination.pageNumbers}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              onToggleShowAll={pagination.toggleShowAll}
              onNextPage={pagination.nextPage}
              onPreviousPage={pagination.previousPage}
              onFirstPage={pagination.goToFirstPage}
              onLastPage={pagination.goToLastPage}
              compact={compact}
              isLoading={false}
            />
          </div>
        )}
      </>
    );
  },
);

interface ClusterPlotRowProps {
  plot: Plot;
  harvestableIndex: TokenValue;
  isMobile: boolean;
  onClick?: () => void;
  showActions?: boolean;
}

const ClusterPlotRow = memo(({ plot, harvestableIndex, isMobile, onClick, showActions }: ClusterPlotRowProps) => {
  const placeInLine = plot.index.sub(harvestableIndex);
  const isHarvesting = placeInLine.lt(0);
  const nonHarvestablePods = plot.unharvestablePods || plot.pods;

  return (
    <TableRow
      className={`h-[4.5rem] bg-transparent items-center ${onClick && !showActions ? "hover:bg-pinto-green-1/50 hover:cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <TableCell className="text-black font-[400] pr-0">
        {/* Desktop */}
        <div className="hidden sm:flex gap-1">
          <div className="flex flex-col items-start">
            <div className="hidden sm:flex sm:items-center sm:gap-1.5">
              <img src={podIcon} className="h-6 w-6" alt="Pods" />
              <div className="pinto-sm sm:pinto-body-light">
                {formatter.number(nonHarvestablePods, {
                  minValue: 0.01,
                })}{" "}
                Pods
              </div>
              {plot.source === "MARKET" ? (
                <div className="pinto-body-light text-pinto-light">(purchased from Pod Market)</div>
              ) : plot.source === "TRANSFER" && plot.preTransferOwner ? (
                <div className="pinto-body-light text-pinto-light">
                  (transferred from {truncateHex(plot.preTransferOwner, 6, 4)})
                </div>
              ) : null}
            </div>
            {plot.beansPerPod ? (
              <div className="flex items-left gap-1 text-pinto-light pinto-sm">
                <CornerBottomLeftIcon
                  className="h-4 w-4 ml-2 mt-1"
                  style={{
                    stroke: "url(#cornerGradient)",
                  }}
                />
                <svg height="0" width="0">
                  <defs>
                    <linearGradient id="cornerGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#B99476" />
                      <stop offset="100%" stopColor="#5AA897" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex gap-1 -ml-1 mt-2">
                  <IconImage size={4} src={pintoIcon} />
                  <div>
                    {(plot.preTransferSource ?? plot.source) === "MARKET" ? (
                      <span className="inline-flex items-center gap-1">
                        {"Purchased with "}
                        <span className="text-black">
                          {`${formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })} Pinto`}
                        </span>
                        <span className="block sm:hidden md:block lg:hidden min-[1300px]:block">
                          {" at an effective Temp of "}
                        </span>
                        <span className="hidden sm:block md:hidden lg:block min-[1300px]:hidden">{"@"}</span>
                        <span className="text-black">
                          {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                            minValue: 0.01,
                          })}%`}
                        </span>
                      </span>
                    ) : (
                      <span>
                        <span className="text-black">
                          {formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })}
                        </span>
                        {" Pinto Sown at "}
                        <span className="text-black">
                          {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                            minValue: 0.01,
                          })}%`}
                        </span>
                        {" Temp"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-pinto-light pinto-sm">Temperature data unavailable for this Plot</div>
            )}
          </div>
        </div>
        {/* Mobile */}
        <div className="flex-col sm:hidden items-center gap-1 text-xs">
          <div className="flex sm:flex sm:items-center sm:gap-1.5">
            <img src={podIcon} className="h-4 w-4 mr-1 mt-1" alt="Pods" />
            <div className="text-base">
              {formatter.number(nonHarvestablePods, {
                minValue: 0.01,
              })}{" "}
              Pods
            </div>
          </div>
          {plot.beansPerPod ? (
            <div className="flex flex-col">
              <div className="flex items-left gap-1 text-pinto-light text-xs mt-0.5">
                <CornerBottomLeftIcon
                  className="h-3 w-3 ml-1.5"
                  style={{
                    stroke: "url(#cornerGradient)",
                  }}
                />
                <svg height="0" width="0">
                  <defs>
                    <linearGradient id="cornerGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#B99476" />
                      <stop offset="100%" stopColor="#5AA897" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex gap-1 -ml-1 mt-0.5">
                  <IconImage size={3} src={pintoIcon} />
                  <div>
                    <span className="text-black text-xs">
                      {formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })}
                    </span>
                    {" at "}
                    <span className="text-black text-xs">
                      {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                        minValue: 0.01,
                      })}%`}
                    </span>
                  </div>
                </div>
              </div>
              {plot.source === "MARKET" ? (
                <div className="text-pinto-light text-xs ml-2">Purchased on Pod Market</div>
              ) : plot.source === "TRANSFER" && plot.preTransferOwner ? (
                <div className="text-pinto-light text-xs ml-2">
                  Transferred from {truncateHex(plot.preTransferOwner, 6, 4)}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-pinto-light text-xs">Temperature data unavailable for this Plot</div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right pl-0">
        <div className="inline-flex items-center gap-1.5">
          <div className="hidden sm:block pinto-body-light text-pinto-light">{` at `}</div>
          <div className="pinto-sm sm:pinto-body-light inline-flex gap-1">
            {placeInLine.gt(999999) && isMobile
              ? placeInLine.toHuman("ultraShort")
              : formatter.number(isHarvesting ? TokenValue.ZERO : placeInLine.eq(0) ? 0.001 : placeInLine, {
                  minValue: 0.01,
                })}
            <span className="block sm:hidden md:block lg:hidden min-[1350px]:block text-pinto-light">
              in the Pod Line
            </span>
            <span className="hidden sm:block md:hidden lg:block min-[1350px]:hidden text-pinto-light">in Line</span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
});

ClusterPlotsTable.displayName = "ClusterPlotsTable";
ClusterPlotRow.displayName = "ClusterPlotRow";
