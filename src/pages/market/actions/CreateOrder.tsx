import podIcon from "@/assets/protocol/Pod.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SimpleInputField from "@/components/SimpleInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { PODS } from "@/constants/internalTokens";
import createPodOrder from "@/encoders/createPodOrder";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useIsWSOL, useTokenMap } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const pricePerPodValidation = {
  maxValue: 1,
  minValue: 0.000001,
  maxDecimals: 6,
};

const maxPlaceInLineValidation = {
  minValue: 1,
  maxValue: 999999999999,
  maxDecimals: 0,
};

const useFilterTokens = () => {
  const tokens = useTokenMap();
  const isWSOL = useIsWSOL();

  return useMemo(() => {
    const set = new Set<Token>();

    [...Object.values(tokens)].forEach((token) => {
      if (token.isLP || token.isSiloWrapped || token.is3PSiloWrapped || isWSOL(token)) {
        set.add(token);
      }
    });
    return set;
  }, [tokens, isWSOL]);
};

export default function CreateOrder() {
  const diamondAddress = useProtocolAddress();
  const mainToken = useTokenData().mainToken;
  const { queryKeys: balanceQKs } = useFarmerBalances();
  const { address: account } = useAccount();
  const [inputError, setInputError] = useState(false);

  const queryClient = useQueryClient();
  const { allPodOrders, allMarket, farmerMarket } = useQueryKeys({ account });
  const allQK = useMemo(
    () => [allPodOrders, allMarket, farmerMarket, ...balanceQKs],
    [allPodOrders, allMarket, farmerMarket, balanceQKs],
  );

  const filterTokens = useFilterTokens();
  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  const shouldSwap = !tokensEqual(tokenIn, mainToken);

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut: mainToken,
    slippage,
    amountIn: amountInTV,
    disabled: !shouldSwap || inputError,
  });

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const beansInOrder = !shouldSwap
    ? amountInTV
    : swapSummary?.swap.routes[swapSummary?.swap.routes.length - 1].amountOut ?? TV.ZERO;

  const value = tokenIn.isNative ? amountInTV : undefined;

  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(mainToken);

  const { slippageWarning, canProceed: ackSlippage } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Swap",
  });

  // Pod constants
  const podIndex = usePodIndex();
  const harvestableIndex = useHarvestableIndex();
  const maxPlace = Number.parseInt(podIndex.toHuman()) - Number.parseInt(harvestableIndex.toHuman()) || 0;
  const [maxPlaceInLine, setMaxPlaceInLine] = useState<number | undefined>(undefined);
  const [pricePerPod, setPricePerPod] = useState<number | undefined>(undefined);

  // set preferred token
  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  // invalidate pod orders query
  const onSuccess = useCallback(() => {
    setAmountIn("");
    setMaxPlaceInLine(undefined);
    setPricePerPod(undefined);
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient, allQK]);

  // state for toast txns
  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order creation successful",
    errorMessage: "Order creation failed",
    successCallback: onSuccess,
  });

  // submit txn
  const onSubmit = useCallback(async () => {
    if (!account) {
      throw new Error("No account connected");
    }
    if (shouldSwap && (!swapData || !swapBuild?.advancedFarm?.length)) {
      throw new Error("No quote");
    }

    if (amountInTV.isZero) {
      throw new Error("Amount required");
    }

    const advFarm = shouldSwap && swapBuild ? [...swapBuild.advancedFarm] : [];

    const _amount = shouldSwap ? TV.ZERO : amountInTV;
    const fromMode = shouldSwap ? FarmFromMode.INTERNAL : balanceFrom;
    const orderClipboard =
      shouldSwap && swapBuild
        ? await swapBuild.deriveClipboardWithOutputToken(mainToken, 5, account, {
            value: value ?? TV.ZERO,
          })
        : undefined;

    const _maxPlaceInLine = TokenValue.fromHuman(maxPlaceInLine?.toString() || "0", PODS.decimals);
    const _pricePerPod = TokenValue.fromHuman(pricePerPod?.toString() || "0", mainToken.decimals);
    const minFill = TokenValue.fromHuman("1", PODS.decimals);

    const orderCallStruct = createPodOrder(
      account,
      _amount,
      Number(_pricePerPod),
      _maxPlaceInLine,
      minFill,
      fromMode,
      orderClipboard?.clipboard,
    );

    advFarm.push(orderCallStruct);

    try {
      setSubmitting(true);
      toast.loading("Creating Order...");
      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [advFarm],
        value: (value ?? TV.ZERO).toBigInt(),
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Create Order failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    account,
    shouldSwap,
    swapData,
    amountInTV,
    value,
    maxPlaceInLine,
    pricePerPod,
    balanceFrom,
    writeWithEstimateGas,
    setSubmitting,
    diamondAddress,
    mainToken,
    swapBuild,
  ]);

  const swapDataNotReady = (shouldSwap && (!swapData || !swapBuild)) || !!swapQuery.error;

  // ui state
  const formIsFilled = !!pricePerPod && !!maxPlaceInLine && !!account && amountInTV.gt(0);
  const disabled = !formIsFilled || swapDataNotReady;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">I want to order Pods with a Place in Line up to:</p>
        <SimpleInputField
          amount={maxPlaceInLine}
          setAmount={setMaxPlaceInLine}
          placeholder={formatter.noDec(maxPlace)}
          validation={maxPlaceInLineValidation}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="pinto-body text-pinto-light">Amount I am willing to pay for each Pod</p>
        <SimpleInputField
          amount={pricePerPod}
          setAmount={setPricePerPod}
          token={mainToken}
          placeholder="0.05"
          validation={pricePerPodValidation}
        />
      </div>
      <div className="-mt-2">
        <div className="flex flex-row justify-between items-center">
          <p className="pinto-body text-pinto-light">Order Using</p>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          connectedAccount={!!account}
          disableInput={isConfirming || submitting}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          setError={setInputError}
          error={inputError}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
          filterTokens={filterTokens}
          tokenSelectLoading={preferredLoading || !didSetPreferred}
          disableClamping={true}
        />
        {shouldSwap && amountInTV.gt(0) && (
          <RoutingAndSlippageInfo
            title="Total Swap Slippage"
            swapSummary={swapSummary}
            priceImpactSummary={priceImpactSummary}
            preferredSummary="swap"
            txnType="Swap"
            tokenIn={tokenIn}
            tokenOut={mainToken}
          />
        )}
        {slippageWarning}
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        {disabled && formIsFilled && (
          <div className="flex justify-center">
            <FrameAnimator className="-mt-5 -mb-10" size={150} />
          </div>
        )}
        {!disabled && (
          <ActionSummary beansIn={beansInOrder} pricePerPod={pricePerPod} maxPlaceInLine={maxPlaceInLine} />
        )}
        <div className="flex flex-row gap-2 items-center">
          <SmartSubmitButton
            variant="gradient"
            size="xxl"
            submitButtonText={inputError ? "Insufficient funds" : "Order Pods"}
            token={tokenIn}
            disabled={disabled || !ackSlippage || isConfirming || submitting}
            amount={amountIn}
            balanceFrom={balanceFrom}
            submitFunction={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

const ActionSummary = ({
  beansIn,
  pricePerPod,
  maxPlaceInLine,
}: { beansIn: TV; pricePerPod: number; maxPlaceInLine: number }) => {
  const podsOut = beansIn.div(TokenValue.fromHuman(pricePerPod, 6));

  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">If my order is filled, I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={podIcon} className="w-8 h-8" alt={"order summary pods"} />
          {formatter.number(podsOut, { minDecimals: 0, maxDecimals: 2 })} Pods
        </p>
        <p className="pinto-body text-pinto-light">between 0 and {formatter.noDec(maxPlaceInLine)} in Line.</p>
        <p className="pinto-sm text-pinto-light">You can cancel the order at any time.</p>
      </div>
    </div>
  );
};

const advFarmABI = [
  {
    type: "function",
    inputs: [
      {
        name: "data",
        internalType: "struct AdvancedFarmCall[]",
        type: "tuple[]",
        components: [
          { name: "callData", internalType: "bytes", type: "bytes" },
          { name: "clipboard", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "advancedFarm",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
  },
] as const;
