import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import deposit from "@/encoders/deposit";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun } from "@/state/useSunData";
import { stringEq, stringToNumber } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useFilterTokens = (siloToken: Token, balances: ReturnType<typeof useFarmerBalances>["balances"]) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if ((token.isLP && !tokensEqual(token, siloToken)) || token.isSiloWrapped || token.is3PSiloWrapped) {
        set.add(token);
      }
    });

    return {
      filterSet: set,
      filterPreferred: Array.from(set),
    };
  }, [siloToken, balances]);
};

function Deposit({ siloToken }: { siloToken: Token }) {
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const invalidateSun = useInvalidateSun();
  const { filterSet, filterPreferred } = useFilterTokens(siloToken, farmerBalances.balances);
  const { queryKeys: priceQueryKeys } = usePriceData();
  const account = useAccount();

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
    filter: filterPreferred,
    token: siloToken,
  });

  const siloData = useSiloData();

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.5);
  const qc = useQueryClient();

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  const shouldSwap = !tokensEqual(tokenIn, siloToken);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut: siloToken,
    slippage,
    amountIn: TokenValue.fromHuman(amountIn, tokenIn.decimals),
    disabled: !shouldSwap,
  });

  const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals) : undefined;

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(siloToken);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Deposit",
  });

  const onSuccess = useCallback(() => {
    setAmountIn("0");
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => qc.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
    resetSwap();
    priceImpactQuery.clear();
  }, [
    farmerSilo.queryKeys,
    farmerBalances.queryKeys,
    priceQueryKeys,
    invalidateSun,
    qc.invalidateQueries,
    resetSwap,
    priceImpactQuery.clear,
  ]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Deposit successful",
    errorMessage: "Deposit failed",
    successCallback: onSuccess,
  });

  const handleSetTokenIn = useCallback(
    (newToken: Token) => {
      if (tokensEqual(newToken, tokenIn)) return;
      setAmountIn("0");
      setTokenIn(newToken);
    },
    [tokenIn],
  );

  const depositOutput = useMemo(() => {
    const sData = siloData.tokenData.get(siloToken);
    if (stringToNumber(amountIn) <= 0 || !sData) return undefined;
    if (tokensEqual(siloToken, tokenIn)) {
      const amount = TokenValue.fromHuman(amountIn, siloToken.decimals);

      return {
        amount,
        stalkGain: amount.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: amount.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    } else if (swapData?.buyAmount.gt(0)) {
      return {
        amount: swapData.buyAmount,
        stalkGain: swapData.buyAmount.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: swapData.buyAmount.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    }

    return undefined;
  }, [siloData, swapData, siloToken, tokenIn, amountIn]);

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) {
        throw new Error("No account connected");
      }

      const buyAmount = shouldSwap ? swapData?.buyAmount : TokenValue.fromHuman(amountIn, tokenIn.decimals);

      if (!shouldSwap && buyAmount) {
        setSubmitting(true);
        toast.loading(`Depositing...`);

        return writeWithEstimateGas({
          address: diamondAddress,
          abi: depositABI,
          functionName: "deposit",
          args: [siloToken.address, buyAmount.blockchainString, Number(balanceFrom)],
        });
      }

      if (!swapData || !swapBuild?.advancedFarm?.length) {
        throw new Error("No quote");
      }
      const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals) : undefined;

      const advFarm = [...swapBuild.advFarm.getSteps()];
      const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(siloToken, 1, account.address, {
        value: value ?? TokenValue.ZERO,
      });

      const depositCallStruct = deposit(siloToken, buyAmount, FarmFromMode.INTERNAL, clipboard);
      advFarm.push(depositCallStruct);

      toast.loading(`Depositing...`);

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [advFarm],
        value: value?.toBigInt(),
      });
    } catch (e: unknown) {
      console.error(e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Deposit failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    writeWithEstimateGas,
    setSubmitting,
    account.address,
    diamondAddress,
    swapBuild,
    siloToken,
    tokenIn,
    amountIn,
    balanceFrom,
    swapData,
    shouldSwap,
  ]);

  const isWellUnderlying = siloToken.tokens?.some((tk) => stringEq(tk, tokenIn.address));

  const swapDataNotReady = (shouldSwap && (!swapData || !swapBuild)) || !!swapQuery.error;

  const depositingSiloToken = tokensEqual(siloToken, tokenIn);
  // need to define types for routers

  const disabled = !stringToNumber(amountIn) || !account.address || submitting || isConfirming || swapDataNotReady;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
            Amount and token to use
          </div>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={handleSetTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
          tokenSelectLoading={!didSetPreferred || preferredLoading}
          filterTokens={filterSet}
        />

        {(!depositOutput && stringToNumber(amountIn) > 0) || swapQuery.isLoading ? (
          <div
            className={cn(
              `flex flex-col w-full items-center justify-center`,
              depositingSiloToken ? "h-[181px]" : "h-[222.5px]",
            )}
          >
            <FrameAnimator size={64} />
          </div>
        ) : depositOutput ? (
          <div className="mt-6">
            <SiloOutputDisplay
              amount={depositOutput.amount}
              token={siloToken}
              stalk={depositOutput.stalkGain}
              seeds={depositOutput.seedGain}
            />
          </div>
        ) : null}
        {!depositingSiloToken && stringToNumber(amountIn) > 0 && (
          <RoutingAndSlippageInfo
            title="Total Deposit Slippage"
            swapSummary={swapSummary}
            priceImpactSummary={priceImpactSummary}
            preferredSummary={isWellUnderlying ? "priceImpact" : "swap"}
            txnType="Deposit"
            tokenIn={tokenIn}
            tokenOut={siloToken}
          />
        )}
        {slippageWarning}
      </div>
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={tokenIn}
          disabled={disabled || !canProceed}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText="Deposit"
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={tokenIn}
          disabled={disabled || !canProceed}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText="Deposit"
          className="h-full"
        />
      </MobileActionBar>
    </div>
  );
}

export default Deposit;

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

const depositABI = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "enum LibTransfer.From", name: "mode", type: "uint8" },
    ],
    name: "deposit",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "_bdv", type: "uint256" },
      { internalType: "int96", name: "stem", type: "int96" },
    ],
    stateMutability: "payable",
    type: "function",
  },
] as const;
