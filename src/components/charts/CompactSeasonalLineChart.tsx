import { CloseIconAlt } from "@/components/Icons";
import FrameAnimator from "@/components/LoadingSpinner.tsx";
import IconImage from "@/components/ui/IconImage";
import { useNormalizeMayMultipleSeasonalData } from "@/state/seasonal/utils";
import { formatDate } from "@/utils/format";
import { UseSeasonalResult } from "@/utils/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LineChartData, MakeGradientFunction } from "./LineChart";
import MultiAxisLineChart, { MultiAxisYAxisConfig } from "./MultiAxisLineChart";
import { SeasonalChartData } from "./SeasonalChart";
import { TimeTab } from "./TimeTabs";
import { gradientFunctions, metallicMorningStrokeGradientFn } from "./chartHelpers";

interface CompactSeasonalChartProps {
  titles: (string | JSX.Element)[];
  size: "small" | "large";
  activeTab: TimeTab;
  onChangeTab: (tab: TimeTab) => void;
  useSeasonalResult: UseSeasonalResult[];
  valueFormatter: ((value: number) => string)[];
  tickValueFormatter?: ((value: number) => string)[];
  borderFunctions?: (MakeGradientFunction | string)[];
  areaFunctions?: (MakeGradientFunction | string)[];
  className?: string;
  hideXTicks?: boolean;
  hideYTicks?: boolean;
  token?: { logoURI: string; symbol: string };
}

const gradients = [gradientFunctions.metallicGreen, metallicMorningStrokeGradientFn];

const CompactSeasonalLineChart = ({
  titles,
  size,
  useSeasonalResult,
  valueFormatter,
  tickValueFormatter,
  borderFunctions,
  areaFunctions,
  className,
  hideXTicks,
  hideYTicks,
  token,
}: CompactSeasonalChartProps) => {
  const [allData, setAllData] = useState<SeasonalChartData[][] | null>(null);
  const [displayData, setDisplayData] = useState<SeasonalChartData[] | null>(null);
  const [didLoad, setDidLoad] = useState(false);

  const { isLoading, isError, data: inputData } = useNormalizeMayMultipleSeasonalData(useSeasonalResult);

  useEffect(() => {
    if (isLoading && !didLoad && useSeasonalResult.every((r) => !!r.data)) {
      setDidLoad(true);
    }
  }, [isLoading, didLoad, useSeasonalResult]);

  useEffect(() => {
    if (!inputData) return;
    if (!allData || !inputData.every((r, i) => r.length === allData?.[i]?.length)) {
      setAllData(inputData);
      setDisplayData(inputData.map((data) => data[data.length - 1]));
    }
  }, [inputData, allData]);

  const chartData = useMemo<LineChartData[][]>(() => {
    if (!allData) return [];
    return allData.map((d) =>
      d.map((d) => ({
        values: [d.value],
        timestamp: d.timestamp,
      })),
    );
  }, [allData]);

  const handleMouseOver = useCallback(
    (index: number | undefined) => {
      if (allData) {
        setDisplayData(allData.map((data) => data[index ?? data.length - 1] ?? data[data.length - 1]));
      }
    },
    [allData],
  );

  const minmax = useMemo(() => {
    let min: number = Infinity;
    let max: number = -Infinity;

    for (const data of allData ?? []) {
      min = Math.min(min, ...data.map((result) => result.value));
      max = Math.max(max, ...data.map((result) => result.value));
    }

    const delta = max - min;
    if (delta < 0.05) {
      return {
        min: min - 0.0001,
        max: max + 0.0001,
      };
    }

    return { min: min * 0.99, max: max * 1.01 };
  }, [allData]);

  const data = useMemo(() => {
    const labels = (allData?.[0] ?? []).map((result) => result.timestamp);

    return {
      datasets: (allData ?? []).map((result, i) => ({
        values: result.map((d) => d.value),
        yAxisID: `y${i + 1}`,
        label: labels[i],
      })),
      labels: labels,
      yAxisConfigs: (allData ?? []).map((data, i) => ({
        id: `y${i + 1}`,
        position: i === 0 ? "left" : ("right" as NonNullable<MultiAxisYAxisConfig["position"]>),
        min: minmax.min,
        max: minmax.max,
        ticksCallback: tickValueFormatter?.[i],
      })),
    };
  }, [allData, minmax]);

  return (
    <div className={className}>
      <div className="flex flex-col w-full gap-2">
        {titles.map((title, i) => (
          <div key={`compact-seasonal-line-${i}`} className="flex flex-row items-center justify-between">
            {typeof title === "string" ? (
              <span key={i} className="pinto-sm-light text-pinto-primary">
                {title}
              </span>
            ) : (
              title
            )}
            <div className="flex flex-row items-center gap-1 self-start">
              {token && <IconImage src={token.logoURI} size={4} alt={token.symbol} />}
              <span className="pinto-sm font-normal text-right">
                {displayData?.[i]?.value ? valueFormatter[i]?.(displayData?.[i]?.value) : "--"}
              </span>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-1 pinto-xs font-light text-pinto-light">
          <span>Season {displayData?.[0]?.season}</span>
          <span>{displayData?.[0]?.timestamp ? formatDate(displayData[0].timestamp) : "--"}</span>
        </div>
      </div>
      {!allData && !displayData && (
        <>
          {/* Keep sizing the same as when there is data. Allows centering spinner/error vertically */}
          <div className={`${size === "small" ? "aspect-3/1" : "aspect-6/1"} pt-4`}>
            <div className="relative w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center h-40 sm:h-52 box-border">
                {!didLoad || (isLoading && !isError) ? (
                  <FrameAnimator size={75} />
                ) : isError ? (
                  <>
                    <CloseIconAlt color={"red"} />
                    <div className="pinto-body text-pinto-green-3">An error has occurred</div>
                  </>
                ) : !isError && !isLoading && didLoad ? (
                  <div className="pinto-body-light text-pinto-light">Insufficient data</div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
      {allData && displayData && (
        <>
          <div className={size === "small" ? "aspect-3/1" : "aspect-6/1"}>
            {!chartData?.every((d) => d.length > 1) && !isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="pinto-body-light text-pinto-light">Insufficient data</div>
              </div>
            ) : (
              <div className="pt-4">
                <div className="h-40 sm:h-52 box-border">
                  <MultiAxisLineChart
                    {...data}
                    size={size}
                    onMouseOver={handleMouseOver}
                    tickConfig={{
                      hideXTicks: hideXTicks,
                      hideYTicks: hideYTicks,
                    }}
                    xKey="timestamp"
                    makeLineGradients={borderFunctions ?? gradients}
                    makeAreaGradients={areaFunctions}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default CompactSeasonalLineChart;
