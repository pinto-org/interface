import LineChart, { LineChartData, MakeGradientFunction } from "@/components/charts/LineChart";
import Text from "@/components/ui/Text";
import { formatter } from "@/utils/format";
import { useMemo, useState } from "react";

import MorningCard from "@/components/MorningCard";
import { MorningIntervalCountdown } from "@/pages/field/MorningCountdown";
import useCalculateTemperature from "@/state/useCalculateTemperature";
import { useMorning } from "@/state/useSunData";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Morning } from "../../state/protocol/sun";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const createGradient: MakeGradientFunction = (context: CanvasRenderingContext2D | null, _position: number) => {
  if (context) {
    const gradient = context.createLinearGradient(0, context.canvas.width, context.canvas.width, 0);
    gradient.addColorStop(0, "#F6F3E9"); // Start color
    gradient.addColorStop(0.52, "#FEF400"); // Middle color
    gradient.addColorStop(1, "#BB9200"); // End color
    return gradient;
  }
  return undefined;
};

const makeLineGradients = [createGradient];

const MorningTemperatureChart = () => {
  const { generate } = useCalculateTemperature();

  const [hoveredIndex, setHoveredIndex] = useState<number>();
  const morning = useMorning();

  const mappedData = useMemo(() => {
    const labels: number[] = [];
    const datas: LineChartData[] = [];

    for (const value of Object.values(generate())) {
      labels.push(value.interval);
      datas.push({ values: [value.temperature.toNumber()], interval: value.interval });
    }

    return datas;
  }, [generate]);

  return (
    <MorningCard className="flex flex-col w-full p-6">
      <div className="flex flex-col w-full gap-2">
        <Stat morning={morning} data={mappedData} hoveredIndex={hoveredIndex} />
        <div className="flex flex-col w-full max-h-[177px]">
          <LineChart
            data={mappedData}
            size="large"
            xKey="interval"
            makeLineGradients={makeLineGradients}
            onMouseOver={(idx) => {
              setHoveredIndex(idx);
            }}
          />
        </div>
      </div>
    </MorningCard>
  );
};

export default MorningTemperatureChart;

const Stat = ({
  hoveredIndex,
  data,
  morning,
}: {
  morning: Morning;
  data: LineChartData[];
  hoveredIndex?: number;
}) => {
  const morningIndex = morning.index > 25 ? 25 : morning.index < 0 ? 0 : morning.index;

  const index = hoveredIndex ?? morningIndex;
  const clampedIndex = index > 25 ? 24 : index < 0 ? 0 : index;

  const displayTemp = data[clampedIndex].values?.[0];

  return (
    <div className="flex flex-col w-full gap-1">
      <Text>Current Temperature {clampedIndex + 1}/25</Text>
      <div className="flex flex-col gap-2">
        <Text variant="sm-thin" color="light">
          <MorningIntervalCountdown prefix={"Increasing in"} />
        </Text>
        <Text variant="h3">{formatter.pct(displayTemp)}</Text>
      </div>
    </div>
  );
};
