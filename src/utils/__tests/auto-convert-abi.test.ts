import { describe, expect, it } from "vitest";
import {
  decodeErrorResult,
  decodeFunctionData,
  decodeFunctionResult,
  encodeAbiParameters,
  encodeFunctionData,
  toFunctionSelector,
} from "viem";
import { autoConvertABI } from "@/constants/abi/autoConvertABI";

describe("current Auto Convert release ABI", () => {
  it("decodes the two-word EMA redemption policy response", () => {
    const data = encodeAbiParameters([{ type: "uint96" }, { type: "uint32" }], [96n, 200]);
    expect(decodeFunctionResult({ abi: autoConvertABI, functionName: "getSiloRedemptionPolicy", data })).toEqual([
      96n,
      200,
    ]);
  });
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
    expect(functions).not.toContain("getAutoConvertOutputLock");
    expect(functions).not.toContain("getAutoConvertCappedBasketPlan");
    expect(functions).not.toContain("configureAutoConvertPolicy");
    for (const name of [
      "getSiloRedemptionEmaState",
      "getOrderedDepositMigration",
      "getAutoConvertPricePolicy",
      "getAutoConvertWaitingPolicy",
      "getAutoConvertMinPositionValue",
      "whitelistTokenWithAutoConvertPolicy",
    ])
      expect(functions).toContain(name);
  });

  it("decodes the empty automatic selection selector without classifying it as a child failure", () => {
    const data = toFunctionSelector("AutoConvertNoPositionsSelected()");
    expect(decodeErrorResult({ abi: autoConvertABI, data }).errorName).toBe("AutoConvertNoPositionsSelected");
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

  it.each(["getAutoConvertBasketPlan"] as const)(
    "%s decodes source exhaustion separately from an already-met target, including multiple Wells",
    (functionName) => {
      // Independent wire fixture: the added bool changes each array element's stride.
      const planArray = {
        type: "tuple[]",
        components: [
          { name: "well", type: "address" },
          { name: "lpAmount", type: "uint256" },
          { name: "beanAmount", type: "uint256" },
          { name: "valueUsd", type: "uint256" },
          { name: "lossUsd", type: "uint256" },
          { name: "currentPriceWad", type: "uint256" },
          { name: "postPriceWad", type: "uint256" },
          { name: "targetAlreadyMet", type: "bool" },
          { name: "sourceExhausted", type: "bool" },
        ],
      } as const;
      const plans = [
        {
          well: "0x0000000000000000000000000000000000000001",
          lpAmount: 0n,
          beanAmount: 0n,
          valueUsd: 0n,
          lossUsd: 0n,
          currentPriceWad: 3n,
          postPriceWad: 3n,
          targetAlreadyMet: false,
          sourceExhausted: true,
        },
        {
          well: "0x0000000000000000000000000000000000000002",
          lpAmount: 0n,
          beanAmount: 0n,
          valueUsd: 0n,
          lossUsd: 0n,
          currentPriceWad: 5n,
          postPriceWad: 5n,
          targetAlreadyMet: true,
          sourceExhausted: false,
        },
      ] as const;
      const data = encodeAbiParameters([{ type: "uint256" }, planArray], [4n, plans]);
      const decoded = decodeFunctionResult({ abi: autoConvertABI, functionName, data });
      expect(decoded[0]).toBe(4n);
      expect(decoded.at(-1)).toEqual(plans);
    },
  );
});
