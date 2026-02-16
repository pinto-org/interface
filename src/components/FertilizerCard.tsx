import fertilizerIcon from "@/assets/protocol/Fertilizer.svg";
import CheckmarkCircle from "@/components/CheckmarkCircle";
import IconImage from "@/components/ui/IconImage";
import { Input } from "@/components/ui/Input";
import { formatter } from "@/utils/format";

interface FertilizerCardProps {
  fertId: bigint;
  amount: string;
  isSelected: boolean;
  maxBalance: bigint;
  sprouts: string;
  humidity: string;
  onToggleSelection: (fertId: bigint) => void;
  onAmountChange: (fertId: bigint, value: string, maxBalance: bigint) => void;
}

export default function FertilizerCard({
  fertId,
  amount,
  isSelected,
  maxBalance,
  sprouts,
  humidity,
  onToggleSelection,
  onAmountChange,
}: FertilizerCardProps) {
  return (
    <div className="flex flex-row items-center gap-3 p-4 rounded-lg bg-white hover:bg-pinto-green-1/30 transition-colors">
      {/* Checkbox */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => onToggleSelection(fertId)}>
        <CheckmarkCircle isSelected={isSelected} />
      </div>

      {/* Fertilizer icon */}
      <div className="flex-shrink-0">
        <IconImage src={fertilizerIcon} size={12} mobileSize={12} />
      </div>

      {/* Fertilizer info */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="pinto-body font-[500] text-black">
          {sprouts} Sprouts
          <span className="pinto-sm text-pinto-gray-3 ml-1.5">Humidity: {humidity}</span>
        </div>
        <div className="pinto-sm text-pinto-gray-4">
          {formatter.number(Number(maxBalance))} bsFERT - ID {formatter.number(Number(fertId))}
        </div>
      </div>

      {/* Amount input */}
      <div className="flex-shrink-0 w-52">
        <Input
          type="number"
          placeholder="Amount to Transfer"
          value={amount}
          onChange={(e) => onAmountChange(fertId, e.target.value, maxBalance)}
          outlined={true}
          containerClassName="border border-pinto-green-4 focus-within:border-pinto-green-4"
          min="0"
          max={maxBalance.toString()}
          step="1"
        />
      </div>
    </div>
  );
}
