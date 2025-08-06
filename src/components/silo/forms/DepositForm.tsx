import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import { SiloActionFormProps } from "@/components/SiloActionDialog";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import deposit from "@/encoders/deposit";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useSiloActionForm } from "@/hooks/silo/useSiloActionForm";
import { useSiloActionValidation } from "@/hooks/silo/useSiloActionValidation";
import { useSiloDepositableTokenFilters, useSiloTargetTokenFilters } from "@/hooks/silo/useSiloTokenFilters";
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
import useTokenData from "@/state/useTokenData";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function DepositForm({ siloToken, onSuccess, onPreviewChange }: SiloActionFormProps) {
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const invalidateSun = useInvalidateSun();
  const { queryKeys: priceQueryKeys } = usePriceData();
  const account = useAccount();
  const queryClient = useQueryClient();
  const siloData = useSiloData();
  const tokenData = useTokenData();

  // Token filtering - use the new hook for depositable tokens only
  const { filterSet: inputTokenFilter, filterPreferred } = useSiloDepositableTokenFilters();
  const { filterSet: outputTokenFilter, filterArray: outputTokenArray } = useSiloTargetTokenFilters();

  // Get default output token when no siloToken is provided
  const defaultOutputToken = useMemo(() => {
    if (siloToken) return siloToken;

    // When no siloToken is provided, default to the first available LP token or main token
    const availableTokens = Array.from(outputTokenFilter);
    const firstLPToken = availableTokens.find((token) => token.isLP);
    return firstLPToken || tokenData.mainToken;
  }, [siloToken, outputTokenFilter, tokenData.mainToken]);

  // Preferred input token (excluding the silo token itself to avoid same-token deposits by default)
  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
    filter: filterPreferred,
    token: siloToken,
  });

  // Form state management
  const {
    state,
    actions,
    computed: { amountInTV, exceedsBalance, hasValidAmount },
  } = useSiloActionForm(preferredToken, defaultOutputToken);

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [didSetDefaultOutput, setDidSetDefaultOutput] = useState(false);

  // Debounced input amount for output calculations
  const [debouncedAmountInTV, setDebouncedAmountInTV] = useState(amountInTV);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Set preferred token once loaded
  useEffect(() => {
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      actions.setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred, actions]);

  // Set default output token when no siloToken is provided
  useEffect(() => {
    if (!siloToken && defaultOutputToken && !didSetDefaultOutput) {
      actions.setTokenOut(defaultOutputToken);
      setDidSetDefaultOutput(true);
    }
  }, [siloToken, defaultOutputToken, didSetDefaultOutput, actions]);

  // Debounce the amount input for output calculations
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set debouncing state immediately when input changes
    if (!debouncedAmountInTV.eq(amountInTV)) {
      setIsDebouncing(true);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedAmountInTV(amountInTV);
      setIsDebouncing(false); // Clear debouncing state when done
    }, 300);

    // Cleanup on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [amountInTV, debouncedAmountInTV]);

  // Determine if we need to swap
  const shouldSwap = state.tokenIn && state.tokenOut ? !tokensEqual(state.tokenIn, state.tokenOut) : false;

  // Swap integration - use debounced amount for output calculations
  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn: state.tokenIn,
    tokenOut: state.tokenOut,
    slippage: state.slippage,
    amountIn: debouncedAmountInTV,
    disabled: !shouldSwap || !state.tokenIn || !state.tokenOut || debouncedAmountInTV.lte(0),
  });

  // Deposit output calculations - moved above previewData to fix initialization order
  const depositOutput = useMemo(() => {
    if (!state.tokenOut || debouncedAmountInTV.lte(0)) return undefined;

    const sData = siloData.tokenData.get(state.tokenOut);
    if (!sData) return undefined;

    if (state.tokenIn && tokensEqual(state.tokenOut, state.tokenIn)) {
      return {
        amount: debouncedAmountInTV,
        stalkGain: debouncedAmountInTV.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: debouncedAmountInTV.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    } else if (swapData?.buyAmount.gt(0)) {
      return {
        amount: swapData.buyAmount,
        stalkGain: swapData.buyAmount.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: swapData.buyAmount.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    }

    return undefined;
  }, [siloData, swapData, state.tokenOut, state.tokenIn, debouncedAmountInTV]);

  // Memoize preview calculation to prevent excessive re-renders
  const previewData = useMemo(() => {
    if (!depositOutput || !state.tokenOut) {
      return { token: undefined, bdvGain: undefined };
    }

    const sData = siloData.tokenData.get(state.tokenOut);
    if (!sData) {
      return { token: undefined, bdvGain: undefined };
    }

    // Simple BDV calculation: amount × tokenBDV
    const bdvGain = depositOutput.amount.mul(sData.tokenBDV);

    return { token: state.tokenOut, bdvGain };
  }, [depositOutput, state.tokenOut, siloData]);

  // Update preview only when calculated data changes - use refs to prevent infinite loops
  const prevPreviewRef = useRef<{ token?: Token; bdvGain?: TokenValue }>({});

  useEffect(() => {
    // Only call onPreviewChange if the preview data actually changed
    const { token: prevToken, bdvGain: prevBDVGain } = prevPreviewRef.current;
    const tokenChanged = prevToken?.symbol !== previewData.token?.symbol;
    const bdvChanged =
      !prevBDVGain?.eq(previewData.bdvGain || TokenValue.ZERO) ||
      (prevBDVGain === undefined) !== (previewData.bdvGain === undefined);

    if ((tokenChanged || bdvChanged) && onPreviewChange) {
      onPreviewChange(previewData.token, previewData.bdvGain);
      prevPreviewRef.current = { token: previewData.token, bdvGain: previewData.bdvGain };
    }
  }, [previewData.token, previewData.bdvGain, onPreviewChange]);

  const value = state.tokenIn?.isNative ? amountInTV : undefined;
  const swapBuild = useBuildSwapQuote(swapData, state.balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, state.tokenIn, value);
  const priceImpactSummary = state.tokenOut ? priceImpactQuery?.get(state.tokenOut) : undefined;

  // Slippage and routing warnings
  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Deposit",
  });

  // Validation
  const swapDataNotReady = (shouldSwap && (!swapData || !swapBuild)) || !!swapQuery.error;
  const { disabled, buttonText } = useSiloActionValidation({
    tokenIn: state.tokenIn,
    tokenOut: state.tokenOut,
    hasValidAmount,
    exceedsBalance,
    inputError: state.inputError,
    submitting: false,
    isConfirming: false,
    swapDataNotReady,
  });

  // Transaction handling
  const onTransactionSuccess = useCallback(() => {
    actions.resetForm();
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
    resetSwap();
    priceImpactQuery.clear();
    onSuccess?.();
  }, [
    actions,
    farmerSilo.queryKeys,
    farmerBalances.queryKeys,
    priceQueryKeys,
    invalidateSun,
    queryClient,
    resetSwap,
    priceImpactQuery,
    onSuccess,
  ]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Deposit successful",
    errorMessage: "Deposit failed",
    successCallback: onTransactionSuccess,
  });

  // Submit handler
  const onSubmit = useCallback(async () => {
    try {
      if (!account.address || !state.tokenIn || !state.tokenOut) {
        throw new Error("Missing required data");
      }

      const buyAmount = shouldSwap ? swapData?.buyAmount : amountInTV;
      if (!buyAmount) throw new Error("No amount to deposit");

      setSubmitting(true);
      toast.loading("Depositing...");

      if (!shouldSwap) {
        // Direct deposit without swap
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: depositABI,
          functionName: "deposit",
          args: [state.tokenOut.address, buyAmount.toBigInt(), Number(state.balanceFrom)],
        });
      }

      // Deposit with swap
      if (!swapData || !swapBuild?.advFarm?.getSteps().length) {
        throw new Error("No swap quote available");
      }

      const value = state.tokenIn.isNative ? amountInTV : undefined;
      const advFarm = [...swapBuild.advFarm.getSteps()];
      const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(state.tokenOut, 1, account.address, {
        value: value ?? TokenValue.ZERO,
      });

      const depositCallStruct = deposit(state.tokenOut, buyAmount, FarmFromMode.INTERNAL, clipboard);
      advFarm.push(depositCallStruct);

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [advFarm],
        value: value?.toBigInt(),
      });
    } catch (e: unknown) {
      console.error("Deposit failed:", e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Deposit failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    account.address,
    state,
    shouldSwap,
    swapData,
    amountInTV,
    diamondAddress,
    writeWithEstimateGas,
    setSubmitting,
    swapBuild,
  ]);

  const depositingSiloToken = state.tokenIn && state.tokenOut ? tokensEqual(state.tokenOut, state.tokenIn) : false;
  const isWellUnderlying = state.tokenOut?.tokens?.some((tk) => state.tokenIn && stringEq(tk, state.tokenIn.address));

  return (
    <div className="flex flex-col gap-6">
      {/* Input Token Selection */}
      <div>
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="pinto-body text-pinto-dark">Amount to deposit</div>
          <SlippageButton slippage={state.slippage} setSlippage={actions.setSlippage} />
        </div>
        <ComboInputField
          amount={state.amountIn}
          setAmount={actions.setAmountIn}
          setToken={actions.setTokenIn}
          setBalanceFrom={actions.setBalanceFrom}
          selectedToken={state.tokenIn}
          balanceFrom={state.balanceFrom}
          tokenSelectLoading={!didSetPreferred || preferredLoading}
          filterTokens={inputTokenFilter}
          disableClamping={true}
          setError={actions.setInputError}
          error={state.inputError}
          connectedAccount={!!account.address}
        />

        {/* Amount Slider */}
        {state.tokenIn && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-pinto-gray-4">Amount</span>
              <div className="flex gap-2">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => {
                      const balance = farmerBalances.balances.get(state.tokenIn as Token)?.total;
                      if (balance) {
                        const amount = balance.mul(percentage / 100);
                        actions.setAmountIn(amount.toHuman());
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-200 ease-in-out"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={(() => {
                  const balance = farmerBalances.balances.get(state.tokenIn as Token)?.total;
                  if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                  return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                })()}
                onChange={(e) => {
                  const balance = farmerBalances.balances.get(state.tokenIn as Token)?.total;
                  if (balance) {
                    const percentage = Number(e.target.value) / 100;
                    const amount = balance.mul(percentage);
                    actions.setAmountIn(amount.toHuman());
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #387f5c 0%, #387f5c ${(() => {
                    const balance = farmerBalances.balances.get(state.tokenIn as Token)?.total;
                    if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                    return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                  })()}%, #e5e5e5 ${(() => {
                    const balance = farmerBalances.balances.get(state.tokenIn as Token)?.total;
                    if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                    return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                  })()}%, #e5e5e5 100%)`,
                }}
              />
              {/* Circle markers at 25%, 50%, 75% */}
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </div>
            <div className="flex justify-between text-xs text-pinto-gray-4 mt-1">
              <span>0</span>
              <span>
                Max: {farmerBalances.balances.get(state.tokenIn as Token)?.total.toHuman() || "0"}{" "}
                {state.tokenIn?.symbol}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Output Token Selection - Deposit Into */}
      <div>
        <div className="pinto-body text-pinto-dark mb-2">Deposit into</div>
        <ComboInputField
          amount={depositOutput?.amount.toHuman() || ""}
          setAmount={() => {}} // Read-only
          setToken={actions.setTokenOut}
          selectedToken={state.tokenOut}
          isLoading={swapQuery.isLoading || isDebouncing}
          disableInput
          hideMax
          filterTokens={outputTokenFilter}
          selectKey="silo-target"
        />
      </div>

      {/* Loading or Output Display */}
      {(!depositOutput && debouncedAmountInTV.gt(0)) || swapQuery.isLoading ? (
        <div
          className={cn(
            "flex flex-col w-full items-center justify-center",
            depositingSiloToken ? "h-[181px]" : "h-[222.5px]",
          )}
        >
          <FrameAnimator size={64} />
        </div>
      ) : depositOutput ? (
        <div className="mt-6">
          <SiloOutputDisplay
            amount={depositOutput.amount}
            token={state.tokenOut}
            stalk={depositOutput.stalkGain}
            seeds={depositOutput.seedGain}
          />
        </div>
      ) : null}

      {/* Routing and Slippage Info */}
      {!depositingSiloToken && amountInTV.gt(0) && state.tokenIn && state.tokenOut && (
        <RoutingAndSlippageInfo
          title="Total Deposit Slippage"
          swapSummary={swapSummary}
          priceImpactSummary={priceImpactSummary}
          preferredSummary={isWellUnderlying ? "priceImpact" : "swap"}
          txnType="Deposit"
          tokenIn={state.tokenIn}
          tokenOut={state.tokenOut}
        />
      )}

      {slippageWarning}

      {/* Submit Buttons */}
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={state.tokenIn}
          disabled={disabled || !canProceed || submitting || isConfirming}
          amount={state.amountIn}
          balanceFrom={state.balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
        />
      </div>

      <MobileActionBar>
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={state.tokenIn}
          disabled={disabled || !canProceed || submitting || isConfirming}
          amount={state.amountIn}
          balanceFrom={state.balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          className="h-full"
        />
      </MobileActionBar>
    </div>
  );
}

// ABI definitions
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
