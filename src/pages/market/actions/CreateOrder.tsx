import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { useFieldData } from "@/state/useFieldData";
import { useWriteContract } from "wagmi";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useChainId } from "wagmi";
import { TokenValue } from "@/classes/TokenValue";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import useTokenData from "@/state/useTokenData";
import { PODS } from "@/constants/internalTokens";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import createPodOrder from "@/encoders/createPodOrder";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import usePodOrders from "@/state/usePodOrders";

export default function CreateOrder() {

    const mainToken = useTokenData().mainToken;

    const [amountIn, setAmountIn] = useState(0);
    const [tokenIn, setTokenIn] = useState(mainToken);
    const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
    const [slippage, setSlippage] = useState(0.1);

    const queryClient = useQueryClient();
  
    function changeAmountIn(value: number) {
      setAmountIn(value)
    };

    const fieldData = useFieldData();
    const podOrders = usePodOrders();
    const queryKey = podOrders.queryKey;

    const maxPlace = parseInt(fieldData.podIndex.toHuman()) || 0;
    const [maxPlaceInLine, setMaxPlaceInLine] = useState<number | undefined>(undefined);
    const [pricePerPod, setPricePerPod] = useState<number | undefined>(undefined);

    const chainId = useChainId();
    const { data: hash, writeContractAsync, isSuccess } = useWriteContract();
    
    const isUsingMain = tokenIn.address === mainToken.address;
  
    const swapData = useSwapEstimate(
      tokenIn,
      mainToken,
      amountIn,
      slippage,
      "exactInput",
      balanceFrom,
      FarmToMode.INTERNAL,
      undefined,
      isUsingMain
    );

    useEffect(() => {
      if (isSuccess) {
        // invalidating query results to trigger a refetch
        queryClient.invalidateQueries({ queryKey });
      };
    }, [isSuccess, queryKey]);

    function onSubmit() {
      if (!pricePerPod || !maxPlaceInLine) return
      const _amount = isUsingMain ? TokenValue.fromHuman(amountIn, mainToken.decimals) : swapData?.output;
      const _maxPlaceInLine = TokenValue.fromHuman(maxPlaceInLine, PODS.decimals);
      const _pricePerPod = TokenValue.fromHuman(pricePerPod, mainToken.decimals);
      const minFill = TokenValue.fromHuman(1, PODS.decimals);
      if (_amount && isUsingMain) {
        const tx = () => writeContractAsync({
          address: beanstalkAddress[chainId],
          abi: beanstalkAbi,
          functionName: "createPodOrder",
          args: [
            _amount.toBigInt(),
            Number(_pricePerPod),
            _maxPlaceInLine.toBigInt(),
            minFill.toBigInt(),
            Number(balanceFrom)
          ]
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
      } else {
        const podOrder = createPodOrder(
          _amount,
          Number(_pricePerPod),
          _maxPlaceInLine,
          minFill,
          FarmFromMode.INTERNAL
        ) as AdvancedFarmCall;
        if (swapData?.callData) {
          swapData?.callData.push(podOrder);
          const tx = () => writeContractAsync({
            address: beanstalkAddress[chainId],
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [swapData?.callData],
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
      };
    };

    return (
        <Card className="h-fit w-full">
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
          <CardDescription>Create a buy order</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label>Max Place In Line</Label>
            <Input type="number" inputMode="numeric" value={maxPlaceInLine} onChange={(e) => setMaxPlaceInLine(Number(e.target.value))}/>
          </div>
          <div>
            <Label>Price Per Pod</Label>
            <div className="flex flex-row gap-2">
              <Input type="number" inputMode="numeric" value={pricePerPod} onChange={(e) => setPricePerPod(Number(e.target.value))}/>
              <Button variant="outline" type="button" className="hover:cursor-default hover:bg-white">{mainToken.symbol}</Button>
            </div>
          </div>
          <div>
            <Label>Order Using</Label>
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
          <div className="flex flex-row gap-2">
            <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit}/>
            <SlippageButton slippage={slippage} setSlippage={setSlippage} />
          </div>
          </CardContent>
      </Card>

    )
}