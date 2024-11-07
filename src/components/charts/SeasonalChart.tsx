import { useEffect, useState } from "react";
import Text from "../ui/Text";
import { formatDate } from "@/utils/format";
import LineChart, { MakeGradientFunction } from "./LineChart";

interface SeasonalChartData {
  value: number;
  season: number;
  timestamp: Date;
}

interface SeasonalChartProps {
  title: string;
  valueFormatter: (value: number) => string;
  tickValueFormatter?: (value: number) => string;
}

const gradientFunction: MakeGradientFunction = (ctx: CanvasRenderingContext2D | null) => {
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, "#F2F6F9");
    gradient.addColorStop(0.495, "#00C767");
    gradient.addColorStop(1, "#246645");
    return gradient;
  }
};

// TEMP testing data. eventually this component will accept some data getter function
// The actual method will need to provide some pagination logic
async function getData() {
  const data: SeasonalChartData[] = [];
  const startDate = new Date();
  startDate.setDate(1);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const value = parseFloat((Math.random() * (1.1 - 0.9) + 0.9).toFixed(6));
    data.push({ value, season: 23456 + i, timestamp: date });
  }
  return data;
}

export default function SeasonalChart({ title, valueFormatter, tickValueFormatter }: SeasonalChartProps) {
  const [allData, setAllData] = useState<SeasonalChartData[] | null>(null);
  const [displayData, setDisplayData] = useState<SeasonalChartData | null>(null);

  useEffect(
    () => {
      (async () => {
        const data = await getData();
        setAllData(data);
        setDisplayData(data[data.length - 1]);
      })();
    },
    [
      /*TODO(ss): getData (when it becomes a prop)*/
    ],
  );

  return (
    <div className="rounded-[20px] p-4 sm:p-6 sm:pb-4" style={{ backgroundColor: "#F8F8F8" }}>
      <Text variant="body" color="light">
        {title}
      </Text>

      {!allData && !displayData && "spinner goes here"}
      {allData && displayData && (
        <>
          <Text variant="h3" color="green3">
            {valueFormatter(displayData.value)}
          </Text>
          <div className="flex flex-col gap-2 mt-3">
            <Text variant="sm-light" color="light">
              Season {displayData.season}
            </Text>
            <Text variant="sm-light" color="light">
              {formatDate(displayData.timestamp)}
            </Text>
          </div>

          <LineChart
            data={allData.map((d) => ({ value: d.value, timestamp: d.timestamp }))}
            makeLineGradients={[gradientFunction]}
            valueFormatter={tickValueFormatter}
          />
        </>
      )}
    </div>
  );
}
