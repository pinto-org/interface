import { useState } from "react";
import { useLocation } from "react-router-dom";
import ActionSelect from "./silo/ActionSelect";
import DepositsTable from "./silo/DepositsTable";
import RewardsClaim from "./silo/RewardsClaim";
import SiloBalances from "./silo/SiloBalances";
import SiloTable from "./silo/SiloTable";
import Convert from "./silo/actions/Convert";
import Deposit from "./silo/actions/Deposit";
import Transfer from "./silo/actions/Transfer";
import Withdraw from "./silo/actions/Withdraw";
import siloIcon from "@/assets/protocol/Silo.svg";
import { Separator } from "@/components/ui/Separator";

function Silo() {
  const location = useLocation();
  const currentSelection = location.search;

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
      <div className="font-[400] text-[2rem] text-black">
        Deposit Whitelist
      </div>
      <div className="font-[400] text-xl text-pinto-gray-4">
        These are deposits which are currently incentivized by Pinto.
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
