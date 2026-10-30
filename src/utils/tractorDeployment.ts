import { type Address, type PublicClient, isAddress, parseAbi, toFunctionSelector, zeroAddress } from "viem";

/** Release addresses are public build configuration, never private wallet keys. */
export function configuredTractorAddress(value: string | undefined, legacy: Address): Address {
  if (!value) return legacy;
  if (!isAddress(value) || value.toLowerCase() === zeroAddress) throw new Error("Invalid Tractor deployment address");
  return value;
}

const deploymentABI = parseAbi([
  "function facetAddress(bytes4 selector) view returns(address)",
  "function beanstalk() view returns(address)",
  "function siloHelpers() view returns(address)",
  "function tractorHelpers() view returns(address)",
  "function version() view returns(string)",
]);

/** Never sign new orders against legacy immutable helpers after the Diamond upgrade. */
export async function assertTractorDeploymentReady(
  client: PublicClient,
  diamond: Address,
  deployment: { explicit: boolean; blueprint: Address; silo: Address; tractor: Address; requiredVersion?: string },
) {
  const blockNumber = await client.getBlockNumber({ cacheTime: 0 });
  const read = (address: Address, functionName: "beanstalk" | "siloHelpers" | "tractorHelpers" | "version") =>
    client.readContract({ address, abi: deploymentABI, functionName, blockNumber });
  // A required blueprint version applies even before (or without) the Diamond upgrade.
  // Existing orders never use this creation guard; their signed targets remain authoritative.
  if (!deployment.requiredVersion) {
    const facet = await client.readContract({
      address: diamond,
      abi: deploymentABI,
      functionName: "facetAddress",
      args: [toFunctionSelector("getAutoConvertOutputLock(address,int96)")],
      blockNumber,
    });
    if (facet === zeroAddress) return; // Preserve the existing Sow creation policy.
  }
  if (!deployment.explicit)
    throw new Error("The updated Tractor deployment is not configured. New orders are temporarily unavailable.");
  const [protocol, silo, tractor, siloCode, tractorCode, version] = await Promise.all([
    read(deployment.blueprint, "beanstalk"),
    read(deployment.blueprint, "siloHelpers"),
    read(deployment.blueprint, "tractorHelpers"),
    client.getCode({ address: deployment.silo, blockNumber }),
    client.getCode({ address: deployment.tractor, blockNumber }),
    deployment.requiredVersion ? read(deployment.blueprint, "version") : undefined,
  ]);
  // Helper immutables have no public getters. Their exact runtime/constructor
  // bindings must be verified by the release manifest, not guessed through an ABI.
  if (
    protocol.toLowerCase() !== diamond.toLowerCase() ||
    silo.toLowerCase() !== deployment.silo.toLowerCase() ||
    tractor.toLowerCase() !== deployment.tractor.toLowerCase() ||
    !siloCode ||
    siloCode === "0x" ||
    !tractorCode ||
    tractorCode === "0x"
  ) {
    throw new Error("Tractor deployment does not match this protocol. Do not sign this order.");
  }
  if (deployment.requiredVersion && version !== deployment.requiredVersion) {
    throw new Error(
      `New orders require Tractor blueprint version ${deployment.requiredVersion}. Do not sign this order.`,
    );
  }
}
