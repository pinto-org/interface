import useAppSettings from "@/hooks/useAppSettings";
import { SwitchPDVIcon } from "../Icons";

export default function DenominationSwitcher() {
  const { toggleDenomination } = useAppSettings();

  return (
    <div onClick={() => toggleDenomination()} className="hover:cursor-pointer">
      <SwitchPDVIcon />
    </div>
  );
}
