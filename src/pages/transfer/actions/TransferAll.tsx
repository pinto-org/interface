import FlowForm from "@/components/FormFlow";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./all/FinalStep";
import StepOne from "./all/StepOne";

export default function TransferAll() {
  const account = useAccount();
  const chainId = useChainId();

  const [step, setStep] = useState(1);

  const stepDescription = step === 1 ? "Send everything, specify address" : "Confirm send";

  const [destination, setDestination] = useState<string | undefined>();

  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  const farmerSilo = useFarmerSiloNew();
  const farmerField = useFarmerField();
  const farmerDeposits = farmerSilo.deposits;
  const depositsToSend = [...farmerDeposits].map(([token, deposit]) => ({ token, deposit }));

  const hasPlots = farmerField.plots.length > 0;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      for (const queryKey of farmerSilo.queryKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
      farmerBalances.refetch();
      farmerField.refetch();
      navigate("/transfer");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  function onSubmit() {
    try {
      setSubmitting(true);
      toast.loading("Transferring...");

      if (!account.address || !destination) return;
      const farmData: `0x${string}`[] = [];

      // Farm Balance Transfers
      for (const balanceData of balancesToSend) {
        if (balanceData.balance.internal.eq(0)) continue;
        const balanceTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferToken",
          args: [
            balanceData.token.address,
            destination as Address,
            balanceData.balance.internal.toBigInt(),
            Number(FarmFromMode.INTERNAL),
            Number(FarmToMode.INTERNAL),
          ],
        });
        farmData.push(balanceTransferCall);
      }

      // Deposit Transfers
      for (const depositData of depositsToSend) {
        if (depositData.deposit.amount.eq(0)) continue;
        const stems = depositData.deposit.deposits.map((crate) => crate.stem.toBigInt());
        const amounts = depositData.deposit.deposits.map((crate) => crate.amount.toBigInt());
        const depositTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferDeposits",
          args: [account.address, destination as Address, depositData.token.address, stems, amounts],
        });
        farmData.push(depositTransferCall);
      }

      // Plot Transfers
      if (hasPlots) {
        // todo: add support for more than one plot line
        const fieldId = BigInt(0);
        const ids: bigint[] = [];
        const starts: bigint[] = [];
        const ends: bigint[] = [];
        for (const plotData of farmerField.plots) {
          ids.push(plotData.index.toBigInt());
          starts.push(BigInt(0));
          ends.push(plotData.pods.toBigInt());
        }
        const plotTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferPlots",
          args: [
            account.address,
            destination as Address,
            fieldId,
            ids, //plot ids
            starts, // starts
            ends, // ends
          ],
        });
        farmData.push(plotTransferCall);
      }

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Transfer failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={2}
      enableNextStep={!!destination}
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne destination={destination} setDestination={setDestination} />
      ) : (
        <FinalStep destination={destination} />
      )}
    </FlowForm>
  );
}
