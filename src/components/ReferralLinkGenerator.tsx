import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { truncateHex } from "@/utils/format";
import { encodeReferralAddress } from "@/utils/referral";
import { CopyIcon, Share1Icon, ChatBubbleIcon, BarChartIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export function ReferralLinkGenerator() {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="text-center text-pinto-gray-4">Connect your wallet to access referral features</div>
    );
  }

  const referralCode = encodeReferralAddress(address);
  const referralUrl = `${window.location.origin}/field?ref=${referralCode}`;
  const podDestinationAddress = address;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_COPIED, {
      address,
      type: "code",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Referral link copied to clipboard!");

    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.LINK_COPIED, {
      address,
      type: "link",
    });
  };

  const handleChangeAddress = () => {
    console.log("Change pod destination address clicked");
    toast.info("Change address functionality coming soon!");
  };

  const handleTwitterShare = () => {
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
    console.log("Telegram share clicked");
    toast.info("Telegram share functionality coming soon!");
  };

  const handleQRCode = () => {
    console.log("QR code clicked");
    toast.info("QR code functionality coming soon!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pinto-h3 sm:pinto-h2">Invite via</div>

      <div className="flex flex-col gap-4">
        {/* Referral Code */}
        <div className="flex flex-col gap-2">
          <label className="pinto-sm text-pinto-light">Referral Code</label>
          <div className="flex flex-row gap-2">
            <Input value={referralCode} readOnly className="flex-1 min-w-0 text-sm" />
            <Button onClick={handleCopyCode} variant="outline" className="gap-2 whitespace-nowrap">
              <CopyIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="flex flex-col gap-2">
          <label className="pinto-sm text-pinto-light">Referral Link</label>
          <div className="flex flex-row gap-2">
            <Input value={referralUrl} readOnly className="flex-1 min-w-0 text-sm" />
            <Button onClick={handleCopyLink} variant="outline" className="gap-2 whitespace-nowrap">
              <CopyIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Pod Destination Address and Share via - Row Layout */}
        <div className="flex flex-row gap-4 items-start">
          {/* Pod Destination Address */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="pinto-sm text-pinto-light">Pod Destination Address</label>
            <div className="flex flex-col gap-1">
              <span className="pinto-body text-pinto-dark">{truncateHex(podDestinationAddress, 6, 4)}</span>
              <button
                type="button"
                onClick={handleChangeAddress}
                className="text-pinto-green underline cursor-pointer pinto-sm hover:text-pinto-green-dark transition-colors text-left w-fit"
              >
                change
              </button>
            </div>
          </div>

          {/* Social Sharing Icons */}
          <div className="flex flex-col gap-2">
            <label className="pinto-sm text-pinto-light">Share via</label>
            <div className="flex gap-2">
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                size="icon"
                className="w-10 h-10"
                title="Share on X (Twitter)"
              >
                <Share1Icon className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleTelegramShare}
                variant="outline"
                size="icon"
                className="w-10 h-10"
                title="Share on Telegram"
              >
                <ChatBubbleIcon className="w-5 h-5" />
              </Button>
              <Button onClick={handleQRCode} variant="outline" size="icon" className="w-10 h-10" title="Show QR Code">
                <BarChartIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
