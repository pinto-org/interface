import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { FarmToMode, Token } from "@/utils/types";
import FarmBalancesList from "../../FarmBalancesList";

interface StepTwoProps {
  balanceTo: FarmToMode;
  destination: string | undefined;
  transferData: { token: Token; amount: string }[];
}

export default function FinalStep({ balanceTo, destination, transferData }: StepTwoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">I'm sending</Label>
        <FarmBalancesList transferData={transferData} />
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To their</Label>
        <div className="font-[340] text-[2rem] leading-[110%] -tracking-[0.02em]">
          {balanceTo === FarmToMode.EXTERNAL ? "Wallet Balance" : "Farm Balance"}
        </div>
      </div>
    </div>
  );
}
