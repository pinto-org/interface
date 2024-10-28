import { BaseError, encodeFunctionData } from "viem";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { TokenValue } from "@/classes/TokenValue";
import { useAccount, useWriteContract } from "wagmi";
import { useChainId } from "wagmi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { STALK } from "@/constants/internalTokens";
import { useEffect } from "react";

function RewardsClaim() {
  const chainId = useChainId();
  const account = useAccount();
  const data = useFarmerSilo();
  const siloData = useSiloData();
  const { mainToken: BEAN, whitelistedTokens: SILO_WHITELIST } = useTokenData();
  const stalkRewards = siloData.tokenData.get(BEAN).rewards.stalk.mul(10 ** STALK.decimals);
  const seedsRewards = siloData.tokenData.get(BEAN).rewards.seeds;
  const grownStalk = data.grownStalkReward;
  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      const allQueryKeys = [...data.queryKeys, ...siloData.queryKeys];
      // invalidating query results to trigger a refetch
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess]);

  async function onSubmit() {
    if (!account.address) return;

    const plant = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "plant",
    });

    const tokensToMow = SILO_WHITELIST.map((token) => token.address);
    const mow = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "mowMultiple",
      args: [account.address, tokensToMow],
    });

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow]],
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
    <Card className="h-fit w-[300px]">
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>Claim your Silo Rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <Label>Earned Beans</Label>
          <div>{data.earnedBeansBalance.toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Earned Stalk</Label>
          <div>{data.earnedBeansBalance.mul(stalkRewards).toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Plantable Seeds</Label>
          <div>{data.earnedBeansBalance.mul(seedsRewards).toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Grown Stalk</Label>
          <div>{grownStalk.toHuman("short")}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="flex grow" onClick={onSubmit}>
          {"Claim Rewards"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RewardsClaim;
