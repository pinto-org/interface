import { afterEach, expect, it, vi } from "vitest";
import { wstethDewhitelisted } from "../releaseSettings";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("preserves live whitelist unless explicitly enabled and rejects malformed release settings", () => {
  for (const value of [undefined, "", "false"]) expect(wstethDewhitelisted(value)).toBe(false);
  expect(wstethDewhitelisted("true")).toBe(true);
  for (const value of ["1", "TRUE", " false ", "yes"])
    expect(() => wstethDewhitelisted(value)).toThrow(/must be true or false/);
});

it.each(["true", "false"])(
  "wstETH release setting %s retains identity/history while changing only its whitelist status",
  async (setting) => {
    vi.stubEnv("VITE_PINTO_DEWHITELIST_WSTETH", setting);
    vi.resetModules();
    const t = await import("../../constants/tokens");
    const lp = t.PINTO_WSTETH_TOKEN[8453];
    expect(lp.address).toBe("0x3e1155245FF9a6a019Bc35827e801c6ED2CE91b9");
    expect(lp.decimals).toBe(18);
    expect(lp.isLP).toBe(true);
    expect(t.LP_TOKENS[8453]).toContain(lp);
    expect(t.tokens[8453]).toContain(lp);
    expect(lp.isWhitelisted).toBe(setting !== "true");
    expect(t.WSTETH_TOKEN[8453].isCompositeLPWhitelisted).toBe(setting !== "true");
    expect(t.PINTO_WETH_TOKEN[8453].isWhitelisted).toBe(false);
    expect(t.PINTO_WSOL_TOKEN[8453].isWhitelisted).toBe(false);
    expect(t.MAIN_TOKEN[8453].isWhitelisted).toBe(true);
    expect(t.LP_TOKENS[8453].filter((x) => x.isWhitelisted)).toHaveLength(setting === "true" ? 3 : 4);
  },
);
