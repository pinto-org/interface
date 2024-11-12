import { useAtomValue } from "jotai";
import { seasonAtom, seasonQueryKeyAtom } from "./protocol/sun/sun.atoms";

export function useSunData() {
  const data = useAtomValue(seasonAtom);
  const queryKey = useAtomValue(seasonQueryKeyAtom);

  return { ...data, queryKey };
}

export function useSeason() {
  return useAtomValue(seasonAtom).current;
}
