import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  Plugin,
  PointElement,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactChart } from "../ReactChart";

Chart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler);

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
      const maxData = data.reduce((acc, next) => Math.max(acc, ...next.values), Number.MIN_SAFE_INTEGER);
      const minData = data.reduce((acc, next) => Math.min(acc, ...next.values), Number.MAX_SAFE_INTEGER);

      let minTick = Math.max(0, minData - (maxData - minData) * 0.1);
      if (minTick === maxData) {
        minTick = maxData * 0.99;
      }
      return [minTick, maxData];
    }, [data]);

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
            position: "right",
            min: yTickMin,
            max: yTickMax,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              padding: 0,
              maxTicksLimit: 2,
              callback: (value) => {
                const num = typeof value === "string" ? Number(value) : value;
                return valueFormatter?.(num) ?? value;
              },
            },
          },
        },
      };
    }, [data, xKey, yTickMin, yTickMax, valueFormatter]);

    const allPlugins = useMemo<Plugin[]>(
      () => [gradientPlugin, verticalLinePlugin, selectionPointPlugin, selectionCallbackPlugin],
      [gradientPlugin, verticalLinePlugin, selectionPointPlugin, selectionCallbackPlugin],
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
