import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { type Abi, erc20Abi } from "viem";
import { localhost, mainnet } from "wagmi/chains";
import BEANSTALK_ABI from "./src/constants/abi/Beanstalk.json";
import BEANSTALK_PRICE_ABI from "./src/constants/abi/BeanstalkPrice.json";
import PIPELINE_ABI from "./src/constants/abi/Pipeline.json";
import DEPOT_ABI from "./src/constants/abi/Depot.json";
import USDORACLE_ABI from "./src/constants/abi/UsdOracle.json";

export default defineConfig(() => {
  const reactHookNames: string[] = [];

  return {
    out: "src/generated/contractHooks.ts",
    contracts: [
      {
        name: "beanstalkPrice",
        abi: BEANSTALK_PRICE_ABI as Abi,
        address: {
          [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
          [localhost.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
        },
      },
      {
        name: "beanstalk",
        abi: BEANSTALK_ABI as Abi,
        address: {
          [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
          [localhost.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
        },
      },
      {
        name: "bean",
        abi: erc20Abi as Abi,
        address: {
          [mainnet.id]: "0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab",
          [localhost.id]: "0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab",
        },
      },
      {
        name: "pipeline",
        abi: PIPELINE_ABI as Abi,
        address: {
          [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
          [localhost.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
        }
      },
      {
        name: "depot",
        abi: DEPOT_ABI as Abi,
        address: {
          [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
          [localhost.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
        }
      },
      {
        name: "usdOracle",
        abi: USDORACLE_ABI as Abi,
        address: {
          [mainnet.id]: "0xb24a70b71e4cca41eb114c2f61346982aa774180",
          [localhost.id]: "0xb24a70b71e4cca41eb114c2f61346982aa774180"
        }
      }
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
