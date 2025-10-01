import { HashString } from "@/utils/types.generic";
import { Abi } from "viem";
import { arbitrum, base, foundry, localhost, mainnet } from "wagmi/chains";
import { pipelineABI } from "./abi/PipelineABI";
import { sowBlueprintv0ABI } from "./abi/SowBlueprintv0ABI";
import { tractorHelpersABI } from "./abi/TractorHelpersABI";
import { convertUpBlueprintV0ABI } from "./abi/convertUpBlueprintV0ABI";
import { depotABI } from "./abi/depotABI";
import { diamondABI } from "./abi/diamondABI";
import { diamondPriceABI } from "./abi/diamondPriceABI";
import { CONVERT_UP_BLUEPRINT_V0_ADDRESS, SOW_BLUEPRINT_V0_ADDRESS, TRACTOR_HELPERS_ADDRESS } from "./address";

const TESTNET_CHAIN_ID = 41337;

const ABI_CONFIG = {
  beanstalk: {
    abi: diamondABI as Abi,
    addresses: {
      [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5" as HashString,
      [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70" as HashString,
      [base.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString,
      [localhost.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
      [TESTNET_CHAIN_ID]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
      [foundry.id]: "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f" as HashString, // base
    },
  },
  beanstalkPrice: {
    abi: diamondPriceABI as Abi,
    address: {
      [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
      [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
      [base.id]: "0x13D25ABCB6a19948d35654715c729c6501230b49", // temp address
      [localhost.id]: "0x13D25ABCB6a19948d35654715c729c6501230b49", // base
      [TESTNET_CHAIN_ID]: "0x13D25ABCB6a19948d35654715c729c6501230b49", // base
      [foundry.id]: "0x13D25ABCB6a19948d35654715c729c6501230b49", // base
    },
  },
  pipeline: {
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
  depot: {
    abi: depotABI as Abi,
    address: {
      [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
      [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
      [base.id]: "0x02F7c20dabC251f35272492177E177035C21269B",
      [localhost.id]: "0x02F7c20dabC251f35272492177E177035C21269B", // base
      [TESTNET_CHAIN_ID]: "0x02F7c20dabC251f35272492177E177035C21269B", // base
      [foundry.id]: "0x02F7c20dabC251f35272492177E177035C21269B", // base
    },
  },
  tractorHelpers: {
    abi: tractorHelpersABI as Abi,
    address: {
      [base.id]: TRACTOR_HELPERS_ADDRESS,
      [localhost.id]: TRACTOR_HELPERS_ADDRESS,
      [TESTNET_CHAIN_ID]: TRACTOR_HELPERS_ADDRESS,
      [foundry.id]: TRACTOR_HELPERS_ADDRESS,
    },
  },
  sowBlueprintv0: {
    abi: sowBlueprintv0ABI as Abi,
    address: {
      [base.id]: SOW_BLUEPRINT_V0_ADDRESS,
      [localhost.id]: SOW_BLUEPRINT_V0_ADDRESS,
      [TESTNET_CHAIN_ID]: SOW_BLUEPRINT_V0_ADDRESS,
      [foundry.id]: SOW_BLUEPRINT_V0_ADDRESS,
    },
  },
  convertUpBlueprint: {
    abi: convertUpBlueprintV0ABI as Abi,
    address: {
      [base.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      [localhost.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      [TESTNET_CHAIN_ID]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
      [foundry.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    },
  },
} as const;

export default ABI_CONFIG;
