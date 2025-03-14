import { useState } from "react";
import { isAddress } from "viem";
import { useChainId, useConfig } from "wagmi";
import AddressLink from "./AddressLink";
import { CheckmarkIcon, CloseIcon } from "./Icons";
import { Input } from "./ui/Input";

interface AddressInputFieldProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

export default function AddressInputField({ value, setValue }: AddressInputFieldProps) {
  const [inputField, setInputField] = useState<string | undefined>();
  const [isValid, setIsValid] = useState<boolean | undefined>();

  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);

  function validateAddress(address: string) {
    setInputField(address);
    if (isAddress(address)) {
      setValue(address);
      setIsValid(true);
    } else {
      setValue(undefined);
      if (!address) {
        setIsValid(undefined);
      } else {
        setIsValid(false);
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex flex-row justify-between w-full border h-[3.25rem] sm:h-16 border-pinto-gray-2 bg-pinto-gray-1 rounded-md px-3 py-2 sm:px-6 sm:py-4 items-center">
          <div className="flex flex-row gap-3 sm:gap-6 items-center">
            <button
              type="button"
              onClick={() => validateAddress("")}
              className="scale-150 hover:text-pinto-gray-5 text-pinto-gray-3 transition-colors hover:cursor-pointer"
            >
              <CloseIcon color={"currentColor"} />
            </button>
            <AddressLink address={value} />
          </div>
          <CheckmarkIcon />
        </div>
      ) : (
        <Input
          value={inputField}
          onChange={(e) => {
            validateAddress(e.target.value);
          }}
          className={`h-[3.25rem] sm:h-16 p-2 sm:px-6 sm:py-4 font-[340] text-[1rem] sm:font-[400] sm:text-[2rem] bg-white ${isValid === false ? "border-pinto-red-2 focus-visible:ring-transparent" : ""}`}
          placeholder={`Enter ${currentChain?.name ?? ""} address`}
        />
      )}
      <div className="text-right h-[1rem] sm:h-[1.25rem] text-[1rem] sm:text-[1.25rem] font-[400] text-pinto-gray-4">
        {isValid ? "Valid Address" : isValid === false ? "Invalid Address" : ""}
      </div>
    </div>
  );
}
