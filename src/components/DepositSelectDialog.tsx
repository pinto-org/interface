import { TokenValue } from "@/classes/TokenValue";
import DepositsTable from "@/components/DepositsTable";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog";
import { Separator } from "./ui/Separator";
import { ToggleGroup } from "./ui/ToggleGroup";

interface DepositSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: Token;
  farmerDeposits: TokenDepositData | undefined;
  selected: string[];
  setSelected: (value: string[]) => void;
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  mode: "send" | "combine";
  onCombine?: () => void;
}

export default function DepositSelectDialog({
  open,
  onOpenChange,
  token,
  farmerDeposits,
  selected,
  setSelected,
  setTransferData,
  mode,
  onCombine,
}: DepositSelectDialogProps) {
  const account = useAccount();

  // Function to handle deposit selection
  const handleDepositSelection = (value: string[]) => {
    setSelected(value);

    // Only update transfer data if there are selections
    if (value.length > 0 && farmerDeposits) {
      // Get all selected deposits
      const selectedDeposits = value.reduce<DepositData[]>((acc, depositStem) => {
        const deposit = farmerDeposits.deposits.find((deposit) => deposit.stem.toHuman() === depositStem);
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
          return [...prev, newTransferData];
        } else {
          return prev.map((item, index) => (index === tokenIndex ? newTransferData : item));
        }
      });
    } else {
      // Clear transfer data for this token when no deposits are selected
      setTransferData((prev) =>
        prev.filter((item) => item.token.address.toLowerCase() !== token.address.toLowerCase()),
      );
    }
  };

  const getDialogTitle = () => {
    if (!token) return "Select Deposits";
    return mode === "send" ? `Select Deposits of ${token.name} to send` : `Select Deposits of ${token.name} to combine`;
  };

  const getInfoText = () => {
    return mode === "send"
      ? "Sending any Deposits will automatically Claim the Grown Stalk associated with the Deposit."
      : "Combining Deposits will merge them into a single deposit.";
  };

  const getButtonText = () => {
    if (selected.length === 0) return "Select Deposits";
    const depositText = `${selected.length} ${token?.name || ""} Deposit${selected.length > 1 ? "s" : ""}`;
    return mode === "send" ? `Select ${depositText}` : `Combine ${depositText}`;
  };

  const isButtonDisabled = () => {
    if (mode === "combine") {
      return selected.length < 2;
    }
    return false;
  };

  // If token is not available, don't render the dialog
  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-pinto overflow-hidden w-full md:w-[56.25rem] lg:w-[82.5rem] max-w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            <span className="font-[500] text-[1.25rem] leading-[110%] w-[90%] sm:w-auto flex flex-row gap-1.5 items-center">
              {getDialogTitle()}
              {token.logoURI && <img src={token.logoURI} alt={token.name} className="w-6 h-6 hidden md:block" />}
            </span>
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <DialogDescription className="flex flex-col">
            {account.address ? (
              <>
                <div className="-mt-1.5 -mx-6">
                  {farmerDeposits ? (
                    <ToggleGroup
                      type="multiple"
                      value={selected}
                      defaultValue={farmerDeposits.deposits.map((deposit) => deposit.stem.toHuman())}
                      onValueChange={handleDepositSelection}
                      className="flex flex-col w-auto h-auto justify-between gap-2"
                    >
                      <DepositsTable token={token} selected={selected} useToggle mode={mode} />
                    </ToggleGroup>
                  ) : (
                    <div>Data error!</div>
                  )}
                </div>
                <div>
                  <Separator className="w-[120%] -ml-6 mb-4" />
                  <div className="flex flex-row justify-end lg:justify-between items-center">
                    <div className="hidden lg:flex font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-4">
                      {getInfoText()}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      {mode === "combine" && (
                        <Button
                          variant="link"
                          onClick={() => {
                            if (!farmerDeposits) return;
                            const selectableDeposits = farmerDeposits.deposits.filter((d) => !d.isGerminating);
                            const stems = selectableDeposits.map((d) => d.stem.toHuman());

                            if (selected.length === stems.length) {
                              setSelected([]);
                            } else {
                              setSelected(stems);
                            }
                          }}
                          className="h-14 text-pinto-green-4"
                        >
                          {selected.length === farmerDeposits?.deposits.filter((d) => !d.isGerminating).length
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      )}
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          disabled={isButtonDisabled()}
                          onClick={() => {
                            if (mode === "combine" && onCombine) {
                              onCombine();
                            }
                          }}
                          className="h-14 font-[400] text-[1.25rem] leading-[110%] text-black rounded-[1rem] disabled:opacity-50"
                        >
                          {getButtonText()}
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center mt-4">Connect your wallet to see your Balances</div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
