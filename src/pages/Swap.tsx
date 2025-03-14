import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { UpDownArrowsIcon, UpRightArrowIcon } from "@/components/Icons";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useIsWSOL, useTokenMap, useWSOL } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useTransaction from "@/hooks/useTransaction";
import { useDestinationBalance } from "@/state/useDestinationBalance";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function Swap() {
  const queryClient = useQueryClient();
  const { queryKeys } = useFarmerBalances();
  const { mainToken: BEAN, nativeToken: ETH, siloWrappedToken } = useTokenData();
  const diamond = useProtocolAddress();

  const isWSOL = useIsWSOL();
  const wsol = useWSOL();
  const account = useAccount();
  const tokenMap = useTokenMap();

  const filter = useMemo(() => [wsol], [wsol]);
  const { preferredToken } = usePreferredInputToken({ filterLP: true, filter });

  const initToken = isWSOL(preferredToken) ? ETH : preferredToken;

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(initToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [inputError, setInputError] = useState(false);
  const [amountOut, setAmountOut] = useState("0");
  const [tokenOut, setTokenOut] = useState(BEAN);
  const [slippage, setSlippage] = useState(0.1);
  const { balanceTo, setBalanceTo } = useDestinationBalance();

  const filterTokens = useMemo(() => {
    const s = new Set(Object.values(tokenMap).filter((t) => t.isLP));
    s.add(siloWrappedToken);
    return s;
  }, [tokenMap, siloWrappedToken]);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut,
    slippage,
    amountIn: TokenValue.fromHuman(amountIn, tokenIn.decimals),
  });

  // const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals) : undefined;
  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, balanceTo);
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
    if (stringToNumber(amountIn) <= 0) {
      setAmountOut("0");
    }
  }, [amountIn]);

  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successCallback: () => {
      setAmountIn("0");
      setAmountOut("0");
      queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
      resetSwap();
    },
    successMessage: "Swap success",
    errorMessage: "Swap failed",
    token: tokenIn,
  });

  const invertTokens = useCallback(() => {
    const newTokenIn = tokenMap[getTokenIndex(tokenOut)];
    const newAmountIn = amountIn.toString();
    setAmountOut("0");
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
      setTokenIn(newTokenIn);
    },
    [tokenOut, invertTokens],
  );

  const handleSelectTokenOut = useCallback(
    (newTokenOut: Token) => {
      // if new token out is the same as current in, swap positions.
      if (tokensEqual(newTokenOut, tokenIn)) {
        invertTokens();
        return;
      }
      setTokenOut(newTokenOut);
    },
    [tokenIn, invertTokens],
  );

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    toast.loading("Swapping...");
    try {
      if (!account.address) throw new Error("Signer required");
      if (!swapData || !swapBuild) throw new Error("No swap data");
      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapBuild.advancedFarm],
        value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
      });
    } catch (e) {
      console.error("Error submitting swap: ", e);
      toast.dismiss();
      toast.error("Swap failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [swapData, swapBuild, amountIn, tokenIn, account.address, diamond, writeWithEstimateGas, setSubmitting]);

  const swapNotReady = !swapData || !swapBuild || !!swapQuery.error;

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
                filterTokens={filterTokens}
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
            <RoutingAndSlippageInfo
              title="Total Swap Slippage"
              swapSummary={swapSummary}
              priceImpactSummary={undefined}
              preferredSummary="swap"
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              txnType="Swap"
            />
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
