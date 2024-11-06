import settingsIcon from "@/assets/misc/Settings.svg";
import useDebounce from "@/utils/useDebounce";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

export default function SlippageButton({
  slippage,
  setSlippage,
}: { slippage: number; setSlippage: React.Dispatch<React.SetStateAction<number>> }) {
  const [internalAmount, setInternalAmount] = useState(slippage);

  useDebounce(
    () => {
      setSlippage(internalAmount);
    },
    [internalAmount],
    500,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} noPadding className="rounded-full w-10 h-10">
          <img src={settingsIcon} className="w-4 h-4 transition-all" alt="slippage" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 flex flex-col">
        <Label className="mb-4">Slippage</Label>
        <div className="flex flex-row gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={internalAmount}
            onChange={(e) => setInternalAmount(Number(e.target.value))}
          />
          <div className="text-xl self-center">%</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
