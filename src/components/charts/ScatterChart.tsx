import {
  ActiveElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartEvent,
  ChartOptions,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  Plugin,
  Point,
  PointElement,
  PointStyle,
  TooltipOptions,
} from "chart.js";
import { isEqual } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactChart } from "../ReactChart";

Chart.register(LineController, LineElement, LinearScale, LogarithmicScale, CategoryScale, PointElement, Filler);

export type MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  position: number,
) => CanvasGradient | undefined;

export type LineChartReferenceDotProps = {
  x: any;
  y: any;
};

// For providing custom scaling other than logarithmic.
export type CustomChartValueTransform = {
  to: (value: number) => number;
  from: (value: number) => number;
};

export type ScatterChartData = {
  label: string;
  data: Point[];
  color: string;
  pointStyle: PointStyle;
  pointRadius: number;
}[];

export type ScatterChartAxisOptions = {
  label: string;
  min: number;
  max: number;
};

export interface ScatterChartProps {
  data: ScatterChartData;
  size?: "small" | "large";
  referenceDot?: LineChartReferenceDotProps;
  valueFormatter?: (value: number) => string;
  onMouseOver?: (index: number) => void;
  activeIndex?: number;
  useLogarithmicScale?: boolean;
  horizontalReferenceLines?: {
    value: number;
    color: string;
    dash?: number[];
    label?: string;
  }[];
  onPointClick?: (event: ChartEvent, activeElements: ActiveElement[], chart: Chart) => void;
  xOptions: ScatterChartAxisOptions;
  yOptions: ScatterChartAxisOptions;
  customValueTransform?: CustomChartValueTransform;
  toolTipOptions?: TooltipOptions;
}

