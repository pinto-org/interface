import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { SILO_PAYBACK_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./beanstalk-silo/FinalStep";
import StepOne from "./beanstalk-silo/StepOne";

const URBDV_DECIMALS = 6;

export default function TransferBeanstalkSilo() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [balanceTo, setBalanceTo] = useState<FarmToMode | undefined>(undefined);
  const [transferNotice, setTransferNotice] = useState<boolean>(false);

  const repayment = useFarmerBeanstalkRepayment();

  useEffect(() => {
    setTransferNotice(false);
  }, [balanceTo, destination]);

  const stepDescription = step === 1 ? "Specify amount and recipient address" : "Confirm send";

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      repayment.refetch();
      navigate("/transfer");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  function onSubmit() {
    try {
      setSubmitting(true);
      toast.loading("Transferring...");

      if (!account.address || !destination || !amount) return;

      const parsedAmount = TokenValue.fromHuman(amount, URBDV_DECIMALS);
      if (parsedAmount.eq(0)) return;

      const farmData: `0x${string}`[] = [];

      const transferCall = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "transferToken",
        args: [
          SILO_PAYBACK_ADDRESS,
          destination as Address,
          parsedAmount.toBigInt(),
          Number(FarmFromMode.INTERNAL),
          Number(balanceTo),
        ],
      });
      farmData.push(transferCall);

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Transfer Beanstalk Silo failed", e);
      toast.dismiss();
      toast.error("Transfer failed");
    }
  }

  const numericAmount = Number(amount) || 0;

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={2}
      enableNextStep={
        !!destination && numericAmount > 0 && !!balanceTo && (balanceTo === FarmToMode.INTERNAL ? transferNotice : true)
      }
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne
          amount={amount}
          setAmount={setAmount}
          destination={destination}
          setDestination={setDestination}
          balanceTo={balanceTo}
          setBalanceTo={setBalanceTo}
          transferNotice={transferNotice}
          setTransferNotice={setTransferNotice}
        />
      ) : (
        <FinalStep amount={amount} destination={destination} balanceTo={balanceTo} />
      )}
    </FlowForm>
  );
}
