import PageContainer from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ReferralLinkGenerator } from "@/components/ReferralLinkGenerator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { useEffect } from "react";

export default function Referral() {
  useEffect(() => {
    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.PAGE_VIEWED);
  }, []);

  return (
    <PageContainer variant="lg">
      <div className="flex flex-col w-full mt-4 sm:mt-0">
        <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-y-3">
            <div className="pinto-h2 sm:pinto-h1">Referral Program</div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
              Earn rewards by referring new farmers to Pinto. Share your referral link and earn 1% of the Pods your
              referrals sow.
            </div>
          </div>
          <Separator />

          {/* Main Referral Cards - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Your Referral Link */}
            <Card className="p-4 sm:p-6">
              <ReferralLinkGenerator />
            </Card>

            {/* Your Referral Stats */}
            <Card className="p-4 sm:p-6 space-y-4">
              <div className="pinto-h3 sm:pinto-h2">Your Referral Stats</div>
              <div className="flex flex-col gap-4">
                <div className="bg-pinto-off-white p-4 rounded-lg">
                  <div className="pinto-sm text-pinto-light mb-1">Total Pods Earned</div>
                  <div className="pinto-h3 text-pinto-dark">0</div>
                </div>
                <div className="bg-pinto-off-white p-4 rounded-lg">
                  <div className="pinto-sm text-pinto-light mb-1">Successful Referrals</div>
                  <div className="pinto-h3 text-pinto-dark">0</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="pinto-h3 sm:pinto-h2">Referral Leaderboard</div>
            <div className="bg-pinto-off-white p-6 rounded-lg text-center">
              <div className="pinto-body text-pinto-light">Leaderboard coming soon!</div>
              <div className="pinto-sm text-pinto-light/60 mt-2">
                See how you rank among top referrers in the Pinto community.
              </div>
            </div>
          </Card>

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
                    When someone uses your link and sows Pinto, you earn 1% of the Pods they receive as a referral
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
                    their sow transaction.
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
                <div className="pinto-body-bold text-pinto-dark mb-2">Why do I need to sow 1,000 Pinto first?</div>
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
                  Referral rewards are credited immediately when your referral completes their sow transaction. The Pods
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

          {/* Call to Action */}
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-pinto-green/10 to-pinto-green/5 border-pinto-green/20">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="pinto-h3 sm:pinto-h2 text-pinto-green">Ready to Start Earning?</div>
              <div className="pinto-sm sm:pinto-body text-pinto-light">
                Connect your wallet and start sharing your referral link today. Help grow the Pinto community and earn
                passive rewards!
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
