import SeasonalChart from "@/components/charts/SeasonalChart";
import useSeasonalPrice from "@/state/seasonal/useSeasonalPrice";
import { formatter } from "@/utils/format";

const price6dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`;
const price2dFormatter = (v: number) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`;

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
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
      </div>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Supply"
            size="small"
            fillArea
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Market Capitalization"
            size="small"
            fillArea
            useDataHook={useSeasonalPrice}
            valueFormatter={price6dFormatter}
            tickValueFormatter={price2dFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default PintoExplorer;
