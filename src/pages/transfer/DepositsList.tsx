import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Label } from "@/components/ui/Label";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import { useMemo } from "react";
import { DepositTransferData } from "./actions/TransferDeposits";

export default function DepositsList({ transferData }: { transferData?: DepositTransferData[] }) {
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const priceData = usePriceData();

  // Calculate deposits to show and their values
  const { depositsToShow, totalStalk, totalSeeds } = useMemo(() => {
    if (transferData && transferData?.length > 0) {
      // Calculate for each token
      const tokenCalculations = transferData
        .map((data) => {
          // Get the total deposit for this token
          const totalTokenDeposit = farmerDeposits.get(data.token);
          if (!totalTokenDeposit) return null;

          // Calculate percentage of total being transferred
          const transferAmount = TokenValue.fromHuman(data.amount || 0, data.token.decimals);
          const totalAmount = totalTokenDeposit.amount;

          // Calculate percentage only if total amount is greater than 0
          const percentage = totalAmount.gt(0) ? transferAmount.div(totalAmount) : TokenValue.ZERO;

          // Calculate proportional stalk and seeds
          const estimatedStalk = totalTokenDeposit.stalk.total.mul(percentage);
          const estimatedSeeds = totalTokenDeposit.seeds.mul(percentage);

          return {
            token: data.token,
            deposit: {
              amount: transferAmount,
              depositBDV: data.deposits.reduce((sum, deposit) => sum.add(deposit.depositBdv), TokenValue.ZERO),
              stalk: estimatedStalk,
              seeds: estimatedSeeds,
            },
          };
        })
        .filter((calc): calc is NonNullable<typeof calc> => calc !== null);

      // Sum up total stalk and seeds from all tokens
      const totals = tokenCalculations.reduce(
        (acc, curr) => ({
          stalk: acc.stalk.add(curr.deposit.stalk),
          seeds: acc.seeds.add(curr.deposit.seeds),
        }),
        { stalk: TokenValue.ZERO, seeds: TokenValue.ZERO },
      );

      return {
        depositsToShow: tokenCalculations,
        totalStalk: totals.stalk,
        totalSeeds: totals.seeds,
      };
    } else {
      // Using all deposits
      const deposits = [...farmerDeposits]
        .map(([token, deposit]) => ({
          token,
          deposit,
        }))
        .filter((d) => d.deposit.amount.gt(0));

      return {
        depositsToShow: deposits,
        totalStalk: farmerSilo.activeStalkBalance,
        totalSeeds: farmerSilo.activeSeedsBalance,
      };
    }
  }, [transferData, farmerDeposits, farmerSilo]);

  const isSingleDeposit = depositsToShow.length === 1;

  return (
    <div className="ml-0 sm:ml-8">
      <div className="flex flex-row justify-between items-center py-1">
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">
          {isSingleDeposit && depositsToShow[0] ? `Deposited ${depositsToShow[0].token.symbol}` : "Amount"}
        </Label>
        <div className="flex flex-col">
          {depositsToShow.map((tokenDeposit) => {
            if (tokenDeposit.deposit.amount.eq(0)) return;
            return (
              <div key={`tokenDepositsToSend_${tokenDeposit.token.address}`} className="flex flex-col">
                <div className="flex flex-row gap-1.5 items-center font-[340] text-[1rem] sm:text-[2rem] text-pinto-gray-5 justify-end">
                  <img
                    src={tokenDeposit.token.logoURI}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                    alt={tokenDeposit.token.name}
                  />
                  <span>{formatter.token(tokenDeposit.deposit.amount, tokenDeposit.token)}</span>
                  {!isSingleDeposit && <span>{tokenDeposit.token.symbol}</span>}
                </div>
                <span className="text-right font-[340] text-[0.875rem] sm:text-[1rem] text-pinto-gray-4 -mt-2">{`$${Number(tokenDeposit.deposit.depositBDV.mul(priceData.price).toHuman()).toFixed(2)}`}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-1">
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">Stalk</Label>
        <div className="flex flex-row gap-1.5 items-center font-[340] text-[1rem] sm:text-[2rem] text-pinto-gray-5 justify-end">
          <img src={stalkIcon} className="h-6 w-6 sm:h-8 sm:w-8" alt="Stalk" />
          <span>{formatter.number(totalStalk)}</span>
          <span>Stalk</span>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-1">
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">Seeds</Label>
        <div className="flex flex-row gap-1.5 items-center font-[340] text-[1rem] sm:text-[2rem] text-pinto-gray-5 justify-end">
          <img src={seedsIcon} className="h-6 w-6 sm:h-8 sm:w-8" alt="Seeds" />
          <span>{formatter.number(totalSeeds)}</span>
          <span>Seeds</span>
        </div>
      </div>
    </div>
  );
}
