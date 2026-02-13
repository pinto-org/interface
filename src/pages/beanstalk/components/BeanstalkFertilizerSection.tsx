import BeanstalkStatField from "@/components/BeanstalkStatField";
import { formatter } from "@/utils/format";

interface BeanstalkFertilizerSectionProps {
  tokenCount: bigint;
  isLoading: boolean;
  disabled?: boolean;
  onRinse?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying fertilizer token count (bsFERT ERC1155 balance)
 */
const BeanstalkFertilizerSection: React.FC<BeanstalkFertilizerSectionProps> = ({
  tokenCount,
  isLoading,
  disabled = false,
  onRinse,
  onSend,
}) => {
  const hasBalance = tokenCount > 0n;

  return (
    <BeanstalkStatField
      title="My Beanstalk Fertilizer"
      value={`${formatter.number(Number(tokenCount))} bsFERT`}
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
