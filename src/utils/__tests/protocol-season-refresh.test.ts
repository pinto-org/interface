import { test } from "vitest";
import assert from "node:assert/strict";
import { readContractQueryKey, readContractsQueryKey } from "@wagmi/core/query";
import { hasProtocolSeasonChanged, isProtocolSeasonQuery } from "../../utils/protocolSeasonRefresh";

const diamond = "0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f" as const;
const other = "0x0000000000000000000000000000000000000001" as const;
const before = { chainId: 8453, diamond, season: 100 };

test("refresh once per observed season transition, including reorgs, not initial loads or chain changes", () => {
  assert.equal(hasProtocolSeasonChanged(undefined, before), false);
  assert.equal(hasProtocolSeasonChanged(before, before), false);
  assert.equal(hasProtocolSeasonChanged(before, { ...before, season: 101 }), true);
  assert.equal(hasProtocolSeasonChanged(before, { ...before, season: 99 }), true);
  assert.equal(hasProtocolSeasonChanged(before, { ...before, chainId: 42161, season: 101 }), false);
  assert.equal(hasProtocolSeasonChanged(before, { ...before, diamond: other, season: 101 }), false);
  assert.equal(hasProtocolSeasonChanged(before, { ...before, season: 0 }), false);
});

test("match real Wagmi single/batch live reads for only the changed deployment", () => {
  const matches = (key: readonly unknown[]) => isProtocolSeasonQuery(key, 8453, diamond);
  assert.ok(matches(readContractQueryKey({ address: diamond, chainId: 8453, functionName: "balanceOfStalk" })));
  assert.ok(
    matches(
      readContractsQueryKey({ chainId: 8453, contracts: [{ address: diamond, functionName: "getGerminatingStem" }] }),
    ),
  );
  assert.ok(
    matches(
      readContractsQueryKey({
        chainId: 42161,
        contracts: [{ address: diamond, chainId: 8453, functionName: "stemTipForToken" }],
      }),
    ),
  );
  assert.equal(matches(readContractQueryKey({ address: other, chainId: 8453 })), false);
  assert.equal(matches(readContractQueryKey({ address: diamond, chainId: 42161 })), false);
  assert.equal(matches(readContractQueryKey({ address: diamond, chainId: 8453, blockNumber: 10n })), false);
  assert.equal(
    matches(readContractsQueryKey({ chainId: 8453, blockNumber: 10n, contracts: [{ address: diamond }] })),
    false,
  );
  assert.equal(matches(readContractQueryKey({ address: diamond, chainId: 8453, blockTag: "finalized" })), false);
  assert.equal(matches(["readContracts", { chainId: 8453, contracts: [{ address: other }] }]), false);
  assert.equal(matches(["readContract"]), false);
});

test("refresh deposit/lock, redemption and event queries but not unrelated app data", () => {
  for (const prefix of ["depositsWithLocks", "siloRedemption", "siloRedemptionQuote", "siloRoutedRedemption"]) {
    assert.ok(isProtocolSeasonQuery([prefix, 8453, diamond, other], 8453, diamond));
    assert.equal(isProtocolSeasonQuery([prefix, 42161, diamond], 8453, diamond), false);
    assert.equal(isProtocolSeasonQuery([prefix, 8453, other], 8453, diamond), false);
  }
  for (const prefix of ["plantEvents", "depositEvents"]) {
    assert.ok(isProtocolSeasonQuery([prefix, other, 8453], 8453, diamond));
    assert.equal(isProtocolSeasonQuery([prefix, other, 42161], 8453, diamond), false);
  }
  assert.equal(isProtocolSeasonQuery(["siloYields", { chainId: 8453 }], 8453, diamond), false);
});
