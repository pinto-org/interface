import LineChart from "@/components/charts/LineChart";
import Text from "@/components/ui/Text";
import useTemperature from "@/state/useTemperature";
import { formatter } from "@/utils/format";
import { useMemo } from "react";

import MorningCard from "@/components/MorningCard";
import { MorningIntervalCountdown } from "@/pages/field/MorningCountdown";
import { useMorning } from "@/state/useSunData";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Temperature } from ".";
import { Morning } from "../sun";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// Draws dynamic gradient with the given colors at the given positions.
// Positions outside of range [0, 1] are truncated or ignored when appropriate.
const positionalGradient = (ctx: CanvasRenderingContext2D, colors: string[], positions: number[]) => {
  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  for (let i = 0; i < positions.length; ++i) {
    if (positions[i] >= 0 && positions[i] <= 1) {
      gradient.addColorStop(positions[i], colors[i]);
    } else if (positions[i] > 1 && positions[i - 1] < 1) {
      gradient.addColorStop(1, colors[i]);
    } else if (positions[i] < 0 && positions[i + 1] > 0) {
      gradient.addColorStop(0, colors[i]);
    }
  }
  return gradient;
};

// Draws a dynamic gradient depending on mouse position in the chart
const lineGradientFn = (ctx: CanvasRenderingContext2D | null, position: number) => {
  if (ctx) {
    const colors = ["#F2F6F9", "#00C767", "#246645", "#00C767", "#F2F6F9"];
    const positions = [position - 1, position - 0.5, position, position + 0.5, position + 1];
    return positionalGradient(ctx, colors, positions);
  }
};

const createFillGradient = (context: CanvasRenderingContext2D) => {
  const gradient = context.createLinearGradient(0, 0, context.canvas.width, 0);
  gradient.addColorStop(0, "rgba(233, 231, 224, 0.49)"); // Start color
  gradient.addColorStop(0.52, "#FEE18C"); // Middle color
  gradient.addColorStop(1, "#F1F88C"); // End color
  return gradient;
};

const createGradient = (context: CanvasRenderingContext2D) => {
  const gradient = context.createLinearGradient(0, context.canvas.width, context.canvas.width, 0);
  gradient.addColorStop(0, "#F6F3E9"); // Start color
  gradient.addColorStop(0.52, "#FEF400"); // Middle color
  gradient.addColorStop(1, "#BB9200"); // End color
  return gradient;
};

const makeLineGradients = [createGradient];

const valueFormatter = (value: number) => formatter.pct(value);

const MorningTemperatureChart = () => {
  const [temps, utils] = useTemperature();
  const morning = useMorning();
  const maxTemperature = temps.max;

  const mappedData = useMemo(() => {
    const labels: number[] = [];
    const datas: number[] = [];

    for (const value of Object.values(utils.generate())) {
      labels.push(value.interval);
      datas.push(value.temperature.toNumber());
    }

    return { data: datas, labels };
  }, [utils.generate]);

  const chartData = useMemo(() => {
    const data = {
      labels: mappedData.labels,
      datasets: [
        {
          data: mappedData.data, // Y-axis data points
          fill: true, // Whether to fill the area under the line
          borderColor: (context: any) => createGradient(context.chart.ctx),
          // backgroundColor: (context: any) => createFillGradient(context.chart.ctx),
          backgroundColor: "#000000",
          borderWidth: 3, // Similar to your 3.41px
          pointRadius: 0,
          tension: 0.4,
          pointHoverRadius: 0, // Size on hover
        },
      ],
    };

    // Define the configuration options for the chart
    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false, // Allow chart to fill parent height
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false, // **Disable Y-axis grid lines**
          },
        },
        y: {
          display: false,
          grid: {
            display: false, // **Disable Y-axis grid lines**
          },
          // suggestedMin: 0,
          // suggestedMax: maxTemperature.toNumber(),
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutQuart",
      },
    };

    return { data, options };
  }, [mappedData]);

  return (
    // <MorningCard className="flex flex-col w-full p-6">
    <div className="flex flex-col w-full p-6">
      <div className="flex flex-col w-full gap-2">
        <Stat morning={morning} temperature={temps} />
        <div className="flex flex-col w-full max-h-[177px]">
          <Line data={chartData.data} options={chartData.options} />
        </div>
      </div>
    </div>
    // </MorningCard>
  );
};

export default MorningTemperatureChart;

const Stat = ({
  temperature,
  hoveredIndex,
  morning,
}: { temperature: Temperature; morning: Morning; hoveredIndex?: number }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <Text>Current Temperature {morning.index + 1}/25</Text>
      <div className="flex flex-col gap-2">
        <Text variant="sm-thin" color="light">
          <MorningIntervalCountdown prefix={"Increasing in"} />
        </Text>
        <Text variant="h3">{formatter.pct(temperature.current)}</Text>
      </div>
    </div>
  );
};

/**
 * Max SOIL for the season:
 *
 * If we're above peg:
 * - amount of pods that became harvestable at the start of the season / 100% + max temperature
 * otherwise:
 * - capped deltaB
 *
 *
 *
 * 1000 pods harvested, temp is 100%
 *
 * above peg:
 * 1000 pods harvestable / 100% + max temperature = 200%. 1000 / 2 = 500 SOIL.
 *
 *
 * 1000 / (100% + 100%) = 1000 / 200% = 500 SOIL.
 *
 *
 *
 *
 */
