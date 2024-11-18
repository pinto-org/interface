import MorningCard from "@/components/MorningCard";
import Text from "@/components/ui/Text";
import { useMorning } from "@/state/useSunData";

import { MorningTimer } from "./MorningCountdown";

const MorningPanel = () => {
  const morning = useMorning();

  if (!morning.isMorning) {
    return null;
  }

  return (
    <MorningCard className="flex flex-col p-6 gap-2">
      <div className="inline-flex items-center gap-2">
        <Text variant="h3">Morning Auction</Text>
        <Text variant="h3" className="text-pinto-morning tabular-nums">
          <MorningTimer />
        </Text>
      </div>
      <Text variant="body-light" color="light">
        For the first five minutes of every Season, the Temperature increases from 1% to the Max Temperature of the Season.
      </Text>
    </MorningCard>
  );
};

export default MorningPanel;
