import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import { SiloActionFormProps } from "@/components/SiloActionDialog";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import encoders from "@/encoders";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useSiloActionValidation } from "@/hooks/silo/useSiloActionValidation";
import { useSiloWithdrawTokenFilters } from "@/hooks/silo/useSiloTokenFilters";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useConfig } from "wagmi";

const getInitialWithdrawToken = (siloToken?: Token, tokenMap: any = {}) => {
  if (!siloToken) return null;

  if (siloToken.isLP && siloToken.tokens?.length) {
    const pairToken = siloToken.tokens.find((t) => !tokenMap[getTokenIndex(t)]?.isMain);
    if (pairToken) {
      return tokenMap[getTokenIndex(pairToken)] || null;
    }
  }

  return siloToken;
};

export default function WithdrawForm({ siloToken, onSuccess, onPreviewChange }: SiloActionFormProps) {
  const config = useConfig();
  const chainId = useChainId();
  const diamondAddress = useProtocolAddress();
  const account = useAccount();
  const farmerSilo = useFarmerSilo();
  const farmerBalances = useFarmerBalances();
  const siloData = useSiloData();
  const invalidateSun = useInvalidateSun();
  const { queryKeys: priceQueryKeys } = usePriceData();
  const queryClient = useQueryClient();
  const tokenData = useTokenData();
  const tokenMap = useTokenMap();
  const priceData = usePriceData();

  // Token filtering for withdrawal targets
  const { filterSet: outputTokenFilter, filterArray: outputTokenArray } = useSiloWithdrawTokenFilters(
    siloToken as Token,
  );

  // Get default output token (what to withdraw as)
  const defaultOutputToken = useMemo(() => {
    return getInitialWithdrawToken(siloToken, tokenMap);
  }, [siloToken, tokenMap]);

  // Form state - adapted for withdraw
  const [amount, setAmount] = useState("");
  const [tokenOut, setTokenOut] = useState<Token | null>(defaultOutputToken);
  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const [inputError, setInputError] = useState(false);

  const amountTV = useSafeTokenValue(amount, siloToken);

  // Set default output token when siloToken changes
  useEffect(() => {
    if (siloToken && defaultOutputToken) {
      setTokenOut(defaultOutputToken);
    }
  }, [siloToken, defaultOutputToken]);

  // Get farmer's deposits for this silo token
  const farmerDepositData = siloToken ? farmerSilo.deposits.get(siloToken) : undefined;
  const deposits = farmerDepositData?.deposits;
  const hasBalance = farmerDepositData?.amount.gt(0);
  const exceedsBalance = farmerDepositData?.amount.lt(amountTV);

  // Determine if we need to swap
  const shouldSwap = siloToken && tokenOut ? !tokensEqual(siloToken, tokenOut) : false;

  // Swap integration
  const swapDisabled = amountTV.lte(0) || !account.address || !shouldSwap || inputError;
  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn: siloToken as Token,
    tokenOut: tokenOut as Token,
    amountIn: amountTV,
    slippage,
    disabled: swapDisabled,
  });

  const swapBuild = useBuildSwapQuote(swapData, FarmFromMode.INTERNAL, destination);
  const swapSummary = useSwapSummary(swapData);

  // Create withdraw farm workflow
  const withdrawFarm = useMemo(() => {
    if (!shouldSwap || !swapBuild?.advFarm?.length || inputError || exceedsBalance) return undefined;
    if (!deposits || amountTV.lte(0) || !siloToken) return undefined;

    const transferData = sortAndPickCrates("withdraw", amountTV, deposits);
    const stems = transferData.crates.map((crate) => crate.stem);
    const amounts = transferData.crates.map((crate) => crate.amount);

    const advFarm = new AdvancedFarmWorkflow(chainId, config, "silo-withdraw");
    advFarm.add(encoders.silo.withdraw(siloToken, stems, amounts, FarmToMode.INTERNAL));

    swapBuild.advFarm.getSteps().forEach((node) => {
      advFarm.add(node);
    });

    return advFarm;
  }, [shouldSwap, amountTV, siloToken, deposits, chainId, config, swapBuild, exceedsBalance, inputError]);

  const priceImpactQuery = usePriceImpactSummary(withdrawFarm, undefined, undefined, swapDisabled);
  const priceImpactSummary = siloToken ? priceImpactQuery?.get(siloToken) : undefined;

  // Slippage and routing warnings
  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Withdraw",
  });

  // Calculate withdraw output
  const withdrawOutput = useMemo(() => {
    if (!amount || stringToNumber(amount) <= 0 || !deposits || inputError || exceedsBalance || !siloToken) {
      return undefined;
    }

    if (shouldSwap && !swapData?.buyAmount?.gt(0)) {
      return undefined;
    }

    const siloTokenToRemove = TokenValue.fromHuman(amount, siloToken.decimals);
    const amountAsTV = shouldSwap ? swapData?.buyAmount : amountTV;

    if (!amountAsTV) return undefined;

    const transferData = sortAndPickCrates("withdraw", siloTokenToRemove, deposits);

    return {
      amount: amountAsTV,
      stalkLost: transferData.stalk,
      seedsLost: transferData.seeds,
      bdvLost: transferData.bdv,
    };
  }, [amount, deposits, siloToken, shouldSwap, swapData, inputError, exceedsBalance, amountTV]);

  // Calculate seasons of grown stalk being withdrawn
  const seasonsOfGrownStalkWithdrawn = useMemo(() => {
    const averageGrownStalkPerBdvPerSeason = siloData.averageGrownStalkPerBdvPerSeason;

    const grownStalkLost = withdrawOutput ? withdrawOutput.stalkLost.sub(withdrawOutput.bdvLost) : TokenValue.ZERO;
    const expectedGrownStalkPerSeason =
      withdrawOutput && grownStalkLost.gt(0)
        ? withdrawOutput.bdvLost.mul(averageGrownStalkPerBdvPerSeason)
        : TokenValue.ZERO;

    const seasonsOfGrownStalkWithdrawn = expectedGrownStalkPerSeason.gt(0)
      ? Math.ceil(grownStalkLost.div(expectedGrownStalkPerSeason).toNumber())
      : 0;

    return seasonsOfGrownStalkWithdrawn;
  }, [withdrawOutput, siloData.averageGrownStalkPerBdvPerSeason]);

  // Preview calculation for chart integration
  const previewData = useMemo(() => {
    if (!withdrawOutput || !siloToken) {
      return { token: undefined, bdvGain: undefined };
    }

    // For withdrawals, we show negative BDV impact on the SILO token being withdrawn from
    // (not the output token), since that's what appears in the chart
    return { token: siloToken, bdvGain: withdrawOutput.bdvLost.mul(-1) };
  }, [withdrawOutput, siloToken]);

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
  const hasValidAmount = !!stringToNumber(amount);
  const { disabled, buttonText } = useSiloActionValidation({
    tokenIn: siloToken,
    tokenOut,
    hasValidAmount,
    exceedsBalance,
    inputError,
    submitting: false,
    isConfirming: false,
    swapDataNotReady: shouldSwap && (!swapData || !swapBuild),
  });

  // Transaction handling
  const onTransactionSuccess = useCallback(() => {
    setAmount("");
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
    resetSwap();
    priceImpactQuery.clear();
    onSuccess?.();
  }, [
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
    successMessage: "Withdraw successful",
    errorMessage: "Withdraw failed",
    successCallback: onTransactionSuccess,
  });

  // Submit handler
  const onSubmit = useCallback(async () => {
    if (amountTV.lte(0) || !destination || !account.address || !deposits || inputError || !siloToken) return;

    try {
      setSubmitting(true);
      toast.loading("Withdrawing...");

      const transferData = sortAndPickCrates("withdraw", amountTV, deposits);
      const stems = transferData.crates.map((crate) => crate.stem);
      const amounts = transferData.crates.map((crate) => crate.amount);

      if (!stems.length || !amounts.length) throw new Error("No crates to withdraw");

      if (!shouldSwap) {
        // Direct withdraw without swap
        if (transferData.crates.length === 1) {
          return writeWithEstimateGas({
            address: diamondAddress,
            abi: withdrawABI,
            functionName: "withdrawDeposit",
            args: [siloToken.address, stems[0].toBigInt(), amounts[0].toBigInt(), Number(destination)],
          });
        }
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: withdrawABI,
          functionName: "withdrawDeposits",
          args: [
            siloToken.address,
            stems.map((s) => s.toBigInt()),
            amounts.map((a) => a.toBigInt()),
            Number(destination),
          ],
        });
      }

      // Withdraw with swap
      if (!swapData || !swapBuild || !withdrawFarm) throw new Error("No swap data");

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [withdrawFarm.getSteps()],
      });
    } catch (e: unknown) {
      console.error("Withdraw failed:", e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Withdraw failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    amountTV,
    destination,
    account.address,
    deposits,
    inputError,
    siloToken,
    shouldSwap,
    diamondAddress,
    writeWithEstimateGas,
    setSubmitting,
    swapData,
    swapBuild,
    withdrawFarm,
  ]);

  // Create token and balance map for ComboInputField
  const tokenAndBalanceMap = useMemo(() => {
    const map = new Map<Token, TokenValue>();
    if (siloToken && farmerDepositData) {
      map.set(siloToken, farmerDepositData.amount);
    }
    return map;
  }, [siloToken, farmerDepositData]);

  const tokenOutUSD = tokenOut ? priceData.tokenPrices.get(tokenOut) : undefined;
  const amountOutUSD = tokenOutUSD && withdrawOutput ? withdrawOutput.amount.mul(tokenOutUSD.instant) : undefined;

  if (!siloToken) {
    return (
      <div className="flex flex-col gap-6 p-6 text-center">
        <div className="text-lg font-medium text-pinto-gray-5">Please select a token to withdraw</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Input Token Selection */}
      <div>
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="pinto-body text-pinto-dark">Amount to withdraw</div>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amount}
          setAmount={setAmount}
          setToken={() => {}} // Read-only token selection for silo token
          selectedToken={siloToken}
          tokenAndBalanceMap={tokenAndBalanceMap}
          disableButton
          error={inputError}
          setError={setInputError}
          disableInput={isConfirming || !hasBalance}
        />

        {/* Amount Slider */}
        {farmerDepositData && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-pinto-gray-4">Amount</span>
              <div className="flex gap-2">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => {
                      const balance = farmerDepositData.amount;
                      if (balance) {
                        const amount = balance.mul(percentage / 100);
                        setAmount(amount.toHuman());
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
                  const balance = farmerDepositData.amount;
                  if (!balance || balance.lte(0) || amountTV.lte(0)) return 0;
                  return Math.min(100, amountTV.div(balance).toNumber() * 100);
                })()}
                onChange={(e) => {
                  const balance = farmerDepositData.amount;
                  if (balance) {
                    const percentage = Number(e.target.value) / 100;
                    const amount = balance.mul(percentage);
                    setAmount(amount.toHuman());
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #387f5c 0%, #387f5c ${(() => {
                    const balance = farmerDepositData.amount;
                    if (!balance || balance.lte(0) || amountTV.lte(0)) return 0;
                    return Math.min(100, amountTV.div(balance).toNumber() * 100);
                  })()}%, #e5e5e5 ${(() => {
                    const balance = farmerDepositData.amount;
                    if (!balance || balance.lte(0) || amountTV.lte(0)) return 0;
                    return Math.min(100, amountTV.div(balance).toNumber() * 100);
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
                Max: {farmerDepositData.amount.toHuman()} {siloToken.symbol}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Token Output Selection - Withdraw As */}
      <div>
        <div className="pinto-body text-pinto-dark mb-2">Withdraw as</div>
        <ComboInputField
          amount={withdrawOutput?.amount.toHuman() || ""}
          setAmount={() => {}} // Read-only
          setToken={setTokenOut}
          selectedToken={tokenOut}
          isLoading={swapQuery.isLoading}
          disableInput
          hideMax
          filterTokens={outputTokenFilter}
          selectKey="withdraw-target"
        />
        {withdrawOutput && tokenOut && (
          <div className="mt-1">
            <div className="pinto-sm-light text-pinto-light">{formatter.usd(amountOutUSD)}</div>
          </div>
        )}
      </div>

      {/* Destination Selection */}
      <div className="flex flex-col">
        <Label className="flex h-10 items-center">Destination</Label>
        <DestinationBalanceSelect setBalanceTo={setDestination} balanceTo={destination} />
      </div>

      {/* Loading or Output Display */}
      {(!withdrawOutput && amountTV.gt(0)) || swapQuery.isLoading ? (
        <div className="flex flex-col w-full items-center justify-center h-[181px]">
          <FrameAnimator size={64} />
        </div>
      ) : withdrawOutput ? (
        <div className="mt-6">
          <SiloOutputDisplay
            amount={withdrawOutput.amount}
            token={tokenOut as Token}
            stalk={withdrawOutput.stalkLost}
            seeds={withdrawOutput.seedsLost}
            showNegativeDeltas
            showGrownStalkSeasonsNotice
            grownStalkSeasons={seasonsOfGrownStalkWithdrawn}
          />
        </div>
      ) : null}

      {/* Routing and Slippage Info */}
      {shouldSwap && withdrawOutput && (
        <RoutingAndSlippageInfo
          title="Total Withdraw Slippage"
          swapSummary={swapSummary}
          priceImpactSummary={priceImpactSummary}
          preferredSummary="priceImpact"
          txnType="Withdraw"
          tokenIn={siloToken}
          tokenOut={tokenOut as Token}
          wellToken={siloToken}
        />
      )}

      {slippageWarning}

      {/* Submit Buttons */}
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={siloToken}
          disabled={disabled || !canProceed || submitting || isConfirming}
          amount={amount}
          balanceFrom={FarmFromMode.INTERNAL} // Withdrawing from silo
          submitFunction={onSubmit}
          submitButtonText={exceedsBalance ? "Insufficient Balance" : buttonText.replace("Submit", "Withdraw")}
        />
      </div>

      <MobileActionBar>
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={siloToken}
          disabled={disabled || !canProceed || submitting || isConfirming}
          amount={amount}
          balanceFrom={FarmFromMode.INTERNAL}
          submitFunction={onSubmit}
          submitButtonText={exceedsBalance ? "Insufficient Balance" : buttonText.replace("Submit", "Withdraw")}
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

const withdrawABI = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "int96", name: "stem", type: "int96" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "enum LibTransfer.To", name: "mode", type: "uint8" },
    ],
    name: "withdrawDeposit",
    outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "int96[]", name: "stems", type: "int96[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "enum LibTransfer.To", name: "mode", type: "uint8" },
    ],
    name: "withdrawDeposits",
    outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
