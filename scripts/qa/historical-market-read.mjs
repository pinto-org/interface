// QA ONLY: Anvil can retain historical storage but lose a facet's bytecode.
// This is an eth_call code override, never a node state/code mutation. Only
// reuse code whose hash exactly matches the hash Anvil reports as missing.
import assert from "node:assert/strict";
import { keccak256, parseAbi, toFunctionSelector } from "viem";

const diamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
const abi = parseAbi([
  "function harvestableIndex(uint256 fieldId) view returns (uint256)",
  "function facetAddress(bytes4 selector) view returns (address)",
]);

export async function readHistoricalHarvestable(client, blockNumber) {
  const request = { address: diamond, abi, functionName: "harvestableIndex", args: [0n], blockNumber };
  try { return await client.readContract(request); }
  catch (error) {
    const missingHash = String(error).match(/missing bytecode for code hash (0x[0-9a-f]{64})\b/i)?.[1];
    if (!missingHash) throw error;
    assert.match(await client.request({ method: "web3_clientVersion" }), /^anvil\//);
    assert.equal(await client.getChainId(), 1337);
    const facet = await client.readContract({ address: diamond, abi, functionName: "facetAddress",
      args: [toFunctionSelector("harvestableIndex(uint256)")], blockNumber });
    const code = await client.getCode({ address: facet });
    assert.ok(code && keccak256(code).toLowerCase() === missingHash.toLowerCase(), "missing historical bytecode hash mismatch");
    console.warn(`QA historical eth_call restores hash-verified facet bytecode at block ${blockNumber}`);
    return client.readContract({ ...request, stateOverride: [{ address: facet, code }] });
  }
}
