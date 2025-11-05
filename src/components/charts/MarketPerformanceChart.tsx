import { SMPChartType, useSeasonalMarketPerformance } from "@/state/seasonal/queries/useSeasonalMarketPerformance";
import useTokenData from "@/state/useTokenData";
import { chartFormatters as f, formatDate } from "@/utils/format";
import { getChainTokenMap } from "@/utils/token";
import { SeasonalMarketPerformanceChartData, Token } from "@/utils/types";
import { cn, truncSeconds } from "@/utils/utils";
import { subMonths, subWeeks } from "date-fns";
import { IRange, Time } from "lightweight-charts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import CalendarButton, { DatePresetConfig } from "../CalendarButton";
import { CloseIconAlt } from "../Icons";
import FrameAnimator from "../LoadingSpinner";
import TooltipSimple from "../TooltipSimple";
import IconImage from "../ui/IconImage";
import { Separator } from "../ui/Separator";
import LineChart, { LineChartData } from "./LineChart";
import { StrokeGradientFunction, gradientFunctions } from "./chartHelpers";

// Predefined date ranges
const DATE_PRESETS: Record<Exclude<string, "CUSTOM">, DatePresetConfig> = {
  Week: { from: () => truncSeconds(subWeeks(new Date(), 1)), to: () => truncSeconds(new Date()) },
  Month: { from: () => truncSeconds(subMonths(new Date(), 1)), to: () => truncSeconds(new Date()) },
  All: { from: () => truncSeconds(new Date("2024-11-01")), to: () => truncSeconds(new Date()) },
};

enum DataType {
  PRICE = "PRICE",
  USD = "USD",
  PERCENT = "PERCENT",
}

const getDataTypeInfo = (type: DataType): { display: string; chartType: SMPChartType } => {
  switch (type) {
    case DataType.PRICE:
      return { display: "PRICE", chartType: SMPChartType.TOKEN_PRICES };
    case DataType.USD:
      return { display: "∆USD", chartType: SMPChartType.USD_CUMULATIVE };
    case DataType.PERCENT:
      return { display: "∆%", chartType: SMPChartType.PERCENT_CUMULATIVE };
    default:
      throw new Error(`Invalid data type: ${type}`);
  }
};

interface MarketPerformanceChartProps {
  season: number;
  size: "small" | "large" | "huge";
  className?: string;
}

type ChartDataset = {
  chartData: LineChartData[];
  // For the NET datapoint, there will be no token
  tokens: (Token | undefined)[];
  chartStrokeGradients: StrokeGradientFunction[];
};

// Use different formatters/precision for different price value ranges
const priceDisplayFormatter = (v: number) => {
  if (v > 10000) {
    return f.largePriceFormatter({ decimals: 2, uppercase: true })(v);
  } else if (v > 10) {
    return f.price2dFormatter(v);
  }
  return f.price6dFormatter(v);
};

// Linear transform that maps values from [min,max] to [0,1]
const transformValue = (v: number, min: number, max: number, range: [number, number]): number => {
  // Handle edge cases
  if (v <= min) return range[0];
  if (v >= max) return range[1];

  // Linear interpolation between min and max. Keep away from the bottom/top of the chart canvas with a small buffer.
  return range[0] + (range[1] - range[0]) * ((v - min) / (max - min));
};

