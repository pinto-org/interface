import { Token } from "@/utils/types";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/Button";

interface NumberInputValidation {
  minValue?: number;
  maxValue?: number;
  maxDecimals?: number;
}

export interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  amount: any;
  setAmount: Dispatch<SetStateAction<any>>;
  token?: Token;
  placeholder?: string;
  validation?: NumberInputValidation;
  disabled?: boolean;
}

export default function SimpleInputField({
  amount,
  setAmount,
  token,
  placeholder,
  validation,
  disabled = false,
}: SimpleInputProps) {
  const [internalAmount, setInternalAmount] = useState(amount?.toString());

  // Convert the text representation of the input into a numeric value
  useDebouncedEffect(
    () => {
      if (!internalAmount) {
        setAmount(undefined);
        return;
      }
      const numericVal = parseFloat(internalAmount?.replaceAll(",", ""));
      if (!Number.isNaN(numericVal)) {
        if (validation?.minValue && numericVal < validation.minValue) {
          setAmount(undefined);
          return;
        }
        setAmount(numericVal);
      } else {
        setAmount(undefined);
      }
    },
    [internalAmount],
    500,
  );

  // Handle external assignment to amount.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on external change to amount, not upon input changing
  useEffect(() => {
    const numericVal = parseFloat(internalAmount?.replaceAll(",", ""));
    const _isNaN = Number.isNaN(numericVal);
    if (amount === undefined && _isNaN) {
      setInternalAmount("");
    } else if (amount !== undefined) {
      if ((!_isNaN && amount !== numericVal) || _isNaN) {
        const parts = amount.toString().split(".");
        const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const final = `${withCommas}${parts[1] ? `.${parts[1]}` : ""}`;
        setInternalAmount(final);
      }
    }
  }, [amount]);

  // Adjusts the text input as it is entered, applying validations and inserting commas as necessary.
  const handleInputChange = useCallback(
    (e) => {
      const textValue = e.target.value;
      const noCommas = textValue.replaceAll(",", "");
      const numericVal = parseFloat(noCommas);

      const includesDot = noCommas.includes(".");
      const parts = noCommas.split(".");
      if (validation) {
        let { minValue, maxValue, maxDecimals } = validation;
        // Need to allow typing a leading zero for values like 0.05
        if (minValue !== undefined && maxDecimals !== undefined && minValue > 0 && minValue < 1) {
          minValue = 0;
        }
        if (maxDecimals === 0 && includesDot) {
          return;
        }
        if (
          (minValue !== undefined && numericVal < minValue) ||
          (maxValue !== undefined && numericVal > maxValue) ||
          (maxDecimals !== undefined && parts[1]?.length > maxDecimals)
        ) {
          return;
        }
      }
      const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const final = `${withCommas}${includesDot ? "." : ""}${parts[1] ? parts[1] : ""}`;
      if (/^(?!(?:0\d))(?:0|\d{1,3}(?:,\d{3})*)?(?:\.\d*)?$|^0?\.\d*$/.test(final)) {
        setInternalAmount(final);
      }
    },
    [validation],
  );

  return (
    <div className="border border-pinto-gray-blue content-center bg-white transition-colors py-2 px-4 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
      <div className="flex flex-row gap-2 items-center">
        <input
          type="text"
          className="flex w-full px-1 text-2xl text-black align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={internalAmount ?? amount ?? ""}
          placeholder={placeholder?.toString()}
          onInput={handleInputChange}
          disabled={disabled}
        />
        {token && (
          <Button
            variant={"outline"}
            className="inline-flex items-center p-4 gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-green-2/10 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem]"
          >
            <img src={token.logoURI} className="w-5 h-5" alt="token icon" />
            <div>{token.symbol}</div>
          </Button>
        )}
      </div>
    </div>
  );
}
