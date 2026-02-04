import { Button } from "@/components/ui/Button";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
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
  const { silo, pods, fertilizer, isLoading, isError, refetch } = useFarmerBeanstalkRepayment();

  const isConnected = !!account.address;
  const showDisabled = !isConnected || isError;

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
        <BeanstalkSiloSection balance={silo.balance} isLoading={isConnected && isLoading} disabled={showDisabled} />
        <BeanstalkPodsSection
          plots={pods.plots}
          totalPods={pods.totalPods}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
        />
        <BeanstalkFertilizerSection
          balance={fertilizer.balance}
          isLoading={isConnected && isLoading}
          disabled={showDisabled}
        />
      </div>
    </div>
  );
};

export default BeanstalkObligationsCard;
