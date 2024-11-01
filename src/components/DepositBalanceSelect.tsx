import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";

interface DepositBalanceSelect {
  setDepositedTokensToTransfer: (value: string[]) => void;
  depositTransferData: DepositTransferData[];
}

export default function DepositBalanceSelect({ setDepositedTokensToTransfer, depositTransferData }: DepositBalanceSelect) {
    const depositedBalances = useFarmerDepositedBalances();
    const depositedData = [...depositedBalances.data.entries()]
    .map(([token, depositData]) => ({ token, depositData }))
    const depositedTokens = depositTransferData.map((transferData) => transferData.token.address)

  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      value={depositedTokens}
      onValueChange={(value) => {
        if (value) setDepositedTokensToTransfer(value);
      }}
      className="flex flex-wrap gap-4 justify-start"
    >
      {depositedData.map((depositInfo) => {
        return (
      <ToggleGroupItem
        value={depositInfo.token.address}
        key={`depositData_${depositInfo.token.address}`}
        disabled={depositInfo.depositData.amount.eq(0)}
        aria-label={`Select ${depositInfo.token.name} Deposited Balance`}
        className={`flex flex-row gap-2 p-4 h-[3.25rem] bg-white rounded-full border-pinto-gray-2 text-[1.25rem] -tracking-[0.02em] font-[400] leading-[1.3875rem] text-black whitespace-nowrap data-[state=on]:text-black`}
        variant={"outline"}
        >
            <img src={depositInfo.token.logoURI} alt={depositInfo.token.name} className="w-8 h-8"/>
            {depositInfo.token.symbol}
        </ToggleGroupItem>
      )})}
    </ToggleGroup>
  );
}
