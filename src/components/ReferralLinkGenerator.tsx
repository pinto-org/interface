import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useFarmerField } from "@/state/useFarmerField";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { encodeReferralAddress } from "@/utils/referral";
import { CopyIcon, Share1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const MIN_SOWN_BEANS = 1000;

export function ReferralLinkGenerator() {
  const { address } = useAccount();
  const farmerField = useFarmerField();

  if (!address) {
    return (
      <Card className="p-6">
        <div className="text-center text-pinto-gray-4">Connect your wallet to generate a referral link</div>
      </Card>
    );
  }

  const encodedRef = encodeReferralAddress(address);
  const referralUrl = `${window.location.origin}/field?ref=${encodedRef}`;

  // Calculate total sown beans from plots
  const totalSownBeans = farmerField.plots.reduce((total, plot) => {
    // Each plot represents pods sown. To get beans sown, we use the initial sown amount
    // which is stored in the plot data
    return total + (plot.pods?.toNumber() || 0);
  }, 0);

  // For now, we'll use the totalPods as a proxy. In production, you'd want to query
  // the subgraph for the actual sownBeans value from farmer.field.sownBeans
  const isEligible = totalSownBeans >= MIN_SOWN_BEANS;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Referral link copied to clipboard!");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_COPIED, {
      address,
      is_eligible: isEligible,
      total_sown_beans: totalSownBeans,
    });
  };

  const handleGenerateClick = () => {
    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_GENERATED, {
      address,
      is_eligible: isEligible,
      total_sown_beans: totalSownBeans,
    });
  };

  const handleTwitterShare = () => {
    const tweetText =
      "🌱 I'm farming on @PintoProtocol and earning passive rewards!\n\nJoin me and we both earn bonus Pods when you sow Beans 🫘\n\nStart farming today:";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.TWITTER_SHARE, {
      address,
      is_eligible: isEligible,
      total_sown_beans: totalSownBeans,
    });
  };

  const progressPercentage = Math.min((totalSownBeans / MIN_SOWN_BEANS) * 100, 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="pinto-h3">Your Referral Link</div>
        <div className="pinto-body-light text-pinto-light">
          Share your link to earn 1% bonus Pods when others sow using it
        </div>
      </div>

      {!isEligible && (
        <div className="flex flex-col gap-3 p-4 bg-pinto-off-white rounded-lg">
          <div className="flex justify-between items-center">
            <div className="pinto-sm-bold text-pinto-dark">Qualification Progress</div>
            <div className="pinto-sm text-pinto-light">
              {formatter.number(totalSownBeans)} / {formatter.number(MIN_SOWN_BEANS)} Beans
            </div>
          </div>
          <div className="w-full h-3 bg-pinto-light/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pinto-green to-pinto-green-dark transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="pinto-sm text-pinto-light">
            Sow {formatter.number(MIN_SOWN_BEANS - totalSownBeans)} more Beans to unlock your referral link
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          <Input value={referralUrl} readOnly className="flex-1" onClick={handleGenerateClick} />
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            <CopyIcon className="w-4 h-4" />
            Copy
          </Button>
        </div>

        {isEligible && (
          <>
            <div className="pinto-sm text-pinto-green bg-pinto-green/10 p-3 rounded-lg">
              ✓ Your referral link is active! You'll earn 1% bonus Pods when someone sows using your link.
            </div>

            {/* Twitter Share Button */}
            <div className="flex flex-col gap-2">
              <div className="pinto-sm-bold text-pinto-light">Share on Social</div>
              <Button onClick={handleTwitterShare} variant="outline" className="gap-2 w-full justify-center">
                <Share1Icon className="w-4 h-4" />
                Share on Twitter
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 bg-pinto-off-white rounded-lg">
        <div className="pinto-sm-bold text-pinto-dark">How it works:</div>
        <ul className="pinto-sm text-pinto-light list-disc list-inside space-y-1">
          <li>Share your referral link with others</li>
          <li>When they sow Beans using your link, you both earn bonus Pods</li>
          <li>You receive 1% of the Pods they earn as a referral bonus</li>
          <li>They get their full Pod allocation plus the referral bonus</li>
        </ul>
      </div>
    </div>
  );
}
