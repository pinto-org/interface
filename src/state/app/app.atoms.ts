import { atomWithImmer } from "jotai-immer";

export type Denomination = "USD" | "PDV";

export interface AppSettings {
  denomination: Denomination;
}

export const appSettingsAtom = atomWithImmer<AppSettings>({
  denomination: "USD",
});
