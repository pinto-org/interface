# Auto Convert integration

Protocol target: `pinto-org/protocol-audit`, `auto-convert` at
`ab499d47` (November 4, 2026). This updates the current UI integration;
the older interface `auto-convert` branch does not contain its routed exits.

Generate and check against freshly compiled artifacts from that exact revision:

```sh
node scripts/sync-auto-convert-abi.mjs /path/to/protocol
node scripts/check-auto-convert-abi.mjs /path/to/protocol
yarn test
yarn build
```

The generator reads Foundry `out` artifacts, including AutoConvertPolicyFacet.
Do not use artifacts left over from another protocol checkout/revision.
The check compares every public function's inputs and outputs, as well as the
release Sow entry point, with the compiler output.

Redemption eligibility reads the policy, EMA, balances, germination and actual
grown Stalk at one block. A configured EMA window becomes active at Sunrise;
the returned threshold is authoritative. Quotes and selections are checked again
before signing. Both direct and routed redemption queries refresh at Sunrise.
Current releases have no Auto Convert output lock; deposit RPC failures still
block spending. Existing signed Tractor orders retain their signed targets;
new orders validate the replacement helper deployment.

Release configuration still needs the actual upgrade block and verified helper,
price and Stable2 addresses. Do not reuse old local rehearsal bytecode/addresses.
Before production cutover, rehearse this exact build on a fresh fork and verify
redemptions across Sunrise, deposit consumption during review, signed new orders,
and quotes at tiny input sizes (fee Wells reject zero-input/nonzero-output quotes).
No production deployment or address changes are performed by these scripts.

PR #20 defers release redemption initialization. A zero threshold with an initialized
EMA keeps direct and routed exits closed and displays the warm-up state. Opening
requires rates written by a post-release Seed Gauge step, normally sampled on the
second Sunrise; skipped gauge steps extend this period. Sunrise refresh discovers
the first nonzero threshold without a page reload. Ordinary same-token withdrawals
remain available. Rebuild the unsigned bundle and rehearse the exact release again;
the prior November 3 deployment evidence targets an older revision.
