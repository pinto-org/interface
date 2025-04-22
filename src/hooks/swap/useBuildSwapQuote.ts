import { defaultQuerySettingsQuote } from "@/constants/query";
import { SwapBuilder } from "@/lib/Swap/swap-builder";
import { BeanSwapNodeQuote } from "@/lib/Swap/swap-router";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";
import { SWAP_QUERY_KEY_PREDICATE } from "./useSwap";

export default function useBuildSwapQuote(
  quote: BeanSwapNodeQuote | undefined,
  fromMode: FarmFromMode,
  toMode: FarmToMode,
  caller?: Address,
  recipient?: Address,
  disabled: boolean = false,
) {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  const swapCaller = caller ?? account.address;
  const swapRecipient = recipient ?? account.address;

  const queryKey = [
    SWAP_QUERY_KEY_PREDICATE,
    "builder",
    {
      args: [
        quote?.buyToken.address ?? "0",
        quote?.sellToken.address ?? "0",
        quote?.sellAmount.blockchainString ?? "0",
        quote?.buyAmount.blockchainString ?? "0",
        quote?.slippage,
        fromMode,
        swapCaller,
        swapRecipient,
        disabled,
      ],
    },
  ] as const;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!quote || !swapCaller || !swapRecipient || !account.address) {
        return undefined;
      }

      const builder = new SwapBuilder(chainId, config, account.address);
      await builder.build(quote, fromMode, toMode, swapCaller, swapRecipient);

      return builder;
    },
    enabled: !!quote && !!account && !!swapCaller && !!swapRecipient && !disabled,
    ...defaultQuerySettingsQuote,
  });

  return query.data;
}

/**
 * Same thing as useBuildSwapQuote, but only used when the output token can be ETH.
 * This is because SwapBuilder.build requires a simulation to derive the clipboard if the output token is ETH.
 *
 * Otherwise, use useBuildSwapQuote.
 */
export function useBuildSwapQuoteAsync(
  quote: BeanSwapNodeQuote | undefined,
  fromMode: FarmFromMode,
  toMode?: FarmToMode,
  caller?: Address,
  recipient?: Address,
) {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  const swapCaller = caller ?? account.address;
  const swapRecipient = recipient ?? account.address;

  const build = useCallback(async () => {
    if (!quote || !swapCaller || !swapRecipient || !account.address || !exists(toMode)) {
      return undefined;
    }

    const builder = new SwapBuilder(chainId, config, account.address);
    await builder.build(quote, fromMode, toMode, swapCaller, swapRecipient);
    return builder;
  }, [quote, fromMode, toMode, swapCaller, swapRecipient, account.address, chainId, config]);

  return build;
}
