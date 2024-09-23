import { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BaseError } from "viem";
import useTokenData from "@/state/useTokenData";
import { usePriceData } from "@/state/usePriceData";

function Harvest() {
  const chainId = useChainId();
  const account = useAccount();

  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;

  const priceData = usePriceData();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();
  const queryClient = useQueryClient();

  const { plots: fieldPlots, queryKey } = useFarmerField();
  let harvestableAmount = TokenValue.ZERO;
  const plots: string[] = [];
  fieldPlots.forEach((plot) => {
    if (harvestableAmount.gt(0)) {
      plots.push(plot.id);
    }
    harvestableAmount = harvestableAmount.add(plot.harvestablePods);
  });

  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  function onSubmit() {
    if (!!account.address || plots.length === 0 || harvestableAmount.eq(0) || !balanceTo) return;
    const tx = () => writeContractAsync({
      address: beanstalkAddress[chainId],
      abi: beanstalkAbi,
      functionName: "harvest",
      args: [
        [plots], //array of plot id(s)
        Number(balanceTo), // FarmToMode
      ],
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
  }

  return (
    <div className="flex flex-col gap-8">
      {harvestableAmount.gt(0) ?
      <>
      <div className="flex flex-col justify-between">
        <div className="text-pinto-gray-4 text-[1.25rem]">
          You receive
        </div>
        <div className="inline-flex gap-1 items-center text-black text-[2rem]">
          {harvestableAmount.toHuman("short")}
          <img src={mainToken.logoURI} className="w-6 h-6"/>
          <span className="text-[1.25rem]">{mainToken.name}</span>
        </div>
        <div className="text-[1rem] text-pinto-gray-4">
          ${harvestableAmount.mul(priceData.price).toHuman("short")}
        </div>
      </div>
      <div className="flex flex-col gap-4 text-">
        <Label>I want to Receive my Pinto to my:</Label>
        <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
      </div>
      </>
      :
      <div className="text-[1.25rem] font-[400] text-center">
        Your Pods become Harvestable when they reach a Place in Line of 0.
      </div>
      }
      <Button type="button" disabled={harvestableAmount.eq(0)} onClick={() => onSubmit()} className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]">{`Harvest`}</Button>
    </div>
  );
}

export default Harvest;
