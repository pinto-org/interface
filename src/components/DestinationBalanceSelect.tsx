import { FarmToMode } from "@/utils/types";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

interface DestinationBalanceSelect {
  setBalanceTo: (value: FarmToMode) => void,
  balanceTo: FarmToMode
};

export default function DestinationBalanceSelect({ setBalanceTo, balanceTo }: DestinationBalanceSelect) {

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={balanceTo}
      onValueChange={(value) => {
        if (value) setBalanceTo(value as FarmToMode);
      }}
      className="flex flex-row gap-2"
    >
        <ToggleGroupItem
          value={FarmToMode.EXTERNAL}
          aria-label="Select External Balance"
          className="flex flex-col w-full py-2 h-[3.25rem] bg-pinto-gray-1 border-pinto-gray-3 text-[1.25rem] -tracking-[0.02em] font-[400] leading-[1.3875rem] text-black"
          variant={"outline"}
        >
          Wallet Balance
        </ToggleGroupItem>
        <ToggleGroupItem
          value={FarmToMode.INTERNAL}
          aria-label="Select Internal Balance"
          className="flex flex-col w-full py-2 h-[3.25rem] bg-pinto-gray-1 border-pinto-gray-3 text-[1.25rem] -tracking-[0.02em] font-[400] leading-[1.3875rem] text-black"
          variant={"outline"}
        >
          Farm Balance
        </ToggleGroupItem>
    </ToggleGroup>
  );
}
