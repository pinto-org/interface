import useAppSettings from "@/hooks/useAppSettings";
import { SwitchPDVIcon } from "../Icons";

export default function DenominationSwitcher() {
  const { toggleDenomination } = useAppSettings();

  return (
    <div onClick={() => toggleDenomination()}>
      <SwitchPDVIcon />
    </div>
  );
}
