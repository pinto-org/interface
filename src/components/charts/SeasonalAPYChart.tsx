import FrameAnimator from "@/components/LoadingSpinner.tsx";
import { APYWindow, APY_EMA_WINDOWS, useSeasonalAPYs } from "@/state/seasonal/queries/useSeasonalAPY";
import { chartColors } from "@/state/useChartSetupData";
import useTokenData from "@/state/useTokenData";
import { chartFormatters as f, formatDate } from "@/utils/format";
import { SeasonalAPYChartData } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CloseIconAlt } from "../Icons";
import IconImage from "../ui/IconImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import LineChart, { CustomChartValueTransform, LineChartData } from "./LineChart";
import { SeasonalChartData, tabToSeasonalLookback } from "./SeasonalChart";
import TimeTabsSelector, { TimeTab } from "./TimeTabs";
import { gradientFunctions } from "./chartHelpers";

interface SeasonalAPYChartProps {
  season: number;
  size: "small" | "large";
  className?: string;
  analyticsContext?: {
    chart_id?: string;
    chart_title?: string;
    explorer_tab?: string;
  };
}

const strokeGradients = [gradientFunctions.solidRed, gradientFunctions.solidBlue, gradientFunctions.solidGreen];

// Custom transform to improve display around concentrated value ranges while still supporting outliers.
const transformValue = (v: number, max: number): number => {
  if (v <= 0) {
    return 0;
  } else if (v <= 0.01) {
    return 0.1 * (v / 0.01);
  } else if (v <= 0.1) {
    return 0.1 + 0.3 * ((v - 0.01) / 0.09);
  }
  // Use logarithmic scaling for values above 0.1
  const logRange = Math.log(max) - Math.log(0.1);
  const logValue = Math.log(v) - Math.log(0.1);
  return 0.4 + 0.6 * (logValue / logRange);
};

// Inverse of the above transform function.
const inverseTransformValue = (t: number, max: number): number => {
  if (t <= 0) {
    return 0;
  } else if (t <= 0.1) {
    return 0.01 * (t / 0.1);
  } else if (t <= 0.4) {
    return 0.01 + 0.09 * ((t - 0.1) / 0.3);
  }
  // Invert the logarithmic scaling
  const logRange = Math.log(max) - Math.log(0.1);
  const logValue = ((t - 0.4) / 0.6) * logRange + Math.log(0.1);
  return Math.exp(logValue);
};

const valueTransform = {
  to: transformValue,
  from: inverseTransformValue,
};

