import { isAddress, parseAbi, toFunctionSelector, zeroAddress, type Address, type PublicClient } from "viem";

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
]);

/** Never sign new orders against legacy immutable helpers after the Diamond upgrade. */
export async function assertTractorDeploymentReady(
  client: PublicClient,
  diamond: Address,
  deployment: { explicit: boolean; blueprint: Address; silo: Address; tractor: Address },
) {
  const blockNumber = await client.getBlockNumber({ cacheTime: 0 });
  const read = (address: Address, functionName: "beanstalk" | "siloHelpers" | "tractorHelpers") =>
    client.readContract({ address, abi: deploymentABI, functionName, blockNumber });
  const facet = await client.readContract({
    address: diamond,
    abi: deploymentABI,
    functionName: "facetAddress",
    args: [toFunctionSelector("getAutoConvertOutputLock(address,int96)")],
    blockNumber,
  });
  if (facet === zeroAddress) return; // Existing, pre-upgrade deployments retain their current order path.
  if (!deployment.explicit)
    throw new Error(
      "Auto Convert is active, but the updated Tractor deployment is not configured. New orders are temporarily unavailable.",
    );
  const [protocol, silo, tractor, siloCode, tractorCode] = await Promise.all([
    read(deployment.blueprint, "beanstalk"),
    read(deployment.blueprint, "siloHelpers"),
    read(deployment.blueprint, "tractorHelpers"),
    client.getCode({ address: deployment.silo, blockNumber }),
    client.getCode({ address: deployment.tractor, blockNumber }),
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
}
