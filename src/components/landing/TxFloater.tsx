import podIcon from "@/assets/protocol/Pod.png";
import pintoLogo from "@/assets/tokens/PINTO.png";
import pintoUsdcLogo from "@/assets/tokens/PINTO_USDC.png";
import pintoCbbtcLogo from "@/assets/tokens/PINTO_cbBTC.png";
import pintoCbethLogo from "@/assets/tokens/PINTO_cbETH.png";
import { breakpoints } from "@/utils/theme/breakpoints";
import { MotionValue, motion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const TxTypeIcons: Record<string, string> = {
  deposit: "DoubleCaret_Landing.svg", // Deposit transaction type icon
  withdraw: "ReverseDoubleCaret_Landing.svg", // Withdraw transaction type icon
  sow: "DoubleCaret_Landing.svg", // Sow transaction type icon
  harvest: "ReverseDoubleCaret_Landing.svg", // Harvest transaction type icon
  convertUp: "SpinningArrows_Landing.svg", // Convert transaction type icon
  convertDown: "SpinningArrows_Landing.svg", // Convert transaction type icon
  yield: "Cross_Landing.svg", // Yield transaction type icon
  flood: "ReverseDoubleCaret_Landing.svg", // Flood transaction type icon
  buy: "DoubleCaret_Landing.svg", // Buy transaction type icon
  sell: "ReverseDoubleCaret_Landing.svg", // Sell transaction type icon
};

const TxIcons: Record<string, string> = {
  deposit: pintoLogo,
  withdraw: pintoLogo,
  sow: podIcon,
  harvest: podIcon,
  convertUp: pintoLogo, // Will be overridden by getConvertIcon
  convertDown: pintoLogo, // Will be overridden by getConvertIcon
  yield: pintoLogo,
  flood: pintoLogo,
  buy: pintoLogo,
  sell: pintoLogo,
};

// Function to get icon for transaction, with random convert logos
const getTransactionIcon = (txType: string): string => {
  if (txType === "convertUp" || txType === "convertDown") {
    // Pick a random convert logo
    const randomIndex = Math.floor(Math.random() * convertLogos.length);
    return convertLogos[randomIndex];
  }

  return TxIcons[txType] || pintoLogo;
};

const TxActionLabels: Record<string, string> = {
  deposit: "Deposited",
  withdraw: "Withdrew",
  sow: "Lent",
  harvest: "Harvested",
  convertUp: "Converted Up",
  convertDown: "Converted Down",
  yield: "Mint",
  flood: "Flood",
  buy: "Bought",
  sell: "Sold",
};

const convertLogos = [pintoUsdcLogo, pintoCbbtcLogo, pintoCbethLogo];

export default function TxFloater({
  from,
  txType,
  viewportWidth,
  id,
  positionAbove,
  scale,
}: {
  from: string | undefined;
  txType: string | null;
  viewportWidth: number;
  id?: string;
  positionAbove?: boolean; // Whether the pill is positioned above the value target
  scale: MotionValue<number>; // Scale animation from parent
}) {
  const lastValidFromRef = useRef<string | undefined>(undefined);
  const lastValidTxTypeRef = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  // Effect for data changes (simplified without animation logic)
  useEffect(() => {
    // Only update if we have valid data
    if (!from || !txType) {
      return;
    }

    // Skip on first mount to set initial values
    if (!hasInitialized.current) {
      lastValidFromRef.current = from;
      lastValidTxTypeRef.current = txType;
      hasInitialized.current = true;
      return;
    }

    // Update refs when data changes
    lastValidFromRef.current = from;
    lastValidTxTypeRef.current = txType;
  }, [from, txType]);

  const currentTxType = txType || lastValidTxTypeRef.current;
  const actionLabel = currentTxType ? TxActionLabels[currentTxType] : undefined;

  const scaleTransform = useTransform(scale, (s) => `scale(${s})`);

  return (
    <motion.div className="z-10 relative" id={id} style={{ transform: scaleTransform }}>
      <div
        key="label"
        className="absolute text-pinto-gray-6 text-base text-[18px] font-normal opacity-90 whitespace-nowrap w-full flex justify-center items-center"
        style={{
          top: positionAbove
            ? viewportWidth >= breakpoints.sm && viewportWidth < breakpoints["3xl"]
              ? "-18px"
              : "-24px"
            : viewportWidth >= breakpoints.sm && viewportWidth < breakpoints["3xl"]
              ? "40px"
              : "50px", // When pill is above $1 target, text goes above; when pill is below $1 target, text goes below
        }}
      >
        {actionLabel}
      </div>
      <div className="flex items-center justify-center bg-white border border-pinto-green-4 rounded-full p-2 gap-2 w-fit transition-all duration-200">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img className="w-full h-full object-cover" src={from || lastValidFromRef.current} alt="Farmer Icon" />
        </div>
        <img
          alt={lastValidTxTypeRef.current || "Transaction Type Icon"}
          src={currentTxType ? TxTypeIcons[currentTxType] : undefined}
          className="w-4 h-4"
        />
        <img
          alt={lastValidTxTypeRef.current || "Transaction Icon"}
          src={currentTxType ? getTransactionIcon(currentTxType) : undefined}
          className={`w-8 h-8`}
        />
      </div>
    </motion.div>
  );
}
