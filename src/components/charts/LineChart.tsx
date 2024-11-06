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

// TODO: add configurable gradient here
interface LineChartProps {
  data: ChartData;
  options?: ChartOptions;
}

export default function LineChart({ data, options }: LineChartProps) {
  const chartData = useCallback(
    (ctx: CanvasRenderingContext2D | null): ChartData => {
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
            // Hide default points, custom are implemented in afterDraw plugin
            pointRadius: 0,
            pointHoverRadius: 0,
            ...d,
          };
        }),
      };
    },
    [data],
  );

  const hoverPlugin: Plugin = {
    id: "customLineHover",
    afterDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const activeElements = chart.getActiveElements();
      console.log("im here", activeElements.length);
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
    onHover: () => {},
    ...options,
  };

  return <ReactChart type="line" data={chartData} options={chartOptions} plugins={[hoverPlugin]} />;
}
