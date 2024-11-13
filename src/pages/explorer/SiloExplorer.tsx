import SeasonalChart from "@/components/charts/SeasonalChart";
import useSeasonalStalk from "@/state/seasonal/useSeasonalStalk";
import { formatter, numberAbbr } from "@/utils/format";

// TODO(ss): put these in a shared location
const number0dFormatter = (v: number) => `${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largeNumberFormatter = numberAbbr;

const SiloExplorer = () => {
  return (
    <>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Total Liquidity"
            size="small"
            useDataHook={useSeasonalStalk}
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Liquidity to Supply ratio"
            size="small"
            fillArea
            useDataHook={useSeasonalStalk}
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
      </div>
      <SeasonalChart
        title="Average Seeds per PDV"
        size="large"
        useDataHook={useSeasonalStalk}
        valueFormatter={number0dFormatter}
        tickValueFormatter={largeNumberFormatter}
      />
      <SeasonalChart
        title="Stalk Supply"
        size="large"
        useDataHook={useSeasonalStalk}
        valueFormatter={number0dFormatter}
        tickValueFormatter={largeNumberFormatter}
      />
    </>
  );
};
export default SiloExplorer;
