// Read-only end-to-end route check. Never sends a transaction or changes fork state.
// PINTO_QA_RPC=http://127.0.0.1:PORT PINTO_QA_ACCOUNT=0x... node scripts/qa/check-routed-redemption.mjs [amount]
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createPublicClient, http, parseAbi, parseUnits } from 'viem';
import { base } from 'viem/chains';
const rpc = new URL(process.env.PINTO_QA_RPC ?? '');
assert.equal(rpc.hostname, '127.0.0.1');
assert.equal(rpc.protocol, 'http:');
const account = process.env.PINTO_QA_ACCOUNT;
assert.match(account ?? '', /^0x[0-9a-fA-F]{40}$/);
const client = createPublicClient({ chain: { ...base, id: 1337 }, transport: http(rpc.href, { timeout: 30_000 }) });
assert.equal(await client.getChainId(), 1337);
assert.match(await client.request({ method: 'web3_clientVersion' }), /^anvil\//);
const diamond = '0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f';
const pinto = '0xb170000aeeFa790fa61D6e837d1035906839a3c8';
const usdc = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const wells = await client.readContract({ address: diamond, abi: parseAbi(['function getWhitelistedWellLpTokens() view returns(address[])']), functionName: 'getWhitelistedWellLpTokens' });
process.env.VITE_BASE_ENDPOINT = 'pinto.money';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { readRoutePools, quoteRoute, revalidateRoute, buildRoute, routeABI } = await server.ssrLoadModule('/src/lib/redemption/route.ts');
  const pools = await readRoutePools(client, { account, diamond, pinto, wells, kind: 'pinto' });
  const route = await quoteRoute(client, pools, parseUnits(process.argv[2] ?? '50', 6), usdc, 1337, 50);
  await revalidateRoute(client, route);
  const calls = buildRoute(route);
  const args = { address: diamond, account, abi: routeABI, functionName: 'advancedFarm', args: [calls] };
  await client.simulateContract(args);
  const gas = await client.estimateContractGas(args);
  await assert.rejects(client.simulateContract({ ...args, args: [buildRoute({ ...route, minimum: 2n ** 255n })] }), (error) => error.name === 'ContractFunctionExecutionError' && /reverted/.test(error.shortMessage));
  console.log(JSON.stringify({ noWrites: true, minimumRevertVerified: true, account, pools: pools.length, expected: String(route.expected), minimum: String(route.minimum), gas: String(gas), farmCalls: calls.length, legs: route.legs.map((leg) => ({ well: leg.snapshot.well, pinto: String(leg.selection.amount), paired: leg.snapshot.outputToken, sources: leg.swap?.sources ?? ['direct'] })) }, null, 2));
} catch (error) {
  console.error(error.shortMessage ?? error.message);
  process.exitCode = 1;
} finally { await server.close(); }
