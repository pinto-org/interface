import SeasonalChart, { SeasonalChartData, TimeTab } from "@/components/charts/SeasonalChart";
import useSeasonalPrice from "@/state/seasonal/useSeasonalPrice";
import { useSunData } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { useCallback, useMemo, useState } from "react";

enum PintoCharts {
  Price = 0,
  Price2TEST = 1,
  Price3TEST = 2,
}

// TODO(ss): dataFn as a useCallback that is modified when the time period selection gets changed.

const PintoExplorer = () => {
  const [priceTimeSelection, setPriceTimeSelection] = useState(TimeTab.Week);

  // const season = useSunData().current; // TODO(ss): put this back eventually
  const season = 25826;
  const priceData = useSeasonalPrice(season - 10, season);
  console.log(priceData.data, priceData.isLoading, priceData.error, priceData.isError);

  const priceDataFn = useCallback(() => {
    /// Test data implementation ///
    const data: SeasonalChartData[] = [];
    const startDate = new Date();
    startDate.setDate(1);

    for (let i = 0; i < 40 * 2 ** priceTimeSelection; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const value = parseFloat((Math.random() * (1.1 - 0.9) + 0.9).toFixed(6));
      data.push({ value, season: 23456 + i, timestamp: date });
    }
    return data;
  }, [priceTimeSelection]);

  // Updates the state of which time tab is selected in the SeasonalChart component
  const stateSetters = useMemo(() => [setPriceTimeSelection], []);
  const handleChangeTabFactory = useCallback(
    (idx: PintoCharts) => (newSelection: TimeTab) => {
      stateSetters[idx](newSelection);
    },
    [stateSetters],
  );

  return (
    <>
      <div className="flex flex-row w-full space-x-8">
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Price"
            size="small"
            dataFn={priceDataFn}
            onTimeTabChange={handleChangeTabFactory(PintoCharts.Price)}
            valueFormatter={(v) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`}
            tickValueFormatter={(v) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`}
          />
        </div>
        <div className="w-1/2">
          <SeasonalChart
            title="Pinto Price"
            size="small"
            fillArea
            dataFn={priceDataFn}
            onTimeTabChange={handleChangeTabFactory(PintoCharts.Price2TEST)}
            valueFormatter={(v) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`}
            tickValueFormatter={(v) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`}
          />
        </div>
      </div>
      <SeasonalChart
        title="Pinto Price"
        size="large"
        dataFn={priceDataFn}
        onTimeTabChange={handleChangeTabFactory(PintoCharts.Price3TEST)}
        valueFormatter={(v) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`}
        tickValueFormatter={(v) => `$${formatter.number(v, { minDecimals: 2, maxDecimals: 2 })}`}
      />
    </>
  );
};
export default PintoExplorer;
