import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { defineChain, type Abi } from "viem";
import { arbitrum, base, foundry, localhost, mainnet } from "wagmi/chains";
import { HashString } from "@/utils/types.generic";
import BEANSTALK_ABI from "./src/constants/abi/Beanstalk.json";
import BEANSTALK_PRICE_ABI from "./src/constants/abi/BeanstalkPrice.json";
import PIPELINE_ABI from "./src/constants/abi/Pipeline.json";
import DEPOT_ABI from "./src/constants/abi/Depot.json";

/**
 * Diamond cut fragmented facets
 * 
 * This is due to it being so large that when wagmi generates the hooks, 
 * we get a 'Type instantiation is excessively deep and possibly infinite.' error.
 * 
 * Not an ideal solution as there is some duplication in the generated functions, 
 * but it's necessary to avoid the error.
 * 
 * TODO: Find a better solution in the future.
 * 
 */
import VIEW_SILO_ABI from "./src/constants/abi/ViewSilo.json";
import VIEW_FIELD_ABI from "./src/constants/abi/ViewField.json";
import VIEW_TOKEN_ABI from "./src/constants/abi/ViewToken.json";
import VIEW_SEASON_ABI from "./src/constants/abi/ViewSeason.json";
import VIEW_MARKET_ABI from "./src/constants/abi/ViewMarket.json";


export const tenderlyTestnet = defineChain({
  id: 41337,
  name: 'Tenderly Base Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://virtual.base.rpc.tenderly.co/b029bcf4-36fe-48bf-bc5c-41cabbc76996'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
})

const beanstalkAddresses = {
  [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5" as HashString,
  [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70" as  HashString,
  [base.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString,
  [localhost.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
  [tenderlyTestnet.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
  [foundry.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
}

export default defineConfig(() => {
  const reactHookNames: string[] = [];

  return {
    out: "src/generated/contractHooks.ts",
    contracts: [
      {
        name: "beanstalk",
        abi: BEANSTALK_ABI satisfies Abi,
        address: {
          [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
          [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70",
          ...beanstalkAddresses,
        },
      },
      {
        name: "seasonFacetView",
        abi: VIEW_SEASON_ABI satisfies Abi,
        address: beanstalkAddresses,
      },
      {
        name: "siloFacetView",
        abi: VIEW_SILO_ABI satisfies Abi,
        address: beanstalkAddresses,
      },
      {
        name: "fieldFacetView",
        abi: VIEW_FIELD_ABI satisfies Abi,
        address: beanstalkAddresses,
      },
      {
        name: "tokenFacetView",
        abi: VIEW_TOKEN_ABI satisfies Abi,
        address: beanstalkAddresses,
      },
      {
        name: "marketFacetView",
        abi: VIEW_MARKET_ABI satisfies Abi,
        address: beanstalkAddresses,
      },
      {
        name: "beanstalkPrice",
        abi: BEANSTALK_PRICE_ABI satisfies Abi,
        address: {
          [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
          [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
          [base.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // temp address
          [localhost.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
          [tenderlyTestnet.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
          [foundry.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
        },
      },
      {
        name: "pipeline",
        abi: PIPELINE_ABI satisfies Abi,
        address: {
          [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
          [arbitrum.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
          [base.id]: "0xb1bE000a5Dbf61dA9C4162A23958E7B28645c4f0",
          [localhost.id]: "0xb1bE000a5Dbf61dA9C4162A23958E7B28645c4f0", // base
          [tenderlyTestnet.id]: "0xb1bE000a5Dbf61dA9C4162A23958E7B28645c4f0", // base
          [foundry.id]: "0xb1bE000a5Dbf61dA9C4162A23958E7B28645c4f0", // base
        }
      },
      {
        name: "depot",
        abi: DEPOT_ABI satisfies Abi,
        address: {
          [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
          [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
          [base.id]: "0xDEb0f0328c86A1C13D3513C70b75A2cEC829E471",
          [localhost.id]: "0xDEb0f0328c86A1C13D3513C70b75A2cEC829E471", // base
          [tenderlyTestnet.id]: "0xDEb0f0328c86A1C13D3513C70b75A2cEC829E471", // base
          [foundry.id]: "0xDEb0f0328c86A1C13D3513C70b75A2cEC829E471", // base
        }
      },
    ],
    plugins: [
      react({
        getHookName({ contractName, type, itemName }) {
          function capitalize(word: string) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          let hookName: `use${string}` = `use${capitalize(type)}${contractName}_${itemName}`;
          if (reactHookNames.includes(hookName)) {
            hookName = `${hookName}_duplicated`;
          }
          reactHookNames.push(hookName);
          return hookName;
        },
      }),
    ],
  };
});