const SeasonalAPYChart = ({ season, size, className, analyticsContext }: SeasonalAPYChartProps) => {
  const [allData, setAllData] = useState<SeasonalAPYChartData | null>(null);
  const [displayIndex, setDisplayIndex] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<string>("");

  const [timeTab, setTimeTab] = useState(TimeTab.AllTime);
  const seasonalApy = useSeasonalAPYs(selectedToken, Math.max(0, season - tabToSeasonalLookback(timeTab)), season);
  const apyData = seasonalApy.data;

  const { mainToken, lpTokens } = useTokenData();
  const apyTokens = useMemo(() => {
    return [mainToken, ...lpTokens];
  }, [mainToken, lpTokens]);

  useEffect(() => {
    if (apyData && !allData) {
      const sortedData = Object.keys(apyData).reduce((acc, w) => {
        acc[w] = apyData[w].sort((a: SeasonalChartData, b: SeasonalChartData) => a.season - b.season);
        return acc;
      }, {} as SeasonalAPYChartData);
      setAllData(sortedData);
      setDisplayIndex(sortedData[APYWindow.MONTHLY].length - 1);
    }
  }, [apyData, allData]);

  useEffect(() => {
    if (apyTokens.length > 0 && !selectedToken) {
      setSelectedToken(apyTokens[0].address);
    }
  }, [apyTokens, selectedToken]);

  const handleChangeTimeTab = useCallback((tab: TimeTab) => {
    setTimeTab(tab);
    setAllData(null);
    setDisplayIndex(null);
  }, []);

  const handleChangeToken = useCallback((token: string) => {
    setSelectedToken(token);
    setAllData(null);
    setDisplayIndex(null);

    // The scroll position changes as a result of the state update + modal closing.
    // This restores the scroll position afterwards.
    const scrollPos = document.body.scrollTop;
    requestAnimationFrame(() => {
      document.body.scrollTop = scrollPos;
    });
  }, []);

  const maxValue = useMemo(() => {
    if (allData) {
      return Object.keys(allData).reduce((acc, w) => {
        return Math.max(0.13, acc, ...allData[w].map((d: SeasonalChartData) => d.value));
      }, 0);
    }
  }, [allData]);

  const chartData = useMemo<LineChartData[]>(() => {
    if (allData && maxValue !== undefined) {
      return APY_EMA_WINDOWS.reduce((acc, w) => {
        for (let i = 0; i < allData[w].length; i++) {
          acc[i] ??= {
            timestamp: allData[w][i].timestamp,
            values: [],
          };
          // Manipulate datapoints to visually improve the display. Chart will consider these datapoints as linear.
          acc[i].values.push(valueTransform.to(allData[w][i].value, maxValue));
        }
        return acc;
      }, [] as LineChartData[]);
    }
    return [];
  }, [allData, maxValue]);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (allData) {
        setDisplayIndex(index ?? allData[APYWindow.MONTHLY].length - 1);
      }
    },
    [allData],
  );

  const customValueTransform = useMemo<CustomChartValueTransform>(() => {
    return {
      to: (value: number) => valueTransform.to(value, maxValue ?? 0),
      from: (value: number) => valueTransform.from(value, maxValue ?? 0),
    };
  }, [maxValue]);

  return (
    <div className={cn("rounded-[20px] bg-gray-1", className)}>
      <div className="flex justify-between mb-1 pt-4 px-4 sm:pt-6 sm:px-6">
        <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
          <div className="flex items-center gap-1">
            <span>Deposited</span>
            <Select value={selectedToken} onValueChange={handleChangeToken}>
              <SelectTrigger className="rounded-full w-auto bg-transparent focus:ring-0 focus:ring-offset-0 mx-1 px-1.5 py-0 sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light">
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent>
                {apyTokens.map((token) => (
                  <SelectItem
                    className="cursor-pointer focus:bg-pinto-gray-2/60"
                    key={token.address}
                    value={token.address}
                    hideCheckmark
                  >
                    <div className="flex items-center gap-2">
                      <IconImage src={token.logoURI ?? ""} size={6} />
                      <span className="flex items-center leading-none mr-1">{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>vAPY</span>
          </div>
        </div>
        <TimeTabsSelector tab={timeTab} setTab={handleChangeTimeTab} context={analyticsContext} />
      </div>

      {(!allData || displayIndex === null) && (
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
              {seasonalApy.isLoading && !seasonalApy.isError && <FrameAnimator size={75} />}
              {seasonalApy.isError && (
                <>
                  <CloseIconAlt color={"red"} />
                  <div className="pinto-body text-pinto-green-3">An error has occurred</div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {allData && displayIndex !== null && (
        <>
          <div className="h-[85px] px-4 sm:px-6">
            <div className="pinto-body sm:pinto-h3">
              <span style={{ color: chartColors[0].lineColor }}>
                30D: {f.percent2dFormatter(allData[APYWindow.MONTHLY][displayIndex].value)}
              </span>
              <span className="mx-3 text-pinto-gray-2">|</span>
              <span style={{ color: chartColors[1].lineColor }}>
                7D: {f.percent2dFormatter(allData[APYWindow.WEEKLY][displayIndex].value)}
              </span>
              <span className="mx-3 text-pinto-gray-2">|</span>
              <span style={{ color: chartColors[2].lineColor }}>
                24H: {f.percent2dFormatter(allData[APYWindow.DAILY][displayIndex].value)}
              </span>
            </div>
            <div className="flex flex-col gap-0 mt-2 sm:gap-2 sm:mt-3">
              <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
                Season {allData[APYWindow.DAILY][displayIndex].season}
              </div>
              <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
                {formatDate(allData[APYWindow.DAILY][displayIndex].timestamp)}
              </div>
            </div>
          </div>
          <div className={size === "small" ? "aspect-3/1" : "aspect-6/1"}>
            {!chartData.length && !seasonalApy.isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="pinto-body-light">No data</div>
              </div>
            ) : (
              <div className="px-4 pt-4 pb-4 h-[300px]">
                <LineChart
                  data={chartData}
                  xKey="timestamp"
                  size={size}
                  makeLineGradients={strokeGradients}
                  valueFormatter={f.percent0dFormatter}
                  onMouseOver={handleMouseOver}
                  customValueTransform={customValueTransform}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default SeasonalAPYChart;
