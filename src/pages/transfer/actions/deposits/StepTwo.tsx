import { TokenValue } from "@/classes/TokenValue";
import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import DepositSelect from "@/components/DepositSelect";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { Token } from "@/utils/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import DepositsList from "../../DepositsList";
import { DepositTransferData } from "../TransferDeposits";

interface StepTwoProps {
  transferData: DepositTransferData[];
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  usingMax: boolean;
  backToFirstStep: () => void;
}

export default function StepTwo({
  transferData,
  setTransferData,
  destination,
  setDestination,
  usingMax,
  backToFirstStep,
}: StepTwoProps) {
  const farmerSilo = useFarmerSilo();
  const depositedBalances = farmerSilo.deposits;
  const depositedData = [...depositedBalances.entries()].map(([token, depositData]) => ({ token, depositData }));
  const isMobile = useIsMobile();

  const tokenAndBalanceMap = new Map<Token, TokenValue>();
  for (const deposit of depositedData) {
    if (deposit.depositData.amount.gt(0)) {
      tokenAndBalanceMap.set(deposit.token, deposit.depositData.amount);
    }
  }

  const [customMaxAmounts, setCustomMaxAmounts] = useState<Map<string, TokenValue>>(new Map());

  useEffect(() => {
    const newMaxAmounts = new Map<string, TokenValue>();

    transferData.forEach((data) => {
      if (data.deposits.length > 0) {
        const maxAmount = data.deposits.reduce((sum, deposit) => deposit.amount.add(sum), TokenValue.ZERO);
        newMaxAmounts.set(data.token.address, maxAmount);
      }
    });

    setCustomMaxAmounts(newMaxAmounts);
  }, [transferData]);

  // Handle amount change for a specific transfer data entry
  const handleAmountChange = useCallback(
    (index: number) => (newAmount: string) => {
      setTransferData((prev) => {
        const updatedData = [...prev];
        if (updatedData[index]) {
          updatedData[index] = {
            ...updatedData[index],
            amount: newAmount,
            // Preserve existing deposits when only amount changes
            deposits: updatedData[index].deposits,
          };
        }
        return updatedData;
      });
    },
    [setTransferData],
  );

  // Calculate new transfer data when token changes
  const calculateNewTransferData = useCallback(
    (currentTransferData: DepositTransferData[], newToken: Token, index: number): DepositTransferData[] => {
      // Check for duplicate tokens
      const existingIndex = currentTransferData.findIndex(
        (item, i) => i !== index && item.token.address.toLowerCase() === newToken.address.toLowerCase(),
      );

      if (existingIndex !== -1) {
        // Remove duplicate entry
        return currentTransferData.filter((_, i) => i !== index);
      }

      // Get deposit data for the new token
      const newTokenDeposits = depositedBalances.get(newToken);
      if (!newTokenDeposits) {
        return currentTransferData; // Return unchanged if no deposits found
      }

      // Calculate total amount from all deposits
      const totalAmount = newTokenDeposits.deposits.reduce((sum, deposit) => deposit.amount.add(sum), TokenValue.ZERO);

      // Create new transfer data array
      return currentTransferData.map((item, i) =>
        i === index
          ? {
              token: newToken,
              amount: totalAmount.toHuman(),
              deposits: newTokenDeposits.deposits,
            }
          : item,
      );
    },
    [depositedBalances],
  );

  // Handle token change for a specific transfer data entry
  const handleTokenChange = useCallback(
    (index: number) => (newToken: Token) => {
      const newTransferData = calculateNewTransferData(transferData, newToken, index);
      setTransferData(newTransferData);
    },
    [transferData, calculateNewTransferData, setTransferData],
  );

  // Track whether input should be disabled for each token
  const shouldDisableInput = useCallback(
    (token: Token, selectedDeposits: number) => {
      const totalDeposits = depositedBalances.get(token)?.deposits.length ?? 0;
      return selectedDeposits > 1 && selectedDeposits < totalDeposits;
    },
    [depositedBalances],
  );

  const getAltText = useCallback(
    (token: Token) => {
      const tokenDepositData = transferData.find(
        (data) => data.token.address.toLowerCase() === token.address.toLowerCase(),
      );
      const maxDeposits = depositedBalances.get(token)?.deposits.length;

      if (tokenDepositData && maxDeposits) {
        const selectedDeposits = tokenDepositData.deposits.length;
        if (selectedDeposits === 0 || selectedDeposits === maxDeposits) {
          if (isMobile) {
            return `Amt:`;
          }
          return `Deposited ${token.name} Balance:`;
        } else {
          if (isMobile) {
            return `Amt:`;
          }
          return `Selected ${token.name} Deposit${selectedDeposits > 1 ? "s" : ""}:`;
        }
      }
    },
    [depositedBalances, transferData, isMobile],
  );

  return (
    <div>
      {usingMax && (
        <div className="flex flex-row justify-end -mt-[5rem]">
          <Button
            type="button"
            className={`font-[340] text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent`}
            onClick={backToFirstStep}
          >
            {!usingMax ? "Send all Deposits" : "Send only some of my Deposits"}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-12">
        {usingMax ? (
          <DepositsList />
        ) : (
          transferData.map((data, index) => {
            const deposits = depositedBalances.get(data.token)?.deposits.length || 0;
            const showDepositOrderMessage =
              Number(data.amount) > 0 &&
              Number(data.amount) < Number(customMaxAmounts.get(data.token.address)?.toHuman()) &&
              deposits > 1;
            return (
              <div className="flex flex-col gap-2" key={`depositSelect_${data.token.address}`}>
                <div className="flex flex-row items-center justify-between">
                  <Label className="font-[400]">Amount of Deposited {data.token.name} to send</Label>
                  <div className="hidden sm:block">
                    {deposits > 1 && <DepositSelect setTransferData={setTransferData} token={data.token} />}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <ComboInputField
                    key={`depositInput_${data.token.address}_${index}`}
                    setToken={(token) => handleTokenChange(index)(token)}
                    selectedToken={data.token}
                    amount={data.amount}
                    setAmount={(amount) => handleAmountChange(index)(amount)}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                    altText={getAltText(data.token)}
                    customMaxAmount={customMaxAmounts.get(data.token.address)}
                    disableInput={shouldDisableInput(data.token, data.deposits.length)}
                    disableDebounce
                    disableButton
                    mode="deposits"
                  />
                  <div className="sm:hidden">
                    {deposits > 1 && <DepositSelect setTransferData={setTransferData} token={data.token} />}
                  </div>
                  {showDepositOrderMessage && (
                    <div className="pinto-sm-light text-pinto-light">
                      Deposits with the least Grown Stalk will be sent first.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div className="flex flex-col gap-2">
          <Label>Send deposits to</Label>
          <AddressInputField value={destination} setValue={setDestination} />
        </div>
      </div>
    </div>
  );
}
