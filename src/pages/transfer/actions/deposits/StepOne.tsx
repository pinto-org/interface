import DepositBalanceSelect from "@/components/DepositBalanceSelect";
import { Button } from "@/components/ui/Button";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { DepositTransferData } from "../TransferDeposits";

interface StepOneProps {
  transferData: DepositTransferData[];
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  usingMax: boolean;
  setUsingMax: Dispatch<SetStateAction<boolean>>;
}

export default function StepOne({ transferData, setTransferData, usingMax, setUsingMax }: StepOneProps) {
  const farmerDeposits = useFarmerSilo().deposits;

  const handleDepositedTokenSelect = useCallback(
    (tokens: string[]) => {
      const newTransferData: DepositTransferData[] = [];
      for (const tokenAddress of tokens) {
        const token = [...farmerDeposits.keys()].find(
          (depositedToken) => depositedToken.address.toLowerCase() === tokenAddress.toLowerCase(),
        );
        if (!token) continue;
        const tokenDepositData = farmerDeposits.get(token);
        if (tokenDepositData && tokenDepositData.amount.gt(0)) {
          const tokenData = {
            token: token,
            amount: tokenDepositData.amount.toHuman(),
            deposits: tokenDepositData.deposits,
          };
          newTransferData.push(tokenData);
        }
      }
      setTransferData(newTransferData);
    },
    [farmerDeposits, setTransferData],
  );

  useEffect(() => {
    const tokenAddresses: string[] = [];
    if (usingMax) {
      for (const depositData of farmerDeposits) {
        if (depositData[1].amount.gt(0)) {
          tokenAddresses.push(depositData[0].address);
        }
      }
    }
    handleDepositedTokenSelect(tokenAddresses);
  }, [usingMax]);

  return (
    <>
      <div className="flex flex-row justify-start sm:justify-end -mt-[1rem] -mb-[2rem] sm:-mt-[5rem] sm:mb-0">
        <Button
          className={`font-[340] sm:pr-0 text-[1rem] sm:text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent`}
          onClick={() => setUsingMax(!usingMax)}
        >
          {!usingMax ? "Send all Deposits" : "Send only some of my Deposits"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-x-4">
        <DepositBalanceSelect
          depositTransferData={transferData}
          setDepositedTokensToTransfer={handleDepositedTokenSelect}
        />
      </div>
    </>
  );
}
