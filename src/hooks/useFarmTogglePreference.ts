import { appSettingsAtom } from "@/state/app/app.atoms";
import { useAtom } from "jotai";
import { useCallback } from "react";

export function useFarmTogglePreference() {
  const [appSettings, setAppSettings] = useAtom(appSettingsAtom);

  const setFarmTogglePreference = useCallback(
    (farmTogglePreference: boolean) => {
      setAppSettings((draft) => {
        draft.farmTogglePreference = farmTogglePreference;
      });
    },
    [setAppSettings],
  );

  return [appSettings.farmTogglePreference, setFarmTogglePreference] as const;
}
