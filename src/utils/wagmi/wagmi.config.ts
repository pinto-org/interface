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

import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { diamondFarmerABI } from "@/constants/abi/diamondFarmerABI";
import { JUNCTION_ADDRESS } from "@/constants/address";

import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
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
import ABI_CONFIG from "@/constants/abiConfig";

const TESTNET_CHAIN_ID = 41337;

const config = defineConfig(() => {
  const reactHookNames: string[] = [];

  return {
    out: "src/generated/contractHooks.ts",
    contracts: [
      {
        name: "beanstalk",
        abi: ABI_CONFIG.beanstalk.abi,
        address: ABI_CONFIG.beanstalk.addresses,
      },
      {
        name: "seasonFacetView",
        abi: viewSeasonABI as Abi,
        address: ABI_CONFIG.beanstalk.addresses,
      },
      {
        name: "farmer",
        abi: diamondFarmerABI as Abi,
        address: ABI_CONFIG.beanstalk.addresses,
      },
      {
        name: "silo",
        abi: viewSiloABI as Abi,
        address: ABI_CONFIG.beanstalk.addresses,
      },
      {
        name: "beanstalkPrice",
        abi: ABI_CONFIG.beanstalkPrice.abi,
        address: ABI_CONFIG.beanstalkPrice.address,
      },
      {
        name: "pipeline",
        abi: ABI_CONFIG.pipeline.abi,
        address: ABI_CONFIG.pipeline.address,
      },
      {
        name: "junction",
        abi: junctionABI as Abi,
        address: JUNCTION_ADDRESS,
      },
      {
        name: "depot",
        abi: ABI_CONFIG.depot.abi,
        address: ABI_CONFIG.depot.address,
      },
      {
        name: "siloHelpers",
        abi: ABI_CONFIG.siloHelpers.abi,
        address: ABI_CONFIG.siloHelpers.address,
      },
      {
        name: "tractorHelpers",
        abi: ABI_CONFIG.tractorHelpers.abi,
        address: ABI_CONFIG.tractorHelpers.address,
      },
      {
        name: "sowBlueprintv0",
        abi: ABI_CONFIG.sowBlueprintv0.abi,
        address: ABI_CONFIG.sowBlueprintv0.address,
      },
      {
        name: "convertUpBlueprint",
        abi: ABI_CONFIG.convertUpBlueprint.abi,
        address: ABI_CONFIG.convertUpBlueprint.address,
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
