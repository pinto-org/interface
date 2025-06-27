import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import {
  useSeasonalMcap,
  useSeasonalPrice,
  useSeasonalSupply,
  useSeasonalTotalLiquidity,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import React from "react";
import { useMemo, useState } from "react";

// Chart constants
const CHART_CONSTANTS = {
  TARGET_PRICE: 1.0, // Target price for reference line
  PADDING: {
    MIN: 0.95, // 5% padding below min
    MAX: 1.05, // 5% padding above max
  },
};

const PintoExplorer = () => {
  const season = useSunData().current;

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <PriceChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <TotalLiquidityChart season={season} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <TotalSupplyChart season={season} />
        </div>
        <div className="w-full sm:w-1/2">
          <MarketCapChart season={season} />
        </div>
      </div>
    </>
  );
};

export default PintoExplorer;

// ────────────────────────────────────────────────────────────────────────────────
// Utils & Interfaces
// ────────────────────────────────────────────────────────────────────────────────

const { TARGET_PRICE, PADDING } = CHART_CONSTANTS;

interface ISeason {
  season: number;
}

const useTimeTabs = (chartId: string) => useSharedTimeTab(chartId);

// ────────────────────────────────────────────────────────────────────────────────
// Price Chart
// ────────────────────────────────────────────────────────────────────────────────

// Default range as fallback if data isn't available
const defaultPriceRange = {
  min: 0,
  max: TARGET_PRICE,
  showReferenceLine: true,
} as const;

const defaultPriceRanges = {
  [TimeTab.Week]: defaultPriceRange,
  [TimeTab.Month]: defaultPriceRange,
  [TimeTab.AllTime]: defaultPriceRange,
} as const;

/**
 * Calculate average price and determine y-axis ranges
 */
const usePriceYAxisRanges = (data: ReturnType<typeof useSeasonalPrice>["data"]) => {
  return useMemo(() => {
    // If we don't have data yet, return the default range
    if (!data?.length) {
      return defaultPriceRanges;
    }
    // Calculate min, max values from the actual data
    const values = data.map((item) => item.value);
    const minValue = Math.min(...values) * PADDING.MIN;
    const maxValue = Math.max(...values) * PADDING.MAX;

    // Calculate range with buffer
    const range = {
      min: minValue,
      max: maxValue,
      showReferenceLine: TARGET_PRICE >= minValue && TARGET_PRICE <= maxValue,
    };

    // Return the same range for all tabs
    return {
      [TimeTab.Week]: range,
      [TimeTab.Month]: range,
      [TimeTab.AllTime]: range,
    };
  }, [data]);
};

const PriceChart = React.memo(({ season }: ISeason) => {
  const [priceTab, setPriceTab] = useTimeTabs("price");

  const priceData = useSeasonalPrice(Math.max(6, season - tabToSeasonalLookback(priceTab)), season);

  // Calculate average price and determine y-axis ranges
  const priceYAxisRanges = usePriceYAxisRanges(priceData.data);

  return (
    <SeasonalChart
      title="Pinto Price"
      tooltip="The Current Price of Pinto in USD."
      size="small"
      activeTab={priceTab}
      onChangeTab={setPriceTab}
      useSeasonalResult={priceData}
      valueFormatter={f.price6dFormatter}
      tickValueFormatter={f.price2dFormatter}
      useLogarithmicScale={true}
      showReferenceLineAtOne={priceYAxisRanges[priceTab]?.showReferenceLine ?? false}
      yAxisRanges={priceYAxisRanges}
    />
  );
});

// ────────────────────────────────────────────────────────────────────────────────
// Total Liquidity Chart
// ────────────────────────────────────────────────────────────────────────────────

const TotalLiquidityChart = React.memo(({ season }: ISeason) => {
  const [liquidityTab, setLiquidityTab] = useTimeTabs("liquidity");

  const liquidityData = useSeasonalTotalLiquidity(Math.max(0, season - tabToSeasonalLookback(liquidityTab)), season);

  return (
    <SeasonalChart
      title="Total Liquidity"
      tooltip="The total USD value of tokens in liquidity pools on the Minting Whitelist."
      size="small"
      fillArea
      activeTab={liquidityTab}
      onChangeTab={setLiquidityTab}
      useSeasonalResult={liquidityData}
      valueFormatter={f.price0dFormatter}
      tickValueFormatter={f.largePriceFormatter}
    />
  );
});

// ────────────────────────────────────────────────────────────────────────────────
// Total Supply Chart
// ────────────────────────────────────────────────────────────────────────────────

const TotalSupplyChart = React.memo(({ season }: ISeason) => {
  const [supplyTab, setSupplyTab] = useTimeTabs("supply");

  const supplyData = useSeasonalSupply(Math.max(0, season - tabToSeasonalLookback(supplyTab)), season);

  return (
    <SeasonalChart
      title="Pinto Supply"
      tooltip="The total Pinto supply."
      size="small"
      fillArea
      activeTab={supplyTab}
      onChangeTab={setSupplyTab}
      useSeasonalResult={supplyData}
      valueFormatter={f.number0dFormatter}
      tickValueFormatter={f.largeNumberFormatter}
    />
  );
});

// ────────────────────────────────────────────────────────────────────────────────
// Market Cap Chart
// ────────────────────────────────────────────────────────────────────────────────

const MarketCapChart = React.memo(({ season }: ISeason) => {
  const [mcapTab, setMcapTab] = useTimeTabs("marketCap");

  const mcapData = useSeasonalMcap(Math.max(0, season - tabToSeasonalLookback(mcapTab)), season);

  return (
    <SeasonalChart
      title="Market Capitalization"
      tooltip="The USD value of the Pinto supply."
      size="small"
      fillArea
      activeTab={mcapTab}
      onChangeTab={setMcapTab}
      useSeasonalResult={mcapData}
      valueFormatter={f.price0dFormatter}
      tickValueFormatter={f.largePriceFormatter}
    />
  );
});
