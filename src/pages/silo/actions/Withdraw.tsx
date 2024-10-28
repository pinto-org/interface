import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useWriteContract } from "wagmi";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { TokenValue } from "@/classes/TokenValue";
import { sortAndPickCrates } from "@/utils/convert";
import { FarmToMode, Token } from "@/utils/types";
import { Label } from "@/components/ui/Label";
import { ComboInputField } from "@/components/ComboInputField";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useQueryClient } from "@tanstack/react-query";

function Withdraw({ siloToken }: { siloToken: Token }) {
  const account = useAccount();
  const chainId = useChainId();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();  
  const [fromToken, setFromToken] = useState(siloToken);
  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [amount, setAmount] = useState(0);

  const farmerDepositData = farmerDeposits.get(fromToken);
  const deposits = farmerDepositData?.deposits;

  const convertData = new Map<Token, TokenValue>();
  convertData.set(fromToken, farmerDepositData ? farmerDepositData.convertibleAmount : TokenValue.ZERO);
 
  const queryClient = useQueryClient();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  function onSubmit() {
    if (!amount || !destination || !account.address || !deposits) return;
    const transferData = sortAndPickCrates("withdraw", TokenValue.fromHuman(amount || 0, fromToken.decimals), deposits);

    const stems = transferData.crates.map((crate) => crate.stem.toBlockchain());
    const amounts = transferData.crates.map((crate) => crate.amount.toBlockchain());

    if (transferData.crates.length === 1) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "withdrawDeposit",
          args: [fromToken.address, stems[0], amounts[0], Number(destination)],
        });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return `Transaction complete!`;
        },
        error: (error) => {
          return (error as BaseError).shortMessage || `Transaction failed.`;
        },
      });
    } else if (transferData.crates.length > 1) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "withdrawDeposits",
          args: [fromToken.address, stems, amounts, Number(destination)],
        });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return `Transaction complete!`;
        },
        error: (error) => {
          return (error as BaseError).shortMessage || `Transaction failed.`;
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="h-10 flex items-center">
        <Label>Amount</Label>
        </div>
        <ComboInputField 
          amount={amount}
          setAmount={setAmount}
          setToken={setFromToken} 
          selectedToken={fromToken}
          tokenAndBalanceMap={convertData}
        />
      </div>
      <div className="flex flex-col">
        <Label className="flex h-10 items-center">Destination</Label>
        <DestinationBalanceSelect setBalanceTo={setDestination} balanceTo={destination} />
      </div>
      <div>
        <Button className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]" onClick={onSubmit}>
            {"Withdraw"}
        </Button>
      </div>
    </div>
  );
}

export default Withdraw;
