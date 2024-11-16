import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, FarmToMode, type Token } from "@/utils/types";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import FinalStep from "./farmbalance/FinalStep";
import StepOne from "./farmbalance/StepOne";

export default function TransferFarmBalance() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [transferData, setTransferData] = useState<{ token: Token; amount: string }[]>([]);
  const [balanceTo, setBalanceTo] = useState<FarmToMode>(FarmToMode.INTERNAL);

  const [usingMax, setUsingMax] = useState(false);

  const totalAmount = useMemo(
    () => transferData.reduce((total, tokenData) => Number(tokenData.amount) + total, 0),
    [transferData],
  );

  const stepDescription =
    step === 1 ? (usingMax ? "Specify recipient" : "Specify amount, token and recipient address") : "Confirm send";

  const farmerBalances = useFarmerBalances();

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      farmerBalances.refetch();
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
      for (const data of transferData) {
        const amount = TokenValue.fromHuman(data.amount, data.token.decimals);
        if (amount.eq(0)) continue;
        const balanceTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferToken",
          args: [
            data.token.address,
            destination as Address,
            amount.toBigInt(),
            Number(FarmFromMode.INTERNAL),
            Number(balanceTo),
          ],
        });
        farmData.push(balanceTransferCall);
      }

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });
    } catch (e) {
      console.error("Transfer farm balance failed", e);
      toast.dismiss();
      toast.error("Transfer failed");
    }
  }

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={2}
      enableNextStep={!!destination && totalAmount > 0 && !!balanceTo}
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne
          transferData={transferData}
          setTransferData={setTransferData}
          destination={destination}
          setDestination={setDestination}
          balanceTo={balanceTo}
          setBalanceTo={setBalanceTo}
          usingMax={usingMax}
          setUsingMax={setUsingMax}
        />
      ) : (
        <FinalStep transferData={transferData} destination={destination} balanceTo={balanceTo} />
      )}
    </FlowForm>
  );
}
