import { HowToCard } from "@/components/HowToCard";
import ReferralLeaderboard from "@/components/ReferralLeaderboard";
import { ReferralLinkGenerator } from "@/components/ReferralLinkGenerator";
import { ReferralStatsCard } from "@/components/ReferralStatsCard";
import { Card } from "@/components/ui/Card";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";

export default function Referral() {
  return (
    <PageContainer variant="lg">
      <div className="flex flex-col w-full mt-4 sm:mt-0">
        <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-y-3">
            <div className="pinto-h2 sm:pinto-h1">Referral Program</div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              Earn rewards by referring new farmers to Pinto. Share your referral link and earn 10% of the Pods your
              referrals Sow.
            </div>
          </div>
          <Separator />

          {/* Main Referral Cards - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Invite via */}
            <Card className="p-4 sm:p-6">
              <ReferralLinkGenerator />
            </Card>

            {/* How to */}
            <Card className="p-4 sm:p-6">
              <HowToCard />
            </Card>
          </div>

          {/* Your Referral Stats - Standalone Section */}
          <Card className="p-4 sm:p-6">
            <ReferralStatsCard />
          </Card>

          {/* Leaderboard */}
          <ReferralLeaderboard />

          {/* How It Works */}
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="pinto-h3 sm:pinto-h2">How It Works</div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
                  1
                </div>
                <div>
                  <div className="pinto-body-bold text-pinto-dark mb-1">Qualify as a Referrer</div>
                  <div className="pinto-sm text-pinto-light">
                    Sow at least 1,000 Pinto in the Field to unlock your referral link.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
                  2
                </div>
                <div>
                  <div className="pinto-body-bold text-pinto-dark mb-1">Share Your Link</div>
                  <div className="pinto-sm text-pinto-light">
                    Copy your unique referral link and share it with friends, on social media, or anywhere else.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
                  3
                </div>
                <div>
                  <div className="pinto-body-bold text-pinto-dark mb-1">Earn Rewards</div>
                  <div className="pinto-sm text-pinto-light">
                    When someone uses your link and Sows Pinto, you earn 10% of the Pods they receive as a referral
                    bonus.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
                  4
                </div>
                <div>
                  <div className="pinto-body-bold text-pinto-dark mb-1">Get Credited</div>
                  <div className="pinto-sm text-pinto-light">
                    Referral rewards are automatically credited to your wallet address when your referral completes
                    their Sow transaction.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Requirements Card */}
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="pinto-h3 sm:pinto-h2">Requirements & FAQs</div>
            <div className="space-y-4">
              <div>
                <div className="pinto-body-bold text-pinto-dark mb-2">Why do I need to Sow 1,000 Pinto first?</div>
                <div className="pinto-sm text-pinto-light">
                  This requirement ensures that referrers are genuine participants in the Pinto ecosystem and helps
                  prevent spam or gaming of the referral system.
                </div>
              </div>

              <div>
                <div className="pinto-body-bold text-pinto-dark mb-2">
                  Is there a limit to how many people I can refer?
                </div>
                <div className="pinto-sm text-pinto-light">
                  No! You can refer as many people as you'd like. There is no cap on referral earnings.
                </div>
              </div>

              <div>
                <div className="pinto-body-bold text-pinto-dark mb-2">When do I receive my referral rewards?</div>
                <div className="pinto-sm text-pinto-light">
                  Referral rewards are credited immediately when your referral completes their Sow transaction. The Pods
                  are sent directly to your wallet address.
                </div>
              </div>

              <div>
                <div className="pinto-body-bold text-pinto-dark mb-2">Can I refer myself?</div>
                <div className="pinto-sm text-pinto-light">
                  No, self-referrals are not allowed. Referral links are tracked by wallet address, so using your own
                  link won't generate rewards.
                </div>
              </div>

              <div>
                <div className="pinto-body-bold text-pinto-dark mb-2">What if I lose my referral link?</div>
                <div className="pinto-sm text-pinto-light">
                  Don't worry! You can always come back to this page while connected with your wallet to retrieve your
                  referral link. It's permanently associated with your wallet address.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
