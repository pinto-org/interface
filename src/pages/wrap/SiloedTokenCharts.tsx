import CompactSeasonalLineChart from "@/components/charts/CompactSeasonalLineChart";
import { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import TimeTabsSelector, { TimeTab } from "@/components/charts/TimeTabs";
import { getAreaGradientFunctions, getStrokeGradientFunctions } from "@/components/charts/chartHelpers";
import IconImage from "@/components/ui/IconImage";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import { truncateBeanstalkWrappedDespositsSeasons } from "@/state/seasonal/queries/useSeasonalBeanstalkWrappedDepositsSG";
import {
  useFarmerSeasonalGrownStalkPerDepositedBDV,
  useFarmerSeasonalSiloAssetDepositedAmount,
  useFarmerSeasonalSiloAssetPercentageOfTotalDeposited,
  useSeasonalWrappedDepositExchangeRate,
  useSeasonalWrappedDepositTotalSupply,
} from "@/state/seasonal/seasonalDataHooks";
import { useSeason } from "@/state/useSunData";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import React, { useMemo, useState } from "react";

export default function SiloedTokenCharts() {
  const season = useSeason();

  const [tab, setTab] = useState(TimeTab.Week);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row align-center justify-between pinto-body-light">
        <span>Usage data</span>
        <TimeTabsSelector tab={tab} setTab={setTab} />
      </div>
      <div className="flex flex-col gap-2 w-full flex-shrink-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4">
          <TotalDepositedPintoChart tab={tab} season={season} setTab={setTab} />
          <ExchangeRateChart tab={tab} season={season} setTab={setTab} />
          <PctOfTotalDepositedChart tab={tab} season={season} setTab={setTab} />
          <GrownStalkPerDepositedBDVChart tab={tab} season={season} setTab={setTab} />
        </div>
      </div>
    </div>
  );
}

const useContextTokens = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);
  const sMainToken = useChainConstant(S_MAIN_TOKEN);

  return { mainToken, sMainToken };
};

interface ISiloedTokenChart {
  tab: TimeTab;
  season: number;
  setTab: React.Dispatch<React.SetStateAction<TimeTab>>;
}

const chartSharedProps = {
  hideYTicks: true,
  hideXTicks: true,
  size: "small",
} as const;

// ---------- Total Supply vs. Total Deposited ----------

// create stable references for headers & value formatters. Minimize re-renders
const SPintoSupplyHeader = () => {
  const { sMainToken } = useContextTokens();
  return (
    <div className="flex flex-row items-center gap-1">
      <IconImage src={sMainToken.logoURI} size={4} alt={sMainToken.name} />
      <span className="pinto-sm text-pinto-primary">{sMainToken.symbol} Total Supply</span>
    </div>
  );
};
const DepositedPintoHeader = () => {
  const { mainToken } = useContextTokens();
  return (
    <div className="flex flex-row items-center gap-1">
      <IconImage src={mainToken.logoURI} size={4} alt={mainToken.name} />
      <span className="pinto-sm text-pinto-primary">Deposited {mainToken.symbol}</span>
    </div>
  );
};
// biome-ignore lint/correctness/useJsxKeyInIterable:
const totalDepositedHeaders = [<SPintoSupplyHeader />, <DepositedPintoHeader />];
const totalDepositedFormatter = [
  (value: number) => formatter.twoDec(value),
  (value: number) => formatter.twoDec(value),
];
const totalDepositedBorderFunction = getStrokeGradientFunctions(["#CACACA", "#387F5C"]);

const TotalDepositedPintoChart = React.memo(({ tab, season, setTab }: ISiloedTokenChart) => {
  const { mainToken, sMainToken } = useContextTokens();

  const { fromSeason, toSeason } = truncateBeanstalkWrappedDespositsSeasons(
    Math.max(0, season - tabToSeasonalLookback(tab)),
    season,
  );

  const totalDepositedQuery = useFarmerSeasonalSiloAssetDepositedAmount(
    fromSeason,
    toSeason,
    mainToken,
    sMainToken.address,
  );
  const totalSupplyQuery = useSeasonalWrappedDepositTotalSupply(fromSeason, toSeason);

  const results = useMemo(() => [totalSupplyQuery, totalDepositedQuery], [totalSupplyQuery, totalDepositedQuery]);

  return (
    <CompactSeasonalLineChart
      titles={totalDepositedHeaders}
      activeTab={tab}
      onChangeTab={setTab}
      useSeasonalResult={results}
      valueFormatter={totalDepositedFormatter}
      borderFunctions={totalDepositedBorderFunction}
      {...chartSharedProps}
    />
  );
});

