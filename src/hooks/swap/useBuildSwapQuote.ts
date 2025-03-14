import { SwapBuilder } from "@/lib/Swap/swap-builder";
import { BeanSwapNodeQuote } from "@/lib/Swap/swap-router";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";

export default function useBuildSwapQuote(
  quote: BeanSwapNodeQuote | undefined,
  fromMode: FarmFromMode,
  toMode: FarmToMode,
  caller?: Address,
  recipient?: Address,
) {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

  return useMemo(() => {
    const swapCaller = caller ?? account.address;
    const swapRecipient = recipient ?? account.address;

    if (!quote || !swapCaller || !swapRecipient) {
      return undefined;
    }

    const builder = new SwapBuilder(chainId, config);

    builder.build(quote, fromMode, toMode, swapCaller, swapRecipient);

    return builder;
  }, [quote, chainId, config, fromMode, toMode, caller, recipient, account.address]);
}
