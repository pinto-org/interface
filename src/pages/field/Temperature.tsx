import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSeasonalTemperature } from "@/state/seasonal/seasonalDataHooks";
import { useSeason } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const TemperatureChart = () => {
  const [tempTab, setTempTab] = useState(TimeTab.Week);
  const season = useSeason();
  const tempData = useSeasonalTemperature(Math.max(0, season - tabToSeasonalLookback(tempTab)), season);

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
      className="bg-pinto-off-white border border-pinto-gray-2 h-[423px] lg:h-[435px]"
      statVariant="non-colored"
    />
  );
};

export default TemperatureChart;
