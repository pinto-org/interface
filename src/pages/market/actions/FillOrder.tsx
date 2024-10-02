import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { FarmToMode } from "@/utils/types";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { useParams } from "react-router-dom";
import usePodOrders from "@/state/usePodOrders";
import { TokenValue } from "@/classes/TokenValue";
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { Address, BaseError } from "viem";
import useTokenData from "@/state/useTokenData";
import { PODS } from "@/constants/internalTokens";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function FillOrder() {

    const BEAN = useTokenData().mainToken;

    const [plot, setPlot] = useState([]);
    const [amount, setAmount] = useState(0);
    const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL);

    const chainId = useChainId();
    const queryClient = useQueryClient();

    const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

    const { id } = useParams();
    const podOrders = usePodOrders();
    const allOrders = podOrders.data;
    const queryKey = podOrders.queryKey;
    const order = allOrders?.podOrders.find((order) => order.id === id);

    const amountOrder = TokenValue.fromBlockchain(order?.beanAmount || 0, BEAN.decimals);
    const amountFilled = TokenValue.fromBlockchain(order?.beanAmountFilled || 0, BEAN.decimals);
    const pricePerPod = TokenValue.fromBlockchain(order?.pricePerPod || 0, BEAN.decimals);
    const remainingBeans = amountOrder.sub(amountFilled);
    const remainingPods = pricePerPod.gt(0) ? remainingBeans.div(pricePerPod) : TokenValue.ZERO;

    useEffect(() => {
      if (isSuccess) {
        // invalidating query results to trigger a refetch
        queryClient.invalidateQueries({ queryKey });
      };
    }, [isSuccess, queryKey]);


    function onSubmit() {
        if (!order || !plot[0]) return
        const tx = () => writeContractAsync({        
          address: beanstalkAddress[chainId],
          abi: beanstalkAbi,
          functionName: "fillPodOrder",
          args: [
            {
              account: order.farmer.id as Address, // order - account
              maxPlaceInLine: BigInt(order.maxPlaceInLine), // order - maxPlaceInLine
              pricePerPod: Number(order.pricePerPod), // order - pricePerPod
              minFillAmount: BigInt(order.minFillAmount), // order - minFillAmount
            },
            plot[0].index.toBigInt(), // index of plot to sell
            BigInt(0), // start index within plot
            TokenValue.fromHuman(amount, PODS.decimals).toBigInt(), // amount of pods to sell
            Number(balanceTo) //destination balance
          ]
        })

        toast.promise(tx, {
          loading: "Submitting transaction...",
          success: (data) => {
            return `Transaction complete!`
          },
          error: (error) => {
            return ((error as BaseError).shortMessage || `Transaction failed.`)
          }
        });
      }
  

    return (
        <div>
        {!order ? <div>Listing not found.</div> : 
            <div className="flex flex-col gap-4">
            <div>
              <div className="flex flex-row justify-between">
                  <Label>Buyer</Label>
                  <div>{order.farmer.id.substring(0, 6)}</div>
              </div>
              <div className="flex flex-row justify-between">
                  <Label>Place in Line</Label>
                  <div>0 - {TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals).toHuman("short")}</div>
              </div>
              <div className="flex flex-row justify-between">
                  <Label>Pods Requested</Label>
                  <div>{remainingPods.toHuman("short")}</div>
              </div>
              <div className="flex flex-row justify-between">
                  <Label>Price per Pod</Label>
                  <div>{pricePerPod.toHuman("short")}</div>
              </div>
              <div className="flex flex-row justify-between">
                  <Label>Beans Remaining</Label>
                  <div>{remainingBeans.toHuman("short")}</div>
              </div>
            </div>
            <div>
              <Label>Select Plot</Label>
              <ComboPlotInputField 
                amount={amount}
                selectedPlots={plot}
                setAmount={setAmount}
                setPlots={setPlot}
                type="single"
              />
            </div>
            <div className="flex flex-row justify-between">
                <Label className="content-center">Destination</Label>
                <DestinationBalanceSelect setBalanceTo={setBalanceTo} />
            </div>
            <div>
              <Button type="button" className="flex grow" onClick={onSubmit}>
                {"Submit"}
              </Button>
            </div>
          </div>
        }
        </div>
    )
}