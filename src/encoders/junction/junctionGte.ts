import { TokenValue } from "@/classes/TokenValue";
import { junctionABI } from "@/constants/abi/junctionABI";
import { junctionAddress } from "@/generated/contractHooks";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

type NumberInstance = TokenValue | bigint;

export default function junctionGte(
  left: NumberInstance,
  right: NumberInstance,
  clipboard: HashString,
): AdvancedPipeCall {
  const leftValue = typeof left === "bigint" ? left : left.toBigInt();
  const rightValue = typeof right === "bigint" ? right : right.toBigInt();

  const encoded = encodeFunctionData({
    abi: junctionABI,
    functionName: "gte",
    args: [leftValue, rightValue],
  });

  return {
    target: junctionAddress,
    callData: encoded,
    clipboard,
  };
}
