import { appSettingsAtom } from "@/state/app/app.atoms";
import { FarmToMode } from "@/utils/types";
import { useAtom } from "jotai";
import { useCallback } from "react";

export function useFarmTogglePreference() {
  const [appSettings, setAppSettings] = useAtom(appSettingsAtom);

  const mode = appSettings.farmTogglePreference ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL;
  const isFarmMode = appSettings.farmTogglePreference;

  const setMode = useCallback(
    (newMode: FarmToMode) => {
      const farmTogglePreference = newMode === FarmToMode.INTERNAL;
      setAppSettings((draft) => {
        draft.farmTogglePreference = farmTogglePreference;
      });
    },
    [setAppSettings],
  );

  return [mode, isFarmMode, setMode] as const;
}
