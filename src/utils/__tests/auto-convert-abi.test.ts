import { describe, expect, it } from "vitest";
import { decodeErrorResult, decodeFunctionData, encodeFunctionData, toFunctionSelector } from "viem";
import { autoConvertABI } from "@/constants/abi/autoConvertABI";

describe("current Auto Convert release ABI", () => {
  it("encodes the per-Well priority getter, not the retired zero-argument getter", () => {
    const well = "0x3e111115A82dF6190e36ADf0d552880663A4dBF1";
    const data = encodeFunctionData({ abi: autoConvertABI, functionName: "getAutoConvertPriority", args: [well] });
    expect(data.slice(0, 10)).toBe("0xefb1aef5");
    expect(decodeFunctionData({ abi: autoConvertABI, data }).args?.[0]?.toString().toLowerCase()).toBe(
      well.toLowerCase(),
    );
    const getter = autoConvertABI.find((entry) => entry.type === "function" && entry.name === "getAutoConvertPriority");
    expect(getter?.inputs).toEqual([{ internalType: "address", name: "well", type: "address" }]);
  });

  it("includes flow-policy access without enabling it or changing activation defaults", () => {
    const functions = autoConvertABI.filter((entry) => entry.type === "function").map((entry) => entry.name);
    expect(functions).toContain("enableAutoConvertFlow");
    expect(functions).toContain("getAutoConvertFlowState");
    expect(functions).toContain("getAutoConvertOutputLock");
  });

  it("decodes the new bounded-oracle gas error", () => {
    const data = toFunctionSelector("AutoConvertInsufficientOracleGas()");
    expect(decodeErrorResult({ abi: autoConvertABI, data }).errorName).toBe("AutoConvertInsufficientOracleGas");
  });
});
