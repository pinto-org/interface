import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  LinearScale,
  LineController,
  LineElement,
  Plugin,
  PointElement,
} from "chart.js";
import { ReactChart } from "../ReactChart";
import { useCallback } from "react";

ReactChart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement);

export interface LineChartData {
  // TODO(ss): number[]
  value: number;
  timestamp: Date;
}

export type MakeGradientFunction = (ctx: CanvasRenderingContext2D | null) => CanvasGradient | undefined;

export interface LineChartProps {
  data: LineChartData[];
  makeLineGradients: MakeGradientFunction[];
  valueFormatter?: (value: number) => string;
}

export default function LineChart({ data, makeLineGradients, valueFormatter }: LineChartProps) {
  const chartData = useCallback(
    (ctx: CanvasRenderingContext2D | null): ChartData => {
      return {
        labels: data.map((d) => d.timestamp),
        datasets: [
          {
            data: data.map((d) => d.value),
            borderColor: makeLineGradients[0](ctx),
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

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([8, 8]);
        ctx.moveTo(dataPoint.x, chart.chartArea.top);
        ctx.lineTo(dataPoint.x, chart.chartArea.bottom);
        ctx.strokeStyle = "#D9AD0F";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
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
        position: "right",
        beginAtZero: true,
        min: 0,
      },
    },
  };

  return <ReactChart type="line" data={chartData} options={chartOptions} plugins={[hoverPlugin]} />;
}
