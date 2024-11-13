import SeasonalChart from "@/components/charts/SeasonalChart";
import useSeasonalMcap from "@/state/seasonal/useSeasonalMcap";
import useSeasonalPrice from "@/state/seasonal/useSeasonalPrice";
import useSeasonalSupply from "@/state/seasonal/useSeasonalSupply";
import useSeasonalTotalLiquidity from "@/state/seasonal/useSeasonalTotalLiquidity";
import { formatter, numberAbbr } from "@/utils/format";

// TODO(ss): put these in a shared location
const price6dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`;
const price2dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`;
const number0dFormatter = (v: number) => `${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largeNumberFormatter = numberAbbr;
const price0dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largePriceFormatter = (v: number) => `$${numberAbbr(v)}`;

const PintoExplorer = () => {
  return (
    <>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Price"
            size="small"
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Total Liquidity"
            size="small"
            fillArea
            useDataHook={useSeasonalTotalLiquidity}
            valueFormatter={price0dFormatter}
            tickValueFormatter={largePriceFormatter}
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
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Market Capitalization"
            size="small"
            fillArea
            useDataHook={useSeasonalMcap}
            valueFormatter={price0dFormatter}
            tickValueFormatter={largePriceFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default PintoExplorer;
