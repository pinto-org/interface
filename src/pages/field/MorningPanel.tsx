import MorningCard from "@/components/MorningCard";
import { Button } from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { getMorningResult } from "@/state/protocol/sun";
import { morningAtom, seasonAtom } from "@/state/protocol/sun/sun.atoms";
import { useMorning, useSunData } from "@/state/useSunData";
import { useSetAtom } from "jotai";
import { DateTime } from "luxon";
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
        For the first five minutes of every Season, Temperature ramps up with a new interest rate every 12 seconds.
      </Text>
    </MorningCard>
  );
};

export default MorningPanel;

export const MorningDev = () => {
  const sun = useSunData();

  const setMorning = useSetAtom(morningAtom);
  const setSun = useSetAtom(seasonAtom);

  const initMorning = () => {
    const struct = {
      ...sun,
      timestamp: DateTime.now(),
    };

    const morningResult = getMorningResult({
      timestamp: struct.timestamp,
      blockNumber: struct.sunriseBlock,
    });

    console.log(morningResult);
    setSun(struct);
    setMorning(morningResult);
  };

  return (
    <Button variant="outline" onClick={initMorning}>
      init morning
    </Button>
  );
};