const ScatterChart = React.memo(
  ({
    data,
    size,
    valueFormatter,
    onMouseOver,
    activeIndex,
    useLogarithmicScale = false,
    horizontalReferenceLines = [],
    xOptions,
    yOptions,
    customValueTransform,
    onPointClick,
    toolTipOptions,
  }: ScatterChartProps) => {
    const chartRef = useRef<Chart | null>(null);
    const activeIndexRef = useRef<number | undefined>(activeIndex);
    const selectedPointRef = useRef<[number, number] | null>(null);

    useEffect(() => {
      activeIndexRef.current = activeIndex;
      if (chartRef.current) {
        chartRef.current.update("none"); // Disable animations during update
      }
    }, [activeIndex]);

    const [yTickMin, yTickMax] = useMemo(() => {
      // If custom min/max are provided, use those
      if (yOptions.min !== undefined && yOptions.max !== undefined) {
        // Even with custom ranges, ensure 1.0 is visible if showReferenceLineAtOne is true
        if (horizontalReferenceLines.some((line) => line.value === 1)) {
          const hasOne = yOptions.min <= 1 && yOptions.max >= 1;
          if (!hasOne) {
            // If 1.0 is not in range, adjust the range to include it
            if (useLogarithmicScale) {
              // For logarithmic scale, we need to ensure we maintain the ratio
              // but include 1.0 in the range
              if (yOptions.min > 1) {
                return [0.7, Math.max(yOptions.max, 1.5)]; // Include 1.0 with padding below
              } else if (yOptions.max < 1) {
                return [Math.min(yOptions.min, 0.7), 1.5]; // Include 1.0 with padding above
              }
            } else {
              // For linear scale, just expand the range to include 1.0
              if (yOptions.min > 1) {
                return [0.9, Math.max(yOptions.max, 1.1)]; // Include 1.0 with padding
              } else if (yOptions.max < 1) {
                return [Math.min(yOptions.min, 0.9), 1.1]; // Include 1.0 with padding
              }
            }
          }
        }
        return [yOptions.min, yOptions.max];
      }

      // Otherwise calculate based on data
      const maxData = Number.MIN_SAFE_INTEGER; //data.reduce((acc, next) => Math.max(acc, next.y), Number.MIN_SAFE_INTEGER);
      const minData = Number.MAX_SAFE_INTEGER; //data.reduce((acc, next) => Math.min(acc, next.y), Number.MAX_SAFE_INTEGER);

      const maxTick = maxData === minData && maxData === 0 ? 1 : maxData;
      let minTick = Math.max(0, minData - (maxData - minData) * 0.1);
      if (minTick === maxData) {
        minTick = maxData * 0.99;
      }

      // For logarithmic scale, ensure minTick is positive
      if (useLogarithmicScale && minTick <= 0) {
        minTick = 0.000001; // Small positive value
      }

      // Use custom min/max if provided
      let finalMin = yOptions.min !== undefined ? yOptions.min : minTick;
      let finalMax = yOptions.max !== undefined ? yOptions.max : maxTick;

      // Ensure 1.0 is visible if there's a reference line at 1.0
      if (horizontalReferenceLines.some((line) => line.value === 1)) {
        if (finalMin > 1 || finalMax < 1) {
          if (useLogarithmicScale) {
            // For logarithmic scale, we need to ensure we maintain the ratio
            if (finalMin > 1) {
              finalMin = 0.7; // Include 1.0 with padding below
              finalMax = Math.max(finalMax, 1.5);
            } else if (finalMax < 1) {
              finalMin = Math.min(finalMin, 0.7);
              finalMax = 1.5; // Include 1.0 with padding above
            }
          } else {
            // For linear scale, just expand the range to include 1.0
            if (finalMin > 1) {
              finalMin = 0.9; // Include 1.0 with padding
              finalMax = Math.max(finalMax, 1.1);
            } else if (finalMax < 1) {
              finalMin = Math.min(finalMin, 0.9);
              finalMax = 1.1; // Include 1.0 with padding
            }
          }
        }
      }

      return [finalMin, finalMax];
    }, [data, useLogarithmicScale, yOptions.min, yOptions.max, horizontalReferenceLines]);

    const chartData = useCallback(
      (ctx: CanvasRenderingContext2D | null): ChartData => {
        return {
          datasets: data.map(({ label, data, color, pointStyle, pointRadius }) => ({
            label,
            data,
            backgroundColor: color,
            pointStyle,
            pointRadius: pointRadius,
            hoverRadius: pointRadius + 1,
          })),
        };
      },
      [data],
    );

    const verticalLinePlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customVerticalLine",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          const activeIndex = activeIndexRef.current;
          if (ctx) {
            ctx.save();
            ctx.setLineDash([4, 4]);

            // Draw the vertical line for the active element (hovered point)
            const activeElements = chart.getActiveElements();
            if (activeElements.length > 0) {
              const activeElement = activeElements[0];
              const datasetIndex = activeElement.datasetIndex;
              const index = activeElement.index;
              const dataPoint = chart.getDatasetMeta(datasetIndex).data[index];

              if (dataPoint) {
                const { x } = dataPoint.getProps(["x"], true);
                ctx.beginPath();
                ctx.moveTo(x, chart.chartArea.top);
                ctx.lineTo(x, chart.chartArea.bottom);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }

            ctx.restore();
          }
        },
      }),
      [],
    );

    const horizontalReferenceLinePlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "horizontalReferenceLine",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          if (!ctx || horizontalReferenceLines.length === 0) return;

          ctx.save();

          // Draw each horizontal reference line
          horizontalReferenceLines.forEach((line) => {
            const yScale = chart.scales.y;
            const y = yScale.getPixelForValue(line.value);

            // Only draw if within chart area
            if (y >= chart.chartArea.top && y <= chart.chartArea.bottom) {
              ctx.beginPath();
              if (line.dash) {
                ctx.setLineDash(line.dash);
              } else {
                ctx.setLineDash([4, 4]); // Default dash pattern
              }
              ctx.moveTo(chart.chartArea.left, y);
              ctx.lineTo(chart.chartArea.right, y);
              ctx.strokeStyle = line.color;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Reset dash pattern
              ctx.setLineDash([]);

              // Add label if provided
              if (line.label) {
                ctx.font = "12px Arial";
                ctx.fillStyle = line.color;

                // Measure text width to ensure it doesn't get cut off
                const textWidth = ctx.measureText(line.label).width;
                const rightPadding = 10; // Padding from right edge

                // Position the label at the right side of the chart with padding
                const labelX = chart.chartArea.right - textWidth - rightPadding;
                const labelPadding = 5; // Padding between line and text
                const textHeight = 12; // Approximate height of the text

                // Check if the line is too close to the top of the chart
                const isNearTop = y - textHeight - labelPadding < chart.chartArea.top;

                // Check if the line is too close to the bottom of the chart
                const isNearBottom = y + textHeight + labelPadding > chart.chartArea.bottom;

                // Set text alignment
                ctx.textAlign = "left";

                // Position the label based on proximity to chart edges
                // biome-ignore lint/suspicious/noExplicitAny:
                let labelY: any;
                ctx.textBaseline = "bottom";
                labelY = y - labelPadding;
                if (isNearTop) {
                  ctx.textBaseline = "top";
                  labelY = y + labelPadding;
                } else if (isNearBottom) {
                  labelY = y - labelPadding;
                }
                ctx.fillText(line.label, labelX, labelY);
              }
            }
          });

          ctx.restore();
        },
      }),
      [horizontalReferenceLines],
    );

    const selectionPointPlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customSelectPoint",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          if (!ctx) return;

          // Define the function to draw the selection point
          const drawSelectionPoint = (
            x: number,
            y: number,
            pointRadius: number,
            pointStyle: PointStyle,
            color?: string,
          ) => {
            // console.info("🚀 ~ drawSelectionPoint ~ pointRadius:", pointRadius);
            ctx.save();
            ctx.fillStyle = "transparent";
            ctx.strokeStyle = color || "black";
            ctx.lineWidth = !!color ? 2 : 1;

            const rectWidth = pointRadius * 2.5 || 10;
            const rectHeight = pointRadius * 2.5 || 10;
            const cornerRadius = pointStyle === "rect" ? 0 : pointRadius * 1.5;

            ctx.beginPath();
            ctx.moveTo(x - rectWidth / 2 + cornerRadius, y - rectHeight / 2);
            ctx.lineTo(x + rectWidth / 2 - cornerRadius, y - rectHeight / 2);
            ctx.quadraticCurveTo(
              x + rectWidth / 2,
              y - rectHeight / 2,
              x + rectWidth / 2,
              y - rectHeight / 2 + cornerRadius,
            );
            ctx.lineTo(x + rectWidth / 2, y + rectHeight / 2 - cornerRadius);
            ctx.quadraticCurveTo(
              x + rectWidth / 2,
              y + rectHeight / 2,
              x + rectWidth / 2 - cornerRadius,
              y + rectHeight / 2,
            );
            ctx.lineTo(x - rectWidth / 2 + cornerRadius, y + rectHeight / 2);
            ctx.quadraticCurveTo(
              x - rectWidth / 2,
              y + rectHeight / 2,
              x - rectWidth / 2,
              y + rectHeight / 2 - cornerRadius,
            );
            ctx.lineTo(x - rectWidth / 2, y - rectHeight / 2 + cornerRadius);
            ctx.quadraticCurveTo(
              x - rectWidth / 2,
              y - rectHeight / 2,
              x - rectWidth / 2 + cornerRadius,
              y - rectHeight / 2,
            );
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
            ctx.restore();
          };

          // Draw selection point for the hovered data point
          const activeElements = chart.getActiveElements();
          for (const activeElement of activeElements) {
            const datasetIndex = activeElement.datasetIndex;
            const index = activeElement.index;
            const dataPoint = chart.getDatasetMeta(datasetIndex).data[index];

            if (dataPoint) {
              const { x, y } = dataPoint.getProps(["x", "y"], true);
              const pointRadius = dataPoint.options.radius;
              const pointStyle = dataPoint.options.pointStyle;
              drawSelectionPoint(x, y, pointRadius, pointStyle);
            }
          }

          // Draw the circle around currently selected element (i.e. clicked)
          const [selectedPointDatasetIndex, selectedPointIndex] = selectedPointRef.current || [];
          if (selectedPointDatasetIndex !== undefined && selectedPointIndex !== undefined) {
            const dataPoint = chart.getDatasetMeta(selectedPointDatasetIndex).data[selectedPointIndex];
            if (dataPoint) {
              const { x, y } = dataPoint.getProps(["x", "y"], true);
              const pointRadius = dataPoint.options.radius;
              const pointStyle = dataPoint.options.pointStyle;
              drawSelectionPoint(x, y, pointRadius, pointStyle, "#387F5C");
            }
          }
        },
      }),
      [selectedPointRef.current],
    );

    const selectionCallbackPlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "selectionCallback",
        afterDraw: (chart: Chart) => {
          onMouseOver?.(chart.getActiveElements()[0]?.index);
        },
      }),
      [],
    );

    const chartOptions: ChartOptions = useMemo(() => {
      return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          tooltip: toolTipOptions || {},
          legend: {
            display: false,
          },
        },
        layout: {
          // Tick padding must be uniform, undo it here
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xOptions.label || "",
            },
            type: "linear",
            position: "bottom",
            min: xOptions.min,
            max: Math.round((xOptions.max / 10) * 10), // round to nearest 10 so auto tick generation works
            ticks: {
              padding: 0,
              callback: (val) => `${Number(val)}M`,
            },
          },
          y: {
            title: {
              display: true,
              text: yOptions.label || "",
            },
            ticks: {
              padding: 0,
            },
          },
        },
        onClick: (event, activeElements, chart) => {
          const activeElement = activeElements[0];
          selectedPointRef.current = [activeElement.datasetIndex, activeElement.index];
          onPointClick?.(event, activeElements, chart);
        },
      };
    }, [data, yTickMin, yTickMax, valueFormatter, useLogarithmicScale, customValueTransform]);

    const allPlugins = useMemo<Plugin[]>(
      () => [verticalLinePlugin, horizontalReferenceLinePlugin, selectionPointPlugin, selectionCallbackPlugin],
      [verticalLinePlugin, horizontalReferenceLinePlugin, selectionPointPlugin, selectionCallbackPlugin],
    );

    const chartDimensions = useMemo(() => {
      if (size === "small") {
        return {
          w: 3,
          h: 1,
        };
      } else {
        return {
          w: 6,
          h: 2,
        };
      }
    }, [size]);
    return (
      <ReactChart
        ref={chartRef}
        type="scatter"
        data={chartData}
        options={chartOptions}
        plugins={allPlugins}
        width={chartDimensions.w}
        height={500}
      />
    );
  },
  areScatterChartPropsEqual,
);

