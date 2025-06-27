import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSeasonalTemperature } from "@/state/seasonal/seasonalDataHooks";
import { useSeason } from "@/state/useSunData";
import { calculateTemperatureYAxisRanges } from "@/utils/chartUtils";
import { chartFormatters as f } from "@/utils/format";
import { cn } from "@/utils/utils";
import { useMemo, useState } from "react";

interface ITemperatureChartProps {
  chartWrapperClassName?: string;
  className?: string;
}

const TemperatureChart = ({ chartWrapperClassName, className }: ITemperatureChartProps) => {
  const [tempTab, setTempTab] = useState(TimeTab.Week);
  const season = useSeason();
  const tempData = useSeasonalTemperature(Math.max(0, season - tabToSeasonalLookback(tempTab)), season);

  // Calculate appropriate Y-axis ranges for temperature data
  const yAxisRanges = useMemo(() => {
    return calculateTemperatureYAxisRanges(tempData.data);
  }, [tempData.data]);

  return (
    <SeasonalChart
      title="Max Temperature"
      size="large"
      fillArea
      activeTab={tempTab}
      onChangeTab={setTempTab}
      useSeasonalResult={tempData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      className={cn("bg-pinto-off-white border border-pinto-gray-2 h-[423px] lg:h-[435px]", className)}
      statVariant="non-colored"
      chartWrapperClassName={chartWrapperClassName}
      yAxisRanges={yAxisRanges}
    />
  );
};

export default TemperatureChart;
