import { Col, Row } from "@/components/Container";
import TextSkeleton from "@/components/TextSkeleton";
import BarChart from "@/components/charts/BarChart";
import TimeTabsSelector, { TimeTab } from "@/components/charts/TimeTabs";
import { Card } from "@/components/ui/Card";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import useBucketedFieldPlotSummary, {
  AggregatedFieldPlotsSummary,
  aggregateFieldPlotBucketSummary,
  FieldPlotBucketSummary,
} from "@/state/useBucketedFieldPlotSummary";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter, numberAbbr } from "@/utils/format";
import { useDebounceValue } from "@/utils/useDebounce";
import { cn, exists } from "@/utils/utils";
import { ChartData } from "chart.js";
import React, { useCallback, useEffect, useState } from "react";

type FieldTemperatureBarChartProps = {
  className?: string;
  // borderless?: boolean;
  variant?: "default" | "explorer";
};

// 50k is the default
const BUCKET_SIZE = 50_000;

const FieldTemperatureBarChart = React.memo(({ className, variant = "default" }: FieldTemperatureBarChartProps) => {
  // global state
  const harvestableIndex = useHarvestableIndex();

  // local State
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [explorerTab, setExplorerTab] = useSharedTimeTab("fieldTemperature", TimeTab.AllTime);
  const [localTab, setLocalTab] = useState<TimeTab>(TimeTab.AllTime);

  const [tab, setTab] = variant === "explorer" ? [explorerTab, setExplorerTab] : [localTab, setLocalTab];

  const handleSelect = useCallback(
    (data: FieldPlotBucketSummary[] | undefined) => {
      let datas: FieldPlotBucketSummary[] = [];

      if (data && harvestableIndex.gt(0)) {
        const maxLookback = getTimestampLookback(tab);
        const filtered = data.filter((d) => d.startTimestamp > maxLookback);

        datas = filtered.map((d) => ({
          ...d,
          startIndex: d.startIndex.sub(harvestableIndex),
          endIndex: d.endIndex.sub(harvestableIndex),
        }));
      }

      return aggregateFieldPlotBucketSummary(datas);
    },
    [harvestableIndex, tab],
  );

  // queries
  const { data: summaryData, ...query } = useBucketedFieldPlotSummary<AggregatedFieldPlotsSummary>({
    bucketSize: BUCKET_SIZE,
    select: handleSelect,
  });

  // Transform the data to be used in the chart
  const chartData = useTransformBucketedFieldPlotSummary(summaryData?.data);

  // derived state
  const isLoading = query.isLoading || harvestableIndex.lte(0);

  // Debounce the active index to prevent too many re-renders
  const debouncedActiveIndex = useDebounceValue(activeIndex, 10);

  const summary = exists(debouncedActiveIndex) ? summaryData?.data[debouncedActiveIndex] : summaryData;

  const startIndex = summary?.startIndex.toNumber() ?? 0;
  const endIndex = summary?.endIndex.toNumber() ?? 0;

  const activeData = summary?.avgTemperature?.toNumber();

  const decimals = getDiffDecimals(startIndex, endIndex, exists(debouncedActiveIndex));

  return (
    <Card className={cn("overflow-hidden", variant === "explorer" && "border-none bg-transparent")}>
      <Col className="gap-0">
        <Row className="w-full justify-between pt-4 px-4 sm:pt-6 sm:px-6 gap-2">
          <Col className="gap-1">
            <div
              className={cn(
                "pinto-sm sm:pinto-body",
                variant === "explorer" && "sm:pinto-body text-pinto-light sm:text-pinto-light",
              )}
            >
              Avg Sown Temperature
            </div>
            <Col className={cn("gap-1 pb-4 sm:pb-4", variant === "explorer" && "h-[85px]")}>
              <TextSkeleton
                loading={isLoading || !exists(activeData)}
                height="body"
                desktopHeight="h3"
                className="w-24"
              >
                <div
                  className={cn(
                    "pinto-body sm:pinto-h3",
                    variant === "explorer" && "text-pinto-green-3 sm:text-pinto-green-3",
                  )}
                >
                  {formatter.pct(activeData)}
                </div>
              </TextSkeleton>
              <TextSkeleton loading={isLoading} height="sm" className="w-56">
                <div
                  className={cn(
                    "pinto-sm",
                    variant === "explorer" && "pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light",
                  )}
                >
                  between {numberAbbr(startIndex, decimals)} and {numberAbbr(endIndex, decimals)}
                </div>
              </TextSkeleton>
            </Col>
          </Col>
          <div className="self-start sm:pt-1 shrink-0">
            <TimeTabsSelector tab={tab} setTab={setTab} />
          </div>
        </Row>
        <Col
          className={cn(
            "h-[250px] sm:h-[435px] w-full px-2 sm:px-4 pb-2 sm:pb-4",
            variant === "explorer" && "h-[300px] sm:h-[300px] mt-1",
            className,
          )}
        >
          <div className="mx-2 h-full">
            {/*
             * Bar Chart is memoized, so no need to separate this from the stats section
             */}
            <BarChart
              data={chartData}
              isLoading={isLoading}
              onMouseOver={setActiveIndex}
              yLabelFormatter={formatY}
              xLabelFormatter={formatX}
            />
          </div>
        </Col>
      </Col>
    </Card>
  );
});

export default FieldTemperatureBarChart;

const formatY = (value: number | string) => {
  const asNum = typeof value === "number" ? value : Number(value);
  return formatter.pct(asNum, { minDecimals: 0, maxDecimals: 0 });
};

const formatX = (value: number | string) => {
  const asNum = typeof value === "number" ? value : Number(value);
  return numberAbbr(asNum * 1_000_000, 0);
};

const DAY_MS = 1000 * 60 * 60 * 24;
const WEEK_MS = DAY_MS * 7;
const MONTH_MS = DAY_MS * 30;

const getTimestampLookback = (timeTab: TimeTab) => {
  const now = new Date().getTime();

  switch (timeTab) {
    case TimeTab.Week:
      return now - WEEK_MS;
    case TimeTab.Month:
      return now - MONTH_MS;
    default:
      return 0;
  }
};

const getDiffDecimals = (startIndex: number | undefined, endIndex: number | undefined, anySelected: boolean) => {
  if (!anySelected) return 2;
  if (!exists(startIndex) || !exists(endIndex) || startIndex === endIndex) return 0;
  const diff = endIndex - startIndex;
  switch (true) {
    case diff >= 1_000_000:
      return 0;
    case diff >= 500_000:
      return 1;
    default:
      return 2;
  }
};

const LOG_THRESHOLD = 5;
const MIN_VALUES = 3;

interface MinMax {
  min: number;
  max: number;
}

const noData: { labels: string[]; datasets: ChartData<"bar">["datasets"] } = {
  labels: [],
  datasets: [],
};
const useTransformBucketedFieldPlotSummary = (data: FieldPlotBucketSummary[] | undefined) => {
  const [transformedData, setTransformedData] = useState<ChartData<"bar">>(noData);

  useEffect(() => {
    if (!data?.length) {
      setTransformedData(noData);
    } else {
      const labels: string[] = [];
      const datasetData: number[] = [];

      for (const d of data) {
        const startIndex = d.startIndex.toNumber();
        const endIndex = d.endIndex.toNumber();
        const temp = d.avgTemperature.toNumber();

        if (temp > 0 && Number.isFinite(temp)) {
          labels.push(`${startIndex}-${endIndex}`);
          datasetData.push(temp);
        }
      }

      setTransformedData({
        labels,
        datasets: [{ data: datasetData }],
      });
    }
  }, [data]);

  return transformedData;
};
