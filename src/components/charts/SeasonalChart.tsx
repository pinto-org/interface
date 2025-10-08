import FrameAnimator from "@/components/LoadingSpinner.tsx";
import { formatDate } from "@/utils/format";
import { UseSeasonalResult } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CloseIconAlt } from "../Icons";
import TooltipSimple from "../TooltipSimple";
import LineChart, { LineChartData } from "./LineChart";
import TimeTabsSelector, { TimeTab } from "./TimeTabs";
import {
  LineChartHorizontalReferenceLine,
  gradientFunctions,
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

// Interface for y-axis range configuration by time period
export interface YAxisRangeConfig {
  min?: number;
  max?: number;
  showReferenceLine?: boolean;
}

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
  useLogarithmicScale?: boolean;
  showReferenceLineAtOne?: boolean;
  dataNotFetching?: boolean;
  noDataMessage?: string;
  // Analytics context for chart time filter tracking
  analyticsContext?: {
    chart_id?: string;
    chart_title?: string;
    explorer_tab?: string;
  };
  // New props for custom y-axis ranges
  yAxisRanges?: {
    [TimeTab.Week]?: YAxisRangeConfig;
    [TimeTab.Month]?: YAxisRangeConfig;
    [TimeTab.AllTime]?: YAxisRangeConfig;
  };
  chartWrapperClassName?: string;
  tooltip?: string;
}

const morningStrokeGradients = [metallicMorningStrokeGradientFn];
const greenStrokeGradients = [gradientFunctions.metallicGreen];

const areaGradients = [metallicMorningAreaGradientFn];

const DEFAULTS = {
  oneHorizontalReferenceLine: [
    {
      value: 1,
      color: "#9C9C9C",
      dash: [2, 10],
      label: "$1.00 target",
    },
  ] as LineChartHorizontalReferenceLine[],
  chartData: [] as LineChartData[],
} as const;

const SeasonalChart = ({
  title,
  tooltip,
  size,
  activeTab,
  onChangeTab,
  useSeasonalResult,
  valueFormatter,
  tickValueFormatter,
  fillArea,
  statVariant = "explorer",
  className,
  dataNotFetching = false,
  useLogarithmicScale = false,
  showReferenceLineAtOne = false,
  analyticsContext,
  yAxisRanges,
  noDataMessage = "No data to display",
  chartWrapperClassName,
}: SeasonalChartProps) => {
  const [allData, setAllData] = useState<SeasonalChartData[] | null>(null);
  const [displayData, setDisplayData] = useState<SeasonalChartData | null>(null);

  const inputData = useSeasonalResult.data;
  const isLoading = useSeasonalResult.isLoading;
  const isError = useSeasonalResult.isError;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only update the data when the input data changes
  useEffect(() => {
    if (!inputData) {
      setAllData(null);
      setDisplayData(null);
      return;
    }

    const handleSet = (toSetData: SeasonalChartData[]) => {
      setAllData(toSetData);
      setDisplayData(toSetData[toSetData.length - 1]);
    };

    if (!allData || inputData.length !== allData.length) {
      handleSet(inputData);
    }
  }, [inputData]);

  const handleChangeTab = useCallback((tab: TimeTab) => onChangeTab(tab), [onChangeTab]);

  const chartData = useMemo<LineChartData[]>(() => {
    if (allData) {
      return allData.map((d) => ({
        values: [useLogarithmicScale ? Math.max(0.000001, d.value) : d.value],
        timestamp: d.timestamp,
      }));
    }
    return DEFAULTS.chartData;
  }, [allData, useLogarithmicScale]);

  // Get the current y-axis range based on active tab
  const currentYAxisRange = useMemo(() => {
    if (!yAxisRanges) return undefined;
    return yAxisRanges[activeTab];
  }, [yAxisRanges, activeTab]);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (allData) {
        const indexData = index !== undefined ? allData[index] : undefined;
        const setData = indexData ?? allData[allData.length - 1];
        setDisplayData(setData);
      }
    },
    [allData],
  );

  return (
    <div className={cn("rounded-[20px] bg-gray-1", className)}>
      <div className="flex justify-between pt-4 px-4 sm:pt-6 sm:px-6">
        <div className="flex flex-row gap-1 items-center">
          <div
            className={`${statVariant === "explorer" ? "sm:pinto-body text-pinto-light sm:text-pinto-light" : "sm:pinto-body-light text-pinto-primary sm:text-pinto-primary"} pinto-sm-light font-thin pb-0.5`}
          >
            {title}
          </div>
          {tooltip && <TooltipSimple content={tooltip} variant="gray" />}
        </div>
        <TimeTabsSelector tab={activeTab} setTab={handleChangeTab} context={analyticsContext} />
      </div>

      {((!allData && !displayData) || isLoading || isError) && !dataNotFetching && (
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
              {isLoading && !isError && <FrameAnimator size={75} />}
              {isError && (
                <>
                  <CloseIconAlt color={"red"} />
                  <div className="pinto-body text-pinto-green-3">An error has occurred</div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {((allData && allData.length === 0) || dataNotFetching) && (
        <div
          className={`relative w-full flex items-center justify-center ${size === "small" ? "aspect-3/1" : "aspect-6/1"}`}
          style={{
            paddingBottom: `calc(85px + ${size === "small" ? "33.33%" : "16.67%"})`,
            height: "0",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pinto-body-light">{noDataMessage}</div>
          </div>
        </div>
      )}
      {allData && displayData && !isLoading && !isError && !dataNotFetching && (
        <>
          <DisplayData displayData={displayData} statVariant={statVariant} valueFormatter={valueFormatter} />
          <div className={size === "small" ? "aspect-3/1" : "aspect-6/1"}>
            {!chartData.length && !isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="pinto-body-light">No data</div>
              </div>
            ) : (
              <div className={cn("px-4 pt-4 pb-4 h-[300px]", chartWrapperClassName)}>
                <LineChart
                  data={chartData}
                  xKey="timestamp"
                  size={size}
                  makeLineGradients={fillArea ? morningStrokeGradients : greenStrokeGradients}
                  makeAreaGradients={fillArea ? areaGradients : undefined}
                  valueFormatter={tickValueFormatter}
                  onMouseOver={handleMouseOver}
                  useLogarithmicScale={useLogarithmicScale}
                  horizontalReferenceLines={showReferenceLineAtOne ? DEFAULTS.oneHorizontalReferenceLine : undefined}
                  yAxisMin={currentYAxisRange?.min}
                  yAxisMax={currentYAxisRange?.max}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default SeasonalChart;

const DisplayData = ({
  displayData,
  statVariant,
  valueFormatter,
}: {
  displayData: SeasonalChartData;
  statVariant: "explorer" | "non-colored";
  valueFormatter: (value: number) => string;
}) => {
  return (
    <div className="h-[85px] px-4 sm:px-6">
      <div
        className={`${statVariant === "explorer" ? "text-pinto-green-3 sm:text-pinto-green-3" : "text-pinto-primary sm:text-pinto-primary"} pinto-body sm:pinto-h3`}
      >
        {valueFormatter(displayData.value)}
      </div>
      <div className="flex flex-col gap-0 mt-2 sm:gap-2 sm:mt-3">
        <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
          Season {displayData.season}
        </div>
        <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
          {formatDate(displayData.timestamp)}
        </div>
      </div>
    </div>
  );
};
