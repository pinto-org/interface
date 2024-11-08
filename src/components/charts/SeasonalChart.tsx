import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Text from "../ui/Text";
import { formatDate } from "@/utils/format";
import LineChart, { LineChartData, MakeGradientFunction } from "./LineChart";
import { useSunData } from "@/state/useSunData";
import { UseQueryResult } from "@tanstack/react-query";

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

const tabToSeasonalLookback = (tab: TimeTab): number => {
  if (tab === TimeTab.Week) {
    return 24 * 7 - 1;
  } else if (tab === TimeTab.Month) {
    return 24 * 30 - 1;
  }
  return Number.MAX_SAFE_INTEGER;
};

// const priceDataFn = useCallback(() => {
//   /// Test data implementation ///
//   const data: SeasonalChartData[] = [];
//   const startDate = new Date();
//   startDate.setDate(1);

//   for (let i = 0; i < 40 * 2 ** priceTimeTab; i++) {
//     const date = new Date(startDate);
//     date.setDate(startDate.getDate() + i);
//     const value = parseFloat((Math.random() * (1.1 - 0.9) + 0.9).toFixed(6));
//     data.push({ value, season: 23456 + i, timestamp: date });
//   }
//   return data;
// }, [priceData]);

export interface SeasonalChartData {
  season: number;
  value: number;
  timestamp: Date;
}

export enum TimeTab {
  Week = 0,
  Month = 1,
  AllTime = 2,
}
const TIME_TABS = ["Week", "Month", "All Time"];

interface SeasonalChartProps {
  title: string;
  size: "small" | "large";
  useDataHook: (fromSeason: number, toSeason: number) => UseQueryResult<SeasonalChartData[]>;
  valueFormatter: (value: number) => string;
  tickValueFormatter?: (value: number) => string;
  fillArea?: boolean;
}

const SeasonalChart = ({
  title,
  size,
  useDataHook,
  valueFormatter,
  tickValueFormatter,
  fillArea,
}: SeasonalChartProps) => {
  const [activeTab, setActiveTab] = useState(TimeTab.Week);
  const [allData, setAllData] = useState<SeasonalChartData[] | null>(null);
  const [displayData, setDisplayData] = useState<SeasonalChartData | null>(null);

  // const season = useSunData().current; // TODO(ss): put this back eventually
  const season = 25826;
  const dataHook = useDataHook(Math.max(0, season - tabToSeasonalLookback(activeTab)), season);
  // console.log("h", dataHook.data, dataHook.isLoading, dataHook.error, dataHook.isError);

  useEffect(() => {
    if (dataHook.data && !allData) {
      setAllData(dataHook.data);
      setDisplayData(dataHook.data[dataHook.data.length - 1]);
    }
  }, [dataHook.data, allData]);

  const handleChangeTabFactory = useCallback(
    (idx: TimeTab) => () => {
      setActiveTab(idx);
      setAllData(null);
      setDisplayData(null);
    },
    [],
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

  // TODO: add display for booleans dataHook.isLoading, dataHook.isError
  return (
    <div className="rounded-[20px] p-4 sm:p-6 sm:pb-4" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="flex justify-between">
        <Text variant="body" color="light">
          {title}
        </Text>
        <div className="flex gap-4 sm:gap-8">
          {TIME_TABS.map((tabName: string, idx: number) => (
            <Text
              key={tabName}
              variant="body"
              color={activeTab === idx ? "green3" : "light"}
              data-state={activeTab === idx ? "active" : "inactive"}
              className="cursor-pointer data-[state=inactive]:hover:text-pinto-green-4"
              onClick={handleChangeTabFactory(idx)}
            >
              {tabName}
            </Text>
          ))}
        </div>
      </div>

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
            size={size}
            makeLineGradients={lineGradients}
            makeAreaGradients={areaGradients}
            valueFormatter={tickValueFormatter}
            onMouseOver={handleMouseOver}
          />
        </>
      )}
    </div>
  );
};
export default SeasonalChart;
