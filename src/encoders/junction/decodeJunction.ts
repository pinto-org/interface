import { junctionABI } from "@/constants/abi/junctionABI";
import { HashString } from "@/utils/types.generic";
import { decodeFunctionResult } from "viem";

type MathJunctionFunctionName = "add" | "sub" | "mul" | "div" | "mod" | "mulDiv";

type LogicJunctionFunctionName = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

type JunctionFunctionName = "check" | MathJunctionFunctionName | LogicJunctionFunctionName;

export default function decodeJunctionResult(fnName: JunctionFunctionName, data: HashString) {
  return decodeFunctionResult({
    abi: junctionABI,
    functionName: fnName,
    data,
  });
}
