import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import Warning from "@/components/ui/Warning";
import { STALK } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useMaxBurnableStalkOnRain from "@/hooks/useMaxBurnableStalkOnRain";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { sortAndPickCrates } from "@/utils/convert";
import { DepositData, type Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./deposits/FinalStep";
import StepOne from "./deposits/StepOne";
import StepTwo from "./deposits/StepTwo";

export interface DepositTransferData {
  token: Token;
  amount: string;
  deposits: DepositData[];
}

export default function TransferDeposits() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();
  const farmerSilo = useFarmerSiloNew();
  const maxBurnableStalk = useMaxBurnableStalkOnRain();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [transferData, setTransferData] = useState<DepositTransferData[]>([]);
  const [usingMax, setUsingMax] = useState(false);

  const stepDescription = () => {
    switch (step) {
      case 1:
        return "Select Deposited tokens to send";
      case 2:
        if (usingMax) {
          return "Specify recipient address";
        }
        return "Specify amount and address";
      default:
        return "Confirm send";
    }
  };

  const enableNextStep = () => {
    switch (step) {
      case 1:
        return transferData.length > 0;
      case 2:
        return !!destination;
      default:
        return true;
    }
  };

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      farmerSilo.refetch();
      navigate("/transfer");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  useEffect(() => {
    if (usingMax && step === 1) {
      setStep(2);
    }
  }, [usingMax, step]);

  const isBurningRainStalk = useMemo(() => {
    if (step === 1) return false;
    if (!exists(maxBurnableStalk)) return false;

    let amount = TokenValue.fromHuman(0, STALK.decimals);
    for (const data of transferData) {
      const pickedDeposits = sortAndPickCrates(
        "transfer",
        TokenValue.fromHuman(data.amount, data.token.decimals),
        data.deposits,
      );
      amount = amount.add(pickedDeposits.stalk);
      if (amount.gt(maxBurnableStalk)) {
        return true;
      }
    }

    return false;
  }, [maxBurnableStalk, transferData, step]);

  function onSubmit() {
    if (!account.address || !destination) return;

    try {
      setSubmitting(true);
      toast.loading("Transferring...");

      const farmData: `0x${string}`[] = [];

      // Deposit Transfers
      for (const depositData of transferData) {
        const amountTV = TokenValue.fromHuman(depositData.amount, depositData.token.decimals);
        if (amountTV.eq(0)) continue;

        const crateData = sortAndPickCrates("transfer", amountTV, depositData.deposits);

        const stems = crateData.crates.map((crate) => crate.stem.toBigInt());
        const amounts = crateData.crates.map((crate) => crate.amount.toBigInt());
        const depositTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferDeposits",
          args: [account.address, destination as Address, depositData.token.address, stems, amounts],
        });
        farmData.push(depositTransferCall);
      }

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Transfer deposits failed", e);
      toast.dismiss();
      toast.error("Transfer failed");
      throw e;
    }
  }

  function backToFirstStep() {
    setStep(1);
    setUsingMax(false);
  }

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={3}
      enableNextStep={enableNextStep()}
      onSubmit={onSubmit}
      stepDescription={stepDescription()}
      customBackStepFunction={usingMax && step === 2 ? () => backToFirstStep() : undefined}
    >
      {step === 1 ? (
        <StepOne
          transferData={transferData}
          setTransferData={setTransferData}
          usingMax={usingMax}
          setUsingMax={setUsingMax}
        />
      ) : step === 2 ? (
        <StepTwo
          transferData={transferData}
          setTransferData={setTransferData}
          destination={destination}
          setDestination={setDestination}
          usingMax={usingMax}
          backToFirstStep={backToFirstStep}
        />
      ) : (
        <FinalStep destination={destination} transferData={transferData} />
      )}
      {isBurningRainStalk && step > 1 && (
        <Warning variant="info">
          Transferring Deposits that were in the Silo when it began to Rain will result in a loss of Rain Stalk, which
          determine how proceeds from the Flood sale are distributed. Consider waiting until it stops Raining.
        </Warning>
      )}
    </FlowForm>
  );
}
