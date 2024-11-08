import { TokenValue } from "@/classes/TokenValue";
import FarmerDepositsTable from "@/components/FarmerDepositsTable";
import HelperLink from "@/components/HelperLink";
import PlotsTable from "@/components/PlotsTable";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Text from "@/components/ui/Text";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFieldData } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Overview() {
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerActions = useFarmerActions();
  const siloData = useSiloData();
  const fieldData = useFieldData();
  const priceData = usePriceData();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("deposits");
  const [hoveredButton, setHoveredButton] = useState("");

  // Calculate key stats
  const siloPct = siloData.totalStalk.gt(0)
    ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100)
    : TokenValue.ZERO;
  const claimSiloPct = siloData.totalStalk.gt(0)
    ? farmerSilo.activeStalkBalance.add(farmerActions.claimRewards.outputs.stalkGain).div(siloData.totalStalk).mul(100)
    : TokenValue.ZERO;
  const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);
  const placesInLine = farmerField.plots
    .map((plot) => plot.index.sub(fieldData.harvestableIndex))
    .sort((a, b) => Number(a.sub(b).toHuman()));

  const farmerDeposits = useFarmerDepositedBalances().data;
  const hasDeposits = Array.from(farmerDeposits.entries()).find((token) => token[1].deposits.length > 0);

  // Calculate APY stats
  const podRate = fieldData.temperature.max;
  const siloTokens = Array.from(siloData.tokenData.entries());
  const avgAPY = (siloTokens.reduce((total, token) => token[1].yields.beanAPY + total, 0) / siloTokens.length).toFixed(
    2,
  );

  // Scroll back to top when mounting
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // Convert from
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;

  // Claim
  const claimEnabled = farmerActions.claimRewards.enabled;

  type StatPanelModes = "stalk" | "pods" | "seeds" | "depositedValue";

  const depositedValueData = {
    mode: "depositedValue" as StatPanelModes,
    mainValue: farmerSilo.depositsUSD,
    mainValueChange: farmerActions.claimRewards.outputs.bdvGain.mul(priceData.price),
    secondaryValue: farmerSilo.depositsBDV,
    actionValue: farmerActions.claimRewards.outputs.bdvGain,
    showActionValues: hoveredButton === "claim",
  };

  const stalkData = {
    mode: "stalk" as StatPanelModes,
    mainValue: farmerSilo.activeStalkBalance,
    mainValueChange: farmerActions.claimRewards.outputs.stalkGain,
    actionValue: claimSiloPct.sub(siloPct),
    secondaryValue: siloPct,
    tooltipContent:
      "Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn.",
    showActionValues: hoveredButton === "claim",
  };

  const seedData = {
    mode: "seeds" as StatPanelModes,
    mainValue: farmerSilo.activeSeedsBalance,
    mainValueChange:
      hoveredButton === "convert"
        ? farmerActions.convertDeposits.bestConversion.outputs.seedGain
        : farmerActions.claimRewards.outputs.seedGain,
    actionValue:
      hoveredButton === "convert"
        ? farmerActions.convertDeposits.bestConversion.outputs.seedGain
        : farmerActions.claimRewards.outputs.seedGain,
    secondaryValue: stalkPerSeason,
    tooltipContent: "Seeds grow Stalk every Season, creating the time weighted staking mechanism that is the Silo.",
    showActionValues: hoveredButton === "convert" || hoveredButton === "claim",
  };

  const podData = {
    mode: "pods" as StatPanelModes,
    mainValue: farmerField.totalPods,
    mainValueChange: farmerActions.harvestPods.outputs.podGain,
    secondaryValue: placesInLine[0],
    tooltipContent: "The number of Pods that need to Harvest before your next place in the Pod Line.",
    showActionValues: hoveredButton === "harvest",
  };

  return (
    <div
      className={`flex flex-col ${hasDeposits ? "pt-64" : "justify-center text-center min-h-[calc(100vh-15rem)]"} gap-52`}
    >
      {hasDeposits ? (
        <>
          {/* Important: Make sure action-container has position: relative */}
          <div className="flex flex-col justify-center relative action-container" style={{ position: "relative" }}>
            <div className="flex flex-col items-center">
              {/* Add data-action-target to the StatPanel container */}
              <div data-action-target="stats">
                <StatPanel {...depositedValueData} size={"large"} />
              </div>
            </div>
            <div className="grid grid-flow-col grid-cols-3 mt-20 gap-[4.5rem] w-[60%] self-center whitespace-nowrap">
              <StatPanel {...stalkData} />
              <StatPanel {...seedData} />
              <StatPanel {...podData} />
              {podData.mainValue && (
                <HelperLink
                  onClick={() => navigate(podData.mainValueChange?.gt(0) ? "/field/harvest" : "/field/sow")}
                  text={podData.mainValueChange?.gt(0) ? "Harvest Pods" : "Sow (Lend) in the Field for Pods"}
                  className={`absolute -mt-[100px] ${podData.mainValueChange?.gt(0) ? "right-[280px]" : "right-[140px]"} z-20`}
                  dataTarget="pods-stats"
                  sourceAnchor="left"
                  targetAnchor="right"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Tabs
              defaultValue="deposits"
              className="w-[1150px]"
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
            >
              <TabsList className="h-0 bg-transparent p-0 border-0">
                <TabsTrigger
                  className="p-3 -ml-3 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="deposits"
                >
                  My Deposits
                </TabsTrigger>
                <TabsTrigger
                  className="p-3 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="pods"
                >
                  My Pods
                </TabsTrigger>
              </TabsList>
              {convertEnabled && convertFrom && convertTo && currentTab === "deposits" && (
                <HelperLink
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                  text="Convert Available"
                  dataTarget="convert"
                  className="absolute -ml-[246px] -mt-[24px]"
                  sourceAnchor="bottom"
                  targetAnchor="top"
                  onMouseEnter={() => setHoveredButton("convert")}
                  onMouseLeave={() => setHoveredButton("")}
                />
              )}
              {currentTab === "deposits" && claimEnabled && (
                <HelperLink
                  onClick={() => console.log("yey!")}
                  text="Claim Pinto, Stalk and Seed"
                  dataTarget="claimable-rewards"
                  className="absolute right-[145px] -mt-[24px]"
                  sourceAnchor="bottom"
                  targetAnchor="right"
                  onMouseEnter={() => setHoveredButton("claim")}
                  onMouseLeave={() => setHoveredButton("")}
                />
              )}
              <TabsContent className="mt-6" value="deposits">
                <div className="relative overflow-visible">
                  <FarmerDepositsTable />
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
                          <Text
                            data-action-target="convert"
                            variant="body-light"
                            className={`text-pinto-gray-3 hover:text-pinto-green-4 transition-colors cursor-pointer`}
                            onClick={() => navigate(`silo/${convertFrom.address}/convert?to=${convertTo.address}`)}
                          >{`Convert ${convertFrom.name}`}</Text>
                        </div>
                      }
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent className="mt-6" value="pods">
                <div className="overflow-clip">
                  <PlotsTable showClaimable />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="flex flex-row justify-between gap-8 p-4">
          <Button
            asChild
            variant="outline"
            className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 flex-1 h-[33rem] rounded-full gap-4"
          >
            <Link to={"/silo"}>
              <span className="text-pinto-h1 text-black">Deposit in the Silo</span>
              <span className="text-pinto-body text-pinto-gray-4">Deposits in the Silo receive Stalk and Seeds,</span>
              <span className="text-pinto-body text-pinto-gray-4">
                and yield additional Pinto when the supply expands.
              </span>
              {Number(avgAPY) > 0 && <span className="text-pinto-h1 text-pinto mt-4">{`${avgAPY}% average vAPY`}</span>}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 flex-1 h-[33rem] rounded-full gap-4"
          >
            <Link to={"/field"}>
              <span className="text-pinto-h1 text-black">Lend in the Field</span>
              <span className="text-pinto-body text-pinto-gray-4">
                Assets lent to Pinto are exchanged for Pods, the Pinto debt asset.
              </span>
              <span className="text-pinto-body text-pinto-gray-4">
                Pods are redeemable for one Pinto when they reach the front of the Pod Line.
              </span>
              {podRate.gt(0) && (
                <span className="text-pinto-h1 text-pinto mt-4">{`${podRate.toHuman()}% interest rate`}</span>
              )}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
