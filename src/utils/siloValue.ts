import type { TokenValue } from "@/classes/TokenValue";
import type { SiloTokenData } from "@/utils/types";

export function getTotalDepositedUsd(
  data: Pick<SiloTokenData, "totalDeposited" | "germinatingAmount"> | undefined,
  tokenUsdPrice: TokenValue | undefined,
): TokenValue | undefined {
  // Recorded PDV determines rewards; current token prices determine market value.
  return data && tokenUsdPrice ? data.totalDeposited.add(data.germinatingAmount).mul(tokenUsdPrice) : undefined;
}
