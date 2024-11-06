import {
  ActiveElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartEvent,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { ReactChart } from "../ReactChart";
import { useCallback } from "react";

// TODO: This might be more than needed
ReactChart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// TODO: add configurable gradient here
interface LineChartProps {
  data: ChartData;
  options?: ChartOptions;
}

export default function LineChart({ data, options }: LineChartProps) {
  const chartData = useCallback(
    (_chart: Chart, ctx: CanvasRenderingContext2D | null): ChartData => {
      // Create the line gradient
      let gradient: CanvasGradient;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
        gradient.addColorStop(1, "rgba(0, 0, 255, 1)");
      }

      return {
        labels: ["Test1", "Test2", "test3"], // remove later
        datasets: data.datasets.map((d) => {
          return {
            borderColor: gradient,
            borderWidth: 2,
            pointRadius: 0, // Hide default points
            pointHoverRadius: 6, // Highlight on hover
            ...d,
          };
        }),
      };
    },
    [data],
  );

  const chartOptions = useCallback(
    (chart: Chart, ctx: CanvasRenderingContext2D | null): ChartOptions => ({
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false, // Hide default tooltip
        },
      },
      interaction: {
        mode: "nearest", // Highlight the nearest point
        axis: "x",
        intersect: false,
      },
      onHover: (_event: ChartEvent, chartElement: ActiveElement[]) => {
        if (!ctx) {
          return;
        }
        const point = chartElement[0];
        if (point) {
          const index = point.index;
          const meta = chart.getDatasetMeta(0);
          const dataPoint = meta.data[index];

          // Draw vertical dotted line
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.moveTo(dataPoint.x, chart.chartArea.top);
          ctx.lineTo(dataPoint.x, chart.chartArea.bottom);
          ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      },
      ...options,
    }),
    [options],
  );

  return <ReactChart type="line" data={chartData} options={chartOptions} />;
}
