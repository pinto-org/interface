import { Button } from "@/components/ui/Button";
import { abiSnippets } from "@/constants/abiSnippets";
import { SILO_PAYBACK_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import BeanstalkFertilizerSection from "./BeanstalkFertilizerSection";
import BeanstalkPodsSection from "./BeanstalkPodsSection";
import BeanstalkSiloSection from "./BeanstalkSiloSection";

/**
 * Container component for displaying user's Beanstalk obligations
 * Shows Silo Payback (urBDV), Pods from repayment field, and Fertilizer data
 * Shows N/A values when wallet is not connected or data cannot be loaded
 */
const BeanstalkObligationsCard: React.FC = () => {
  const account = useAccount();
  const navigate = useNavigate();
  const { silo, pods, fertilizer, isLoading, isError, refetch } = useFarmerBeanstalkRepayment();

  const isConnected = !!account.address;
  const showDisabled = !isConnected || isError;

  // Transaction hook for claim operations
  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    onSuccess: () => {
      refetch();
    },
    successMessage: "Claim successful",
    errorMessage: "Claim failed",
  });

  // Silo Claim — Claim earned urBDV from SiloPayback
  const handleClaimSilo = useCallback(async () => {
    if (!account.address || silo.earned.isZero) return;

    try {
      setSubmitting(true);

      // Encode claim(address recipient, enum LibTransfer.To toMode) call for SiloPayback contract
      // toMode: 0 = INTERNAL (to internal balance), 1 = EXTERNAL (to wallet), 2 = INTERNAL_TOLERANT
      const claimData = encodeFunctionData({
        abi: abiSnippets.siloPayback,
        functionName: "claim",
        args: [account.address, 1], // Claim to wallet (EXTERNAL)
      });

      await writeWithEstimateGas({
        address: beanstalkAddress[account.chainId ?? 8453],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[claimData]],
      });
    } catch (error) {
      console.error("Silo claim error:", error);
      setSubmitting(false);
    }
  }, [account.address, account.chainId, silo.earned, writeWithEstimateGas, setSubmitting]);

  // Pods Harvest — Navigate to field harvest page
  const handleHarvestPods = useCallback(() => {
    // Navigate to field page with harvest action for fieldId=1
    navigate("/field?action=harvest&fieldId=1");
  }, [navigate]);

  // Fertilizer Rinse — Rinse fertilized sprouts
  const handleRinseFert = useCallback(async () => {
    if (!account.address || fertilizer.fertilized.isZero) return;

    // Check if we have fertilizer IDs
    if (!fertilizer.fertilizerIds || fertilizer.fertilizerIds.length === 0) {
      console.warn(
        "Cannot rinse fertilizer: No fertilizer IDs available. Fertilizer ID enumeration not yet implemented.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // Encode claimFertilized(uint256[] ids, enum LibTransfer.To mode) call for BarnPayback contract
      // mode: 0 = INTERNAL (to internal balance), 1 = EXTERNAL (to wallet), 2 = INTERNAL_TOLERANT
      const claimFertilizedData = encodeFunctionData({
        abi: abiSnippets.barnPayback,
        functionName: "claimFertilized",
        args: [fertilizer.fertilizerIds, 1], // Claim to wallet (EXTERNAL)
      });

      await writeWithEstimateGas({
        address: beanstalkAddress[account.chainId ?? 8453],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[claimFertilizedData]],
      });
    } catch (error) {
      console.error("Fertilizer rinse error:", error);
      setSubmitting(false);
    }
  }, [
    account.address,
    account.chainId,
    fertilizer.fertilized,
    fertilizer.fertilizerIds,
    writeWithEstimateGas,
    setSubmitting,
  ]);

  const handleSendSilo = () => {
    navigate("/transfer/beanstalk-silo");
  };

  const handleSendPods = () => {
    navigate("/transfer/beanstalk-pods");
  };

  const handleSendFertilizer = () => {
    navigate("/transfer/beanstalk-fertilizer");
  };

  return (
    <div className="flex flex-col h-full">
      {isConnected && isError && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" rounded="full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-8">
        <BeanstalkSiloSection
          balance={silo.balance}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
          onClaim={handleClaimSilo}
          onSend={handleSendSilo}
        />
        <BeanstalkPodsSection
          plots={pods.plots}
          totalPods={pods.totalPods}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
          onHarvest={handleHarvestPods}
          onSend={handleSendPods}
        />
        <BeanstalkFertilizerSection
          balance={fertilizer.balance}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
          onRinse={handleRinseFert}
          onSend={handleSendFertilizer}
        />
      </div>
    </div>
  );
};

export default BeanstalkObligationsCard;
