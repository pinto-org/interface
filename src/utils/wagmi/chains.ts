import { Chain, defineChain } from "viem";
import { base as viem__base } from "viem/chains";
import { arbitrum as viem__arbitrum } from "viem/chains";

const API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

const ARB_ALCHEMY_RPC_URL = `https://arb-mainnet.g.alchemy.com/v2/${API_KEY}`;

const BASE_ALCHEMY_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${API_KEY}`;

export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export const BASE_RPC_URL = API_KEY ? BASE_ALCHEMY_RPC_URL : viem__base.rpcUrls.default.http[0];

export const ARB_RPC_URL = API_KEY ? ARB_ALCHEMY_RPC_URL : viem__arbitrum.rpcUrls.default.http[0];

export const TENDERLY_RPC_URL = import.meta.env.VITE_TENDERLY_RPC_URL ?? BASE_RPC_URL;

const localhostNetwork = defineChain({
  ...viem__base,
  id: 1337,
  name: "localhost://8545",
  rpcUrls: {
    default: { http: [LOCAL_RPC_URL] },
  },
});

const tenderlyTestnetNetwork = defineChain({
  ...viem__base,
  id: 41337,
  name: "Tenderly Base Testnet",
  rpcUrls: {
    default: { http: [BASE_RPC_URL] },
  },
});

if (TENDERLY_RPC_URL) {
  tenderlyTestnetNetwork.rpcUrls = {
    default: { http: [TENDERLY_RPC_URL] },
  };
}

const arbitrumNetwork = defineChain({
  ...viem__arbitrum,
  id: 42_161,
  name: "Arbitrum",
  rpcUrls: {
    default: { http: [ARB_RPC_URL] },
  },
});

const baseNetwork = defineChain({
  ...viem__base,
  rpcUrls: {
    default: { http: [BASE_RPC_URL] },
  },
});

const CHAIN_ID_MAP = {
  8453: baseNetwork,
  42161: arbitrumNetwork,
  1337: localhostNetwork,
  41337: tenderlyTestnetNetwork,
};

const PROD_CHAIN_IDS = new Set<number>([baseNetwork.id]);

const enabledChainIds = import.meta.env.VITE_CHAINS.split(",");

if (!enabledChainIds.length) {
  throw new Error("No chains enabled");
}

export const getIsProdNetwork = (chainId: number) => PROD_CHAIN_IDS.has(chainId);

export const ENABLE_SWITCH_CHAINS = enabledChainIds.length > 1;

export const getChainWithChainId = (chainId: number) => {
  const cid = chainId.toString();
  return CHAIN_ID_MAP[cid];
};

export const getEnvEnabledChains = (): Chain[] => {
  const chainIds: number[] = enabledChainIds.map(Number);

  return chainIds.map(getChainWithChainId);
};

export { arbitrumNetwork, baseNetwork, localhostNetwork, tenderlyTestnetNetwork };
