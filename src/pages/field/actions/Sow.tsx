import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFieldData } from "@/state/useFieldData";
import { TokenValue } from "@/classes/TokenValue";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import useTokenData from "@/state/useTokenData";
import { Label } from "@/components/ui/Label";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import sowWithMin from "@/encoders/sowWithMin";
import { toast } from "sonner";
import { BaseError } from "viem";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { useAccount, useWriteContract } from "wagmi";
import { useChainId } from "wagmi";

function Sow() {
  const account = useAccount();
  const chainId = useChainId();
  const field = useFieldData();
  const queryKeys = field.queryKeys;
  const mainToken = useTokenData().mainToken;

  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  const queryClient = useQueryClient();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      field.queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess, queryKeys]);

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

  function onSubmit() {
    if (!account.address) return;
    const amount = isUsingMain
      ? TokenValue.fromHuman(amountIn || 0n, tokenIn.decimals)
      : swapData?.output || TokenValue.ZERO;
    const _minTemperature = TokenValue.fromHuman("0", mainToken.decimals);

    const minTemp = _minTemperature.gt(field.temperature.scaled) ? _minTemperature : field.temperature.scaled;
    const minSoil = amount.subSlippage(slippage);

    if (isUsingMain) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "sowWithMin",
          args: [amount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom)],
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
    } else {
      const sow = sowWithMin(amount, minTemp, minSoil, FarmFromMode.INTERNAL) as AdvancedFarmCall;
      if (swapData?.callData) {
        swapData?.callData.push(sow);
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
            return `Transaction complete!`;
          },
          error: (error) => {
            return (error as BaseError).shortMessage || `Transaction failed.`;
          },
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount and Token to lend</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} submitButtonText="Sow" />
      </div>
    </div>
  );
}

export default Sow;
