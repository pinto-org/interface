import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Label } from "@/components/ui/Label";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface StepOneProps {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
}

const variants = {
  hidden: {
    opacity: 0,
    transition: { opacity: { duration: 0.2 } },
  },
  visible: {
    opacity: 1,
    transition: { opacity: { duration: 0.2 } },
  },
  exit: {
    opacity: 0,
    transition: { opacity: { duration: 0.2 } },
  },
};

export default function StepOne({
  amount,
  setAmount,
  destination,
  setDestination,
  transferNotice,
  setTransferNotice,
}: StepOneProps) {
  const repayment = useFarmerBeanstalkRepayment();
  const maxAmount = repayment.silo.balance;

  return (
    <motion.div className="flex flex-col gap-6">
      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-2">
        <Label>Amount of urBDV to send</Label>
        <ComboInputField
          amount={amount}
          setAmount={setAmount}
          customMaxAmount={maxAmount}
          tokenNameOverride="urBDV"
          disableButton
          showAdditionalInfo={false}
          hideUsdValue
        />
      </motion.div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-2">
        <Label>Send tokens to</Label>
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
                variant="walletBalance"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
