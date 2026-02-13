import BinanceLogo from "@/assets/misc/binance-logo.svg";
import CoinbaseLogo from "@/assets/misc/coinbase-logo.svg";
import KrakenLogo from "@/assets/misc/kraken-logo.svg";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import Warning from "./ui/Warning";

interface PintoAssetTransferNotice {
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
  variant?: "farmBalance" | "walletBalance";
  customDestinationText?: string;
}

export default function PintoAssetTransferNotice({
  transferNotice,
  setTransferNotice,
  variant = "farmBalance",
  customDestinationText = "tokens to another address’s Farm Wallet",
}: PintoAssetTransferNotice) {
  return (
    <Warning variant="caution" className="mt-2 text-yellow-900" showIcon={false}>
      <AnimatePresence mode="wait">
        {variant === "farmBalance" ? (
          <motion.div
            key="farmBalance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-8"
          >
            <p className="text-2xl">
              Important: When sending <span>{customDestinationText}</span>, make sure the recipient is an individual
              party, not a smart contract or an exchange company (e.g.{" "}
              <span className="inline-flex whitespace-nowrap items-baseline">
                <img src={CoinbaseLogo} alt="Coinbase" className="inline h-5 w-5 pt-0.5 mx-1" />
                <span>Coinbase</span>
              </span>
              ,{" "}
              <span className="inline-flex whitespace-nowrap items-baseline">
                <img src={BinanceLogo} alt="Binance" className="inline h-5 w-5 pt-0.5 mx-1" />
                Binance
              </span>
              ,{" "}
              <span className="inline-flex whitespace-nowrap items-baseline">
                <img src={KrakenLogo} alt="Kraken" className="inline h-5 w-5 pt-0.5 mx-1" />
                Kraken
              </span>
              , etc). Assets sent may not be recovered.
            </p>
            <div className="flex flex-row gap-3 items-center">
              <Checkbox
                id="farm-balance-notice"
                className="bg-white text-pinto-green-4"
                checked={transferNotice}
                onCheckedChange={(checked) => {
                  if (checked !== "indeterminate") {
                    setTransferNotice(checked);
                  } else {
                    setTransferNotice(false);
                  }
                }}
              />
              <Label htmlFor="farm-balance-notice" className="text-sm font-medium cursor-pointer text-yellow-900">
                I acknowledge that the recipient is an individual party
              </Label>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="walletBalance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-8"
          >
            <p className="text-2xl">Note: be sure recipient address is intended.</p>
            <div className="flex flex-row gap-3 items-center">
              <Checkbox
                id="wallet-balance-notice"
                className="bg-white text-pinto-green-4"
                checked={transferNotice}
                onCheckedChange={(checked) => {
                  if (checked !== "indeterminate") {
                    setTransferNotice(checked);
                  } else {
                    setTransferNotice(false);
                  }
                }}
              />
              <Label htmlFor="wallet-balance-notice" className="text-sm font-medium cursor-pointer text-yellow-900">
                I acknowledge the recipient address is correct
              </Label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Warning>
  );
}
