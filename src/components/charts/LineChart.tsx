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
import React, { useCallback, useMemo } from "react";
import { ReactChart } from "../ReactChart";

ReactChart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler);

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
}

const LineChart = React.memo(
  ({ data, size, xKey, makeLineGradients, makeAreaGradients, valueFormatter, onMouseOver }: LineChartProps) => {
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
          datasets: data[0].values.map((_, idx: number) => ({
            data: data.map((d) => d.values[idx]),
            borderColor: makeLineGradients[idx](ctx, 1),
            borderWidth: 3.41,
            fill: !!makeAreaGradients,
            backgroundColor: makeAreaGradients?.[idx](ctx, 1),
            // Hide default points, custom are implemented in afterDraw plugin
            pointRadius: 0,
            pointHoverRadius: 0,
          })),
        };
      },
      [data, makeLineGradients, makeAreaGradients, xKey],
    );

    const gradientPlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customGradientShift",
        beforeUpdate: (chart: Chart) => {
          const ctx = chart.ctx;
          if (ctx) {
            let relativeX = 1;
            const activeElements = chart.getActiveElements();
            if (activeElements.length > 0) {
              const dataPoint = chart.getDatasetMeta(0).data[activeElements[0].index];
              if (dataPoint) {
                relativeX = (dataPoint.x - chart.chartArea.left) / chart.chartArea.width;
              }
            }

            for (let i = 0; i < chart.data.datasets.length; ++i) {
              chart.data.datasets[i].borderColor = makeLineGradients[i](ctx, relativeX);
              if (makeAreaGradients) {
                chart.data.datasets[i].backgroundColor = makeAreaGradients[i](ctx, relativeX);
              }
            }
          }
        },
      }),
      [makeLineGradients, makeAreaGradients],
    );

    const referenceDotPlugin: Plugin = useMemo<Plugin>(() => {}, []);

    const verticalLinePlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customVerticalLine",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          const activeElements = chart.getActiveElements();
          if (ctx && activeElements.length > 0) {
            const dataPoint = chart.getDatasetMeta(0).data[activeElements[0].index];

            // Draw vertical line
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([8, 8]);
            // chartArea.top is not corresponding to the top of the canvas element
            ctx.moveTo(dataPoint.x, chart.chartArea.top - 50);
            ctx.lineTo(dataPoint.x, chart.chartArea.bottom);
            ctx.strokeStyle = "#D9AD0F";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
          }
        },
      }),
      [],
    );

    const selectionPointPlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customSelectPoint",
        afterDraw: (chart: Chart) => {
          const ctx = chart.ctx;
          const activeElements = chart.getActiveElements();
          if (ctx && activeElements.length > 0) {
            const dataPoint = chart.getDatasetMeta(0).data[activeElements[0].index];
            const { x, y } = dataPoint;

            // Draw rounded rect around selected point
            ctx.save();
            ctx.fillStyle = "#D9AD0F";
            ctx.strokeStyle = "#D9AD0F";
            ctx.lineWidth = 2;

            const rectWidth = 12;
            const rectHeight = 12;
            const cornerRadius = 5;

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
          }
        },
      }),
      [],
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
            right: -35,
            top: 0,
            bottom: -15,
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
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              padding: 15,
              minRotation: 0,
              maxRotation: 0,
              autoSkip: false,
              callback: (_value, index, values) => {
                const xValue = data[index][xKey];

                if (!xValue) {
                  return "";
                }

                const tickLabel = xValue instanceof Date ? `${xValue.getMonth() + 1}/${xValue.getDate()}` : xValue;

                // Always show the first and last label
                if (index === 0 || index === values.length - 1) {
                  return tickLabel;
                }

                // Evenly distribute remaining labels. Determine appropriate spacing by number of available dates
                const numMiddle = values.length - 2;
                const dividers = 5;
                const avgToSkip = (numMiddle - dividers) / (dividers + 1);
                const tickIndices: number[] = [];
                for (let i = 0; i < values.length - 2; ++i) {
                  const next = Math.ceil((tickIndices.length + 1) * (avgToSkip + 1));
                  if (i === next) {
                    tickIndices.push(next + 1);
                  }
                }

                if (tickIndices.includes(index)) {
                  return tickLabel;
                }
                return "";
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
              padding: 35,
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
          h: 1,
        };
      }
    }, [size]);

    return (
      <ReactChart
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
