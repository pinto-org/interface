import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import FrameAnimator from "@/components/LoadingSpinner";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Separator } from "@/components/ui/Separator";
import { PODS } from "@/constants/internalTokens";
import fillPodListing from "@/encoders/fillPodListing";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useMaxBuy from "@/hooks/swap/useMaxBuy";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import usePodListings from "@/state/market/usePodListings";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringToNumber } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { getBalanceFromMode } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount } from "wagmi";
import CancelListing from "./CancelListing";

const useFilterTokens = () => {
  const tokens = useTokenMap();

  return useMemo(() => {
    const set = new Set<Token>();

    [...Object.values(tokens)].forEach((token) => {
      if (token.isLP || token.isSiloWrapped || token.is3PSiloWrapped) {
        set.add(token);
      }
    });
    return set;
  }, [tokens]);
};

export default function FillListing() {
  const mainToken = useTokenData().mainToken;
  const diamondAddress = useProtocolAddress();
  const account = useAccount();
  const farmerBalances = useFarmerBalances();
  const harvestableIndex = useHarvestableIndex();
  const navigate = useNavigate();

  const filterTokens = useFilterTokens();

  const queryClient = useQueryClient();
  const { allPodListings, allMarket, farmerMarket, farmerField } = useQueryKeys({
    account: account.address,
    harvestableIndex,
  });
  const { queryKey: farmerPlotsQK } = useFarmerPlotsQuery();
  const allQK = useMemo(
    () => [allPodListings, allMarket, farmerMarket, farmerField, farmerPlotsQK, ...farmerBalances.queryKeys],
    [allPodListings, allMarket, farmerMarket, farmerField, farmerPlotsQK, farmerBalances],
  );

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const podListings = usePodListings();
  const { id } = useParams();
  const allListings = podListings.data;
  const listing = allListings?.podListings.find((listing) => listing.index === id);

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  const isUsingMain = tokensEqual(tokenIn, mainToken);

  const { data: swapData, resetSwap } = useSwap({
    tokenIn,
    tokenOut: mainToken,
    slippage,
    amountIn: TokenValue.fromHuman(amountIn, tokenIn.decimals),
    disabled: isUsingMain,
  });

  const value = tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals) : undefined;

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(mainToken);

  const { slippageWarning, canProceed: ackSlippage } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Swap",
  });

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  // reset form and invalidate pod listings/farmer plot queries
  const onSuccess = useCallback(() => {
    navigate(`/market/pods/buy/fill`);
    setAmountIn("0");
    resetSwap();
    allQK.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, [navigate, resetSwap, queryClient, allQK]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Listing Fill successful",
    errorMessage: "Listing Fill failed",
    successCallback: onSuccess,
  });

  const placeInLine = TokenValue.fromBlockchain(listing?.index || 0n, PODS.decimals).sub(harvestableIndex);
  const podsAvailable = TokenValue.fromBlockchain(listing?.amount || 0n, PODS.decimals);
  const pricePerPod = TokenValue.fromBlockchain(listing?.pricePerPod || 0n, mainToken.decimals);
  const mainTokensToFill = podsAvailable.mul(pricePerPod);
  const mainTokensIn = isUsingMain ? TokenValue.fromHuman(amountIn, mainToken.decimals) : swapData?.buyAmount;

  const tokenInBalance = farmerBalances.balances.get(tokenIn);
  const maxFillAmount = useMaxBuy(tokenIn, slippage, mainTokensToFill);
  const balanceFromMode = getBalanceFromMode(tokenInBalance, balanceFrom);
  const balanceExceedsMax = balanceFromMode.gt(0) && maxFillAmount && balanceFromMode.gte(maxFillAmount);

  const onSubmit = useCallback(() => {
    if (!listing) {
      throw new Error("Listing not found");
    }
    if (!account.address) {
      throw new Error("Signer required");
    }
    try {
      setSubmitting(true);
      toast.loading("Filling Listing...");
      if (isUsingMain) {
        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "fillPodListing",
          args: [
            {
              lister: listing.farmer.id as Address, // account
              fieldId: 0n, // fieldId
              index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
              start: TokenValue.fromBlockchain(listing.start, PODS.decimals).toBigInt(), // start
              podAmount: TokenValue.fromBlockchain(listing.amount, PODS.decimals).toBigInt(), // amount
              pricePerPod: Number(TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals)), // pricePerPod
              maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals).toBigInt(), // maxHarvestableIndex
              minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals).toBigInt(), // minFillAmount, measured in Beans
              mode: Number(listing.mode), // mode
            },
            TokenValue.fromHuman(amountIn, mainToken.decimals).toBigInt(), // amountIn
            Number(balanceFrom), // fromMode
          ],
        });
      } else if (swapBuild) {
        const fillClipboard = swapBuild.getPipeCallClipboardSlot(9, mainToken);

        const advFarm = [...swapBuild.advancedFarm];
        advFarm.push(
          fillPodListing(
            listing.farmer.id as Address, // account
            TokenValue.fromBlockchain(listing.index, PODS.decimals), // index
            TokenValue.fromBlockchain(listing.start, PODS.decimals), // start
            TokenValue.fromBlockchain(listing.amount, PODS.decimals), // amount
            Number(TokenValue.fromBlockchain(listing.pricePerPod, mainToken.decimals)), // pricePerPod
            TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals), // maxHarvestableIndex
            TokenValue.fromBlockchain(listing.minFillAmount, mainToken.decimals), // minFillAmount, measured in Beans
            Number(listing.mode), // mode
            TV.ZERO, // amountIn (from clipboard)
            FarmFromMode.INTERNAL, // fromMode
            fillClipboard,
          ),
        );

        return writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "advancedFarm",
          args: [advFarm],
          value: (value ?? TV.ZERO).toBigInt(),
        });
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Listing Fill Failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    listing,
    account,
    amountIn,
    balanceFrom,
    swapBuild,
    writeWithEstimateGas,
    setSubmitting,
    isUsingMain,
    value,
    diamondAddress,
    mainToken,
  ]);

  const isOwnListing = listing && listing?.farmer.id === account.address?.toLowerCase();
  const disabled = !mainTokensIn || mainTokensIn.eq(0);

  return (
    <div>
      {!listing ? (
        <div className="flex justify-center mt-4 pinto-sm-light text-pinto-gray-5">
          Select a Listing on the panel to the left
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <div className="flex flex-row justify-between">
                <p className="pinto-body text-pinto-light">Seller</p>
                <p className="pinto-body text-pinto-primary">{listing.farmer.id.substring(0, 6)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="pinto-body text-pinto-light">Place in Line</p>
                <p className="pinto-body text-pinto-primary">{placeInLine.toHuman("short")}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="pinto-body text-pinto-light">Pods Available</p>
                <div className="flex items-center">
                  <img src={podIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pod icon"} />
                  <p className="pinto-body text-pinto-primary">{podsAvailable.toHuman("short")}</p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <p className="pinto-body text-pinto-light">Price per Pod</p>
                <div className="flex items-center">
                  <img src={pintoIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pinto icon"} />
                  <p className="pinto-body text-pinto-primary">{pricePerPod.toHuman()}</p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <p className="pinto-body text-pinto-light">Pinto to Fill</p>
                <div className="flex items-center">
                  <img src={pintoIcon} className="w-4 h-4 scale-110 mr-[6px]" alt={"pinto icon"} />
                  <p className="pinto-body text-pinto-primary">{mainTokensToFill.toHuman()}</p>
                </div>
              </div>
            </div>
            <Separator />
            {isOwnListing ? (
              <CancelListing listing={listing} />
            ) : (
              <>
                <div className="-mt-2">
                  <div className="flex flex-row justify-between items-center">
                    <p className="pinto-body text-pinto-light">Fill Using</p>
                    <SlippageButton slippage={slippage} setSlippage={setSlippage} />
                  </div>
                  <ComboInputField
                    amount={amountIn}
                    disableInput={isConfirming || submitting}
                    setAmount={setAmountIn}
                    setToken={setTokenIn}
                    setBalanceFrom={setBalanceFrom}
                    selectedToken={tokenIn}
                    balanceFrom={balanceFrom}
                    customMaxAmount={
                      maxFillAmount?.gt(0) ? TokenValue.min(balanceFromMode, maxFillAmount) : TokenValue.ZERO
                    }
                    filterTokens={filterTokens}
                    altText={balanceExceedsMax ? "Usable balance:" : undefined}
                  />
                  {!isUsingMain && stringToNumber(amountIn) > 0 && (
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
                  {disabled && Number(amountIn) > 0 && (
                    <div className="flex justify-center">
                      <FrameAnimator className="-mt-5 -mb-10" size={150} />
                    </div>
                  )}
                  {!disabled && (
                    <ActionSummary pricePerPod={pricePerPod} plotPosition={placeInLine} beanAmount={mainTokensIn} />
                  )}
                  <SmartSubmitButton
                    variant="gradient"
                    size="xxl"
                    submitButtonText="Buy Pods"
                    token={tokenIn}
                    amount={amountIn}
                    balanceFrom={balanceFrom}
                    submitFunction={onSubmit}
                    disabled={disabled || !ackSlippage || submitting || isConfirming}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const ActionSummary = ({
  pricePerPod,
  plotPosition,
  beanAmount,
}: { pricePerPod: TV; plotPosition: TV; beanAmount: TV }) => {
  const podAmount = beanAmount.div(pricePerPod);
  return (
    <div className="flex flex-col gap-4">
      <p className="pinto-body text-pinto-light">In exchange for {formatter.noDec(beanAmount)} Pinto, I will receive</p>
      <div className="flex flex-col gap-2">
        <p className="pinto-h3 flex flex-row items-center gap-2 -mt-1">
          <img src={podIcon} className="w-8 h-8" alt={"order summary pinto"} />
          {formatter.number(podAmount, { minDecimals: 0, maxDecimals: 2 })} Pods
        </p>
        <p className="pinto-body text-pinto-light">@ {plotPosition.toHuman("short")} in Line</p>
      </div>
    </div>
  );
};
