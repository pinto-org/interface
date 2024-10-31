import { TokenValue } from "@/classes/TokenValue";
import StatPanel from "@/components/StatPanel";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import SiloTable from "./silo/SiloTable";

function Silo() {
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();

  const earnedStalk = farmerSilo.grownStalkReward;
  const earnedSeeds = Array.from(farmerSilo.grownStalkPerToken)
    .map((token) => token[1].mul(siloData.tokenData.get(token[0])?.rewards.seeds ?? TokenValue.ZERO))
    .reduce((acc, curr) => acc.add(curr), TokenValue.ZERO);

  const enableStatPanels =
    farmerSilo.depositsUSD.gt(0) || farmerSilo.activeStalkBalance.gt(0) || farmerSilo.activeSeedsBalance.gt(0);

  return (
    <PageContainer className="">
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
            <SiloTable />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Silo;
