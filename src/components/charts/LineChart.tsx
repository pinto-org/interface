import {
  CategoryScale,
  Chart,
  ChartData,
  ChartEvent,
  ChartOptions,
  LinearScale,
  LineController,
  LineElement,
  Plugin,
  PointElement,
} from "chart.js";
import { ReactChart } from "../ReactChart";
import React, { useCallback, useEffect } from "react";

ReactChart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement);

export interface LineChartData {
  // TODO(ss): number[]
  value: number;
  timestamp: Date;
}

export type MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  position: number,
) => CanvasGradient | undefined;

export interface LineChartProps {
  data: LineChartData[];
  makeLineGradients: MakeGradientFunction[];
  valueFormatter?: (value: number) => string;
  onMouseOver?: (index: number) => void;
}

export const LineChart = React.memo(({ data, makeLineGradients, valueFormatter, onMouseOver }: LineChartProps) => {
  const chartData = useCallback(
    (ctx: CanvasRenderingContext2D | null): ChartData => {
      return {
        labels: data.map((d) => d.timestamp),
        datasets: [
          {
            data: data.map((d) => d.value),
            borderColor: makeLineGradients[0](ctx, 1),
            borderWidth: 3.41,
            // Hide default points, custom are implemented in afterDraw plugin
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      };
    },
    [data, makeLineGradients],
  );

  // TODO: separate plugins
  const hoverPlugin: Plugin = {
    id: "customLineHover",
    afterDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const activeElements = chart.getActiveElements();
      if (ctx && activeElements.length > 0) {
        const point = activeElements[0];
        const index = point.index;
        const meta = chart.getDatasetMeta(0);
        const dataPoint = meta.data[index];

        const { x, y } = dataPoint;

        // Update line gradient(s)
        const relativeX = (x - chart.chartArea.left) / chart.chartArea.width;
        for (let i = 0; i < chart.data.datasets.length; ++i) {
          chart.data.datasets[i].borderColor = makeLineGradients[i](ctx, relativeX);
        }
        chart.update("none");

        // Draw vertical line
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([8, 8]);
        // chartArea.top is not corresponding to the top of the canvas element
        ctx.moveTo(x, chart.chartArea.top - 50);
        ctx.lineTo(x, chart.chartArea.bottom);
        ctx.strokeStyle = "#D9AD0F";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

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

        // Report selection to parent
        onMouseOver?.(index);
      }
    },
  };

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
        beginAtZero: true,
        min: 0,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 35,
          callback: (value) => {
            const num = typeof value === "string" ? Number(value) : value;
            return valueFormatter?.(num) ?? value;
          },
        },
      },
    },
  };

  return <ReactChart type="line" data={chartData} options={chartOptions} plugins={[hoverPlugin]} />;
});
export default LineChart;
