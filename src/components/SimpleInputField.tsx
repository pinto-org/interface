import { Token } from "@/utils/types";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { Button } from "./ui/Button";

export interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  amount: any;
  setAmount: Dispatch<SetStateAction<any>>;
  token?: Token;
}

export default function SimpleInputField({ amount, setAmount, token }: SimpleInputProps) {
  const [internalAmount, setInternalAmount] = useState(amount);
  useDebouncedEffect(
    () => {
      setAmount(internalAmount);
    },
    [internalAmount],
    500,
  );

  return (
    <div className="border border-pinto-gray-blue content-center bg-white transition-colors py-2 px-4    rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
      <div className="flex flex-row gap-2 items-center">
        <input
          min={0}
          type="number"
          className="flex w-full px-1 text-2xl text-black align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={internalAmount || amount}
          onChange={(e) => setInternalAmount(e.target.value)}
        />
        {token && (
          <Button
            variant={"outline"}
            className="inline-flex items-center p-4 gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-green-2/10 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem]"
          >
            <img src={token.logoURI} className="w-5 h-5" />
            <div>{token.symbol}</div>
          </Button>
        )}
      </div>
    </div>
  );
}
