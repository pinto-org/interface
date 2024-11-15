import SeasonalChart, { tabToSeasonalLookback, TimeTab } from "@/components/charts/SeasonalChart";
import {
  useSeasonalPodIndex,
  useSeasonalPodRate,
  useSeasonalPodsHarvested,
  useSeasonalSownPinto,
  useSeasonalTemperature,
} from "@/state/seasonal/seasonalDataHooks";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const FieldExplorer = () => {
  const [podRateTab, setPodRateTab] = useState(TimeTab.Week);
  const [tempTab, setTempTab] = useState(TimeTab.Week);
  const [podlineTab, setPodlineTab] = useState(TimeTab.Week);
  const [sownTab, setSownTab] = useState(TimeTab.Week);
  const [harvestedTab, setHarvestedTab] = useState(TimeTab.Week);

  // const season = useSunData().current; // TODO(ss): put this back eventually
  const season = 25968;

  const podRateData = useSeasonalPodRate(Math.max(0, season - tabToSeasonalLookback(podRateTab)), season);
  const tempData = useSeasonalTemperature(Math.max(0, season - tabToSeasonalLookback(tempTab)), season);
  const podIndexData = useSeasonalPodIndex(Math.max(0, season - tabToSeasonalLookback(podlineTab)), season);
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
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Max Temperature"
            size="small"
            activeTab={tempTab}
            onChangeTab={setTempTab}
            useSeasonalResult={tempData}
            valueFormatter={f.percent0dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
        <div className="w-1/2">
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
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
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
        <div className="w-1/2">
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
