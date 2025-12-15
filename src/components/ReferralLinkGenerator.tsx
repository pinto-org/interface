import telegramLogo from "@/assets/misc/telegram-logo.png";
import xLogo from "@/assets/misc/x-logo.png";
import { SowRequirementCard } from "@/components/SowRequirementCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useFarmerSowEligibility } from "@/hooks/useFarmerSowEligibility";
import { useReferralData } from "@/state/referral";
import { trackSimpleEvent } from "@/utils/analytics";
import { truncateHex } from "@/utils/format";
import { encodeReferralAddress } from "@/utils/referral";
import { CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface ReferralLinkGeneratorProps {
  onChangeAddress: () => void;
}

export function ReferralLinkGenerator({ onChangeAddress }: ReferralLinkGeneratorProps) {
  const { address } = useAccount();
  const { delegateAddress } = useReferralData();
  const { meetsRequirement, totalPods, amountNeeded, progressPercentage } = useFarmerSowEligibility();

  const isWalletConnected = !!address;

  const referralCode = address ? encodeReferralAddress(address) : "";
  const referralUrl = `${window.location.origin}/field?ref=${referralCode}`;
  const podDestinationAddress = delegateAddress || address;

  const handleCopyCode = () => {
    if (!isWalletConnected) return;

    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_COPIED, {
      address,
      type: "code",
    });
  };

  const handleCopyLink = () => {
    if (!isWalletConnected) return;

    navigator.clipboard.writeText(referralUrl);
    toast.success("Referral link copied to clipboard!");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_COPIED, {
      address,
      type: "link",
    });
  };

  const handleTwitterShare = () => {
    if (!isWalletConnected) return;

    console.log("Twitter/X share clicked");
    const tweetText =
      "🌱 I'm farming on @PintoProtocol and earning passive rewards!\n\nJoin me and I'll earn bonus Pods when you Sow Pinto 🫘\n\nStart farming today:";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.TWITTER_SHARE, {
      address,
    });
  };

  const handleTelegramShare = () => {
    if (!isWalletConnected) return;

    console.log("Telegram share clicked");
    const shareText =
      "🌱 I'm farming on Pinto Protocol and earning passive rewards! Join me and I'll earn bonus Pods when you Sow Pinto 🫘 Start farming today";
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_SHARED, {
      address,
      platform: "telegram",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pinto-h3 sm:pinto-h2">Invite via</div>

      <div className="flex flex-col gap-4">
        {/* Referral Code */}
        <div className="flex flex-col gap-2">
          <label className="pinto-sm text-pinto-light">Referral Code</label>
          <div className="flex flex-row gap-2">
            <Input
              value={isWalletConnected ? referralCode : "Connect wallet to generate code"}
              readOnly
              outlined
              className="text-sm"
              containerClassName={`w-80 max-w-full ${isWalletConnected ? "border-pinto-green" : "border-gray-300"}`}
              disabled={!isWalletConnected}
            />
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="icon"
              className="w-10 h-10 flex-shrink-0"
              title="Copy code"
              disabled={!isWalletConnected}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="flex flex-col gap-2">
          <label className="pinto-sm text-pinto-light">Referral Link</label>
          <div className="flex flex-row gap-2">
            <Input
              value={isWalletConnected ? referralUrl : "Connect wallet to generate link"}
              readOnly
              outlined
              className="text-sm"
              containerClassName={`w-80 max-w-full ${isWalletConnected ? "border-pinto-green" : "border-gray-300"}`}
              disabled={!isWalletConnected}
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="icon"
              className="w-10 h-10 flex-shrink-0"
              title="Copy link"
              disabled={!isWalletConnected}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          {" "}
          {/* Conditional rendering based on sow requirement */}
          {!meetsRequirement || !isWalletConnected ? (
            <SowRequirementCard
              totalPods={totalPods}
              amountNeeded={amountNeeded}
              progressPercentage={progressPercentage}
              disabled={!isWalletConnected}
            />
          ) : (
            /* Pod Destination Address and Share via - Row Layout */
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start">
              {/* Pod Destination Address */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="pinto-sm text-pinto-light">Pod Destination Address</label>
                <div className="flex flex-col gap-1">
                  <span className="pinto-body text-pinto-dark">
                    {podDestinationAddress ? truncateHex(podDestinationAddress, 6, 4) : "-"}
                  </span>
                  <button
                    type="button"
                    onClick={onChangeAddress}
                    className="text-pinto-green pinto-sm hover:text-pinto-green/80 transition-colors text-left w-fit underline-offset-2 hover:underline"
                  >
                    Change address
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Social Sharing Icons */}
          <div className="flex flex-col gap-2">
            <label className="pinto-sm text-pinto-light">Share via</label>
            <div className="flex gap-2">
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                size="icon"
                className="w-10 h-10 p-2"
                title="Share on X (Twitter)"
                disabled={!isWalletConnected}
              >
                <img src={xLogo} alt="X" className="w-4 h-4 object-contain" />
              </Button>
              <Button
                onClick={handleTelegramShare}
                variant="outline"
                size="icon"
                className="w-10 h-10 p-2"
                title="Share on Telegram"
                disabled={!isWalletConnected}
              >
                <img src={telegramLogo} alt="Telegram" className="w-5 h-5 object-contain" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
