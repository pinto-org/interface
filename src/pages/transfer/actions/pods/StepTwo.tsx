import AddressInputField from "@/components/AddressInputField";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Label } from "@/components/ui/Label";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface StepTwoProps {
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
}

export default function StepTwo({ destination, setDestination, transferNotice, setTransferNotice }: StepTwoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Send plots to</Label>
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
                customDestinationText="Pods"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
