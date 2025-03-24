import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import encoders from "@/encoders";
import transferToken from "@/encoders/transferToken";
import { beanstalkAddress, pipelineAddress } from "@/generated/contractHooks";
import { extractABIDynamicArrayCopySlot } from "@/utils/bytes";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { AdvancedPipeCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { Address } from "viem";
import { Config as WagmiConfig } from "wagmi";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "../farm/workflow";
import {
  ERC20SwapNode,
  SiloWrappedTokenUnwrapNode,
  SiloWrappedTokenWrapNode,
  WellRemoveSingleSidedSwapNode,
  WellSwapNode,
  WellSyncSwapNode,
  ZeroXSwapNode,
} from "./nodes/ERC20SwapNode";
import { UnwrapEthSwapNode, WrapEthSwapNode } from "./nodes/NativeSwapNode";
import { ClipboardContext, SwapNode } from "./nodes/SwapNode";
import { BeanSwapNodeQuote } from "./swap-router";

type SwapBuilderContext = {
  chainId: number;
  config: WagmiConfig;
  account: Address | undefined;
};

export class SwapBuilder {
  #context: SwapBuilderContext;

  #advPipe: AdvancedPipeWorkflow;

  advFarm: AdvancedFarmWorkflow;

  #nodes: readonly SwapNode[];

  get advancedFarm() {
    return [...this.advFarm.getSteps()];
  }

  get advancedPipe() {
    return [...this.#advPipe.getSteps()];
  }

  get pipelineAddress() {
    return pipelineAddress[this.#context.chainId];
  }

  constructor(chainId: number, config: WagmiConfig, account: Address | undefined) {
    this.#context = {
      chainId,
      config,
      account,
    };
    this.#advPipe = new AdvancedPipeWorkflow(this.#context.chainId, this.#context.config);
    this.advFarm = new AdvancedFarmWorkflow(this.#context.chainId, this.#context.config);
    this.#nodes = [];
  }

  async deriveClipboardWithOutputToken(token: Token, pasteSlot: number, account: Address | undefined) {
    const node = this.#nodes.find((n) => tokensEqual(n.buyToken, token));
    if (!node) {
      throw new Error(`No node found for token ${token.symbol}`);
    }
    const amountOutSlot = node instanceof ERC20SwapNode ? node.amountOutCopySlot : undefined;

    if (!exists(amountOutSlot)) {
      throw new Error(`Cannot derive function copy slot for node ${node.name}`);
    }

    const pipe = this.advFarm.getAdvPipeIndex(this.#advPipe.name);
    const functionSlot = pipe?.workflow.getTag(node.thisTag);

    if (!exists(functionSlot) || !exists(pipe)) {
      if (!exists(functionSlot)) {
        throw new Error(`No function slot found for token ${token.symbol}`);
      }
      throw new Error(`No pipe found for token ${token.symbol}`);
    }

    const result = await this.advFarm.simulate({ account });
    if (!result.result) {
      throw new Error(`Error simulating transaction`);
    }

    const { copySlot, summary } = extractABIDynamicArrayCopySlot(
      result.result[pipe.index],
      functionSlot,
      amountOutSlot,
    );

    const clipboard = Clipboard.encodeSlot(pipe.index, copySlot, pasteSlot);

    console.debug("[Swap/builder/deriveClipboardWithOutputToken]", {
      node,
      pipe,
      copySlot,
      pasteSlot,
      clipboard,
    });

    return {
      summary,
      clipboard,
    };
  }

  async build(
    quote: BeanSwapNodeQuote,
    farmFromMode: FarmFromMode,
    farmToMode: FarmToMode,
    caller: Address,
    recipient: Address,
    id?: string,
  ) {
    this.#initWorkflow(quote, id);

    if (!this.#nodes.length) {
      throw new Error("quote required to build swap");
    }

    let fromMode = farmFromMode;
    let toMode = farmToMode;

    const first = this.#nodes[0];
    const numNodes = this.#nodes.length;
    const maxIndex = numNodes - 1;

    // 1-node swap
    if (numNodes === 1) {
      if (isWrapEthNode(first)) {
        this.advFarm.add(this.#getWrapETH(first, toMode, 0), { tag: first.thisTag });
        return;
      }
      if (isUnwrapEthNode(first)) {
        this.advFarm.add(this.#getUnwrapETH(first, fromMode, 0, this.advFarm.getClipboardContext()), {
          tag: first.thisTag,
        });
        return;
      }
    }

    for (const [i, node] of this.#nodes.entries()) {
      // 1st leg of the swap
      if (i === 0) {
        // Wrap ETH before loading pipeline
        if (isWrapEthNode(node)) {
          toMode = FarmToMode.INTERNAL;
          this.advFarm.add(this.#getWrapETH(node, toMode, i), { tag: node.thisTag });
          fromMode = FarmFromMode.INTERNAL_TOLERANT;
        }

        this.#loadPipeline(node, caller, fromMode);

        // go next if wrapETH was the first action.
        if (isWrapEthNode(node)) {
          continue;
        }
      }

      // We are now in Pipeline

      // No need to update Farm modes until we offload pipeline.
      if (isERC20Node(node)) {
        switch (true) {
          /** Well Swap */
          case isWellNode(node): {
            this.#advPipe.add(this.#getApproveERC20MaxAllowance(node));
            this.#advPipe.add(
              node.buildStep(
                { copySlot: this.#getPrevNodeCopySlot(i), recipient: this.pipelineAddress },
                this.#advPipe.getClipboardContext(),
              ),
              { tag: node.thisTag },
            );
            break;
          }
          /** Matcha 0x Swap */
          case isZeroXNode(node): {
            this.#advPipe.add(this.#getApproveERC20MaxAllowance(node));
            this.#advPipe.add(node.buildStep(), {
              tag: node.thisTag,
            });
            break;
          }
          /** Well Sync */
          case isWellSyncNode(node): {
            this.#advPipe.add(
              node.transferStep({ copySlot: this.#getPrevNodeCopySlot(i) }, this.#advPipe.getClipboardContext()),
            );
            this.#advPipe.add(node.buildStep({ recipient: this.pipelineAddress }), {
              tag: node.thisTag,
            });
            break;
          }
          /** Well Remove Single Sided */
          case isWellRemoveSingleSidedNode(node): {
            const isFirst = this.#advPipe.length === 0;
            if (!isFirst) {
              throw new Error(
                "Error building swap: WellRemoveSingleSidedSwapNode must be the first txn in a sequence.",
              );
            }
            this.#advPipe.add(this.#getApproveERC20MaxAllowance(node));
            // just send to pipeline regardless of mode
            this.#advPipe.add(node.buildStep({ recipient: this.pipelineAddress }), {
              tag: node.thisTag,
            });

            // throw error here for now since we haven't sufficiently tested withdrawing as any arbitrary token yet.
            if (this.#nodes.length - 1 !== i) {
              throw new Error("Remove liquidity must be last in swap sequence.");
            }
            break;
          }
          /** Silo Wrapped Wrap */
          case isSiloWrappedWrapNode(node): {
            this.#advPipe.add(this.#getApproveERC20MaxAllowance(node));
            this.#advPipe.add(
              node.buildStep(
                {
                  recipient: this.pipelineAddress,
                  copySlot: this.#getPrevNodeCopySlot(i),
                },
                this.#advPipe.getClipboardContext(),
              ),
              { tag: node.thisTag },
            );
            break;
          }
          /** Silo Wrapped Unwrap */
          case isSiloWrappedUnwrapNode(node): {
            this.#advPipe.add(this.#getApproveERC20MaxAllowance(node));

            this.#advPipe.add(
              node.buildStep(
                {
                  recipient: this.pipelineAddress,
                  owner: this.pipelineAddress,
                  copySlot: this.#getPrevNodeCopySlot(i),
                },
                this.#advPipe.getClipboardContext(),
              ),
              { tag: node.thisTag },
            );
            break;
          }
          /** No matching cases. Throw */
          default: {
            throw new Error("Error building swap: Unknown SwapNode type.");
          }
        }
      }

      if (i === maxIndex) {
        fromMode = FarmFromMode.EXTERNAL;
        toMode = farmToMode;
        /**
         * If WETH -> ETH is the last action,
         * - do everything first & send the WETH to the recipient's internal balance.
         * - then unwrap the WETH to ETH.
         *
         * Otherwise, send the output token to the recipient.
         */
        if (isUnwrapEthNode(node)) {
          toMode = FarmToMode.INTERNAL;
        }

        this.#offloadPipeline(node, recipient, fromMode, toMode, i);

        this.advFarm.add(this.#advPipe);

        if (isUnwrapEthNode(node)) {
          fromMode = FarmFromMode.INTERNAL;

          const derivedClipboard = await this.deriveClipboardWithOutputToken(node.sellToken, 0, this.#context.account);

          console.debug("[Swap/builder/unwrapETH] deriveClipboardWithOutputToken", {
            derivedClipboard,
          });

          const unwrap = node.buildStep({ fromMode, copySlot: undefined }, undefined, derivedClipboard.clipboard);

          this.advFarm.add(unwrap, {
            tag: node.thisTag,
          });
        }
      }
    }
  }

  /**
   * Loads pipeline w/ the first ERC20 token in the swap sequence.
   * @param node
   *
   * If the first action is to wrap ETH, we sequence it before loading pipeline. w/ the buyToken.
   * If the caller is pipeline, no need to load tokens.
   */
  #loadPipeline(node: SwapNode, caller: string, from: FarmFromMode) {
    const callerIsPipeline = stringEq(caller, pipelineAddress[this.#context.chainId]);
    if (!callerIsPipeline) {
      const loadToken = isWrapEthNode(node) ? node.buyToken : (node as ERC20SwapNode).sellToken;

      const transfer = transferToken(
        loadToken.address,
        pipelineAddress[this.#context.chainId],
        node.sellAmount,
        from,
        FarmToMode.EXTERNAL,
        beanstalkAddress[this.#context.chainId],
      );
      this.advFarm.add(transfer);

      console.debug("[Swap/SwapBuilder/loadPipeline/transfer]: ", {
        loadToken: loadToken.symbol,
        recipient: "PIPELINE",
        amount: node.sellAmount.toNumber(),
        fromMode: from,
        toMode: FarmToMode.EXTERNAL,
        target: "PINTOSTALK",
      });
    }
  }

  /**
   * Adds approve Beanstalk & transferToken to advancedPipe.
   * Transfer to the recipient is conditional on the recipient not being pipeline.
   */
  #offloadPipeline(node: SwapNode, recipient: Address, fromMode: FarmFromMode, toMode: FarmToMode, i: number) {
    const recipientIsPipeline = stringEq(recipient, pipelineAddress[this.#context.chainId]);
    if (recipientIsPipeline) return;

    let copySlot: number | undefined;
    let tag: string;
    let outToken: Token;

    /**
     * If going from WETH -> ETH
     * - Send to internal
     * - use previous node info.
     */
    if (isUnwrapEthNode(node)) {
      tag = node.tagNeeded; // get-WETH
      outToken = node.sellToken; // WETH
      copySlot = this.#getPrevNodeCopySlot(i); // WETH amountOutCopySlot
    } else if (isERC20Node(node)) {
      tag = node.thisTag;
      outToken = node.buyToken;
      copySlot = node.amountOutCopySlot;
    } else {
      throw new Error("Error building swap offloading pipeline: Cannot determine approval token for transfer.");
    }

    if (copySlot === undefined) {
      throw new Error("Error building swap offloading pipeline: Cannot determine copySlot from previous node.");
    }

    const returnIndex = this.#advPipe.getTag(tag);

    const approve = encoders.token.erc20Approve(
      beanstalkAddress[this.#context.chainId],
      TV.MAX_UINT256,
      outToken.address,
    );

    const transfer = encoders.token.transferToken(
      outToken.address,
      recipient,
      node.sellAmount, // set max uint256. This will be overridden by the amountOutCopySlot
      fromMode,
      toMode,
      beanstalkAddress[this.#context.chainId],
      exists(returnIndex) ? Clipboard.encodeSlot(returnIndex, copySlot, 2) : undefined,
    );

    if (!approve.target) {
      throw new Error("Misconfigured Swap Route. Cannot approve non-ERC20 with no target.");
    }
    if (!transfer.target) {
      throw new Error("Misconfigured Swap Route. Cannot transfer non-ERC20 with no target.");
    }

    this.#advPipe.add(approve);

    console.debug("[Swap/SwapBuilder/offloadPipeline/approve]", {
      target: outToken.address,
      token: outToken.symbol,
      amount: "MAX_UINT256",
      spender: "PINTOSTALK",
    });

    this.#advPipe.add(transfer);

    console.debug("[Swap/SwapBuilder/offloadPipeline/transfer]", {
      recipient: recipient,
      token: outToken.symbol,
      amount: node.buyAmount.toNumber(),
      fromMode,
      toMode,
      target: "PINTOSTALK",
      clipboard: {
        "0returnIndex": returnIndex,
        "1copySlot": copySlot,
        "2pasteSlot": 2,
      },
    });
  }

  /**
   *
   */
  #getApproveERC20MaxAllowance(node: SwapNode) {
    if (!isERC20Node(node) && !isUnwrapEthNode(node)) {
      console.debug("ERR: node: ", node);
      throw new Error("Misconfigured Swap Route. Cannot approve non-ERC20 token.");
    }

    // allow the allowance target to spend max tokens from Pipeline.
    const approve = encoders.token.erc20Approve(node.allowanceTarget, TV.MAX_UINT256, node.sellToken.address);
    if (!approve.target) {
      throw new Error("Misconfigured Swap Route. Cannot approve non-ERC20 with no target.");
    }
    console.debug("[Swap/builder/getApproveERC20MaxAllowance]", {
      target: approve.target,
      spender: node.allowanceTarget,
      token: node.sellToken.symbol,
      amount: "MAX_UINT256",
    });
    return approve satisfies AdvancedPipeCall;
  }

  // ---------- SwapNode Utils ----------

  /**
   * extracts the unwrapETH step from the node
   * @throws if UnwrapETH is not the last txn
   */
  #getUnwrapETH(
    node: UnwrapEthSwapNode,
    fromMode: FarmFromMode,
    i: number,
    ctx?: ClipboardContext,
    clipboard?: HashString,
  ) {
    const isFirst = i === 0;

    // Scenarios where UnwrapETH is allowed:
    const isFirstAndOnly = isFirst && this.#nodes.length === 1;
    const isLast = i === this.#nodes.length - 1;

    if (!isFirstAndOnly && !isLast) {
      throw new Error("Error building swap: UnwrapETH can only be performed as the last txn in a sequnce of swaps.");
    }

    let copySlot: number | undefined;
    if (!isLast) {
      copySlot = this.#getPrevNodeCopySlot(i);
    }

    return node.buildStep({ fromMode, copySlot }, ctx, clipboard);
  }

  /**
   * extracts the wrapETH step from the node
   * @throws if WrapETH is not the first txn
   */
  #getWrapETH(node: WrapEthSwapNode, toMode: FarmToMode, i: number, clipboard?: HashString) {
    // Ensure that WrapETH can only be added to the workflow as the first txn
    if (i !== 0) {
      throw new Error("Error building swap: WrapETH can only be performed first in a sequnce of txns.");
    }

    return node.buildStep({ toMode }, this.advFarm.getClipboardContext(), clipboard);
  }

  /**
   * Returns the copySlot of the previous node in the swap sequence.
   */
  #getPrevNodeCopySlot(i: number) {
    if (!this.#nodes.length || i === 0) return undefined;

    const prevNode = this.#nodes[i - 1];
    if (prevNode && isERC20Node(prevNode)) {
      return prevNode.amountOutCopySlot;
    }
    return undefined;
  }

  #initWorkflow(quote: BeanSwapNodeQuote, id?: string) {
    const advFarmId = `adv-farm-${quote.sellToken.symbol}-${quote.buyToken.symbol}-${id}`;
    const advPipeId = `adv-pipe-${quote.sellToken.symbol}-${quote.buyToken.symbol}-${id}`;

    this.advFarm = new AdvancedFarmWorkflow(this.#context.chainId, this.#context.config, advFarmId);
    this.#advPipe = new AdvancedPipeWorkflow(this.#context.chainId, this.#context.config, advPipeId);

    this.#nodes = quote.nodes;
  }
}

/// -------------------- Node Utils --------------------

const isWrapEthNode = (node: SwapNode): node is WrapEthSwapNode => {
  return node instanceof WrapEthSwapNode;
};
const isUnwrapEthNode = (node: SwapNode): node is UnwrapEthSwapNode => {
  return node instanceof UnwrapEthSwapNode;
};
const isERC20Node = (node: SwapNode): node is ERC20SwapNode => {
  return node instanceof ERC20SwapNode;
};
const isWellNode = (node: SwapNode): node is WellSwapNode => {
  return node instanceof WellSwapNode;
};
const isZeroXNode = (node: SwapNode): node is ZeroXSwapNode => {
  return node instanceof ZeroXSwapNode;
};
const isWellSyncNode = (node: SwapNode): node is WellSyncSwapNode => {
  return node instanceof WellSyncSwapNode;
};
const isWellRemoveSingleSidedNode = (node: SwapNode): node is WellRemoveSingleSidedSwapNode => {
  return node instanceof WellRemoveSingleSidedSwapNode;
};
const isSiloWrappedWrapNode = (node: SwapNode): node is SiloWrappedTokenWrapNode => {
  return node instanceof SiloWrappedTokenWrapNode;
};
const isSiloWrappedUnwrapNode = (node: SwapNode): node is SiloWrappedTokenUnwrapNode => {
  return node instanceof SiloWrappedTokenUnwrapNode;
};