/**
 * Optimized memoization comparison function for the ScatterChart component.
 *
 * This function implements a multi-stage comparison strategy to efficiently determine
 * whether props have changed, minimizing expensive deep comparisons when possible.
 *
 * @param prevProps - The previous props object from the last render
 * @param nextProps - The current props object for the new render
 * @returns `true` if props are equal (component should NOT re-render), `false` if different (component should re-render)
 *
 * ## Conditional Flow:
 *
 * ### Stage 1: Fast Reference Equality Check
 * - **Condition**: `prevProps.data === nextProps.data` (same object reference)
 * - **Action**: If true, skip expensive data comparison and only check other lightweight props
 * - **Checks**: size, useLogarithmicScale, activeIndex, and deep comparison of xOptions, yOptions, horizontalReferenceLines
 * - **Optimization**: Avoids costly array iteration when data hasn't changed
 *
 * ### Stage 2: Early Exit Conditions
 * - **Data Length Check**: `prevProps.data.length !== nextProps.data.length`
 *   - If different lengths, immediately return `false` (re-render needed)
 * - **Essential Props Check**: Compare size, useLogarithmicScale, activeIndex
 *   - If any differ, immediately return `false` (re-render needed)
 *
 * ### Stage 3: Axis Options Deep Comparison
 * - **xOptions & yOptions**: Use lodash `isEqual` for deep comparison
 * - **Reason**: These objects contain nested properties (min, max, label) that require deep comparison
 * - If either differs, return `false` (re-render needed)
 *
 * ### Stage 4: Dataset Metadata Comparison
 * - **For each dataset**: Compare metadata before expensive data point comparison
 * - **Metadata checks**: label, color, pointStyle, data.length
 * - **Optimization**: Metadata comparison is cheaper than point-by-point comparison
 * - If metadata differs, return `false` (re-render needed)
 *
 * ### Stage 5: Optimized Data Point Sampling
 * - **Reference Check**: `prevData === nextData` (same array reference)
 *   - If same reference, skip to next dataset
 * - **Sampling Strategy**: Check first 10 and last 10 data points (or all if < 20 points)
 * - **Optimization**: Avoids O(n) comparison for large datasets while catching most changes
 * - **Point Comparison**: Compare x, y, and eventId properties for sampled points
 * - **Early Exit**: Return `false` on first difference found
 *
 * ## Performance Characteristics:
 * - **Best Case**: O(1) - Reference equality check succeeds
 * - **Average Case**: O(n) - Metadata comparison catches most changes
 * - **Worst Case**: O(n*20) - Sampling comparison (max 20 points per dataset)
 *
 * ## Memory Efficiency:
 * - Uses reference equality checks to avoid deep cloning
 * - Leverages lodash `isEqual` for reliable deep comparison
 * - Early exits minimize unnecessary computation
 */
