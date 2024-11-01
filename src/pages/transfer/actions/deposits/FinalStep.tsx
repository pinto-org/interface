import plotIcon from "@/assets/protocol/Plot.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { Label } from "@/components/ui/Label";
import AddressLink from "@/components/AddressLink";
import { useFarmerBalances } from '@/state/useFarmerBalances';
import { useFarmerSilo } from '@/state/useFarmerSilo';
import { useFarmerField } from '@/state/useFarmerField';
import useFarmerDepositedBalances from '@/state/useFarmerDepositedBalances';
import depositIcon from "@/assets/protocol/Deposit.svg";
import { TokenValue } from '@/classes/TokenValue';
import { usePriceData } from '@/state/usePriceData';
import FarmBalancesList from "../../FarmBalancesList";
import DepositsList from "../../DepositsList";

interface FinalStepProps {
    destination: string | undefined;
}

export default function FinalStep({ destination }: FinalStepProps) {

    const farmerBalances = useFarmerBalances();
    const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));
  
    const farmerSilo = useFarmerSilo();
    const farmerField = useFarmerField();
    const farmerDeposits = useFarmerDepositedBalances();
    const depositsToSend = [...farmerDeposits.data].map(([token, deposit]) => ({ token, deposit }));
    const depositIds = depositsToSend.flatMap((depositInfo) => depositInfo.deposit.deposits.flatMap((depositData) => depositData.stem.blockchainString))

  return (
    <>
    <Label className="font-[340] text-[1.25rem]">I'm sending</Label>
    <DepositsList />
    <div className="flex flex-row gap-2 font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-4">
        <img src={depositIcon} alt="Deposits" />
        {`Deposits being sent: ${depositIds.join(", ")}`}
    </div>
    <div>
      <Label>To the following address</Label>
      <AddressLink address={destination} />
    </div>
  </>
  );
};