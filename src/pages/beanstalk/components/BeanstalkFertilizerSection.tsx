import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import { formatter } from "@/utils/format";

interface BeanstalkFertilizerSectionProps {
  balance: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onRinse?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying fertilizer balance
 */
const BeanstalkFertilizerSection: React.FC<BeanstalkFertilizerSectionProps> = ({
  balance,
  isLoading,
  disabled = false,
  onRinse,
  onSend,
}) => {
  const hasBalance = !balance.isZero;

  return (
    <BeanstalkStatField
      title="My Beanstalk Fertilizer"
      value={formatter.number(balance, { minDecimals: 2, maxDecimals: 2 })}
      isLoading={isLoading}
      disabled={disabled}
      actions={[
        { label: "Rinse", onClick: onRinse, disabled: !hasBalance },
        { label: "Send", onClick: onSend, disabled: !hasBalance },
      ]}
    />
  );
};

export default BeanstalkFertilizerSection;
