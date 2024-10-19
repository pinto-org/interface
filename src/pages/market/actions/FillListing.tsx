import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { AdvancedFarmCall, FarmFromMode, FarmToMode } from "@/utils/types";
import { useParams } from "react-router-dom";
import usePodListings from "@/state/usePodListings";
import { useFieldData } from "@/state/useFieldData";
import { TokenValue } from "@/classes/TokenValue";
import { useWriteContract } from "wagmi";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useChainId } from "wagmi";
import { Address, BaseError } from "viem";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { PODS } from "@/constants/internalTokens";
import useTokenData from "@/state/useTokenData";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import fillPodListing from "@/encoders/fillPodListing";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function FillListing() {

    const BEAN = useTokenData().mainToken;
    const { data: hash, writeContractAsync, isSuccess } = useWriteContract();
    const chainId = useChainId();

    const queryClient = useQueryClient();
    const fieldData = useFieldData();
    const podListings = usePodListings();
    const queryKey = podListings.queryKey;
    const { id } = useParams();
    const allListings = podListings.data;
    const listing = allListings?.podListings.find((listing) => listing.index === id);
    
    const mainToken = useTokenData().mainToken;
  
    const [amountIn, setAmountIn] = useState(0);
    const [tokenIn, setTokenIn] = useState(mainToken);
    const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
    const [slippage, setSlippage] = useState(0.1);

    function changeAmountIn(value: number) {
      setAmountIn(value)
    };

    const isUsingMain = tokenIn.address === mainToken.address;

    const swapData = useSwapEstimate(
      tokenIn,
      mainToken,
      amountIn,
      slippage,
      "exactInput",
      balanceFrom,
      FarmToMode.INTERNAL,
      undefined,
      isUsingMain
    );

    const mainTokensToFill = TokenValue.fromBlockchain(listing?.amount || 0n, PODS.decimals).mul(TokenValue.fromBlockchain(listing?.pricePerPod || 0n, BEAN.decimals))

    useEffect(() => {
      if (isSuccess) {
        // invalidating query results to trigger a refetch
        queryClient.invalidateQueries({ queryKey });
      };
    }, [isSuccess, queryKey]);

    function onSubmit() {
      if (!listing) return
      if (isUsingMain) {
        const tx = () => writeContractAsync({        
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "fillPodListing",
          args: [
            {
              account: listing.farmer.id as Address, // account
              index: TokenValue.fromBlockchain(listing.index, PODS.decimals).toBigInt(), // index
              start: TokenValue.fromBlockchain(0, PODS.decimals).toBigInt(), // start
              amount: TokenValue.fromBlockchain(listing.amount, PODS.decimals).toBigInt(), // amount
              pricePerPod: Number(TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals)), // pricePerPod
              maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals).toBigInt(), // maxHarvestableIndex
              minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, BEAN.decimals).toBigInt(), // minFillAmount, measured in Beans
              mode: Number(listing.mode), // mode
            },
            TokenValue.fromHuman(amountIn, BEAN.decimals).toBigInt(), // amountIn
            Number(balanceFrom), // fromMode
          ]
        });

        toast.promise(tx, {
          loading: "Submitting transaction...",
          success: (data) => {
            return `Transaction complete!`
          },
          error: (error) => {
            return ((error as BaseError).shortMessage || `Transaction failed.`)
          }
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
        if (swapData?.callData) {
          swapData?.callData.push(fillCallData);
          const tx = () => writeContractAsync({
            address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [swapData?.callData],
            value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n
          });

          toast.promise(tx, {
            loading: "Submitting transaction...",
            success: (data) => {
              return `Transaction complete!`
            },
            error: (error) => {
              return ((error as BaseError).shortMessage || `Transaction failed.`)
            }
          });
        };
      };
    };

    return (
        <div>
          {!listing ? <div>Listing not found.</div> : 
            <>
              <div className="flex flex-row justify-between">
                <Label>Seller</Label>
                <div>{listing.farmer.id.substring(0, 6)}</div>
              </div>
              <div className="flex flex-row justify-between">
                <Label>Place in Line</Label>
                <div>{TokenValue.fromBlockchain(listing.index, PODS.decimals).sub(fieldData.harvestableIndex).toHuman("short")}</div>
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
                  setMaxAmount={changeAmountIn}
                />
              </div>
              <div className="flex flex-row gap-2">
                <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit}/>
                <SlippageButton slippage={slippage} setSlippage={setSlippage} />
              </div>
              </div>
            </>
            }
          </div>
    )
}