import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { Plot } from "@/utils/types";
import { cn } from "@/utils/utils";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { HoverTooltip } from "./PodLineGraph/HoverTooltip";
import { PartialSelectionOverlay } from "./PodLineGraph/PartialSelectionOverlay";
import { PlotGroup } from "./PodLineGraph/PlotGroup";
import { computeGroupLayout, computePartialSelectionPercent } from "./PodLineGraph/geometry";
import { deriveGroupState } from "./PodLineGraph/selection";

// Layout constants
const HARVESTED_WIDTH_PERCENT = 20;
const PODLINE_WIDTH_PERCENT = 80;
const MIN_PLOT_WIDTH_PERCENT = 0.3; // Minimum plot width for clickability
const MAX_GAP_TO_COMBINE = TokenValue.fromHuman("1000000", PODS.decimals); // Combine plots within 1M gap for visual grouping

// Grid and scale constants
const AXIS_INTERVAL = 10_000_000; // 10M intervals for axis labels
const LOG_SCALE_K = 1; // Exponential transformation factor for log scale
const MILLION = 1_000_000;
const TOOLTIP_OFFSET = 12; // px offset for tooltip positioning

interface CombinedPlot {
  startIndex: TokenValue;
  endIndex: TokenValue;
  totalPods: TokenValue;
  plots: Plot[];
  isHarvestable: boolean;
  isSelected: boolean;
}

interface PodLineGraphProps {
  /** Optional: provide specific plots (if not provided, uses all farmer plots) */
  plots?: Plot[];
  /** Indices of selected plots */
  selectedPlotIndices?: string[];
  /** Optional: specify a partial range selection (absolute pod line positions) */
  selectedPodRange?: { start: TokenValue; end: TokenValue };
  /** Optional: show order range overlay from 0 to this position (absolute index) */
  orderRangeEnd?: TokenValue;
  /** Optional: show range overlay from start to end position (absolute indices) */
  rangeOverlay?: { start: TokenValue; end: TokenValue };
  /** Callback when a plot group is clicked - receives all plot indices in the group */
  onPlotGroupSelect?: (plotIndices: string[]) => void;
  /** Disable hover and click interactions */
  disableInteractions?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional: custom label text (default: "My Pods In Line") */
  label?: string;
  /** Optional: specify label type */
  labelType?: "title" | "label";
  /** Optional: override harvestable index (for non-default fields like repayment field) */
  customHarvestableIndex?: TokenValue;
  /** Optional: override pod index (for non-default fields like repayment field) */
  customPodIndex?: TokenValue;
}

/**
 * Groups nearby plots for visual display while keeping each plot individually interactive
 */
function combinePlots(
  plots: Plot[],
  harvestableIndex: TokenValue,
  selectedIndices: Set<string>,
  podLine: TokenValue,
): CombinedPlot[] {
  if (plots.length === 0) return [];

  // Dynamically scale the grouping gap based on pod line size
  const podLineNum = podLine.toNumber();
  let maxGap = MAX_GAP_TO_COMBINE;
  if (podLineNum > 200_000_000) {
    maxGap = TokenValue.fromHuman("50000000", PODS.decimals); // 50M gap for large pod lines
  } else if (podLineNum > 50_000_000) {
    maxGap = TokenValue.fromHuman("10000000", PODS.decimals); // 10M gap for medium pod lines
  }

  // Sort plots by index
  const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());

  const combined: CombinedPlot[] = [];
  let currentGroup: Plot[] = [];

  for (let i = 0; i < sortedPlots.length; i++) {
    const plot = sortedPlots[i];
    const nextPlot = i + 1 < sortedPlots.length ? sortedPlots[i + 1] : undefined;

    currentGroup.push(plot);

    if (nextPlot) {
      // Calculate gap between this plot's end and next plot's start
      const gap = nextPlot.index.sub(plot.index.add(plot.pods));

      // If gap is small enough, continue grouping
      if (gap.lt(maxGap)) {
        continue;
      }
    }

    // Finalize current group (gap is too large or it's the last plot)
    if (currentGroup.length > 0) {
      const startIndex = currentGroup[0].index;
      const lastPlot = currentGroup[currentGroup.length - 1];
      const endIndex = lastPlot.index.add(lastPlot.pods);
      const totalPods = currentGroup.reduce((sum, p) => sum.add(p.pods), TokenValue.ZERO);

      // Check if any plot in group is harvestable or selected
      const isHarvestable = currentGroup.some((p) => p.harvestablePods?.gt(0) || endIndex.lte(harvestableIndex));
      // Check selection by id (for order markers) or index (for regular plots)
      const isSelected = currentGroup.some((p) => selectedIndices.has(p.id || p.index.toHuman()));

      combined.push({
        startIndex,
        endIndex,
        totalPods,
        plots: currentGroup,
        isHarvestable,
        isSelected,
      });

      currentGroup = [];
    }
  }

  return combined;
}

