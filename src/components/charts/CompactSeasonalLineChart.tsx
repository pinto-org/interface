import { CloseIconAlt } from "@/components/Icons";
import FrameAnimator from "@/components/LoadingSpinner.tsx";
import IconImage from "@/components/ui/IconImage";
import { SG_FETCH_DISABLED } from "@/constants/subgraph";
import { useNormalizeMayMultipleSeasonalData } from "@/state/seasonal/utils";
import { formatDate } from "@/utils/format";
import { UseSeasonalResult } from "@/utils/types";
import { useCallback, useMemo, useState } from "react";
import { MakeGradientFunction } from "./LineChart";
import MultiAxisLineChart, { MultiAxisYAxisConfig } from "./MultiAxisLineChart";
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
  noData?: boolean;
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
  // biome-ignore lint/complexity/noUselessTernary: nodata default when sg is down
  noData = SG_FETCH_DISABLED ? true : false,
}: CompactSeasonalChartProps) => {
  const [hoverIndex, setHoverIndex] = useState<number>();
  const { isLoading, isError, data: allData } = useNormalizeMayMultipleSeasonalData(useSeasonalResult);
  // Derive from the current query, including same-length updates and range changes.
  const displayData = !noData && !isError && !isLoading
    ? allData?.map((data) => data[hoverIndex ?? data.length - 1] ?? data[data.length - 1])
    : undefined;
  const handleMouseOver = useCallback((index: number | undefined) => setHoverIndex(index), []);

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
  }, [allData, minmax, tickValueFormatter]);

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
                {displayData?.[i]?.value !== undefined ? valueFormatter[i]?.(displayData[i].value) : "--"}
              </span>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-1 pinto-xs font-light text-pinto-light">
          <span>Season {displayData?.[0]?.season}</span>
          <span>{displayData?.[0]?.timestamp ? formatDate(displayData[0].timestamp) : "--"}</span>
        </div>
      </div>
      {(isLoading || isError || !allData || noData) && (
        <>
          {/* Keep sizing the same as when there is data. Allows centering spinner/error vertically */}
          <div className={`${size === "small" ? "aspect-3/1" : "aspect-6/1"} pt-4`}>
            <div className="relative w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center h-52 sm:h-52 box-border">
                {noData ? (
                  <div className="pinto-body-light text-pinto-light">Unable to load</div>
                ) : isError ? (
                  <>
                    <CloseIconAlt color={"red"} />
                    <div role="alert" className="pinto-body text-pinto-green-3">Historical data unavailable</div>
                  </>
                ) : isLoading ? (
                  <div role="status" aria-label="Loading historical data"><FrameAnimator size={75} /></div>
                ) : !isError && !isLoading && !allData ? (
                  <div className="pinto-body-light text-pinto-light">Insufficient data</div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
      {!noData && !isError && !isLoading && allData && displayData && (
        <>
          <div className={size === "small" ? "aspect-3/1" : "aspect-6/1"}>
            {!allData.every((d) => d.length > 1) ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="pinto-body-light text-pinto-light">Insufficient data</div>
              </div>
            ) : (
              <div className="pt-4">
                <div className="h-52 sm:h-52 box-border">
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
