import podIcon from "@/assets/protocol/Pod.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { formatter } from "@/utils/format";
import DepositsList from "../../DepositsList";
import FarmBalancesList from "../../FarmBalancesList";
import { useHarvestableIndex } from "@/state/useFieldData";

interface StepTwoProps {
  destination: string | undefined;
}

export default function FinalStep({ destination }: StepTwoProps) {
  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  const farmerSilo = useFarmerSiloNew();
  const farmerField = useFarmerField();
  const farmerDeposits = farmerSilo.deposits;
  const depositsToSend = [...farmerDeposits].map(([token, deposit]) => ({ token, deposit }));

  const harvestableIndex = useHarvestableIndex();

  const hasBalance = balancesToSend
    .reduce((total, balanceToSend) => total.add(balanceToSend.balance.internal), TokenValue.ZERO)
    .gt(0);
  const hasPlots = farmerField.plots.length > 0;
  const hasDeposits =
    depositsToSend.reduce((total, depositToSend) => total + depositToSend.deposit.deposits.length, 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <Label className="font-[400] text-[1rem] sm:text-[1.25rem]">I'm sending</Label>
      <div className="flex flex-col gap-8">
        {hasBalance && (
          <div className="flex flex-col">
            <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">Value in my Farm Balance:</Label>
            <FarmBalancesList />
          </div>
        )}
        {hasPlots && (
          <div className="flex flex-col gap-2">
            <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">My Plots:</Label>
            {farmerField.plots.map((plot) => (
              <div
                key={`farmerField_plots_${plot.index.toHuman()}`}
                className="pinto-h4 sm:pinto-h3 text-pinto-secondary sm:text-pinto-secondary flex flex-col gap-2 sm:flex-row sm:gap-1.5 place-self-end"
              >
                <div className="flex flex-row gap-1.5 items-center place-self-end sm:place-self-auto">
                  <span>{formatter.number(plot.pods)}</span>
                  <img src={podIcon} className="h-8 w-8" alt="Plot" />
                  <span>Pods</span>
                </div>
                <div className="pinto-xs sm:pinto-h3 text-pinto-gray-4 sm:text-pinto-secondary flex flex-row gap-1.5 place-self-end sm:place-self-auto">
                  <span className={"text-pinto-gray-3"}>@</span>
                  <span>{formatter.number(plot.index.sub(harvestableIndex))} in Line</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasDeposits && (
          <div>
            <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">My Deposits:</Label>
            <DepositsList />
          </div>
        )}
        <div>
          <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To the following address</Label>
          <AddressLink address={destination} />
        </div>
      </div>
    </div>
  );
}
