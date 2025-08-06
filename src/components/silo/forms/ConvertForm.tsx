import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import { SiloActionFormProps } from "@/components/SiloActionDialog";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { useSiloActionForm } from "@/hooks/silo/useSiloActionForm";
import { useSiloActionValidation } from "@/hooks/silo/useSiloActionValidation";
import useSiloConvert, { useSiloConvertQuote, useSiloMaxConvertQuery } from "@/hooks/silo/useSiloConvert";
import { useSiloConvertResult } from "@/hooks/silo/useSiloConvertResult";
import { useSiloDepositedTokenFilters, useSiloTargetTokenFilters } from "@/hooks/silo/useSiloTokenFilters";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { tokensEqual } from "@/utils/token";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function ConvertForm({ siloToken, onSuccess, onPreviewChange }: SiloActionFormProps) {
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const invalidateSun = useInvalidateSun();
  const { queryKeys: priceQueryKeys } = usePriceData();
  const account = useAccount();
  const queryClient = useQueryClient();
  const siloData = useSiloData();
  const tokenData = useTokenData();
  const siloConvert = useSiloConvert();

  // Token filtering - get deposited tokens for input, all silo tokens for output
  const { filterSet: inputTokenFilter } = useSiloDepositedTokenFilters();
  const { filterSet: outputTokenFilter, filterArray: outputTokenArray } = useSiloTargetTokenFilters();

  // Get default input token - prioritize siloToken if provided, otherwise first deposited token
  const defaultInputToken = useMemo(() => {
    if (siloToken && inputTokenFilter.has(siloToken)) return siloToken;

    // Find first token with deposits
    const tokensWithDeposits = Array.from(inputTokenFilter).filter((token) => {
      const deposits = farmerSilo.deposits.get(token);
      return deposits?.amount.gt(0);
    });

    return tokensWithDeposits[0] || tokenData.mainToken;
  }, [siloToken, inputTokenFilter, farmerSilo.deposits, tokenData.mainToken]);

  // Get default output token - different from input token
  const defaultOutputToken = useMemo(() => {
    const availableTokens = Array.from(outputTokenFilter);
    return availableTokens.find((token) => !tokensEqual(token, defaultInputToken)) || availableTokens[0];
  }, [outputTokenFilter, defaultInputToken]);

  // Form state management
  const {
    state,
    actions,
    computed: { amountInTV, hasValidAmount },
  } = useSiloActionForm(defaultInputToken, defaultOutputToken);

  const [didSetDefaults, setDidSetDefaults] = useState(false);

  // Set default tokens once
  useEffect(() => {
    if (!didSetDefaults && defaultInputToken && defaultOutputToken) {
      actions.setTokenIn(defaultInputToken);
      actions.setTokenOut(defaultOutputToken);
      setDidSetDefaults(true);
    }
  }, [defaultInputToken, defaultOutputToken, didSetDefaults, actions]);

  // Get farmer's deposits for the selected input token
  const farmerDepositData = state.tokenIn ? farmerSilo.deposits.get(state.tokenIn) : undefined;

  // Get maximum convertible amount
  const maxConvertQuery = useSiloMaxConvertQuery(
    siloConvert,
    farmerDepositData,
    state.tokenIn as Token,
    state.tokenOut as Token,
    !!(state.tokenIn && state.tokenOut && farmerDepositData),
  );
  const maxConvertAmount = maxConvertQuery.data?.max;

  // Override exceedsBalance to use max convertible amount instead of total deposit amount
  const exceedsBalance = useMemo(() => {
    if (!state.tokenIn || !farmerDepositData || !maxConvertAmount) return true;
    return maxConvertAmount.lt(amountInTV);
  }, [state.tokenIn, farmerDepositData, maxConvertAmount, amountInTV]);
  const deposits = farmerDepositData?.deposits;
  const hasBalance = farmerDepositData?.amount.gt(0);

  // Create token and balance map for input token selection using convertible amounts
  const tokenAndBalanceMap = useMemo(() => {
    const map = new Map<Token, TokenValue>();

    // For the selected input token, use max convertible amount if available
    if (state.tokenIn && maxConvertAmount) {
      map.set(state.tokenIn, maxConvertAmount);
    }

    // For other tokens, use their deposit amounts as fallback for display
    for (const [token, depositData] of farmerSilo.deposits.entries()) {
      if (
        depositData.amount.gt(0) &&
        (!state.tokenIn || token.address.toLowerCase() !== state.tokenIn.address.toLowerCase())
      ) {
        map.set(token, depositData.amount);
      }
    }

    return map;
  }, [farmerSilo.deposits, state.tokenIn, maxConvertAmount]);

  // Convert quote integration
  const quoteEnabled = Boolean(
    account.address && state.tokenIn && state.tokenOut && hasValidAmount && !exceedsBalance && deposits,
  );

  const { data: quote, isLoading: quoteLoading } = useSiloConvertQuote(
    siloConvert,
    state.tokenIn as Token,
    state.tokenOut as Token,
    state.amountIn,
    deposits,
    state.slippage,
    quoteEnabled,
  );

  const { results: convertResults } = useSiloConvertResult(state.tokenIn as Token, state.tokenOut as Token, quote);
  const convertResult = convertResults?.[0];

  // Calculate convert output
  const convertOutput = useMemo(() => {
    if (!convertResult || !state.tokenOut) return undefined;

    return {
      amount: convertResult.totalAmountOut,
      stalkGain: convertResult.deltaStalk,
      seedGain: convertResult.deltaSeed,
    };
  }, [convertResult, state.tokenOut]);

  // Preview calculation for chart integration
  const previewData = useMemo(() => {
    if (!convertOutput || !state.tokenOut) {
      return { token: undefined, bdvGain: undefined };
    }

    const sData = siloData.tokenData.get(state.tokenOut);
    if (!sData) {
      return { token: undefined, bdvGain: undefined };
    }

    // Calculate BDV gain: amount × tokenBDV
    const bdvGain = convertOutput.amount.mul(sData.tokenBDV);

    return { token: state.tokenOut, bdvGain };
  }, [convertOutput, state.tokenOut, siloData]);

  // Update preview for chart
  const prevPreviewRef = useRef<{ token?: Token; bdvGain?: TokenValue }>({});
  useEffect(() => {
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

  // Validation
  const { disabled, buttonText } = useSiloActionValidation({
    tokenIn: state.tokenIn,
    tokenOut: state.tokenOut,
    hasValidAmount,
    exceedsBalance,
    inputError: state.inputError,
    submitting: false,
    isConfirming: false,
    swapDataNotReady: quoteLoading || !convertResult,
  });

  // Transaction handling
  const onTransactionSuccess = useCallback(() => {
    actions.resetForm();
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
    onSuccess?.();
  }, [actions, farmerSilo.queryKeys, farmerBalances.queryKeys, priceQueryKeys, invalidateSun, queryClient, onSuccess]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Convert successful",
    errorMessage: "Convert failed",
    successCallback: onTransactionSuccess,
  });

  // Submit handler
  const onSubmit = useCallback(async () => {
    try {
      if (!account.address || !state.tokenIn || !state.tokenOut || !quote?.[0]) {
        throw new Error("Missing required data");
      }

      setSubmitting(true);
      toast.loading("Converting...");

      const bestQuote = quote[0];

      // Use the quote's workflow for the conversion
      const encodedAdvFarm = [...bestQuote.workflow.getSteps()];

      return writeWithEstimateGas({
        address: "0x1234567890123456789012345678901234567890", // Replace with actual diamond address
        abi: [], // Add proper ABI
        functionName: "advancedFarm",
        args: [encodedAdvFarm],
      });
    } catch (e: unknown) {
      console.error("Convert failed:", e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Convert failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [account.address, state, quote, writeWithEstimateGas, setSubmitting]);

  const sameToken = state.tokenIn && state.tokenOut ? tokensEqual(state.tokenIn, state.tokenOut) : false;

  return (
    <div className="flex flex-col gap-6">
      {/* Input Token Selection - Convert From */}
      <div>
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="pinto-body text-pinto-dark">Convert From</div>
          <SlippageButton slippage={state.slippage} setSlippage={actions.setSlippage} />
        </div>
        <ComboInputField
          amount={state.amountIn}
          setAmount={actions.setAmountIn}
          setToken={actions.setTokenIn}
          selectedToken={state.tokenIn}
          tokenAndBalanceMap={tokenAndBalanceMap}
          disableClamping={true}
          setError={actions.setInputError}
          error={state.inputError}
          connectedAccount={!!account.address}
          selectKey="convert-input"
        />

        {/* Amount Slider */}
        {state.tokenIn && farmerDepositData && maxConvertAmount && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-pinto-gray-4">Amount</span>
              <div className="flex gap-2">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => {
                      const balance = maxConvertAmount;
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
                  const balance = maxConvertAmount;
                  if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                  return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                })()}
                onChange={(e) => {
                  const balance = maxConvertAmount;
                  if (balance) {
                    const percentage = Number(e.target.value) / 100;
                    const amount = balance.mul(percentage);
                    actions.setAmountIn(amount.toHuman());
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #387f5c 0%, #387f5c ${(() => {
                    const balance = maxConvertAmount;
                    if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                    return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                  })()}%, #e5e5e5 ${(() => {
                    const balance = maxConvertAmount;
                    if (!balance || balance.lte(0) || amountInTV.lte(0)) return 0;
                    return Math.min(100, amountInTV.div(balance).toNumber() * 100);
                  })()}%, #e5e5e5 100%)`,
                }}
              />
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white border-2 border-pinto-gray-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </div>
            <div className="flex justify-between text-xs text-pinto-gray-4 mt-1">
              <span>0</span>
              <span>
                Max: {maxConvertAmount.toHuman()} {state.tokenIn?.symbol}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Output Token Selection - Convert To */}
      <div>
        <div className="pinto-body text-pinto-dark mb-2">Convert to</div>
        <ComboInputField
          amount={convertOutput?.amount.toHuman() || ""}
          setAmount={() => {}} // Read-only
          setToken={actions.setTokenOut}
          selectedToken={state.tokenOut}
          isLoading={quoteLoading}
          disableInput
          hideMax
          filterTokens={outputTokenFilter}
          selectKey="convert-output"
        />
      </div>

      {/* Warning for same token */}
      {sameToken && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">Please select different tokens to convert between.</div>
        </div>
      )}

      {/* Loading or Output Display */}
      {(!convertOutput && amountInTV.gt(0) && !sameToken) || quoteLoading ? (
        <div className="flex flex-col w-full items-center justify-center h-[181px]">
          <FrameAnimator size={64} />
        </div>
      ) : convertOutput && !sameToken ? (
        <div className="mt-6">
          <SiloOutputDisplay
            amount={convertOutput.amount}
            token={state.tokenOut}
            stalk={convertOutput.stalkGain}
            seeds={convertOutput.seedGain}
          />
        </div>
      ) : null}

      {/* Submit Buttons */}
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={state.tokenIn}
          disabled={disabled || sameToken || submitting || isConfirming}
          amount={state.amountIn}
          balanceFrom="internal" // Always internal for silo conversions
          submitFunction={onSubmit}
          submitButtonText={sameToken ? "Select Different Tokens" : buttonText.replace("Submit", "Convert")}
        />
      </div>

      <MobileActionBar>
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={state.tokenIn}
          disabled={disabled || sameToken || submitting || isConfirming}
          amount={state.amountIn}
          balanceFrom="internal"
          submitFunction={onSubmit}
          submitButtonText={sameToken ? "Select Different Tokens" : buttonText.replace("Submit", "Convert")}
          className="h-full"
        />
      </MobileActionBar>
    </div>
  );
}
