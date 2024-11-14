import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import OutputDisplay from "@/components/OutputDisplay";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import Text from "@/components/ui/Text";
import Warning from "@/components/ui/Warning";
import { PODS } from "@/constants/internalTokens";
import sowWithMin from "@/encoders/sowWithMin";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useField, useInvalidateField, usePodLine, useTotalSoil } from "@/state/useFieldData";
import useTemperature from "@/state/useTemperature";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq, stringToNumber } from "@/utils/string";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useAccount } from "wagmi";

import settingsIcon from "@/assets/misc/Settings.svg";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { getBalanceFromMode } from "@/utils/utils";

type SowProps = {
  isMorning: boolean;
};

const useMaxSow = (tokenIn: Token, slippage: number) => {
  const totalSoil = useTotalSoil();
  const mainToken = useTokenData().mainToken;

  const swap = useSwapEstimate(
    mainToken,
    tokenIn,
    Math.max(totalSoil.toNumber(), 0),
    slippage,
    "exactInput",
    FarmFromMode.EXTERNAL,
    FarmToMode.INTERNAL,
    undefined,
    false,
  );

  return useMemo(() => {
    if (tokenIn.isMain) {
      return totalSoil;
    }

    return swap?.output;
  }, [swap?.output, tokenIn.isMain, totalSoil]);
};

