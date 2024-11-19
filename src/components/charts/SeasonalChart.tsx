import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import { formatDate } from "@/utils/format";
import { UseSeasonalResult } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CloseIconAlt } from "../Icons";
import Text from "../ui/Text";
import LineChart, { LineChartData, MakeGradientFunction } from "./LineChart";
import {
  metallicGreenStrokeGradientFn,
  metallicMorningAreaGradientFn,
  metallicMorningStrokeGradientFn,
} from "./chartHelpers";

export const tabToSeasonalLookback = (tab: TimeTab): number => {
  if (tab === TimeTab.Week) {
    return 24 * 7 - 1;
  } else if (tab === TimeTab.Month) {
    return 24 * 30 - 1;
  }
  return Number.MAX_SAFE_INTEGER;
};

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
  activeTab: TimeTab;
  onChangeTab: (tab: TimeTab) => void;
  useSeasonalResult: UseSeasonalResult;
  valueFormatter: (value: number) => string;
  tickValueFormatter?: (value: number) => string;
  fillArea?: boolean;
  statVariant?: "explorer" | "non-colored";
  className?: string;
}

const morningStrokeGradients = [metallicMorningStrokeGradientFn];
const greenStrokeGradients = [metallicGreenStrokeGradientFn];

const areaGradients = [metallicMorningAreaGradientFn];

const SeasonalChart = ({
  title,
  size,
  activeTab,
  onChangeTab,
  useSeasonalResult,
  valueFormatter,
  tickValueFormatter,
  fillArea,
  statVariant = "explorer",
  className,
}: SeasonalChartProps) => {
  const [allData, setAllData] = useState<SeasonalChartData[] | null>(null);
  const [displayData, setDisplayData] = useState<SeasonalChartData | null>(null);

  const inputData = useSeasonalResult.data;

  useEffect(() => {
    if (inputData && !allData) {
      setAllData(inputData);
      setDisplayData(inputData[inputData.length - 1]);
    }
  }, [inputData, allData]);

  const handleChangeTabFactory = useCallback(
    (tab: TimeTab) => () => {
      onChangeTab(tab);
      setAllData(null);
      setDisplayData(null);
    },
    [onChangeTab],
  );

  const chartData = useMemo<LineChartData[]>(() => {
    if (allData) {
      return allData.map((d) => ({ values: [d.value], timestamp: d.timestamp }));
    }
    return [];
  }, [allData]);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (allData) {
        setDisplayData(allData[index ?? allData.length - 1]);
      }
    },
    [allData],
  );

  return (
    <div className={cn("rounded-[20px] p-4 sm:p-6 sm:pb-4 bg-gray-1", className)}>
      <div className="flex justify-between">
        <Text
          variant={statVariant === "explorer" ? "body" : "body-light"}
          color={statVariant === "explorer" ? "light" : "primary"}
          className="pb-0.5"
        >
          {title}
        </Text>
        <div className="flex gap-4 sm:gap-8">
          {TIME_TABS.map((tabName: string, idx: number) => (
            <Text
              key={tabName}
              variant="body-light"
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

      {!allData && !displayData && (
        <>
          {/* Keep sizing the same as when there is data. Allows centering spinner/error vertically */}
          <div
            className={`relative w-full flex items-center justify-center ${size === "small" ? "aspect-3/1" : "aspect-6/1"}`}
            style={{
              paddingBottom: `calc(85px + ${size === "small" ? "33.33%" : "16.67%"})`,
              height: "0",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {useSeasonalResult.isLoading && !useSeasonalResult.isError && <LoadingSpinner size={75} />}
              {useSeasonalResult.isError && (
                <>
                  <CloseIconAlt color={"red"} />
                  <Text variant="body" color="green3">
                    An error has occurred
                  </Text>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {allData && displayData && (
        <>
          <div className="h-[85px]">
            <Text variant="h3" color={statVariant === "explorer" ? "green3" : "primary"}>
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
          </div>
          <div className={size === "small" ? "aspect-3/1" : "aspect-6/1"}>
            {!chartData.length && !useSeasonalResult.isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Text variant="body-light">No data</Text>
              </div>
            ) : (
              <LineChart
                data={chartData}
                xKey="timestamp"
                size={size}
                makeLineGradients={fillArea ? morningStrokeGradients : greenStrokeGradients}
                makeAreaGradients={fillArea ? areaGradients : undefined}
                valueFormatter={tickValueFormatter}
                onMouseOver={handleMouseOver}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default SeasonalChart;
