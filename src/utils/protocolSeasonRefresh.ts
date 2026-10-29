export type SeasonSnapshot = { chainId: number; diamond: string; season: number };

/** Initial loads/network switches fetch their own keys; only an observed transition invalidates. */
export function hasProtocolSeasonChanged(previous: SeasonSnapshot | undefined, current: SeasonSnapshot) {
  return Boolean(
    previous &&
      previous.chainId === current.chainId &&
      previous.diamond.toLowerCase() === current.diamond.toLowerCase() &&
      previous.season > 0 &&
      current.season > 0 &&
      previous.season !== current.season,
  );
}

/** Match this deployment's live reads, not unrelated contracts/chains or pinned historical reads. */
export function isProtocolSeasonQuery(key: readonly unknown[], chainId: number, diamond: string): boolean {
  const sameAddress = (value: unknown) => typeof value === "string" && value.toLowerCase() === diamond.toLowerCase();
  const options = key[1] as Record<string, unknown> | undefined;
  if (key[0] === "readContract" || key[0] === "readContracts") {
    if (
      !options ||
      typeof options !== "object" ||
      options.blockNumber !== undefined ||
      (options.blockTag !== undefined && options.blockTag !== "latest")
    )
      return false;
    if (key[0] === "readContract") return options.chainId === chainId && sameAddress(options.address);
    return (
      Array.isArray(options.contracts) &&
      options.contracts.some(
        (contract) => contract && (contract.chainId ?? options.chainId) === chainId && sameAddress(contract.address),
      )
    );
  }
  if (["depositsWithLocks", "siloRedemption", "siloRedemptionQuote"].includes(String(key[0])))
    return key[1] === chainId && sameAddress(key[2]);
  // These existing event-query keys identify the configured protocol by chain.
  return (key[0] === "plantEvents" || key[0] === "depositEvents") && key[2] === chainId;
}
