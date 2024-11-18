import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";

function RewardsClaim() {
  const chainId = useChainId();
  const account = useAccount();
  const data = useFarmerSiloNew();
  const siloData = useSiloData();
  const { mainToken: BEAN, whitelistedTokens: SILO_WHITELIST } = useTokenData();
  const stalkRewards = siloData.tokenData.get(BEAN)?.rewards.stalk;
  const seedsRewards = siloData.tokenData.get(BEAN)?.rewards.seeds;
  const grownStalk = data.grownStalkReward;
  const queryClient = useQueryClient();
  const { writeWithEstimateGas, setSubmitting, isConfirming, submitting } = useTransaction({
    successMessage: "Rewards claimed",
    errorMessage: "Rewards claim failed",
    successCallback: () => {
      const allQueryKeys = [...data.queryKeys, ...siloData.queryKeys];
      // invalidating query results to trigger a refetch
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    },
  });

  async function onSubmit() {
    try {
      if (!account.address) {
        throw new Error("Signer required");
      }

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

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow]],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Rewards claim failed");
      return e;
    } finally {
      setSubmitting(false);
    }
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
          <div>{data.earnedBeansBalance.mul(stalkRewards ?? TokenValue.ZERO).toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Plantable Seeds</Label>
          <div>{data.earnedBeansBalance.mul(seedsRewards ?? TokenValue.ZERO).toHuman("short")}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Label>Grown Stalk</Label>
          <div>{grownStalk.toHuman("short")}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="flex grow" onClick={onSubmit} disabled={submitting || isConfirming}>
          {"Claim Rewards"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RewardsClaim;
