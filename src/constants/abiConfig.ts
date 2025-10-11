import { is0xString } from "@/utils/string";
import { ChainLookup, HashString } from "@/utils/types.generic";
import { Abi } from "viem";
import { arbitrum, base, foundry, localhost, mainnet } from "wagmi/chains";
import { pipelineABI } from "./abi/PipelineABI";
import { siloHelpersABI } from "./abi/SiloHelpersABI";
import { sowBlueprintv0ABI } from "./abi/SowBlueprintv0ABI";
import { tractorHelpersABI } from "./abi/TractorHelpersABI";
import { convertUpBlueprintV0ABI } from "./abi/convertUpBlueprintV0ABI";
import { depotABI } from "./abi/depotABI";
import { diamondABI } from "./abi/diamondABI";
import { diamondPriceABI } from "./abi/diamondPriceABI";
import {
  CONVERT_UP_BLUEPRINT_V0_ADDRESS,
  SILO_HELPERS_ADDRESS,
  SOW_BLUEPRINT_V0_ADDRESS,
  TRACTOR_HELPERS_ADDRESS,
} from "./address";

const TESTNET_CHAIN_ID = 41337;

const populateBaseIshAddress = (
  address: HashString | string,
  overrides?: {
    [chainId: number]: HashString;
  },
): ChainLookup<HashString> => {
  if (!is0xString(address)) {
    throw new Error(`Address must be a valid hex string: ${address}`);
  }

  return {
    [base.id]: address,
    [localhost.id]: address,
    [TESTNET_CHAIN_ID]: address,
    [foundry.id]: address,
    ...(overrides ?? {}),
  };
};

const BEANSTALK_BASE_ADDRESS = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
const BEANSTALK_PRICE_BASE_ADDRESS = "0x85D07892B8F3E3E7856C7d5f9e11025F4D564D4A";
const PIPELINE_BASE_ADDRESS = "0xb1bE0001f5a373b69b1E132b420e6D9687155e80";
const DEPOT_BASE_ADDRESS = "0x02F7c20dabC251f35272492177E177035C21269B";

const ADDRESSES_LOOKUP = {
  // diamond
  beanstalk: {
    [mainnet.id]: "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
    [arbitrum.id]: "0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70",
    [base.id]: BEANSTALK_BASE_ADDRESS,
    [localhost.id]: BEANSTALK_BASE_ADDRESS,
    [TESTNET_CHAIN_ID]: BEANSTALK_BASE_ADDRESS,
    [foundry.id]: BEANSTALK_BASE_ADDRESS,
  },
  // diamond price
  beanstalkPrice: {
    [mainnet.id]: "0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4",
    [arbitrum.id]: "0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7",
    [base.id]: BEANSTALK_PRICE_BASE_ADDRESS,
    [localhost.id]: BEANSTALK_PRICE_BASE_ADDRESS,
    [TESTNET_CHAIN_ID]: BEANSTALK_PRICE_BASE_ADDRESS,
    [foundry.id]: BEANSTALK_PRICE_BASE_ADDRESS,
  },
  // ecosystem
  pipeline: {
    [mainnet.id]: "0xb1bE0000C6B3C62749b5F0c92480146452D15423",
    [arbitrum.id]: "0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0",
    [base.id]: PIPELINE_BASE_ADDRESS,
    [localhost.id]: PIPELINE_BASE_ADDRESS,
    [TESTNET_CHAIN_ID]: PIPELINE_BASE_ADDRESS,
    [foundry.id]: PIPELINE_BASE_ADDRESS,
  },
  depot: {
    [mainnet.id]: "0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2",
    [arbitrum.id]: "0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c",
    [base.id]: DEPOT_BASE_ADDRESS,
    [localhost.id]: DEPOT_BASE_ADDRESS,
    [TESTNET_CHAIN_ID]: DEPOT_BASE_ADDRESS,
    [foundry.id]: DEPOT_BASE_ADDRESS,
  },
  // tractor
  tractorHelpers: {
    [base.id]: TRACTOR_HELPERS_ADDRESS,
    [localhost.id]: TRACTOR_HELPERS_ADDRESS,
    [TESTNET_CHAIN_ID]: TRACTOR_HELPERS_ADDRESS,
    [foundry.id]: TRACTOR_HELPERS_ADDRESS,
  },
  siloHelpers: {
    [base.id]: SILO_HELPERS_ADDRESS,
    [localhost.id]: SILO_HELPERS_ADDRESS,
    [TESTNET_CHAIN_ID]: SILO_HELPERS_ADDRESS,
    [foundry.id]: SILO_HELPERS_ADDRESS,
  },
  sowBlueprintv0: {
    [base.id]: SOW_BLUEPRINT_V0_ADDRESS,
    [localhost.id]: SOW_BLUEPRINT_V0_ADDRESS,
    [TESTNET_CHAIN_ID]: SOW_BLUEPRINT_V0_ADDRESS,
    [foundry.id]: SOW_BLUEPRINT_V0_ADDRESS,
  },
  convertUpBlueprint: {
    [base.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    [localhost.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    [TESTNET_CHAIN_ID]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    [foundry.id]: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
  },
} as const;

const ABI_CONFIG = {
  beanstalk: {
    abi: diamondABI as Abi,
    addresses: ADDRESSES_LOOKUP.beanstalk,
  },
  beanstalkPrice: {
    abi: diamondPriceABI as Abi,
    address: ADDRESSES_LOOKUP.beanstalkPrice,
  },
  pipeline: {
    abi: pipelineABI as Abi,
    address: ADDRESSES_LOOKUP.pipeline,
  },
  depot: {
    abi: depotABI as Abi,
    address: ADDRESSES_LOOKUP.depot,
  },
  tractorHelpers: {
    abi: tractorHelpersABI as Abi,
    address: ADDRESSES_LOOKUP.tractorHelpers,
  },
  siloHelpers: {
    abi: siloHelpersABI as Abi,
    address: ADDRESSES_LOOKUP.siloHelpers,
  },
  sowBlueprintv0: {
    abi: sowBlueprintv0ABI as Abi,
    address: ADDRESSES_LOOKUP.sowBlueprintv0,
  },
  convertUpBlueprint: {
    abi: convertUpBlueprintV0ABI as Abi,
    address: ADDRESSES_LOOKUP.convertUpBlueprint,
  },
} as const;

export default ABI_CONFIG;
