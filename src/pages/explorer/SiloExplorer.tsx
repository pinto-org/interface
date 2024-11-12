import SeasonalChart from "@/components/charts/SeasonalChart";
import useSeasonalPrice from "@/state/seasonal/useSeasonalPrice";
import { formatter } from "@/utils/format";

const price6dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`;
const price2dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`;

const SiloExplorer = () => {
  return (
    <>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Total Liquidity"
            size="small"
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Liquidity to Supply ratio"
            size="small"
            fillArea
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
      </div>
      <SeasonalChart
        title="Average Seeds per PDV"
        size="large"
        useDataHook={useSeasonalPrice}
        valueFormatter={price6dFormatter}
        tickValueFormatter={price2dFormatter}
      />
      <SeasonalChart
        title="Stalk Supply"
        size="large"
        useDataHook={useSeasonalPrice}
        valueFormatter={price6dFormatter}
        tickValueFormatter={price2dFormatter}
      />
    </>
  );
};
export default SiloExplorer;
