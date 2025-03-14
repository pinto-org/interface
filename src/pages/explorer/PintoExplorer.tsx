import SeasonalChart, { tabToSeasonalLookback, TimeTab } from "@/components/charts/SeasonalChart";
import {
  useSeasonalMcap,
  useSeasonalPrice,
  useSeasonalSupply,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const PintoExplorer = () => {
  const [priceTab, setPriceTab] = useState(TimeTab.Week);
  const [liquidityTab, setLiquidityTab] = useState(TimeTab.Week);
  const [supplyTab, setSupplyTab] = useState(TimeTab.Week);
  const [mcapTab, setMcapTab] = useState(TimeTab.Week);

  const season = useSunData().current;

  const priceData = useSeasonalPrice(Math.max(0, season - tabToSeasonalLookback(priceTab)), season);
  const liquidityData = useSeasonalTotalLiquidity(Math.max(0, season - tabToSeasonalLookback(liquidityTab)), season);
  const supplyData = useSeasonalSupply(Math.max(0, season - tabToSeasonalLookback(supplyTab)), season);
  const mcapData = useSeasonalMcap(Math.max(0, season - tabToSeasonalLookback(mcapTab)), season);

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Pinto Price"
            size="small"
            activeTab={priceTab}
            onChangeTab={setPriceTab}
            useSeasonalResult={priceData}
            valueFormatter={f.price6dFormatter}
            tickValueFormatter={f.price2dFormatter}
          />
        </div>
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
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Pinto Supply"
            size="small"
            fillArea
            activeTab={supplyTab}
            onChangeTab={setSupplyTab}
            useSeasonalResult={supplyData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Market Capitalization"
            size="small"
            fillArea
            activeTab={mcapTab}
            onChangeTab={setMcapTab}
            useSeasonalResult={mcapData}
            valueFormatter={f.price0dFormatter}
            tickValueFormatter={f.largePriceFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default PintoExplorer;