const MarketPerformanceChart = ({ season, size, className }: MarketPerformanceChartProps) => {
  const chainId = useChainId();
  const mainToken = useTokenData().mainToken;
  const [allData, setAllData] = useState<SeasonalMarketPerformanceChartData | null>(null);
  const [displayIndex, setDisplayIndex] = useState<number | null>(null);
  const [dataType, setDataType] = useState<DataType>(DataType.PRICE);

  const [timePeriod, setTimePeriod] = useState<IRange<Time> | undefined>();
  // Convert the selected time period to season numbers
  const [fromSeason, toSeason] = useMemo(() => {
    if (timePeriod) {
      const currentSeasonTime = new Date();
      currentSeasonTime.setMinutes(0, 0, 0);
      // Assume 1 hour = 1 season and the current season began this hour. Acceptable assumption in practice.
      const hoursDiffFrom = Math.ceil(
        (currentSeasonTime.getTime() - new Date(timePeriod.from.valueOf() as number).getTime()) / (1000 * 60 * 60),
      );
      const hoursDiffTo = Math.ceil(
        (currentSeasonTime.getTime() - new Date(timePeriod.to.valueOf() as number).getTime()) / (1000 * 60 * 60),
      );
      return [
        Math.min(season, Math.max(0, season - hoursDiffFrom)),
        Math.min(season, Math.max(0, season - hoursDiffTo)),
      ];
    }
    return [Math.max(0, season - 168), season];
  }, [timePeriod, season]);

  const seasonalPerformance = useSeasonalMarketPerformance(fromSeason, toSeason, getDataTypeInfo(dataType).chartType);
  const data = !seasonalPerformance.isLoading && seasonalPerformance.data;

  useEffect(() => {
    if (data && !allData) {
      // Filter out USDC
      const { USDC, ...rest } = data;
      setAllData(rest);
      setDisplayIndex(data.NET.length - 1);
    }
  }, [data, allData]);

  const [minValues, maxValues] = useMemo(() => {
    if (allData) {
      return [
        Object.keys(allData).reduce((acc, token) => {
          acc[token] = Math.min(...allData[token].map((d) => d.value));
          return acc;
        }, {}),
        Object.keys(allData).reduce((acc, token) => {
          acc[token] = Math.max(...allData[token].map((d) => d.value));
          return acc;
        }, {}),
      ];
    }
    return [{}, {}];
  }, [allData]);

  // For the price chart, calculate the high/low value that each token can transform to.
  // Larger percent moves are able to take up more of the vertical space.
  const priceTransformRanges = useMemo(() => {
    if (dataType === DataType.PRICE && Object.keys(minValues).length > 0) {
      let maxSwing = 0;
      const percentSwings = {};
      for (const token in minValues) {
        const min = minValues[token];
        const max = maxValues[token];
        const pct = (max - min) / min;
        percentSwings[token] = pct;
        maxSwing = Math.max(maxSwing, pct);
      }

      const result = {};
      const maxRange = [0.01, 0.99];
      const mid = (maxRange[0] + maxRange[1]) / 2;
      for (const token in percentSwings) {
        const relativeSwing = percentSwings[token] / maxSwing;
        result[token] = [mid - (mid - maxRange[0]) * relativeSwing, mid + (maxRange[1] - mid) * relativeSwing];
      }
      return result;
    }
    return {};
  }, [dataType, minValues, maxValues]);

  const chartDataset = useMemo<ChartDataset>(() => {
    if (allData) {
      const tokenConfig = Object.values(getChainTokenMap(chainId));

      const chartData: LineChartData[] = [];
      const tokens: (Token | undefined)[] = [];
      const chartStrokeGradients: StrokeGradientFunction[] = [];
      for (const token of ["NET", "WETH", "cbETH", "cbBTC", "WSOL"]) {
        for (let i = 0; i < allData[token].length; i++) {
          chartData[i] ??= {
            timestamp: allData[token][i].timestamp,
            values: [],
          };
          if (dataType !== DataType.PRICE) {
            chartData[i].values.push(allData[token][i].value);
          } else {
            chartData[i].values.push(
              transformValue(allData[token][i].value, minValues[token], maxValues[token], priceTransformRanges[token]),
            );
          }
        }
        const tokenObj = tokenConfig.find((t) => t.symbol === token);
        tokens.push(tokenObj);
        chartStrokeGradients.push(gradientFunctions.solid(tokenObj?.color ?? "green"));
      }
      return {
        chartData,
        tokens,
        chartStrokeGradients,
      };
    }
    return { chartData: [], tokens: [], chartStrokeGradients: [] };
  }, [dataType, allData, chainId, minValues, maxValues, priceTransformRanges]);

  const handleChangeDataType = useCallback((type: DataType) => {
    setDataType(type);
    setAllData(null);
    setDisplayIndex(null);
  }, []);

  const handleChangeTimeSelect = useCallback((range: IRange<Time>) => {
    setTimePeriod(range);
    setAllData(null);
    setDisplayIndex(null);
  }, []);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (allData) {
        setDisplayIndex(index ?? allData.NET.length - 1);
      }
    },
    [allData],
  );

  const displayValueFormatter =
    dataType === DataType.PRICE
      ? priceDisplayFormatter
      : dataType === DataType.USD
        ? f.largePriceFormatter({ decimals: 3, min: 1000000, uppercase: true })
        : f.percent3dFormatter;
  const chartValueFormatter =
    dataType === DataType.PRICE
      ? f.price0dFormatter
      : dataType === DataType.USD
        ? f.price0dFormatter
        : f.percent0dFormatter;

  const hoverPointIcons = useMemo(() => {
    return [mainToken.logoURI, ...chartDataset.tokens.map((t) => t?.logoURI).slice(1)];
  }, [mainToken.logoURI, chartDataset.tokens]);

  return (
    <div className={cn("rounded-[20px] bg-gray-1", className)}>
      <div className="flex justify-between pt-4 px-4 mb-3 sm:pt-6 sm:px-6">
        <div className="flex flex-row gap-1 items-center">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light flex-1">Crypto Market Performance</div>
          <TooltipSimple
            content="Measures historical fluctuations of non-Pinto value in the ecosystem."
            variant="gray"
          />
          <div className="ml-4 flex items-center gap-1 bg-gray-2 rounded-lg p-0.5 border border-pinto-gray-2">
            {Object.values(DataType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChangeDataType(type)}
                className={cn(
                  "sm:px-3 pt-0.5 rounded-md text-sm transition-all duration-500 min-w-14",
                  dataType === type
                    ? "bg-pinto-green-3 text-white shadow-sm"
                    : "text-pinto-gray-2 hover:text-pinto-light hover:bg-gray-1/50",
                )}
              >
                {getDataTypeInfo(type).display}
              </button>
            ))}
          </div>
        </div>
        <CalendarButton
          setTimePeriod={handleChangeTimeSelect}
          datePresets={DATE_PRESETS}
          defaultPreset="Week"
          storageKeyPrefix="marketPerformanceChart"
        />
      </div>
      {!allData || displayIndex === null ? (
        <div
          className={`relative w-full flex items-center justify-center ${size === "small" || size === "huge" ? "aspect-3/1" : "aspect-6/1"}`}
          style={{
            paddingBottom: `calc(85px + ${size === "small" || size === "huge" ? "33.33%" : "16.67%"})`,
            height: size === "huge" ? 550 + 85 : 300 + 85,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {seasonalPerformance.isLoading && !seasonalPerformance.isError && <FrameAnimator size={75} />}
            {seasonalPerformance.isError && (
              <>
                <CloseIconAlt color={"red"} />
                <div className="pinto-body text-pinto-green-3">An error has occurred</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="h-[85px] px-4 sm:px-6 flex flex-col gap-2 sm:flex-row justify-between">
            <div className="flex flex-col gap-0 sm:gap-2">
              <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
                Season {allData.NET[displayIndex].season}
              </div>
              <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light">
                {formatDate(allData.NET[displayIndex].timestamp)}
              </div>
            </div>
            <div className="pinto-sm sm:pinto-body lg:pinto-h3">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-x-0 sm:gap-y-0 sm:flex sm:flex-row sm:items-center">
                {chartDataset.tokens.map((token, idx) => {
                  const tokenSymbol = token?.symbol ?? "NET";
                  const isNetToken = tokenSymbol === "NET";
                  return (
                    <div
                      key={`${tokenSymbol}-value`}
                      className={`flex items-center justify-between ${isNetToken ? "col-span-2 lg:col-span-1" : ""}`}
                    >
                      {token && (
                        <>
                          <IconImage
                            src={token.logoURI}
                            size={8}
                            mobileSize={4}
                            alt={token.symbol}
                            className="hidden lg:inline-block"
                          />
                          <IconImage
                            src={token.logoURI}
                            size={6}
                            mobileSize={4}
                            alt={token.symbol}
                            className="inline-block lg:hidden"
                          />
                        </>
                      )}
                      <div style={{ color: token?.color }} className={`${!token?.color && "text-pinto-green-3"}`}>
                        {tokenSymbol === "NET" && "Total: "}
                        <p className="inline-block w-[7.1ch] text-right">
                          {displayValueFormatter(allData[tokenSymbol][displayIndex].value)}
                        </p>
                      </div>
                      {idx < Object.keys(allData).length - 1 && (
                        <Separator
                          className="hidden sm:flex h-[1.5rem] w-[0.5px] lg:h-[2rem] sm:mx-2 lg:mx-4"
                          orientation={"vertical"}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={size === "small" || size === "huge" ? "aspect-3/1" : "aspect-6/1"}>
            {!chartDataset.chartData.length && !seasonalPerformance.isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="pinto-body-light">No data</div>
              </div>
            ) : (
              <div className={`px-4 pt-4 pb-4 ${size === "huge" ? "h-[550px]" : "h-[300px]"}`}>
                <LineChart
                  data={chartDataset.chartData}
                  xKey="timestamp"
                  size={"small"}
                  makeLineGradients={chartDataset.chartStrokeGradients}
                  valueFormatter={chartValueFormatter}
                  onMouseOver={handleMouseOver}
                  hideYAxis={dataType === DataType.PRICE}
                  hoverPointImages={hoverPointIcons}
                  {...(dataType === DataType.PRICE && { yAxisMin: 0, yAxisMax: 1 })}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default MarketPerformanceChart;
