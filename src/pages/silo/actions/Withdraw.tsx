import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useWriteContract } from "wagmi";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { TokenValue } from "@/classes/TokenValue";
import { sortAndPickCrates } from "@/utils/convert";
import { FarmToMode } from "@/utils/types";
import useTokenData from "@/state/useTokenData";
import { Label } from "@/components/ui/Label";
import { ComboInputField } from "@/components/ComboInputField";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useQueryClient } from "@tanstack/react-query";

function Withdraw() {
  const account = useAccount();
  const chainId = useChainId();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();  
  const BEAN = useTokenData().mainToken;
  const [fromToken, setFromToken] = useState(BEAN);
  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [amount, setAmount] = useState(0);
  const deposits = farmerDeposits.get(fromToken);
  const queryClient = useQueryClient();

  function setMaxAmount(value: number) {
    setAmount(value)
  };

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  function onSubmit() {
    if (!amount || !destination || !account.address) return;
    const transferData = sortAndPickCrates(
      "withdraw",
      TokenValue.fromHuman(amount || 0, fromToken.decimals),
      deposits.deposits
    );

    const stems = transferData.crates.map((crate) => crate.stem.toBlockchain());
    const amounts = transferData.crates.map((crate) => crate.amount.toBlockchain());

    if (transferData.crates.length === 1) {
      const tx = () => writeContractAsync({
        address: beanstalkAddress[chainId],
        abi: beanstalkAbi,
        functionName: "withdrawDeposit",
        args: [fromToken.address, stems[0], amounts[0], Number(destination)],
      });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return `Transaction complete!`
        },
        error: (error) => {
          return ((error as BaseError).shortMessage || `Transaction failed.`)
        }
      });
    } else if (transferData.crates.length > 1) {
      const tx = () => writeContractAsync({
        address: beanstalkAddress[chainId],
        abi: beanstalkAbi,
        functionName: "withdrawDeposits",
        args: [fromToken.address, stems, amounts, Number(destination)],
      });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return `Transaction complete!`
        },
        error: (error) => {
          return ((error as BaseError).shortMessage || `Transaction failed.`)
        }
      });
    }
  }

  return (
    <>
      <Card className="max-w-96 h-fit">
        <CardHeader>
          <CardTitle>Withdraw</CardTitle>
          <CardDescription>Withdraw your deposited assets</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label>Amount</Label>
            <ComboInputField 
              amount={amount}
              setAmount={setAmount}
              setToken={setFromToken} 
              selectedToken={fromToken}
              setMaxAmount={setMaxAmount}
              useSiloTokens
            />
          </div>
          <div className="flex flex-row justify-between">
            <Label className="content-center">Destination</Label>
            <DestinationBalanceSelect setBalanceTo={setDestination} />
          </div>
          <div>
            <Button className="w-full" onClick={onSubmit}>
                {"Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Withdraw;
