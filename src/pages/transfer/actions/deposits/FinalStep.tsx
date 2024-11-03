import depositIcon from "@/assets/protocol/Deposit.svg";
import { TokenValue } from "@/classes/TokenValue";
import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { sortAndPickCrates } from "@/utils/convert";
import { useMemo } from "react";
import DepositsList from "../../DepositsList";
import { DepositTransferData } from "../TransferDeposits";

interface FinalStepProps {
  destination: string | undefined;
  transferData: DepositTransferData[];
}

export default function FinalStep({ destination, transferData }: FinalStepProps) {
  const depositIds = useMemo(() => {
    return transferData
      .filter((data) => {
        const amount = TokenValue.fromHuman(data.amount || 0, data.token.decimals);
        return amount.gt(0);
      })
      .flatMap(
        (data) =>
          sortAndPickCrates("transfer", TokenValue.fromHuman(data.amount, data.token.decimals), data.deposits).crates,
      )
      .map((data) => data.stem.toBigInt());
  }, [transferData]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <Label className="font-[340] text-[1.25rem]">I'm sending</Label>
        <DepositsList transferData={transferData} />
      </div>
      <div className="flex flex-row gap-2 font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-4">
        <img src={depositIcon} alt="Deposits" />
        {`Deposits being sent: ${depositIds.join(", ")}`}
      </div>
      <div>
        <Label className="font-[340] text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
    </>
  );
}
