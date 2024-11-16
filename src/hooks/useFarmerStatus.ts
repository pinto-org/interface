import { farmerStatusAtom } from "@/state/farmer/status.atoms";
import { useAtomValue } from "jotai";

export default function useFarmerStatus() {
  return useAtomValue(farmerStatusAtom);
}
