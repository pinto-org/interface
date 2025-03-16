import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { sortAndPickCrates } from "@/utils/convert";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Address, BaseError, isAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useWriteContract } from "wagmi";

function Transfer() {
  const account = useAccount();
  const chainId = useChainId();
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const BEAN = useTokenData().mainToken;
  const [fromToken, setFromToken] = useState(BEAN);
  const [amount, setAmount] = useState("0");
  const [recipient, setRecipient] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      farmerSilo.queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess]);

  async function onSubmit() {
    const userAddress = account.address;
    if (!amount || Number(amount) <= 0 || !recipient || !isAddress(recipient) || !userAddress) return;

    const deposits = farmerDeposits.get(fromToken);

    const transferData = sortAndPickCrates(
      "transfer",
      TokenValue.fromHuman(amount || 0, fromToken.decimals),
      deposits?.deposits ?? [],
    );

    const stems = transferData.crates.map((crate) => crate.stem.toBlockchain());
    const amounts = transferData.crates.map((crate) => crate.amount.toBlockchain());

    if (transferData.crates.length === 1) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "transferDeposit",
          args: [userAddress, recipient as Address, fromToken.address, BigInt(stems[0]), BigInt(amounts[0])],
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
          functionName: "transferDeposits",
          args: [
            userAddress,
            recipient as Address,
            fromToken.address,
            stems.map((stem) => BigInt(stem)),
            amounts.map((amount) => BigInt(amount)),
          ],
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
    <>
      <Card className="max-w-96 h-fit">
        <CardHeader>
          <CardTitle>Transfer</CardTitle>
          <CardDescription>Transfer your deposited assets</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label>Amount</Label>
            <ComboInputField
              amount={amount}
              setAmount={setAmount}
              setToken={setFromToken}
              selectedToken={fromToken}
              // useSiloTokens
            />
          </div>
          <div>
            <Label>Transfer to</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div>
            <Button onClick={onSubmit} className="w-full">
              {"Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Transfer;
