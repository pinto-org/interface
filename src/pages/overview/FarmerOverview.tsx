import { TokenValue } from "@/classes/TokenValue";
import EmptyTable from "@/components/EmptyTable";
import FarmerDepositsTable from "@/components/FarmerDepositsTable";
import GerminationNotice from "@/components/GerminationNotice";
import HelperLink from "@/components/HelperLink";
import OverviewNoticeDeposit from "@/components/OverviewNoticeDeposit";
import PlotsTable from "@/components/PlotsTable";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import PageContainer from "@/components/ui/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { useHarvestableIndex, useTemperature } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { getClaimText } from "@/utils/string";
import { StatPanelData } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  // Hooks
  const farmerSilo = useFarmerSiloNew();
  const farmerField = useFarmerField();
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const farmerBalances = useFarmerBalances();
  const siloData = useSiloData();
  const harvestableIndex = useHarvestableIndex();
  const priceData = usePriceData();
  const navigate = useNavigate();
  const { submitClaimRewards } = useClaimRewards();

  const hasDeposits = farmerActions.totalValue.silo.gt(0);
  const hasPods = farmerActions.totalValue.field.gt(0);
  const hasDepositsOrPods = hasDeposits || hasPods;
  const hasOnlyPods = hasPods && !hasDeposits;
  const hasUndepositedMainTokens = Boolean(farmerBalances.balances.get(tokenData.mainToken)?.total.gt(0));
  const hasGerminatingDeposits = farmerSilo.germinatingStalkBalance.gt(0);

  // State
  const [currentTab, setCurrentTab] = useState(hasOnlyPods ? "pods" : "deposits");
  const [hoveredButton, setHoveredButton] = useState("");

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

    return { siloPct, claimSiloPct, harvestSiloPct, stalkPerSeason, placesInLine };
  }, [farmerSilo, farmerField, farmerActions, siloData, harvestableIndex]);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const claimEnabled = farmerActions.claimRewards.enabled;
  const claimableText = getClaimText(
    farmerActions.claimRewards.outputs.beanGain,
    farmerActions.claimRewards.outputs.stalkGain,
    farmerActions.claimRewards.outputs.seedGain,
  );
  const hasNoEarnedBeans = farmerActions.tokenTotals.get(tokenData.mainToken)?.sources.plant?.beanGain.eq(0);

  // Stat panel data
  const statPanelData: Record<"stalk" | "pods" | "seeds" | "depositedValue", StatPanelData> = {
    depositedValue: {
      mode: "depositedValue",
      mainValue: farmerSilo.depositsUSD,
      mainValueChange:
        hoveredButton === "claim"
          ? farmerActions.claimRewards.outputs.bdvGain.mul(priceData.price)
          : farmerActions.harvestPods.outputs.bdvGain.mul(priceData.price),
      secondaryValue: farmerSilo.depositsBDV,
      actionValue:
        hoveredButton === "claim"
          ? farmerActions.claimRewards.outputs.bdvGain
          : farmerActions.harvestPods.outputs.bdvGain,
      showActionValues: hoveredButton === "claim" /* || hoveredButton === "harvest" */,
    },
    stalk: {
      mode: "stalk",
      mainValue: farmerSilo.activeStalkBalance,
      auxValue: farmerSilo.germinatingStalkBalance,
      mainValueChange:
        hoveredButton === "claim"
          ? farmerActions.claimRewards.outputs.stalkGain.add(farmerActions.updateDeposits.totalGains.stalkGain)
          : farmerActions.harvestPods.outputs.stalkGain,
      actionValue: hoveredButton === "claim" ? claimSiloPct.sub(siloPct) : harvestSiloPct.sub(siloPct),
      secondaryValue: siloPct,
      tooltipContent:
        "Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn.",
      showActionValues: hoveredButton === "claim" /* || hoveredButton === "harvest" */,
    },
    seeds: {
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
      tooltipContent: "Seeds grow Stalk every Season, creating the time weighted staking mechanism that is the Silo.",
      showActionValues: hoveredButton !== "" && hoveredButton !== "harvest",
    },
    pods: {
      mode: "pods",
      mainValue: farmerField.totalUnharvestablePods.add(farmerField.totalHarvestablePods),
      mainValueChange: farmerActions.harvestPods.outputs.podGain,
      secondaryValue: placesInLine[0],
      tooltipContent: "The number of Pods that need to Harvest before your next place in the Pod Line.",
      showActionValues: hoveredButton === "harvest",
    },
  };

  const renderContent = () => (
    <>
      <div className="flex flex-col justify-center relative action-container">
        <div className="flex flex-col items-center">
          <div data-action-target="stats">
            <StatPanel {...(hasOnlyPods ? statPanelData.pods : statPanelData.depositedValue)} size="large" />
          </div>
        </div>
        <div className="grid grid-flow-col grid-cols-3 mt-[4.5rem] gap-[4.5rem] self-center whitespace-nowrap">
          <StatPanel {...(hasOnlyPods ? statPanelData.depositedValue : statPanelData.stalk)} />
          <StatPanel {...(hasOnlyPods ? statPanelData.stalk : statPanelData.seeds)} />
          <StatPanel {...(hasOnlyPods ? statPanelData.seeds : statPanelData.pods)} />
          {statPanelData.pods.mainValue && !hasOnlyPods && (
            <HelperLink
              onClick={() =>
                navigate(statPanelData.pods.mainValueChange?.lt(0) ? "/field?action=harvest" : "/field?action=sow")
              }
              text={statPanelData.pods.mainValueChange?.lt(0) ? "Harvest Pods" : "Sow (Lend) in the Field for Pods"}
              className={`absolute -mt-[54px] right-[48px] z-20`}
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
          {hasOnlyPods && (
            <HelperLink
              onClick={() => navigate("/silo")}
              text={"Make your first Deposit in the Silo for Stalk and Seeds"}
              className={`absolute -mt-[64px] left-[64px] z-20 flex flex-row-reverse`}
              dataTarget="depositedValue-stats"
              sourceAnchor="right"
              targetAnchor="top-left"
              source90Degree={true}
              perpLength={5}
            />
          )}
          {hasNoEarnedBeans && (
            <HelperLink
              text={claimableText}
              dataTarget="stalk-stats"
              className="absolute -mt-[64px] left-[64px] flex flex-row-reverse"
              sourceAnchor="right"
              targetAnchor="top-left"
              source90Degree={true}
              perpLength={10}
              onMouseEnter={() => setHoveredButton("claim")}
              onMouseLeave={() => setHoveredButton("")}
              onClick={submitClaimRewards}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {hasGerminatingDeposits ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="-mt-40 -mb-[156px] w-full"
          >
            <GerminationNotice type="multiple" deposits={farmerSilo.deposits} />
          </motion.div>
        ) : hasUndepositedMainTokens ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="-mt-40 -mb-[156px] w-full"
          >
            <OverviewNoticeDeposit />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex flex-col items-center">
        <Tabs defaultValue="deposits" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList
            className={`h-0 bg-transparent p-0 border-0 -ml-3 flex ${hasOnlyPods ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
          >
            <TabsTrigger
              className="font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
              value="deposits"
            >
              My Deposits
            </TabsTrigger>
            <TabsTrigger
              className="font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
              value="pods"
            >
              My Pods
            </TabsTrigger>
          </TabsList>
          {/*convertEnabled && convertFrom && convertTo && currentTab === "deposits" && (
            <HelperLink
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              text="Convert Available"
              dataTarget="convert"
              className="absolute -ml-[246px] -mt-[8px]"
              sourceAnchor="bottom"
              targetAnchor="top"
              onMouseEnter={() => setHoveredButton("convert")}
              onMouseLeave={() => setHoveredButton("")}
            />
          )*/}
          <TabsContent className="mt-8" value="deposits">
            {hasDeposits ? (
              <div className="relative overflow-visible">
                <FarmerDepositsTable hovering={hoveredButton === "claim"} />
                {convertEnabled && convertFrom && convertTo && (
                  <TableRowConnector
                    fromTarget={`token-row-${convertFrom.address}`}
                    toTarget={`token-row-${convertTo.address}`}
                    color="#246645"
                    extensionLength={40}
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
                <div className="absolute right-0 top-20 h-4" data-action-target="helper-target" />
                {currentTab === "deposits" && claimEnabled && !hasNoEarnedBeans && (
                  <HelperLink
                    text={claimableText}
                    dataTarget="helper-target"
                    className="absolute -right-[100px] top-8"
                    sourceAnchor="left"
                    targetAnchor="right"
                    source90Degree={true}
                    perpLength={10}
                    onMouseEnter={() => setHoveredButton("claim")}
                    onMouseLeave={() => setHoveredButton("")}
                    onClick={submitClaimRewards}
                  />
                )}
              </div>
            ) : (
              <EmptyTable type="deposits" />
            )}
          </TabsContent>
          <TabsContent className="mt-8" value="pods">
            {hasPods ? (
              <div className="overflow-clip">
                <PlotsTable showClaimable />
              </div>
            ) : (
              <EmptyTable type="plots" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  return (
    <div
      className={`flex flex-col ${hasDepositsOrPods ? "pt-[170px]" : "justify-center text-center min-h-[calc(100vh-15rem)]"} gap-52 pb-20`}
    >
      <PageContainer
        className={`flex flex-col gap-52 -mt-4 ${!hasDepositsOrPods ? "sm:max-w-[1150px] flex-grow mt-[100px]" : ""}`}
      >
        {renderContent()}
      </PageContainer>
    </div>
  );
};

export default Overview;
