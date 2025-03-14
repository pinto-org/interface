import { FarmToMode } from "@/utils/types";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

interface DestinationBalanceSelect {
  setBalanceTo: (value: FarmToMode) => void;
  balanceTo: FarmToMode;
  variant?: "small" | "transferFlow";
}

export default function DestinationBalanceSelect({ setBalanceTo, balanceTo, variant }: DestinationBalanceSelect) {
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
        className={`flex flex-col w-full py-2 h-[2.5rem] sm:h-[2.75rem] rounded-full ${variant === "transferFlow" ? "bg-white rounded-full w-auto px-6" : "bg-pinto-gray-1"} border-pinto-gray-3 ${variant === "small" ? "text-[1rem] sm:text-[1rem] leading-[1.1rem]" : "text-[1rem] leading-[1.1rem] sm:text-[1.25rem] sm:leading-[1.3875rem]"} -tracking-[0.02em] font-[400] text-black whitespace-nowrap`}
        variant={"outline"}
      >
        Wallet Balance
      </ToggleGroupItem>
      <ToggleGroupItem
        value={FarmToMode.INTERNAL}
        aria-label="Select Internal Balance"
        className={`flex flex-col w-full py-2 h-[2.5rem] sm:h-[2.75rem] rounded-full ${variant === "transferFlow" ? "bg-white rounded-full w-auto px-6" : "bg-pinto-gray-1"} border-pinto-gray-3 ${variant === "small" ? "text-[1rem] sm:text-[1rem] leading-[1.1rem]" : "text-[1rem] leading-[1.1rem] sm:text-[1.25rem] sm:leading-[1.3875rem]"} -tracking-[0.02em] font-[400] text-black whitespace-nowrap`}
        variant={"outline"}
      >
        Farm Balance
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
