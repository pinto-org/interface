import { stringEq } from "@/utils/string";
import { Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook to clear allowances for a token.
 * @param token - The token to clear allowances for. If no token is provided, all allowances will be cleared.
 * @returns A function to clear allowances.
 */
export default function useClearTokenAllowances() {
  const qc = useQueryClient();

  const clearAllowances = useCallback(
    (token?: Token) => {
      qc.removeQueries({
        predicate: ({ queryKey }) => {
          if (!Array.isArray(queryKey)) return false;
          if (queryKey?.[0] !== "readContract") return false;
          const obj = queryKey?.[1];
          if (token?.address) {
            return obj?.functionName === "allowance" && stringEq(obj?.address, token?.address);
          }
          return obj?.functionName === "allowance";
        },
      });
    },
    [qc],
  );

  return clearAllowances;
}
