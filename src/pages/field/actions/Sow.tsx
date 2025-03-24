import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import OutputDisplay from "@/components/OutputDisplay";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import Warning from "@/components/ui/Warning";
import { PODS } from "@/constants/internalTokens";
import sowWithMin from "@/encoders/sowWithMin";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useInvalidateField, usePodLine, useTotalSoil } from "@/state/useFieldData";
import { useTemperature } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq, stringToNumber } from "@/utils/string";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

import settingsIcon from "@/assets/misc/Settings.svg";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";

import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useMaxBuy from "@/hooks/swap/useMaxBuy";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { getBalanceFromMode } from "@/utils/utils";

type SowProps = {
  isMorning: boolean;
};

const useFilterTokens = (balances: ReturnType<typeof useFarmerBalances>["balances"]) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if (token.isLP || token.isSiloWrapped || token.is3PSiloWrapped) {
        set.add(token);
      }
    });

    return set;
  }, [balances]);
};

function Sow({ isMorning }: SowProps) {
  const temperature = useTemperature();
  const farmerBalances = useFarmerBalances();
  const totalSoil = useTotalSoil().totalSoil;
  const podLine = usePodLine();
  const account = useAccount();
  const diamond = useProtocolAddress();
  const invalidateField = useInvalidateField();
  const { queryKeys: farmerFieldQueryKeys } = useFarmerField();
  const mainToken = useTokenData().mainToken;
  const queryClient = useQueryClient();
  const filterTokens = useFilterTokens(farmerBalances.balances);

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const [didSetPreferred, setDidSetPreferred] = useState(false);

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  const maxSow = useMaxBuy(tokenIn, slippage, totalSoil);

  const swap = useSwap({
    tokenIn: tokenIn,
    tokenOut: mainToken,
    amountIn: tokenIn.isMain ? TV.ZERO : TV.fromHuman(amountIn, tokenIn.decimals),
    slippage,
    disabled: tokenIn.isMain || stringToNumber(amountIn) <= 0 || maxSow?.lte(0),
  });
  const swapBuild = useBuildSwapQuote(swap.data, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swap.data);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: undefined,
    txnType: "Swap",
  });

  const currentTemperature = temperature.scaled;
  const [minTemperature, setMinTemperature] = useState(Math.max(currentTemperature.toNumber(), 1));

  const tokenInBalance = farmerBalances.balances.get(tokenIn);

  const onSuccess = useCallback(() => {
    setAmountIn("0");
    swap.resetSwap();
    invalidateField("all");
    farmerFieldQueryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    queryClient.invalidateQueries({ queryKey: farmerBalances.queryKeys });
  }, [queryClient, farmerFieldQueryKeys, farmerBalances.queryKeys, invalidateField, swap.resetSwap]);

  const { writeWithEstimateGas, isConfirming, submitting, setSubmitting } = useTransaction({
    successCallback: onSuccess,
    errorMessage: "Sow failed",
    successMessage: "Sow successful",
  });

  const isUsingMain = stringEq(tokenIn.address, mainToken.address);

  const pods = useMemo(() => {
    const amount = stringToNumber(amountIn);
    if (amount <= 0) return;

    const multiplier = currentTemperature.add(100).div(100);

    if (isUsingMain) {
      return multiplier.mul(amount);
    } else if (swap?.data?.buyAmount) {
      const numPinto = swap.data.buyAmount;
      return multiplier.mul(numPinto);
    }

    return TokenValue.ZERO;
  }, [amountIn, currentTemperature, isUsingMain, swap.data?.buyAmount]);

  const onSubmit = useCallback(async () => {
    if (inputError) {
      return;
    }

    setSubmitting(true);
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
        : swap.data?.buyAmount || TokenValue.ZERO;

      if (amount.lte(0)) {
        throw new Error("Amount must be greater than 0");
      }

      toast.loading(`Sowing...`);

      // temperature at 6 decimals
      const _minTemp = TokenValue.fromHuman(minTemperature, PODS.decimals);
      const minTemp = (_minTemp.gt(currentTemperature) ? _minTemp : currentTemperature).subSlippage(slippage);

      const minSoil = TokenValue.ZERO;

      if (isUsingMain) {
        return writeWithEstimateGas({
          address: diamond,
          abi: beanstalkAbi,
          functionName: "sowWithMin",
          args: [amount.toBigInt(), minTemp.toBigInt(), minSoil.toBigInt(), Number(balanceFrom)],
        });
      }
      if (!swapBuild || !swapBuild.advFarm.length) {
        throw new Error("No swap quote");
      }

      const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(mainToken, 0, account.address);
      const sowCallStruct = sowWithMin(amount, minTemp, minSoil, FarmFromMode.INTERNAL, clipboard);

      const advFarm = [...swapBuild.advFarm.getSteps()];
      advFarm.push(sowCallStruct);

      const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n;

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [advFarm],
        value,
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Sow failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    writeWithEstimateGas,
    setSubmitting,
    diamond,
    slippage,
    swap.data,
    swapBuild,
    account.address,
    amountIn,
    tokenIn,
    mainToken,
    balanceFrom,
    isUsingMain,
    minTemperature,
    currentTemperature,
    inputError,
  ]);

  const { loading, setLoadingTrue, setLoadingFalse } = useDelayedLoading();

  const numIn = stringToNumber(amountIn);

  // reset amount in when token in changes

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when token in changes
  useEffect(() => {
    setAmountIn("0");
  }, [tokenIn]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when swap data changes
  useEffect(() => {
    if (swap?.isLoading) {
      setLoadingTrue();
    } else {
      setLoadingFalse();
    }
  }, [swap?.isLoading]);

  const isLoading = (numIn > 0 && loading) || (pods?.lte(0) && numIn > 0);

  const ready = pods?.gt(0) && podLine.gte(0) && maxSow?.gt(0);

  const balanceFromMode = getBalanceFromMode(tokenInBalance, balanceFrom);
  const balanceExceedsSoil = balanceFromMode.gt(0) && maxSow && balanceFromMode.gte(maxSow);

  const ctaDisabled = isLoading || isConfirming || submitting || !ready || inputError || !canProceed;

  const buttonText = inputError ? "Amount too large" : "Sow";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="pinto-body-light text-pinto-light">Amount and token to sow</div>
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
          customMaxAmount={maxSow?.gt(0) ? TokenValue.min(balanceFromMode, maxSow) : TokenValue.ZERO}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          setError={setInputError}
          selectedToken={tokenIn}
          error={inputError}
          balanceFrom={balanceFrom}
          disableButton={isConfirming}
          connectedAccount={!!account.address}
          altText={balanceExceedsSoil ? "Usable balance:" : undefined}
          tokenSelectLoading={preferredLoading || !didSetPreferred}
          filterTokens={filterTokens}
          disableClamping={true}
        />
      </div>
      {totalSoil.eq(0) && maxSow?.lte(0) && (
        <Warning>Your usable balance is 0.00 because there is no Soil available.</Warning>
      )}
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
          <Warning>Pods become redeemable for Pinto 1:1 when they reach the front of the Pod Line.</Warning>
        </div>
      ) : null}
      {!tokenIn.isMain && swapSummary?.swap && (
        <RoutingAndSlippageInfo
          title="Total Swap Slippage"
          swapSummary={swapSummary}
          preferredSummary="swap"
          txnType="Swap"
          tokenIn={tokenIn}
          tokenOut={mainToken}
        />
      )}
      {slippageWarning}
      <div className="hidden sm:flex flex-row gap-2">
        <SmartSubmitButton
          variant={isMorning ? "morning" : "gradient"}
          disabled={ctaDisabled}
          token={tokenIn}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          variant={isMorning ? "morning" : "gradient"}
          disabled={ctaDisabled}
          token={tokenIn}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          className="h-full"
        />
      </MobileActionBar>
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
        <Button variant={"ghost"} noPadding className="rounded-full w-10 h-10 ">
          <img src={settingsIcon} className="w-4 h-4 transition-all" alt="slippage" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-52 flex flex-col shadow-none">
        <div className="flex flex-col gap-4">
          <div className="pinto-md">Slippage Tolerance</div>
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
          <div className="pinto-md">Minimum Temperature</div>
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
