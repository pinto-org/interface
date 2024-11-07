import { useCallback, useEffect, useMemo, useState } from "react";
import Text from "../ui/Text";
import { formatDate } from "@/utils/format";
import LineChart, { LineChartData, MakeGradientFunction } from "./LineChart";

interface SeasonalChartData {
  value: number;
  season: number;
  timestamp: Date;
}

interface SeasonalChartProps {
  title: string;
  valueFormatter: (value: number) => string;
  tickValueFormatter?: (value: number) => string;
  fillArea?: boolean;
}

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
const lineGradientFn: MakeGradientFunction = (ctx: CanvasRenderingContext2D | null, position: number) => {
  if (ctx) {
    const colors = ["#F2F6F9", "#00C767", "#246645", "#00C767", "#F2F6F9"];
    const positions = [position - 1, position - 0.5, position, position + 0.5, position + 1];
    return positionalGradient(ctx, colors, positions);
  }
};

const areaGradientFn: MakeGradientFunction = (ctx: CanvasRenderingContext2D | null, _position: number) => {
  if (ctx) {
    const colors = ["rgba(233, 231, 224, 0.49)", "#FEE18C", "#F1F88C"];
    const positions = [0, 0.5, 1];
    return positionalGradient(ctx, colors, positions);
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

export default function SeasonalChart({ title, valueFormatter, tickValueFormatter, fillArea }: SeasonalChartProps) {
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

  const chartData = useMemo<LineChartData[]>(() => {
    if (allData) {
      return allData.map((d) => ({ values: [d.value], timestamp: d.timestamp }));
    }
    return [];
  }, [allData]);

  const lineGradients = useMemo<MakeGradientFunction[]>(() => {
    return [lineGradientFn];
  }, []);

  const areaGradients = useMemo<MakeGradientFunction[] | undefined>(() => {
    if (fillArea) {
      return [areaGradientFn];
    }
  }, [fillArea]);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (allData) {
        setDisplayData(allData[index ?? allData.length - 1]);
      }
    },
    [allData],
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
            data={chartData}
            makeLineGradients={lineGradients}
            makeAreaGradients={areaGradients}
            valueFormatter={tickValueFormatter}
            onMouseOver={handleMouseOver}
          />
        </>
      )}
    </div>
  );
}
