import { TV } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import TextSkeleton from "@/components/TextSkeleton";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import Warning from "@/components/ui/Warning";
import { diamondABI } from "@/constants/abi/diamondABI";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { MAIN_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useBuildSwapQuoteAsync } from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositAllowance from "@/state/useFarmerDepositAllowance";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloWrappedTokenToUSD } from "@/state/useSiloWrappedTokenData";
import { useChainConstant } from "@/utils/chain";
import { extractStemsAndAmountsFromCrates, sortAndPickCrates } from "@/utils/convert";
import { tryExtractErrorMessage } from "@/utils/error";
import { formatter } from "@/utils/format";
import { isValidAddress, stringToStringNum } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { exists, getBalanceFromMode } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";

type AssetOrigin = "deposits" | "balances";

export default function WrapToken({ siloToken }: { siloToken: Token }) {
  const farmerDeposits = useFarmerSilo();
  const contractSilo = useFarmerSilo(siloToken.address);
  const farmerBalances = useFarmerBalances();
  const { address: account, isConnecting } = useAccount();
  const qc = useQueryClient();
  const diamond = useProtocolAddress();

  const mainToken = useChainConstant(MAIN_TOKEN);
  const sMainToken = useChainConstant(S_MAIN_TOKEN);
  const deposits = farmerDeposits.deposits.get(mainToken);
  const depositedAmount = deposits?.amount;

  const [slippage, setSlippage] = useState<number>(0.1);
  const [amountIn, setAmountIn] = useState<string>("0");
  const [inputError, setInputError] = useState<boolean>(false);
  const [balanceFrom, setBalanceFrom] = useState<FarmFromMode>(FarmFromMode.INTERNAL_EXTERNAL);
  const [mode, setMode] = useState<FarmToMode | undefined>(undefined);
  const [token, setToken] = useState<Token>(mainToken);
  const [source, setSource] = useState<AssetOrigin>(depositedAmount ? "deposits" : "balances");
  const [didInitSource, setDidInitSource] = useState(isConnecting ? false : depositedAmount !== undefined);

  const filterTokens = useFilterTokens();

  // derived state
  const tokenIsSiloWrappedToken = tokensEqual(siloToken, sMainToken);
  const farmerTokenBalance = farmerBalances.balances.get(token);
  const balance = getBalanceFromMode(farmerTokenBalance, balanceFrom);
  const usingDeposits = source === "deposits";
  const amountInTV = TV.fromHuman(amountIn, mainToken.decimals);

  const amountExceedsDeposits = usingDeposits && amountInTV.gt(0) && amountInTV.gt(depositedAmount ?? 0n);
  const amountExceedsBalance = !usingDeposits && amountInTV.gt(0) && amountInTV.gt(balance ?? 0n);
  const exceedsBalance = usingDeposits ? amountExceedsBalance : amountExceedsDeposits;

  // Allowance. If wrapping deposits, we need to approve usage of silo deposits.
  const {
    allowance,
    setAllowance,
    queryKey: allowanceQueryKey,
    loading: allowanceLoading,
    confirming: allowanceConfirming,
  } = useFarmerDepositAllowance(Boolean(usingDeposits && tokenIsSiloWrappedToken));

  const needsDepositAllowanceIncrease = usingDeposits && !allowanceLoading && amountInTV.gt(allowance ?? 0n);

  // Swap / Quote
  const swap = useSwap({
    tokenIn: token,
    tokenOut: siloToken,
    slippage: slippage,
    amountIn: TV.fromHuman(stringToStringNum(amountIn), token.decimals),
    disabled: usingDeposits,
  });
  const swapSummary = useSwapSummary(swap.data);
  const buildSwap = useBuildSwapQuoteAsync(swap.data, balanceFrom, mode, account, account);
  const quote = usePreviewDeposit(amountInTV, usingDeposits);

  const amountOut = usingDeposits ? quote.data : swap.data?.buyAmount;
  const amountOutUSD = useSiloWrappedTokenToUSD(amountOut);

  // Transaction hooks
  const onSuccess = () => {
    setAmountIn("0");
    swap.resetSwap();
    const keys = [
      allowanceQueryKey,
      ...farmerDeposits.queryKeys,
      ...farmerBalances.queryKeys,
      ...contractSilo.queryKeys,
    ];
    keys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
  };

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Wrap successful",
    errorMessage: "Wrap failed",
    successCallback: onSuccess,
  });

  // Callbacks
  const handleWrap = useCallback(async () => {
    try {
      if (!isValidAddress(account)) {
        throw new Error("Signer required");
      }
      if (source === "deposits") {
        const amount = TV.fromHuman(amountIn, mainToken.decimals);
        if (!deposits || !deposits.deposits.length) {
          throw new Error("No deposits found");
        }
        if (exceedsBalance) {
          throw new Error("Insufficient deposits");
        }
        if (amount.lte(0)) {
          throw new Error("Invalid amount");
        }
        setSubmitting(true);
        const picked = sortAndPickCrates("wrap", amount, deposits.deposits);
        const extracted = extractStemsAndAmountsFromCrates(picked.crates);
        toast.loading("Wrapping...");

        return writeWithEstimateGas({
          address: siloToken.address,
          abi: siloedPintoABI,
          functionName: "depositFromSilo",
          args: [extracted.stems, extracted.amounts, account, Number(mode)],
        });
      }

      if (!swap.data || !buildSwap) {
        throw new Error("Invalid swap quote");
      }
      if (exceedsBalance) {
        throw new Error("Insufficient funds");
      }

      setSubmitting(true);
      const swapBuild = await buildSwap();
      if (!swapBuild) {
        throw new Error("Failed to build swap");
      }

      const value = token.isNative ? TV.fromHuman(amountIn, token.decimals) : undefined;

      return writeWithEstimateGas({
        address: diamond,
        abi: diamondABI,
        functionName: "advancedFarm",
        args: [swapBuild.advancedFarm],
        value: value?.toBigInt(),
      });
    } catch (e: any) {
      console.error(e);
      const errorMessage = tryExtractErrorMessage(e, "Failed to wrap token.");
      toast.error(errorMessage);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    amountIn,
    siloToken.decimals,
    deposits,
    mode,
    account,
    swap.data,
    inputError,
    buildSwap,
    writeWithEstimateGas,
    setSubmitting,
  ]);

  const handleButtonSubmit = useCallback(async () => {
    if (needsDepositAllowanceIncrease) {
      return setAllowance(amountInTV);
    }

    return handleWrap();
  }, [amountInTV, needsDepositAllowanceIncrease, setAllowance, handleWrap]);

  // Effects
  useEffect(() => {
    if (didInitSource || !farmerTokenBalance || !deposits || isConnecting) {
      return;
    }

    if (deposits?.amount.lte(0)) {
      setSource("balances");
    }

    setDidInitSource(true);
  }, [farmerTokenBalance, deposits, didInitSource, isConnecting]);

  // Tokens other than main token are not supported
  if (!tokenIsSiloWrappedToken) {
    return null;
  }

  // Derived booleans
  const confirming = allowanceConfirming || isConfirming || submitting;
  const isValidAmount = amountInTV.gt(0);
  const inputDisabled = usingDeposits ? !deposits?.amount : !balance;
  const quoting = usingDeposits ? quote.isLoading : swap.isLoading;
  const disabledFromLoading = confirming || quoting || submitting || isConfirming;
  const toModeSelected = exists(mode);
  const buttonDisabled =
    !account ||
    inputDisabled ||
    !isValidAmount ||
    exceedsBalance ||
    inputError ||
    disabledFromLoading ||
    !toModeSelected;

  const buttonText = exceedsBalance ? "Insufficient funds" : needsDepositAllowanceIncrease ? "Approve" : "Wrap";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <Label variant="section" expanded>
            {usingDeposits ? "Amount of Deposited Pinto to use" : "Amount and token to use"}
          </Label>
          {!usingDeposits && <SlippageButton slippage={slippage} setSlippage={setSlippage} />}
        </div>
        <ComboInputField
          amount={amountIn}
          isLoading={!didInitSource}
          setAmount={setAmountIn}
          setToken={setToken}
          filterTokens={filterTokens}
          setBalanceFrom={setBalanceFrom}
          balanceFrom={balanceFrom}
          tokenNameOverride={usingDeposits ? "Dep. PINTO" : undefined}
          error={inputError}
          setError={setInputError}
          selectedToken={usingDeposits ? mainToken : token}
          customMaxAmount={usingDeposits ? depositedAmount : balance}
          disabled={inputDisabled}
          disableButton={usingDeposits}
          disableInput={inputDisabled}
          altText={usingDeposits ? "Deposited Balance:" : undefined}
          altTextMobile={usingDeposits ? "Deposited:" : undefined}
          disableClamping={true}
          connectedAccount={!!account}
        />
        <div className="flex flex-row w-full justify-between items-center mt-4">
          <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">
            Use {mainToken.symbol} deposits
          </div>
          <TextSkeleton loading={!didInitSource} className="w-11 h-6">
            <Switch
              checked={source === "deposits"}
              onCheckedChange={() => {
                setAmountIn("0");
                setSource((prev) => (prev === "deposits" ? "balances" : "deposits"));
              }}
            />
          </TextSkeleton>
        </div>
      </div>

      <div className="flex flex-row w-full justify-between items-center">
        <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">I receive</div>
        <div className="flex flex-col gap-1 text-right">
          <TextSkeleton height="h3" className="w-52 self-end" loading={swap.isLoading}>
            <div className="pinto-h3 flex flex-row gap-2 items-center whitespace-nowrap self-end">
              <IconImage src={siloToken.logoURI} size={6} />
              <span>
                {formatter.token(amountOut ?? 0n, siloToken)} {siloToken.symbol}
              </span>
            </div>
          </TextSkeleton>
          <TextSkeleton height="sm" className="w-16 self-end" loading={swap.isLoading}>
            <div className="pinto-sm-light text-pinto-light">{formatter.usd(amountOutUSD.totalUSD)}</div>
          </TextSkeleton>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-10 pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">
          Receive {siloToken.symbol} to my
        </div>
        <DestinationBalanceSelect setBalanceTo={setMode} balanceTo={mode} />
      </div>
      {isValidAmount && !usingDeposits ? (
        <>
          {swap.isLoading ? (
            <div className="flex flex-row items-center justify-center h-[4.5rem]">
              <FrameAnimator size={64} />
            </div>
          ) : swapSummary && swap.data ? (
            <div>
              <RoutingAndSlippageInfo
                title="Total Wrap Slippage"
                swapSummary={swapSummary}
                priceImpactSummary={undefined}
                preferredSummary="swap"
                tokenIn={token}
                tokenOut={siloToken}
                txnType="Swap"
                noMarginTopOnTrigger={true}
              />
            </div>
          ) : null}
        </>
      ) : null}
      <Warning variant="info">
        <div className="pinto-sm-light text-pinto-light">
          Unwrapping sPinto in the future will result in receiving Stalk and Seed associated with the{" "}
          <span className="text-pinto-primary font-medium">most recently wrapped Pinto.</span>
        </div>
      </Warning>
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          submitFunction={handleButtonSubmit}
          disabled={buttonDisabled}
          submitButtonText={buttonText}
          spender={!usingDeposits ? siloToken.address : undefined}
          amount={!usingDeposits ? amountIn : undefined}
          token={!usingDeposits ? mainToken : token}
          balanceFrom={balanceFrom}
          variant="gradient"
          size="xxl"
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          submitFunction={handleButtonSubmit}
          disabled={buttonDisabled}
          submitButtonText={buttonText}
          spender={!usingDeposits ? siloToken.address : undefined}
          amount={!usingDeposits ? amountIn : undefined}
          token={!usingDeposits ? mainToken : token}
          balanceFrom={balanceFrom}
          variant="gradient"
          className="h-full"
          size="xxl"
        />
      </MobileActionBar>
    </div>
  );
}

// -------------------------------

const useFilterTokens = () => {
  const tokenMap = useTokenMap();

  const [filter, setFilter] = useState<Set<Token>>(new Set());

  useEffect(() => {
    const filteredSet = Object.values(tokenMap).reduce((prev, curr) => {
      if (curr.isSiloWrapped || curr.isLP || curr.is3PSiloWrapped) {
        prev.add(curr);
      }
      return prev;
    }, new Set<Token>());

    setFilter(filteredSet);
  }, [tokenMap]);

  return filter;
};

const usePreviewDeposit = (amountInTV: TV, enabled: boolean = true) => {
  const siloToken = useChainConstant(S_MAIN_TOKEN);
  const query = useReadContract({
    address: siloToken.address,
    abi: siloedPintoABI,
    functionName: "previewDeposit",
    args: [amountInTV.toBigInt()],
    query: {
      enabled: !!amountInTV.gt(0) && enabled,
      select: (data) => {
        return TV.fromBigInt(data, siloToken.decimals);
      },
    },
  });

  return useMemo(() => {
    return {
      data: query.data,
      isLoading: query.isLoading,
    };
  }, [query.data, query.isLoading]);
};
