import { useLocation } from "react-router-dom";
import SiloTable from "./silo/SiloTable";
import siloIcon from "@/assets/protocol/Silo.svg";
import { Separator } from "@/components/ui/Separator";
import StatPanel from "@/components/StatPanel";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { TokenValue } from "@/classes/TokenValue";

function Silo() {
  const location = useLocation();
  const currentSelection = location.search;

  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();

  const siloPct = siloData.totalStalk.gt(0) ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100) : TokenValue.ZERO;
  const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

  return (
    <div className="flex flex-col items-center">
    <div className="flex flex-col gap-6 w-[80%]">
      <div className="flex flex-col gap-2">
        <div className="inline-flex gap-2 items-center">
          <img src={siloIcon} className="h-12 w-11" />
          <span className="font-[300] text-[3.5rem] text-black">Silo</span>
        </div>
        <div className="font-[400] text-xl text-pinto-gray-4">
          Deposit value in the Silo to earn yield.
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
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
                  secondaryValue={siloPct}
                  variant={"silo"}
              />
              <StatPanel
                  mode={"seeds"}
                  mainValue={farmerSilo.activeSeedsBalance}
                  secondaryValue={stalkPerSeason}
                  variant={"silo"}
              />
          </div>
      </div>
      <div>
        <div className="font-[400] text-[2rem] text-black">
          Deposit Whitelist
        </div>
        <div className="font-[400] text-xl text-pinto-gray-4">
          These are deposits which are currently incentivized by Pinto.
        </div>
      </div>
      <SiloTable />
      </div>
      {/*
      <div className="flex flex-col flex-grow gap-4">
        <div className="flex flex-row flex-grow gap-4">
          <DepositsTable />
          <RewardsClaim />
          <SiloBalances />
        </div>
      </div>
      <div className="flex flex-col gap-4 self-start">
        <ActionSelect />
        {(currentSelection === "?action=deposit" || !currentSelection) && <Deposit />}
        {currentSelection === "?action=convert" && <Convert />}
        {currentSelection === "?action=transfer" && <Transfer />}
        {currentSelection === "?action=withdraw" && <Withdraw />}
      </div>
      */}
    </div>
    </div>
  );
}

export default Silo;