function areScatterChartPropsEqual(prevProps: ScatterChartProps, nextProps: ScatterChartProps): boolean {
  // Fast reference equality check first - if data objects are the same, skip deep comparison
  if (prevProps.data === nextProps.data) {
    // Still need to check other props for changes
    return (
      prevProps.size === nextProps.size &&
      prevProps.useLogarithmicScale === nextProps.useLogarithmicScale &&
      isEqual(prevProps.xOptions, nextProps.xOptions) &&
      isEqual(prevProps.yOptions, nextProps.yOptions) &&
      prevProps.activeIndex === nextProps.activeIndex &&
      isEqual(prevProps.horizontalReferenceLines, nextProps.horizontalReferenceLines)
    );
  }

  // Early exit for different array lengths
  if (prevProps.data.length !== nextProps.data.length) {
    return false;
  }

  // Check essential props first (cheaper than deep data comparison)
  if (
    prevProps.size !== nextProps.size ||
    prevProps.useLogarithmicScale !== nextProps.useLogarithmicScale ||
    prevProps.activeIndex !== nextProps.activeIndex
  ) {
    return false;
  }

  // Check axis options with deep comparison
  if (!isEqual(prevProps.xOptions, nextProps.xOptions) || !isEqual(prevProps.yOptions, nextProps.yOptions)) {
    return false;
  }

  // Quick dataset metadata comparison before deep data check
  for (let i = 0; i < prevProps.data.length; i++) {
    const prevDataset = prevProps.data[i];
    const nextDataset = nextProps.data[i];

    // Check metadata first (cheaper than data point comparison)
    if (
      prevDataset.label !== nextDataset.label ||
      prevDataset.color !== nextDataset.color ||
      prevDataset.pointStyle !== nextDataset.pointStyle ||
      prevDataset.data.length !== nextDataset.data.length
    ) {
      return false;
    }

    // Only do expensive data point comparison if metadata matches
    const prevData = prevDataset.data;
    const nextData = nextDataset.data;

    // Use reference equality check first
    if (prevData === nextData) {
      continue;
    }

    // If arrays are different references, do the optimized comparison
    // Check first 10 and last 10 data points for performance
    const dataLength = prevData.length;
    const checkCount = Math.min(10, Math.floor(dataLength / 2));

    // Check first N points
    for (let j = 0; j < checkCount; j++) {
      const prevPoint = prevData[j];
      const nextPoint = nextData[j];

      if (
        prevPoint.x !== nextPoint.x ||
        prevPoint.y !== nextPoint.y ||
        (prevPoint as any).eventId !== (nextPoint as any).eventId
      ) {
        return false;
      }
    }

    // Check last N points (if array has more than 2 * checkCount elements)
    if (dataLength > checkCount * 2) {
      for (let j = dataLength - checkCount; j < dataLength; j++) {
        const prevPoint = prevData[j];
        const nextPoint = nextData[j];

        if (
          prevPoint.x !== nextPoint.x ||
          prevPoint.y !== nextPoint.y ||
          (prevPoint as any).eventId !== (nextPoint as any).eventId
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

export default ScatterChart;
