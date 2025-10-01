import { TokenValue } from "@/classes/TokenValue";
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
import ConvertUpOrderbookDialog from "@/components/Tractor/ConvertUpOrderbook";
import ConvertUpTractorOrderBookChart from "@/components/Tractor/ConvertUpTractorOrderBookChart";
import ConvertUpTractorOrders from "@/components/Tractor/ConvertUpTractorOrders";
import { TractorConvertUpOrdersPanel } from "@/components/Tractor/farmer-orders/TractorOrdersPanel";
import { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import * as Tabs from "@/components/ui/Tabs";
import { PINTO_WETH_TOKEN, PINTO_WSOL_TOKEN } from "@/constants/tokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsSmallDesktop from "@/hooks/display/useIsSmallDesktop";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import { useSeasonalSiloActiveFarmers } from "@/state/seasonal/seasonalDataHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import useTokenData, { useWhitelistedTokens } from "@/state/useTokenData";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { getClaimText, stringEq } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { StatPanelData, Token } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SiloConvertUpContent } from "./silo/SiloConvertUpContent";
import SiloConvertUpStats from "./silo/SiloConvertUpStats";
import SiloTable from "./silo/SiloTable";

const VALUE_TARGET = 1;

function Silo() {
  const farmerSilo = useFarmerSilo(undefined, true);
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const priceData = usePriceData();
  const mainToken = tokenData.mainToken;
  const { submitClaimRewards } = useClaimRewards();
  const navigate = useNavigate();
  const isSmallDesktop = useIsSmallDesktop();

  const pintoWETHLP = useChainConstant(PINTO_WETH_TOKEN);
  const pintoWSOLLP = useChainConstant(PINTO_WSOL_TOKEN);

  const [hoveredButton, setHoveredButton] = useState("");
  const [showConvertUpOrderDialog, setShowConvertUpOrderDialog] = useState(false);
  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  // Only show Convert Up Helper Links
  const isBelowValueTarget = priceData.price.lt(VALUE_TARGET);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled && isBelowValueTarget;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const bestDepositToken = farmerActions.optimalDepositToken?.token;
  const bestDeposit =
    bestDepositToken && !tokensEqual(bestDepositToken, pintoWETHLP) && !tokensEqual(bestDepositToken, pintoWSOLLP)
      ? bestDepositToken
      : undefined;

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
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full max-w-full overflow-hidden">
              <div className="flex flex-col gap-4 sm:gap-12 w-full">
                <div className="relative action-container flex flex-1 min-w-0">
                  <SiloTable hovering={hoveredButton === "claim"} />
                  {claimEnabled && !showConvertUpOrderDialog && false && (
                    <HelperLink
                      text={claimableText}
                      className={cn(
                        "absolute -right-[90px] max-[1800px]:-right-[215px] top-8 max-[1800px]:whitespace-break-spaces max-[1800px]:w-[160px]",
                        showConvertUpOrderDialog && "hidden",
                      )}
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
                </div>
                <SiloConvertUpContent />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col w-full gap-8">
            <div className="w-full">
              <SiloStats />
            </div>
          </div> */}
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

/*convertEnabled && convertFrom && convertTo && (
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
        {/* This should stay commented out
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
        </div>*/
/*}
      </div>
    }
  />
)
{enablePintoToLPHelper && (
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
)}
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
*/
