import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { guardedWalletConnector } from "@/utils/guardedWallet";
import {
  parseRedemptionAmount,
  quoteRedemption,
  readRedemptionSnapshot,
  redemptionMinimum,
  redemptionSelectionKey,
  redemptionWriteFunction,
  revalidateRedemption,
  selectRedemptionDeposits,
} from "@/utils/siloRedemption";
import { FarmToMode, type Token } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccount, watchAccount } from "@wagmi/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { type Address, formatUnits } from "viem";
import { estimateContractGas, simulateContract } from "viem/actions";
import { useAccount, useChainId, useConfig } from "wagmi";
import FeeFreeWithdrawalAmount from "./FeeFreeWithdrawalAmount";
import RoutedRedemption from "./RoutedRedemption";

export default function RedeemDeposits(props: { siloToken: Token; onBusyChange: (busy: boolean) => void }) {
  const [route, setRoute] = useState(false);
  const [busy, setBusy] = useState(false);
  const onBusyChange = useCallback(
    (value: boolean) => {
      setBusy(value);
      props.onBusyChange(value);
    },
    [props.onBusyChange],
  );
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        type="single"
        variant="outline"
        value={route ? "routed" : "direct"}
        onValueChange={(value) => {
          if (value) setRoute(value === "routed");
        }}
        disabled={busy}
        aria-label="Withdrawal routing"
        className="grid grid-cols-2 items-stretch gap-2"
      >
        {[
          ["direct", "Direct withdrawal"],
          ["routed", "Withdraw to one token"],
        ].map(([value, label]) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="w-full h-full min-h-[2.5rem] sm:min-h-[2.75rem] py-2 rounded-full bg-pinto-gray-1 border-pinto-gray-3 text-[1rem] leading-[1.1rem] sm:text-[1.25rem] sm:leading-[1.3875rem] -tracking-[0.02em] font-[400] text-black whitespace-normal"
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {route ? (
        <RoutedRedemption {...props} onBusyChange={onBusyChange} />
      ) : (
        <DirectRedemption {...props} onBusyChange={onBusyChange} />
      )}
    </div>
  );
}

/** A separate voluntary withdrawal, not a Silo convert and not a wallet-age exemption. */
function DirectRedemption({ siloToken, onBusyChange }: { siloToken: Token; onBusyChange: (busy: boolean) => void }) {
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();
  const diamond = useProtocolAddress();
  const tokens = useTokenData();
  const activeWells = tokens.lpTokens.filter((token) => token.isWhitelisted);
  const farmer = useFarmerSilo();
  const balances = useFarmerBalances();
  const invalidateSun = useInvalidateSun();
  const queryClient = useQueryClient();
  const [wellAddress, setWellAddress] = useState<Address>(siloToken.isLP ? siloToken.address : activeWells[0]?.address);
  const [amount, setAmount] = useState("0");
  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [slippageBps, setSlippageBps] = useState(50);
  const [lpOutput, setLpOutput] = useState<"pinto" | "paired">("pinto");
  const [refreshing, setRefreshing] = useState(false);
  const preparing = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      onBusyChange(false);
    };
  }, [onBusyChange]);
  const client = config.getClient({ chainId });
  const isPinto = siloToken.address.toLowerCase() === tokens.mainToken.address.toLowerCase();
  const kind = isPinto ? "pinto" : lpOutput === "paired" ? "lp-paired" : "lp";
  const request = {
    account: account.address!,
    diamond,
    well: wellAddress,
    pinto: tokens.mainToken.address,
    kind,
  } as const;
  const snapshot = useQuery({
    queryKey: ["siloRedemption", chainId, diamond, account.address, siloToken.address, wellAddress, kind],
    queryFn: () => readRedemptionSnapshot(client, request),
    enabled: Boolean(account.address && diamond && wellAddress && (isPinto || siloToken.isLP)),
    staleTime: 5_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  const selection = useMemo(() => {
    try {
      const parsed = parseRedemptionAmount(amount, siloToken.decimals);
      if (parsed === 0n) return { value: undefined, error: undefined };
      return { value: selectRedemptionDeposits(snapshot.data?.deposits ?? [], parsed), error: undefined };
    } catch (error) {
      return { value: undefined, error: (error as Error).message };
    }
  }, [amount, siloToken.decimals, snapshot.data]);
  const quote = useQuery({
    queryKey: [
      "siloRedemptionQuote",
      chainId,
      diamond,
      account.address,
      wellAddress,
      kind,
      snapshot.data?.blockNumber.toString(),
      selection.value && redemptionSelectionKey(selection.value),
    ],
    queryFn: () => quoteRedemption(client, snapshot.data!, selection.value!),
    enabled: Boolean(snapshot.data?.enabled && selection.value && !snapshot.isError),
    staleTime: 5_000,
    retry: false,
  });
  const outputToken = [tokens.mainToken, ...tokens.preferredTokens].find(
    (token) => token.address.toLowerCase() === snapshot.data?.outputToken.toLowerCase(),
  );
  let minOutput: bigint | undefined;
  try {
    if (quote.data) minOutput = redemptionMinimum(quote.data, slippageBps);
  } catch {
    /* dust output */
  }
  const { writeContractAsync, isConfirming, submitting } = useTransaction({
    successMessage: "Fee-exempt withdrawal successful",
    errorMessage: "Fee-exempt withdrawal failed",
    successCallback: () => {
      setAmount("0");
      for (const queryKey of [
        ...farmer.queryKeys,
        ...balances.queryKeys,
        ["siloRedemption"],
        ["siloRedemptionQuote"],
      ]) {
        void queryClient.invalidateQueries({ queryKey, refetchType: "active" });
      }
      invalidateSun("all", { refetchType: "active" });
    },
  });
  const busy = refreshing || isConfirming || submitting;
  useEffect(() => {
    onBusyChange(busy);
  }, [busy, onBusyChange]);
  const disabled =
    busy ||
    !account.address ||
    !selection.value ||
    !minOutput ||
    !outputToken ||
    !snapshot.data?.enabled ||
    snapshot.isError ||
    quote.isError ||
    quote.isFetching;

  async function submit() {
    if (disabled || preparing.current || !selection.value || !snapshot.data || !minOutput) return;
    preparing.current = true;
    setRefreshing(true);
    onBusyChange(true);
    const reviewedSelection = selection.value;
    const reviewedSnapshot = snapshot.data;
    const reviewedMinimum = minOutput;
    const expected = getAccount(config);
    let invalidated = false;
    const sameContext = () => {
      const current = getAccount(config);
      return (
        current.status === "connected" &&
        current.address?.toLowerCase() === request.account.toLowerCase() &&
        current.chainId === chainId &&
        current.connector?.uid === expected.connector?.uid
      );
    };
    const unwatch = watchAccount(config, {
      onChange: () => {
        if (!sameContext()) invalidated = true;
      },
    });
    const assertCurrent = () => {
      if (!mounted.current || invalidated || !sameContext())
        throw new Error("Withdrawal cancelled: wallet, network or form changed. Review again.");
    };
    try {
      assertCurrent();
      if (!expected.connector) throw new Error("Connect a wallet first");
      // Never silently replace the reviewed crates or lower the reviewed minimum.
      const { selected, deadline } = await revalidateRedemption(
        client,
        reviewedSnapshot,
        reviewedSelection,
        reviewedMinimum,
      );
      assertCurrent();
      const transaction = {
        address: diamond,
        account: request.account,
        abi: autoConvertABI,
        functionName: redemptionWriteFunction(reviewedSnapshot.kind),
        args: [wellAddress, selected.stems, selected.amounts, reviewedMinimum, deadline, Number(destination)],
      } as const;
      // Match the actual write, including its sender, minimum and deadline. A
      // little headroom also covers nested-call EIP-150 forwarding on fee exits.
      await simulateContract(client, transaction);
      const estimate = await estimateContractGas(client, transaction);
      const gas = (estimate * 130n) / 100n + 50_000n;
      if (gas > 16_777_216n) throw new Error("Withdrawal is too large for one transaction. Choose a smaller amount.");
      assertCurrent();
      await writeContractAsync({
        ...transaction,
        gas,
        chainId,
        connector: guardedWalletConnector(expected.connector, { account: request.account, chainId }, assertCurrent),
      });
    } catch (error) {
      toast.error((error as Error).message);
      void snapshot.refetch();
    } finally {
      unwatch();
      preparing.current = false;
      setRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-pinto-gray-5">
        {isPinto
          ? "Sell qualified deposited Pinto for a Well’s paired token"
          : "Withdraw qualified LP deposits directly as Pinto or the Well’s paired token"}{" "}
        without the Well’s swap fee. This withdraws the selected deposits and forfeits their Stalk and Seeds. Price
        impact and network gas still apply.
      </p>
      <p className="text-sm text-pinto-gray-5">
        Deposits must be non-germinating and meet the protocol’s grown Stalk per BDV threshold. The threshold is
        calibrated once to 24 Seasons of the lowest-growth eligible LP, rather than time in your wallet. Pinto may take
        longer to qualify.
      </p>
      <fieldset disabled={busy} className="flex flex-col gap-4 disabled:opacity-60">
        {!isPinto && (
          <div>
            <Label className="flex h-10 items-center">Receive</Label>
            <Select
              value={lpOutput}
              onValueChange={(value) => {
                setLpOutput(value as "pinto" | "paired");
                setAmount("0");
              }}
              disabled={busy}
            >
              <SelectTrigger aria-label="LP withdrawal output">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pinto">Pinto</SelectItem>
                <SelectItem value="paired">Well’s paired token</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {isPinto && (
          <div>
            <Label className="flex h-10 items-center">Output Well</Label>
            <Select
              value={wellAddress}
              onValueChange={(value) => {
                setWellAddress(value as Address);
                setAmount("0");
              }}
              disabled={busy}
            >
              <SelectTrigger aria-label="Output Well">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeWells.map((well) => (
                  <SelectItem key={well.address} value={well.address}>
                    {well.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <FeeFreeWithdrawalAmount
          token={siloToken}
          amount={amount}
          setAmount={setAmount}
          deposits={snapshot.data?.deposits ?? []}
          disabled={busy}
          loading={snapshot.isPending || snapshot.isError}
        />
        <div>
          <Label className="flex h-10 items-center">Destination</Label>
          <DestinationBalanceSelect balanceTo={destination} setBalanceTo={setDestination} />
        </div>
        <div>
          <Label className="flex h-10 items-center">Maximum slippage</Label>
          <Select value={String(slippageBps)} onValueChange={(value) => setSlippageBps(Number(value))} disabled={busy}>
            <SelectTrigger aria-label="Maximum slippage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 50, 100].map((bps) => (
                <SelectItem key={bps} value={String(bps)}>
                  {bps / 100}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
      {!account.address ? (
        <p>Connect a wallet to check eligibility.</p>
      ) : snapshot.isPending ? (
        <p>Checking on-chain eligibility…</p>
      ) : snapshot.isError ? (
        <p role="alert">Could not verify eligibility. No transaction will be submitted.</p>
      ) : !snapshot.data?.supported ? (
        <p>This deployment does not support this fee-exempt deposit exit yet.</p>
      ) : !snapshot.data.enabled ? (
        <p>Fee-exempt exits are not enabled for this Well.</p>
      ) : null}
      {selection.error && amount !== "0" && <p role="alert">{selection.error}</p>}
      {quote.isError && (
        <p role="alert">The selected deposits cannot currently be quoted safely. Refresh or choose a smaller amount.</p>
      )}
      {quote.data !== undefined && outputToken && minOutput !== undefined && selection.value && !quote.isError && (
        <div className="rounded-xl border p-4 text-sm space-y-2">
          <p>
            Expected receipt: {formatUnits(quote.data, outputToken.decimals)} {outputToken.symbol}
          </p>
          <p>
            Minimum receipt: {formatUnits(minOutput, outputToken.decimals)} {outputToken.symbol}
          </p>
          <p>{selection.value.stems.length} deposit(s) selected; their associated Stalk and Seeds will be forfeited.</p>
          <p>
            20-minute deadline from quote block {snapshot.data?.blockNumber.toString()}. The exact transaction is
            simulated again before signing.
          </p>
        </div>
      )}
      <Button onClick={() => void snapshot.refetch()} variant="outline" disabled={busy || !account.address}>
        Refresh eligibility and quote
      </Button>
      <Button onClick={submit} disabled={disabled} variant="gradient" rounded="full" width="full" size="xxl">
        {busy
          ? "Preparing withdrawal…"
          : isPinto
            ? "Withdraw and sell Pinto"
            : lpOutput === "paired"
              ? "Withdraw LP as paired token"
              : "Withdraw LP as Pinto"}
      </Button>
    </div>
  );
}
