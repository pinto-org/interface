export interface StatItem {
  label: string;
  value: string | number;
  description?: string;
}

interface ReferralStatsCardProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  {
    label: "Total Pods Earned",
    value: 0,
    description: "Pods earned from referrals",
  },
  {
    label: "Total successful referrals",
    value: 0,
    description: "Number of users who used your link",
  },
  {
    label: "Referral Ranking",
    value: "-",
    description: "Your rank among all referrers",
  },
  {
    label: "Total Pods created from referrals",
    value: 0,
    description: "Total Pods your referrals have earned",
  },
  {
    label: "Total Pinto Sown from referrals",
    value: 0,
    description: "Total Pinto your referrals have sown",
  },
];

export function ReferralStatsCard({ stats = defaultStats }: ReferralStatsCardProps) {
  return (
    <div className="space-y-4">
      <div className="pinto-h3 sm:pinto-h2">Your Referral Stats</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-pinto-off-white p-4 rounded-lg">
            <div className="pinto-sm text-pinto-light mb-2">{stat.label}</div>
            <div className="pinto-h3 text-pinto-dark">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
