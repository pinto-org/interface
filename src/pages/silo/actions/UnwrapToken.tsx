import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo from "@/components/RoutingAndSlippageInfo";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import TextSkeleton from "@/components/TextSkeleton";
import TokenSelectBase from "@/components/TokenSelectBase";
import { Label } from "@/components/ui/Label";
import { Switch, SwitchThumb } from "@/components/ui/Switch";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useBuildSwapQuoteAsync } from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import useTransaction from "@/hooks/useTransaction";
import { FarmerBalance, useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { pickCratesAsCrates, sortCratesByStem } from "@/utils/convert";
import { tryExtractErrorMessage } from "@/utils/error";
import { formatter } from "@/utils/format";
import { isValidAddress, stringToStringNum } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { getBalanceFromMode, noop } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";

const balancesToShow = [FarmFromMode.INTERNAL, FarmFromMode.EXTERNAL];

export default function UnwrapToken({ siloToken }: { siloToken: Token }) {
  // State
  const farmerBalances = useFarmerBalances();
  const { queryKeys: farmerDepositsQueryKeys } = useFarmerSilo();
  const contractBalances = useFarmerSilo(siloToken.isSiloWrapped ? siloToken.address : undefined);
  const { address: account, isConnecting } = useAccount();
  const { mainToken } = useTokenData();
  const qc = useQueryClient();
  const filterTokens = useFilterOutTokens(siloToken);
  const tokenOptions = useUnwrapTokenOptions();

  const farmerBalance = farmerBalances.balances.get(siloToken);

  // Local State
  const [slippage, setSlippage] = useState<number>(0.1);
  const [amountIn, setAmountIn] = useState<string>("0");
  const [balanceSource, setBalanceSource] = useState<FarmFromMode>(FarmFromMode.EXTERNAL);

  const [toSilo, setToSilo] = useState<boolean>(true);
  const [didInitBalanceSource, setDidInitBalanceSource] = useState<boolean>(!!farmerBalances.isFetched);
  const [inputError, setInputError] = useState<boolean>(false);
  const [tokenOut, setTokenOut] = useState<Token>(mainToken);
  const [toMode, setToMode] = useState<FarmToMode>(FarmToMode.INTERNAL);

  // Derived
  const balance = getBalanceFromMode(farmerBalance, balanceSource) ?? TV.ZERO;
  const amountTV = TV.fromHuman(stringToStringNum(amountIn), siloToken.decimals);
  const validAmountIn = amountTV.gt(0);
  const quoteDisabled = !siloToken.isSiloWrapped || !toSilo;

  // Queries & Hooks
  const { data: quote, ...quoteQuery } = useUnwrapTokenQuoteQuery(amountTV, siloToken, mainToken, quoteDisabled);
  const output = useUnwrapQuoteOutputSummary(contractBalances.deposits, mainToken, quote);
  const swap = useSwap({
    tokenIn: siloToken,
    tokenOut,
    slippage,
    amountIn: amountTV,
    disabled: toSilo, // disable quote if we are unwrapping to silo deposit
  });
  const swapSummary = useSwapSummary(swap.data);
  const buildSwapQuote = useBuildSwapQuoteAsync(swap.data, balanceSource, toMode, account, account);

  // Transaction
  const onSuccess = useCallback(() => {
    setAmountIn("0");
    const keys = [...contractBalances.queryKeys, ...farmerBalances.queryKeys, ...farmerDepositsQueryKeys];
    keys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
  }, [contractBalances, farmerBalances, farmerDepositsQueryKeys]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Unwrap successful",
    errorMessage: "Unwrap failed",
    successCallback: onSuccess,
  });

  const onSubmit = useCallback(() => {
    try {
      // validations
      if (!isValidAddress(account)) throw new Error("Signer required");
      if (amountTV.lte(0)) throw new Error("Invalid amount");
      if (balance.lt(amountTV)) throw new Error("Insufficient balance");

      // transaction
      setSubmitting(true);
      toast.loading(`Unwrapping ${siloToken.symbol}...`);

      return writeWithEstimateGas({
        address: siloToken.address,
        abi: siloedPintoABI,
        functionName: "redeemToSilo",
        args: [amountTV.toBigInt(), account, account, balanceSource],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      const message = tryExtractErrorMessage(e, "Failed to unwrap token.");
      toast.error(message);
      throw e instanceof Error ? e : new Error(message);
    } finally {
      setSubmitting(false);
    }
  }, [account, amountTV, balance, balanceSource, siloToken, setSubmitting]);

  // Effects
  useEffect(() => {
    if (didInitBalanceSource || !farmerBalance || farmerBalances.isLoading || isConnecting) {
      return;
    }

    setBalanceSource(getPreferredBalanceSource(farmerBalance));
    setDidInitBalanceSource(true);
  }, [didInitBalanceSource, farmerBalances.isLoading, farmerBalance, isConnecting]);

  // Display State
  const buttonText = amountTV.gt(balance) ? "Insufficient Balance" : "Unwrap";
  const inputAltText = `${getInputAltTextWithSource(balanceSource)} Balance:`;

  const baseDisabled = !account || !validAmountIn || !balance.gte(amountTV) || inputError;
  const buttonDisabled =
    baseDisabled || isConfirming || submitting || output?.amount.lte(0) || inputError || quoteQuery.isLoading;

  const sourceIsInternal = balanceSource === FarmFromMode.INTERNAL;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <Label variant="section" expanded>
            Amount to Unwrap
          </Label>
          {!toSilo && <SlippageButton slippage={slippage} setSlippage={setSlippage} />}
        </div>
        <ComboInputField
          amount={amountIn}
          selectedToken={siloToken}
          customMaxAmount={balance}
          balanceFrom={balanceSource}
          error={inputError}
          setToken={noop}
          setAmount={setAmountIn}
          setError={setInputError}
          setBalanceFrom={setBalanceSource}
          altText={inputAltText}
          altTextMobile="Balance:"
          balancesToShow={balancesToShow}
          filterTokens={filterTokens}
          isLoading={!didInitBalanceSource}
        />
        <div className="flex flex-row w-full justify-between items-center mt-4">
          <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">
            Unwrap as {mainToken.symbol} deposit
          </div>
          <Switch
            checked={toSilo}
            onCheckedChange={() => setToSilo((prev) => !prev)}
          >
            <SwitchThumb />
          </Switch>
        </div>
      </div>
      {toSilo && output?.amount.gt(0) && validAmountIn ? (
        <SiloOutputDisplay token={mainToken} amount={output.amount} stalk={output.stalk.total} seeds={output.seeds} />
      ) : null}
      {!toSilo ? (
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label className="flex h-10 items-center">Destination</Label>
              <DestinationBalanceSelect setBalanceTo={setToMode} balanceTo={toMode} />
            </div>
            <div className="flex flex-col w-full pt-4 pb-2 gap-2">
              <div className="pinto-body-light text-pinto-light">Unwrap as</div>
              <div className="flex flex-col w-full gap-1">
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <TextSkeleton height="h3" loading={swap.isLoading} className="w-20">
                      <div className="pinto-h3">{formatter.token(swap.data?.buyAmount, tokenOut)}</div>
                    </TextSkeleton>
                  </div>
                  <TokenSelectBase tokens={tokenOptions} selected={tokenOut} selectToken={setTokenOut} />
                </div>
                <TextSkeleton height="sm" className="w-20" loading={swap.isLoading}>
                  <div className="pinto-sm-light text-pinto-light">{formatter.usd(swap.data?.usdOut)}</div>
                </TextSkeleton>
              </div>
            </div>
          </div>
          {swap.isLoading ? (
            <div className="flex flex-row items-center justify-center h-[5.5rem]">
              <FrameAnimator size={64} />
            </div>
          ) : swap.data ? (
            <RoutingAndSlippageInfo
              title="Total Unwrap Slippage"
              swapSummary={swapSummary}
              priceImpactSummary={undefined}
              preferredSummary="swap"
              tokenIn={siloToken}
              tokenOut={tokenOut}
              txnType="Swap"
            />
          ) : null}
        </div>
      ) : null}
      <div className="flex-row hidden sm:flex">
        <SmartSubmitButton
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          variant="gradient"
          disabled={buttonDisabled}
          amount={amountIn}
          token={siloToken}
          balanceFrom={balanceSource}
          spender={siloToken.address}
          requiresDiamondAllowance={sourceIsInternal}
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          className="h-full"
          variant="gradient"
          amount={amountIn}
          disabled={buttonDisabled}
          token={siloToken}
          balanceFrom={balanceSource}
          spender={siloToken.address}
          requiresDiamondAllowance={sourceIsInternal}
        />
      </MobileActionBar>
    </div>
  );
}

// -----------------------------------------------------------------------
// =======================================================================

// ================================ HOOKS ================================

const useUnwrapTokenOptions = () => {
  const tokenMap = useTokenMap();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const tokens = Object.values(tokenMap);
    const filtered = tokens.filter((t) => !t.isSiloWrapped && !t.isLP && !t.is3PSiloWrapped);

    setTokens(filtered);
  }, [tokenMap]);

  return tokens;
}

