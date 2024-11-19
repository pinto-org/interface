import { TokenValue } from "@/classes/TokenValue";
import ClaimRewards from "@/components/ClaimRewards";
import OverviewNoticeGermination from "@/components/GerminationNotice";
import GerminationNotice from "@/components/GerminationNotice";
import HelperLink from "@/components/HelperLink";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { getClaimText } from "@/utils/string";
import { StatPanelData } from "@/utils/types";
import { getSiloConvertUrl } from "@/utils/url";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiloTable from "./silo/SiloTable";

function Silo() {
  const farmerSilo = useFarmerSiloNew();
  const farmerActions = useFarmerActions();
  const tokenData = useTokenData();
  const priceData = usePriceData();
  const mainToken = tokenData.mainToken;
  const { submitClaimRewards } = useClaimRewards();

  const navigate = useNavigate();

  const [hoveredButton, setHoveredButton] = useState("");
  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const claimEnabled =
    farmerActions.claimRewards.outputs.beanGain.gt(0.01) ||
    farmerActions.claimRewards.outputs.stalkGain.gt(0.01) ||
    farmerActions.claimRewards.outputs.seedGain.gt(0.01);
  const claimableText = getClaimText(
    farmerActions.claimRewards.outputs.beanGain,
    farmerActions.claimRewards.outputs.stalkGain,
    farmerActions.claimRewards.outputs.seedGain,
  );
  const hasGerminatingDeposits = Array.from(farmerSilo.deposits.values()).some((depositData) =>
    depositData.deposits.some((deposit) => deposit.isGerminating),
  );

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
      auxValue: farmerSilo.germinatingStalkBalance,
      mainValueChange: farmerActions.claimRewards.outputs.stalkGain,
      secondaryValue: farmerActions.claimRewards.outputs.stalkGain,
      showActionValues: hoveredButton === "claim",
      altTooltipContent:
        "Stalk entitles holders to passive interest in the form of a share of future Pinto. Your Stalk is forfeited when you Withdraw your Deposited assets from the Silo.",
    },
    seeds: {
      mode: "seeds",
      mainValue: farmerSilo.activeSeedsBalance,
      mainValueChange: farmerActions.claimRewards.outputs.seedGain,
      secondaryValue: farmerActions.claimRewards.outputs.seedGain,
      showActionValues: hoveredButton === "claim",
      altTooltipContent: "Seeds are illiquid tokens that yield 1/10,000 Stalk each Season.",
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
          <div className="flex flex-col gap-4">
            <Text variant="h3">Deposit Whitelist</Text>
            <Text variant="body-light" color="light">
              These are Deposits which are currently incentivized by Pinto.
            </Text>
            <div className="relative action-container">
              <SiloTable hovering={hoveredButton === "claim"} />
              {/* {convertEnabled && convertFrom && convertTo && (
                <TableRowConnector
                  fromTarget={`token-row-${convertFrom.address}`}
                  toTarget={`token-row-${convertTo.address}`}
                  color="#246645"
                  extensionLength={40}
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
                      </div>
                    </div>
                  }
                />
              )} */}
              {claimEnabled && (
                <HelperLink
                  text={claimableText}
                  className={`absolute top-8 -right-[100px] z-20`}
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
              {/* 
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
              )}*/}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Silo;
