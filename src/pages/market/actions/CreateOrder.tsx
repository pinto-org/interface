import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SimpleInputField from "@/components/SimpleInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Label } from "@/components/ui/Label";
import { PODS } from "@/constants/internalTokens";
import createPodOrder from "@/encoders/createPodOrder";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import { useFieldData } from "@/state/useFieldData";
import usePodOrders from "@/state/usePodOrders";
import useTokenData from "@/state/useTokenData";
import { type AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BaseError } from "viem";
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";

export default function CreateOrder() {
  const mainToken = useTokenData().mainToken;

  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  const queryClient = useQueryClient();

  function changeAmountIn(value: number) {
    setAmountIn(value);
  }

  const fieldData = useFieldData();
  const podOrders = usePodOrders();
  const queryKey = podOrders.queryKey;

  const maxPlace = Number.parseInt(fieldData.podIndex.toHuman()) || 0;
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
    isUsingMain,
  );

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess, queryKey, queryClient.invalidateQueries]);

  function onSubmit() {
    if (!pricePerPod || !maxPlaceInLine) return;
    const _amount = isUsingMain ? TokenValue.fromHuman(amountIn, mainToken.decimals) : swapData?.output;
    const _maxPlaceInLine = TokenValue.fromHuman(maxPlaceInLine, PODS.decimals);
    const _pricePerPod = TokenValue.fromHuman(pricePerPod, mainToken.decimals);
    const minFill = TokenValue.fromHuman(1, PODS.decimals);
    if (_amount && isUsingMain) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "createPodOrder",
          args: [
            _amount.toBigInt(),
            Number(_pricePerPod),
            _maxPlaceInLine.toBigInt(),
            minFill.toBigInt(),
            Number(balanceFrom),
          ],
        });

      toast.promise(tx, {
        loading: "Submitting transaction...",
        success: (data) => {
          return "Transaction complete!";
        },
        error: (error) => {
          return (error as BaseError).shortMessage || "Transaction failed.";
        },
      });
    } else {
      const podOrder = createPodOrder(
        _amount,
        Number(_pricePerPod),
        _maxPlaceInLine,
        minFill,
        FarmFromMode.INTERNAL,
      ) as AdvancedFarmCall;
      if (swapData?.callData) {
        swapData?.callData.push(podOrder);
        const tx = () =>
          writeContractAsync({
            address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [swapData?.callData],
            value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
          });

        toast.promise(tx, {
          loading: "Submitting transaction...",
          success: (data) => {
            return "Transaction complete!";
          },
          error: (error) => {
            return (error as BaseError).shortMessage || "Transaction failed.";
          },
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Max Place In Line</Label>
        <SimpleInputField amount={maxPlaceInLine} setAmount={setMaxPlaceInLine} />
      </div>
      <div>
        <Label>Price Per Pod</Label>
        <SimpleInputField amount={pricePerPod} setAmount={setPricePerPod} token={mainToken} />
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
      <div className="flex flex-row gap-2 items-center">
        <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} className="h-12" />
        <div className="scale-[1.5]">
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
      </div>
    </div>
  );
}
