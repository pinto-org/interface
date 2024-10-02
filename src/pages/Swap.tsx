import marketIcon from "@/assets/protocol/Market.png";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { UpDownArrowsIcon, UpRightArrowIcon } from "@/components/Icons";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BaseError } from "viem";
import { useChainId, useWriteContract } from "wagmi";

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

  const swapData = useSwapEstimate(tokenIn, tokenOut, amountIn, slippage, "exactInput", balanceFrom, balanceTo);

  useEffect(() => {
    if (swapData?.mode === "exactInput") {
      setAmountOut(Number(swapData?.output.toHuman()));
    } else if (swapData?.mode === "exactOutput") {
      setAmountIn(Number(swapData?.output.toHuman()));
    }
  }, [swapData?.output, swapData?.mode]);

  function changeAmountIn(value: number) {
    setAmountIn(value);
  }

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess, queryKey, queryClient]);

  function invertTokens() {
    const newTokenIn = tokenOut;
    const newTokenOut = tokenIn;
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
  }

  async function onSubmit() {
    if (!swapData || !swapData.callData) return;
    /* const encoded = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapData.callData],
        value: TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt()
      }); */
    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId],
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapData.callData],
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

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col self-center w-[700px]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-pinto-h1 text-black inline-flex gap-2 items-center">
              <img src={marketIcon} className="h-12 w-12" alt={"Market logo"} />
              Market
            </div>
            <div className="font-[340] text-[1.25rem] text-pinto-gray-4">Buy and sell Pinto-native assets.</div>
          </div>
          <div className="flex flex-row items-center">
            <Button
              variant={"outline"}
              className="rounded-[0.75rem] text-[1rem] text-black font-[500] -tracking-[0.02em] inline-flex gap-2"
            >
              Buy and sell Pods
              <UpRightArrowIcon color={"currentColor"} />
            </Button>
            <SlippageButton slippage={slippage} setSlippage={setSlippage} />
          </div>
        </div>
        <div className="flex flex-col mt-9 gap-4">
          <div>
            <Label>Sell</Label>
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
            <Button
              onClick={invertTokens}
              variant={"outline"}
              className="rounded-full h-10 w-10 p-0 self-center hover:cursor-pointer"
            >
              <UpDownArrowsIcon />
            </Button>
          </div>
          <div>
            <Label>Buy</Label>
            <ComboInputField
              amount={amountOut}
              setAmount={setAmountOut}
              setToken={setTokenOut}
              selectedToken={tokenOut}
              isLoading={swapData?.isLoading || false}
              disableInlineBalance
            />
          </div>
          <div>
            <Label className="content-center">Send output to:</Label>
            <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
          </div>
          <div className="mt-6 flex">
            <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} className="h-[5.25rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
