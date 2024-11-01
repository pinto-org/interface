import { Label } from "@/components/ui/Label";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import AddressLink from "@/components/AddressLink";
import { useFarmerBalances } from '@/state/useFarmerBalances';
import { useFarmerSilo } from '@/state/useFarmerSilo';
import { useFarmerField } from '@/state/useFarmerField';
import useFarmerDepositedBalances from '@/state/useFarmerDepositedBalances';
import { TokenValue } from '@/classes/TokenValue';
import { usePriceData } from '@/state/usePriceData';

export default function DepositsList({ depositData }: { depositData?: any }) {
  
    const farmerSilo = useFarmerSilo();
    const farmerDeposits = useFarmerDepositedBalances();
    const depositsToSend = [...farmerDeposits.data].map(([token, deposit]) => ({ token, deposit }));
  
    const priceData = usePriceData();

    return (
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
    )
}