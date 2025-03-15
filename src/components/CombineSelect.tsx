import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useInvalidateSun } from "@/state/useSunData";
import { calculateConvertData } from "@/utils/convert";
import { DepositData, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";
import DepositSelectDialog from "./DepositSelectDialog";
import { LeftArrowIcon } from "./Icons";
import { Button } from "./ui/Button";

interface CombineSelectProps {
  setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
  token: Token;
  size?: "small";
  disabled?: boolean;
}

export default function CombineSelect({ setTransferData, token, size, disabled }: CombineSelectProps) {
  const protocolAddress = useProtocolAddress();
  const depositedBalances = useFarmerSilo().deposits;
  const farmerDeposits = depositedBalances.get(token);
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
    if (!selected.length || !farmerDeposits) return;
    setSubmitting(true);

    try {
      // Get selected deposits
      const selectedDepositData = selected
        .map((stem) => farmerDeposits.deposits.find((d) => d.stem.toHuman() === stem))
        .filter(Boolean);

      // Calculate total amount
      const totalAmount = selectedDepositData.reduce((sum, deposit) => {
        if (!deposit) return sum;
        return deposit.amount.add(sum);
      }, TokenValue.ZERO);

      // using the same from and to token does an L2L
      const convertData = calculateConvertData(token, token, totalAmount, totalAmount);

      if (!convertData) {
        toast.error("Failed to prepare combine data");
        return;
      }

      const stems = selectedDepositData.filter((d): d is DepositData => d !== undefined).map((d) => d.stem.toBigInt());

      const amounts = selectedDepositData
        .filter((d): d is DepositData => d !== undefined)
        .map((d) => d.amount.toBigInt());

      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "convert",
        args: [convertData, stems, amounts],
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [selected, farmerDeposits, token, protocolAddress, writeWithEstimateGas, setSubmitting]);

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
        selected={selected}
        setSelected={setSelected}
        setTransferData={setTransferData}
        mode="combine"
        onCombine={handleCombine}
      />
    </>
  );
}
