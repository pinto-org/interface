import SiloTable from "./silo/SiloTable";
import siloIcon from "@/assets/protocol/Silo.svg";
import { Separator } from "@/components/ui/Separator";
import StatPanel from "@/components/StatPanel";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { TokenValue } from "@/classes/TokenValue";

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
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-6 w-[80%]">
        <div className="flex flex-col gap-2">
          <div className="inline-flex gap-2 items-center">
            <img src={siloIcon} className="h-12 w-11" />
            <span className="font-[300] text-[3.5rem] text-black">Silo</span>
          </div>
          <div className="font-[400] text-xl text-pinto-gray-4">Deposit value in the Silo to earn yield.</div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          {enableStatPanels && (
            <div className="mb-4 p-4">
              <div className="flex flex-col items-center">
                <StatPanel
                  mode={"depositedValue"}
                  mainValue={farmerSilo.depositsUSD}
                  secondaryValue={farmerSilo.depositsBDV}
                  size={"large"}
                />
              </div>
              <div className="flex flex-row justify-center mt-20 gap-16">
                <StatPanel
                  mode={"stalk"}
                  mainValue={farmerSilo.activeStalkBalance}
                  secondaryValue={earnedStalk}
                  variant={"silo"}
                />
                <StatPanel
                  mode={"seeds"}
                  mainValue={farmerSilo.activeSeedsBalance}
                  secondaryValue={earnedSeeds}
                  variant={"silo"}
                />
              </div>
            </div>
          )}
          <div>
            <div className="font-[400] text-[2rem] text-black">Deposit Whitelist</div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              These are deposits which are currently incentivized by Pinto.
            </div>
          </div>
          <SiloTable />
        </div>
      </div>
    </div>
  );
}

export default Silo;
