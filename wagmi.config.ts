import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { type Abi, erc20Abi } from "viem";
import { arbitrum, localhost, mainnet } from "wagmi/chains";
import BEANSTALK_ABI from "./src/constants/abi/Beanstalk.json";
import BEANSTALK_PRICE_ABI from "./src/constants/abi/BeanstalkPrice.json";
import PIPELINE_ABI from "./src/constants/abi/Pipeline.json";
import DEPOT_ABI from "./src/constants/abi/Depot.json";

export default defineConfig(() => {
  const reactHookNames: string[] = [];

  return {
    out: "src/generated/contractHooks.ts",
    contracts: [
      {
        name: "beanstalk",
        abi: BEANSTALK_ABI as Abi,
        address: {
          [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
          [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70",
          [localhost.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70",
        },
      },
      {
        name: "beanstalkPrice",
        abi: BEANSTALK_PRICE_ABI as Abi,
        address: {
          [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
          [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
          [localhost.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
        },
      },
      {
        name: "pipeline",
        abi: PIPELINE_ABI as Abi,
        address: {
          [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
          [arbitrum.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
          [localhost.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
        }
      },
      {
        name: "depot",
        abi: DEPOT_ABI as Abi,
        address: {
          [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
          [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
          [localhost.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
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
