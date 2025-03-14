import { appSettingsAtom } from "@/state/app/app.atoms";
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

  const togglePrivateMode = useCallback(() => {
    console.log("Toggling private mode");
    setAppSettings((draft) => {
      draft.privateMode = !draft.privateMode;
      localStorage.setItem("isPrivateMode", draft.privateMode.toString());
    });
  }, [setAppSettings]);

  return { appSettings, toggleDenomination, togglePrivateMode };
}

export function useDenomination() {
  const [appSettings] = useAtom(appSettingsAtom);
  return appSettings.denomination;
}

export function usePrivateMode() {
  const [appSettings] = useAtom(appSettingsAtom);
  return appSettings.privateMode;
}
