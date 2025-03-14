import { appSettingsAtom, Denomination } from "@/state/app/app.atoms";
import { useAtom } from "jotai";
import { useCallback } from "react";

export default function useAppSettings() {
  const [appSettings, setAppSettings] = useAtom(appSettingsAtom);

  const toggleDenomination = useCallback(() => {
    setAppSettings((draft) => {
      const denomination = draft.denomination === "USD" ? "PDV" : "USD";
      draft.denomination = denomination;
      console.log(`Denomination changed to ${denomination}`);
    });
  }, [setAppSettings]);

  return { appSettings, toggleDenomination };
}

export function useDenomination() {
  const [appSettings] = useAtom(appSettingsAtom);
  return appSettings.denomination;
}
