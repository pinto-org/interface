import { TokenValue } from "@/classes/TokenValue";
import DepositsTable from "@/components/DepositsTable";
import { createSmartGroups } from "@/lib/claim/depositUtils";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { tokensEqual } from "@/utils/token";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";
import { DepositGroup } from "./CombineSelect";
import { CloseIcon, PlusIcon } from "./Icons";
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
  groups?: DepositGroup[];
  setGroups?: (groups: DepositGroup[]) => void;
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
  groups,
  setGroups,
}: DepositSelectDialogProps) {
  const account = useAccount();
  const [activeGroupId, setActiveGroupId] = useState<number>(1);

  const addNewGroup = () => {
    if (!setGroups || !groups) return;
    const newId = Math.max(...groups.map((g) => g.id), 0) + 1;
    setGroups([...groups, { id: newId, deposits: [] }]);
    setActiveGroupId(newId);
  };

  const removeGroup = (groupId: number) => {
    if (!setGroups || !groups) return;

    // Remove the group
    const filteredGroups = groups.filter((g) => g.id !== groupId);

    // Reassign sequential IDs starting from 1
    const reorderedGroups = filteredGroups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));

    setGroups(reorderedGroups);

    // Update active group ID
    if (activeGroupId === groupId) {
      setActiveGroupId(reorderedGroups[0]?.id || 1);
    } else if (activeGroupId > groupId) {
      // If we were looking at a group after the deleted one, update its ID
      setActiveGroupId(activeGroupId - 1);
    }
  };

  // Unified deposit selection handler
  const handleDepositSelection = (value: string[]) => {
    if (mode === "combine") {
      if (!setGroups || !groups) return;
      setGroups(groups.map((group) => (group.id === activeGroupId ? { ...group, deposits: value } : group)));
    } else {
      // Handle transfer mode
      setSelected(value);

      // Only update transfer data if there are selections
      if (value.length > 0 && farmerDeposits) {
        const selectedDeposits = value.reduce<DepositData[]>((acc, depositStem) => {
          const deposit = farmerDeposits.deposits.find((deposit) => deposit.stem.toHuman() === depositStem);
          if (deposit) {
            acc.push(deposit);
          }
          return acc;
        }, []);

        const totalAmount = selectedDeposits
          .reduce((sum, deposit) => deposit.amount.add(sum), TokenValue.ZERO)
          .toHuman();

        const newTransferData: DepositTransferData = {
          token: token,
          amount: totalAmount,
          deposits: selectedDeposits,
        };

        setTransferData((prev) => {
          const tokenIndex = prev.findIndex((item) => tokensEqual(item.token, token));
          if (tokenIndex === -1) {
            return [...prev, newTransferData];
          } else {
            return prev.map((item, index) => (index === tokenIndex ? newTransferData : item));
          }
        });
      } else {
        setTransferData((prev) => prev.filter((item) => !tokensEqual(item.token, token)));
      }
    }
  };

  const handleSmartGroup = () => {
    if (!setGroups || !farmerDeposits) return;
    const newGroups = createSmartGroups(farmerDeposits.deposits);
    setGroups(newGroups);
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

  const getOtherGroupsDeposits = (currentGroupId: number) => {
    if (!groups) return [];
    return groups.filter((g) => g.id !== currentGroupId).flatMap((g) => g.deposits);
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
                {mode === "combine" && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {groups?.map((group) => (
                      <div key={group.id} className="flex items-center mb-2">
                        <Button
                          variant={activeGroupId === group.id ? "default" : "outline"}
                          onClick={() => setActiveGroupId(group.id)}
                          className="mr-1"
                        >
                          Group {group.id} ({group.deposits.length})
                        </Button>
                        {groups.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGroup(group.id)}
                            className="h-8 w-8 p-0 flex items-center justify-center"
                          >
                            <CloseIcon width="1rem" height="1rem" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addNewGroup} className="p-2 mb-2">
                      <PlusIcon width="1rem" height="1rem" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSmartGroup}
                      className="px-3 py-2 mb-2"
                      title="Smart Group deposits by similar Stalk/PDV"
                    >
                      Smart Group
                    </Button>
                  </div>
                )}

                <div className="-mt-1.5 -mx-6">
                  {farmerDeposits ? (
                    <ToggleGroup
                      type="multiple"
                      value={
                        mode === "combine" ? groups?.find((g) => g.id === activeGroupId)?.deposits || [] : selected
                      }
                      onValueChange={handleDepositSelection}
                      className="flex flex-col w-auto h-auto justify-between gap-2"
                    >
                      <DepositsTable
                        token={token}
                        selected={
                          mode === "combine" ? groups?.find((g) => g.id === activeGroupId)?.deposits || [] : selected
                        }
                        useToggle
                        mode={mode}
                        disabledDeposits={mode === "combine" ? getOtherGroupsDeposits(activeGroupId) : undefined}
                        groups={mode === "combine" ? groups : undefined}
                      />
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
                              handleDepositSelection([]);
                            } else {
                              setSelected(stems);
                              handleDepositSelection(stems);
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
