// Optional local-only browser harness. Not imported by the production Vite entry.
import { createServer } from "vite";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { marketEndpoint, qaMarketMiddleware } from "./market-orders.mjs";
import { fixtureConfig, fixturePriceSource } from "./fixture-config.mjs";
import { keccak256 } from "viem";

const root = resolve(import.meta.dirname, "../..");
const { rpc, port, startBlock } = fixtureConfig();
async function request(method, params = []) {
  const response = await fetch(rpc, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = await response.json();
  assert.ok(!body.error, JSON.stringify(body.error));
  return body.result;
}
assert.match(await request("web3_clientVersion"), /^anvil\//);
assert.equal(await request("eth_chainId"), "0x539");
// This harness never falls back to Base or an environment-provided RPC.
process.env.VITE_BASE_ENDPOINT = "pinto.money";
process.env.VITE_CHAINS = "1337";
process.env.VITE_ALCHEMY_API_KEY = "";
process.env.VITE_TENDERLY_RPC_URL = rpc;
// Exercise the production Stable2 configuration path, never a source transform.
process.env.VITE_PINTO_STABLE2_ADDRESS = "";
process.env.VITE_PINTO_STABLE2_RUNTIME_HASH = "";
let qaPriceAddress;
if (process.argv[2]) {
  const fixture = JSON.parse(readFileSync(process.argv[2], "utf8"));
  assert.equal(fixture.chainId, 1337);
  assert.equal(fixture.noLiveWrites, true);
  if (fixture.stable2) {
    const qaStable2Address = fixture.stable2.address;
    assert.match(qaStable2Address, /^0x[0-9a-fA-F]{40}$/);
    const code = await request("eth_getCode", [qaStable2Address, "latest"]);
    assert.notEqual(code, "0x");
    assert.equal(keccak256(code), fixture.stable2.codeHash, "Wrong QA Stable2 runtime");
    process.env.VITE_PINTO_STABLE2_ADDRESS = qaStable2Address;
    process.env.VITE_PINTO_STABLE2_RUNTIME_HASH = fixture.stable2.codeHash;
  }
  qaPriceAddress = fixture.deployments.BeanstalkPrice;
  if (qaPriceAddress !== undefined) {
    assert.match(qaPriceAddress, /^0x[0-9a-fA-F]{40}$/);
    assert.notEqual(await request("eth_getCode", [qaPriceAddress, "latest"]), "0x");
  }
  for (const [variable, contract] of Object.entries({
    VITE_TRACTOR_HELPERS_ADDRESS: "TractorHelpers",
    VITE_SILO_HELPERS_ADDRESS: "SiloHelpers",
    VITE_CONVERT_UP_BLUEPRINT_ADDRESS: "ConvertUpBlueprint",
    VITE_SOW_BLUEPRINT_ADDRESS: "SowBlueprint",
  })) {
    const address = fixture.deployments[contract];
    assert.match(address, /^0x[0-9a-fA-F]{40}$/);
    assert.notEqual(await request("eth_getCode", [address, "latest"]), "0x");
    process.env[variable] = address;
  }
}
const server = await createServer({
  root,
  server: { host: "127.0.0.1", port, strictPort: true },
  plugins: [{
    name: "local-redemption-wallet-qa", enforce: "pre",
    configureServer(vite) { vite.middlewares.use(qaMarketMiddleware); },
    transform(code, id) {
      if (id === resolve(root, "src/constants/address.ts"))
        return fixturePriceSource(code, qaPriceAddress);
      if (id === resolve(root, "src/generated/contractHooks.ts"))
        return fixturePriceSource(code, qaPriceAddress);
      if (id === resolve(root, "scripts/qa/wallet.ts"))
        return code.replace('"http://127.0.0.1:18569"', JSON.stringify(rpc));
      if (id === resolve(root, "scripts/qa/main.tsx"))
        return code.replaceAll("53178878", String(startBlock));
      // Only these market reads use the event-backed local QA adapter. All production
      // source files, GraphQL documents, query keys and transaction encoders are unchanged.
      if (/\/src\/state\/market\/use(AllMarket|FarmerMarket|MyPodOrders|MyPodListings|PodOrders|PodListings)\.ts$/.test(id)) {
        assert.ok(code.includes("request(subgraphs[chainId].beanstalk,"));
        return code.replaceAll("request(subgraphs[chainId].beanstalk,", `request(${JSON.stringify(marketEndpoint)},`);
      }
      // This QA run covers NEW fork orders only, never production API history.
      if (id === resolve(root, "src/lib/Tractor/core/constants.ts"))
        return code.replace("28930876n", `${startBlock}n`).replace("37073327n", `${startBlock}n`);
      if (id.startsWith(resolve(root, "src/state/tractor/")))
        return code.replaceAll("chainOnly = false", "chainOnly = true").replaceAll("chainOnly: boolean = false", "chainOnly: boolean = true");
      if (id === resolve(root, "src/lib/Tractor/events/tractor-events.ts"))
        return code.replace("const fromBlock = blockFrom ?? TRACTOR_DEPLOYMENT_BLOCK;", "const fromBlock = blockFrom && blockFrom > TRACTOR_DEPLOYMENT_BLOCK ? blockFrom : TRACTOR_DEPLOYMENT_BLOCK;");
      if (id === resolve(root, "src/Web3Provider.tsx"))
        return 'export { Web3Provider, mockAddressAtom, skipPrivyAtom } from "/scripts/qa/provider.tsx";';
      if (id === resolve(root, "src/utils/wagmi/chains.ts")) {
        assert.ok(code.includes('"http://127.0.0.1:8545"'));
        return code.replace('"http://127.0.0.1:8545"', JSON.stringify(rpc));
      }
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        assert.ok(html.includes('src="/src/main.tsx"'));
        return html.replace('src="/src/main.tsx"', 'src="/scripts/qa/main.tsx"');
      },
    },
  }],
});
await server.listen();
server.printUrls();