/**
 * Generates nice axis labels at 10M intervals
 */
function generateAxisLabels(min: number, max: number): number[] {
  const labels: number[] = [];
  const range = max - min;

  // Dynamically choose interval based on range size
  let interval = AXIS_INTERVAL; // default 10M
  if (range > 200_000_000) {
    interval = 100_000_000; // 100M intervals for large ranges
  } else if (range > 50_000_000) {
    interval = 50_000_000; // 50M intervals for medium ranges
  }

  const start = Math.floor(min / interval) * interval;

  for (let value = start; value <= max; value += interval) {
    if (value >= min) {
      labels.push(value);
    }
  }

  return labels;
}

/**
 * Generates logarithmic grid points for harvested section
 * Creates 2-3 evenly distributed points in log space
 */
function generateLogGridPoints(maxValue: number): number[] {
  if (maxValue <= 0) return [];

  const gridPoints: number[] = [];
  const minValue = maxValue / 10;

  // For values less than 10M, use simple 1M, 2M, 5M pattern
  if (maxValue <= 10 * MILLION) {
    if (maxValue > MILLION && MILLION > minValue) gridPoints.push(MILLION);
    if (maxValue > 2 * MILLION && 2 * MILLION > minValue) gridPoints.push(2 * MILLION);
    if (maxValue > 5 * MILLION && 5 * MILLION > minValue) gridPoints.push(5 * MILLION);
    return gridPoints;
  }

  // For larger values, use powers of 10
  let power = MILLION;
  while (power < maxValue) {
    if (power > minValue) gridPoints.push(power);
    const next2 = power * 2;
    const next5 = power * 5;
    if (next2 < maxValue && next2 > minValue) gridPoints.push(next2);
    if (next5 < maxValue && next5 > minValue) gridPoints.push(next5);
    power *= 10;
  }

  return gridPoints.sort((a, b) => a - b);
}

/**
 * Formats large numbers for axis labels (e.g., 1000000 -> "1M")
 */
function formatAxisLabel(value: number): string {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toFixed(0);
}

/**
 * Calculates exponential position for log scale visualization
 */
function calculateLogPosition(value: number, minValue: number, maxValue: number): number {
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  return ((Math.exp(LOG_SCALE_K * normalizedValue) - 1) / (Math.exp(LOG_SCALE_K) - 1)) * 100;
}

