import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  Plugin,
  PointElement,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactChart } from "../ReactChart";
import { LineChartHorizontalReferenceLine, plugins } from "./chartHelpers";

Chart.register(LineController, LineElement, LinearScale, LogarithmicScale, CategoryScale, PointElement, Filler);

export type LineChartData = {
  values: number[];
} & Record<string, any>;

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

export interface LineChartProps {
  data: LineChartData[];
  size: "small" | "large";
  xKey: keyof LineChartData;
  makeLineGradients: MakeGradientFunction[];
  // If not provided, do not fill area
  makeAreaGradients?: MakeGradientFunction[];
  referenceDot?: LineChartReferenceDotProps;
  valueFormatter?: (value: number) => string;
  onMouseOver?: (index: number) => void;
  activeIndex?: number;
  useLogarithmicScale?: boolean;
  horizontalReferenceLines?: LineChartHorizontalReferenceLine[];
  // Props for custom y-axis range
  yAxisMin?: number;
  yAxisMax?: number;
  customValueTransform?: CustomChartValueTransform;
}

// provide a stable reference to the horizontal reference lines to avoid re-rendering the chart when some other prop changes
const stableHorizontalReferenceLines: LineChartHorizontalReferenceLine[] = [];

const LineChart = React.memo(
  ({
    data,
    size,
    xKey,
    makeLineGradients,
    makeAreaGradients,
    valueFormatter,
    onMouseOver,
    activeIndex,
    useLogarithmicScale = false,
    horizontalReferenceLines = stableHorizontalReferenceLines,
    yAxisMin,
    yAxisMax,
    customValueTransform,
  }: LineChartProps) => {
    const chartRef = useRef<Chart | null>(null);
    const activeIndexRef = useRef<number | undefined>(activeIndex);

    useEffect(() => {
      activeIndexRef.current = activeIndex;
      if (chartRef.current) {
        // prevent animation on update
        chartRef.current.update("none");
      }
    }, [activeIndex]);

    const [yTickMin, yTickMax] = useMemo(() => {
      // Otherwise calculate based on data
      const maxData = data.reduce((acc, next) => Math.max(acc, ...next.values), Number.MIN_SAFE_INTEGER);
      const minData = data.reduce((acc, next) => Math.min(acc, ...next.values), Number.MAX_SAFE_INTEGER);

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
      let finalMin = yAxisMin !== undefined ? yAxisMin : minTick;
      let finalMax = yAxisMax !== undefined ? yAxisMax : maxTick;

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
    }, [data, useLogarithmicScale, yAxisMin, yAxisMax, horizontalReferenceLines]);

    const chartData = useCallback(
      (ctx: CanvasRenderingContext2D | null): ChartData => {
        return {
          labels: data.map((d) => d[xKey]),
          datasets: data[0].values.map((_, idx: number) => {
            return {
              data: data.map((dataItem) => dataItem.values[idx]),
              borderColor: makeLineGradients[idx](ctx, 1),
              borderWidth: 1.5,
              fill: !!makeAreaGradients,
              backgroundColor: makeAreaGradients?.[idx](ctx, 1),
              // Hide default points, custom are implemented in afterDraw plugin
              pointRadius: 0,
              pointHoverRadius: 0,
            };
          }),
        };
      },
      [data, makeLineGradients, makeAreaGradients, xKey],
    );

    // ---------- PLUGINS ----------

    const gradientPlugin = useMemo(
      () => plugins.gradientShift(activeIndexRef, makeLineGradients, makeAreaGradients),
      [makeLineGradients, makeAreaGradients],
    ); // Removed morningIndex from dependencies

    const fillArea = !!makeAreaGradients && !!makeAreaGradients.length;

    const verticalLinePlugin: Plugin = useMemo(() => plugins.verticalLine(activeIndexRef, fillArea), [fillArea]);

    const horizontalReferenceLinePlugin: Plugin = useMemo(() => {
      return plugins.horizontalReferenceLine(horizontalReferenceLines);
    }, [horizontalReferenceLines]);

    const selectionPointPlugin = useMemo(() => {
      return plugins.selectionPoint(activeIndexRef, fillArea);
    }, [fillArea]);

    const selectionCallbackPlugin: Plugin = useMemo(() => {
      return plugins.selectionCallback(onMouseOver);
    }, [onMouseOver]);

    const chartOptions: ChartOptions = useMemo(() => {
      return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false,
          },
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
          mode: "nearest", // Highlight the nearest point
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: (context) => {
                const tickLabel = context.tick?.label;
                if (typeof activeIndexRef.current === "number") {
                  if (tickLabel && tickLabel !== "") {
                    return "rgba(0, 0, 0, 0.1)";
                  } else {
                    return "transparent";
                  }
                } else {
                  return "rgba(0, 0, 0, 0.1)";
                }
              },
            },
            border: {
              display: true,
            },
            ticks: {
              padding: 0,
              minRotation: 0,
              maxRotation: 0,
              autoSkip: typeof activeIndexRef.current !== "number",
              maxTicksLimit: typeof activeIndexRef.current !== "number" ? 6 : undefined,
              callback: (_value, index, values) => {
                const xValue = data[index][xKey];

                if (!xValue) {
                  return "";
                }

                const tickLabel = xValue instanceof Date ? `${xValue.getMonth() + 1}/${xValue.getDate()}` : xValue;

                if (typeof activeIndexRef.current === "number") {
                  if (index === 0 || index === values.length - 1) {
                    return tickLabel;
                  }

                  const indicesToShowTicks = [5, 10, 15, 20];

                  if (indicesToShowTicks.includes(index)) {
                    return tickLabel;
                  } else {
                    return "";
                  }
                } else {
                  // Let Chart.js handle auto-skipping and tick labels
                  return tickLabel;
                }
              },
            },
          },

          y: {
            type: useLogarithmicScale ? "logarithmic" : "linear",
            position: "right",
            min: yTickMin,
            max: yTickMax,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            // Configure logarithmic scale options
            ...(useLogarithmicScale && {
              logarithmic: {
                base: 10,
              },
            }),
            ticks: {
              padding: 0,
              maxTicksLimit: 4,
              includeBounds: true,
              callback: (value) => {
                let num = typeof value === "string" ? Number(value) : value;
                // If there is custom scaling for this chart, reverse it to get the original value
                if (customValueTransform !== undefined) {
                  num = customValueTransform.from(num);
                }
                return valueFormatter ? valueFormatter(num) : value;
              },
            },
          },
        },
      };
    }, [data, xKey, yTickMin, yTickMax, valueFormatter, useLogarithmicScale, customValueTransform]);

    const activeIndexVerticalLinePlugin: Plugin = useMemo(() => plugins.activeIndexVerticalLine(activeIndexRef), []);

    const allPlugins = useMemo<Plugin[]>(
      () => [
        gradientPlugin,
        verticalLinePlugin,
        activeIndexVerticalLinePlugin,
        horizontalReferenceLinePlugin,
        selectionPointPlugin,
        selectionCallbackPlugin,
      ],
      [
        gradientPlugin,
        verticalLinePlugin,
        horizontalReferenceLinePlugin,
        selectionPointPlugin,
        activeIndexVerticalLinePlugin,
        selectionCallbackPlugin,
      ],
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
        type="line"
        data={chartData}
        options={chartOptions}
        plugins={allPlugins}
        width={chartDimensions.w}
        height={chartDimensions.h}
      />
    );
  },
);
export default LineChart;
