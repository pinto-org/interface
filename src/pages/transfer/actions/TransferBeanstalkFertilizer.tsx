import FlowForm from "@/components/FormFlow";
import { BARN_PAYBACK_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./beanstalk-fertilizer/FinalStep";
import StepOne from "./beanstalk-fertilizer/StepOne";

export interface FertilizerTransferItem {
  id: bigint;
  value: bigint;
}

export default function TransferBeanstalkFertilizer() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [selectedIds, setSelectedIds] = useState<FertilizerTransferItem[]>([]);
  const [transferNotice, setTransferNotice] = useState<boolean>(false);

  const repayment = useFarmerBeanstalkRepayment();

  useEffect(() => {
    setTransferNotice(false);
  }, [destination]);

  const stepDescription = step === 1 ? "Select Fertilizer IDs and recipient" : "Confirm send";

  const enableNextStep =
    step === 1
      ? selectedIds.length > 0 && selectedIds.every((item) => item.value > 0n) && !!destination && transferNotice
      : true;

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      repayment.refetch();
      navigate("/transfer");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  function onSubmit() {
    setSubmitting(true);
    toast.loading("Transferring...");
    try {
      if (!account.address || !destination) return;

      const farmData: `0x${string}`[] = [];

      if (selectedIds.length === 1) {
        // Single ID: use transferERC1155
        const transferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferERC1155",
          args: [BARN_PAYBACK_ADDRESS as Address, destination as Address, selectedIds[0].id, selectedIds[0].value],
        });
        farmData.push(transferCall);
      } else {
        // Multiple IDs: use batchTransferERC1155
        const ids = selectedIds.map((item) => item.id);
        const values = selectedIds.map((item) => item.value);
        const batchTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "batchTransferERC1155",
          args: [BARN_PAYBACK_ADDRESS as Address, destination as Address, ids, values],
        });
        farmData.push(batchTransferCall);
      }

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Transfer beanstalk fertilizer failed", e);
      toast.dismiss();
      toast.error("Transfer failed");
    }
  }

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={2}
      enableNextStep={enableNextStep}
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          destination={destination}
          setDestination={setDestination}
          transferNotice={transferNotice}
          setTransferNotice={setTransferNotice}
        />
      ) : (
        <FinalStep selectedIds={selectedIds} destination={destination} />
      )}
    </FlowForm>
  );
}
