import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { decodeReferralAddress } from "@/utils/referral";
import { estimateReferralBonus, readReferralRewards } from "@/utils/referralPreview";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId, usePublicClient } from "wagmi";

export default function useReferralRewardPreview(code: string, pinto = 0n, basePods = 0n) {
  const account = useAccount();
  const chainId = useChainId();
  const client = usePublicClient();
  const diamond = useProtocolAddress();
  const referrer = decodeReferralAddress(code);
  const self = !!account.address && referrer?.toLowerCase() === account.address.toLowerCase();
  const supported = !!account.address && !!diamond && account.chainId === chainId && client?.chain?.id === chainId;
  const active = supported && !!referrer && !self;
  const query = useQuery({
    queryKey: ["referralRewardPreview", chainId, diamond, account.address?.toLowerCase(), referrer?.toLowerCase()],
    queryFn: () => {
      if (!client || !diamond || !referrer) throw new Error("Referral context unavailable");
      return readReferralRewards(client, diamond, referrer);
    },
    enabled: active,
    staleTime: 15_000,
    refetchInterval: active ? 15_000 : false,
    retry: false,
  });
  // Do not reuse cached success after failed reads, while refreshing, or across context changes.
  // Offline/paused refreshes are not fetching, but their cached data is not verified either.
  const ready = active && query.fetchStatus === "idle" && !query.isError && !!query.data;
  const rewards = ready ? query.data : undefined;
  const status = !code
    ? "empty"
    : !referrer
      ? "invalid"
      : self
        ? "self"
        : !supported
          ? "disconnected"
          : query.isFetching
            ? "loading"
            : !ready
              ? "unavailable"
              : !rewards?.eligible
                ? "ineligible"
                : rewards.remainingPods === 0n
                  ? "exhausted"
                  : rewards.refereePercentage === 0n
                    ? "disabled"
                    : "eligible";
  const message = {
    empty: "",
    invalid: "Invalid referral code.",
    self: "You cannot use your own referral code.",
    disconnected: "Connect a supported wallet to check referral rewards.",
    loading: "Checking referral eligibility and remaining rewards…",
    unavailable: "Referral rewards unavailable; no bonus included in this preview.",
    ineligible: "This referrer is not eligible on-chain; no bonus is currently available.",
    exhausted: "The referral reward pool is exhausted; no bonus is currently available.",
    disabled: "Referee rewards are currently disabled.",
    eligible: "Eligible now. Bonus is estimated and may change before execution.",
  }[status];
  return { status, message, bonusPods: status === "eligible" ? estimateReferralBonus(pinto, basePods, rewards) : 0n };
}
