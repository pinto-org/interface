import SeasonalChart from "@/components/charts/SeasonalChart";
import useSeasonalL2SR from "@/state/seasonal/useSeasonalL2SR";
import useSeasonalStalk from "@/state/seasonal/useSeasonalStalk";
import useSeasonalTotalLiquidity from "@/state/seasonal/useSeasonalTotalLiquidity";
import { formatter, numberAbbr } from "@/utils/format";

// TODO(ss): put these in a shared location
const number0dFormatter = (v: number) => `${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largeNumberFormatter = numberAbbr;
const price0dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largePriceFormatter = (v: number) => `$${numberAbbr(v)}`;
const percent2dFormatter = (v: number) => `${formatter.number(v * 100, { minDecimals: 2, maxDecimals: 2 })}%`;
const percent0dFormatter = (v: number) => `${formatter.number(v * 100, { minDecimals: 0, maxDecimals: 0 })}%`;

const SiloExplorer = () => {
  return (
    <>
      <div className="flex flex-row w-full space-x-8">
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
        <div className="w-1/2">
          <SeasonalChart
            title="Liquidity to Supply ratio"
            size="small"
            useDataHook={useSeasonalL2SR}
            valueFormatter={percent2dFormatter}
            tickValueFormatter={percent0dFormatter}
          />
        </div>
      </div>
      {/* <SeasonalChart
        title="Average Seeds per PDV"
        size="large"
        useDataHook={useSeasonalStalk}
        valueFormatter={number0dFormatter}
        tickValueFormatter={largeNumberFormatter}
      /> */}
      <SeasonalChart
        title="Stalk Supply"
        size="large"
        fillArea
        useDataHook={useSeasonalStalk}
        valueFormatter={number0dFormatter}
        tickValueFormatter={largeNumberFormatter}
      />
    </>
  );
};
export default SiloExplorer;
