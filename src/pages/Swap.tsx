import { useChainId, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/Button";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Label } from "@/components/ui/Label";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import useTokenData from "@/state/useTokenData";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BaseError } from "viem";


export default function Swap() {

  const BEAN = useTokenData().mainToken;
  const OUTPUT_TOKEN = useTokenData().preferredTokens[1];
  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(BEAN);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [amountOut, setAmountOut] = useState(0);
  const [tokenOut, setTokenOut] = useState(OUTPUT_TOKEN);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const chainId = useChainId();

  const queryClient = useQueryClient();
  const { queryKey } = useFarmerBalances();

  const swapData = useSwapEstimate(tokenIn, tokenOut, amountIn, slippage, 'exactInput', balanceFrom, balanceTo);

  useEffect(() => {
    if (swapData?.mode === "exactInput") {
      setAmountOut(Number(swapData?.output.toHuman()))
    } else if (swapData?.mode === "exactOutput") {
      setAmountIn(Number(swapData?.output.toHuman()))
    }
  }, [swapData?.output])

  function changeAmountIn(value: number) {
    setAmountIn(value)
  };

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  function invertTokens() {
    const newTokenIn = tokenOut
    const newTokenOut = tokenIn
    setTokenIn(newTokenIn)
    setTokenOut(newTokenOut)
  };

  async function onSubmit() {
    if (!swapData || !swapData.callData) return;
      /* const encoded = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapData.callData],
        value: TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt()
      }); */
      const tx = () => writeContractAsync({
        address: beanstalkAddress[chainId],
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapData.callData],
        value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n
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
  };

  return (
    <div className="flex flex-row justify-center">
      <Card className="h-fit w-[450px]">
        <CardHeader>
          <CardTitle>Swap</CardTitle>
          <CardDescription>Swap between tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label>Amount In</Label>
            <ComboInputField
              amount={amountIn}
              setAmount={setAmountIn}
              setToken={setTokenIn}
              setBalanceFrom={setBalanceFrom}
              selectedToken={tokenIn}
              balanceFrom={balanceFrom}
              setMaxAmount={changeAmountIn}
            />
          </div>
          <div className="flex flex-row justify-center">
            <Button type="button" onClick={invertTokens}>↕️</Button>
          </div>
          <div>
            <Label>Amount Out</Label>
            <ComboInputField
              amount={amountOut}
              setAmount={setAmountOut}
              setToken={setTokenOut}
              selectedToken={tokenOut}
              isLoading={swapData?.isLoading || false}
              hideMax
            />
          </div>
          <div className="flex flex-row justify-between">
            <Label className="content-center">Destination</Label>
            <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
          </div>
          <div className="flex flex-row gap-2">
            <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit}/>
            <SlippageButton slippage={slippage} setSlippage={setSlippage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
