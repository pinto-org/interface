import { TokenValue } from "@/classes/TokenValue";
import ClaimRewards from "@/components/ClaimRewards";
import EmptyTable from "@/components/EmptyTable";
import FarmerDepositsTable from "@/components/FarmerDepositsTable";
import HelperLink from "@/components/HelperLink";
import PlotsTable from "@/components/PlotsTable";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useHarvestableIndex, useTemperature } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { getClaimText } from "@/utils/string";
import { StatPanelData } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Overview = () => {
  // Hooks
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerActions = useFarmerActions();
  const siloData = useSiloData();
  const temperature = useTemperature();
  const harvestableIndex = useHarvestableIndex();
  const priceData = usePriceData();
  const navigate = useNavigate();
  const { submitClaimRewards } = useClaimRewards();

  const hasDeposits = farmerActions.totalValue.silo.gt(0);
  const hasPods = farmerActions.totalValue.field.gt(0);
  const hasDepositsOrPods = hasDeposits || hasPods;
  const hasOnlyPods = hasPods && !hasDeposits;

  // State
  const [currentTab, setCurrentTab] = useState(hasOnlyPods ? "pods" : "deposits");
  const [hoveredButton, setHoveredButton] = useState("");

  // Memoized calculations
  const { siloPct, claimSiloPct, harvestSiloPct, stalkPerSeason, placesInLine, avgAPY } = useMemo(() => {
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

    const siloTokens = Array.from(siloData.tokenData.entries());
    const avgAPY = (
      siloTokens.reduce((total, token) => token[1].yields.beanAPY + total, 0) / siloTokens.length
    ).toFixed(2);

    return { siloPct, claimSiloPct, harvestSiloPct, stalkPerSeason, placesInLine, avgAPY };
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

  // Stat panel data
  const statPanelData: Record<"stalk" | "pods" | "seeds" | "depositedValue", StatPanelData> = {
    depositedValue: {
      mode: "depositedValue",
      mainValue: farmerSilo.depositsUSD,
      mainValueChange:
        hoveredButton === "harvest" ? farmerActions.harvestPods.outputs.bdvGain.mul(priceData.price) : undefined,
      secondaryValue: farmerSilo.depositsBDV,
      actionValue: hoveredButton === "harvest" ? farmerActions.harvestPods.outputs.bdvGain : undefined,
      showActionValues: hoveredButton === "harvest",
      tooltipContent: "Your Pinto Denominated Value in the Silo.",
    },
    stalk: {
      mode: "stalk",
      mainValue: farmerSilo.activeStalkBalance,
      mainValueChange: hoveredButton === "harvest" ? farmerActions.harvestPods.outputs.stalkGain : undefined,
      actionValue: hoveredButton === "harvest" ? harvestSiloPct.sub(siloPct) : undefined,
      secondaryValue: siloPct,
      tooltipContent:
        "Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn.",
      showActionValues: hoveredButton === "harvest",
    },
    seeds: {
      mode: "seeds",
      mainValue: farmerSilo.activeSeedsBalance,
      mainValueChange: hoveredButton === "harvest" ? farmerActions.harvestPods.outputs.seedGain : undefined,
      actionValue: hoveredButton === "harvest" ? farmerActions.harvestPods.outputs.seedGain : undefined,
      secondaryValue: stalkPerSeason,
      tooltipContent: "Seeds grow Stalk every Season, creating an opportunity cost to leaving the Silo.",
      showActionValues: hoveredButton === "harvest",
    },
    pods: {
      mode: "pods",
      mainValue: farmerField.totalUnharvestablePods.add(farmerField.totalHarvestablePods),
      mainValueChange: farmerActions.harvestPods.outputs.podGain,
      secondaryValue: placesInLine[0],
      tooltipContent:
        "The number of Pods that need to become redeemable before your next Plot reaches the front of the Pod Line.",
      showActionValues: hoveredButton === "harvest",
    },
  };

  // Scroll back to top when mounting
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // Render helpers
  const renderEmptyState = () => (
    <div className="flex flex-row justify-between gap-8">
      <Button
        asChild
        variant="outline"
        className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 flex-1 h-[33rem] rounded-full gap-4"
      >
        <Link to="/silo">
          <span className="text-pinto-h1 text-black">Deposit in the Silo</span>
          <span className="text-pinto-body text-pinto-gray-4">Deposits in the Silo receive Stalk and Seeds,</span>
          <span className="text-pinto-body text-pinto-gray-4">and yield additional Pinto when the supply expands.</span>
          {Number(avgAPY) > 0 && <span className="text-pinto-h1 text-pinto mt-4">{`${avgAPY}% average vAPY`}</span>}
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 flex-1 h-[33rem] rounded-full gap-4"
      >
        <Link to="/field">
          <span className="text-pinto-h1 text-black">Lend in the Field</span>
          <span className="text-pinto-body text-pinto-gray-4">
            Assets lent to Pinto are exchanged for Pods, the Pinto debt asset.
          </span>
          <span className="text-pinto-body text-pinto-gray-4">
            Pods are redeemable for one Pinto when they reach the front of the Pod Line.
          </span>
          {temperature.max.gt(0) && (
            <span className="text-pinto-h1 text-pinto mt-4">{`${temperature.max.toHuman()}% interest rate`}</span>
          )}
        </Link>
      </Button>
    </div>
  );

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
              onClick={() => navigate(statPanelData.pods.mainValueChange?.lt(0) ? "/field/harvest" : "/field/sow")}
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
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Tabs defaultValue="deposits" className="w-[1150px]" value={currentTab} onValueChange={setCurrentTab}>
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
                {currentTab === "deposits" && claimEnabled && (
                  <HelperLink
                    text={claimableText}
                    dataTarget="claimable-rewards"
                    className="absolute -right-[100px] top-[0px]"
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
        className={`flex flex-col gap-52 -mt-4 ${!hasDepositsOrPods ? "sm:max-w-full flex-grow mt-[100px]" : ""}`}
      >
        {hasDepositsOrPods ? renderContent() : renderEmptyState()}
      </PageContainer>
    </div>
  );
};

export default Overview;
