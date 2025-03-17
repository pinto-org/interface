import { HashString } from "@/utils/types.generic";
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Abi } from "viem";
import { arbitrum, base, foundry, localhost, mainnet } from "wagmi/chains";

import { diamondABI } from "@/constants/abi/diamondABI";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";

import { pipelineABI } from "@/constants/abi/PipelineABI";
import { depotABI } from "@/constants/abi/depotABI";
import { junctionABI } from "@/constants/abi/junctionABI";

import { JUNCTION_ADDRESS } from "@/constants/address";

import { diamondFarmerABI } from "@/constants/abi/diamondFarmerABI";
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
 */
import { viewSeasonABI } from "@/constants/abi/viewSeasonABI";
import { viewSiloABI } from "@/constants/abi/viewSiloABI";
import { siloHelpersABI } from "@/constants/abi/SiloHelpersABI";

const SILO_HELPERS_ADDRESS = "0x207b78B23Ee4b9F9D9b07102Ed5bBf8573004B8A";

const TESTNET_CHAIN_ID = 41337;

const config = defineConfig(() => {
  const reactHookNames: string[] = [];

  // const env = loadEnv({
  //   mode: process.env.NODE_ENV,
  //   envDir: process.cwd(),
  // });

  // console.log(env);
  // const testnetRPC

  const beanstalkAddresses = {
    [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5" as HashString,
    [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70" as HashString,
    [base.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString,
    [localhost.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
    [TESTNET_CHAIN_ID]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
    [foundry.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
  };

  return {
    out: "src/generated/contractHooks.ts",
    contracts: [
      {
        name: "beanstalk",
        abi: diamondABI as Abi,
        address: beanstalkAddresses,
      },
      {
        name: "seasonFacetView",
        abi: viewSeasonABI as Abi,
        address: beanstalkAddresses,
      },
      {
        name: "farmer",
        abi: diamondFarmerABI as Abi,
        address: beanstalkAddresses,
      },
      {
        name: "silo",
        abi: viewSiloABI as Abi,
        address: beanstalkAddresses,
      },
      {
        name: "beanstalkPrice",
        abi: diamondPriceABI as Abi,
        address: {
          [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
          [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
          [base.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // temp address
          [localhost.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
          [TESTNET_CHAIN_ID]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
          [foundry.id]: "0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E", // base
        },
      },
      {
        name: "pipeline",
        abi: pipelineABI as Abi,
        address: {
          [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
          [arbitrum.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
          [base.id]: "0xb1bE0001f5a373b69b1E132b420e6D9687155e80",
          [localhost.id]: "0xb1bE0001f5a373b69b1E132b420e6D9687155e80", // base
          [TESTNET_CHAIN_ID]: "0xb1bE0001f5a373b69b1E132b420e6D9687155e80", // base
          [foundry.id]: "0xb1bE0001f5a373b69b1E132b420e6D9687155e80", // base
        },
      },
      {
        name: "junction",
        abi: junctionABI as Abi,
        address: JUNCTION_ADDRESS,
      },
      {
        name: "depot",
        abi: depotABI as Abi,
        address: {
          [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
          [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
          [base.id]: "0xDEb0f04e5DC8875bf1Dc6087fF436Ef9873b8933",
          [localhost.id]: "0xDEb0f04e5DC8875bf1Dc6087fF436Ef9873b8933", // base
          [TESTNET_CHAIN_ID]: "0xDEb0f04e5DC8875bf1Dc6087fF436Ef9873b8933", // base
          [foundry.id]: "0xDEb0f04e5DC8875bf1Dc6087fF436Ef9873b8933", // base
        },
      },
      {
        name: "siloHelpers",
        abi: siloHelpersABI as Abi,
        address: {
          [mainnet.id]: SILO_HELPERS_ADDRESS,
          [arbitrum.id]: SILO_HELPERS_ADDRESS,
          [base.id]: SILO_HELPERS_ADDRESS,
          [localhost.id]: SILO_HELPERS_ADDRESS,
          [TESTNET_CHAIN_ID]: SILO_HELPERS_ADDRESS,
          [foundry.id]: SILO_HELPERS_ADDRESS,
        },
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

export default config;
