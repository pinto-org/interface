import { TokenValue } from "@/classes/TokenValue";
import AccordionGroup, { IBaseAccordionContent } from "@/components/AccordionGroup";
import ActionsMenu from "@/components/ActionsMenu";
import { Col, Row } from "@/components/Container";
import DonutChart from "@/components/DonutChart";
import GerminationNotice from "@/components/GerminationNotice";
import HelperLink from "@/components/HelperLink";
import ReadMoreAccordion from "@/components/ReadMoreAccordion";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
import { TimeTab, tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { navLinks } from "@/components/nav/nav/Navbar";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsSmallDesktop from "@/hooks/display/useIsSmallDesktop";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSeasonalSiloActiveFarmers } from "@/state/seasonal/seasonalDataHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import useTokenData, { useWhitelistedTokens } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getClaimText } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { StatPanelData, Token } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiloTable from "./silo/SiloTable";

function Silo() {
  const farmerSilo = useFarmerSilo();
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const priceData = usePriceData();
  const mainToken = tokenData.mainToken;
  const { submitClaimRewards } = useClaimRewards();
  const navigate = useNavigate();
  const isSmallDesktop = useIsSmallDesktop();

  const [hoveredButton, setHoveredButton] = useState("");
  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const bestDeposit = farmerActions.optimalDepositToken?.token;

  const claimEnabled =
    farmerActions.claimRewards.outputs.beanGain.gt(0.01) ||
    farmerActions.claimRewards.outputs.stalkGain.gt(0.01) ||
    farmerActions.claimRewards.outputs.seedGain.gt(0.01) ||
    farmerActions.updateDeposits.enabled;
  const claimableText = getClaimText(
    farmerActions.claimRewards.outputs.beanGain,
    farmerActions.claimRewards.outputs.stalkGain.add(farmerActions.updateDeposits.totalGains.stalkGain),
    farmerActions.claimRewards.outputs.seedGain,
  );
  const hasGerminatingDeposits = Array.from(farmerSilo.deposits.values()).some((depositData) =>
    depositData.deposits.some((deposit) => deposit.isGerminating && !deposit.isPlantDeposit),
  );

  const statPanelData: Record<"stalk" | "seeds" | "depositedValue", StatPanelData> = {
    depositedValue: {
      title: "My Deposited Value",
      mode: "depositedValue",
      mainValue: farmerSilo.depositsUSD,
      mainValueChange: farmerActions.claimRewards.outputs.bdvGain.mul(priceData.price),
      secondaryValue: farmerSilo.depositsBDV,
      actionValue: farmerActions.claimRewards.outputs.bdvGain,
      showActionValues: hoveredButton === "claim",
      isLoading: farmerSilo.isLoading,
    },
    stalk: {
      title: "My Stalk",
      mode: "stalk",
      mainValue: farmerSilo.activeStalkBalance,
      auxValue: farmerSilo.germinatingStalkBalance,
      mainValueChange: farmerActions.claimRewards.outputs.stalkGain,
      secondaryValue: farmerActions.claimRewards.outputs.stalkGain,
      showActionValues: hoveredButton === "claim",
      altTooltipContent:
        "Stalk entitles holders to passive interest in the form of a share of future Pinto. Your Stalk is forfeited when you Withdraw your Deposited assets from the Silo.",
      isLoading: farmerSilo.isLoading,
    },
    seeds: {
      title: "My Seeds",
      mode: "seeds",
      mainValue: farmerSilo.activeSeedsBalance,
      mainValueChange: farmerActions.claimRewards.outputs.seedGain,
      secondaryValue: farmerActions.claimRewards.outputs.seedGain,
      showActionValues: hoveredButton === "claim",
      altTooltipContent: "Seeds are illiquid tokens that yield 1/10,000 Stalk each Season.",
      isLoading: farmerSilo.isLoading,
    },
  };

  return (
    <PageContainer variant={"lgAlt"} bottomMarginOnMobile>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-12">
          <div className="flex flex-col gap-2">
            <div className="pinto-h2 sm:pinto-h1">Silo</div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              Deposit value in the Silo to earn passive yield from supply growth.
            </div>
            <LearnSilo />
          </div>
          <Separator />
          {enableStatPanels && (
            <div className="hidden sm:flex flex-col gap-12">
              <div className="flex flex-col items-center">
                <StatPanel {...statPanelData.depositedValue} size={"large"} />
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="flex flex-row gap-18">
                  <div className="px-4">
                    <StatPanel {...statPanelData.stalk} variant={"silo"} />
                  </div>
                  <div className="px-4">
                    <StatPanel {...statPanelData.seeds} variant={"silo"} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <AnimatePresence>
            {hasGerminatingDeposits && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <GerminationNotice type="multiple" deposits={farmerSilo.deposits} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col gap-4 sm">
            <div className="pinto-body-light sm:pinto-h3">Deposit Whitelist</div>
            <div className="pinto-sm-light sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              These are Deposits which are currently incentivized by Pinto.
            </div>
            <div className="relative action-container">
              <SiloTable hovering={hoveredButton === "claim"} />
              {convertEnabled && convertFrom && convertTo && (
                <TableRowConnector
                  fromTarget={`token-row-${convertFrom.address}`}
                  toTarget={`token-row-${convertTo.address}`}
                  color="#246645"
                  capHeight={isSmallDesktop ? 52 : 68}
                  extensionLength={isSmallDesktop ? 20 : 35}
                  componentOffset={10}
                  dotted={true}
                  startCapColor={convertFrom.color}
                  endCapColor={convertTo.color}
                  component={
                    <div className="group flex flex-col group max-w-[250px] cursor-pointer place-items-end gap-2">
                      <div
                        data-action-target="convert"
                        className="cursor-pointer convert-color text-[1.25rem] font-[340] tracking-[-0.025rem] leading-[1.375rem] text-end"
                        // @ts-ignore
                        style={{ "--convert-color": convertFrom.color }}
                        onClick={() => navigate(getSiloConvertUrl(convertFrom, convertTo))}
                      >
                        {`Convert ${convertFrom.name}`}
                      </div>
                      {/*
                      <div className="flex flex-col gap-4">
                        <Text
                          data-action-target="convert"
                          variant="sm-light"
                          className="text-pinto-gray-4 text-end opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {`Convert ${convertFrom.name} for ${convertTo.name} a gain in Seeds`}
                        </Text>
                        <Text
                          data-action-target="convert"
                          variant="sm-light"
                          className="text-pinto-gray-4 text-end opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {"Arbitrage the increased Seeds reward for a gain in Seeds."}
                        </Text>
                      </div>*/}
                    </div>
                  }
                />
              )}
              {claimEnabled && (
                <HelperLink
                  text={claimableText}
                  className="absolute -right-[90px] max-[1800px]:-right-[215px] top-8 max-[1800px]:whitespace-break-spaces max-[1800px]:w-[160px]"
                  dataTarget={`token-row-${mainToken.address}`}
                  sourceAnchor="left"
                  targetAnchor="right"
                  source90Degree={true}
                  perpLength={10}
                  onClick={submitClaimRewards}
                  onMouseEnter={() => setHoveredButton("claim")}
                  onMouseLeave={() => setHoveredButton("")}
                />
              )}
              {/* {enablePintoToLPHelper && (
                <TableRowConnector
                  toTarget={`token-row-${mainToken.address}`}
                  color="#246645"
                  mode="singleLine"
                  extensionLength={40}
                  dotted={true}
                  endCapColor={mainToken.color}
                  componentOffsetHeight={22}
                  component={
                    <div className="group flex flex-col group max-w-[250px] cursor-pointer place-items-end gap-2">
                      <div
                        data-action-target="convert"
                        className="cursor-pointer convert-color text-[1.25rem] font-[340] tracking-[-0.025rem] leading-[1.375rem] text-end"
                        // @ts-ignore
                        style={{ "--convert-color": mainToken.color }}
                        onClick={() =>
                          navigate(
                            `/silo/${mainToken.address}?action=convert&mode=max`
                          )
                        }
                      >
                        {`Convert ${mainToken.name} to LP`}
                      </div>
                      <div className="flex flex-col gap-4">
                        <div
                          data-action-target="convert"
                          className="pinto-sm-light text-pinto-gray-4 text-end"
                        >
                          {`Arbitrage the increased price of Pinto for an increase in Seeds`}
                        </div>
                      </div>
                    </div>
                  }
                />
              )} */}
              {!convertEnabled && bestDeposit && (
                <TableRowConnector
                  toTarget={`token-row-${bestDeposit.address}`}
                  color="#246645"
                  mode="singleLine"
                  capHeight={isSmallDesktop ? 52 : 68}
                  extensionLength={40}
                  dotted={true}
                  endCapColor={bestDeposit.color}
                  componentOffsetHeight={22}
                  component={
                    <div className="group flex flex-col group max-w-[250px] cursor-pointer place-items-end gap-2">
                      <div
                        data-action-target="convert"
                        className="cursor-pointer convert-color text-[1.25rem] font-[340] tracking-[-0.025rem] leading-[1.375rem] text-end"
                        // @ts-ignore
                        style={{ "--convert-color": bestDeposit.color }}
                        onClick={() => navigate(`/silo/${bestDeposit.address}`)}
                      >
                        {`Deposit ${bestDeposit.name}`}
                      </div>
                      <div className="flex flex-col gap-4">
                        <div
                          data-action-target="convert"
                          className="text-pinto-gray-4 pinto-sm-light text-end w-[12rem]"
                        >
                          {`${bestDeposit.name} currently has the highest incentive for Depositors.`}
                        </div>
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-8">
            <div className="w-full">
              <SiloStats />
            </div>
            <div className="w-full">
              <AccordionGroup items={FAQ_ITEMS} allExpanded={false} groupTitle="Frequently Asked Questions" />
            </div>
          </div>
        </div>
      </div>

      <ActionsMenu showOnTablet />
    </PageContainer>
  );
}

export default Silo;

// ---------- Sub Components ----------

const initialValue = { silo: false };

const LearnSilo = () => {
  const [learnDidVisit, setLearnDidVisit] = useLocalStorage<{ silo: boolean }>("pinto-learn-state-silo", initialValue, {
    initializeIfEmpty: true,
  });

  // Set the learnDidVisit state to true if it is not already true
  useEffect(() => {
    if (learnDidVisit.silo) return;
    setLearnDidVisit({ ...learnDidVisit, silo: true });
  }, []);

  return (
    <>
      <ReadMoreAccordion defaultOpen={!learnDidVisit.silo}>
        <>
          Pinto or Pinto-LP can be deposited into the Silo and can be withdrawn at any time. Deposits are eligible to
          earn Pinto after at least 1 full season has passed. When Pinto is priced over $1, new Pinto is minted with
          48.5% being distributed to Silo depositors. Depositors earn a share of the Pinto mints to the silo based on
          their Stalk balance proportional to total Stalk supply. A Deposit is issued an initial amount of Stalk and
          Seeds, which is determined by token type and value. Seeds grow Stalk every season. All stalk is forfeit upon a
          withdrawal.
        </>
      </ReadMoreAccordion>
    </>
  );
};

// ---------- Silo Stats ----------

const SiloStats = React.memo(() => {
  const { data: siloStats, siloWhitelistData, isLoading } = useSiloStats();

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);

  const handleSetHoveredIndex = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  return (
    <Card className="flex flex-col p-4 sm:p-6 gap-2 sm:gap-6 h-auto w-full">
      <Col className="gap-2">
        <div className="flex flex-row gap-4">
          <SiloStatContent data={siloStats} isLoading={isLoading} />
        </div>
        <Link
          to="/explorer/silo"
          className="pinto-xs sm:pinto-sm font-light text-pinto-green-4 sm:text-pinto-green-4 hover:underline transition-all mt-2"
        >
          See more data →
        </Link>
      </Col>
      <div className="grid sm:pt-4 grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
        <Col className="gap-4 self-stretch order-2 sm:order-1">
          {Object.entries(siloWhitelistData).map(([key, wlData], i) => {
            const isHovered = (hoveredIndex || 0) === i;
            if (!isHovered) return null;

            return (
              <HoveredSiloTokenStatContent
                key={`${key}-${wlData.token.symbol}`}
                wlTokenSiloDetails={wlData}
                isLoading={isLoading}
              />
            );
          })}
        </Col>
        <DepositedByTokenDoughnutChart
          setHoveredIndex={handleSetHoveredIndex}
          siloWhitelistData={siloWhitelistData}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
});

// ---------- Hovered Silo Token Stat Content ----------

interface HoveredSiloTokenStatContentProps {
  wlTokenSiloDetails: SiloTokenDepositOverallDetails;
  isLoading: boolean;
}

const tooltipProps = {
  variant: "outlined",
  showOnMobile: true,
  className: "pinto-sm",
} as const;

const HoveredSiloStatRow = (props: {
  label: string | JSX.Element;
  value: string | JSX.Element;
  loading: boolean;
  tooltip?: string | JSX.Element;
}) => {
  const { label, value, loading, tooltip } = props;

  return (
    <Row className="gap-2 justify-between">
      <Row className="gap-1 items-center pinto-sm-light sm:pinto-body-light text-pinto-light sm:text-pinto-light">
        {label}
        {tooltip && <TooltipSimple {...tooltipProps} content={tooltip} />}
      </Row>
      <TextSkeleton height="same-sm" desktopHeight="same-body" className="w-32" loading={loading}>
        <div className="pinto-sm-light sm:pinto-body-light shrink-0">{value}</div>
      </TextSkeleton>
    </Row>
  );
};

const HoveredSiloTokenStatContent = ({
  wlTokenSiloDetails: {
    token,
    depositedBDV,
    depositedAmount,
    siloDepositedRatio,
    optimalPctDepositedBdv,
    currentDepositedLPBDVRatio,
  },
  isLoading,
}: HoveredSiloTokenStatContentProps) => {
  const { tokenPrices, loading: priceLoading } = usePriceData();

  const usdPrice = tokenPrices.get(token)?.instant;

  const usdDeposited = usdPrice ? depositedAmount.mul(usdPrice) : undefined;

  const loading = isLoading || priceLoading;

  return (
    <Col className="gap-4 justify-start self-stretch h-auto">
      <div className="pinto-body-bold flex flex-row gap-1">
        <TextSkeleton height="same-body" className="w-32" loading={loading}>
          <>
            <IconImage size={5} src={token.logoURI} />
            <>{token.symbol}</>
          </>
        </TextSkeleton>
      </div>
      <HoveredSiloStatRow
        label="Total Deposited Amount"
        value={formatter.token(depositedAmount, token)}
        loading={loading}
      />
      <HoveredSiloStatRow
        label="Total Deposited PDV"
        value={formatter.twoDec(depositedBDV)}
        loading={loading}
        tooltip={<>The total Pinto-denominated value deposited into the Silo.</>}
      />
      <HoveredSiloStatRow
        label="Total Deposited Value"
        value={usdDeposited ? formatter.usd(usdDeposited) : "--"}
        loading={loading}
        tooltip={<>The total USD value deposited into the Silo.</>}
      />
      <HoveredSiloStatRow
        label=" % of Total Deposited PDV"
        value={formatter.pct(siloDepositedRatio.mul(100))}
        loading={loading}
        tooltip={<>The percentage of the total Pinto-denominated value deposited into the Silo.</>}
      />
      {!token.isMain && (
        <>
          <HoveredSiloStatRow
            label="Optimal % LP Deposited PDV"
            value={formatter.pct(optimalPctDepositedBdv)}
            loading={loading}
            tooltip={<>The optimal percentage of the total LP Deposited PDV deposited into the Silo.</>}
          />
          <HoveredSiloStatRow
            label="Current % LP Deposited PDV"
            value={formatter.pct(currentDepositedLPBDVRatio.mul(100))}
            loading={loading}
            tooltip={<>The current percentage of the total LP Deposited PDV in the Silo.</>}
          />
        </>
      )}
    </Col>
  );
};

// ---------- Upper Silo Stats ----------

const SiloStatContent = ({
  data,
  isLoading,
}: { data: ReturnType<typeof useSiloStats>["data"]; isLoading: boolean }) => {
  const stats = useMemo(
    () => [
      {
        label: "Total Deposited PDV",
        subLabel: "Total Pinto Denominated Value deposited into the Silo",
        value: formatter.twoDec(data.totalDepositedBDV),
      },
      {
        label: "Total Stalk",
        subLabel: "Total Stalk issued to Silo Depositors",
        value: formatter.twoDec(data.totalStalk),
      },
      {
        label: "Active Farmers",
        subLabel: "Total number of unique depositors in the Silo",
        value: data.uniqueDepositors,
      },
    ],
    [data.totalDepositedBDV, data.totalStalk, data.uniqueDepositors],
  );

  return (
    <>
      <div className="hidden sm:flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
        {stats.map(({ label, subLabel, value }) => {
          return (
            <div key={`silo-stat-desktop-${label}`} className="flex flex-col flex-grow gap-1 sm:gap-2">
              <div className="pinto-sm-light sm:pinto-body-light font-thin">{label}</div>
              <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">{subLabel}</div>
              <TextSkeleton height="same-body" desktopHeight="h3" className="w-32" loading={isLoading}>
                <div className="pinto-body sm:pinto-h3">{isLoading ? "--" : value}</div>
              </TextSkeleton>
            </div>
          );
        })}
      </div>
      <Col className="flex sm:hidden gap-2 w-full">
        {stats.map(({ label, value }) => {
          return (
            <Row key={`silo-stat-mobile-${label}`} className="gap-2 items-center justify-between">
              <div className="pinto-xs">{label}</div>
              <TextSkeleton height="same-sm" desktopHeight="same-body" className="w-32" loading={isLoading}>
                <div className="pinto-sm text-end">{value}</div>
              </TextSkeleton>
            </Row>
          );
        })}
      </Col>
    </>
  );
};

// ---------- Deposited By Token Doughnut Chart ----------

const donutOptions = {
  layout: {
    padding: 12,
  },
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          return `% TVD: ${context.formattedValue}%`;
        },
      },
    },
  },
} as const;

const chartColors = [
  "#246645", // Pinto Green (pinto-green-3)
  "#1E6091", // Deep Blue
  "#D62828", // Vibrant Red
  "#8338EC", // Bright Purple
  "#FF9F1C", // Golden Orange
  "#00BCD4", // Light Blue / Cyan
];

// Memoize to prevent chart animations from re-rendering
const DepositedByTokenDoughnutChart = React.memo(
  (
    props: Omit<ReturnType<typeof useSiloStats>, "data"> & {
      setHoveredIndex: (index: number) => void;
    },
  ) => {
    const { siloWhitelistData, isLoading, setHoveredIndex } = props;

    const isMobile = useIsMobile();

    const donutChartProps = useMemo(() => {
      return {
        labels: Object.keys(siloWhitelistData),
        datasets: [
          {
            label: "",
            data: Object.values(siloWhitelistData).map((d) => d.siloDepositedRatio.mul(100).toNumber()),
            backgroundColor: chartColors,
            borderWidth: 0,
            offset: 2,
            borderRadius: 4,
          },
        ],
      };
    }, [siloWhitelistData]);

    return (
      <Col className="relative gap-4 items-center order-1 sm:order-2">
        <div className="flex flex-col self-stretch items-center">
          <DonutChart
            className={cn("w-72 h-72", isMobile && "w-52 h-52")}
            size={isMobile ? 200 : 350}
            data={donutChartProps}
            options={donutOptions}
            onHover={setHoveredIndex}
          />
        </div>
      </Col>
    );
  },
);

// ---------- Hooks ----------

const useUniqueDepositors = () => {
  const season = useSeason();
  const query = useSeasonalSiloActiveFarmers(Math.max(0, season - tabToSeasonalLookback(TimeTab.Week)), season);

  return {
    ...query,
    data: query.data?.length ? query.data[0].value : undefined,
  };
};

type SiloTokenDepositOverallDetails = {
  token: Token;
  depositedBDV: TokenValue;
  depositedAmount: TokenValue;
  siloDepositedRatio: TokenValue;
  optimalPctDepositedBdv: TokenValue;
  currentDepositedLPBDVRatio: TokenValue;
};

const baseObj: Omit<SiloTokenDepositOverallDetails, "token"> = {
  depositedBDV: TokenValue.ZERO,
  siloDepositedRatio: TokenValue.ZERO,
  depositedAmount: TokenValue.ZERO,
  optimalPctDepositedBdv: TokenValue.ZERO,
  currentDepositedLPBDVRatio: TokenValue.ZERO,
};

const reduceTotalDepositedBDV = (tokenData: ReturnType<typeof useSiloData>["tokenData"]) => {
  const entries = [...tokenData.entries()];
  return entries.reduce<TokenValue>((acc, [_, tokenData]) => acc.add(tokenData.depositedBDV), TokenValue.ZERO);
};

const useSiloStats = () => {
  const [totalDepositedBDV, setTotalDepositedBDV] = useState<TokenValue>(TokenValue.ZERO);
  const [byToken, setByToken] = useState<Record<string, SiloTokenDepositOverallDetails>>({});
  const whitelist = useWhitelistedTokens();

  const uniqueDepositors = useUniqueDepositors();
  const seedGauge = useSeedGauge();
  const silo = useSiloData();

  const gaugeDataLoaded = !!Object.values(seedGauge.data.gaugeData).length && !seedGauge.isLoading;
  const siloDataLoaded = !!silo.tokenData.size;

  const dataLoaded = gaugeDataLoaded && siloDataLoaded;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!dataLoaded) return;

    const totalBDV = reduceTotalDepositedBDV(silo.tokenData);

    // Only set data if data has changed.
    if (totalBDV.gt(0) && totalDepositedBDV.eq(totalBDV)) return;

    const map = whitelist.reduce<Record<string, SiloTokenDepositOverallDetails>>((prev, token) => {
      const obj = { token, ...baseObj };

      const wlTokenData = silo.tokenData.get(token);
      const tokenGaugeData = seedGauge.data.gaugeData[getTokenIndex(token)];

      if (wlTokenData) {
        obj.depositedBDV = wlTokenData.depositedBDV;
        obj.siloDepositedRatio = wlTokenData.depositedBDV.div(totalBDV);
        obj.depositedAmount = wlTokenData.totalDeposited;
      }

      if (tokenGaugeData) {
        obj.optimalPctDepositedBdv = tokenGaugeData.optimalPctDepositedBdv;
        obj.currentDepositedLPBDVRatio = tokenGaugeData.currentDepositedLPBDVRatio ?? TokenValue.ZERO;
      }

      prev[token.symbol] = obj;
      return prev;
    }, {});

    setTotalDepositedBDV(totalBDV);
    setByToken(map);
  }, [whitelist, silo.tokenData, seedGauge.data.gaugeData]);

  const isLoading = uniqueDepositors.isLoading || totalDepositedBDV.lte(0);

  return useMemo(() => {
    return {
      data: {
        totalDepositedBDV: totalDepositedBDV,
        uniqueDepositors: uniqueDepositors.data,
        totalStalk: silo.totalStalk,
      },
      siloWhitelistData: byToken,
      isLoading,
    };
  }, [totalDepositedBDV, uniqueDepositors.data, silo.totalStalk, byToken, isLoading]);
};

