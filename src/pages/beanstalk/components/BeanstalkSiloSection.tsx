import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import TextSkeleton from "@/components/TextSkeleton";
import { formatter } from "@/utils/format";

interface BeanstalkSiloSectionProps {
  balance: TokenValue;
  earned: TokenValue;
  totalDistributed: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onClaim?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying urBDV token balance for Silo Payback
 * Shows total balance as primary value, earned (claimable) as secondary
 */
const BeanstalkSiloSection: React.FC<BeanstalkSiloSectionProps> = ({
  balance,
  earned,
  totalDistributed,
  isLoading,
  disabled = false,
  onClaim,
  onSend,
}) => {
  const hasBalance = !balance.isZero;
  const hasEarned = !earned.isZero;

  const sharePercent = totalDistributed.gt(0)
    ? ((balance.toNumber() / totalDistributed.toNumber()) * 100).toFixed(2)
    : "0.00";

  return (
    <BeanstalkStatField
      title="My Beanstalk Silo"
      value=""
      isLoading={isLoading}
      disabled={disabled}
      actions={[
        { label: "Claim", onClick: onClaim, disabled: !hasEarned },
        { label: "Send", onClick: onSend, disabled: !hasBalance },
      ]}
    >
      <TextSkeleton loading={isLoading} height="body" className="w-24">
        {disabled ? (
          <span className="text-pinto-light pinto-sm sm:pinto-body-light">N/A</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <div className="pinto-sm sm:pinto-body-light">
              {formatter.number(balance, { minDecimals: 2, maxDecimals: 2 })}
              <span className="text-pinto-light pinto-sm sm:pinto-body-light ml-1">
                Beanstalk Silo Tokens ({sharePercent}%)
              </span>
            </div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light">
              {formatter.number(earned, { minDecimals: 2, maxDecimals: 2 })} Earned
            </div>
          </div>
        )}
      </TextSkeleton>
    </BeanstalkStatField>
  );
};

export default BeanstalkSiloSection;
