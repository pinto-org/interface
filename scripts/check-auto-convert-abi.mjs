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
const sow = readFileSync(new URL('../src/constants/abi/tractorReleaseABI.ts', import.meta.url), 'utf8');
assert.deepEqual(JSON.parse(sow.slice(sow.indexOf(' = ') + 3, sow.lastIndexOf(' as const'))), artifact('SowBlueprint').filter(e => e.type === 'function' && e.name === 'sowBlueprint'));
console.log(`Verified ${actual.length} public function shapes and the Sow entry point against compiled protocol artifacts.`);
