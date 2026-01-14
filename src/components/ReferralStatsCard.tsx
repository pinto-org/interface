import FrameAnimator from "@/components/LoadingSpinner";
import { useFarmerReferralData, useReferralLeaderboard } from "@/state/referral";
import { formatter } from "@/utils/format";

export function ReferralStatsCard() {
  const { data, isLoading } = useFarmerReferralData();
  const { data: leaderboardData, userRank, isLoading: isLeaderboardLoading } = useReferralLeaderboard();

  if (isLoading || isLeaderboardLoading) {
    return (
      <div className="space-y-4">
        <div className="pinto-h3 sm:pinto-h2">Your Referral Stats</div>
        <div className="flex items-center justify-center h-48">
          <FrameAnimator size={80} />
        </div>
      </div>
    );
  }

  const statsData = [
    {
      label: "Total Pods Earned",
      value: data ? formatter.noDec(data.totalPodsEarned) : "0",
      description: "Pods earned from referrals",
    },
    {
      label: "Total successful referrals",
      value: data?.refereeCount ?? 0,
      description: "Number of users who used your link",
    },
    {
      label: "Referral Ranking",
      value: userRank && leaderboardData ? `#${userRank}/${leaderboardData.length}` : "-",
      description: "Your rank among all referrers",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="pinto-h3 sm:pinto-h2">Your Referral Stats</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <div key={stat.label} className="bg-pinto-off-white p-4 rounded-lg">
            <div className="pinto-sm text-pinto-light mb-2">{stat.label}</div>
            <div className="pinto-h3 text-pinto-dark">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
