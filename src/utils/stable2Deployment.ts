import { type Address, type Hex, getAddress, isAddress, keccak256, zeroAddress } from "viem";

export type Stable2Deployment = { address: Address; runtimeHash: Hex };

/** Public build configuration from the verified release manifest, never a guessed deployment. */
export function configuredStable2Deployment(
  address: string | undefined,
  runtimeHash: string | undefined,
  reservedAddresses: readonly Address[],
): Stable2Deployment | undefined {
  if (!address && !runtimeHash) return undefined; // Existing Base release remains supported.
  if (
    !address ||
    !isAddress(address) ||
    address.toLowerCase() === zeroAddress ||
    reservedAddresses.some((reserved) => reserved.toLowerCase() === address.toLowerCase())
  ) {
    throw new Error(
      "Invalid VITE_PINTO_STABLE2_ADDRESS: use the replacement Well-function address from the release manifest",
    );
  }
  if (!runtimeHash || !/^0x[0-9a-fA-F]{64}$/.test(runtimeHash) || /^0x0{64}$/.test(runtimeHash)) {
    throw new Error(
      "VITE_PINTO_STABLE2_RUNTIME_HASH must be the nonzero runtime code hash from the same release manifest",
    );
  }
  return { address: getAddress(address), runtimeHash: runtimeHash.toLowerCase() as Hex };
}

/** Code identity is checked at the same block/chain as the Well metadata being classified. */
export function assertStable2Runtime(code: Hex | undefined, deployment: Stable2Deployment): void {
  if (!code || code === "0x" || keccak256(code) !== deployment.runtimeHash) {
    throw new Error(
      "Configured PintoStable2 runtime does not match the release manifest. Conversion quotes are unavailable.",
    );
  }
}
