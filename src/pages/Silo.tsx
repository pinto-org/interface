import { TokenValue } from "@/classes/TokenValue";
import HelperLink from "@/components/HelperLink";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { StatPanelData } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiloTable from "./silo/SiloTable";

function Silo() {
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const priceData = usePriceData();
  const mainToken = tokenData.mainToken;

  const navigate = useNavigate();

  const [hoveredButton, setHoveredButton] = useState("");
  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const claimEnabled = farmerActions.claimRewards.enabled;
  const bestDeposit = farmerActions.optimalDepositToken?.token;

  const statPanelData: Record<"stalk" | "seeds" | "depositedValue", StatPanelData> = {
    depositedValue: {
      mode: "depositedValue",
      mainValue: farmerSilo.depositsUSD,
      mainValueChange: farmerActions.claimRewards.outputs.bdvGain.mul(priceData.price),
      secondaryValue: farmerSilo.depositsBDV,
      actionValue: farmerActions.claimRewards.outputs.bdvGain,
      showActionValues: hoveredButton === "claim",
    },
    stalk: {
      mode: "stalk",
      mainValue: farmerSilo.activeStalkBalance,
      mainValueChange: farmerActions.claimRewards.outputs.stalkGain,
      secondaryValue: farmerActions.claimRewards.outputs.stalkGain,
      showActionValues: hoveredButton === "claim",
    },
    seeds: {
      mode: "seeds",
      mainValue: farmerSilo.activeSeedsBalance,
      mainValueChange: farmerActions.claimRewards.outputs.seedGain,
      secondaryValue: farmerActions.claimRewards.outputs.seedGain,
      showActionValues: hoveredButton === "claim",
    },
  };

  return (
    <PageContainer>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-12">
          <div className="flex flex-col gap-2">
            <Text variant="h1">Silo</Text>
            <Text color="light" variant="body-light">
              Deposit value in the Silo to earn yield.
            </Text>
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
          <div className="flex flex-col gap-4">
            <Text variant="h3">Deposit Whitelist</Text>
            <Text variant="body-light" color="light">
              These are deposits which are currently incentivized by Pinto.
            </Text>
            <div className="relative action-container">
              <SiloTable hovering={hoveredButton === "claim"} />
              {convertEnabled && convertFrom && convertTo && (
                <TableRowConnector
                  fromTarget={`token-row-${convertFrom.address}`}
                  toTarget={`token-row-${convertTo.address}`}
                  color="#246645"
                  extensionLength={40}
                  dotted={true}
                  startCapColor={convertFrom.color}
                  endCapColor={convertTo.color}
                  componentOffsetHeight={20}
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
                      <div className="flex flex-col gap-4">
                        <Text
                          data-action-target="convert"
                          variant="sm-light"
                          className="text-pinto-green-4 text-end opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {`Convert ${convertFrom.name} for ${convertTo.name}`}
                        </Text>
                        <Text
                          data-action-target="convert"
                          variant="sm-light"
                          className="text-pinto-green-4 text-end opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {"Arbitrage the increased Seed reward for a gain in Seed."}
                        </Text>
                      </div>
                    </div>
                  }
                />
              )}
              {claimEnabled && (
                <HelperLink
                  onClick={() => console.log("claim!")}
                  text={"Claim Pinto, Stalk and Seed"}
                  className={`absolute -mt-[380px] -right-[280px] z-20`}
                  dataTarget={`token-row-${mainToken.address}`}
                  sourceAnchor="left"
                  targetAnchor="right"
                  onMouseEnter={() => setHoveredButton("claim")}
                  onMouseLeave={() => setHoveredButton("")}
                />
              )}
              {!convertEnabled && bestDeposit && (
                <TableRowConnector
                  toTarget={`token-row-${bestDeposit.address}`}
                  color="#246645"
                  mode="singleLine"
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
                        <Text data-action-target="convert" variant="sm-light" className="text-pinto-gray-4 text-end">
                          {`${bestDeposit.name} currently has the highest incentive for Depositors.`}
                        </Text>
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Silo;
