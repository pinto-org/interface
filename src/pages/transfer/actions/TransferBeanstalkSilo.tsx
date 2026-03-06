import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { abiSnippets } from "@/constants/abiSnippets";
import { SILO_PAYBACK_ADDRESS } from "@/constants/address";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import FinalStep from "./beanstalk-silo/FinalStep";
import StepOne from "./beanstalk-silo/StepOne";

const URBDV_DECIMALS = 6;

export default function TransferBeanstalkSilo() {
  const account = useAccount();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [transferNotice, setTransferNotice] = useState<boolean>(false);

  const repayment = useFarmerBeanstalkRepayment();

  useEffect(() => {
    setTransferNotice(false);
  }, [destination]);

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

      // urBDV is an ERC20 token on SiloPayback contract — direct transfer to recipient wallet
      return writeWithEstimateGas({
        address: SILO_PAYBACK_ADDRESS as Address,
        abi: abiSnippets.siloPayback,
        functionName: "transfer",
        args: [destination as Address, parsedAmount.toBigInt()],
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
      enableNextStep={!!destination && numericAmount > 0}
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne
          amount={amount}
          setAmount={setAmount}
          destination={destination}
          setDestination={setDestination}
          transferNotice={transferNotice}
          setTransferNotice={setTransferNotice}
        />
      ) : (
        <FinalStep amount={amount} destination={destination} />
      )}
    </FlowForm>
  );
}
