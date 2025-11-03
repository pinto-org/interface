import TooltipSimple from "@/components/TooltipSimple";
import { Switch } from "@/components/ui/Switch";
import { FarmToMode } from "@/utils/types";

interface FarmBalanceToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export default function FarmBalanceToggle({ checked, onCheckedChange, label }: FarmBalanceToggleProps) {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="pinto-sm sm:pinto-body-light sm:text-pinto-light text-pinto-light">{label}</div>
        <TooltipSimple
          content={
            <div className="text-left">
              <div>The Farm Wallet allows Farmers to store assets within the Pinto protocol.</div>
              <div>If moving value within the protocol, the Farm Wallet provides a better user experience than</div>
              <div>
                transferring the value to their external wallet balance and then transferring it back into the protocol.
              </div>
            </div>
          }
          variant="gray"
          side="top"
        />
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
