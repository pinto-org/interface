import SeasonalChart from "@/components/charts/SeasonalChart";
import {
  useSeasonalPodIndex,
  useSeasonalPodRate,
  useSeasonalPodsHarvested,
  useSeasonalSownPinto,
  useSeasonalTemperature,
} from "@/state/seasonal/seasonalDataHooks";
import { chartFormatters as f } from "@/utils/format";

const FieldExplorer = () => {
  return (
    <>
      <SeasonalChart
        title="Pod Rate"
        size="large"
        fillArea
        useDataHook={useSeasonalPodRate}
        valueFormatter={f.percent2dFormatter}
        tickValueFormatter={f.percent0dFormatter}
      />
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Max Temperature"
            size="small"
            useDataHook={useSeasonalTemperature}
            valueFormatter={f.percent0dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Pod Line"
            size="small"
            fillArea
            useDataHook={useSeasonalPodIndex}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
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
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Pods Harvested"
            size="small"
            fillArea
            useDataHook={useSeasonalPodsHarvested}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default FieldExplorer;
