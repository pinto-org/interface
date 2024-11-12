import { TV } from "@/classes/TokenValue";

import { atom } from "jotai";
import { FieldTemperature } from ".";

export const soilAtom = atom<TV>(TV.ZERO);

export const temperatureAtom = atom<FieldTemperature>({
  max: TV.ZERO,
  scaled: TV.ZERO,
});
