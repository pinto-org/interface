
import { TokenValue } from "@/classes/TokenValue";
import FlowForm from "@/components/FormFlow";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { DepositData, type Token } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, type BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import StepOne from "./deposits/StepOne";
import StepTwoMax from "./deposits/StepTwoMax";
import FinalStep from "./deposits/FinalStep";
import { sortAndPickCrates } from "@/utils/convert";
import StepTwo from "./deposits/StepTwo";

export interface DepositTransferData {
  token: Token, 
  amount: string, 
  deposits: DepositData[]
}

export default function TransferDeposits() {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();
  const [transferData, setTransferData] = useState<DepositTransferData[]>([]);
  const [usingMax, setUsingMax] = useState(false);

  const farmerDeposits = useFarmerDepositedBalances();

  const stepDescription = () => {
    switch (step) {
        case 1:
            return "Select Deposited tokens to send"
        case 2:
            if (usingMax) {
                return "Specify recipient address"
            }
            return "Specify amount and address"
        default:
            return "Confirm send"
        }
    }

    const enableNextStep = () => {
        switch (step) {
            case 1:
                return transferData.length > 0;
            case 2:
                if (usingMax) {
                    return !!destination
                } else {
                    return false
                }
            case 3:
                if (usingMax) {
                    return true
                } else {
                    return false
                }
            default:
                return false
        }
    }

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (usingMax && step === 1) {
        setStep(2)
    };
  }, [usingMax, step])

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      farmerDeposits.refetch();
      navigate("/transfer");
    }
  }, [isSuccess, farmerDeposits, navigate]);

  function onSubmit() {
    if (!account.address || !destination) return;

    const farmData: `0x${string}`[] = [];

    // Deposit Transfers
    for (const depositData of transferData) {
        const amountTV = TokenValue.fromHuman(depositData.amount, depositData.token.decimals);
        if (amountTV.eq(0)) continue;

        const crateData = sortAndPickCrates(
          "transfer",
          amountTV,
          depositData.deposits,
        );

        const stems = crateData.crates.map((crate) => crate.stem.toBigInt());
        const amounts = crateData.crates.map((crate) => crate.amount.toBigInt());
        const depositTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferDeposits",
          args: [account.address, destination as Address, depositData.token.address, stems, amounts],
        });
        farmData.push(depositTransferCall);
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

  function backToFirstStep() {
    setStep(1)
    setUsingMax(false)
  };

  return (
    <FlowForm
      stepNumber={step}
      setStep={setStep}
      totalSteps={usingMax ? 3 : 4}
      enableNextStep={enableNextStep()}
      onSubmit={onSubmit}
      stepDescription={stepDescription()}
      customBackStepFunction={(usingMax && step === 2) ? () => backToFirstStep() : undefined}
    >
      {step === 1 ? 
        <StepOne
          transferData={transferData}
          setTransferData={setTransferData}
          usingMax={usingMax}
          setUsingMax={setUsingMax}
        />
        : step === 2 
            ? usingMax ? 
              <StepTwoMax 
                  destination={destination} 
                  setDestination={setDestination} 
                  usingMax={usingMax}
                  setUsingMax={setUsingMax} 
              />
              : <StepTwo 
                  transferData={transferData}
                  setTransferData={setTransferData}
                />
        : step === 3 && usingMax ?
            <FinalStep destination={destination} />
        : undefined
    }
    </FlowForm>
  );
}
