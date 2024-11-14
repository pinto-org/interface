import SeasonalChart from "@/components/charts/SeasonalChart";
import {
  useSeasonalAvgSeeds,
  useSeasonalL2SR,
  useSeasonalStalk,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { chartFormatters as f } from "@/utils/format";

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
            valueFormatter={f.price0dFormatter}
            tickValueFormatter={f.largePriceFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Liquidity to Supply ratio"
            size="small"
            useDataHook={useSeasonalL2SR}
            valueFormatter={f.percent2dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
      </div>
      <SeasonalChart
        title="Average Seeds per PDV"
        size="large"
        useDataHook={useSeasonalAvgSeeds}
        valueFormatter={f.number6dFormatter}
        tickValueFormatter={f.number2dFormatter}
      />
      <SeasonalChart
        title="Stalk Supply"
        size="large"
        fillArea
        useDataHook={useSeasonalStalk}
        valueFormatter={f.number0dFormatter}
        tickValueFormatter={f.largeNumberFormatter}
      />
    </>
  );
};
export default SiloExplorer;
