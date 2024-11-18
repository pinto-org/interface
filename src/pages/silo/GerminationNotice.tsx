import { truncateHex } from "@/utils/format";
import { DepositData } from "@/utils/types";
import { timeRemaining } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function GerminationNotice({ deposit }: { deposit: DepositData }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-pinto-off-green/15 border border-pinto-off-green flex flex-col p-4 rounded-[1.25rem]">
      <span className="font-[400] text-[1.25rem] text-black">{`Deposit ${truncateHex(deposit.idHex)} is Germinating ${deposit.germinationDate ? `for ${timeRemaining(deposit.germinationDate, currentTime)}` : ""}`}</span>
      <span className="font-[340] text-[1.25rem] text-pinto-gray-4">
        For two Seasons, this Deposit cannot be Converted to a different token or earn yield.
      </span>
    </div>
  );
}
