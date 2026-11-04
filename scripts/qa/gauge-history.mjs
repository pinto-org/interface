// Read-only, local-fork observations. This is NOT a production subgraph or backfill.
import assert from "node:assert/strict";
import { createPublicClient, http, parseAbi } from "viem";

export const gaugeHistoryPath = "/__qa/gauge-history";
export const gaugeDiamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
const abi = parseAbi([
  "event Sunrise(uint256 indexed season)",
  "function season() view returns (uint32)",
  "function getConvertStalkPerBdvBonusAndMaximumCapacity() view returns (uint256, uint256)",
]);

export async function readForkGaugeHistory(client, startBlock) {
  assert.match(await client.request({ method: "web3_clientVersion" }), /^anvil\//);
  assert.equal(await client.getChainId(), 1337);
  const tip = await client.getBlock();
  const start = BigInt(startBlock);
  assert.ok(start > 0n && tip.number >= start && tip.number - start <= 100_000n, "QA history window exceeded");
  const logs = tip.number === start ? [] : await client.getLogs({
    address: gaugeDiamond, event: abi[0], fromBlock: start + 1n, toBlock: tip.number, strict: true,
  });
  assert.ok(logs.length <= 400, "QA observation limit exceeded");
  const blocks = [...new Set([start, ...logs.map((log) => log.blockNumber), tip.number])]
    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const rows = new Map();
  for (const blockNumber of blocks) {
    const block = await client.getBlock({ blockNumber });
    assert.ok(block.hash, "Missing observation block");
    for (const log of logs.filter((entry) => entry.blockNumber === blockNumber)) {
      assert.equal(log.blockHash, block.hash, "Sunrise block changed");
    }
    const [season, [bonus, capacity]] = await Promise.all([
      client.readContract({ address: gaugeDiamond, abi, functionName: "season", blockNumber }),
      client.readContract({ address: gaugeDiamond, abi, functionName: "getConvertStalkPerBdvBonusAndMaximumCapacity", blockNumber }),
    ]);
    assert.equal((await client.getBlock({ blockNumber })).hash, block.hash, "Observation changed during read");
    // One actual observation per Season; latest state replaces the current Season.
    // No invented hourly points, pre-release history or wall-clock timestamps.
    rows.set(Number(season), {
      id: `fork-${block.hash}`, season: Number(season), createdAt: block.timestamp.toString(),
      g2BonusStalkPerBdv: bonus.toString(), g2MaxConvertCapacity: capacity.toString(),
      blockNumber: blockNumber.toString(), blockHash: block.hash,
    });
  }
  assert.equal((await client.getBlock({ blockNumber: tip.number })).hash, tip.hash, "Fork changed during read");
  return { source: "local-fork-observations", startBlock: start.toString(), tipHash: tip.hash,
    rows: [...rows.values()].sort((a, b) => a.season - b.season) };
}

export function createGaugeHistoryMiddleware({ rpc, startBlock }) {
  // Configuration is validated as IPv4 loopback by fixtureConfig before creation.
  const client = createPublicClient({ transport: http(rpc, { timeout: 10_000, retryCount: 0 }) });
  let pending;
  return (req, res, next) => {
    if (req.url?.split("?")[0] !== gaugeHistoryPath) return next();
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "no-store");
    if (req.method !== "GET") {
      res.statusCode = 405;
      res.setHeader("allow", "GET");
      return res.end(JSON.stringify({ error: "Read-only endpoint" }));
    }
    // Share concurrent chart reads only; no cached head survives a reset/reorg.
    pending ??= readForkGaugeHistory(client, startBlock).finally(() => { pending = undefined; });
    pending.then((data) => res.end(JSON.stringify(data))).catch(() => {
      res.statusCode = 503;
      res.end(JSON.stringify({ error: "Local fork gauge observations unavailable" }));
    });
  };
}
