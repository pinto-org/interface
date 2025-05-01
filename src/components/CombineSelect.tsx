import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { encodeGroupCombineCalls } from "@/lib/claim/depositUtils";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useInvalidateSun } from "@/state/useSunData";
import { Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";
import DepositSelectDialog from "./DepositSelectDialog";
import { LeftArrowIcon } from "./Icons";
import { Button } from "./ui/Button";

export interface DepositGroup {
  id: number;
  deposits: string[];
}

interface CombineSelectProps {
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  token: Token;
  disabled?: boolean;
}

export default function CombineSelect({ setTransferData, token, disabled }: CombineSelectProps) {
  const protocolAddress = useProtocolAddress();
  const depositedBalances = useFarmerSilo();
  const farmerDeposits = depositedBalances.deposits.get(token);
  const [groups, setGroups] = useState<DepositGroup[]>([{ id: 1, deposits: [] }]);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const invalidateSun = useInvalidateSun();
  const qc = useQueryClient();

  const farmerSilo = useFarmerSilo();
  const farmerBalances = useFarmerBalances();
  const { queryKeys: priceQueryKeys } = usePriceData();

  const handleSuccess = useCallback(() => {
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => qc.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
  }, [farmerSilo.queryKeys, farmerBalances.queryKeys, priceQueryKeys, qc, invalidateSun]);

  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Combine successful",
    errorMessage: "Combine failed",
    successCallback: handleSuccess,
  });

  const handleCombine = useCallback(async () => {
    if (!farmerDeposits || !groups.length || !groups[0]?.deposits?.length) return;

    const validGroups = groups.filter((group) => group.deposits.length > 1);
    if (validGroups.length === 0) return;

    try {
      setSubmitting(true);
      toast.loading("Combining deposits...");

      const encodedCalls = encodeGroupCombineCalls(validGroups, token, farmerDeposits.deposits);

      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "farm",
        args: [encodedCalls],
      });

      setOpen(false);
    } catch (e) {
      console.error("Combine deposits failed", e);
      toast.dismiss();
      toast.error("Combine failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [farmerDeposits, groups, token, protocolAddress, writeWithEstimateGas, setSubmitting]);

  return (
    <>
      <Button className="w-full" variant="silo-action" disabled={disabled || submitting} onClick={() => setOpen(true)}>
        <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
          <span className="self-center items-center">
            <LeftArrowIcon color={"white"} height={"1rem"} width={"1rem"} />
          </span>
        </div>
        Combine Deposits
      </Button>

      <DepositSelectDialog
        open={open}
        onOpenChange={setOpen}
        token={token}
        farmerDeposits={farmerDeposits}
        selected={groups.flatMap((g) => g.deposits)}
        setSelected={() => {}}
        setTransferData={setTransferData}
        mode="combine"
        onCombine={handleCombine}
        groups={groups}
        setGroups={setGroups}
      />
    </>
  );
}
