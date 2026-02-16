import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import PodLineGraph from "@/components/PodLineGraph";
import TextSkeleton from "@/components/TextSkeleton";
import { Plot } from "@/utils/types";

interface BeanstalkPodsSectionProps {
  plots: Plot[];
  totalPods: TokenValue;
  harvestableIndex: TokenValue;
  podIndex: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onHarvest?: () => void;
  onSend?: () => void;
  onMarket?: () => void;
}

/**
 * Section component displaying pods from the repayment field (fieldId=1)
 * Shows PodLineGraph visualization
 */
const BeanstalkPodsSection: React.FC<BeanstalkPodsSectionProps> = ({
  plots,
  totalPods,
  harvestableIndex,
  podIndex,
  isLoading,
  disabled = false,
  onHarvest,
  onSend,
  onMarket,
}) => {
  const hasPlots = plots.length > 0;
  const hasPods = !totalPods.isZero;
  const hasHarvestablePods = plots.some((p) => p.harvestablePods?.gt(0));
  const showDisabledGraph = disabled || !hasPlots;

  return (
    <BeanstalkStatField
      title="My Beanstalk Pods"
      value={null}
      disabled={disabled}
      actions={[
        { label: "Harvest", onClick: onHarvest, disabled: !hasHarvestablePods },
        { label: "Buy/Sell", onClick: onMarket },
        { label: "Send", onClick: onSend, disabled: !hasPods },
      ]}
    >
      {isLoading ? (
        <TextSkeleton loading={true} height="body" className="w-full h-12" />
      ) : (
        <div className={showDisabledGraph ? "opacity-50 pointer-events-none" : ""}>
          <PodLineGraph
            plots={plots}
            disableInteractions={false}
            label=""
            customHarvestableIndex={harvestableIndex}
            customPodIndex={podIndex}
          />
        </div>
      )}
    </BeanstalkStatField>
  );
};

export default BeanstalkPodsSection;
