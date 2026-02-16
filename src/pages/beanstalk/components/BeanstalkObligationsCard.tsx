import { Button } from "@/components/ui/Button";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS } from "@/constants/address";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useBeanstalkGlobalStats } from "@/state/useBeanstalkGlobalStats";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
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
  const chainId = useChainId();
  const navigate = useNavigate();
  const { silo, pods, fertilizer, isLoading, isError, refetch } = useFarmerBeanstalkRepayment();
  const globalStats = useBeanstalkGlobalStats();

  const isConnected = !!account.address;
  const showDisabled = !isConnected || isError;

  // Total bsFERT token count from per-ID ERC1155 balances
  const totalBsFert = useMemo(() => {
    let total = 0n;
    for (const detail of fertilizer.perIdData.values()) {
      total += detail.balance;
    }
    return total;
  }, [fertilizer.perIdData]);

  // Transaction hook for claim operations
  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      refetch();
    },
    successMessage: "Claim successful",
    errorMessage: "Claim failed",
  });

  // Silo Claim — Claim earned urBDV from SiloPayback contract directly
  const handleClaimSilo = useCallback(async () => {
    if (!account.address || silo.earned.isZero) return;

    try {
      setSubmitting(true);

      // Call claim(address recipient, enum LibTransfer.To toMode) directly on SiloPayback contract
      // toMode: 0 = INTERNAL, 1 = EXTERNAL (to wallet), 2 = INTERNAL_TOLERANT
      await writeWithEstimateGas({
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "claim",
        args: [account.address, 1], // Claim to wallet (EXTERNAL)
      });
    } catch (error) {
      console.error("Silo claim error:", error);
      setSubmitting(false);
    }
  }, [account.address, silo.earned, writeWithEstimateGas, setSubmitting]);

  // Pods Harvest — Harvest harvestable pods from repayment field (fieldId=1)
  const handleHarvestPods = useCallback(async () => {
    if (!account.address) return;

    const harvestablePlotIndices = pods.plots.filter((p) => p.harvestablePods?.gt(0)).map((p) => p.index.toBigInt());

    if (harvestablePlotIndices.length === 0) return;

    try {
      setSubmitting(true);

      await writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "harvest",
        args: [1n, harvestablePlotIndices, 1], // fieldId=1, plot indices, EXTERNAL
      });
    } catch (error) {
      console.error("Pods harvest error:", error);
      setSubmitting(false);
    }
  }, [account.address, pods.plots, writeWithEstimateGas, setSubmitting, chainId]);

  // Fertilizer Rinse — Rinse fertilized sprouts from BarnPayback contract directly
  const handleRinseFert = useCallback(async () => {
    if (!account.address) return;

    if (!fertilizer.fertilizerIds || fertilizer.fertilizerIds.length === 0) {
      console.warn("Cannot rinse fertilizer: No fertilizer IDs available.");
      return;
    }

    try {
      setSubmitting(true);

      await writeWithEstimateGas({
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "claimFertilized",
        args: [fertilizer.fertilizerIds, 1],
      });
    } catch (error) {
      console.error("Fertilizer rinse error:", error);
      setSubmitting(false);
    }
  }, [account.address, fertilizer.fertilizerIds, writeWithEstimateGas, setSubmitting]);

  const handleSendSilo = () => {
    navigate("/transfer/beanstalk-silo");
  };

  const handleSendPods = () => {
    navigate("/transfer/beanstalk-pods");
  };

  const handleMarketPods = () => {
    navigate("/market/pods/buy/fill");
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
          earned={silo.earned}
          totalDistributed={silo.totalDistributed}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
          onClaim={handleClaimSilo}
          onSend={handleSendSilo}
        />
        <BeanstalkPodsSection
          plots={pods.plots}
          totalPods={pods.totalPods}
          harvestableIndex={pods.harvestableIndex}
          podIndex={pods.podIndex}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
          onHarvest={handleHarvestPods}
          onSend={handleSendPods}
          onMarket={handleMarketPods}
        />
        <BeanstalkFertilizerSection
          tokenCount={totalBsFert}
          fertilized={fertilizer.fertilized}
          unfertilized={fertilizer.unfertilized}
          totalUnfertilizedSprouts={globalStats.totalUnfertilizedSprouts}
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
