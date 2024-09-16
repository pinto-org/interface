import { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BaseError } from "viem";

function Harvest() {
  const chainId = useChainId();
  const account = useAccount();

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
    <>
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle>Harvest</CardTitle>
          <CardDescription>Harvest your plots</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-row justify-between">
            <Label className="content-center">Harvestable Balance</Label>
            <div>{harvestableAmount.toHuman("short")}</div>
          </div>
          <div className="flex flex-row justify-between">
            <Label className="content-center">Destination</Label>
            <DestinationBalanceSelect setBalanceTo={setBalanceTo} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={() => onSubmit()} className="w-full">{`Submit`}</Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default Harvest;
