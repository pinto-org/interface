// Verify integration ABI shapes against freshly compiled protocol artifacts.
// Usage: node scripts/check-auto-convert-abi.mjs /path/to/protocol
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const protocol = resolve(process.argv[2] || '../protocol');
const artifact = name => JSON.parse(readFileSync(`${protocol}/out/${name}.sol/${name}.json`)).abi;
const source = readFileSync(new URL('../src/constants/abi/autoConvertABI.ts', import.meta.url), 'utf8');
const abi = JSON.parse(source.slice(source.indexOf(' = ') + 3, source.lastIndexOf(' as const')));
const facets = ['OrderedDepositsFacet', 'AutoConvertFacet', 'AutoConvertAdminFacet', 'AutoConvertViewFacet', 'AutoConvertPolicyFacet', 'SiloRedemptionFacet'];
const expected = facets.flatMap(artifact).filter(e => e.type === 'function');
expected.push(...artifact('WhitelistFacet').filter(e => e.type === 'function' && e.name === 'whitelistTokenWithAutoConvertPolicy'));
const type = p => p.type.startsWith('tuple') ? '(' + p.components.map(type).join(',') + ')' + p.type.slice(5) : p.type;
const key = e => e.name + '(' + e.inputs.map(type).join(',') + ')';
const actual = abi.filter(e => e.type === 'function');
assert.deepEqual(actual.map(key).sort(), expected.map(key).sort(), 'Public selectors diverged');
for (const entry of expected) assert.deepEqual(actual.find(e => key(e) === key(entry)), entry, `ABI shape drift: ${key(entry)}`);
const complete = facets.flatMap(artifact);
complete.push(...artifact('WhitelistFacet').filter(e => e.type === 'function' && e.name === 'whitelistTokenWithAutoConvertPolicy'));
for (const name of ['LibOrderedDeposits', 'LibAutoConvert', 'LibAutoConvertStable2', 'LibAutoConvertStable2Policy', 'LibAutoConvertWellSafety']) {
  complete.push(...artifact(name).filter(e => e.type === 'event' || e.type === 'error'));
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const shapes = entries => [...new Set(entries.filter(e => ['function', 'event', 'error'].includes(e.type)).map(e => JSON.stringify(canonical(e))))].sort();
assert.deepEqual(shapes(abi), shapes(complete), 'Full function/event/error ABI drift');
const sow = readFileSync(new URL('../src/constants/abi/tractorReleaseABI.ts', import.meta.url), 'utf8');
assert.deepEqual(JSON.parse(sow.slice(sow.indexOf(' = ') + 3, sow.lastIndexOf(' as const'))), artifact('SowBlueprint').filter(e => e.type === 'function' && e.name === 'sowBlueprint'));
console.log(`Verified all ${abi.length} function/event/error shapes (${actual.length} public functions) and the Sow entry point against compiled protocol artifacts.`);
