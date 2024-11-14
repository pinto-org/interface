import { TokenValue } from "@/classes/TokenValue";
import ComboPlotInputField from "@/components/ComboPlotInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SimpleInputField from "@/components/SimpleInputField";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFieldData, useHarvestableIndex } from "@/state/useFieldData";
import usePodListings from "@/state/usePodListings";
import useTokenData from "@/state/useTokenData";
import { FarmToMode, Plot } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";

export default function CreateListing() {
  const { address: account } = useAccount();
  const chainId = useChainId();
  const mainToken = useTokenData().mainToken;
  const podListings = usePodListings();
  const queryKey = podListings.queryKey;
  const queryClient = useQueryClient();

  const [plot, setPlot] = useState<Plot[]>([]);
  const [amount, setAmount] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [pricePerPod, setPricePerPod] = useState(0);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.INTERNAL);
  const harvestableIndex = useHarvestableIndex();

  useEffect(() => {
    if (plot[0]) {
      setAmount(Number(plot[0].pods.toHuman()));
    }
  }, [plot]);

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess, queryKey]);

  function onSubmit() {
    if (!pricePerPod || pricePerPod <= 0 || !expiresIn || !amount || amount <= 0 || !account) return;

    const _pricePerPod = TokenValue.fromHuman(pricePerPod, mainToken.decimals);
    const _expiresIn = TokenValue.fromHuman(expiresIn, PODS.decimals);
    const index = plot[0].index;
    const start = TokenValue.fromHuman(0, PODS.decimals);
    const _amount = TokenValue.fromHuman(amount, PODS.decimals);
    const maxHarvestableIndex = _expiresIn.add(harvestableIndex);
    const minFill = TokenValue.fromHuman(1, PODS.decimals);
    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "createPodListing",
        args: [
          {
            lister: account,
            fieldId: 0n,
            index: index.toBigInt(),
            start: start.toBigInt(),
            podAmount: _amount.toBigInt(),
            pricePerPod: Number(_pricePerPod),
            maxHarvestableIndex: maxHarvestableIndex.toBigInt(),
            minFillAmount: minFill.toBigInt(),
            mode: Number(balanceTo),
          },
        ],
      });

    toast.promise(tx, {
      loading: "Submitting transaction...",
      success: (data) => {
        return `Transaction complete!`;
      },
      error: (error) => {
        return (error as BaseError).shortMessage || `Transaction failed.`;
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
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
      <div>
        <Label>Price Per Pod</Label>
        <SimpleInputField amount={pricePerPod} setAmount={setPricePerPod} token={mainToken} />
      </div>
      <div>
        <Label>Expires In</Label>
        <SimpleInputField amount={expiresIn} setAmount={setExpiresIn} />
      </div>
      <div className="flex flex-col">
        <Label className="content-center">Send proceeds to</Label>
        <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
      </div>
      <div className="flex flex-row">
        <Button type="button" className={`flex grow h-12 rounded-[0.75rem] text-[1.5rem]`} onClick={onSubmit}>
          {"Submit"}
        </Button>
      </div>
    </div>
  );
}