// ---------- Exchange Rate ----------

// create stable references for headers & value formatters. Minimize re-renders
const ExchangeRateHeader = () => {
  const { sMainToken } = useContextTokens();
  return (
    <div className="flex flex-row items-center gap-1 sm:mb-7">
      <IconImage src={sMainToken.logoURI} size={4} alt={sMainToken.name} />
      <span className="pinto-sm text-pinto-primary">{sMainToken.symbol} Exchange Rate</span>
    </div>
  );
};

// biome-ignore lint/correctness/useJsxKeyInIterable:
const exchangeRateHeaders = [<ExchangeRateHeader />];
const exchangeRateFormatter = [(value: number) => formatter.xDec(value, 4)];
const exchangeRateBorderFunction = getStrokeGradientFunctions(["#387F5C"]);

const ExchangeRateChart = React.memo(({ tab, season, setTab }: ISiloedTokenChart) => {
  const { mainToken } = useContextTokens();
  const { fromSeason, toSeason } = truncateBeanstalkWrappedDespositsSeasons(
    Math.max(0, season - tabToSeasonalLookback(tab)),
    season,
  );

  const query = useSeasonalWrappedDepositExchangeRate(fromSeason, toSeason);

  const results = useMemo(() => [query], [query]);

  return (
    <CompactSeasonalLineChart
      activeTab={tab}
      onChangeTab={setTab}
      titles={exchangeRateHeaders}
      useSeasonalResult={results}
      valueFormatter={exchangeRateFormatter}
      borderFunctions={exchangeRateBorderFunction}
      token={mainToken}
      {...chartSharedProps}
    />
  );
});

// ---------- Pct of Total Deposited ----------

const pctOfTotalFormatter = [(value: number) => formatter.pct(value * 100, { minDecimals: 4, maxDecimals: 4 })];
const pctOfTotalBorderFunction = getStrokeGradientFunctions(["#387F5C"]);
const pctOfTotalAreaFunction = getAreaGradientFunctions(["fadeGreen"]);

const PctOfTotalDepositedChart = React.memo(({ tab, season, setTab }: ISiloedTokenChart) => {
  const { mainToken, sMainToken } = useContextTokens();
  const { fromSeason, toSeason } = truncateBeanstalkWrappedDespositsSeasons(
    Math.max(0, season - tabToSeasonalLookback(tab)),
    season,
  );

  const query = useFarmerSeasonalSiloAssetPercentageOfTotalDeposited(
    fromSeason,
    toSeason,
    mainToken,
    sMainToken.address,
  );

  const titles = useMemo(
    () => [`% of Deposited ${mainToken.symbol} wrapped in ${sMainToken.symbol}`],
    [mainToken, sMainToken],
  );

  const results = useMemo(() => [query], [query]);

  return (
    <CompactSeasonalLineChart
      titles={titles}
      activeTab={tab}
      onChangeTab={setTab}
      useSeasonalResult={results}
      valueFormatter={pctOfTotalFormatter}
      borderFunctions={pctOfTotalBorderFunction}
      areaFunctions={pctOfTotalAreaFunction}
      {...chartSharedProps}
    />
  );
});

// ---------- Grown Stalk Per Deposited BDV ----------

const grownStalkPerBDVFormatter = [(value: number) => formatter.xDec(value, 4)];
const grownStalkPerBDVBorderFunction = getStrokeGradientFunctions(["#387F5C"]);
const grownStalkPerBDVAreaFunction = getAreaGradientFunctions(["fadeGreen"]);

const GrownStalkPerDepositedBDVChart = React.memo(({ tab, season, setTab }: ISiloedTokenChart) => {
  const { mainToken, sMainToken } = useContextTokens();

  const { fromSeason, toSeason } = truncateBeanstalkWrappedDespositsSeasons(
    Math.max(0, season - tabToSeasonalLookback(tab)),
    season,
  );

  const query = useFarmerSeasonalGrownStalkPerDepositedBDV(fromSeason, toSeason, sMainToken.address);

  const titles = useMemo(() => [`Grown Stalk Per Deposited ${mainToken.symbol}`], [mainToken]);
  const results = useMemo(() => [query], [query]);

  return (
    <CompactSeasonalLineChart
      titles={titles}
      activeTab={tab}
      onChangeTab={setTab}
      useSeasonalResult={results}
      valueFormatter={grownStalkPerBDVFormatter}
      borderFunctions={grownStalkPerBDVBorderFunction}
      areaFunctions={grownStalkPerBDVAreaFunction}
      token={STALK}
      {...chartSharedProps}
    />
  );
});
