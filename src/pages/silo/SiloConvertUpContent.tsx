import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import ConvertUpOrderForm from "@/components/Tractor/ConvertUpOrderForm";
import ConvertUpOrderbookDialog from "@/components/Tractor/ConvertUpOrderbook";
import ConvertUpTractorOrderBookChart from "@/components/Tractor/ConvertUpTractorOrderBookChart";
import ConvertUpTractorOrders from "@/components/Tractor/ConvertUpTractorOrders";
import { TractorConvertUpOrdersPanel } from "@/components/Tractor/farmer-orders/TractorOrdersPanel";
import CompactSeasonalLineChart from "@/components/charts/CompactSeasonalLineChart";
import { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import TimeTabsSelector, { TimeTab } from "@/components/charts/TimeTabs";
import { getAreaGradientFunctions, getStrokeGradientFunctions } from "@/components/charts/chartHelpers";
import { Card } from "@/components/ui/Card";
import * as Tabs from "@/components/ui/Tabs";
import { STALK } from "@/constants/internalTokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import useSeasonalGaugeInfo from "@/state/seasonal/queries/useSeasonalGaugeInfo";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { cn } from "@/utils/utils";
import { noop } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SiloConvertUpStats from "./SiloConvertUpStats";

// ---------- Sub Components ----------

const mobileOnlyActions = ["orders"] as const;
const actions = [...mobileOnlyActions, "tractor"] as const;

// Pull this out to minimize re-renders
const useConvertUpTractorActiveTab = () => {
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useParamsTabs(isMobile ? mobileOnlyActions : actions, "tab", true);
  const [searchParams] = useSearchParams();

  const value = activeTab || actions[0];

  useEffect(() => {
    if (!isMobile) return;
    const tabParam = searchParams.get("tab");
    if (!stringEq(tabParam, "orders")) {
      setActiveTab("orders");
    }
  }, [isMobile]);

  return [value, setActiveTab] as const;
};

export const SiloConvertUpContent = () => {
  const [value, setActiveTab] = useConvertUpTractorActiveTab();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Col className="gap-4 w-full">
        <Col className="gap-4 sm">
          <div className="pinto-body-light sm:pinto-h3">Convert Tractor Orderbook</div>
          <Row className="pinto-sm-light sm:pinto-body-light text-pinto-light sm:text-pinto-light gap-1 items-center">
            Automated Convert Up Blueprint Orders executed by Tractor
            <TooltipSimple
              variant="outlined"
              content={
                <>
                  Tractor enables Farmers to place Bids to Convert UP when at a minimum Convert Up Bonus per PDV
                  Converted and Convert Bonus Capacity (measured in PDV) is reached.
                </>
              }
            />
          </Row>
        </Col>
        <Col className="gap-4 w-full">
          <Col className="w-full justify-between gap-4 sm:flex-row sm:items-start sm:justify-start">
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-col lg:flex-row w-full gap-4 justify-between">
                <div className="flex w-full">
                  <ConvertUpTractorOrderBookChart />
                </div>
                <Card className="hidden sm:flex rounded-xl p-4 w-full lg:max-w-[31rem] h-full">
                  <ConvertUpOrderForm onOpenChange={noop} disallowCloseForm={true} />
                </Card>
              </div>
              <div className="pt-4">
                <SiloConvertUpCharts />
              </div>
              <Col className="gap-4">
                <div className="flex flex-row gap-2 items-center min-w-0">
                  <div
                    className={cn(
                      "gap-2 flex-col", // mobile styles
                      "flex sm:flex-row w-full min-w-0 gap-4 justify-between",
                    )}
                  >
                    <SiloConvertUpStats />
                  </div>
                </div>
              </Col>
            </div>
          </Col>
        </Col>
        <div className="hidden sm:block">
          <Tabs.Tabs defaultValue="orders" value={value} onValueChange={setActiveTab}>
            <Tabs.TabsList variant="text">
              <Tabs.TabsTrigger value="orders" variant="text">
                Convert Up
              </Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="tractor" variant="text" className="hidden sm:block">
                My Orders
              </Tabs.TabsTrigger>
            </Tabs.TabsList>
            <Tabs.TabsContent value="orders">
              <ConvertUpTractorOrders onSeeAllClick={() => setOpen(true)} />
            </Tabs.TabsContent>
            <Tabs.TabsContent value="tractor">
              <TractorConvertUpOrdersPanel />
            </Tabs.TabsContent>
          </Tabs.Tabs>
        </div>
      </Col>
      <ConvertUpOrderbookDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

const SiloConvertUpCharts = () => {
  const season = useSeason();

  const [tab, setTab] = useState(TimeTab.Week);

  return (
    <Col className="gap-4">
      <div className="flex flex-row align-center justify-between pinto-body-light">
        <span>Convert Up Data</span>
        <TimeTabsSelector tab={tab} setTab={setTab} />
      </div>
      <div className={cn("flex gap-4 flex-col sm:flex-row")}>
        <Card className="w-full p-4">
          <BonusGrownStalkPerPDVChart tab={tab} season={season} setTab={setTab} />
        </Card>
        <Card className="w-full p-4">
          <BonusCapacityChart tab={tab} season={season} setTab={setTab} />
        </Card>
      </div>
    </Col>
  );
};

interface IChart {
  tab: TimeTab;
  season: number;
  setTab: React.Dispatch<React.SetStateAction<TimeTab>>;
}

const chartSharedProps = {
  hideYTicks: true,
  hideXTicks: true,
  size: "small",
} as const;

const grownStalkPerBDVFormatter = [(value: number) => formatter.xDec(value, 4)];
const bonusCapacityFormatter = [(value: number) => formatter.xDec(value, 2)];
const chartBorderFunction = getStrokeGradientFunctions(["#387F5C"]);
const chartAreaFunction = getAreaGradientFunctions(["fadeGreen"]);

const bonusStalkTitle = ["Bonus Grown Stalk Per PDV"];

const BonusGrownStalkPerPDVChart = React.memo(({ tab, season, setTab }: IChart) => {
  const range = useIGaugesInfoTimeToSeasonRange(season, tab);

  const query = useSeasonalGaugeInfo(range.queryFrom, range.to, (gaugesInfo, timestamp) => ({
    season: Number(gaugesInfo.season),
    value: TV.fromBlockchain(gaugesInfo.g2BonusStalkPerBdv, 10).toNumber(),
    timestamp,
  }));

  const results = useMemo(() => [query], [query]);

  return (
    <CompactSeasonalLineChart
      titles={bonusStalkTitle}
      activeTab={tab}
      onChangeTab={setTab}
      useSeasonalResult={results}
      valueFormatter={grownStalkPerBDVFormatter}
      borderFunctions={chartBorderFunction}
      areaFunctions={chartAreaFunction}
      token={STALK}
      {...chartSharedProps}
    />
  );
});

const bonusCapacityTitle = ["Max Convert Bonus Capacity (PDV)"];
const BonusCapacityChart = React.memo(({ tab, season, setTab }: IChart) => {
  const range = useIGaugesInfoTimeToSeasonRange(season, tab);

  const query = useSeasonalGaugeInfo(range.queryFrom, range.to, (gaugesInfo, timestamp) => ({
    season: Number(gaugesInfo.season),
    value: TV.fromBlockchain(gaugesInfo.g2MaxConvertCapacity, 6).toNumber(),
    timestamp,
  }));

  const results = useMemo(() => [query], [query]);

  return (
    <CompactSeasonalLineChart
      titles={bonusCapacityTitle}
      activeTab={tab}
      onChangeTab={setTab}
      useSeasonalResult={results}
      valueFormatter={bonusCapacityFormatter}
      borderFunctions={chartBorderFunction}
      areaFunctions={chartAreaFunction}
      token={STALK}
      {...chartSharedProps}
    />
  );
});

const PI_13_SEASON = 8083;

const useIGaugesInfoTimeToSeasonRange = (season: number, tab: TimeTab) => {
  const tabLookbackSeasons = tabToSeasonalLookback(tab);
  // We only have data for PI 13 and later, so we need to adjust the query from season accordingly
  const minQueryFromSeason = Math.max(season - tabLookbackSeasons, PI_13_SEASON);

  return {
    queryFrom: minQueryFromSeason,
    to: season,
  } as const;
};
