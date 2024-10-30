
import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, FarmToMode, type Token } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, type BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import StepOne from "./farmbalance/StepOne";
import StepTwo from "./farmbalance/StepTwo";

export default function TransferFarmBalance() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [transferData, setTransferData] = useState<{ token: Token, amount: string }[]>([]);
  const [balanceTo, setBalanceTo] = useState<FarmToMode>(FarmToMode.INTERNAL);

  const [usingMax, setUsingMax] = useState(false);

  const totalAmount = useMemo(() => transferData.reduce((total, tokenData) => Number(tokenData.amount) + total, 0), [transferData]);

  const stepDescription = step === 1 ?
    usingMax ? "Specify recipient" 
    : "Specify amount, token and recipient address"
    : "Confirm send"

  const farmerBalances = useFarmerBalances();

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      farmerBalances.refetch();
      navigate("/transfer");
    }
  }, [isSuccess, farmerBalances, navigate]);

  function onSubmit() {
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

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });

    toast.promise(tx, {
      loading: "Transferring everything...",
      success: (data) => {
        return "Transfer complete!";
      },
      error: (error) => {
        return (error as BaseError).shortMessage || "Transfer failed.";
      },
    });
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
      {step === 1 ? 
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
        : <StepTwo transferData={transferData} destination={destination} balanceTo={balanceTo} />}
    </FlowForm>
  );
}
