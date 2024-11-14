import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getClaimText } from "@/utils/string";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ChevronDownIcon } from "./Icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/Collapsible";
import IconImage from "./ui/IconImage";
import { Separator } from "./ui/Separator";
import Text from "./ui/Text";

interface RewardsClaimProps {
  trigger: React.ReactNode;
}

const getCombinedRewardString = (rewards: { amount: TokenValue; type: string }[]) => {
  const filteredRewards = rewards.filter((r) => {
    if (!r.amount) return false;
    return r.amount.gte(0.01);
  });

  if (filteredRewards.length === 0) return "-";

  return filteredRewards
    .map((r) => {
      if (!r.amount) return "";
      const formattedAmount = formatter.number(r.amount);
      if (!formattedAmount) return "";
      return `${formattedAmount} ${r.type}`;
    })
    .filter(Boolean)
    .join(", ");
};

export default function ClaimRewards({ trigger }: RewardsClaimProps) {
  const account = useAccount();
  const data = useFarmerSilo();
  const { mainToken: mainToken } = useTokenData();
  const farmerActions = useFarmerActions();
  const claimableText = getClaimText(
    farmerActions.claimRewards.outputs.beanGain,
    farmerActions.claimRewards.outputs.stalkGain,
    farmerActions.claimRewards.outputs.seedGain,
  );

  const grownStalkFromSeeds = data.grownStalkReward;

  const [isOpen, setIsOpen] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  const { submitClaimRewards, isSubmitting } = useClaimRewards();

  const beanRewards = farmerActions.claimRewards.outputs.beanGain;
  const stalkRewards = farmerActions.claimRewards.outputs.stalkGain;
  const seedRewards = farmerActions.claimRewards.outputs.seedGain;

  const seedUpdate = farmerActions.updateDeposits.totalGains.seedGain;
  const stalkUpdate = farmerActions.updateDeposits.totalGains.stalkGain;

  const totalStalkRewards = stalkRewards.add(stalkUpdate);
  const totalSeedRewards = seedRewards.add(seedUpdate);

  async function onSubmit() {
    if (!account.address) return;
    submitClaimRewards();
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
            <Text variant="h4">{claimableText}</Text>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-12 pt-12">
          <div className="flex flex-col gap-3 min-w-40">
            <Text variant="body-light">New Pinto</Text>
            {beanRewards.gt(0.01) ? (
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
            {totalStalkRewards.gt(0.01) ? (
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
            {totalSeedRewards.gt(0.01) ? (
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
                  { amount: stalkRewards.sub(grownStalkFromSeeds), type: "Stalk" },
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
        <Button className="flex w-full h-[60px] rounded-full mt-6" onClick={onSubmit} disabled={isSubmitting}>
          <Text variant="h4" weight="medium" color="white">
            {getClaimText(beanRewards, totalStalkRewards, totalSeedRewards)}
          </Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
