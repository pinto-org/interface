// Read-only QA input guard. This is NOT a substitute for live runtime/topology verification.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { runInNewContext } from "node:vm";
import { keccak256, stringToHex } from "viem";
import ts from "typescript";

const canonical = (value) => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonical(v)]))
    : value;
export const sameAbi = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

export function checkRecordedSources(report, readSource) {
  assert.equal(report.readOnly, true, "Expected a saved read-only release parity report");
  assert.equal(report.topologyMatches, true, "Saved topology did not pass");
  assert.ok(report.contractResults?.length > 0 && report.helperResults?.length > 0, "Missing runtime evidence");
  assert.equal(report.manifestRuntimeHashesVerified, report.contractResults.length);
  for (const row of [...report.contractResults, ...report.helperResults]) {
    assert.equal(row.runtimeMatches, true, `Saved runtime failed: ${row.name}`);
    assert.deepEqual(row.staleSources, [], `Saved source check failed: ${row.name}`);
  }
  assert.ok(report.contractResults.every((row) => row.artifactDigestMatches === true), "Saved artifacts did not pass");
  assert.equal(report.abiComparison?.autoConvertMatches, true, "Saved Auto Convert ABI did not pass");
  assert.equal(report.abiComparison?.sowMatches, true, "Saved Sow ABI did not pass");
  assert.ok(report.sourceComparisons?.length > 0, "Missing source evidence");
  const changed = [];
  for (const row of report.sourceComparisons) {
    assert.match(row.source, /^contracts\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.sol$/, "Unexpected source path");
    assert.match(row.currentHash, /^0x[0-9a-f]{64}$/i);
    assert.equal(row.match, true, `Saved source failed: ${row.source}`);
    assert.equal(row.currentHash, row.compiledHash, `Saved build was stale: ${row.source}`);
    if (keccak256(stringToHex(readSource(row.source))) !== row.currentHash) changed.push(row.source);
  }
  assert.deepEqual(changed, [], `Release source drift: ${changed.join(", ")}`);
  return report.sourceComparisons.length;
}

function readAbi(file, exportName) {
  const source = readFileSync(file, "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {} };
  runInNewContext(code, context, { timeout: 1000 });
  const abi = context.exports[exportName];
  assert.ok(Array.isArray(abi) && abi.length, `Missing ${exportName}`);
  return abi;
}

export async function checkReleaseInputs({ parityFile, protocolRoot, uiRoot }) {
  const report = JSON.parse(readFileSync(parityFile, "utf8"));
  const readSource = (source) => readFileSync(resolve(protocolRoot, source), "utf8");
  const sourceCount = checkRecordedSources(report, readSource);
  // Use the same artifact selection as the release parity verifier. Never compile here.
  const requireProtocol = createRequire(resolve(protocolRoot, "package.json"));
  // Loading the HRE would search for hardhat.config relative to the UI's cwd.
  // Root only its read-only artifact reader; do not load config, tasks or providers.
  const { Artifacts } = requireProtocol("hardhat/internal/artifacts");
  const artifacts = new Artifacts(resolve(protocolRoot, "artifacts"));
  const raw = [];
  for (const name of ["OrderedDepositsFacet", "AutoConvertFacet", "AutoConvertAdminFacet", "AutoConvertPolicyFacet", "AutoConvertViewFacet", "SiloRedemptionFacet"])
    raw.push(...(await artifacts.readArtifact(name)).abi);
  raw.push(...(await artifacts.readArtifact("WhitelistFacet")).abi.filter((x) => x.type === "function" && x.name === "whitelistTokenWithAutoConvertPolicy"));
  for (const name of ["LibOrderedDeposits", "LibAutoConvert", "LibAutoConvertStable2", "LibAutoConvertStable2Policy", "LibAutoConvertWellSafety"])
    raw.push(...(await artifacts.readArtifact(name)).abi.filter((x) => x.type === "error" || x.type === "event"));
  const seen = new Set();
  const autoAbi = raw.filter((x) => {
    const key = JSON.stringify([x.type, x.name, x.inputs]);
    if (seen.has(key) || !["function", "event", "error"].includes(x.type)) return false;
    seen.add(key);
    return true;
  });
  const sowAbi = (await artifacts.readArtifact("SowBlueprint")).abi.filter((x) => x.type === "function" && x.name === "sowBlueprint");
  assert.ok(sameAbi(readAbi(resolve(uiRoot, "src/constants/abi/autoConvertABI.ts"), "autoConvertABI"), autoAbi), "UI Auto Convert ABI drift");
  assert.ok(sameAbi(readAbi(resolve(uiRoot, "src/constants/abi/tractorReleaseABI.ts"), "sowReleaseABI"), sowAbi), "UI Sow ABI drift");
  // Detect contract editing during the asynchronous artifact reads, too.
  checkRecordedSources(report, readSource);
  return { readOnly: true, inputFreshnessOnly: true, sourceCount, autoConvertAbiEntries: autoAbi.length,
    archivedHead: report.head, liveChainChecked: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [, , parityFile, protocolRoot, uiRoot] = process.argv;
  assert.ok(parityFile && protocolRoot && uiRoot, "Usage: node release-input-preflight.mjs PARITY_JSON PROTOCOL_ROOT UI_ROOT");
  checkReleaseInputs({ parityFile, protocolRoot, uiRoot }).then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
