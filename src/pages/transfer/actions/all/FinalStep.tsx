import podIcon from "@/assets/protocol/Pod.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import DepositsList from "../../DepositsList";
import FarmBalancesList from "../../FarmBalancesList";

interface StepTwoProps {
  destination: string | undefined;
}

export default function FinalStep({ destination }: StepTwoProps) {
  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerDeposits = useFarmerDepositedBalances();
  const depositsToSend = [...farmerDeposits.data].map(([token, deposit]) => ({ token, deposit }));

  const priceData = usePriceData();

  const hasBalance = balancesToSend
    .reduce((total, balanceToSend) => total.add(balanceToSend.balance.internal), TokenValue.ZERO)
    .gt(0);
  const hasPlots = farmerField.plots.length > 0;
  const hasDeposits =
    depositsToSend.reduce((total, depositToSend) => total + depositToSend.deposit.deposits.length, 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <Label className="font-[400] text-[1.25rem]">I'm sending</Label>
      <div className="flex flex-col gap-8">
        {hasBalance && (
          <div className="flex flex-col">
            <Label className="font-[340] text-[1.25rem]">Value in my Farm Balance:</Label>
            <FarmBalancesList />
          </div>
        )}
        {hasPlots && (
          <div className="flex flex-col">
            <Label className="font-[340] text-[1.25rem]">My Plots:</Label>
            {farmerField.plots.map((plot) => (
              <div
                key={`farmerField_plots_${plot.index.toHuman()}`}
                className={"flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 place-self-end"}
              >
                <span>{formatter.number(plot.pods)}</span>
                <img src={podIcon} className="h-8 w-8" alt="Plot" />
                <span>Pods</span>
                <span className={"text-pinto-gray-3"}>@</span>
                <span className="font-[340] text-[2rem] text-pinto-gray-5">{formatter.number(plot.index)} in Line</span>
              </div>
            ))}
          </div>
        )}
        {hasDeposits && (
          <div>
            <Label className="font-[340] text-[1.25rem]">My Deposits:</Label>
            <DepositsList />
          </div>
        )}
        <div>
          <Label className="font-[340] text-[1.25rem]">To the following address</Label>
          <AddressLink address={destination} />
        </div>
      </div>
    </div>
  );
}
