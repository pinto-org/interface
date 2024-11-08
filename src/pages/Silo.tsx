import { TokenValue } from "@/classes/TokenValue";
import StatPanel from "@/components/StatPanel";
import TableRowConnector from "@/components/TableRowConnector";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { getSiloConvertUrl } from "@/utils/url";
import { useNavigate } from "react-router-dom";
import SiloTable from "./silo/SiloTable";

function Silo() {
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const farmerActions = useFarmerActions();

  const navigate = useNavigate();

  const earnedStalk = farmerSilo.grownStalkReward;
  const earnedSeeds = Array.from(farmerSilo.grownStalkPerToken)
    .map((token) => token[1].mul(siloData.tokenData.get(token[0])?.rewards.seeds ?? TokenValue.ZERO))
    .reduce((acc, curr) => acc.add(curr), TokenValue.ZERO);

  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  // Action states
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;

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
                <StatPanel
                  mode={"depositedValue"}
                  mainValue={farmerSilo.depositsUSD}
                  secondaryValue={farmerSilo.depositsBDV}
                  size={"large"}
                />
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="flex flex-row gap-18">
                  <div className="px-4">
                    <StatPanel
                      mode={"stalk"}
                      mainValue={farmerSilo.activeStalkBalance}
                      secondaryValue={earnedStalk}
                      variant={"silo"}
                    />
                  </div>
                  <div className="px-4">
                    <StatPanel
                      mode={"seeds"}
                      mainValue={farmerSilo.activeSeedsBalance}
                      secondaryValue={earnedSeeds}
                      variant={"silo"}
                    />
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
              <SiloTable />
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
                        className="text-pinto-gray-3 transition-colors cursor-pointer convert-hover"
                        style={{ "--convert-color": convertFrom.color }}
                        onClick={() => navigate(getSiloConvertUrl(convertFrom, convertTo))}
                      >
                        {`Convert ${convertFrom.name}`}
                      </Text>
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
