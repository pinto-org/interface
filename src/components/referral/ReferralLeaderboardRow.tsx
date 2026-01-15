import podIcon from "@/assets/protocol/Pod.png";
import IconImage from "@/components/ui/IconImage";
import { TableCell, TableRow } from "@/components/ui/Table";
import { useAddressName } from "@/hooks/useAddressName";
import { formatter } from "@/utils/format";

/**
 * Individual row component for the leaderboard table
 * Displays generated name instead of address for privacy
 */
interface LeaderboardRowProps {
  entry: {
    address: string;
    rank: number;
    podsEarned: any;
    totalSuccessfulReferrals: number;
  };
  isCurrentUser: boolean;
}

export function ReferralLeaderboardRow({ entry, isCurrentUser }: LeaderboardRowProps) {
  const generatedName = useAddressName(entry.address);

  return (
    <TableRow key={entry.address} noHoverMute>
      <TableCell className="font-medium">{entry.rank}</TableCell>
      <TableCell className={isCurrentUser ? "text-pinto-green" : ""}>
        <div className="font-medium">{generatedName}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt="pod icon" />
          {formatter.noDec(entry.podsEarned)}
        </div>
      </TableCell>
      <TableCell className="text-right">{entry.totalSuccessfulReferrals}</TableCell>
    </TableRow>
  );
}
