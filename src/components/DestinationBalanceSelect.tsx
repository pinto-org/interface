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
          className="flex flex-col w-full py-2 h-auto"
        >
          Wallet Balance
        </ToggleGroupItem>
        <ToggleGroupItem
          value={FarmToMode.INTERNAL}
          aria-label="Select Internal Balance"
          className="flex flex-col w-full py-2 h-auto"
        >
          Farm Balance
        </ToggleGroupItem>
    </ToggleGroup>
  );
}
