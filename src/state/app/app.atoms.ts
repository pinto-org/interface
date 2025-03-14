import { atomWithImmer } from "jotai-immer";

export type Denomination = "USD" | "PDV";

export interface AppSettings {
  denomination: Denomination;
  privateMode: boolean;
}

const privateModeDefaultState = localStorage.getItem("isPrivateMode") === "true";

export const appSettingsAtom = atomWithImmer<AppSettings>({
  denomination: "USD",
  privateMode: privateModeDefaultState,
});
