import { TokenValue } from "@/classes/TokenValue";
import ActionsMenu from "@/components/ActionsMenu";
import EmptyTable from "@/components/EmptyTable";
import FarmerDepositsTable from "@/components/FarmerDepositsTable";
import GerminationNotice from "@/components/GerminationNotice";
import HelperLink, { hoveredIdAtom } from "@/components/HelperLink";
import OverviewNoticeDeposit from "@/components/OverviewNoticeDeposit";
import PlotsTable from "@/components/PlotsTable";
import StatPanel from "@/components/StatPanel";
import StatPanelAltDisplay from "@/components/StatPanelAltDisplay";
import TableRowConnector from "@/components/TableRowConnector";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsSmallDesktop from "@/hooks/display/useIsSmallDesktop";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useHarvestableIndex, useTotalSoil } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useSiloWrappedTokenToUSD } from "@/state/useSiloWrappedTokenData";
import useTokenData from "@/state/useTokenData";
import { getClaimText } from "@/utils/string";
import { StatPanelData } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TractorOrdersPanel from "../field/TractorOrdersPanel";

const Overview = () => {
  // Hooks
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const farmerBalances = useFarmerBalances();
  const siloData = useSiloData();
  const harvestableIndex = useHarvestableIndex();
  const priceData = usePriceData();
  const totalSoil = useTotalSoil().totalSoil;

  const navigate = useNavigate();
  const { submitClaimRewards } = useClaimRewards();

  const isSmallDesktop = useIsSmallDesktop();

  const mainToken = tokenData.mainToken;

  const siloWrappedToken = tokenData.siloWrappedToken;
  const siloWrappedInternal = farmerBalances.balances.get(siloWrappedToken)?.internal || TokenValue.ZERO;
  const siloWrappedExternal = farmerBalances.balances.get(siloWrappedToken)?.external || TokenValue.ZERO;
  const siloWrappedValueUSD = useSiloWrappedTokenToUSD(farmerBalances.balances.get(siloWrappedToken)?.total).totalUSD;

  const depositValue = farmerSilo.depositsUSD;
  const claimableValue = farmerActions.claimRewards.outputs.beanGain;
  const floodValue = farmerActions.floodAssets.totalValue;
  const internalBalance = farmerActions.totalValue.wallet.internal;

  const valueInSystem = farmerSilo.depositsUSD
    .add(siloWrappedValueUSD)
    .add(internalBalance)
    .add(floodValue)
    .add(claimableValue);

  const hasDeposits = farmerActions.totalValue.silo.gt(0);
  const hasPods = farmerActions.totalValue.field.gt(0);
  const hasValue = valueInSystem.gt(0);
  const isSoilAvailable = totalSoil.gt(0);
  const hasDepositsOrPods = hasDeposits || hasPods || hasValue;
  const hasOnlyPods = hasPods && !hasDeposits && !hasValue;
  const hasUndepositedMainTokens = Boolean(farmerBalances.balances.get(mainToken)?.total.gt(0));
  const hasGerminatingDeposits = Array.from(farmerSilo.deposits.values()).some((depositData) =>
    depositData.deposits.some((deposit) => deposit.isGerminating && !deposit.isPlantDeposit),
  );

  const canWrap = farmerActions.canWrapPinto;
  const enablePintoToLPHelper = farmerSilo.deposits.get(mainToken)?.convertibleAmount.gt(0) && priceData.deltaB.gt(100);

  // Get mobile status from hook
  const isMobile = useIsMobile();

  // State
  const [currentTab, setCurrentTab] = useState<"deposits" | "pods" | "tractor">(() => {
    // Default to "pods" on mobile, or if hasOnlyPods is true on desktop
    if (isMobile) {
      return "pods";
    } else {
      return hasOnlyPods ? "pods" : "deposits";
    }
  });
  const [hoveredButton, setHoveredButton] = useState("");

  const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);
  useEffect(() => {
    setHoveredId("");
  }, []);

  // Memoized calculations
  const { siloPct, claimSiloPct, harvestSiloPct, stalkPerSeason, placesInLine } = useMemo(() => {
    const siloPct = siloData.totalStalk.gt(0)
      ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100)
      : TokenValue.ZERO;

    const claimSiloPct = siloData.totalStalk.gt(0)
      ? farmerSilo.activeStalkBalance
          .add(farmerActions.claimRewards.outputs.stalkGain)
          .div(siloData.totalStalk)
          .mul(100)
      : TokenValue.ZERO;

    const harvestSiloPct = siloData.totalStalk.gt(0)
      ? farmerSilo.activeStalkBalance.add(farmerActions.harvestPods.outputs.stalkGain).div(siloData.totalStalk).mul(100)
      : TokenValue.ZERO;

    const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

    const placesInLine = farmerField.plots
      .map((plot) => plot.index.sub(harvestableIndex))
      .sort((a, b) => Number(a.sub(b).toHuman()));

    return {
      siloPct,
      claimSiloPct,
      harvestSiloPct,
      stalkPerSeason,
      placesInLine,
    };
  }, [farmerSilo, farmerField, farmerActions, siloData, harvestableIndex]);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const claimEnabled =
    (farmerActions.claimRewards.enabled && farmerActions.claimRewards.outputs.stalkGain.gt(0.01)) ||
    farmerActions.updateDeposits.enabled;
  const claimableText = getClaimText(
    farmerActions.claimRewards.outputs.beanGain,
    farmerActions.claimRewards.outputs.stalkGain.add(farmerActions.updateDeposits.totalGains.stalkGain),
    farmerActions.claimRewards.outputs.seedGain,
  );
  const hasNoEarnedBeans = Boolean(
    farmerActions.tokenTotals.get(tokenData.mainToken)?.sources.plant?.beanGain.lt(0.01),
  );

  // Stat panel data
  const statPanelData: Record<"stalk" | "pods" | "seeds" | "depositedValue", StatPanelData> = {
    depositedValue: {
      title: hasOnlyPods ? "My Deposited Value" : "My Total Value in Pinto",
      mode: "depositedValue",
      mainValue: valueInSystem,
      mainValueChange:
        hoveredButton === "claim" ? TokenValue.ZERO : farmerActions.harvestPods.outputs.bdvGain.mul(priceData.price),
      secondaryValue: valueInSystem,
      actionValue:
        hoveredButton === "claim"
          ? farmerActions.claimRewards.outputs.bdvGain
          : farmerActions.harvestPods.outputs.bdvGain,
      showActionValues: hoveredButton === "claim" /* || hoveredButton === "harvest" */,
      isLoading: farmerSilo.isLoading,
    },
    stalk: {
      title: "My Stalk",
      mode: "stalk",
      mainValue: farmerSilo.activeStalkBalance,
      auxValue: farmerSilo.germinatingStalkBalance,
      mainValueChange:
        hoveredButton === "claim"
          ? farmerActions.claimRewards.outputs.stalkGain.add(farmerActions.updateDeposits.totalGains.stalkGain)
          : farmerActions.harvestPods.outputs.stalkGain,
      actionValue: hoveredButton === "claim" ? claimSiloPct.sub(siloPct) : harvestSiloPct.sub(siloPct),
      secondaryValue: siloPct,
      tooltipContent: (
        <span>
          Your ownership of the Stalk supply determines the portion of Pinto
          <br />
          supply increases that you earn.{" "}
          <Link to="/explorer/silo" className="text-pinto-green-4 hover:underline transition-all">
            See total Stalk supply over time →
          </Link>
        </span>
      ),
      showActionValues: hoveredButton === "claim" /* || hoveredButton === "harvest" */,
      isLoading: farmerSilo.isLoading,
    },
    seeds: {
      title: "My Seeds",
      mode: "seeds",
      mainValue: farmerSilo.activeSeedsBalance,
      mainValueChange:
        hoveredButton === "convert"
          ? farmerActions.convertDeposits.bestConversion.outputs.seedGain
          : hoveredButton === "claim"
            ? farmerActions.claimRewards.outputs.seedGain.add(farmerActions.updateDeposits.totalGains.seedGain)
            : farmerActions.harvestPods.outputs.seedGain,
      actionValue:
        hoveredButton === "convert"
          ? farmerActions.convertDeposits.bestConversion.outputs.seedGain
          : hoveredButton === "claim"
            ? farmerActions.claimRewards.outputs.seedGain.add(farmerActions.updateDeposits.totalGains.seedGain)
            : farmerActions.harvestPods.outputs.seedGain,
      secondaryValue: stalkPerSeason,
      tooltipContent: "Seeds grow 1/10,000 Stalk each Season.",
      showActionValues: hoveredButton !== "" && hoveredButton !== "harvest" && hoveredButton !== "wrap",
      isLoading: farmerSilo.isLoading,
    },
    pods: {
      title: "My Pods",
      mode: "pods",
      mainValue: farmerField.totalUnharvestablePods.add(farmerField.totalHarvestablePods),
      mainValueChange: farmerActions.harvestPods.outputs.podGain,
      secondaryValue: placesInLine[0],
      tooltipContent: "The number of Pods that need to Harvest before your next place in the Pod Line.",
      showActionValues: hoveredButton === "harvest",
      isLoading: farmerSilo.isLoading,
    },
  };

  const renderContent = () => (
    <>
      <div className="flex flex-col justify-center relative action-container mt-6 sm:mt-0">
        <div className="flex flex-col sm:items-center items-start">
          <div data-action-target="stats">
            <StatPanel
              {...(hasOnlyPods ? statPanelData.pods : statPanelData.depositedValue)}
              altDisplay={
                !hasOnlyPods && (
                  <StatPanelAltDisplay
                    depositedValue={depositValue}
                    claimableValue={claimableValue}
                    siloWrappedValue={siloWrappedValueUSD}
                    siloWrappedInternal={siloWrappedInternal}
                    siloWrappedExternal={siloWrappedExternal}
                    farmBalance={internalBalance}
                    claimableFlood={floodValue}
                    setHoveredButton={setHoveredButton}
                  />
                )
              }
              size="large"
            />
          </div>
        </div>
        <div className="grid mt-8 gap-8 grid-rows-3 self-start sm:grid-cols-3 sm:grid-rows-none sm:mt-[4.5rem] sm:gap-[4.5rem] sm:self-center whitespace-nowrap w-screen max-w-6xl">
          <StatPanel {...(hasOnlyPods ? statPanelData.depositedValue : statPanelData.stalk)} />
          <StatPanel {...(hasOnlyPods ? statPanelData.stalk : statPanelData.seeds)} />
          <StatPanel {...(hasOnlyPods ? statPanelData.seeds : statPanelData.pods)} />
          {(statPanelData.pods.mainValue.eq(0) || (statPanelData.pods.mainValueChange?.lt(0) && !hasOnlyPods)) &&
            isSoilAvailable && (
              <HelperLink
                onClick={() =>
                  navigate(statPanelData.pods.mainValueChange?.lt(0) ? "/field?action=harvest" : "/field?action=sow")
                }
                text={statPanelData.pods.mainValueChange?.lt(0) ? "Harvest Pods" : "Sow (Lend) in the Field for Pods"}
                className={`absolute -mt-[13.75rem] -right-52 whitespace-break-spaces w-[140px] z-20 2xl:whitespace-normal 2xl:w-auto`}
                dataTarget="pods-stats"
                sourceAnchor="left"
                targetAnchor="right"
                source90Degree={true}
                perpLength={10}
                onMouseEnter={() => {
                  setHoveredButton(statPanelData.pods.mainValueChange?.gte(0) ? "" : "harvest");
                }}
                onMouseLeave={() => setHoveredButton("")}
              />
            )}
          {/*hasOnlyPods && (
            <HelperLink
              onClick={() => navigate("/silo")}
              text={"Deposit in the Silo for Stalk and Seeds"}
              className={`absolute -mt-[13.75rem] left-16 z-20 flex flex-row-reverse whitespace-break-spaces w-[140px] 2xl:whitespace-normal 2xl:w-auto`}
              dataTarget="depositedValue-stats"
              sourceAnchor="right"
              targetAnchor="top-left"
              source90Degree={true}
              perpLength={5}
            />
          )*/}
          {/*hasNoEarnedBeans && claimEnabled && (
            <HelperLink
              text={claimableText}
              dataTarget="stalk-stats"
              className="absolute -mt-16 left-16 z-20 flex flex-row-reverse whitespace-break-spaces w-[140px] 2xl:whitespace-normal 2xl:w-auto"
              sourceAnchor="right"
              targetAnchor="top-left"
              source90Degree={true}
              perpLength={10}
              onMouseEnter={() => setHoveredButton("claim")}
              onMouseLeave={() => setHoveredButton("")}
              onClick={submitClaimRewards}
            />
          )*/}
        </div>
      </div>
      <AnimatePresence>
        {hasGerminatingDeposits ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:-mt-20 sm:-mb-16 w-full"
          >
            <GerminationNotice type="multiple" deposits={farmerSilo.deposits} />
          </motion.div>
        ) : hasUndepositedMainTokens ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:-mt-20 sm:-mb-16 w-full"
          >
            <OverviewNoticeDeposit />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex flex-col items-center">
        <Tabs
          defaultValue="deposits"
          className="w-full"
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as "deposits" | "pods" | "tractor")}
        >
          <TabsList className="h-0 bg-transparent p-0 border-0 -ml-3 flex flex-row justify-start">
            {/* Conditionally render My Deposits and My Pods based on hasOnlyPods */}
            {hasOnlyPods ? (
              <>
                <TabsTrigger
                  className="font-[400] text-[1.5rem] sm:text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="pods"
                >
                  My Pods
                </TabsTrigger>
                <TabsTrigger
                  className="font-[400] text-[1.5rem] sm:text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="deposits"
                >
                  My Deposits
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger
                  className="font-[400] text-[1.5rem] sm:text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="deposits"
                >
                  My Deposits
                </TabsTrigger>
                <TabsTrigger
                  className="font-[400] text-[1.5rem] sm:text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="pods"
                >
                  My Pods
                </TabsTrigger>
              </>
            )}

            {/* Always render My Tractor Orders last */}
            <TabsTrigger
              className="hidden sm:flex font-[400] text-[1.5rem] sm:text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
              value="tractor"
            >
              My Tractor Orders
            </TabsTrigger>
          </TabsList>
          {/*convertEnabled && convertFrom && convertTo && currentTab === "deposits" && (
            <HelperLink
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              text="Convert Available"
              dataTarget="convert"
              className="absolute -ml-[11.25rem] -mt-[0.5rem] flex justify-center"
              sourceAnchor="bottom"
              targetAnchor="top"
              onMouseEnter={() => setHoveredButton("convert")}
              onMouseLeave={() => setHoveredButton("")}
            />
          ) */}
          <TabsContent className="mt-8" value="deposits">
            {hasDeposits ? (
              <div className="relative overflow-visible">
                <FarmerDepositsTable hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} />
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
                      <div>
                        <div
                          data-action-target="convert"
                          className="cursor-pointer convert-color text-[1.25rem] font-[340] tracking-[-0.025rem] leading-[1.375rem] text-end"
                          // @ts-ignore
                          style={{ "--convert-color": convertFrom.color }}
                          onClick={() => navigate(getSiloConvertUrl(convertFrom, convertTo))}
                        >
                          {`Convert ${convertFrom.name}`}
                        </div>
                      </div>
                    }
                  />
                )}
                {/*enablePintoToLPHelper && (
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
                          onClick={() => navigate(`/silo/${mainToken.address}?action=convert&mode=max`)}
                        >
                          {`Convert ${mainToken.name} to LP`}
                        </div>
                        <div className="flex flex-col gap-4">
                          <div data-action-target="convert" className="pinto-sm-light text-pinto-gray-4 text-end">
                            {`Arbitrage the increased price of Pinto for an increase in Seeds`}
                          </div>
                        </div>
                      </div>
                    }
                  />
                )*/}
                {/* <div className="absolute right-0 top-20 h-4" data-action-target="helper-target" />
                {currentTab === "deposits" && canWrap && (
                  <HelperLink
                    text={"Wrap Deposited Pinto"}
                    dataTarget={`token-row-${mainToken.address}`}
                    className={`absolute max-[1750px]:-right-[15.625rem] -right-[17.625rem]  ${claimEnabled ? "max-[1600px]:top-[9.425rem] max-[1750px]:top-[9.3775rem] top-[9.375rem]" : "max-[1600px]:top-[4.975rem] max-[1750px]:top-[4.9rem]  top-[4.85rem]"} ${hoveredButton === "wrap" ? "z-10" : "z-1"}`}
                    sourceAnchor="left"
                    targetAnchor="right"
                    source90Degree={true}
                    perpLength={0}
                    onMouseEnter={() => setHoveredButton("wrap")}
                    onMouseLeave={() => setHoveredButton("")}
                    component={
                      <span className="inline-flex items-center gap-1 pinto-body-light text-pinto-gray-3 hover:text-pinto-green-4 transition-colors cursor-pointer">
                        <IconImage src={siloWrappedToken.logoURI} size={6} /> <span>Wrap Deposited Pinto</span>
                      </span>
                    }
                    onClick={() => navigate(`/wrap`)}
                  />
                )} */}
              </div>
            ) : (
              <EmptyTable type="deposits" />
            )}
          </TabsContent>
          <TabsContent className="mt-8" value="pods">
            {hasPods ? (
              <div className="overflow-clip">
                <PlotsTable showClaimable disableHover />
              </div>
            ) : (
              <EmptyTable type="plots" />
            )}
          </TabsContent>
          <TabsContent className="mt-8" value="tractor">
            <div className="overflow-visible">
              <TractorOrdersPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ActionsMenu showOnTablet />
    </>
  );

  return (
    <div
      className={`flex flex-col ${hasDepositsOrPods ? "pt-12 sm:pt-[3.75rem]" : "justify-center text-center min-h-[calc(100vh-15rem)]"} gap-52 pb-20`}
    >
      <PageContainer
        className={`flex flex-col gap-16 sm:gap-28 3xl:gap-28 -mt-4 ${!hasDepositsOrPods ? "sm:max-w-[1150px] flex-grow sm:mt-[100px]" : ""}`}
        variant={"lgAlt"}
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
};

export default Overview;
