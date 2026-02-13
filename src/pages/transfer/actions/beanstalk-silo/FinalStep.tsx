import AddressLink from "@/components/AddressLink";
import { Label } from "@/components/ui/Label";
import { FarmToMode } from "@/utils/types";

interface FinalStepProps {
  amount: string;
  destination: string | undefined;
  balanceTo: FarmToMode | undefined;
}

export default function FinalStep({ amount, destination, balanceTo }: FinalStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">I'm sending</Label>
        <div className="flex flex-row gap-1.5 items-center font-[400] sm:font-[340] text-[1.5rem] sm:text-[2rem] text-pinto-gray-5">
          <span>{amount}</span>
          <span>urBDV</span>
        </div>
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To the following address</Label>
        <AddressLink address={destination} />
      </div>
      <div>
        <Label className="font-[340] text-[1rem] sm:text-[1.25rem]">To their</Label>
        <div className="font-[340] text-[2rem] leading-[110%] -tracking-[0.02em]">
          {balanceTo === FarmToMode.EXTERNAL ? "External Wallet" : "Farm Wallet"}
        </div>
      </div>
    </div>
  );
}
