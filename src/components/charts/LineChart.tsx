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
  horizontalReferenceLines?: {
    value: number;
    color: string;
    dash?: number[];
    label?: string;
  }[];
  // New props for custom y-axis range
  yAxisMin?: number;
  yAxisMax?: number;
}

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
    horizontalReferenceLines = [],
    yAxisMin,
    yAxisMax,
  }: LineChartProps) => {
    const chartRef = useRef<Chart | null>(null);
    const activeIndexRef = useRef<number | undefined>(activeIndex);

    useEffect(() => {
      activeIndexRef.current = activeIndex;
      if (chartRef.current) {
        chartRef.current.update("none"); // Disable animations during update
      }
    }, [activeIndex]);

    const [yTickMin, yTickMax] = useMemo(() => {
      // If custom min/max are provided, use those
      if (yAxisMin !== undefined && yAxisMax !== undefined) {
        // Even with custom ranges, ensure 1.0 is visible if showReferenceLineAtOne is true
        if (horizontalReferenceLines.some((line) => line.value === 1)) {
          const hasOne = yAxisMin <= 1 && yAxisMax >= 1;
          if (!hasOne) {
            // If 1.0 is not in range, adjust the range to include it
            if (useLogarithmicScale) {
              // For logarithmic scale, we need to ensure we maintain the ratio
              // but include 1.0 in the range
              if (yAxisMin > 1) {
                return [0.7, Math.max(yAxisMax, 1.5)]; // Include 1.0 with padding below
              } else if (yAxisMax < 1) {
                return [Math.min(yAxisMin, 0.7), 1.5]; // Include 1.0 with padding above
              }
            } else {
              // For linear scale, just expand the range to include 1.0
              if (yAxisMin > 1) {
                return [0.9, Math.max(yAxisMax, 1.1)]; // Include 1.0 with padding
              } else if (yAxisMax < 1) {
                return [Math.min(yAxisMin, 0.9), 1.1]; // Include 1.0 with padding
              }
            }
          }
        }
        return [yAxisMin, yAxisMax];
      }

      // Otherwise calculate based on data
      const maxData = data.reduce((acc, next) => Math.max(acc, ...next.values), Number.MIN_SAFE_INTEGER);
      const minData = data.reduce((acc, next) => Math.min(acc, ...next.values), Number.MAX_SAFE_INTEGER);

      let minTick = Math.max(0, minData - (maxData - minData) * 0.1);
      if (minTick === maxData) {
        minTick = maxData * 0.99;
      }

      // For logarithmic scale, ensure minTick is positive
      if (useLogarithmicScale && minTick <= 0) {
        minTick = 0.01; // Small positive value
      }

      // Use custom min/max if provided
      let finalMin = yAxisMin !== undefined ? yAxisMin : minTick;
      let finalMax = yAxisMax !== undefined ? yAxisMax : maxData;

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

    const gradientPlugin = useMemo(() => {
      return {
        id: "customGradientShift",
        beforeUpdate: (chart) => {
          const ctx = chart.ctx;
          const activeIndex = activeIndexRef.current;
          if (ctx && typeof activeIndex === "number") {
            const grayColor = "rgba(128, 128, 128, 0.1)"; // Define your gray color here

            for (let i = 0; i < chart.data.datasets.length; ++i) {
              const dataset = chart.data.datasets[i];
              const lineGradient = makeLineGradients[i](ctx, 1);
              const areaGradient = makeAreaGradients ? makeAreaGradients[i](ctx, 1) : null;

              // Apply gradients to the entire dataset
              dataset.borderColor = lineGradient;
              dataset.backgroundColor = areaGradient;

              // Use segment configuration for conditional coloring
              dataset.segment = {
                borderColor: (ctx) => {
                  const dataIndex = ctx.p0DataIndex;
                  const isAfterActiveIndex = dataIndex >= activeIndex;
                  return isAfterActiveIndex ? grayColor : undefined;
                },
                backgroundColor: (ctx) => {
                  const dataIndex = ctx.p0DataIndex;
                  const isAfterActiveIndex = dataIndex >= activeIndex;
                  return isAfterActiveIndex ? grayColor : undefined;
                },
              };
            }
          }
        },
      };
    }, [makeLineGradients, makeAreaGradients]); // Removed morningIndex from dependencies

    const fillArea = !!makeAreaGradients && !!makeAreaGradients.length;

    // const referenceDotPlugin: Plugin = useMemo<Plugin>(() => {}, []);

    const verticalLinePlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customVerticalLine",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          const activeIndex = activeIndexRef.current;
          if (ctx) {
            ctx.save();
            ctx.setLineDash([4, 4]);

            // Draw the vertical line at morningIndex
            if (typeof activeIndex === "number") {
              const morningDataPoint = chart.getDatasetMeta(0).data[activeIndex];
              if (morningDataPoint) {
                const { x } = morningDataPoint.getProps(["x"], true);
                ctx.beginPath();
                ctx.moveTo(x, chart.chartArea.top);
                ctx.lineTo(x, chart.chartArea.bottom);
                ctx.strokeStyle = "#D9AD0F"; // Use a different color for the morning line
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }

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
                ctx.strokeStyle = fillArea ? "#D9AD0F" : "#246645";
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }

            ctx.restore();
          }
        },
      }),
      [fillArea], // Removed morningIndex from dependencies
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
          const activeIndex = activeIndexRef.current;
          if (!ctx) return;

          // Define the function to draw the selection point
          const drawSelectionPoint = (x: number, y: number) => {
            ctx.save();
            ctx.fillStyle = fillArea ? "#D9AD0F" : "#246645";
            ctx.strokeStyle = fillArea ? "#D9AD0F" : "#246645";
            ctx.lineWidth = 1;

            const rectWidth = 6;
            const rectHeight = 6;
            const cornerRadius = 4;

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
          if (activeElements.length > 0) {
            const activeElement = activeElements[0];
            const datasetIndex = activeElement.datasetIndex;
            const index = activeElement.index;
            const dataPoint = chart.getDatasetMeta(datasetIndex).data[index];

            if (dataPoint) {
              const { x, y } = dataPoint.getProps(["x", "y"], true);
              drawSelectionPoint(x, y);
            }
          }

          // Draw selection point for the morningIndex
          if (typeof activeIndex === "number") {
            const dataPoint = chart.getDatasetMeta(0).data[activeIndex];
            if (dataPoint) {
              const { x, y } = dataPoint.getProps(["x", "y"], true);
              drawSelectionPoint(x, y);
            }
          }
        },
      }),
      [fillArea], // Removed morningIndex from dependencies
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
                const tickLabel = context.tick && context.tick.label;
                if (typeof activeIndex === "number") {
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
              autoSkip: typeof activeIndex !== "number",
              maxTicksLimit: typeof activeIndex !== "number" ? 6 : undefined,
              callback: (_value, index, values) => {
                const xValue = data[index][xKey];

                if (!xValue) {
                  return "";
                }

                const tickLabel = xValue instanceof Date ? `${xValue.getMonth() + 1}/${xValue.getDate()}` : xValue;

                if (typeof activeIndex === "number") {
                  if (index === 0 || index === values.length - 1) {
                    return tickLabel;
                  }

                  const indicesToShowTicks = [4, 9, 14, 19];

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
              maxTicksLimit: 3,
              callback: (value) => {
                const num = typeof value === "string" ? Number(value) : value;
                return valueFormatter ? valueFormatter(num) : value;
              },
            },
          },
        },
      };
    }, [data, xKey, yTickMin, yTickMax, valueFormatter, useLogarithmicScale]);

    const allPlugins = useMemo<Plugin[]>(
      () => [
        gradientPlugin,
        verticalLinePlugin,
        horizontalReferenceLinePlugin,
        selectionPointPlugin,
        selectionCallbackPlugin,
      ],
      [
        gradientPlugin,
        verticalLinePlugin,
        horizontalReferenceLinePlugin,
        selectionPointPlugin,
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
