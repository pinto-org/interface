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
    <>
      {value ? (
        <div className="flex flex-row justify-between w-full border h-16 border-pinto-gray-2 bg-pinto-gray-1 rounded-md px-6 py-4 items-center">
          <div className="flex flex-row gap-6 items-center">
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
          className="h-16 px-6 py-4 text-[2rem] bg-white"
          placeholder={`Enter ${currentChain?.name ?? ""} address`}
        />
      )}
      <div className="justify-self-end h-[1.25rem] text-[1.25rem] font-[400] text-pinto-gray-4">
        {isValid ? "Valid Address" : isValid === false ? "Invalid Address" : ""}
      </div>
    </>
  );
}