export default function PodLineGraph({
  plots: providedPlots,
  selectedPlotIndices = [],
  selectedPodRange,
  orderRangeEnd,
  rangeOverlay,
  onPlotGroupSelect,
  disableInteractions = false,
  className,
  label = "My Pods In Line",
  labelType = "label",
  customHarvestableIndex,
  customPodIndex,
}: PodLineGraphProps) {
  const farmerField = useFarmerField();
  const defaultHarvestableIndex = useHarvestableIndex();
  const defaultPodIndex = usePodIndex();

  const harvestableIndex = customHarvestableIndex ?? defaultHarvestableIndex;
  const podIndex = customPodIndex ?? defaultPodIndex;

  const [hoveredPlotIndex, setHoveredPlotIndex] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    podAmount: TokenValue;
    placeStart: TokenValue;
    placeEnd: TokenValue;
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const rafRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipElementRef = useRef<HTMLDivElement>(null);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Hide tooltip smoothly on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (tooltipElementRef.current && tooltipElementRef.current.style.display !== "none") {
        tooltipElementRef.current.classList.remove("animate-fade-in-smooth");
        tooltipElementRef.current.classList.add("animate-fade-out-smooth");
        setTimeout(() => {
          setTooltipData(null);
          if (tooltipElementRef.current) {
            tooltipElementRef.current.style.display = "none";
            tooltipElementRef.current.classList.remove("animate-fade-out-smooth");
          }
        }, 200);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("wheel", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  // Use provided plots or default to farmer's plots
  const plots = providedPlots ?? farmerField.plots;

  // Calculate pod line (total unharvested pods)
  const podLine = podIndex.sub(harvestableIndex);

  // Selected indices set for quick lookup
  const selectedSet = useMemo(() => new Set(selectedPlotIndices), [selectedPlotIndices]);

  // Combine plots for visualization
  const combinedPlots = useMemo(
    () => combinePlots(plots, harvestableIndex, selectedSet, podLine),
    [plots, harvestableIndex, selectedSet, podLine],
  );

  // Separate harvested and unharvested plots
  const { harvestedPlots, unharvestedPlots } = useMemo(() => {
    const harvested: CombinedPlot[] = [];
    const unharvested: CombinedPlot[] = [];

    combinedPlots.forEach((plot) => {
      if (plot.endIndex.lte(harvestableIndex)) {
        // Fully harvested
        harvested.push(plot);
      } else if (plot.startIndex.lt(harvestableIndex)) {
        // Partially harvested - split it
        const harvestedAmount = harvestableIndex.sub(plot.startIndex);
        const unharvestedAmount = plot.endIndex.sub(harvestableIndex);

        harvested.push({
          ...plot,
          endIndex: harvestableIndex,
          totalPods: harvestedAmount,
          isHarvestable: true,
        });

        unharvested.push({
          ...plot,
          startIndex: harvestableIndex,
          totalPods: unharvestedAmount,
        });
      } else {
        // Fully unharvested
        unharvested.push(plot);
      }
    });

    return { harvestedPlots: harvested, unharvestedPlots: unharvested };
  }, [combinedPlots, harvestableIndex]);

  // Calculate max harvested index for log scale
  const maxHarvestedIndex = harvestableIndex.gt(0) ? harvestableIndex.toNumber() : 1;

  // Check if there are any harvested plots
  const hasHarvestedPlots = harvestedPlots.length > 0;

  // Adjust width percentages based on whether we have harvested plots
  const harvestedWidthPercent = hasHarvestedPlots ? HARVESTED_WIDTH_PERCENT : 0;
  const podlineWidthPercent = hasHarvestedPlots ? PODLINE_WIDTH_PERCENT : 100;

  // Memoized grid points and axis labels
  const logGridPoints = useMemo(() => generateLogGridPoints(maxHarvestedIndex), [maxHarvestedIndex]);
  const topAxisLabels = useMemo(() => generateAxisLabels(0, podLine.toNumber()), [podLine]);
  const bottomAxisLabels = topAxisLabels;

  return (
    <div ref={containerRef} className="relative w-full pb-2">
      {/* Label */}
      {labelType === "title" ? (
        <div className="mb-4">
          <p className="pinto-h4">{label}</p>
        </div>
      ) : (
        <div className="mb-1">
          <p className="text-pinto-gray-5 text-[0.75rem]">{label}</p>
        </div>
      )}

      {/* Plot container with border */}
      <div className={cn("relative w-full h-12 border border-pinto-gray-5 rounded-lg overflow-hidden", className)}>
        <div className="relative w-full h-full flex">
          {/* Harvested Section (Log Scale) - Left 20% (only shown if there are harvested plots) */}
          {hasHarvestedPlots && (
            <div className="relative w-1/5">
              {/* Grid lines (exponential scale) */}
              <div className="absolute inset-0">
                {logGridPoints.map((value) => {
                  const minValue = maxHarvestedIndex / 10;
                  const position = calculateLogPosition(value, minValue, maxHarvestedIndex);

                  if (position > 100 || position < 0) return null;

                  return (
                    <div
                      key={`harvested-grid-${value}`}
                      className="absolute top-0 bottom-0 w-px bg-pinto-gray-5"
                      style={{ left: `${position}%` }}
                    />
                  );
                })}
              </div>

              {/* Plot rectangles */}
              <div className="absolute inset-0 flex items-center">
                {harvestedPlots.map((plot) => {
                  const minValue = maxHarvestedIndex / 10;
                  const plotStart = Math.max(plot.startIndex.toNumber(), minValue);
                  const plotEnd = Math.max(plot.endIndex.toNumber(), minValue);

                  const leftPercent = calculateLogPosition(plotStart, minValue, maxHarvestedIndex);
                  const rightPercent = calculateLogPosition(plotEnd, minValue, maxHarvestedIndex);
                  const widthPercent = rightPercent - leftPercent;
                  const displayWidth = Math.max(widthPercent, MIN_PLOT_WIDTH_PERCENT);

                  return (
                    <PlotGroup
                      key={`harvested-${plot.startIndex.toHuman()}`}
                      leftPercent={leftPercent}
                      widthPercent={displayWidth}
                      isHighlighted={true}
                      isActive={Boolean(plot.isSelected)}
                      disableInteractions={true}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Podline Section (Linear Scale) - Right 80% or 100% if no harvested plots */}
          <div className={cn("relative", hasHarvestedPlots ? "w-4/5" : "w-full")}>
            {/* Grid lines at 10M intervals */}
            <div className="absolute inset-0">
              {bottomAxisLabels.map((value) => {
                if (value === 0) return null; // Skip 0, it's the marker
                const position = podLine.gt(0) ? (value / podLine.toNumber()) * 100 : 0;
                if (position > 100) return null;

                return (
                  <div
                    key={`grid-${value}`}
                    className="absolute top-0 bottom-0 w-px bg-pinto-gray-5"
                    style={{ left: `${position}%` }}
                  />
                );
              })}
            </div>

            {/* Order range overlay (from 0 to orderRangeEnd) */}
            {orderRangeEnd?.gt(harvestableIndex) && (
              <div
                className="absolute bg-pinto-green-1 opacity-60 pointer-events-none"
                style={{
                  left: "0%",
                  width: `${podLine.gt(0) ? (orderRangeEnd.sub(harvestableIndex).toNumber() / podLine.toNumber()) * 100 : 0}%`,
                  height: "100%",
                  top: "0%",
                  zIndex: 5,
                }}
              />
            )}

            {/* Range overlay (from start to end) */}
            {rangeOverlay?.start.gte(harvestableIndex) && rangeOverlay?.end.gt(rangeOverlay.start) && (
              <div
                className="absolute bg-pinto-green-1 opacity-60 pointer-events-none"
                style={{
                  left: `${podLine.gt(0) ? (rangeOverlay.start.sub(harvestableIndex).toNumber() / podLine.toNumber()) * 100 : 0}%`,
                  width: `${podLine.gt(0) ? (rangeOverlay.end.sub(rangeOverlay.start).toNumber() / podLine.toNumber()) * 100 : 0}%`,
                  height: "100%",
                  top: "0%",
                  zIndex: 5,
                }}
              />
            )}

            {/* Plot rectangles - grouped visually but individually interactive */}
            <div className="absolute inset-0 flex items-center">
              {unharvestedPlots.map((group, groupIdx) => {
                const groupStartMinusHarvestable = group.startIndex.sub(harvestableIndex);
                const groupEndMinusHarvestable = group.endIndex.sub(harvestableIndex);

                const { leftPercent, displayWidthPercent } = computeGroupLayout(
                  groupStartMinusHarvestable,
                  groupEndMinusHarvestable,
                  podLine,
                );

                const groupFirstPlotIndex = group.plots[0].id || group.plots[0].index.toHuman();
                const hasHoveredPlot = group.plots.some((p) => (p.id || p.index.toHuman()) === hoveredPlotIndex);
                const hasSelectedPlot = group.plots.some((p) => selectedSet.has(p.id || p.index.toHuman()));
                const hasHarvestablePlot = group.plots.some((p) => p.harvestablePods?.gt(0));

                // Determine if the current range overlaps this group (used for coloring when range is present)
                const overlapsSelection = selectedPodRange
                  ? selectedPodRange.start.lt(group.endIndex) && selectedPodRange.end.gt(group.startIndex)
                  : false;

                // Compute partial selection overlay only when selection overlaps
                const partialSelectionPercent =
                  selectedPodRange && overlapsSelection
                    ? computePartialSelectionPercent(
                        group.startIndex,
                        group.endIndex,
                        selectedPodRange.start,
                        selectedPodRange.end,
                      )
                    : null;

                // In Create (range present), highlighted follows overlap; in Fill (no range), highlighted follows selection
                // However, if there's a partial selection AND not hovered, don't highlight the whole group - let the overlay show the selection
                const hasPartialSelection = Boolean(partialSelectionPercent) && !hasHoveredPlot;
                const selectionHighlighted = hasPartialSelection
                  ? false
                  : selectedPodRange
                    ? overlapsSelection
                    : hasSelectedPlot;

                const { isHighlighted: groupIsHighlighted, isActive: groupIsActive } = deriveGroupState(
                  hasHarvestablePlot,
                  hasSelectedPlot,
                  hasHoveredPlot,
                  selectionHighlighted,
                );

                // If there's a partial selection AND not hovered, don't make the whole group active (yellow)
                // The partial overlay will show the yellow color for the selected portion
                // When hovered, the whole group should be yellow
                const finalIsActive = hasPartialSelection ? false : groupIsActive;

                const handleGroupClick = () => {
                  if (disableInteractions) return;
                  if (onPlotGroupSelect) {
                    const plotIndices = group.plots.map((p) => p.id || p.index.toHuman());
                    onPlotGroupSelect(plotIndices);
                  }
                };

                const handleMouseEnter = (e: React.MouseEvent) => {
                  setHoveredPlotIndex(groupFirstPlotIndex);
                  if (!disableInteractions) {
                    setTooltipData({
                      podAmount: group.totalPods,
                      placeStart: groupStartMinusHarvestable,
                      placeEnd: groupEndMinusHarvestable,
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                    });
                    setTimeout(() => {
                      if (tooltipElementRef.current) {
                        tooltipElementRef.current.style.display = "block";
                        tooltipElementRef.current.classList.remove("animate-fade-out-smooth");
                        tooltipElementRef.current.classList.add("animate-fade-in-smooth");
                      }
                    }, 0);
                  }
                };

                const handleMouseMove = (e: React.MouseEvent) => {
                  if (!disableInteractions && tooltipData) {
                    if (rafRef.current) {
                      cancelAnimationFrame(rafRef.current);
                    }
                    rafRef.current = requestAnimationFrame(() => {
                      setTooltipData((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          mouseX: e.clientX,
                          mouseY: e.clientY,
                        };
                      });
                    });
                  }
                };

                const handleMouseLeave = () => {
                  setHoveredPlotIndex(null);
                  if (tooltipElementRef.current) {
                    tooltipElementRef.current.classList.remove("animate-fade-in-smooth");
                    tooltipElementRef.current.classList.add("animate-fade-out-smooth");
                  }
                  setTimeout(() => {
                    setTooltipData(null);
                    if (tooltipElementRef.current) {
                      tooltipElementRef.current.style.display = "none";
                      tooltipElementRef.current.classList.remove("animate-fade-out-smooth");
                    }
                  }, 200);
                  if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                  }
                };

                return (
                  <PlotGroup
                    key={`group-${group.startIndex.toHuman()}`}
                    leftPercent={leftPercent}
                    widthPercent={displayWidthPercent}
                    isHighlighted={groupIsHighlighted}
                    isActive={finalIsActive}
                    disableInteractions={disableInteractions}
                    onClick={handleGroupClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {partialSelectionPercent && hasSelectedPlot && (
                      <PartialSelectionOverlay
                        startPercent={partialSelectionPercent.start}
                        endPercent={partialSelectionPercent.end}
                      />
                    )}
                  </PlotGroup>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* "0" Marker - vertical line extending to labels (only shown if there are harvested plots) */}
      {hasHarvestedPlots && (
        <div
          className="absolute w-0.5 z-10"
          style={{
            left: `${harvestedWidthPercent}%`,
            top: "-0.25rem", // 4px above graph
            height: "3.5rem", // graph height (3rem = 48px) + 8px = 56px
            backgroundColor: "#ED7A00",
            transform: "translateX(-50%)", // Center the line on the 20% mark
          }}
        />
      )}

      {/* Bottom axis labels - outside border */}
      <div className="absolute left-0 right-0" style={{ bottom: "4px" }}>
        {/* "0" Label - positioned at the marker (only shown if there are harvested plots) */}
        {hasHarvestedPlots && (
          <div
            className="absolute text-[0.75rem] font-semibold"
            style={{
              left: `${harvestedWidthPercent}%`,
              transform: "translateX(-50%)",
              color: "#ED7A00",
            }}
          >
            0
          </div>
        )}

        <div className="flex">
          {/* Harvested section labels (only shown if there are harvested plots) */}
          {hasHarvestedPlots && (
            <div className="relative" style={{ width: `${harvestedWidthPercent}%` }}>
              {logGridPoints.map((value) => {
                const minValue = maxHarvestedIndex / 10;
                const position = calculateLogPosition(value, minValue, maxHarvestedIndex);

                return (
                  <div
                    key={`harvested-label-${value}`}
                    className="absolute text-pinto-gray-5 text-[0.75rem]"
                    style={{
                      left: `${position}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {formatAxisLabel(value)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Podline section labels - show place in line (10M, 20M, etc.) */}
          <div className="relative" style={{ width: `${podlineWidthPercent}%` }}>
            {generateAxisLabels(0, podLine.toNumber()).map((value) => {
              if (value === 0 && hasHarvestedPlots) return null; // Skip 0 only if harvested section is shown
              const position = podLine.gt(0) ? (value / podLine.toNumber()) * 100 : 0;
              if (position > 100) return null;

              return (
                <div
                  key={`podline-label-${value}`}
                  className="absolute text-pinto-gray-5 text-[0.75rem]"
                  style={{
                    left: `${position}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {formatAxisLabel(value)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip - follows mouse cursor */}
      {tooltipData &&
        containerRef.current &&
        (() => {
          const containerRect = containerRef.current.getBoundingClientRect();
          const relativeX = tooltipData.mouseX - containerRect.left;
          const alignRight = relativeX > containerRect.width / 2;

          return (
            <div
              ref={tooltipElementRef}
              className="fixed pointer-events-none"
              style={{
                left: `${tooltipData.mouseX}px`,
                top: `${tooltipData.mouseY}px`,
                transform: alignRight ? "translate(-100%, -100%)" : `translate(${TOOLTIP_OFFSET}px, -100%)`,
                zIndex: 200,
                display: "block",
              }}
            >
              <HoverTooltip
                podAmount={tooltipData.podAmount}
                placeInLineStart={tooltipData.placeStart}
                placeInLineEnd={tooltipData.placeEnd}
                visible={true}
                {...(alignRight ? { alignRight: true } : {})}
              />
            </div>
          );
        })()}
    </div>
  );
}
