import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import encoders from "@/encoders";
import { beanstalkAddress } from "@/generated/contractHooks";
import { AdvancedFarmCall, AdvancedPipeCall, TypedAdvancedFarmCalls } from "@/utils/types";
import { HashString, MayArray } from "@/utils/types.generic";
import { Address, StateOverride, decodeFunctionResult } from "viem";
import { readContract, simulateContract } from "viem/actions";
import { Config as WagmiConfig } from "wagmi";

interface WorkflowOptions {
  value?: TV;
  clipboard?: HashString;
  tag?: string;
}

abstract class FarmWorkflow<T extends AdvancedFarmCall> {
  readonly name: string;

  readonly chainId: number;

  readonly config: WagmiConfig;

  protected tagMap: Map<string, number>;

  protected steps: T[];

  constructor(chainId: number, config: WagmiConfig, name: string = "adv-farm") {
    this.name = name;
    this.chainId = chainId;
    this.config = config;
    this.tagMap = new Map();
    this.steps = [];
  }

  get length() {
    return this.steps.length;
  }

  getTag(tag: string) {
    return this.tagMap.get(tag);
  }

  getSteps() {
    return [...this.steps];
  }

  getClipboardContext() {
    return { indexMap: this.tagMap };
  }

  add(input: MayArray<T>, options?: WorkflowOptions) {
    if (Array.isArray(input)) {
      input.forEach((call) => {
        this.add(call);
      });
    } else {
      this.steps.push(input);
    }

    // If a tag is provided, set it to the index of the the last input
    if (options?.tag) {
      this.tagMap.set(options.tag, this.steps.length - 1);
    }

    return this;
  }

  clear() {
    this.steps = [];
    this.tagMap.clear();
  }
}

export class AdvancedFarmWorkflow extends FarmWorkflow<AdvancedFarmCall> {
  private advancedPipeIndexMap: Map<string, { workflow: AdvancedPipeWorkflow; index: number }>;

  constructor(chainId: number, config: WagmiConfig, name: string = "adv-farm") {
    super(chainId, config, name);
    this.advancedPipeIndexMap = new Map<string, { workflow: AdvancedPipeWorkflow; index: number }>();
  }

  override add(input: MayArray<AdvancedFarmCall> | AdvancedPipeWorkflow, options?: WorkflowOptions) {
    if (input instanceof AdvancedPipeWorkflow) {
      super.add(input.encode(options?.value, options?.clipboard), options);

      // If an advanced pipe workflow is added, set in a separate map for quick lookup
      // If the advPipeWorkflow w/ the same name is re-added, it will override the previous one
      this.advancedPipeIndexMap.set(input.name, {
        workflow: input,
        index: this.steps.length - 1,
      });
    } else {
      super.add(input, options);
    }

    return this;
  }

  override clear() {
    super.clear();
    this.advancedPipeIndexMap.clear();
  }

  getAdvPipeIndex(name: string) {
    return this.advancedPipeIndexMap.get(name);
  }

  async simulate({
    before,
    after,
    stateOverrides,
    account,
    value,
  }: {
    /**
     * The workflow(s) to run before the current workflow.
     * - If an Array of AdvancedPipeWorkflows are provided, each is added as a separate advPipe call & not combined.
     */
    before?: AdvancedFarmCall[] | AdvancedFarmWorkflow | MayArray<AdvancedPipeWorkflow>;
    after?: AdvancedFarmCall[] | AdvancedFarmWorkflow | MayArray<AdvancedPipeWorkflow>;
    stateOverrides?: StateOverride;
    account?: Address;
    value?: TV;
  }) {
    const steps = [
      ...normalizeSteps(before),
      ...this.steps,
      ...normalizeSteps(after),
    ] as const as TypedAdvancedFarmCalls;

    return simulateContract(this.config.getClient({ chainId: this.chainId }), {
      address: beanstalkAddress[this.chainId],
      abi: abiSnippets.advancedFarm,
      functionName: "advancedFarm",
      args: [steps],
      blockTag: "latest",
      stateOverride: stateOverrides,
      account,
      value: value?.toBigInt(),
    });
  }

  static decodeResult(data: HashString) {
    return decodeFunctionResult({
      abi: abiSnippets.advancedFarm,
      functionName: "advancedFarm",
      data: data,
    });
  }
}

export class AdvancedPipeWorkflow extends FarmWorkflow<AdvancedPipeCall> {
  constructor(chainId: number, config: WagmiConfig, name: string = "adv-pipe") {
    super(chainId, config, name);
  }

  encode(value: TV = TV.ZERO, clipboard: HashString = Clipboard.encode([])): AdvancedFarmCall {
    return encoders.advancedPipe(this.getSteps(), value, clipboard);
  }

  copy(name?: string) {
    const copy = new AdvancedPipeWorkflow(this.chainId, this.config, name ?? `${this.name}-copy`);

    const steps: AdvancedPipeCall[] = [];
    copy.tagMap = new Map(this.tagMap);
    const tagMap = new Map();

    // Create deep copy of steps & tagMap
    this.tagMap.forEach((value, key) => {
      tagMap.set(key, value);
    });
    this.steps.forEach((step) => {
      steps.push({ ...step });
    });

    copy.steps = steps;
    copy.tagMap = tagMap;

    return copy;
  }

  async readStatic(value?: TV) {
    const result = await readContract(this.config.getClient({ chainId: this.chainId }), {
      address: beanstalkAddress[this.chainId],
      abi: abiSnippets.advancedPipe,
      functionName: "advancedPipe",
      args: [this.getSteps(), value?.toBigInt() ?? 0n],
    });

    return result as HashString[];
  }

  static decodeResult(data: HashString) {
    return decodeFunctionResult({
      abi: abiSnippets.advancedPipe,
      functionName: "advancedPipe",
      data: data,
    });
  }
}

function normalizeSteps(args: AdvancedFarmCall[] | AdvancedFarmWorkflow | MayArray<AdvancedPipeWorkflow> | undefined) {
  if (!args) return [];

  const calls: AdvancedFarmCall[] = [];

  const addToCalls = (arg: AdvancedFarmCall | AdvancedFarmWorkflow | AdvancedPipeWorkflow) => {
    if (arg instanceof AdvancedPipeWorkflow) {
      calls.push(arg.encode());
    } else if (arg instanceof AdvancedFarmWorkflow) {
      calls.push(...arg.getSteps());
    } else {
      calls.push(arg);
    }
  };

  if (Array.isArray(args)) {
    args.forEach((arg) => addToCalls(arg));
  } else {
    addToCalls(args);
  }

  return calls;
}
