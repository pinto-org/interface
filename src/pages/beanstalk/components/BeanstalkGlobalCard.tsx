import BeanstalkStatField from "@/components/BeanstalkStatField";
import { Button } from "@/components/ui/Button";
import { useBeanstalkGlobalStats } from "@/state/useBeanstalkGlobalStats";
import { formatter } from "@/utils/format";

/**
 * Component displaying global Beanstalk repayment statistics
 * Shows total urBDV distributed, total pods in repayment field,
 * total unfertilized sprouts, and total Pinto paid out
 * Shows N/A values when data cannot be loaded
 */
const BeanstalkGlobalCard: React.FC = () => {
  const {
    totalUrBdvDistributed,
    totalPodsInRepaymentField,
    totalUnfertilizedSprouts,
    totalPintoPaidOut,
    isLoading,
    isError,
    refetch,
  } = useBeanstalkGlobalStats();

  const formatValue = (value: typeof totalUrBdvDistributed) => {
    return formatter.number(value, { minDecimals: 2, maxDecimals: 2 });
  };

  return (
    <div className={`flex flex-col ${isError ? "opacity-60" : ""}`}>
      {isError && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" rounded="full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-8">
        <BeanstalkStatField
          title="Total Beanstalk Repayment Silo Tokens"
          value={formatValue(totalUrBdvDistributed)}
          isLoading={isLoading}
          disabled={isError}
        />
        <BeanstalkStatField
          title="Total Beanstalk Repayment Pods"
          value={formatValue(totalPodsInRepaymentField)}
          isLoading={isLoading}
          disabled={isError}
        />
        <BeanstalkStatField
          title="Total Beanstalk Repayment Sprouts"
          value={formatValue(totalUnfertilizedSprouts)}
          isLoading={isLoading}
          disabled={isError}
        />
        <BeanstalkStatField
          title="Pintos issued to Beanstalk Holders"
          value={formatValue(totalPintoPaidOut)}
          isLoading={isLoading}
          disabled={isError}
        />
      </div>
    </div>
  );
};

export default BeanstalkGlobalCard;
