import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { useState } from "react";
import useDebounce from "@/utils/useDebounce";

export default function SlippageButton({slippage, setSlippage} : { slippage: number, setSlippage: React.Dispatch<React.SetStateAction<number>>}) {

  const [internalAmount, setInternalAmount] = useState(slippage);

  useDebounce(() => { setSlippage(internalAmount) }, [internalAmount], 500);

    return (
        <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <GearIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 font-pinto">
            <Label>Slippage</Label>
            <div className="flex flex-row gap-2">
              <Input type="number" inputMode="numeric" min={0} value={internalAmount} onChange={((e) => setInternalAmount(Number(e.target.value)))} />
              <div className="text-xl self-center">%</div>
            </div>
        </PopoverContent>
      </Popover>
    )
}