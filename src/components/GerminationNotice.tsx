import depositIcon from "@/assets/protocol/Deposit.svg";
import { truncateHex } from "@/utils/format";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { timeRemaining } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";
import IconImage from "./ui/IconImage";
import Text from "./ui/Text";

type GerminationNoticeProps =
  | { type: "single"; deposit: DepositData }
  | { type: "multiple"; deposits: Map<Token, TokenDepositData> };

interface DepositTimerProps {
  token: Token;
  date: Date;
  key?: string;
}

function DepositTimer({ token, date }: DepositTimerProps) {
  return (
    <Text variant="sm-light" className="text-pinto-off-green inline-flex items-center gap-1">
      <IconImage src={depositIcon} size={6} />
      <IconImage src={token.logoURI} size={4} />
      {`${token.name} Deposit: ${timeRemaining(date)}`}
    </Text>
  );
}

export default function GerminationNotice(props: GerminationNoticeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  // Find currently germinating deposits
  const germinatingDeposits = useMemo(() => {
    if (props.type === "single") {
      if (!props.deposit.isGerminating || !props.deposit.germinationDate) {
        return {
          overHour: [],
          underHour: [],
          allTokens: new Map(),
          plantedDeposits: [],
        };
      }

      const diffMs = props.deposit.germinationDate.getTime() - currentTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const depositWithTime: [Token, Date] = [props.deposit.token, props.deposit.germinationDate];

      return {
        overHour: diffHrs > 0 ? [depositWithTime] : [],
        underHour: diffHrs <= 0 ? [depositWithTime] : [],
        allTokens: new Map([[props.deposit.token, props.deposit.germinationDate]]),
        plantedDeposits: props.deposit.isPlantDeposit ? [props.deposit] : [],
      };
    }

    const deposits = new Map<Token, Date>();
    const plantedDeposits: DepositData[] = [];
    props.deposits.forEach((tokenData, token) => {
      tokenData.deposits.forEach((deposit) => {
        if (deposit.isGerminating && deposit.germinationDate) {
          if (deposit.isPlantDeposit) {
            plantedDeposits.push(deposit);
          }
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
      plantedDeposits,
    };
  }, [props, currentTime]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format token list for the first line
  const tokenList = Array.from(germinatingDeposits.allTokens.keys())
    .map((token) => token.name)
    .join(germinatingDeposits.allTokens.size > 2 ? "+ " : " and ");

  const plural = Array.from(germinatingDeposits.allTokens.keys()).length > 1;
  const hasPlanted =
    props.type === "single" ? props.deposit.isPlantDeposit : germinatingDeposits.plantedDeposits.length > 0;
  const hasOnlyPlanted =
    props.type === "single"
      ? props.deposit.isPlantDeposit
      : germinatingDeposits.plantedDeposits.length === props.deposits.size;

  return (
    <div className="bg-pinto-off-green/15 border border-pinto-off-green flex flex-col w-full p-4 rounded-[1rem] gap-2">
      {props.type === "multiple" && (
        <Text variant="body" weight="regular">
          New {tokenList} Deposit{plural ? "s are" : " is"} Germinating
          {/* {germinatingDeposits.allTokens.size === 1 &&
            `   for ${timeRemaining(Array.from(germinatingDeposits.allTokens.values())[0])}`} */}
        </Text>
      )}
      {props.type === "single" && (
        <Text variant="body" color="primary" className="font-semibold">
          Deposit {truncateHex(props.deposit.idHex)} is Germinating
          {germinatingDeposits.allTokens.size === 1 &&
            `   for ${timeRemaining(Array.from(germinatingDeposits.allTokens.values())[0])}`}
        </Text>
      )}
      <Text variant="sm" color="light" weight="medium" className="leading-2">
        {!hasPlanted
          ? `${plural ? "These Deposits" : "This Deposit"} can be Converted to a different token and earn yield once two seasons have elapsed.`
          : !hasOnlyPlanted
            ? `These Deposits can be Converted to a different token and earn yield once two seasons have elapsed. Recently claimed Pinto yield can earn additional yield immediately.`
            : `Your recently claimed Pinto yield, Deposit ${truncateHex(props.type === "single" ? props.deposit.idHex : germinatingDeposits.plantedDeposits[0].idHex)}, can be Converted to a different token in two Seasons. Stalk associated with this Deposit can earn additional yield immediately.`}
      </Text>
      {props.type === "single"
        ? germinatingDeposits.allTokens.size > 0 && (
            <DepositTimer
              token={Array.from(germinatingDeposits.allTokens.keys())[0]}
              date={Array.from(germinatingDeposits.allTokens.values())[0]}
            />
          )
        : germinatingDeposits.allTokens.size > 0 && (
            <div className="flex flex-row gap-6 items-center">
              {germinatingDeposits.overHour.map(([token, date], i) => (
                <DepositTimer key={`germinationNoticeOver_${i}`} token={token} date={date} />
              ))}
              {germinatingDeposits.underHour.map(([token, date], i) => (
                <DepositTimer key={`germinationNoticeUnder_${i}`} token={token} date={date} />
              ))}
            </div>
          )}
    </div>
  );
}
