import SeasonalAPYChart from "@/components/charts/SeasonalAPYChart";
import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import {
  useSeasonalAvgSeeds,
  useSeasonalBDV,
  useSeasonalL2SR,
  useSeasonalStalk,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import React from "react";
import { useState } from "react";

const SiloExplorer = () => {
  const season = useSunData().current;

  return (
    <>
      {/* For debugging, cant double comment out with the comment in the middle */}
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <TotalLiquidityChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <L2SRChart season={season} />
        </div>
      </div>
      {/* <AvgSeedsChart season={season} /> */}
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8 mt-8">
        <div className="w-full sm:w-1/2">
          <StalkSupplyChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <TotalDepositedPDVChart season={season} />
        </div>
      </div>
      <SeasonalAPYChart
        season={season}
        size="large"
        analyticsContext={{
          chart_id: "apy",
          chart_title: "APY Chart",
          explorer_tab: "silo",
        }}
      />
    </>
  );
};
export default SiloExplorer;

interface ISeason {
  season: number;
}

const useTimeTabs = (chartId: string) => useSharedTimeTab(chartId);

const TotalLiquidityChart = React.memo(({ season }: ISeason) => {
  const [liquidityTab, setLiquidityTab] = useTimeTabs("totalLiquidity");

  const liquidityData = useSeasonalTotalLiquidity(Math.max(0, season - tabToSeasonalLookback(liquidityTab)), season);

  return (
    <SeasonalChart
      title="Total Liquidity"
      tooltip="The total USD value of tokens in liquidity pools on the Minting Whitelist."
      size="small"
      fillArea
      activeTab={liquidityTab}
      onChangeTab={setLiquidityTab}
      useSeasonalResult={liquidityData}
      valueFormatter={f.price0dFormatter}
      tickValueFormatter={f.largePrice1dFormatter}
      analyticsContext={{
        chart_id: "totalLiquidity",
        chart_title: "Total Liquidity",
        explorer_tab: "silo",
      }}
    />
  );
});

const L2SRChart = React.memo(({ season }: ISeason) => {
  const [l2srTab, setL2srTab] = useTimeTabs("l2sr");

  const l2srData = useSeasonalL2SR(Math.max(9, season - tabToSeasonalLookback(l2srTab)), season);

  return (
    <SeasonalChart
      title="Liquidity to Supply ratio"
      tooltip="The ratio of Pinto in Liquidity Pools on the Minting Whitelist per outstanding Pinto."
      size="small"
      activeTab={l2srTab}
      onChangeTab={setL2srTab}
      useSeasonalResult={l2srData}
      valueFormatter={f.percent2dFormatter}
      tickValueFormatter={f.percent0dFormatter}
      analyticsContext={{
        chart_id: "l2sr",
        chart_title: "Liquidity to Supply ratio",
        explorer_tab: "silo",
      }}
    />
  );
});

const StalkSupplyChart = React.memo(({ season }: ISeason) => {
  const [stalkTab, setStalkTab] = useTimeTabs("stalkSupply");

  const stalkData = useSeasonalStalk(Math.max(0, season - tabToSeasonalLookback(stalkTab)), season);

  return (
    <SeasonalChart
      title="Stalk Supply"
      tooltip="The total number of Stalk."
      size="small"
      fillArea
      activeTab={stalkTab}
      onChangeTab={setStalkTab}
      useSeasonalResult={stalkData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "stalkSupply",
        chart_title: "Stalk Supply",
        explorer_tab: "silo",
      }}
    />
  );
});

const TotalDepositedPDVChart = React.memo(({ season }: ISeason) => {
  const [bdvTab, setBdvTab] = useTimeTabs("totalDepositedPDV");

  const bdvData = useSeasonalBDV(Math.max(0, season - tabToSeasonalLookback(bdvTab)), season);

  return (
    <SeasonalChart
      title="Total Deposited PDV"
      tooltip="The total PDV of tokens in liquidity pools on the Minting Whitelist."
      size="small"
      fillArea
      activeTab={bdvTab}
      onChangeTab={setBdvTab}
      useSeasonalResult={bdvData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumber1dFormatter}
      analyticsContext={{
        chart_id: "totalDepositedPDV",
        chart_title: "Total Deposited PDV",
        explorer_tab: "silo",
      }}
    />
  );
});

const AvgSeedsChart = React.memo(({ season }: ISeason) => {
  const [avgSeedsTab, setAvgSeedsTab] = useTimeTabs("avgSeeds");

  const avgSeedsData = useSeasonalAvgSeeds(Math.max(0, season - tabToSeasonalLookback(avgSeedsTab)), season);

  return (
    <SeasonalChart
      title="Average Seeds per PDV"
      size="large"
      activeTab={avgSeedsTab}
      onChangeTab={setAvgSeedsTab}
      useSeasonalResult={avgSeedsData}
      valueFormatter={f.number6dFormatter}
      tickValueFormatter={f.number2dFormatter}
    />
  );
});
