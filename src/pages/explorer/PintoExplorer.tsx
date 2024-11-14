import SeasonalChart from "@/components/charts/SeasonalChart";
import {
  useSeasonalMcap,
  useSeasonalPrice,
  useSeasonalSupply,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { chartFormatters as f } from "@/utils/format";

const PintoExplorer = () => {
  return (
    <>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Price"
            size="small"
            useDataHook={useSeasonalPrice}
            valueFormatter={f.price6dFormatter}
            tickValueFormatter={f.price2dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Total Liquidity"
            size="small"
            fillArea
            useDataHook={useSeasonalTotalLiquidity}
            valueFormatter={f.price0dFormatter}
            tickValueFormatter={f.largePriceFormatter}
          />
        </div>
      </div>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Supply"
            size="small"
            fillArea
            useDataHook={useSeasonalSupply}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Market Capitalization"
            size="small"
            fillArea
            useDataHook={useSeasonalMcap}
            valueFormatter={f.price0dFormatter}
            tickValueFormatter={f.largePriceFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default PintoExplorer;
