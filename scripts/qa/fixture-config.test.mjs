import { test, expect } from "vitest";
import { fixtureConfig, fixturePriceSource } from "./fixture-config.mjs";
import { readFileSync } from "node:fs";
test("QA defaults preserve the existing fork and explicit overrides stay loopback", () => {
  expect(fixtureConfig({})).toEqual({ rpc: "http://127.0.0.1:18569", port: 17845, startBlock: 53178878,
    marketEndpoint: "http://127.0.0.1:17845/__qa/market" });
  expect(fixtureConfig({ PINTO_QA_RPC: "http://127.0.0.1:18582", PINTO_QA_UI_PORT: "17846",
    PINTO_QA_START_BLOCK: "53225919" }).rpc).toBe("http://127.0.0.1:18582");
});

test("QA price reader uses the explicit fixture deployment without rewriting production files", () => {
  const address = "0xA0401A31226a90F6379baEfD47C405aC52C206B7";
  for (const path of ["../../src/constants/address.ts", "../../src/generated/contractHooks.ts"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    expect(fixturePriceSource(source, undefined)).toBe(source);
    const transformed = fixturePriceSource(source, address);
    expect(transformed).toContain(address);
    expect(transformed).not.toContain("0x13D25ABCB6a19948d35654715c729c6501230b49");
    expect(readFileSync(new URL(path, import.meta.url), "utf8")).toBe(source);
  }
  expect(() => fixturePriceSource("changed source", address)).toThrow();
  expect(() => fixturePriceSource("source", "not-an-address")).toThrow();
  expect(() => fixturePriceSource("source", "0x0000000000000000000000000000000000000000")).toThrow();
});
test("QA rejects external, credentialed, ambiguous or malformed endpoints/configs", () => {
  for (const rpc of ["https://mainnet.base.org", "http://localhost:18582", "http://127.0.0.1",
    "https://127.0.0.1:18582", "http://user:secret@127.0.0.1:18582", "http://127.0.0.1:18582/path",
    "http://127.0.0.1:18582/?key=value", "http://127.0.0.1:18582/#fragment"])
    expect(() => fixtureConfig({ PINTO_QA_RPC: rpc })).toThrow();
  for (const port of ["80", "65536", "NaN", "1.5"])
    expect(() => fixtureConfig({ PINTO_QA_UI_PORT: port })).toThrow();
  for (const block of ["0", "-1", "NaN", "1.5", "9007199254740992"])
    expect(() => fixtureConfig({ PINTO_QA_START_BLOCK: block })).toThrow();
});

test("QA supplies the same Stable2 release configuration used by production", () => {
  const source = readFileSync(new URL("./serve-redemptions.mjs", import.meta.url), "utf8");
  expect(source).toContain("process.env.VITE_PINTO_STABLE2_ADDRESS = qaStable2Address");
  expect(source).toContain("process.env.VITE_PINTO_STABLE2_RUNTIME_HASH = fixture.stable2.codeHash");
  expect(source).not.toContain("fixtureStable2Source");
});
