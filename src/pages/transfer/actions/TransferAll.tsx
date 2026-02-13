import FlowForm from "@/components/FormFlow";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import FinalStep from "./all/FinalStep";
import StepOne from "./all/StepOne";

export default function TransferAll() {
  const account = useAccount();
  const chainId = useChainId();

  const [step, setStep] = useState(1);

  const stepDescription = step === 1 ? "Send everything, specify address" : "Confirm send";

  const [destination, setDestination] = useState<string | undefined>();
  const [transferNotice, setTransferNotice] = useState<boolean>(false);

  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerDeposits = farmerSilo.deposits;
  const depositsToSend = [...farmerDeposits].map(([token, deposit]) => ({ token, deposit }));

  const hasPlots = farmerField.plots.length > 0;

  const repayment = useFarmerBeanstalkRepayment();
  const hasBeanstalkSilo = repayment.silo.balance.gt(0);
  const hasBeanstalkPods = repayment.pods.plots.length > 0;
  const hasBeanstalkFert = useMemo(() => {
    for (const detail of repayment.fertilizer.perIdData.values()) {
      if (detail.balance > 0n) return true;
    }
    return false;
  }, [repayment.fertilizer.perIdData]);

  const { data: walletClient } = useWalletClient();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    setTransferNotice(false);
  }, [destination]);

  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      for (const queryKey of farmerSilo.queryKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
      farmerBalances.refetch();
      farmerField.refetch();
      repayment.refetch();
      navigate("/transfer");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  async function onSubmit() {
    try {
      setSubmitting(true);
      toast.loading("Transferring...");

      if (!account.address || !destination) return;
      const farmData: `0x${string}`[] = [];

      // Farm Wallet Transfers
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

      // Plot Transfers (fieldId=0)
      if (hasPlots) {
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
          args: [account.address, destination as Address, fieldId, ids, starts, ends],
        });
        farmData.push(plotTransferCall);
      }

      // Beanstalk Repayment Pods (fieldId=1)
      if (hasBeanstalkPods) {
        const fieldId = BigInt(1);
        const ids: bigint[] = [];
        const starts: bigint[] = [];
        const ends: bigint[] = [];
        for (const plotData of repayment.pods.plots) {
          ids.push(plotData.index.toBigInt());
          starts.push(BigInt(0));
          ends.push(plotData.pods.toBigInt());
        }
        const plotTransferCall = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "transferPlots",
          args: [account.address, destination as Address, fieldId, ids, starts, ends],
        });
        farmData.push(plotTransferCall);
      }

      // Execute farm() with all batched calls (skip if nothing to batch)
      if (farmData.length > 0) {
        await writeWithEstimateGas({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "farm",
          args: [farmData],
        });
      }

      // Beanstalk Repayment Fertilizer — direct ERC1155 transfer (not via farm)
      // BarnPayback is a separate contract; calling via farm() makes diamond the msg.sender
      // which requires the user to have approved diamond. Direct call avoids this.
      if (hasBeanstalkFert && walletClient) {
        const fertIds: bigint[] = [];
        const fertValues: bigint[] = [];
        for (const [idStr, detail] of repayment.fertilizer.perIdData) {
          if (detail.balance > 0n) {
            fertIds.push(BigInt(idStr));
            fertValues.push(detail.balance);
          }
        }
        if (fertIds.length > 0) {
          toast.loading("Transferring bsFERT...");
          await walletClient.writeContract({
            address: BARN_PAYBACK_ADDRESS as Address,
            abi: [
              {
                inputs: [
                  { name: "from", type: "address" },
                  { name: "to", type: "address" },
                  { name: "ids", type: "uint256[]" },
                  { name: "amounts", type: "uint256[]" },
                  { name: "data", type: "bytes" },
                ],
                name: "safeBatchTransferFrom",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ] as const,
            functionName: "safeBatchTransferFrom",
            args: [account.address, destination as Address, fertIds, fertValues, "0x"],
          });
        }
      }

      // urBDV transfer is a separate contract call (not via farm())
      if (hasBeanstalkSilo && walletClient) {
        toast.loading("Transferring urBDV...");
        await walletClient.writeContract({
          address: SILO_PAYBACK_ADDRESS as Address,
          abi: abiSnippets.siloPayback,
          functionName: "transfer",
          args: [destination as Address, repayment.silo.balance.toBigInt()],
        });
      }
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
      enableNextStep={!!destination && transferNotice}
      onSubmit={onSubmit}
      stepDescription={stepDescription}
    >
      {step === 1 ? (
        <StepOne
          destination={destination}
          setDestination={setDestination}
          transferNotice={transferNotice}
          setTransferNotice={setTransferNotice}
        />
      ) : (
        <FinalStep destination={destination} />
      )}
    </FlowForm>
  );
}
