import podIcon from "@/assets/protocol/Pod.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { Label } from "@/components/ui/Label";
import AddressLink from "@/components/AddressLink";
import { useFarmerBalances } from '@/state/useFarmerBalances';
import { useFarmerSilo } from '@/state/useFarmerSilo';
import { useFarmerField } from '@/state/useFarmerField';
import useFarmerDepositedBalances from '@/state/useFarmerDepositedBalances';
import { TokenValue } from '@/classes/TokenValue';
import { usePriceData } from '@/state/usePriceData';
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
    <div className="flex flex-col gap-8">
    <Label className="font-[340] text-[1.25rem] -mb-4">I'm sending</Label>
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
            className={"flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5"}
          >
            <span>{plot.pods.reDecimal(2).toHuman()}</span>
            <img src={podIcon} className="h-8 w-8" alt="Plot" />
            <span>Pods</span>
            <span className={"text-pinto-gray-3"}>@</span>
            <span className="font-[340] text-[2rem] text-pinto-gray-5">
              {plot.index.reDecimal(2).toHuman()} in Line
            </span>
          </div>
        ))}
      </div>
    )}
    {hasDeposits && (
      <div>
        <Label className="font-[340] text-[1.25rem]">My Deposits:</Label>
        <div className="flex flex-row justify-between items-center py-1">
          <Label className="font-[340] text-[1.25rem]">Amount</Label>
          <div className="flex flex-col">
            {depositsToSend.map((tokenDeposit) => {
              if (tokenDeposit.deposit.amount.eq(0)) return;
              return (
                <div key={`tokenDepositsToSend_${tokenDeposit.token.address}`} className="flex flex-col">
                  <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
                    <img src={tokenDeposit.token.logoURI} className="h-8 w-8" alt={tokenDeposit.token.name} />
                    <span>{tokenDeposit.deposit.amount.reDecimal(3).toHuman()}</span>
                    <span>{tokenDeposit.token.symbol}</span>
                  </div>
                  <span className="text-right font-[340] text-[1rem] text-pinto-gray-4 -mt-2">{`$${Number(tokenDeposit.deposit.depositBDV.mul(priceData.price).toHuman()).toFixed(2)}`}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center py-1">
          <Label className="font-[340] text-[1.25rem]">Stalk</Label>
          <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
            <img src={stalkIcon} className="h-8 w-8" alt="Stalk" />
            <span>{farmerSilo.activeStalkBalance.reDecimal(3).toHuman()}</span>
            <span>Stalk</span>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center py-1">
          <Label className="font-[340] text-[1.25rem]">Seeds</Label>
          <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
            <img src={seedsIcon} className="h-8 w-8" alt="Seeds" />
            <span>{farmerSilo.activeSeedsBalance.reDecimal(3).toHuman()}</span>
            <span>Seeds</span>
          </div>
        </div>
      </div>
    )}
    <div>
    <Label className="font-[340] text-[1.25rem]">To the following address</Label>
      <AddressLink address={destination} />
    </div>
  </div>
  );
};