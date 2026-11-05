import RoutingAndSlippageInfo from "@/components/RoutingAndSlippageInfo";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import {
  ROUTE_LIFETIME_MS,
  type RedemptionRoute,
  assertRouteFresh,
  buildRoute,
  quoteRoute,
  readRoutePoolState,
  revalidateRoute,
  routeABI,
} from "@/lib/redemption/route";
import { redemptionRouteSummary } from "@/lib/redemption/routeSummary";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { guardedWalletConnector } from "@/utils/guardedWallet";
import { REDEMPTION_WARMUP_MESSAGE, parseRedemptionAmount } from "@/utils/siloRedemption";
import type { Token } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccount, watchAccount } from "@wagmi/core";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type Address, formatUnits } from "viem";
import { estimateContractGas, simulateContract } from "viem/actions";
import { useAccount, useChainId, useConfig } from "wagmi";
import FeeFreeWithdrawalAmount from "./FeeFreeWithdrawalAmount";
import WithdrawAs from "./WithdrawAs";

export default function RoutedRedemption({
  siloToken,
  onBusyChange,
  unified,
}: {
  siloToken: Token;
  onBusyChange: (busy: boolean) => void;
  unified?: {
    amount: string;
    setAmount: (value: string) => void;
    outputToken: Token;
    outputs: Token[];
    onOutputChange: (token: Token) => void;
  };
}) {
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();
  const diamond = useProtocolAddress();
  const tokens = useTokenData();
  const { tokenPrices } = usePriceData();
  const client = config.getClient({ chainId });
  const farmer = useFarmerSilo();
  const balances = useFarmerBalances();
  const invalidateSun = useInvalidateSun();
  const queryClient = useQueryClient();
  const outputs = tokens.preferredTokens.filter((token) => !token.isMain && !token.isNative && !token.isLP);
  const [localOutputAddress, setOutputAddress] = useState<Address | undefined>(
    outputs.find((t) => t.symbol === "USDC")?.address ?? outputs[0]?.address,
  );
  const outputAddress = unified?.outputToken.address ?? localOutputAddress;
  const outputToken =
    unified?.outputToken ?? outputs.find((t) => t.address.toLowerCase() === outputAddress?.toLowerCase());
  const [localAmount, setLocalAmount] = useState("0");
  const amount = unified?.amount ?? localAmount;
  const setAmount = unified?.setAmount ?? setLocalAmount;
  const [bps, setBps] = useState(50);
  const [quote, setQuote] = useState<{ route: RedemptionRoute; key: string }>();
  const [preparing, setPreparing] = useState(false);
  const [confirmationChainId, setConfirmationChainId] = useState<number>();
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState<string>();
  const [now, setNow] = useState(Date.now());
  const lock = useRef(false);
  const controller = useRef<AbortController>();
  const mounted = useRef(false);
  const isPinto = siloToken.address.toLowerCase() === tokens.mainToken.address.toLowerCase();
  const wells = isPinto ? tokens.lpTokens.filter((t) => t.isWhitelisted).map((t) => t.address) : [siloToken.address];
  const kind = isPinto ? "pinto" : outputToken?.isMain ? "lp" : "lp-paired";
  const walletMatchesChain = account.status === "connected" && account.chainId === chainId;
  const key = [
    account.address,
    account.chainId,
    account.status,
    account.connector?.uid,
    chainId,
    diamond,
    siloToken.address,
    wells.join(","),
    outputAddress,
    amount,
    bps,
  ].join(":");
  const currentKey = useRef(key);
  currentKey.current = key;
  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      controller.current?.abort();
      onBusyChange(false);
    };
  }, [onBusyChange]);
  useEffect(() => {
    controller.current?.abort();
    setQuote(undefined);
    setError(undefined);
  }, [key]);
  const pools = useQuery({
    queryKey: ["siloRoutedRedemption", chainId, diamond, "readiness", account.address, siloToken.address, wells.join(","), kind],
    queryFn: () =>
      readRoutePoolState(client, {
        account: account.address!,
        diamond,
        pinto: tokens.mainToken.address,
        wells,
        kind,
      }),
    enabled: Boolean(account.address && wells.length && [8453, 1337, 41337].includes(chainId)),
    retry: false,
    staleTime: 5_000,
    refetchInterval: 15_000,
  });
  const { writeContractAsync, isConfirming, submitting } = useTransaction({
    confirmationChainId,
    successMessage: "Withdrawal and swaps completed",
    errorMessage: "Withdrawal and swaps failed",
    successCallback: () => {
      setAmount("0");
      setQuote(undefined);
      for (const queryKey of [...farmer.queryKeys, ...balances.queryKeys, ["siloRedemption"], ["siloRoutedRedemption"]])
        void queryClient.invalidateQueries({ queryKey, refetchType: "active" });
      invalidateSun("all", { refetchType: "active" });
    },
  });
  const busy = preparing || submitting || isConfirming;
  useEffect(() => {
    onBusyChange(busy);
  }, [busy, onBusyChange]);
  const route = quote?.key === key ? quote.route : undefined;
  const expired = route ? now - route.fetchedAt >= ROUTE_LIFETIME_MS : false;
  async function getQuote() {
    if (!account.address || !walletMatchesChain || !outputAddress || busy || lock.current) return;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const expectedKey = key;
    setQuoting(true);
    setQuote(undefined);
    setError(undefined);
    try {
      const parsed = parseRedemptionAmount(amount, siloToken.decimals);
      const fresh = await pools.refetch();
      if (fresh.error || !fresh.data) throw new Error("Could not verify deposit eligibility");
      if (fresh.data.warmingUp) throw new Error(REDEMPTION_WARMUP_MESSAGE);
      const result = await quoteRoute(client, fresh.data.pools, parsed, outputAddress, chainId, bps, abort.signal);
      assertRouteFresh(result);
      if (mounted.current && currentKey.current === expectedKey && !abort.signal.aborted) {
        setNow(Date.now());
        setQuote({ route: result, key: expectedKey });
      }
    } catch (cause) {
      if (!abort.signal.aborted && mounted.current && currentKey.current === expectedKey)
        setError((cause as Error).message);
    } finally {
      if (controller.current === abort && mounted.current) setQuoting(false);
    }
  }
  const quoteAction = useRef(getQuote);
  quoteAction.current = getQuote;
  let eligibleAmount = false;
  const available =
    pools.data?.pools[0]?.snapshot.deposits.reduce(
      (sum, deposit) => sum + (deposit.eligible ? deposit.available : 0n),
      0n,
    ) ?? 0n;
  try {
    const parsed = parseRedemptionAmount(amount, siloToken.decimals);
    eligibleAmount = parsed > 0n && parsed <= available;
  } catch {
    /* Wait for valid input. */
  }
  useEffect(() => {
    if (!unified || !walletMatchesChain || !eligibleAmount || pools.isPending || pools.isError || busy) return;
    const timer = setTimeout(() => void quoteAction.current(), 600);
    return () => clearTimeout(timer);
  }, [key, Boolean(unified), walletMatchesChain, eligibleAmount, pools.isPending, pools.isError, busy]);
  async function submit() {
    if (!route || busy || expired || lock.current || pools.isError) return;
    lock.current = true;
    setPreparing(true);
    onBusyChange(true);
    const expected = getAccount(config),
      expectedKey = key;
    let invalidated = false;
    const sameWallet = () => {
      const next = getAccount(config);
      return (
        next.status === "connected" &&
        next.address?.toLowerCase() === route.account.toLowerCase() &&
        next.chainId === route.chainId &&
        next.connector?.uid === expected.connector?.uid
      );
    };
    const unwatch = watchAccount(config, {
      onChange: () => {
        if (!sameWallet()) invalidated = true;
      },
    });
    const assertCurrent = () => {
      if (!mounted.current || invalidated || currentKey.current !== expectedKey || !sameWallet())
        throw new Error("Wallet, network or form changed. Review the route again.");
      assertRouteFresh(route);
    };
    try {
      assertCurrent();
      if (!expected.connector) throw new Error("Connect a wallet first");
      await revalidateRoute(client, route);
      assertCurrent();
      const transaction = {
        address: diamond,
        account: route.account,
        abi: routeABI,
        functionName: "advancedFarm" as const,
        args: [buildRoute(route)] as const,
      };
      let estimate: bigint;
      try {
        await simulateContract(client, transaction);
        estimate = await estimateContractGas(client, transaction);
      } catch {
        throw new Error(
          "The complete route could not be validated at current prices. Get a fresh route or try a smaller amount.",
        );
      }
      const gas = (estimate * 130n) / 100n + 50_000n;
      if (estimate <= 0n || gas > 16_777_216n)
        throw new Error("Route cannot fit safely in one transaction. Try a smaller amount.");
      assertCurrent();
      setConfirmationChainId(route.chainId);
      await writeContractAsync({
        ...transaction,
        gas,
        chainId,
        connector: guardedWalletConnector(expected.connector, { account: route.account, chainId }, assertCurrent),
      });
    } catch (cause) {
      setError((cause as Error).message);
      toast.error((cause as Error).message);
    } finally {
      unwatch();
      lock.current = false;
      setPreparing(false);
    }
  }
  const routingSummary =
    route && outputToken
      ? redemptionRouteSummary(route, siloToken, outputToken, tokens.preferredTokens, tokenPrices)
      : undefined;
  return (
    <div className="flex flex-col gap-4">
      {!unified && (
        <>
          <p className="text-sm text-pinto-gray-5">
            {isPinto
              ? "Split eligible Pinto across enabled Wells, weighted by their Pinto reserves."
              : "Withdraw eligible LP as its paired token."}{" "}
            Swap the paired assets through 0x into one token in your wallet. The withdrawal and swaps succeed together
            or revert together.
          </p>
          <p className="text-sm text-pinto-gray-5">
            The Pinto Well leg is fee-exempt. 0x and downstream pool fees, price impact and gas still apply. Withdrawn
            deposits lose their Stalk and Seeds. Deposits must be non-germinating and meet the protocol’s grown Stalk
            per BDV threshold to qualify.
          </p>
        </>
      )}
      <fieldset disabled={busy} className="flex flex-col gap-4 disabled:opacity-60">
        <FeeFreeWithdrawalAmount
          token={siloToken}
          amount={amount}
          setAmount={setAmount}
          deposits={pools.data?.pools[0]?.snapshot.deposits ?? []}
          disabled={busy}
          loading={pools.isPending || pools.isError}
        />
        {unified && outputToken ? (
          <WithdrawAs
            token={outputToken}
            outputs={unified.outputs}
            onChange={unified.onOutputChange}
            info={
              <div className="space-y-2">
                <p>
                  Fee-free exit is applied automatically to eligible deposits. Other swap fees, price impact and gas
                  still apply. Swapped tokens arrive in your External Wallet.
                </p>
                {!pools.isPending && !pools.isError && Boolean(pools.data?.pools.length) && (
                  <p>
                    {pools.data!.pools.length} enabled pool(s).{" "}
                    {isPinto && "This reserve-weighted split is not a guarantee of the best overall execution price."}
                  </p>
                )}
              </div>
            }
            disabled={busy}
            estimated={!expired ? route?.expected : undefined}
            loading={quoting || (walletMatchesChain && eligibleAmount && !route && !error && !pools.isError)}
          />
        ) : (
          <>
            <div>
              <Label>Receive in wallet</Label>
              <Select value={outputAddress} onValueChange={(v) => setOutputAddress(v as Address)}>
                <SelectTrigger aria-label="Final withdrawal token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {outputs.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div>
          <Label>Maximum slippage</Label>
          <Select value={String(bps)} onValueChange={(v) => setBps(Number(v))}>
            <SelectTrigger aria-label="Routed withdrawal slippage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value / 100}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
      {unified && !eligibleAmount && !pools.data?.warmingUp && (
        <p className="text-sm text-pinto-gray-5">
          {`Up to ${formatUnits(available, siloToken.decimals)} ${siloToken.symbol} qualifies. Deposits must be non-germinating and meet the grown Stalk requirement.`}
        </p>
      )}
      {!account.address ? (
        <p>Connect a wallet to check eligibility.</p>
      ) : !walletMatchesChain || ![8453, 1337, 41337].includes(chainId) ? (
        <p role="alert">Switch to Base to use this route.</p>
      ) : pools.isError ? (
        <p role="alert">Could not verify eligibility. Refresh before withdrawing.</p>
      ) : pools.isPending ? (
        <p>Checking enabled pools and eligible deposits…</p>
      ) : pools.data?.warmingUp ? (
        <p>{REDEMPTION_WARMUP_MESSAGE}</p>
      ) : !pools.data?.pools.length ? (
        <p>No fee-exempt exit pools are enabled on this deployment.</p>
      ) : !unified ? (
        <p className="text-sm">
          {pools.data.pools.length} enabled pool(s).{" "}
          {isPinto && "This reserve-weighted split is not a guarantee of the best overall execution price."}
        </p>
      ) : null}
      {(!unified || error || expired) && (
        <Button
          variant="outline"
          disabled={
            busy ||
            quoting ||
            !walletMatchesChain ||
            !account.address ||
            !outputToken ||
            ![8453, 1337, 41337].includes(chainId)
          }
          onClick={() => void getQuote()}
        >
          {quoting ? "Finding routes…" : "Get fresh route"}
        </Button>
      )}
      {error && <p role="alert">{error}</p>}
      {route && outputToken && (
        <div className="text-sm space-y-3" aria-label="Withdrawal route review">
          {routingSummary && (
            <RoutingAndSlippageInfo
              title="Withdrawal Routing"
              swapSummary={routingSummary}
              preferredSummary="swap"
              txnType="Withdraw"
              tokenIn={siloToken}
              tokenOut={outputToken}
              noMarginTopOnTrigger
              openDetailsOnClick
            />
          )}
          {!unified && (
            <p>
              Expected receipt: {formatUnits(route.expected, outputToken.decimals)} {outputToken.symbol}
            </p>
          )}
          <p>
            Minimum receipt: {formatUnits(route.minimum, outputToken.decimals)} {outputToken.symbol}
          </p>
          <p role={expired ? "alert" : undefined}>
            {expired
              ? "Route expired. Get a fresh route before signing."
              : `Quote valid for ${Math.max(0, Math.ceil((ROUTE_LIFETIME_MS - (now - route.fetchedAt)) / 1000))} seconds. The complete transaction is simulated before signing.`}
          </p>
        </div>
      )}
      <Button
        variant="gradient"
        rounded="full"
        width="full"
        size="xxl"
        disabled={
          !route ||
          !eligibleAmount ||
          expired ||
          busy ||
          quoting ||
          pools.isError ||
          !walletMatchesChain ||
          !account.address ||
          !outputToken
        }
        onClick={() => void submit()}
      >
        {busy ? "Preparing withdrawal…" : `Withdraw to ${outputToken?.symbol ?? "token"}`}
      </Button>
    </div>
  );
}
