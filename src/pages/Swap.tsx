import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { UpDownArrowsIcon } from "@/components/Icons";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { NATIVE_TOKEN, WSOL_TOKEN } from "@/constants/tokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap, useWSOL } from "@/hooks/pinto/useTokenMap";
import { useBuildSwapQuoteAsync } from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import { useDestinationBalance } from "@/state/useDestinationBalance";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { getChainConstant } from "@/utils/chain";
import { stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const handleOnError = (e: any) => {
  if (e instanceof Error || "message" in e || "shortMessage" in e) {
    const msg = e.shortMessage || e.message;
    if (!msg.toLowerCase().includes("user rejected the request")) {
      toast.error("Swap failed. Try increasing slippage.");
      return true;
    }
  }

  return false;
};

const getInitTokenIn = ({ preferredToken, loading }: ReturnType<typeof usePreferredInputToken>) => {
  const chainId = preferredToken.chainId;

  const ETH = getChainConstant(chainId, NATIVE_TOKEN);
  const WSOL = getChainConstant(chainId, WSOL_TOKEN);

  // prevent main token from being selected as input since default output token is BEAN.
  // prevent WSOL from being selected as default input.
  if (loading || preferredToken.isMain || tokensEqual(preferredToken, WSOL)) {
    return ETH;
  }

  return preferredToken;
};

export default function Swap() {
  const queryClient = useQueryClient();
  const { queryKeys } = useFarmerBalances();
  const { mainToken: BEAN } = useTokenData();
  const diamond = useProtocolAddress();

  const wsol = useWSOL();
  const account = useAccount();
  const tokenMap = useTokenMap();

  const filter = useMemo(() => [wsol], [wsol]);
  const preferredInput = usePreferredInputToken({ filterLP: true, filter });

  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(getInitTokenIn(preferredInput));
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [inputError, setInputError] = useState(false);
  const [amountOut, setAmountOut] = useState("");
  const [tokenOut, setTokenOut] = useState(BEAN);
  const [slippage, setSlippage] = useState(0.1);
  const { balanceTo, setBalanceTo } = useDestinationBalance();

  const filterTokens = useMemo(() => {
    const s = new Set(
      Object.values(tokenMap).filter((t) => {
        return t.isLP || t.isSiloWrapped || t.is3PSiloWrapped;
      }),
    );
    return s;
  }, [tokenMap]);

  const filterTokensForBuy = useMemo(() => {
    const buyFilter = new Set(filterTokens);
    Object.values(tokenMap).forEach((t) => {
      if (t.symbol.includes("WSOL")) {
        buyFilter.add(t);
      }
    });
    return buyFilter;
  }, [filterTokens, tokenMap]);

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut,
    slippage,
    amountIn: amountInTV,
  });

  // const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals) : undefined;
  const buildSwap = useBuildSwapQuoteAsync(swapData, balanceFrom, balanceTo, account.address, account.address);
  const swapSummary = useSwapSummary(swapData);
  // const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  // const priceImpactSummary = priceImpactQuery?.get(tokenOut);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: undefined,
    txnType: "Swap",
  });

  const destinationIsEth = tokenOut.isNative;

  const tokensSame = tokensEqual(tokenIn, tokenOut);

  useEffect(() => {
    if (swapData?.buyAmount?.gt(0)) {
      setAmountOut(swapData.buyAmount.toHuman());
    }
  }, [swapData?.buyAmount]);

  // reset the amountout if the amountin is 0
  useEffect(() => {
    if (amountInTV.lte(0)) {
      setAmountOut("");
    }
  }, [amountInTV]);

  const onSuccess = useCallback(() => {
    setAmountIn("");
    setAmountOut("");
    queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    resetSwap();
  }, [queryClient, queryKeys, resetSwap]);

  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successCallback: onSuccess,
    onError: handleOnError,
    successMessage: "Swap success",
    errorMessage: "Swap failed",
    token: tokenIn,
  });

  const invertTokens = useCallback(() => {
    // Track token pair flip event
    trackSimpleEvent(ANALYTICS_EVENTS.SWAP.TOKEN_PAIR_FLIP, {
      sell_token_before: tokenIn.symbol,
      buy_token_before: tokenOut.symbol,
      sell_token_after: tokenOut.symbol,
      buy_token_after: tokenIn.symbol,
    });

    const newTokenIn = tokenMap[getTokenIndex(tokenOut)];
    const newAmountIn = amountIn.toString();
    setAmountOut("");
    setTokenOut(tokenIn);
    setAmountIn(newAmountIn);
    setTokenIn(newTokenIn);
  }, [tokenIn, tokenOut, tokenMap, amountIn]);

  const handleSelectTokenIn = useCallback(
    (newTokenIn: Token) => {
      // if new token in is the same as current out, swap positions.
      if (tokensEqual(newTokenIn, tokenOut)) {
        invertTokens();
        return;
      }
      // Track token selection event
      trackSimpleEvent(ANALYTICS_EVENTS.SWAP.TOKEN_FROM_SELECTED, {
        previous_token: tokenIn.symbol,
        new_token: newTokenIn.symbol,
      });
      setTokenIn(newTokenIn);
    },
    [tokenOut, invertTokens, tokenIn.symbol],
  );

  const handleSelectTokenOut = useCallback(
    (newTokenOut: Token) => {
      // if new token out is the same as current in, swap positions.
      if (tokensEqual(newTokenOut, tokenIn)) {
        invertTokens();
        return;
      }
      // Track token selection event
      trackSimpleEvent(ANALYTICS_EVENTS.SWAP.TOKEN_TO_SELECTED, {
        previous_token: tokenOut.symbol,
        new_token: newTokenOut.symbol,
      });
      setTokenOut(newTokenOut);
    },
    [tokenIn, invertTokens, tokenOut.symbol],
  );

  const onSubmit = useCallback(async () => {
    // Track swap submission event
    trackSimpleEvent(ANALYTICS_EVENTS.SWAP.SWAP_SUBMIT, {
      sell_token: tokenIn.symbol,
      buy_token: tokenOut.symbol,
    });

    setSubmitting(true);
    toast.loading("Swapping...");
    try {
      if (!account.address) throw new Error("Signer required");
      if (!swapData) throw new Error("No swap data");

      const swapBuild = await buildSwap();

      if (!swapBuild) throw new Error("No swap build");

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapBuild.advancedFarm],
        value: tokenIn.isNative ? amountInTV.toBigInt() : 0n,
      });
    } catch (e: any) {
      console.error("Error submitting swap: ", e);
      toast.dismiss();
      toast.error("Swap failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    swapData,
    amountInTV,
    tokenIn,
    tokenOut,
    account.address,
    diamond,
    writeWithEstimateGas,
    setSubmitting,
    buildSwap,
  ]);

  const swapNotReady = !swapData || !!swapQuery.error;

  const disabled =
    submitting ||
    isConfirming ||
    !stringToNumber(amountIn) ||
    !account.address ||
    tokensSame ||
    swapNotReady ||
    inputError;

  return (
    <PageContainer variant="xlAltSwap">
      <div className="flex flex-col w-full mt-4 sm:mt-0">
        <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-3">
              <div className="pinto-h2 sm:pinto-h1">Swap</div>
              <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                Buy and sell Pinto-native assets.
              </div>
            </div>
            {/*
            <div className="hidden md:block flex flex-row items-center">
              <Button
                asChild
                variant={"outline"}
                className="rounded-[0.75rem] text-[1rem] text-black font-[500] -tracking-[0.02em] inline-flex gap-2"
              >
                <Link to="/market/pods">
                  Buy and sell Pods
                  <UpRightArrowIcon color={"currentColor"} />
                </Link>
              </Button>
            </div>
            */}
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <div className="pinto-sm sm:pinto-body text-pinto-light sm:text-pinto-light">Sell</div>
                <SlippageButton slippage={slippage} setSlippage={setSlippage} />
              </div>
              <ComboInputField
                amount={amountIn}
                setAmount={setAmountIn}
                setToken={handleSelectTokenIn}
                setBalanceFrom={setBalanceFrom}
                selectedToken={tokenIn}
                balanceFrom={balanceFrom}
                disableClamping={true}
                setError={setInputError}
                error={inputError}
                connectedAccount={!!account.address}
                filterTokens={filterTokens}
                selectKey="sell"
              />
            </div>
            <div className="flex flex-row justify-center">
              <Button
                onClick={invertTokens}
                variant={"outline"}
                className="rounded-full h-10 w-10 !p-0 self-center hover:cursor-pointer"
              >
                <UpDownArrowsIcon className="w-8 h-8" />
              </Button>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="pinto-sm sm:pinto-body text-pinto-light sm:text-pinto-light">Buy</div>
              <ComboInputField
                amount={amountOut}
                setAmount={setAmountOut}
                setToken={handleSelectTokenOut}
                selectedToken={tokenOut}
                isLoading={swapQuery.isLoading || false}
                disableInput
                hideMax
                filterTokens={filterTokensForBuy}
                selectKey="buy"
              />
            </div>
            <div>
              {!destinationIsEth ? (
                <div className="flex flex-col gap-y-2">
                  <Label className="content-center">Send output to:</Label>
                  <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
                </div>
              ) : null}
            </div>
            {swapData && !swapQuery.isLoading ? (
              <RoutingAndSlippageInfo
                title="Total Swap Slippage"
                swapSummary={swapSummary}
                priceImpactSummary={undefined}
                preferredSummary="swap"
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                txnType="Swap"
              />
            ) : null}
            {slippageWarning}
            <div className="mt-2 hidden sm:flex">
              <SmartSubmitButton
                token={tokenIn}
                balanceFrom={balanceFrom}
                amount={amountIn}
                disabled={disabled || !canProceed}
                submitFunction={onSubmit}
                submitButtonText={inputError ? "Insufficient Funds" : "Swap"}
                className="h-[5.25rem]"
                variant="gradient"
              />
            </div>
            <MobileActionBar>
              <SmartSubmitButton
                token={tokenIn}
                balanceFrom={balanceFrom}
                amount={amountIn}
                disabled={disabled || !canProceed}
                submitFunction={onSubmit}
                submitButtonText={inputError ? "Insufficient Funds" : "Swap"}
                className="h-full"
                variant="gradient"
              />
            </MobileActionBar>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
