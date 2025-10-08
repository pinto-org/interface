import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import {
  useSeasonalCultivationFactor,
  useSeasonalCultivationTemperature,
  useSeasonalPodLine,
  useSeasonalPodRate,
  useSeasonalPodsHarvested,
  useSeasonalSoilDemand,
  useSeasonalSoilSupply,
  useSeasonalSownPinto,
  useSeasonalTemperature,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { calculateTemperatureYAxisRanges } from "@/utils/chartUtils";
import { chartFormatters as f } from "@/utils/format";
import React, { useState, useMemo } from "react";
import FieldTemperatureBarChart from "../field/FieldTemperatureBarChart";

const FieldExplorer = () => {
  const season = useSunData().current;

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <FieldTemperatureBarChart variant="explorer" />
        </div>
        <div className="w-full sm:w-1/2">
          <PodRateChart season={season} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <MaxTempChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <PodLineChart season={season} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SownPintoChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <PodsHarvestedChart season={season} />
        </div>
      </div>
      <SoilSupplyChart season={season} />
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <CultivationFactorChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <CultivationTempChart season={season} />
        </div>
      </div>
    </>
  );
};
export default FieldExplorer;

interface ISeason {
  season: number;
}

const useTimeTabs = (chartId: string) => useSharedTimeTab(chartId);

const PodRateChart = React.memo(({ season }: ISeason) => {
  const [podRateTab, setPodRateTab] = useTimeTabs("podRate");

  const podRateData = useSeasonalPodRate(Math.max(0, season - tabToSeasonalLookback(podRateTab)), season);

  return (
    <SeasonalChart
      title="Pod Rate"
      tooltip="The ratio of Unharvestable Pods per Pinto. The Pod Rate is used by Pinto as a proxy for its health."
      size="small"
      fillArea
      activeTab={podRateTab}
      onChangeTab={setPodRateTab}
      useSeasonalResult={podRateData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      analyticsContext={{
        chart_id: "podRate",
        chart_title: "Pod Rate",
        explorer_tab: "field",
      }}
    />
  );
});

const MaxTempChart = React.memo(({ season }: ISeason) => {
  const [tempTab, setTempTab] = useTimeTabs("maxTemp");

  const tempData = useSeasonalTemperature(Math.max(0, season - tabToSeasonalLookback(tempTab)), season);

  // Calculate appropriate Y-axis ranges for temperature data
  const yAxisRanges = useMemo(() => {
    return calculateTemperatureYAxisRanges(tempData.data);
  }, [tempData.data]);

  return (
    <SeasonalChart
      title="Max Temperature"
      tooltip="The maximum interest rate for Sowing Pinto."
      size="small"
      activeTab={tempTab}
      onChangeTab={setTempTab}
      useSeasonalResult={tempData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      yAxisRanges={yAxisRanges}
      analyticsContext={{
        chart_id: "maxTemp",
        chart_title: "Max Temperature",
        explorer_tab: "field",
      }}
    />
  );
});

const PodLineChart = React.memo(({ season }: ISeason) => {
  const [podlineTab, setPodlineTab] = useTimeTabs("podLine");

  const podIndexData = useSeasonalPodLine(Math.max(0, season - tabToSeasonalLookback(podlineTab)), season);

  return (
    <SeasonalChart
      title="Pod Line"
      tooltip="The total number of Unharvestable Pods."
      size="small"
      fillArea
      activeTab={podlineTab}
      onChangeTab={setPodlineTab}
      useSeasonalResult={podIndexData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "podLine",
        chart_title: "Pod Line",
        explorer_tab: "field",
      }}
    />
  );
});

const SownPintoChart = React.memo(({ season }: ISeason) => {
  const [sownTab, setSownTab] = useTimeTabs("sownPinto");

  const sownData = useSeasonalSownPinto(Math.max(0, season - tabToSeasonalLookback(sownTab)), season);

  return (
    <SeasonalChart
      title="Sown Pinto"
      tooltip="The total number of Pinto Sown."
      size="small"
      fillArea
      activeTab={sownTab}
      onChangeTab={setSownTab}
      useSeasonalResult={sownData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "sownPinto",
        chart_title: "Sown Pinto",
        explorer_tab: "field",
      }}
    />
  );
});

const PodsHarvestedChart = React.memo(({ season }: ISeason) => {
  const [harvestedTab, setHarvestedTab] = useTimeTabs("podsHarvested");

  const harvestData = useSeasonalPodsHarvested(Math.max(0, season - tabToSeasonalLookback(harvestedTab)), season);

  return (
    <SeasonalChart
      title="Pods Harvested"
      tooltip="The total number of Pods Harvested."
      size="small"
      fillArea
      activeTab={harvestedTab}
      onChangeTab={setHarvestedTab}
      useSeasonalResult={harvestData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "podsHarvested",
        chart_title: "Pods Harvested",
        explorer_tab: "field",
      }}
    />
  );
});

const CultivationFactorChart = React.memo(({ season }: ISeason) => {
  const [cultivationTab, setCultivationTab] = useTimeTabs("cultivationFactor");

  const cultivationData = useSeasonalCultivationFactor(
    Math.max(0, season - tabToSeasonalLookback(cultivationTab)),
    season,
  );

  return (
    <SeasonalChart
      title="Cultivation Factor"
      tooltip="Protocol Controlled Value to control soil issuance"
      size="small"
      activeTab={cultivationTab}
      onChangeTab={setCultivationTab}
      useSeasonalResult={cultivationData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      analyticsContext={{
        chart_id: "cultivationFactor",
        chart_title: "Cultivation Factor",
        explorer_tab: "field",
      }}
    />
  );
});

const SoilSupplyChart = React.memo(({ season }: ISeason) => {
  const [soilSupplyTab, setSoilSupplyTab] = useTimeTabs("soilSupply");

  const soilSupplyData = useSeasonalSoilSupply(Math.max(0, season - tabToSeasonalLookback(soilSupplyTab)), season);

  return (
    <SeasonalChart
      title="Soil Supply per Season"
      tooltip="The amount of Soil available for Sowing each Season."
      size="large"
      fillArea
      activeTab={soilSupplyTab}
      onChangeTab={setSoilSupplyTab}
      useSeasonalResult={soilSupplyData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "soilSupply",
        chart_title: "Soil Supply per Season",
        explorer_tab: "field",
      }}
    />
  );
});

const CultivationTempChart = React.memo(({ season }: ISeason) => {
  const [cultivationTempTab, setCultivationTempTab] = useTimeTabs("cultivationTemp");

  const cultivationTempData = useSeasonalCultivationTemperature(
    Math.max(0, season - tabToSeasonalLookback(cultivationTempTab)),
    season,
  );

  return (
    <SeasonalChart
      title="Cultivation Temperature"
      tooltip="The Max Temperature when Soil is selling out and demand for Soil is increasing."
      size="small"
      activeTab={cultivationTempTab}
      onChangeTab={setCultivationTempTab}
      useSeasonalResult={cultivationTempData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      analyticsContext={{
        chart_id: "cultivationTemp",
        chart_title: "Cultivation Temperature",
        explorer_tab: "field",
      }}
    />
  );
});
