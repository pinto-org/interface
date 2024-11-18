import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { Token } from "@/utils/types";
import { timeRemaining } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";
import Text from "./ui/Text";

export default function OverviewNoticeGermination() {
  const depositedBalances = useFarmerSiloNew().deposits;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Find currently germinating deposits
  const germinatingDeposits = useMemo(() => {
    const deposits = new Map<Token, Date>();

    depositedBalances.forEach((tokenData, token) => {
      tokenData.deposits.forEach((deposit) => {
        if (deposit.isGerminating && deposit.germinationDate) {
          const existingDate = deposits.get(token);
          if (!existingDate || existingDate.getTime() < deposit.germinationDate.getTime()) {
            deposits.set(token, deposit.germinationDate);
          }
        }
      });
    });

    // Group deposits by time remaining
    const overHour: Array<[Token, Date]> = [];
    const underHour: Array<[Token, Date]> = [];

    deposits.forEach((date, token) => {
      const diffMs = date.getTime() - currentTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHrs > 0) {
        overHour.push([token, date]);
      } else {
        underHour.push([token, date]);
      }
    });

    return {
      overHour,
      underHour,
      allTokens: deposits,
    };
  }, [depositedBalances, currentTime]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (germinatingDeposits.allTokens.size === 0) return null;

  // Format token list for the first line
  const tokenList = Array.from(germinatingDeposits.allTokens.keys())
    .map((token) => token.name)
    .join(germinatingDeposits.allTokens.size > 2 ? "+ " : " and ");

  return (
    <div className="bg-pinto-off-green/15 border border-pinto-off-green flex flex-col w-full p-4 rounded-[1.25rem] gap-2">
      <Text variant="sm">
        Your newest Deposited {tokenList} is Germinating{" "}
        {germinatingDeposits.allTokens.size === 1 &&
          `for ${timeRemaining(Array.from(germinatingDeposits.allTokens.values())[0])}`}
      </Text>
      <Text variant="sm-light" color="light">
        {germinatingDeposits.allTokens.size === 1 ? "This" : "These"} Deposit
        {germinatingDeposits.allTokens.size === 1 ? "" : "s"} can be Converted to a different token and earn yield once
        two Seasons have elapsed.
      </Text>
      {germinatingDeposits.allTokens.size > 1 && (
        <div className="flex flex-row gap-6 items-center">
          {germinatingDeposits.overHour.length > 0 && (
            <Text variant="sm-light" className="text-pinto-off-green">
              {germinatingDeposits.overHour.map(
                ([token, date], i) => `${token.name} ${i !== germinatingDeposits.overHour.length - 1 ? " + " : ""}`,
              )}
              {`, Germinating for: ${timeRemaining(germinatingDeposits.overHour[0][1])}`}
            </Text>
          )}
          {germinatingDeposits.underHour.length > 0 && (
            <Text variant="sm-light" className="text-pinto-off-green">
              {germinatingDeposits.underHour.map(
                ([token, date], i) => `${token.name} ${i !== germinatingDeposits.underHour.length - 1 ? " + " : ""}`,
              )}
              {`, Germinating for: ${timeRemaining(germinatingDeposits.underHour[0][1])}`}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
