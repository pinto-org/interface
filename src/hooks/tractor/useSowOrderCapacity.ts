import { TV } from "@/classes/TokenValue";
import { SILO_HELPERS_ADDRESS, TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import type { TractorTokenStrategyUnion } from "@/lib/Tractor/core/token-strategy";
import {
  checkSowFunding,
  maxSowFundedAmount,
  parseSowPinto,
  quoteSowCapacity,
  SOW_FORM_MINIMUM_CAP,
} from "@/lib/Tractor/sowOrder/sowCapacity";
import { useChainConstant } from "@/utils/chain";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId, usePublicClient } from "wagmi";

export default function useSowOrderCapacity(
  strategy: TractorTokenStrategyUnion,
  total: string,
  minimum: string,
  tip: string,
  enabled = true,
) {
  const account = useAccount();
  const chainId = useChainId();
  const client = usePublicClient();
  const diamond = useProtocolAddress();
  const pinto = useChainConstant(MAIN_TOKEN).address;
  const active = enabled && !!account.address && account.chainId === client?.chain?.id;
  const query = useQuery({
    queryKey: [
      "sowWithdrawalCapacity",
      chainId,
      account.address?.toLowerCase(),
      diamond,
      pinto,
      SILO_HELPERS_ADDRESS,
      TRACTOR_HELPERS_ADDRESS,
      strategy,
    ],
    queryFn: () => {
      if (!account.address || !client) throw new Error("Connect a supported wallet");
      return quoteSowCapacity(client, {
        account: account.address,
        diamond,
        pinto,
        siloHelpers: SILO_HELPERS_ADDRESS,
        tractorHelpers: TRACTOR_HELPERS_ADDRESS,
        strategy,
      });
    },
    enabled: active,
    staleTime: 15_000,
    refetchInterval: active ? 30_000 : false,
    retry: false,
  });
  // Never reuse successful data after a failed refresh or while changing context.
  const ready = active && !query.isFetching && !query.isError && query.data !== undefined;
  const gross = ready ? query.data?.pintos : undefined;
  const reward = parseSowPinto(tip) ?? 0n;
  // Both main forms reset minSoil to min(total, 25 Pinto) when amount changes.
  // Reserve all fills at that cap, not just one tip, for the slider endpoint.
  const max = gross === undefined ? undefined : maxSowFundedAmount(gross, SOW_FORM_MINIMUM_CAP, reward);
  const funded = gross !== undefined && checkSowFunding(gross, total, minimum, tip);
  const hasAmount = (parseSowPinto(total) ?? 0n) > 0n;
  return {
    ready,
    canProceed: ready && funded,
    exceeds: ready && hasAmount && !funded,
    maxAmount: max === undefined ? undefined : TV.fromBigInt(max, 6),
    message: !active
      ? "Connect a supported wallet to check withdrawable Pinto."
      : query.isFetching
        ? "Checking withdrawable Pinto…"
        : !ready
          ? "Unable to quote withdrawable Pinto. Try again before continuing."
          : gross === 0n
            ? "No withdrawable Pinto in the selected Silo deposits."
            : hasAmount && !funded
              ? "Total plus reserved operator tips exceeds current withdrawable Pinto."
              : "Pinto withdrawal value includes Well fees. Tips are reserved for minimum-sized fills; future prices and Soil may change.",
  };
}
