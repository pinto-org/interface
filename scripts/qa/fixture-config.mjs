// Explicit local QA configuration only. Never imported by production source.
import assert from "node:assert/strict";

// Used only by the optional Vite QA transform, never to rewrite tracked source.
export function fixturePriceSource(code, address) {
  if (address === undefined) return code;
  assert.match(address, /^0x[0-9a-fA-F]{40}$/);
  assert.notEqual(address.toLowerCase(), "0x0000000000000000000000000000000000000000");
  const previous = "0x13D25ABCB6a19948d35654715c729c6501230b49";
  assert.ok(code.includes(previous), "QA price-reader source changed; inspect before transforming");
  return code.replaceAll(previous, address);
}

export function fixtureConfig(env = process.env) {
  const rpc = env.PINTO_QA_RPC ?? "http://127.0.0.1:18569";
  const url = new URL(rpc);
  assert.ok(url.protocol === "http:" && url.hostname === "127.0.0.1" && url.port &&
    !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash,
    "QA RPC must be an explicit IPv4 loopback endpoint");
  const port = Number(env.PINTO_QA_UI_PORT ?? 17845);
  const startBlock = Number(env.PINTO_QA_START_BLOCK ?? 53178878);
  assert.ok(Number.isInteger(port) && port > 1024 && port <= 65535, "Invalid QA UI port");
  assert.ok(Number.isSafeInteger(startBlock) && startBlock > 0, "Invalid QA start block");
  return { rpc: url.origin, port, startBlock, marketEndpoint: `http://127.0.0.1:${port}/__qa/market` };
}