function useUnwrapTokenQuoteQuery(amount: TV, tokenIn: Token, tokenOut: Token, disabled: boolean = false) {
  return useReadContract({
    address: tokenIn.address,
    abi: siloedPintoABI,
    functionName: "previewRedeem",
    args: [amount.toBigInt()],
    query: {
      enabled: amount.gt(0) && !disabled,
      select: (data: bigint) => {
        const res = TV.fromBigInt(data, tokenOut.decimals);
        return res;
      },
    },
  });
}

function useUnwrapQuoteOutputSummary(
  data: ReturnType<typeof useFarmerSilo>["deposits"],
  token: Token,
  quote: TV | undefined,
) {
  // sort by latest deposit first
  const sortedDeposits = useMemo(() => {
    const depositsData = data.get(token);
    return sortCratesByStem(depositsData?.deposits ?? [], "desc");
  }, [data, token]);

  return useMemo(() => {
    if (!quote || quote.lte(0)) return undefined;
    return pickCratesAsCrates(sortedDeposits, quote);
  }, [quote, sortedDeposits]);
}

function useFilterOutTokens(token: Token) {
  const tokenMap = useTokenMap();

  return useMemo(() => {
    const set = new Set<Token>();
    Object.values(tokenMap).forEach((t) => {
      if (!tokensEqual(t, token)) {
        set.add(t);
      }
    });
    return set;
  }, [tokenMap, token]);
}

function getPreferredBalanceSource(balance: FarmerBalance | undefined) {
  if (!balance || balance.total.eq(0)) return FarmFromMode.EXTERNAL;
  return balance.external.gt(balance.internal) ? FarmFromMode.EXTERNAL : FarmFromMode.INTERNAL;
}

// ================================ UTILS ================================

function getInputAltTextWithSource(source: FarmFromMode) {
  switch (source) {
    case FarmFromMode.EXTERNAL:
      return "Wallet";
    case FarmFromMode.INTERNAL:
      return "Farm";
    default:
      return "Combined";
  }
}
