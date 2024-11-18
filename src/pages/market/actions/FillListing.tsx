import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Label } from "@/components/ui/Label";
import { PODS } from "@/constants/internalTokens";
import fillPodListing from "@/encoders/fillPodListing";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useHarvestableIndex } from "@/state/useFieldData";
import usePodListings from "@/state/usePodListings";
import useTokenData from "@/state/useTokenData";
import { stringEq, stringToNumber } from "@/utils/string";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Address, BaseError } from "viem";
import { useAccount, useChainId } from "wagmi";

export default function FillListing() {
  const BEAN = useTokenData().mainToken;
  const account = useAccount();
  const chainId = useChainId();

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
  });

  const queryClient = useQueryClient();
  const harvestableIndex = useHarvestableIndex();
  const podListings = usePodListings();
  const queryKey = podListings.queryKey;
  const { id } = useParams();
  const allListings = podListings.data;
  const listing = allListings?.podListings.find((listing) => listing.index === id);

  const mainToken = useTokenData().mainToken;

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey });
      setAmountIn("0");
    },
    successMessage: "Transaction complete!",
    errorMessage: "Transaction failed.",
  });

  const isUsingMain = tokenIn.address === mainToken.address;

  const swapData = useSwapEstimate(
    tokenIn,
    mainToken,
    Number(amountIn),
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    undefined,
    isUsingMain,
  );

  const isSwapping = !stringEq(tokenIn.address, mainToken.address);

  const mainTokensToFill = TokenValue.fromBlockchain(listing?.amount || 0n, PODS.decimals).mul(
    TokenValue.fromBlockchain(listing?.pricePerPod || 0n, BEAN.decimals),
  );

  function onSubmit() {
    try {
      setSubmitting(true);
      if (!listing) {
        throw new Error("Listing not found");
      }
      if (!account.address) {
        throw new Error("Signer required");
      }
      toast.loading("Filling Listing...");
      if (isUsingMain) {
        return writeWithEstimateGas({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "fillPodListing",
          args: [
            {
              lister: listing.farmer.id as Address, // account
              fieldId: 0n, // plotid
              index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
              start: TokenValue.fromBlockchain(0, PODS.decimals).toBigInt(), // start
              podAmount: TokenValue.fromBlockchain(listing.amount, PODS.decimals).toBigInt(), // amount
              pricePerPod: Number(TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals)), // pricePerPod
              maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals).toBigInt(), // maxHarvestableIndex
              minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, BEAN.decimals).toBigInt(), // minFillAmount, measured in Beans
              mode: Number(listing.mode), // mode
            },
            TokenValue.fromHuman(amountIn, BEAN.decimals).toBigInt(), // amountIn
            Number(balanceFrom), // fromMode
          ],
        });
      } else {
        const fillCallData = fillPodListing(
          listing.farmer.id as Address, // account
          TokenValue.fromBlockchain(listing.index, PODS.decimals), // index
          TokenValue.ZERO, // start
          TokenValue.fromBlockchain(listing.amount, PODS.decimals), // amount
          Number(TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals)), // pricePerPod
          TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals), // maxHarvestableIndex
          TokenValue.fromBlockchain(listing.minFillAmount, BEAN.decimals), // minFillAmount, measured in Beans
          Number(listing.mode), // mode
          swapData?.output, // amountIn
          FarmFromMode.INTERNAL,
        ) as AdvancedFarmCall;

        const swapCallData = swapData?.callData;
        if (swapCallData) {
          swapCallData.push(fillCallData);
          return writeWithEstimateGas({
            address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [swapCallData],
            value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
          });
        } else {
          throw new Error("Swap could not be estimated");
        }
      }
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error((e as BaseError).shortMessage || "Transaction failed.");
    }
  }

  return (
    <div>
      {!listing ? (
        <div>Listing not found.</div>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <Label>Seller</Label>
            <div>{listing.farmer.id.substring(0, 6)}</div>
          </div>
          <div className="flex flex-row justify-between">
            <Label>Place in Line</Label>
            <div>{TokenValue.fromBlockchain(listing.index, PODS.decimals).sub(harvestableIndex).toHuman("short")}</div>
          </div>
          <div className="flex flex-row justify-between">
            <Label>Pods Available</Label>
            <div>{TokenValue.fromBlockchain(listing.amount, PODS.decimals).toHuman("short")}</div>
          </div>
          <div className="flex flex-row justify-between">
            <Label>Price per Pod</Label>
            <div>{TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals).toHuman()}</div>
          </div>
          <div className="flex flex-row justify-between">
            <Label>Beans to Fill</Label>
            <div>{mainTokensToFill.toHuman()}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Fill Using</Label>
              <ComboInputField
                amount={amountIn}
                setAmount={setAmountIn}
                setToken={setTokenIn}
                setBalanceFrom={setBalanceFrom}
                selectedToken={tokenIn}
                balanceFrom={balanceFrom}
              />
            </div>
            <div className="flex flex-row gap-2">
              <SmartSubmitButton
                token={tokenIn}
                amount={amountIn}
                submitFunction={onSubmit}
                disabled={
                  submitting || isConfirming || stringToNumber(amountIn) <= 0 || (isSwapping && swapData?.output.lte(0))
                }
              />
              <SlippageButton slippage={slippage} setSlippage={setSlippage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
