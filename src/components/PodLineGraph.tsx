import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useMemo, useState } from "react";

// Layout constants
const HARVESTED_WIDTH_PERCENT = 20;
const PODLINE_WIDTH_PERCENT = 80;
const MIN_PLOT_WIDTH_PERCENT = 0.3; // Minimum plot width for clickability
const MAX_GAP_TO_COMBINE = TokenValue.fromHuman("1000000", PODS.decimals); // Combine plots within 1M gap for visual grouping

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
  /** Callback when a plot group is clicked - receives all plot indices in the group */
  onPlotGroupSelect?: (plotIndices: string[]) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Groups nearby plots for visual display while keeping each plot individually interactive
 */
function combinePlots(
  plots: Plot[],
  harvestableIndex: TokenValue,
  selectedIndices: Set<string>,
): CombinedPlot[] {
  if (plots.length === 0) return [];

  // Sort plots by index
  const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());

  const combined: CombinedPlot[] = [];
  let currentGroup: Plot[] = [];

  for (let i = 0; i < sortedPlots.length; i++) {
    const plot = sortedPlots[i];
    const nextPlot = sortedPlots[i + 1];

    currentGroup.push(plot);

    if (nextPlot) {
      // Calculate gap between this plot's end and next plot's start
      const gap = nextPlot.index.sub(plot.index.add(plot.pods));

      // If gap is small enough, continue grouping
      if (gap.lt(MAX_GAP_TO_COMBINE)) {
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
      const isHarvestable = currentGroup.some(
        (p) => p.harvestablePods?.gt(0) || endIndex.lte(harvestableIndex),
      );
      const isSelected = currentGroup.some((p) => selectedIndices.has(p.index.toHuman()));

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
  const INTERVAL = 10_000_000; // 10M
  const labels: number[] = [];
  
  // Start from 0 or the first 10M multiple
  const start = Math.floor(min / INTERVAL) * INTERVAL;
  
  for (let value = start; value <= max; value += INTERVAL) {
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
  const million = 1_000_000;
  const minValue = maxValue / 10;
  
  // For values less than 10M, use simple 1M, 2M, 5M pattern
  if (maxValue <= 10 * million) {
    if (maxValue > 1 * million && 1 * million > minValue) gridPoints.push(1 * million);
    if (maxValue > 2 * million && 2 * million > minValue) gridPoints.push(2 * million);
    if (maxValue > 5 * million && 5 * million > minValue) gridPoints.push(5 * million);
    return gridPoints;
  }
  
  // For larger values, use powers of 10
  let power = million;
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
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toFixed(0);
}

export default function PodLineGraph({
  plots: providedPlots,
  selectedPlotIndices = [],
  onPlotGroupSelect,
  className,
}: PodLineGraphProps) {
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();
  const podIndex = usePodIndex();

  const [hoveredPlotIndex, setHoveredPlotIndex] = useState<string | null>(null);

  // Use provided plots or default to farmer's plots
  const plots = providedPlots ?? farmerField.plots;

  // Calculate pod line (total unharvested pods)
  const podLine = podIndex.sub(harvestableIndex);

  // Selected indices set for quick lookup
  const selectedSet = useMemo(() => new Set(selectedPlotIndices), [selectedPlotIndices]);

  // Combine plots for visualization
  const combinedPlots = useMemo(
    () => combinePlots(plots, harvestableIndex, selectedSet),
    [plots, harvestableIndex, selectedSet],
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

  return (
    <div className={cn("relative w-full pb-2", className)}>
      {/* Plot container with border */}
      <div className="relative w-full h-12 border border-pinto-gray-2 rounded-lg overflow-hidden">
        <div className="relative w-full h-full flex">
          {/* Harvested Section (Log Scale) - Left 20% (only shown if there are harvested plots) */}
          {hasHarvestedPlots && (
          <div className="relative" style={{ width: `${harvestedWidthPercent}%` }}>
            {/* Grid lines (exponential scale) */}
            <div className="absolute inset-0">
              {generateLogGridPoints(maxHarvestedIndex).map((value) => {
                // Exponential scale: small values compressed to the left, large values spread to the right
                const minValue = maxHarvestedIndex / 10;
                const normalizedValue = (value - minValue) / (maxHarvestedIndex - minValue);
                
                // Apply exponential transformation: position = (e^(k*x) - 1) / (e^k - 1)
                // Using k=1 for very gentle exponential curve (almost linear)
                const k = 1;
                const position = (Math.exp(k * normalizedValue) - 1) / (Math.exp(k) - 1) * 100;
                
                if (position > 100 || position < 0) return null;

                return (
                  <div
                    key={`harvested-grid-${value}`}
                    className="absolute top-0 bottom-0 w-px bg-pinto-gray-2"
                    style={{ left: `${position}%` }}
                  />
                );
              })}
            </div>

            {/* Plot rectangles */}
            <div className="absolute inset-0 flex items-center">
            {harvestedPlots.map((plot, idx) => {
              // Exponential scale: small values compressed to the left, large values spread to the right
              const minValue = maxHarvestedIndex / 10;
              const plotStart = Math.max(plot.startIndex.toNumber(), minValue);
              const plotEnd = Math.max(plot.endIndex.toNumber(), minValue);
              
              const normalizedStart = (plotStart - minValue) / (maxHarvestedIndex - minValue);
              const normalizedEnd = (plotEnd - minValue) / (maxHarvestedIndex - minValue);
              
              // Apply exponential transformation
              const k = 1;
              const leftPercent = (Math.exp(k * normalizedStart) - 1) / (Math.exp(k) - 1) * 100;
              const rightPercent = (Math.exp(k * normalizedEnd) - 1) / (Math.exp(k) - 1) * 100;
              const widthPercent = rightPercent - leftPercent;
              const displayWidth = Math.max(widthPercent, MIN_PLOT_WIDTH_PERCENT);

              // Check if this is the leftmost plot
              const isLeftmost = idx === 0 && leftPercent < 1;

              return (
                <div
                  key={`harvested-${plot.startIndex.toHuman()}`}
                  className="absolute bg-pinto-green-1"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${displayWidth}%`,
                    minWidth: "4px",
                    height: "100%",
                    top: "0%",
                    borderRadius: isLeftmost ? "2px 0 0 2px" : "2px",
                    zIndex: plot.isSelected ? 10 : 1,
                  }}
                />
              );
            })}
            </div>
          </div>
          )}

          {/* Podline Section (Linear Scale) - Right 80% or 100% if no harvested plots */}
          <div className="relative" style={{ width: `${podlineWidthPercent}%` }}>
          {/* Grid lines at 10M intervals */}
          <div className="absolute inset-0">
            {generateAxisLabels(0, podLine.toNumber()).map((value) => {
              if (value === 0) return null; // Skip 0, it's the marker
              const position = podLine.gt(0) ? (value / podLine.toNumber()) * 100 : 0;
              if (position > 100) return null;

              return (
                <div
                  key={`grid-${value}`}
                  className="absolute top-0 bottom-0 w-px bg-pinto-gray-2"
                  style={{ left: `${position}%` }}
                />
              );
            })}
          </div>

          {/* Plot rectangles - grouped visually but individually interactive */}
          <div className="absolute inset-0 flex items-center">
            {unharvestedPlots.map((group, groupIdx) => {
              const groupPlaceInLine = group.startIndex.sub(harvestableIndex);
              const groupEnd = group.endIndex.sub(harvestableIndex);

              const groupLeftPercent = podLine.gt(0) ? (groupPlaceInLine.toNumber() / podLine.toNumber()) * 100 : 0;
              const groupWidthPercent =
                podLine.gt(0) ? ((groupEnd.toNumber() - groupPlaceInLine.toNumber()) / podLine.toNumber()) * 100 : 0;
              const groupDisplayWidth = Math.max(groupWidthPercent, MIN_PLOT_WIDTH_PERCENT);

              // Check if this is the rightmost group
              const isRightmost = groupIdx === unharvestedPlots.length - 1 && groupLeftPercent + groupDisplayWidth > 99;

              // Check if group is hovered or selected (based on first plot in group)
              const groupFirstPlotIndex = group.plots[0].index.toHuman();
              const hasHoveredPlot = group.plots.some((p) => p.index.toHuman() === hoveredPlotIndex);
              const hasSelectedPlot = group.plots.some((p) => selectedSet.has(p.index.toHuman()));
              const hasHarvestablePlot = group.plots.some((p) => p.harvestablePods?.gt(0));
              
              // Determine group color
              const groupIsGreen = hasHarvestablePlot || hasSelectedPlot || hasHoveredPlot;
              const groupIsActive = hasHoveredPlot || hasSelectedPlot;

              // Border radius for the group
              let groupBorderRadius = "2px";
              if (isRightmost) {
                groupBorderRadius = "0 2px 2px 0";
              }

              // Handle group click - select all plots in the group
              const handleGroupClick = () => {
                if (onPlotGroupSelect) {
                  // Send all plot indices in the group
                  const plotIndices = group.plots.map((p) => p.index.toHuman());
                  onPlotGroupSelect(plotIndices);
                }
              };

              // Render group as single solid unit
              return (
                <div
                  key={`group-${group.startIndex.toHuman()}`}
                  className={cn(
                    "absolute cursor-pointer transition-all",
                    groupIsGreen ? "bg-pinto-green-1" : "bg-pinto-morning-orange"
                  )}
                  style={{
                    left: `${groupLeftPercent}%`,
                    width: `${groupDisplayWidth}%`,
                    minWidth: "4px",
                    height: "100%",
                    top: "0%",
                    borderRadius: groupBorderRadius,
                    zIndex: groupIsActive ? 20 : 1,
                  }}
                  onClick={handleGroupClick}
                  onMouseEnter={() => setHoveredPlotIndex(groupFirstPlotIndex)}
                  onMouseLeave={() => setHoveredPlotIndex(null)}
                >
                </div>
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
          transform: "translateX(-50%)" // Center the line on the 20% mark
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
            color: "#ED7A00" 
          }}
        >
          0
        </div>
        )}

        <div className="flex">
        {/* Harvested section labels (only shown if there are harvested plots) */}
        {hasHarvestedPlots && (
        <div className="relative" style={{ width: `${harvestedWidthPercent}%` }}>
          {generateLogGridPoints(maxHarvestedIndex).map((value) => {
            // Exponential scale: small values compressed to the left, large values spread to the right
            const minValue = maxHarvestedIndex / 10;
            const normalizedValue = (value - minValue) / (maxHarvestedIndex - minValue);
            
            // Apply exponential transformation
            const k = 1;
            const position = (Math.exp(k * normalizedValue) - 1) / (Math.exp(k) - 1) * 100;

            return (
              <div
                key={`harvested-label-${value}`}
                className="absolute text-pinto-gray-4 text-[0.75rem]"
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
                className="absolute text-pinto-gray-4 text-[0.75rem]"
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
    </div>
  );
}

