import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { decodeErrorResult, decodeFunctionData, encodeFunctionData, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";

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

  it("encodes qualified LP exits into the paired token with the reviewed minimum and deadline", () => {
    const well = "0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1";
    const data = encodeFunctionData({
      abi: autoConvertABI,
      functionName: "redeemDepositsToPairedToken",
      args: [well, [-7n], [100n], 90n, 2200n, 1],
    });
    expect(data.slice(0, 10)).toBe(
      toFunctionSelector("redeemDepositsToPairedToken(address,int96[],uint256[],uint256,uint256,uint8)"),
    );
    const decoded = decodeFunctionData({ abi: autoConvertABI, data });
    expect(decoded.functionName).toBe("redeemDepositsToPairedToken");
    expect(decoded.args?.slice(1)).toEqual([[-7n], [100n], 90n, 2200n, 1]);
  });
});
