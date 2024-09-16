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

function Silo() {
  const location = useLocation();
  const currentSelection = location.search;

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col flex-grow gap-4">
        <SiloTable />
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
    </div>
  );
}

export default Silo;
