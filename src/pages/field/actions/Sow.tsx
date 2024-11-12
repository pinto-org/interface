import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Label } from "@/components/ui/Label";
import sowWithMin from "@/encoders/sowWithMin";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";

function Sow() {
  const account = useAccount();
  const chainId = useChainId();
  const field = useFieldData();
  const { queryKey: farmerFieldQueryKey } = useFarmerField();
  const mainToken = useTokenData().mainToken;

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  const queryClient = useQueryClient();

  const { writeContractAsync, isConfirming } = useTransaction({
    successCallback: () => {
      setAmountIn("0");
      // invalidating query results to trigger a refetch
      field.queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
      queryClient.invalidateQueries({ queryKey: farmerFieldQueryKey });
    },
  });

  const isUsingMain = tokenIn.address === mainToken.address;

  const swapData = useSwapEstimate(
    tokenIn,
    mainToken,
    Number(amountIn),
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    undefined,
    isUsingMain,
  );

  function onSubmit() {
    try {
      if (!account.address) {
        throw new Error("Signer required");
      }

      const amount = isUsingMain
        ? TokenValue.fromHuman(amountIn || 0n, tokenIn.decimals)
        : swapData?.output || TokenValue.ZERO;
      const _minTemperature = TokenValue.fromHuman("0", mainToken.decimals);

      const minTemp = _minTemperature.gt(field.temperature.scaled)
        ? _minTemperature.subSlippage(slippage)
        : field.temperature.scaled.subSlippage(slippage);
      const minSoil = TokenValue.ZERO;

      if (isUsingMain) {
        return writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "sowWithMin",
          args: [amount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom)],
        });
      } else {
        const sow = sowWithMin(
          amount,
          minTemp,
          minSoil,
          FarmFromMode.INTERNAL,
          swapData?.pipeOutputSlot && swapData.farmCalls
            ? Clipboard.encodeSlot(swapData.farmCalls.length || 0, swapData.pipeOutputSlot, 0)
            : undefined,
        ) as AdvancedFarmCall;
        const swapCallData = swapData?.callData;
        if (swapCallData) {
          swapCallData.push(sow);
          return writeContractAsync({
            address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [swapCallData],
            value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
            gas: 4000000n,
          });
        }
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error((e as BaseError).shortMessage || "Transaction failed.");
      throw e;
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
          disableButton={isConfirming}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} submitButtonText="Sow" />
      </div>
    </div>
  );
}

export default Sow;
