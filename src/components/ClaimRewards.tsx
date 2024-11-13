import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { calculateConvertData } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { ChevronDownIcon } from "./Icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/Collapsible";
import IconImage from "./ui/IconImage";
import { Separator } from "./ui/Separator";
import Text from "./ui/Text";

interface RewardsClaimProps {
  trigger: React.ReactNode;
}

const getCombinedRewardString = (rewards: { amount: TokenValue; type: string }[]) => {
  const filteredRewards = rewards.filter((r) => r.amount.gt(0));
  if (filteredRewards.length === 0) return "-";

  return filteredRewards.map((r) => `${formatter.number(r.amount)} ${r.type}`).join(", ");
};

export default function ClaimRewards({ trigger }: RewardsClaimProps) {
  const chainId = useChainId();
  const account = useAccount();
  const data = useFarmerSilo();
  const siloData = useSiloData();
  const { mainToken: mainToken, whitelistedTokens: SILO_WHITELIST } = useTokenData();
  const farmerActions = useFarmerActions();
  const farmerDeposits = useFarmerDepositedBalances();
  const grownStalkFromSeeds = data.grownStalkReward;

  const [isOpen, setIsOpen] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  const beanRewards = farmerActions.claimRewards.outputs.beanGain;
  const stalkRewards = farmerActions.claimRewards.outputs.stalkGain;
  const seedRewards = farmerActions.claimRewards.outputs.seedGain;

  const seedUpdate = farmerActions.updateDeposits.totalGains.seedGain;
  const stalkUpdate = farmerActions.updateDeposits.totalGains.stalkGain;

  const totalStalkRewards = stalkRewards.add(stalkUpdate);
  const totalSeedRewards = seedRewards.add(seedUpdate);

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      const allQueryKeys = [...data.queryKeys, ...siloData.queryKeys, farmerDeposits.queryKey];
      // invalidating query results to trigger a refetch
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess, data.queryKeys, siloData.queryKeys]);

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

    const updateData: `0x${string}`[] = [];
    for (const [token, depositData] of farmerDeposits.data.entries()) {
      for (const deposit of depositData.deposits) {
        if (deposit.currentBdv.gt(deposit.depositBdv) && !deposit.isGerminating) {
          const convertData = calculateConvertData(token, token, deposit.amount, deposit.amount);
          if (!convertData) {
            throw new Error("Invalid convert data");
          }
          const _updateData = encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "convert",
            args: [convertData, [deposit.stem.toBigInt()], [deposit.amount.toBigInt()]],
          });
          updateData.push(_updateData);
        }
      }
    }

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow, ...updateData]],
      });

    toast.promise(tx, {
      loading: "Claiming ...",
      success: (data) => {
        setIsOpen(false);
        return `Transaction complete!`;
      },
      error: (error) => {
        return (error as BaseError).shortMessage || `Transaction failed.`;
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild autoFocus={false}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="max-w-max flex flex-col gap-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <Text variant="h4">Claim Pinto, Stalk and Seed</Text>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-12 pt-12">
          <div className="flex flex-col gap-3 min-w-40">
            <Text variant="body-light">New Pinto</Text>
            {beanRewards.gt(0) ? (
              <Text variant="lg" className="text-pinto-green-4 inline-flex gap-1 items-center">
                + <IconImage src={mainToken.logoURI} size={6} />
                {formatter.number(beanRewards)}
              </Text>
            ) : (
              <Text variant="lg">-</Text>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-40">
            <Text variant="body-light">New Stalk</Text>
            {totalStalkRewards.gt(0) ? (
              <Text variant="lg" className="text-pinto-stalk-gold inline-flex gap-1 items-center">
                + <IconImage src={stalkIcon} size={6} />
                {formatter.number(totalStalkRewards)}
              </Text>
            ) : (
              <Text variant="lg">-</Text>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-40">
            <Text variant="body-light">New Seed</Text>
            {totalSeedRewards.gt(0) ? (
              <Text variant="lg" className="text-pinto-seed-silver inline-flex gap-1 items-center">
                + <IconImage src={seedIcon} size={6} /> {formatter.number(totalSeedRewards)}
              </Text>
            ) : (
              <Text variant="lg">-</Text>
            )}
          </div>
        </div>
        <Collapsible onOpenChange={setIsShowingMore}>
          <CollapsibleTrigger className="flex flex-grow w-full mt-12">
            <div className="flex items-center gap-4 w-full">
              <Separator className="flex-1" />
              <span className="flex flex-row gap-1 items-center">
                <Text variant="body-light">Show more</Text>{" "}
                <span className={`${isShowingMore ? "rotate-180" : ""}`}>
                  <ChevronDownIcon color="black" />
                </span>
              </span>
              <Separator className="flex-1" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col">
            <div className="flex flex-row justify-between pt-6">
              <Text variant="sm-light">Yield</Text>
              <Text variant="sm-light">
                {getCombinedRewardString([
                  { amount: beanRewards, type: "Pinto" },
                  { amount: stalkRewards, type: "Stalk" },
                  { amount: seedRewards, type: "Seed" },
                ])}
              </Text>
            </div>
            <div className="flex flex-row justify-between pt-6">
              <Text variant="sm-light">Grown Stalk from Seed</Text>
              <Text variant="sm-light">{`${formatter.number(grownStalkFromSeeds)} Stalk`}</Text>
            </div>
            <div className="flex flex-row justify-between pt-6">
              <Text variant="sm-light">Stalk and Seed from updating PDV</Text>
              <Text variant="sm-light">
                {getCombinedRewardString([
                  { amount: stalkUpdate, type: "Stalk" },
                  { amount: seedUpdate, type: "Seed" },
                ])}
              </Text>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Button className="flex w-full h-[60px] rounded-full mt-6" onClick={onSubmit}>
          <Text variant="h4" weight="medium" color="white">
            Claim Pinto, Stalk and Seed
          </Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
