import { defineChain } from "viem";
import { base as viem__base } from "viem/chains";

export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export const TENDERLY_RPC_URL = import.meta.env.VITE_TENDERLY_RPC_URL;

export const ALCHEMY_RPC_URL = import.meta.env.VITE_ALCHEMY_RPC_URL;

export const BASE_RPC_URL = ALCHEMY_RPC_URL || viem__base.rpcUrls.default.http[0];

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

const baseNetwork = defineChain({
  ...viem__base,
  rpcUrls: {
    default: { http: [BASE_RPC_URL] },
  },
});

export { baseNetwork, localhostNetwork, tenderlyTestnetNetwork };