function Sow({ isMorning }: SowProps) {
  const [{ current: currentTemperature }] = useTemperature();
  const farmerBalances = useFarmerBalances();
  const podLine = usePodLine();
  const account = useAccount();
  const diamond = useProtocolAddress();
  const invalidateField = useInvalidateField();
  const { queryKey: farmerFieldQueryKey } = useFarmerField();
  const mainToken = useTokenData().mainToken;
  const queryClient = useQueryClient();

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const [minTemperature, setMinTemperature] = useState(Math.max(currentTemperature.toNumber(), 1));

  const tokenInBalance = farmerBalances.balances.get(tokenIn);

  const { writeContractAsync, isConfirming } = useTransaction({
    successCallback: () => {
      setAmountIn("0");
      // invalidating query results to trigger a refetch
      invalidateField("all");
      queryClient.invalidateQueries({ queryKey: farmerFieldQueryKey });
      queryClient.invalidateQueries({ queryKey: farmerBalances.queryKey });
    },
  });

  const maxSow = useMaxSow(tokenIn, slippage);

  const isUsingMain = stringEq(tokenIn.address, mainToken.address);

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

  const pods = useMemo(() => {
    const amount = stringToNumber(amountIn);
    if (amount <= 0) return;

    const multiplier = currentTemperature.add(100).div(100);

    if (isUsingMain) {
      return multiplier.mul(amount);
    } else if (swapData?.output) {
      const numPinto = swapData.output;
      return multiplier.mul(numPinto);
    }

    return TokenValue.ZERO;
  }, [amountIn, currentTemperature, isUsingMain, swapData?.output]);

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) {
        throw new Error("Signer required");
      }
      if (minTemperature < 0) {
        throw new Error("Min temperature must be greater than 0");
      }
      if (currentTemperature.lte(0)) {
        throw new Error("Current temperature must be greater than 0");
      }

      const amount = isUsingMain
        ? TokenValue.fromHuman(amountIn || 0n, tokenIn.decimals)
        : swapData?.output || TokenValue.ZERO;

      if (amount.lte(0)) {
        throw new Error("Amount must be greater than 0");
      }

      toast.loading(
        `Sowing ${formatter.token(amountIn, tokenIn)} ${tokenIn.symbol} for ${formatter.token(pods, PODS)} Pods`,
      );

      // temperature at 6 decimals
      const _minTemp = TokenValue.fromHuman(minTemperature, PODS.decimals);
      const minTemp = (_minTemp.gt(currentTemperature) ? _minTemp : currentTemperature).subSlippage(slippage);

      console.log("minTemp", minTemp.toBlockchain());

      const minSoil = TokenValue.ZERO;

      if (isUsingMain) {
        return writeContractAsync({
          address: diamond,
          abi: beanstalkAbi,
          functionName: "sowWithMin",
          args: [amount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom)],
        });
      } else {
        const swapClipboard =
          swapData?.pipeOutputSlot && swapData.farmCalls
            ? Clipboard.encodeSlot(swapData.farmCalls.length || 0, swapData.pipeOutputSlot, 0)
            : undefined;

        const sow = sowWithMin(amount, minTemp, minSoil, FarmFromMode.INTERNAL, swapClipboard);

        const swapCallData = swapData?.callData;
        if (swapCallData) {
          const calls = [...swapCallData, sow];
          return writeContractAsync({
            address: diamond,
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [calls],
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
  }, [
    writeContractAsync,
    diamond,
    swapData,
    account.address,
    amountIn,
    tokenIn,
    balanceFrom,
    isUsingMain,
    minTemperature,
    currentTemperature,
  ]);

  const { loading, setLoadingTrue, setLoadingFalse } = useDelayedLoading();

  const numIn = stringToNumber(amountIn);

  // reset amount in when token in changes
  useEffect(() => {
    setAmountIn("0");
  }, [tokenIn]);

  useEffect(() => {
    if (swapData?.isLoading) {
      setLoadingTrue();
    } else {
      setLoadingFalse();
    }
  }, [amountIn, swapData?.isLoading]);

  const isLoading = (numIn > 0 && loading) || (pods?.lte(0) && numIn > 0);

  const ready = pods?.gt(0) && podLine.gte(0) && maxSow?.gt(0);

  const balanceFromMode = getBalanceFromMode(tokenInBalance, balanceFrom);
  const balanceExceedsSoil = balanceFromMode.gt(0) && maxSow && balanceFromMode.gte(maxSow);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Text variant="body-light" color="light">
            Amount and token to sow
          </Text>
          <SettingsPoppover
            slippage={slippage}
            setSlippage={setSlippage}
            minTemperature={minTemperature}
            setMinTemperature={setMinTemperature}
          />
        </div>
        <ComboInputField
          amount={amountIn}
          disableInput={isConfirming}
          customMaxAmount={maxSow?.lt(0) ? TokenValue.ZERO : maxSow}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
          disableButton={isConfirming}
          altText={balanceExceedsSoil ? "Usable balance:" : undefined}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col w-full h-[224px] items-center justify-center">
          <FrameAnimator size={64} />
        </div>
      ) : ready ? (
        <div className="flex flex-col gap-6 px-2">
          <OutputDisplay>
            <OutputDisplay.Item label="Pods">
              <OutputDisplay.Value value={formatter.token(pods, PODS)} token={PODS} suffix={PODS.symbol} />
            </OutputDisplay.Item>
            <OutputDisplay.Item label="Place in line">
              <OutputDisplay.Value value={formatter.noDec(podLine)} />
            </OutputDisplay.Item>
          </OutputDisplay>
          <Warning>Pods become redeemable for one Pinto when they reach the front of the line.</Warning>
        </div>
      ) : null}
      <div className="flex flex-row gap-2">
        <SmartSubmitButton
          variant={isMorning ? "morning" : undefined}
          disabled={isLoading || isConfirming}
          token={tokenIn}
          amount={amountIn}
          submitFunction={onSubmit}
          submitButtonText="Sow"
        />
      </div>
    </div>
  );
}

export default Sow;

const SettingsPoppover = ({
  slippage,
  setSlippage,
  minTemperature,
  setMinTemperature,
}: {
  slippage: number;
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
  minTemperature: number;
  setMinTemperature: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [internalAmount, setInternalAmount] = useState(slippage);
  const [internalMinTemperature, setInternalMinTemperature] = useState(minTemperature);

  useDebouncedEffect(
    () => {
      setSlippage(internalAmount);
    },
    [internalAmount],
    100,
  );

  useDebouncedEffect(
    () => {
      setMinTemperature(internalMinTemperature);
    },
    [internalMinTemperature],
    100,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} noPadding className="rounded-full w-10 h-10">
          <img src={settingsIcon} className="w-4 h-4 transition-all" alt="slippage" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 flex flex-col">
        <div className="flex flex-col gap-2">
          <Text className="mb-4">Slippage</Text>
          <div className="flex flex-row gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={internalAmount}
              onChange={(e) => setInternalAmount(Number(e.target.value))}
            />
            <div className="text-xl self-center">%</div>
          </div>
          <Text className="mb-4">Min temperature</Text>
          <div className="flex flex-row gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={internalMinTemperature}
              onChange={(e) => setInternalMinTemperature(Number(e.target.value))}
            />
            <div className="text-xl self-center">%</div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
