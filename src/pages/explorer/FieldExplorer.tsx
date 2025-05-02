import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import {
  useSeasonalPodLine,
  useSeasonalPodRate,
  useSeasonalPodsHarvested,
  useSeasonalSownPinto,
  useSeasonalTemperature,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const FieldExplorer = () => {
  const [podRateTab, setPodRateTab] = useState(TimeTab.Week);
  const [tempTab, setTempTab] = useState(TimeTab.Week);
  const [podlineTab, setPodlineTab] = useState(TimeTab.Week);
  const [sownTab, setSownTab] = useState(TimeTab.Week);
  const [harvestedTab, setHarvestedTab] = useState(TimeTab.Week);

  const season = useSunData().current;

  const podRateData = useSeasonalPodRate(Math.max(0, season - tabToSeasonalLookback(podRateTab)), season);
  const tempData = useSeasonalTemperature(Math.max(0, season - tabToSeasonalLookback(tempTab)), season);
  const podIndexData = useSeasonalPodLine(Math.max(0, season - tabToSeasonalLookback(podlineTab)), season);
  const sownData = useSeasonalSownPinto(Math.max(0, season - tabToSeasonalLookback(sownTab)), season);
  const harvestData = useSeasonalPodsHarvested(Math.max(0, season - tabToSeasonalLookback(harvestedTab)), season);

  return (
    <>
      <SeasonalChart
        title="Pod Rate"
        size="large"
        fillArea
        activeTab={podRateTab}
        onChangeTab={setPodRateTab}
        useSeasonalResult={podRateData}
        valueFormatter={f.percent2dFormatter}
        tickValueFormatter={f.percent0dFormatter}
      />
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Max Temperature"
            size="small"
            activeTab={tempTab}
            onChangeTab={setTempTab}
            useSeasonalResult={tempData}
            valueFormatter={f.percent2dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Pod Line"
            size="small"
            fillArea
            activeTab={podlineTab}
            onChangeTab={setPodlineTab}
            useSeasonalResult={podIndexData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Sown Pinto"
            size="small"
            fillArea
            activeTab={sownTab}
            onChangeTab={setSownTab}
            useSeasonalResult={sownData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Pods Harvested"
            size="small"
            fillArea
            activeTab={harvestedTab}
            onChangeTab={setHarvestedTab}
            useSeasonalResult={harvestData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default FieldExplorer;