// ---------- FAQ COPY ----------

const FAQ_ITEMS: IBaseAccordionContent[] = [
  {
    key: "what-is-stalk",
    title: "What is Stalk?",
    content:
      "Stalk is a native Pinto asset representing your ownership share of the Silo. When Pinto trades above its value target, the protocol mints additional Pinto tokens and distributes them to the Silo and the Field. The larger your Stalk balance, the greater your share of those mints.",
  },
  {
    key: "how-do-i-get-more-stalk",
    title: "How do I get more Stalk?",
    content: (
      <div className="flex flex-col gap-2 pinto-sm font-thin text-pinto-light">
        <>There are two ways to increase your Stalk:</>
        <ul className="flex flex-col gap-1 pl-2 list-disc">
          <li>
            - Deposit more value into the Silo — every&nbsp;1 Pinto (or Pinto-denominated value) gives you&nbsp;1 Stalk.
          </li>
          <li>
            - Every season you stay in the silo, you earn Stalk based on the amount of seeds you have. Each seed earns
            1/10000 stalk. The amount of Seeds you have is based on the amount and token type you deposited in the Silo.
          </li>
        </ul>
      </div>
    ),
  },
  {
    key: "can-i-lose-stalk",
    title: "Can I lose Stalk?",
    content: (
      <>
        <span className="font-medium">Yes.</span> When you withdraw from the Silo, you forfeit all Stalk grown on the
        withdrawn amount, and it cannot be regained.
      </>
    ),
  },
  {
    key: "can-i-switch-my-deposit-type",
    title: "Can I switch my Deposit type?",
    content:
      "Yes! Pinto lets you Convert Pinto Deposits to LP Deposits while Pinto is above its value target, and LP Deposits back to Pinto Deposits when Pinto is below the target — all without losing Stalk. You can also Convert between LP types.",
  },
  {
    key: "how-can-i-maximize-stalk-growth",
    title: "How can I maximize Stalk growth?",
    content:
      "Maximize your Seeds. Seeds represent the rate at which Stalk grows. Note that the protocol may adjust Seed rates each Season to incentivize Converts and keep the system balanced.",
  },
  {
    key: "how-can-i-learn-more-about-the-silo",
    title: "How can I learn more about the Silo?",
    content: (
      <>
        Head to the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={`${navLinks.docs}/farm/silo`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Pinto docs
        </Link>{" "}
        for more info, or ask any questions in the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={navLinks.discord}
          rel="noopener noreferrer"
          target="_blank"
        >
          discord
        </Link>{" "}
        community!
      </>
    ),
  },
] as const;
