import MorningCard from "@/components/MorningCard";
import { useMorning } from "@/state/useSunData";
import { MorningTimer } from "./MorningCountdown";

const MorningPanel = () => {
  const morning = useMorning();

  if (!morning.isMorning) {
    return null;
  }

  return (
    <MorningCard className="flex flex-col p-3 self-start sm:p-6 gap-2">
      <div className="inline-flex items-start gap-2">
        <div className="pinto-body sm:pinto-h3">Morning Auction</div>
        <div className="pinto-body sm:pinto-h3 text-pinto-morning sm:text-pinto-morning tabular-nums">
          <MorningTimer />
        </div>
      </div>
      <div className="pinto-xs sm:pinto-body-light text-pinto-light sm:text-pinto-light">
        For the first ten minutes of every Season, the Temperature increases from 1% of the Max Temperature of the
        Season.
      </div>
    </MorningCard>
  );
};

export default MorningPanel;
