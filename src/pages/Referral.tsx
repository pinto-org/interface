import PageContainer from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReferralLinkGenerator } from "@/components/ReferralLinkGenerator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { useEffect } from "react";

export default function Referral() {
  useEffect(() => {
    trackSimpleEvent(ANALYTICS_EVENTS.REFERRAL.PAGE_VIEWED);
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-pinto-green-4">Pinto Referral Program</h1>
          <p className="text-lg text-pinto-gray-4">
            Earn rewards by referring new farmers to Pinto. Share your referral link and earn 1% of the Pods your
            referrals sow.
          </p>
        </div>

        {/* Main Referral Card */}
        <Card className="p-6">
          <ReferralLinkGenerator />
        </Card>

        {/* Stats Section - Coming Soon */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-pinto-green-4">Your Referral Stats</h2>
          <div className="bg-pinto-gray-1 p-4 rounded-lg text-center">
            <p className="text-pinto-gray-4">Referral stats and leaderboard coming soon!</p>
            <p className="text-sm text-pinto-gray-3 mt-2">
              Track your earned Pods and see how you rank among top referrers.
            </p>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-pinto-green-4">How It Works</h2>
          <div className="space-y-3 text-pinto-gray-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green-4/10 flex items-center justify-center text-pinto-green-4 font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-pinto-green-4 mb-1">Qualify as a Referrer</h3>
                <p>Sow at least 1,000 Beans in the Field to unlock your referral link.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green-4/10 flex items-center justify-center text-pinto-green-4 font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-pinto-green-4 mb-1">Share Your Link</h3>
                <p>Copy your unique referral link and share it with friends, on social media, or anywhere else.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green-4/10 flex items-center justify-center text-pinto-green-4 font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-pinto-green-4 mb-1">Earn Rewards</h3>
                <p>
                  When someone uses your link and sows Beans, you earn 1% of the Pods they receive as a referral bonus.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green-4/10 flex items-center justify-center text-pinto-green-4 font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-pinto-green-4 mb-1">Get Credited</h3>
                <p>
                  Referral rewards are automatically credited to your wallet address when your referral completes their
                  sow transaction.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Example Section */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-pinto-green-4">Example</h2>
          <div className="bg-pinto-gray-1 p-4 rounded-lg space-y-3 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-pinto-green-4">Scenario:</p>
              <p className="text-pinto-gray-4">
                Alice has sown 5,000 Beans in the Field. She shares her referral link with Bob.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-pinto-green-4">What Happens:</p>
              <ul className="list-disc list-inside space-y-1 text-pinto-gray-4 ml-2">
                <li>Bob clicks Alice's referral link and visits Pinto</li>
                <li>Bob connects his wallet and sows 1,000 Beans</li>
                <li>Bob receives 1,000 Pods (assuming 1:1 weather)</li>
                <li>Alice automatically receives 10 Pods (1% of 1,000 Pods) as a referral bonus</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-pinto-green-4">Result:</p>
              <p className="text-pinto-gray-4">
                Alice earns passive Pods every time someone uses her referral link to sow Beans. The more people she
                refers, the more she earns!
              </p>
            </div>
          </div>
        </Card>

        {/* Requirements Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-pinto-green-4">Requirements & FAQs</h2>
          <div className="space-y-4 text-pinto-gray-4">
            <div>
              <h3 className="font-semibold text-pinto-green-4 mb-2">Why do I need to sow 1,000 Beans first?</h3>
              <p>
                This requirement ensures that referrers are genuine participants in the Pinto ecosystem and helps
                prevent spam or gaming of the referral system.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-pinto-green-4 mb-2">
                Is there a limit to how many people I can refer?
              </h3>
              <p>No! You can refer as many people as you'd like. There is no cap on referral earnings.</p>
            </div>

            <div>
              <h3 className="font-semibold text-pinto-green-4 mb-2">When do I receive my referral rewards?</h3>
              <p>
                Referral rewards are credited immediately when your referral completes their sow transaction. The Pods
                are sent directly to your wallet address.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-pinto-green-4 mb-2">Can I refer myself?</h3>
              <p>
                No, self-referrals are not allowed. Referral links are tracked by wallet address, so using your own link
                won't generate rewards.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-pinto-green-4 mb-2">What if I lose my referral link?</h3>
              <p>
                Don't worry! You can always come back to this page while connected with your wallet to retrieve your
                referral link. It's permanently associated with your wallet address.
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-6 bg-gradient-to-r from-pinto-green-4/10 to-pinto-green-3/10 border-pinto-green-4/20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-pinto-green-4">Ready to Start Earning?</h2>
            <p className="text-pinto-gray-4">
              Connect your wallet and start sharing your referral link today. Help grow the Pinto community and earn
              passive rewards!
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
