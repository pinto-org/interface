import SeasonalChart, { tabToSeasonalLookback, TimeTab } from "@/components/charts/SeasonalChart";
import {
  useSeasonalAvgSeeds,
  useSeasonalBDV,
  useSeasonalL2SR,
  useSeasonalStalk,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const SiloExplorer = () => {
  const [liquidityTab, setLiquidityTab] = useState(TimeTab.Week);
  const [l2srTab, setL2srTab] = useState(TimeTab.Week);
  const [avgSeedsTab, setAvgSeedsTab] = useState(TimeTab.Week);
  const [stalkTab, setStalkTab] = useState(TimeTab.Week);
  const [bdvTab, setBdvTab] = useState(TimeTab.Week);

  const season = useSunData().current;

  const liquidityData = useSeasonalTotalLiquidity(Math.max(0, season - tabToSeasonalLookback(liquidityTab)), season);
  const l2srData = useSeasonalL2SR(Math.max(0, season - tabToSeasonalLookback(l2srTab)), season);
  const avgSeedsData = useSeasonalAvgSeeds(Math.max(0, season - tabToSeasonalLookback(avgSeedsTab)), season);
  const stalkData = useSeasonalStalk(Math.max(0, season - tabToSeasonalLookback(stalkTab)), season);
  const bdvData = useSeasonalBDV(Math.max(0, season - tabToSeasonalLookback(bdvTab)), season);

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Total Liquidity"
            size="small"
            fillArea
            activeTab={liquidityTab}
            onChangeTab={setLiquidityTab}
            useSeasonalResult={liquidityData}
            valueFormatter={f.price0dFormatter}
            tickValueFormatter={f.largePriceFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Liquidity to Supply ratio"
            size="small"
            activeTab={l2srTab}
            onChangeTab={setL2srTab}
            useSeasonalResult={l2srData}
            valueFormatter={f.percent2dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
      </div>
      {/* <SeasonalChart
        title="Average Seeds per PDV"
        size="large"
        activeTab={avgSeedsTab}
        onChangeTab={setAvgSeedsTab}
        useSeasonalResult={avgSeedsData}
        valueFormatter={f.number6dFormatter}
        tickValueFormatter={f.number2dFormatter}
      /> */}
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8 mt-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Stalk Supply"
            size="small"
            fillArea
            activeTab={stalkTab}
            onChangeTab={setStalkTab}
            useSeasonalResult={stalkData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Total Deposited PDV"
            size="small"
            fillArea
            activeTab={bdvTab}
            onChangeTab={setBdvTab}
            useSeasonalResult={bdvData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default SiloExplorer;
