import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTokenData from "@/state/useTokenData";
import { readRedemptionSnapshot } from "@/utils/siloRedemption";
import type { Token } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { getBlock } from "viem/actions";
import { useAccount, useChainId, useConfig } from "wagmi";

export default function useSiloRedemptionAvailability(token: Token, hasDeposits: boolean) {
  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const diamond = useProtocolAddress();
  const tokens = useTokenData();
  const isPinto = token.address.toLowerCase() === tokens.mainToken.address.toLowerCase();
  const wells = isPinto
    ? tokens.lpTokens.filter((well) => well.isWhitelisted).map((well) => well.address)
    : token.isLP ? [token.address] : [];
  const enabled = Boolean(account.address && hasDeposits && !token.isSiloWrapped && wells.length &&
    [8453, 1337, 41337].includes(chainId));
  const query = useQuery({
    queryKey: ["siloRedemption", "availability", chainId, diamond, account.address, token.address, wells.join(",")],
    enabled,
    queryFn: async () => {
      if (!account.address) return false;
      const client = config.getClient({ chainId });
      const block = await getBlock(client, { blockTag: "latest" });
      // Any enabled Well with qualified, unlocked deposits makes an exit available.
      for (const well of wells) {
        const snapshot = await readRedemptionSnapshot(client, {
          account: account.address,
          diamond,
          pinto: tokens.mainToken.address,
          well,
          kind: isPinto ? "pinto" : "lp",
        }, block.number);
        if (snapshot.enabled && snapshot.deposits.some((deposit) => deposit.eligible && deposit.available > 0n))
          return true;
      }
      return false;
    },
    staleTime: 5_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  return {
    canExit: enabled && !query.isError && query.data === true,
    isPending: enabled && query.isPending,
    isError: enabled && query.isError,
  };
}
