import { TV } from "@/classes/TokenValue";
import { defaultQuerySettingsQuote } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { SiloConvert } from "@/lib/siloConvert/SiloConvert";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useConfig } from "wagmi";

export const siloConvertQueryPrefix = ["silo-convert"] as const;

export default function useSiloConvert() {
  const diamond = useProtocolAddress();
  const account = useAccount();

  const config = useConfig();
  const chainId = useChainId();

  return useMemo(() => {
    const address = account.address ?? ("0x" as `0x${string}`);
    return new SiloConvert(diamond, address, config, chainId);
  }, [diamond, account.address, config, chainId]);
}

export function useClearSiloConvertQueries() {
  const qc = useQueryClient();

  const clear = useCallback(() => {
    qc.invalidateQueries({ queryKey: siloConvertQueryPrefix, exact: false, type: "all" });
  }, [qc]);

  return clear;
}

// ------------------------------ MAX CONVERT ------------------------------

export function useSiloMaxConvertQuery(
  siloConvert: SiloConvert,
  farmerDeposits: TokenDepositData | undefined,
  source: Token | undefined,
  target: Token | undefined,
  enabled: boolean = true,
) {
  const account = useAccount();

  const farmerMax = farmerDeposits?.convertibleAmount?.toBlockchain();

  const queryKey = useMemo(
    () => [
      siloConvertQueryPrefix,
      "max-convert",
      { source: source?.address, target: target?.address, farmerMaxConvertible: farmerMax },
    ],
    [source, target, farmerMax],
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!source || !target || !farmerDeposits) return TV.ZERO;
      return siloConvert.getMaxConvert(source, target, farmerDeposits.convertibleDeposits).catch((e) => {
        console.error("Error fetching max convert: ", e);
        return TV.ZERO;
      });
    },
    enabled: !!account.address && !!source?.address && !!target?.address && enabled && !!farmerMax,
    ...defaultQuerySettingsQuote,
    refetchInterval: 20_000,
    staleTime: 20_000,
  });

  return { ...query, queryKey };
}

// ------------------------------ CONVERT QUOTE ------------------------------

export function useSiloConvertQuote(
  siloConvert: SiloConvert,
  source: Token,
  target: Token | undefined,
  amountIn: string,
  convertibleDeposits: DepositData[] | undefined,
  slippage: number,
  enabled: boolean = true,
) {
  const account = useAccount();

  const queryKey = useMemo(
    () => [siloConvertQueryPrefix, "quote", account.address, source.address, target?.address, amountIn, slippage],
    [account.address, source.address, target?.address, amountIn, slippage],
  );

  const sourceAmount = TV.fromHuman(amountIn, source.decimals);

  const queryEnabled = !!account.address && !!convertibleDeposits?.length && sourceAmount.gt(0) && !!target && enabled;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!account.address || !convertibleDeposits?.length || sourceAmount.lte(0) || !target) {
        return;
      }

      try {
        return siloConvert.quote(source, target, convertibleDeposits, sourceAmount, slippage);
      } catch (e) {
        console.error("Error fetching quote: ", e);
        throw e;
      }
    },
    enabled: queryEnabled,
    ...defaultQuerySettingsQuote,
    retry: false,
  });

  const isDefaultConvert = source.isMain || target?.isMain;

  useEffect(() => {
    if (!query.error || sourceAmount.lte(0) || !target?.address) {
      return;
    }

    const msg = isDefaultConvert ? "Quote failed. Try lowering amount" : "Quote failed. Try increasing slippage";
    toast.dismiss();
    toast.error(msg);
  }, [query.error, target?.address, isDefaultConvert, sourceAmount]);

  return { ...query, queryKey };
}
