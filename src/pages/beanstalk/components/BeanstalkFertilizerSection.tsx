import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import TextSkeleton from "@/components/TextSkeleton";
import { formatter } from "@/utils/format";

interface BeanstalkFertilizerSectionProps {
  tokenCount: bigint;
  fertilized: TokenValue;
  unfertilized: TokenValue;
  totalUnfertilizedSprouts: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onRinse?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying fertilizer token count (bsFERT ERC1155 balance)
 * Shows unfertilized sprouts as primary value, fertilized (rinsable) as secondary
 */
const BeanstalkFertilizerSection: React.FC<BeanstalkFertilizerSectionProps> = ({
  tokenCount,
  fertilized,
  unfertilized,
  totalUnfertilizedSprouts,
  isLoading,
  disabled = false,
  onRinse,
  onSend,
}) => {
  const hasBalance = tokenCount > 0n;
  const hasRinsable = !fertilized.isZero;

  const sharePercent = totalUnfertilizedSprouts.gt(0)
    ? ((unfertilized.toNumber() / totalUnfertilizedSprouts.toNumber()) * 100).toFixed(2)
    : "0.00";

  return (
    <BeanstalkStatField
      title="My Beanstalk Fertilizer"
      value=""
      isLoading={isLoading}
      disabled={disabled}
      actions={[
        { label: "Rinse", onClick: onRinse, disabled: !hasRinsable },
        { label: "Send", onClick: onSend, disabled: !hasBalance },
      ]}
    >
      <TextSkeleton loading={isLoading} height="body" className="w-24">
        {disabled ? (
          <span className="text-pinto-light pinto-sm sm:pinto-body-light">N/A</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <div className="pinto-sm sm:pinto-body-light">
              {formatter.number(unfertilized, { minDecimals: 2, maxDecimals: 2 })}
              <span className="text-pinto-light pinto-sm sm:pinto-body-light ml-1">Sprouts ({sharePercent}%)</span>
            </div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light">
              {formatter.number(fertilized, { minDecimals: 2, maxDecimals: 2 })} Fertilized
            </div>
          </div>
        )}
      </TextSkeleton>
    </BeanstalkStatField>
  );
};

export default BeanstalkFertilizerSection;
