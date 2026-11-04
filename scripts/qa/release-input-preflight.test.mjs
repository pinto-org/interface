import { afterEach, expect, test, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { keccak256, stringToHex } from "viem";
import { checkRecordedSources, checkReleaseInputs, sameAbi } from "./release-input-preflight.mjs";

const artifactFixture = vi.hoisted(() => ({ roots: [], modules: [], abis: {} }));
vi.mock("node:module", () => ({
  createRequire: () => (name) => {
    artifactFixture.modules.push(name);
    if (name !== "hardhat/internal/artifacts") throw new Error("Must not load the cwd-dependent Hardhat runtime");
    return { Artifacts: class {
      constructor(root) { artifactFixture.roots.push(root); }
      async readArtifact(contract) { return { abi: artifactFixture.abis[contract] ?? [] }; }
    } };
  },
}));

const content = "contract Sample {}";
const hash = keccak256(stringToHex(content));
const fixture = () => ({
  readOnly: true, topologyMatches: true, manifestRuntimeHashesVerified: 1,
  contractResults: [{ name: "Sample", runtimeMatches: true, artifactDigestMatches: true, staleSources: [] }],
  helperResults: [{ name: "Helper", runtimeMatches: true, staleSources: [] }],
  abiComparison: { autoConvertMatches: true, sowMatches: true },
  sourceComparisons: [{ source: "contracts/Sample.sol", currentHash: hash, compiledHash: hash, match: true }],
});

test("fresh source evidence passes without any chain call or file write", () => {
  const reads = [];
  expect(checkRecordedSources(fixture(), (path) => { reads.push(path); return content; })).toBe(1);
  expect(reads).toEqual(["contracts/Sample.sol"]);
});
test("source drift stops the input gate and identifies the changed contract", () => {
  expect(() => checkRecordedSources(fixture(), () => "contract Changed {}"))
    .toThrow("Release source drift: contracts/Sample.sol");
});
test("missing source cannot be treated as a match", () => {
  expect(() => checkRecordedSources(fixture(), () => { throw new Error("missing source"); })).toThrow("missing source");
});
test.each(["runtime", "artifact", "topology", "abi", "sources", "compiled"])("failed/incomplete %s evidence cannot establish input freshness", (part) => {
  const report = fixture();
  if (part === "runtime") report.contractResults[0].runtimeMatches = false;
  if (part === "artifact") report.contractResults[0].artifactDigestMatches = false;
  if (part === "topology") report.topologyMatches = false;
  if (part === "abi") report.abiComparison.sowMatches = false;
  if (part === "sources") report.sourceComparisons = [];
  if (part === "compiled") report.sourceComparisons[0].compiledHash = `0x${"00".repeat(32)}`;
  expect(() => checkRecordedSources(report, () => content)).toThrow();
});
test.each(["../private.txt", "contracts/../private.sol", "/contracts/Sample.sol", "contracts\\Sample.sol"])("rejects source path outside the recorded project contract namespace: %s", (source) => {
  const report = fixture(); report.sourceComparisons[0].source = source;
  let read = false;
  expect(() => checkRecordedSources(report, () => { read = true; return content; })).toThrow();
  expect(read).toBe(false);
});
test("ABI comparison ignores JSON property order but not tuple shape or array order", () => {
  const abi = [{ type: "function", name: "f", inputs: [{ type: "uint256", name: "a" }, { type: "bool", name: "b" }] }];
  expect(sameAbi(abi, [{ inputs: abi[0].inputs, name: "f", type: "function" }])).toBe(true);
  expect(sameAbi(abi, [{ ...abi[0], inputs: [...abi[0].inputs].reverse() }])).toBe(false);
  expect(sameAbi(abi, [{ ...abi[0], inputs: [{ type: "uint128", name: "a" }, abi[0].inputs[1]] }])).toBe(false);
});

const ownedDirectories = [];
afterEach(() => {
  for (const directory of ownedDirectories.splice(0)) rmSync(directory, { recursive: true });
});
function inputFixture() {
  const directory = mkdtempSync(join(tmpdir(), "pinto-input-preflight-test-"));
  ownedDirectories.push(directory);
  const protocolRoot = join(directory, "protocol"), uiRoot = join(directory, "ui");
  mkdirSync(join(protocolRoot, "contracts"), { recursive: true });
  mkdirSync(join(uiRoot, "src/constants/abi"), { recursive: true });
  const parityFile = join(directory, "parity.json");
  writeFileSync(parityFile, JSON.stringify(fixture()));
  writeFileSync(join(protocolRoot, "contracts/Sample.sol"), content);
  const autoAbi = [{ type: "function", name: "sample", inputs: [], outputs: [], stateMutability: "view" }];
  const sowAbi = [{ type: "function", name: "sowBlueprint", inputs: [], outputs: [], stateMutability: "nonpayable" }];
  writeFileSync(join(uiRoot, "src/constants/abi/autoConvertABI.ts"), `export const autoConvertABI = ${JSON.stringify(autoAbi)} as const;`);
  writeFileSync(join(uiRoot, "src/constants/abi/tractorReleaseABI.ts"), `export const sowReleaseABI = ${JSON.stringify(sowAbi)} as const;`);
  artifactFixture.roots = []; artifactFixture.modules = [];
  artifactFixture.abis = { OrderedDepositsFacet: autoAbi, SowBlueprint: sowAbi };
  return { parityFile, protocolRoot, uiRoot };
}
test("full input gate uses explicitly rooted artifact reads and labels its non-live scope", async () => {
  const config = inputFixture();
  const cwd = process.cwd();
  const result = await checkReleaseInputs(config);
  expect(result).toMatchObject({ readOnly: true, inputFreshnessOnly: true, sourceCount: 1, liveChainChecked: false });
  expect(artifactFixture.modules).toEqual(["hardhat/internal/artifacts"]);
  expect(artifactFixture.roots).toEqual([resolve(config.protocolRoot, "artifacts")]);
  expect(process.cwd()).toBe(cwd);
});
test.each(["autoConvertABI", "sowReleaseABI"])("full input gate rejects changed %s exports", async (name) => {
  const config = inputFixture();
  const file = name === "autoConvertABI" ? "autoConvertABI.ts" : "tractorReleaseABI.ts";
  writeFileSync(join(config.uiRoot, "src/constants/abi", file), `export const ${name} = [{ type: "function", name: "changed" }] as const;`);
  await expect(checkReleaseInputs(config)).rejects.toThrow(name === "autoConvertABI" ? "UI Auto Convert ABI drift" : "UI Sow ABI drift");
});

 test("input gate requires the policy facet and atomic Well admission ABI", async () => {
  const input = inputFixture();
  const policy = { type: "function", name: "getAutoConvertPricePolicy", inputs: [], outputs: [{ type: "uint16", name: "maxStepBps" }], stateMutability: "view" };
  const admission = { type: "function", name: "whitelistTokenWithAutoConvertPolicy", inputs: [], outputs: [], stateMutability: "payable" };
  artifactFixture.abis.AutoConvertPolicyFacet = [policy];
  artifactFixture.abis.WhitelistFacet = [admission];
  await expect(checkReleaseInputs(input)).rejects.toThrow("UI Auto Convert ABI drift");
  writeFileSync(join(input.uiRoot, "src/constants/abi/autoConvertABI.ts"), `export const autoConvertABI = ${JSON.stringify([...artifactFixture.abis.OrderedDepositsFacet, policy, admission])} as const;`);
  await expect(checkReleaseInputs(input)).resolves.toMatchObject({ autoConvertAbiEntries: 3 });
});
