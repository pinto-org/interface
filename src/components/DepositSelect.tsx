import { TokenValue } from "@/classes/TokenValue";
import DepositsTable from "@/components/DepositsTable";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { DepositData, Token } from "@/utils/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";
import { ChevronRightIcon } from "./Icons";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Separator } from "./ui/Separator";
import { ToggleGroup } from "./ui/ToggleGroup";

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
  const account = useAccount();
  const depositedBalances = useFarmerDepositedBalances();
  const farmerDeposits = depositedBalances.data.get(token);

  const [selected, setSelected] = useState<string[]>([]);

  const totalDeposits = farmerDeposits?.deposits.length ?? 0;

  // Determine button text based on selection state
  const getButtonText = () => {
    if (selected.length === 0 || selected.length === totalDeposits) {
      return "Select specific deposits to send";
    }
    return `Selected ${selected.length} deposit${selected.length > 1 ? "s" : ""}`;
  };

  // Function to handle deposit selection
  const handleDepositSelection = (value: string[]) => {
    if (value.length === 0) return;
    setSelected(value);

    // Get all selected deposits
    const selectedDeposits = value.reduce<DepositData[]>((acc, depositStem) => {
      const deposit = farmerDeposits?.deposits.find((deposit) => deposit.stem.toHuman() === depositStem);
      if (deposit) {
        acc.push(deposit);
      }
      return acc;
    }, []);

    // Calculate total amount from selected deposits
    const totalAmount = selectedDeposits.reduce((sum, deposit) => deposit.amount.add(sum), TokenValue.ZERO).toHuman();

    // Create the DepositTransferData object for this token
    const newTransferData: DepositTransferData = {
      token: token,
      amount: totalAmount,
      deposits: selectedDeposits,
    };

    // Update transfer data while preserving other tokens
    setTransferData((prev) => {
      const tokenIndex = prev.findIndex((item) => item.token.address.toLowerCase() === token.address.toLowerCase());

      if (tokenIndex === -1) {
        // Token not found, add it to the array
        return [...prev, newTransferData];
      } else {
        // Token found, update its data
        return prev.map((item, index) => (index === tokenIndex ? newTransferData : item));
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`${disabled ? "pointer-events-none" : "pointer-events-auto"} flex-none items-center ${size === "small" ? "" : "h-8"} gap-2 border border-pinto-gray-2 drop-shadow-none rounded-full text-black text-[1rem] font-[340] leading-[1.1rem]`}
        >
          {getButtonText()}
          <ChevronRightIcon color="currentColor" height={16} width={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip w-[1325px] max-w-[1325px]">
        <DialogHeader>
          <DialogTitle>
            <span className="font-[500] text-[1.25rem] leading-[110%] flex flex-row gap-1.5 items-center">
              Select Deposits of <img src={token.logoURI} alt={token.name} className="w-6 h-6" /> {token.name} to send
            </span>
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <DialogDescription className="flex flex-col">
            {account.address ? (
              <div className="-mt-1.5 -mx-6">
                {farmerDeposits ? (
                  <ToggleGroup
                    type="multiple"
                    value={selected}
                    defaultValue={farmerDeposits.deposits.map((deposit) => deposit.stem.toHuman())}
                    onValueChange={handleDepositSelection}
                    className="flex flex-col w-auto h-auto justify-between gap-2"
                  >
                    <DepositsTable token={token} selected={selected} useToggle />
                  </ToggleGroup>
                ) : (
                  <div>Data error!</div>
                )}
                <Separator className="w-[120%] -ml-6 mb-4" />
                <div className="flex flex-row justify-between items-center mx-4 -mb-2">
                  <div className="font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-4">
                    Sending any Deposits will automatically Claim the Grown Stalk associated with the Deposit.
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      className="h-14 px-4 font-[400] text-[1.25rem] leading-[110%] text-black rounded-[1rem]"
                    >{`${selected.length === 0 ? "Select Deposits" : `Select ${selected.length} ${token.name} Deposit${selected.length > 1 ? "s" : ""}`}`}</Button>
                  </DialogClose>
                </div>
              </div>
            ) : (
              "Connect your wallet to see your Balances"
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
