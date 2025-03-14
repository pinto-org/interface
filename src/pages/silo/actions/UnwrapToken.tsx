import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import MobileActionBar from "@/components/MobileActionBar";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { FarmerBalance, useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { pickCratesAsCrates, sortCratesByStem } from "@/utils/convert";
import { isValidAddress, stringToStringNum } from "@/utils/string";
import { FarmFromMode, Token } from "@/utils/types";
import { getBalanceFromMode, noop } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Label } from "@/components/ui/Label";
import useTransaction from "@/hooks/useTransaction";
import { toast } from "sonner";
import { tryExtractErrorMessage } from "@/utils/error";
import { useQueryClient } from "@tanstack/react-query";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { tokensEqual } from "@/utils/token";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";

const balancesToShow = [FarmFromMode.INTERNAL, FarmFromMode.EXTERNAL];

export default function UnwrapToken({ siloToken }: { siloToken: Token }) {
  // State
  const farmerBalances = useFarmerBalances();
  const { queryKeys: farmerDepositsQueryKeys } = useFarmerSiloNew();
  const contractBalances = useFarmerSiloNew(siloToken.isSiloWrapped ? siloToken.address : undefined);
  const { address: account, isConnecting } = useAccount();
  const { mainToken } = useTokenData();
  const qc = useQueryClient();
  const filterTokens = useFilterOutTokens(siloToken);

  const farmerBalance = farmerBalances.balances.get(siloToken);

  // Local State
  const [amountIn, setAmountIn] = useState<string>("0");
  const [balanceSource, setBalanceSource] = useState<FarmFromMode>(
    farmerBalances.isFetched ? getPreferredBalanceSource(farmerBalance) : FarmFromMode.EXTERNAL
  );
  const [didInitBalanceSource, setDidInitBalanceSource] = useState<boolean>(farmerBalances.isFetched ? true : false);
  const [inputError, setInputError] = useState<boolean>(false);

  // Derived
  const balance = getBalanceFromMode(farmerBalance, balanceSource) ?? TV.ZERO;
  const amountTV = TV.fromHuman(stringToStringNum(amountIn), siloToken.decimals);
  const validAmountIn = amountTV.gt(0);
  const quoteDisabled = !siloToken.isSiloWrapped;

  // Queries & Hooks
  const { data: quote, ...quoteQuery } = useUnwrapTokenQuoteQuery(amountTV, siloToken, mainToken, quoteDisabled);
  const output = useUnwrapQuoteOutputSummary(contractBalances.deposits, mainToken, quote);

  // Transaction
  const onSuccess = useCallback(() => {
    setAmountIn("0");
    const keys = [
      ...contractBalances.queryKeys,
      ...farmerBalances.queryKeys,
      ...farmerDepositsQueryKeys,
    ];
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
        args: [amountTV.toBigInt(), account, account, balanceSource]
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
    if (didInitBalanceSource || !farmerBalance || farmerBalances.isLoading || isConnecting) return;

    const setAsExternal = farmerBalance.total.eq(0) || farmerBalance.external.gt(farmerBalance.internal);
    setBalanceSource(setAsExternal ? FarmFromMode.EXTERNAL : FarmFromMode.INTERNAL);
    setDidInitBalanceSource(true);
  }, [didInitBalanceSource, farmerBalances.isLoading, farmerBalance]);

  // Display State
  const buttonText = amountTV.gt(balance) ? "Insufficient Balance" : "Unwrap";
  const inputAltText = `${getInputAltTextWithSource(balanceSource)} Balance:`;

  const baseDisabled = !account || !validAmountIn || !balance.gte(amountTV) || inputError;
  const buttonDisabled = baseDisabled || isConfirming || submitting || output?.amount.lte(0) || inputError || quoteQuery.isLoading;

  const sourceIsInternal = balanceSource === FarmFromMode.INTERNAL;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Label variant="section" expanded>Amount to Unwrap</Label>
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
      </div>
      {output?.amount.gt(0) && validAmountIn ? (
        <SiloOutputDisplay
          token={mainToken}
          amount={output.amount}
          stalk={output.stalk.total}
          seeds={output.seeds}
        />
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
  )
}

// -----------------------------------------------------------------------
// =======================================================================

// ================================ HOOKS ================================

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
      }
    }
  });
}

function useUnwrapQuoteOutputSummary(
  data: ReturnType<typeof useFarmerSiloNew>['deposits'],
  token: Token,
  quote: TV | undefined,
) {
  // sort by latest deposit first
  const sortedDeposits = useMemo(() => {
    const depositsData = data.get(token);
    return sortCratesByStem(depositsData?.deposits ?? [], 'desc')
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
};

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
      return "Combined"
  }
}
