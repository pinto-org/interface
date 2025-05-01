import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { STALK } from "@/constants/internalTokens";
import { defaultQuerySettingsQuote } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { SiloConvert } from "@/lib/siloConvert/SiloConvert";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useConfig, useReadContract } from "wagmi";
import { useSiloConvertResult } from "./useSiloConvertResult";

/**
 * NOTE: B/c 0xV2 utilizes permits, LP<>LP convert quotes will fail if the local block time is further ahead than the permit's expiration.
 * Testing LP<>LP converts locally must be done by impersonating an account that already has deposits on a fork that has not been forwarded.
 */

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

// ------------------------------ CONVERT DOWN PENALTY ------------------------------

export interface SiloConvertGrownStalkPenaltyBreakdown {
  newGrownStalk: TV;
  lossGrownStalk: TV;
  isPenalty: boolean;
  penaltyRatio: number;
}

const selectGrownStalkPenalty = (result: readonly [bigint, bigint]) => {
  const newGrownStalk = TV.fromBigInt(result[0], STALK.decimals);
  const lossGrownStalk = TV.fromBigInt(result[1], STALK.decimals);

  const totalGrownStalk = newGrownStalk.add(lossGrownStalk);

  const isPenalty = lossGrownStalk.gt(0);
  const penaltyRatio = isPenalty ? lossGrownStalk.div(totalGrownStalk).toNumber() : 0;

  return {
    newGrownStalk,
    lossGrownStalk,
    isPenalty,
    penaltyRatio,
  };
};

export const useSiloConvertDownPenaltyQuery = (
  source: Token,
  target: Token | undefined,
  result: ReturnType<typeof useSiloConvertResult>,
  enabled: boolean = true,
) => {
  const [struct, setStruct] = useState<SiloConvertGrownStalkPenaltyBreakdown>({
    newGrownStalk: TV.ZERO,
    lossGrownStalk: TV.ZERO,
    isPenalty: false,
    penaltyRatio: 0,
  });
  const diamond = useProtocolAddress();

  const isConvertDown = Boolean(source.isMain && target?.isLP);
  const well = isConvertDown ? target : undefined;

  const fromBdv = result?.fromBdv;
  const grownStalk = result?.fromGrownStalk;

  const queryEnabled = Boolean(well && fromBdv?.gt(0) && isConvertDown && enabled);

  const query = useReadContract({
    address: diamond,
    abi: diamondABI,
    functionName: "downPenalizedGrownStalk",
    args: [well?.address ?? "0x", fromBdv?.toBigInt() ?? 0n, grownStalk?.toBigInt() ?? 0n],
    query: {
      enabled: queryEnabled,
      select: selectGrownStalkPenalty,
    },
  });

  useEffect(() => {
    const amount = query.data?.lossGrownStalk ?? TV.ZERO;
    const structAmount = struct?.lossGrownStalk ?? TV.ZERO;

    if (amount.eq(structAmount)) return;
    query.data && setStruct(query.data);
  }, [query.data]);

  return {
    ...query,
    data: struct,
  };
};
