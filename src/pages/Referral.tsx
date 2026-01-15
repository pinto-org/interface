import { DelegateReferralModal } from "@/components/DelegateReferralModal";
import { HowToCard } from "@/components/HowToCard";
import ReferralLeaderboard from "@/components/ReferralLeaderboard";
import { ReferralLinkGenerator } from "@/components/ReferralLinkGenerator";
import { ReferralStatsCard } from "@/components/ReferralStatsCard";
import { Card } from "@/components/ui/Card";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Referral() {
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 sm:items-stretch">
            {/* Invite via - with overlay pattern like Field page */}
            <div className="relative h-full">
              <Card className="p-4 sm:p-6 h-full">
                <ReferralLinkGenerator onChangeAddress={() => setIsDelegateModalOpen(true)} />
              </Card>
              <AnimatePresence>
                {isDelegateModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute inset-x-0 top-6 mx-auto w-[95%] z-10"
                  >
                    <Card className="rounded-xl" id="delegate-modal">
                      <div className="flex flex-col w-full items-center p-4 sm:p-6">
                        <DelegateReferralModal isOpen={isDelegateModalOpen} onOpenChange={setIsDelegateModalOpen} />
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* How to */}
            <Card className="p-4 sm:p-6 h-full">
              <HowToCard />
            </Card>
          </div>

          {/* Your Referral Stats - Standalone Section */}
          <Card className="p-4 sm:p-6">
            <ReferralStatsCard />
          </Card>

          {/* Leaderboard */}
          <ReferralLeaderboard />
        </div>
      </div>
    </PageContainer>
  );
}
