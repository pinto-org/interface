import SeasonalChart from "@/components/charts/SeasonalChart";
import {
  useSeasonalPodIndex,
  useSeasonalPodRate,
  useSeasonalPodsHarvested,
  useSeasonalSownPinto,
  useSeasonalTemperature,
} from "@/state/seasonal/seasonalDataHooks";
import { formatter, numberAbbr } from "@/utils/format";

// TODO(ss): put these in a shared location
const number0dFormatter = (v: number) => `${formatter.number(v, { minDecimals: 0, maxDecimals: 0 })}`;
const largeNumberFormatter = numberAbbr;
const percent2dFormatter = (v: number) => `${formatter.number(v * 100, { minDecimals: 2, maxDecimals: 2 })}%`;
const percent0dFormatter = (v: number) => `${formatter.number(v * 100, { minDecimals: 0, maxDecimals: 0 })}%`;

const FieldExplorer = () => {
  return (
    <>
      <SeasonalChart
        title="Pod Rate"
        size="large"
        fillArea
        useDataHook={useSeasonalPodRate}
        valueFormatter={percent2dFormatter}
        tickValueFormatter={percent0dFormatter}
      />
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Max Temperature"
            size="small"
            useDataHook={useSeasonalTemperature}
            valueFormatter={percent0dFormatter}
            tickValueFormatter={percent0dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Pod Line"
            size="small"
            fillArea
            useDataHook={useSeasonalPodIndex}
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
      </div>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Sown Pinto"
            size="small"
            fillArea
            useDataHook={useSeasonalSownPinto}
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Pods Harvested"
            size="small"
            fillArea
            useDataHook={useSeasonalPodsHarvested}
            valueFormatter={number0dFormatter}
            tickValueFormatter={largeNumberFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default FieldExplorer;
