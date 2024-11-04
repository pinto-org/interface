import { TokenValue } from "@/classes/TokenValue";
import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { MinusIcon } from "@/components/Icons";
import MultiTokenSelectWithBalances from "@/components/MultiTokenSelectWithBalances";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import AllFarmBalances from "../../FarmBalancesList";

interface StepOneProps {
  transferData: { token: Token; amount: string }[];
  setTransferData: Dispatch<
    SetStateAction<
      {
        token: Token;
        amount: string;
      }[]
    >
  >;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  balanceTo: FarmToMode;
  setBalanceTo: Dispatch<SetStateAction<FarmToMode>>;
  usingMax: boolean;
  setUsingMax: Dispatch<SetStateAction<boolean>>;
}

export default function StepOne({
  transferData,
  setTransferData,
  destination,
  setDestination,
  balanceTo,
  setBalanceTo,
  usingMax,
  setUsingMax,
}: StepOneProps) {
  const farmerBalances = useFarmerBalances();
  const tokenAndBalanceMap = useMemo(() => {
    const map = new Map<Token, TokenValue>();
    for (const farmerBalance of farmerBalances.balances) {
      if (farmerBalance[1].internal.gt(0)) {
        map.set(farmerBalance[0], farmerBalance[1].internal);
      }
    }
    return map;
  }, [farmerBalances.balances]);

  const numberOfValidTokens = useMemo(() => [...tokenAndBalanceMap].length, [tokenAndBalanceMap]);

  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  useEffect(() => {
    const newTransferData: { token: Token; amount: string }[] = [];
    for (const token of selectedTokens) {
      const existingData = transferData.find(
        (tokenData) => tokenData.token.address.toLowerCase() === token.address.toLowerCase(),
      );
      if (existingData) {
        newTransferData.push(existingData);
      } else {
        const balance = tokenAndBalanceMap.get(token);
        if (!balance) continue;
        newTransferData.push({ token: token, amount: balance.toHuman() });
      }
    }
    setTransferData(newTransferData);
  }, [selectedTokens, setTransferData, tokenAndBalanceMap]);

  useEffect(() => {
    if (tokenAndBalanceMap.size > 0 && transferData.length === 0) {
      const firstToken = [...tokenAndBalanceMap.keys()][0];
      const firstBalance = tokenAndBalanceMap.get(firstToken);
      if (firstToken && firstBalance) {
        setSelectedTokens([firstToken]);
      }
    }
  }, [tokenAndBalanceMap, transferData.length]);

  useEffect(() => {
    if (usingMax) {
      const tokenAddresses: Token[] = [];
      for (const tokenData of tokenAndBalanceMap) {
        tokenAddresses.push(tokenData[0]);
      }
      setSelectedTokens(tokenAddresses);
    } else {
      setSelectedTokens([[...tokenAndBalanceMap.keys()][0]]);
    }
  }, [usingMax, tokenAndBalanceMap]);

  const handleAmountChange = useCallback(
    (index: number) => (newAmount: string) => {
      setTransferData((prev) => prev.map((item, i) => (i === index ? { ...item, amount: newAmount } : item)));
    },
    [setTransferData],
  );

  const handleTokenChange = useCallback(
    (index: number) => (newToken: Token) => {
      setTransferData((prev) => {
        // Check if the new token already exists in another position
        const existingIndex = prev.findIndex(
          (item, i) => i !== index && item.token.address.toLowerCase() === newToken.address.toLowerCase(),
        );

        if (existingIndex !== -1) {
          // Remove the duplicate entry and update the selected tokens accordingly
          const updatedData = prev.filter((_, i) => i !== index);
          setSelectedTokens(updatedData.map((item) => item.token));
          return updatedData;
        }

        // If no duplicate, update normally
        const updatedData = prev.map((item, i) => (i === index ? { ...item, token: newToken } : item));
        setSelectedTokens(updatedData.map((item) => item.token));
        return updatedData;
      });
    },
    [setTransferData],
  );

  const handleRemoveLastItem = useCallback(() => {
    setSelectedTokens((prev) => prev.slice(0, -1));
  }, []);

  return (
    <>
      <div className="flex flex-row justify-end -mt-[5rem]">
        <Button
          className={`font-[340] text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent`}
          onClick={() => setUsingMax(!usingMax)}
        >
          {!usingMax ? "Send all Farm Balance tokens" : "Send only some of my Farm Balance"}
        </Button>
      </div>
      {usingMax ? (
        <div className="flex flex-col gap-2">
          <Label>Amounts and tokens in my Farm Balance to send</Label>
          <AllFarmBalances />
        </div>
      ) : (
        transferData.map((tokenData, index) => (
          <div key={`farmbalancetransfer_${tokenData.token.address}`}>
            <ComboInputField
              amount={tokenData.amount}
              setAmount={handleAmountChange(index)}
              setToken={handleTokenChange(index)}
              selectedToken={tokenData.token}
              balanceFrom={FarmFromMode.INTERNAL}
              tokenAndBalanceMap={tokenAndBalanceMap}
            />
          </div>
        ))
      )}
      {!usingMax && (
        <div className="flex flex-row gap-4">
          {transferData.length > 1 && (
            <Button
              variant="outline"
              className={`font-[340] text-[1.25rem] bg-white leading-[1.375rem] h-12 px-4 rounded-full text-black w-auto gap-2`}
              onClick={handleRemoveLastItem}
            >
              <MinusIcon color={"currentColor"} /> {`Remove ${transferData[transferData.length - 1].token.symbol}`}
            </Button>
          )}
          {numberOfValidTokens > 1 && numberOfValidTokens !== transferData.length && (
            <div className="flex">
              <MultiTokenSelectWithBalances
                setTokens={setSelectedTokens}
                selectedTokens={selectedTokens}
                tokenAndBalanceMap={tokenAndBalanceMap}
                customTitle="Select token(s) in your Farm Balance to send"
              />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label>Send tokens to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
      </div>
      <div className="flex flex-col gap-4 items-start">
        <Label>I want to send these tokens to the recipient's:</Label>
        <DestinationBalanceSelect balanceTo={balanceTo} setBalanceTo={setBalanceTo} variant="transferFlow" />
      </div>
    </>
  );
}
