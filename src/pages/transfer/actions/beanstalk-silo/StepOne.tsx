import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import { Label } from "@/components/ui/Label";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { FarmToMode } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface StepOneProps {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  balanceTo: FarmToMode | undefined;
  setBalanceTo: Dispatch<SetStateAction<FarmToMode | undefined>>;
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
  balanceTo,
  setBalanceTo,
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
                variant={balanceTo === FarmToMode.EXTERNAL ? "walletBalance" : "farmBalance"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={variants} initial="hidden" animate="visible" className="flex flex-col gap-4 items-start">
        <Label>I want to send these tokens to the recipient's:</Label>
        <DestinationBalanceSelect balanceTo={balanceTo} setBalanceTo={setBalanceTo} variant="transferFlow" />
      </motion.div>
    </motion.div>
  );
}
