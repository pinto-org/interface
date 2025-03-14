import { FarmFromMode } from "@/utils/types";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

interface SourceBalanceSelect {
  setBalanceFrom: (value: FarmFromMode) => void;
  balanceFrom: FarmFromMode;
  balancesToShow?: FarmFromMode[] | undefined;
}

export default function SourceBalanceSelect({ setBalanceFrom, balanceFrom, balancesToShow }: SourceBalanceSelect) {
  const style =
    "flex flex-col w-full h-[2.75rem] bg-pinto-gray-1 border-pinto-gray-3 text-[1rem] sm:text-[1.25rem] -tracking-[0.02em] font-[400] leading-[1.1rem] sm:leading-[1.3875rem] text-black whitespace-nowrap rounded-full";

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={balanceFrom}
      onValueChange={(value) => {
        if (value) setBalanceFrom(value as FarmFromMode);
      }}
      className="flex flex-row gap-2"
    >
      {(!balancesToShow || balancesToShow.includes(FarmFromMode.EXTERNAL)) && (
        <ToggleGroupItem
          value={FarmFromMode.EXTERNAL}
          aria-label="Select External Balance"
          className={style}
          variant={"outline"}
        >
          Wallet Balance
        </ToggleGroupItem>
      )}
      {(!balancesToShow || balancesToShow.includes(FarmFromMode.INTERNAL)) && (
        <ToggleGroupItem
          value={FarmFromMode.INTERNAL}
          aria-label="Select Internal Balance"
          className={style}
          variant={"outline"}
        >
          Farm Balance
        </ToggleGroupItem>
      )}
      {(!balancesToShow || balancesToShow.includes(FarmFromMode.INTERNAL_EXTERNAL)) && (
        <ToggleGroupItem
          value={FarmFromMode.INTERNAL_EXTERNAL}
          aria-label="Select Both Balances"
          className={style}
          variant={"outline"}
        >
          Both
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}
