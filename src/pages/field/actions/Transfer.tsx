import { useEffect, useState } from "react";
import { BaseError, encodeFunctionData, isAddress } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ComboPlotInputField from "@/components/ComboPlotInputField";

function Transfer() {
  const farmerField = useFarmerField();
  const queryKey = farmerField.queryKey;
  const [plots, setPlots] = useState([]);
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState<string | undefined>();

  const chainId = useChainId();
  const account = useAccount();
  const queryClient = useQueryClient();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  function onSubmit() {
    const amountTV = TokenValue.fromHuman(amount, PODS.decimals);
    if (!account.address || !amount || amountTV.lte(0) || !isAddress(recipient || '')) return;
    
    const transfers = [];
    plots.forEach((plot) => {
      const _amount = plots.length === 1 ? amountTV : plot.pods;
      const transferCall = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "transferPlot",
        args: [
          account.address,
          recipient,
          plot.index.toBigInt(), //plot id
          TokenValue.ZERO.toBigInt(), // start
          _amount.toBigInt(), // end
        ],
      });
      transfers.push(transferCall);
    });
    const tx = () => writeContractAsync({
      address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      abi: beanstalkAbi,
      functionName: "farm",
      args: [transfers],
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

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle>Transfer</CardTitle>
        <CardDescription>Transfer your plots</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label>Amount</Label>
          <ComboPlotInputField 
            amount={amount}
            selectedPlots={plots}
            setAmount={setAmount}
            setPlots={setPlots}
            type="multiple"
          />
        </div>
        <div>
          <Label>Transfer to</Label>
          <Input type="text" inputMode="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </div>
        <div>
          <Button type="button" className="w-full" onClick={onSubmit}>
            {"Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Transfer;
