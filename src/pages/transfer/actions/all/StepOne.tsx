import AddressInputField from "@/components/AddressInputField";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Label } from "@/components/ui/Label";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface StepOneProps {
  destination?: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
}

export default function StepOne({ destination, setDestination, transferNotice, setTransferNotice }: StepOneProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Send to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
        <AnimatePresence>
          {destination && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PintoAssetTransferNotice
                transferNotice={transferNotice}
                setTransferNotice={setTransferNotice}
                customDestinationText="Farm Wallet assets, Deposits, and/or Pods"
              />
            </motion.div>
          )}
        </AnimatePresence>{" "}
      </div>
    </div>
  );
}
