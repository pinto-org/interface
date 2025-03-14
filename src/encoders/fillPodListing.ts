import { Address, encodeFunctionData } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { FarmFromMode } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { Clipboard } from "@/classes/Clipboard";

export default function fillPodListing(
  account?: Address, // account
  index?: TokenValue, // index
  start?: TokenValue, // start
  amount?: TokenValue, // amount
  pricePerPod?: number, // pricePerPod
  maxHarvestableIndex?: TokenValue, // maxHarvestableIndex
  minFillAmount?: TokenValue, // minFillAmount, measured in Beans
  mode?: number, // mode
  amountIn?: TokenValue, // amountIn
  balanceFrom?: FarmFromMode, // fromMode
  clipboard?: `0x${string}`,
) {
  if (
    account === undefined ||
    index === undefined ||
    start === undefined ||
    amount === undefined ||
    pricePerPod === undefined ||
    maxHarvestableIndex === undefined ||
    minFillAmount === undefined ||
    mode === undefined ||
    amountIn === undefined ||
    balanceFrom === undefined
  ) {
    return {
      callData: "0x" as `0x${string}`,
      clipboard: Clipboard.encode([]),
    };
  }

  const data = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "fillPodListing",
    args: [
      {
        lister: account, // account
        fieldId: 0n,
        index: index.toBigInt(), // index
        start: start.toBigInt(), // start
        podAmount: amount.toBigInt(), // amount
        pricePerPod: pricePerPod, // pricePerPod
        maxHarvestableIndex: maxHarvestableIndex.toBigInt(), // maxHarvestableIndex
        minFillAmount: minFillAmount.toBigInt(), // minFillAmount, measured in Beans
        mode: mode, // mode
      },
      amountIn.toBigInt(), // amountIn
      Number(balanceFrom), // fromMode
    ],
  });

  return {
    callData: data,
    clipboard: clipboard || Clipboard.encode([]),
  };
}
