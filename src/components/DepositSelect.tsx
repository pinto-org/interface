import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { Token } from "@/utils/types";
import { Dispatch, SetStateAction, useState } from "react";
import DepositSelectDialog from "./DepositSelectDialog";
import { ChevronRightIcon } from "./Icons";
import { Button } from "./ui/Button";

export default function DepositSelect({
  setTransferData,
  token,
  size,
  disabled,
}: {
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  token: Token;
  size?: "small" | undefined;
  disabled?: boolean | undefined;
}) {
  const depositedBalances = useFarmerSiloNew().deposits;
  const farmerDeposits = depositedBalances.get(token);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const totalDeposits = farmerDeposits?.deposits.length ?? 0;

  // Determine button text based on selection state
  const getButtonText = () => {
    if (selected.length === 0 || selected.length === totalDeposits) {
      return "Select specific deposits to send";
    }
    return `Selected ${selected.length} deposit${selected.length > 1 ? "s" : ""}`;
  };

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setOpen(true)}
        className={`${disabled ? "pointer-events-none" : "pointer-events-auto"} flex-none items-center ${size === "small" ? "" : "h-8"} gap-2 border border-pinto-gray-2 drop-shadow-none rounded-full text-black text-[1rem] font-[340] leading-[1.1rem]`}
      >
        {getButtonText()}
        <ChevronRightIcon color="currentColor" height={"1rem"} width={"1rem"} />
      </Button>

      <DepositSelectDialog
        open={open}
        onOpenChange={setOpen}
        token={token}
        farmerDeposits={farmerDeposits}
        selected={selected}
        setSelected={setSelected}
        setTransferData={setTransferData}
        mode="send"
      />
    </>
  );
}
