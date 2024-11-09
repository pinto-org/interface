import { exists } from "@/utils/utils";

export const bigIntGt = (left: bigint | undefined, right: bigint | undefined = 0n) => {
  if (!exists(left) || !exists(right)) return false;
  return left > right;
};
