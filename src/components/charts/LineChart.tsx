import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  Plugin,
  PointElement,
  Tooltip,
} from "chart.js";
import { ReactChart } from "../ReactChart";
import { useCallback } from "react";

// TODO: This might be more than needed
ReactChart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface LineChartData {
  value: number;
  timestamp: Date;
}

// TODO: add configurable gradient here
export interface LineChartProps {
  data: LineChartData[];
  options?: ChartOptions;
}

export default function LineChart({ data, options }: LineChartProps) {
  const chartData = useCallback(
    (ctx: CanvasRenderingContext2D | null): ChartData => {
      // Create the line gradient
      let gradient: CanvasGradient | undefined = undefined;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
        gradient.addColorStop(1, "rgba(0, 0, 255, 1)");
      }

      return {
        labels: data.map((d) => d.timestamp),
        datasets: [
          {
            data: data.map((d) => d.value),
            borderColor: gradient,
            borderWidth: 2,
            // Hide default points, custom are implemented in afterDraw plugin
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      };
    },
    [data],
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
        // TODO: color should be set according to what point on the gradient this is
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
        position: "right",
      },
    },
    ...options,
  };

  return <ReactChart type="line" data={chartData} options={chartOptions} plugins={[hoverPlugin]} />;
}
