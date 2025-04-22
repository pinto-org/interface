import depositIcon from "@/assets/protocol/Deposit.svg";
import { truncateHex } from "@/utils/format";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { timeRemaining } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";
import { CloseIcon } from "./Icons";
import { Button } from "./ui/Button";
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
    <div className="pinto-xs font-light sm:pinto-sm-light text-pinto-off-green sm:text-pinto-off-green sm:font-light inline-flex items-center gap-1">
      <IconImage src={depositIcon} size={6} />
      <IconImage src={token.logoURI} size={4} />
      {`${token.name} Deposit: ${timeRemaining(date)}`}
    </div>
  );
}

export default function GerminationNotice(props: GerminationNoticeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pinto.showGerminationNotice");
    if (!dismissed) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("pinto.showGerminationNotice", "false");
    setShow(false);
  };

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
    let hasNormalDeposits = false;
    const hasPlantedDeposits = false;
    const tokenDepositTypes = new Map<
      Token,
      {
        hasPlanted: boolean;
        hasNormal: boolean;
      }
    >();

    props.deposits.forEach((tokenData, token) => {
      tokenData.deposits.forEach((deposit) => {
        if (deposit.isGerminating && deposit.germinationDate) {
          // Track deposit types for this token
          const currentTypes = tokenDepositTypes.get(token) || {
            hasPlanted: false,
            hasNormal: false,
          };
          if (deposit.isPlantDeposit) {
            // plantedDeposits.push(deposit);
            // currentTypes.hasPlanted = true;
            // hasPlantedDeposits = true;
            return;
          } else {
            currentTypes.hasNormal = true;
            hasNormalDeposits = true;
          }
          tokenDepositTypes.set(token, currentTypes);

          // Update latest germination date
          const existingDate = deposits.get(token);
          if (!existingDate || existingDate.getTime() < deposit.germinationDate.getTime()) {
            deposits.set(token, deposit.germinationDate);
          }
        }
      });
    });

    // Determine mode based on deposit types
    let mode = "normal";
    if (hasPlantedDeposits && !hasNormalDeposits) {
      mode = "planted";
    } else if (hasPlantedDeposits && hasNormalDeposits) {
      mode = "mixed";
    }

    // Group deposits by time remaining, excluding tokens that only have planted deposits
    const overHour: Array<[Token, Date]> = [];
    const underHour: Array<[Token, Date]> = [];

    deposits.forEach((date, token) => {
      const types = tokenDepositTypes.get(token);
      // Skip tokens that only have planted deposits
      if (types?.hasPlanted && !types.hasNormal) return;

      const diffMs = date.getTime() - currentTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHrs > 0) {
        overHour.push([token, date]);
      } else {
        underHour.push([token, date]);
      }
    });

    return {
      mode,
      overHour,
      underHour,
      allTokens: deposits,
      plantedDeposits,
    };
  }, [props, currentTime]);

  // ... time interval effect stays the same ...

  if (germinatingDeposits.allTokens.size === 0) return null;

  // Format token list for the first line
  const tokenList = Array.from(germinatingDeposits.allTokens.keys())
    .map((token) => token.name)
    .join(germinatingDeposits.allTokens.size > 2 ? " + " : " and ");

  const plural = Array.from(germinatingDeposits.allTokens.keys()).length > 1;

  return (
    <div
      className={`bg-pinto-off-green-bg border border-pinto-off-green flex flex-col z-10 p-3 sm:p-4 rounded-[1rem] gap-1 sm:gap-2 w-[92.5%] sm:w-full fixed sm:relative transition-all ${show ? "top-[120px]" : "-top-[200px]"}  sm:top-0 `}
    >
      <div className="flex flex-row justify-between items-center">
        {props.type === "single" ? (
          <div className="pinto-xs font-light sm:font-semibold sm:pinto-body text-pinto-primary">
            Deposit {truncateHex(props.deposit.idHex)} is Germinating
            {germinatingDeposits.allTokens.size === 1 &&
              `   for ${timeRemaining(Array.from(germinatingDeposits.allTokens.values())[0])}`}
          </div>
        ) : (
          <div className="pinto-xs font-light sm:pinto-body sm:font-regular">
            New {tokenList} Deposit{plural ? "s are" : " is"} Germinating
          </div>
        )}
        <Button
          variant="ghost"
          rounded="full"
          className="h-4 w-4 p-0 cursor-pointer hover:bg-transparent sm:hidden"
          onClick={handleDismiss}
        >
          <CloseIcon color="currentColor" width={"0.875rem"} height={"0.875rem"} />
        </Button>
      </div>

      {props.type === "single" ? (
        <div className="pinto-xs font-light sm:pinto-sm sm:font-medium text-pinto-light sm:text-pinto-light leading-2">
          {props.deposit.isPlantDeposit
            ? `Your recently claimed Pinto yield, Deposit ${truncateHex(props.deposit.idHex)}, can be Converted to a different token in two Seasons. Stalk associated with this Deposit can earn additional yield immediately.`
            : "This Deposit can be Converted to a different token and earn yield once two seasons have elapsed."}
        </div>
      ) : (
        <div className="pinto-xs font-light sm:pinto-sm sm:font-medium text-pinto-light sm:text-pinto-light leading-2">
          {germinatingDeposits.mode === "normal" &&
            `${plural ? "These Deposits" : "This Deposit"} can be Converted to a different token and earn yield once two seasons have elapsed.`}
          {germinatingDeposits.mode === "planted" &&
            `Your recently claimed Pinto yield, Deposit ${truncateHex(germinatingDeposits.plantedDeposits[germinatingDeposits.plantedDeposits.length - 1].idHex)}, can be Converted to a different token in two Seasons. Stalk associated with this Deposit can earn additional yield immediately.`}
          {germinatingDeposits.mode === "mixed" &&
            "These Deposits can be Converted to a different token and earn yield once two seasons have elapsed. Recently claimed Pinto yield can earn additional yield immediately."}
        </div>
      )}

      {props.type === "single"
        ? germinatingDeposits.allTokens.size > 0 && (
            <DepositTimer
              token={Array.from(germinatingDeposits.allTokens.keys())[0]}
              date={Array.from(germinatingDeposits.allTokens.values())[0]}
            />
          )
        : (germinatingDeposits.mode === "normal" || germinatingDeposits.mode === "mixed") &&
          (germinatingDeposits.overHour.length > 0 || germinatingDeposits.underHour.length > 0) && (
            <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-3">
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
