import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerField } from "@/state/useFarmerField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./pods/FinalStep";
import StepOne from "./pods/StepOne";

export interface PodTransferData {
  id: TokenValue;
  start: TokenValue;
  end: TokenValue;
}

export default function TransferPods() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [transferData, setTransferData] = useState<PodTransferData[]>([]);
  const [transferNotice, setTransferNotice] = useState<boolean>(false);

  const farmerField = useFarmerField();

  useEffect(() => {
    setTransferNotice(false);
  }, [destination]);

  const stepDescription = () => {
    switch (step) {
      case 1:
        return "Select Pinto Plots";
      default:
        return "Confirm send";
    }
  };

  const enableNextStep = () => {
    switch (step) {
      case 1:
        return transferData.length > 0 && !!destination && transferNotice;
      default:
        return true;
    }
  };

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      farmerField.refetch();
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

      // Plot Transfers
      // todo: add support for more than one plot line
      const fieldId = BigInt(0);
      const ids: bigint[] = [];
      const starts: bigint[] = [];
      const ends: bigint[] = [];
      for (const plotData of transferData) {
        ids.push(plotData.id.toBigInt());
        starts.push(plotData.start.toBigInt());
        ends.push(plotData.end.toBigInt());
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

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Transfer pods failed", e);
      toast.dismiss();
      toast.error("Transfer failed");
    }
  }

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={2}
      enableNextStep={enableNextStep()}
      onSubmit={onSubmit}
      stepDescription={stepDescription()}
      disableTopSeparator={step === 1}
    >
      {step === 1 ? (
        <StepOne
          transferData={transferData}
          setTransferData={setTransferData}
          destination={destination}
          setDestination={setDestination}
          transferNotice={transferNotice}
          setTransferNotice={setTransferNotice}
        />
      ) : (
        <FinalStep transferData={transferData} destination={destination} />
      )}
    </FlowForm>
  );
}
