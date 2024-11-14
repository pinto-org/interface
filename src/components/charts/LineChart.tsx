import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  Plugin,
  PointElement,
} from "chart.js";
import { ReactChart } from "../ReactChart";
import React, { useCallback, useMemo } from "react";

ReactChart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler);

export interface LineChartData {
  values: number[];
  timestamp: Date;
}

export type MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  position: number,
) => CanvasGradient | undefined;

export interface LineChartProps {
  data: LineChartData[];
  size: "small" | "large";
  makeLineGradients: MakeGradientFunction[];
  // If not provided, do not fill area
  makeAreaGradients?: MakeGradientFunction[];
  valueFormatter?: (value: number) => string;
  onMouseOver?: (index: number) => void;
}

const LineChart = React.memo(
  ({ data, size, makeLineGradients, makeAreaGradients, valueFormatter, onMouseOver }: LineChartProps) => {
    const minData = data.reduce((acc, next) => Math.min(acc, ...next.values), Number.MAX_SAFE_INTEGER);
    const maxData = data.reduce((acc, next) => Math.max(acc, ...next.values), Number.MIN_SAFE_INTEGER);

    let yTickMin = Math.max(0, minData - (maxData - minData) * 0.1);
    const yTickMax = maxData;
    if (yTickMin === yTickMax) {
      yTickMin = yTickMax * 0.99;
    }

    const chartData = useCallback(
      (ctx: CanvasRenderingContext2D | null): ChartData => {
        return {
          labels: data.map((d) => d.timestamp),
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
      [data, makeLineGradients, makeAreaGradients],
    );

    const gradientPlugin: Plugin = useMemo<Plugin>(
      () => ({
        id: "customGradientShift",
        beforeUpdate: (chart: Chart) => {
          const ctx = chart.ctx;
          if (ctx) {
            const activeElements = chart.getActiveElements();
            let relativeX = 1;
            if (activeElements.length > 0) {
              const dataPoint = chart.getDatasetMeta(0).data[activeElements[0].index];
              relativeX = (dataPoint.x - chart.chartArea.left) / chart.chartArea.width;
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
      [onMouseOver],
    );

    const chartOptions: ChartOptions = {
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
              const date = data[index].timestamp;
              const tickLabel = `${date.getMonth() + 1}/${date.getDate()}`;

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
