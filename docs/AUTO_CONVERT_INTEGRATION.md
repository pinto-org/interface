# Auto Convert integration

Protocol target: `pinto-org/protocol-audit`, `auto-convert` at
`8e811489` (November 5, 2026). This updates the current UI integration;
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

PR #22 supersedes PR #20's deferred initialization. The release seeds a nonzero
threshold from the existing valid Seed rates and eligible deposits can redeem
immediately, before the first Sunrise. Later rates blend into the EMA; a skipped
gauge update does not close redemption. The zero-threshold warm-up path is a
compatibility fallback for older intermediate builds, not a required release step.
Ordinary same-token withdrawals remain available.

PR #21 appends decision reason 15 (`NoPositionsSelected`): a funded child that
selects nothing reports outcome 0 (`Skipped`) while retaining its selector, window,
allowance and actual gas. Other child failures still report outcome 2. PR #23
optimizes internal planning without changing public function/event shapes. PR #25
restricts LP distribution gauge mutation to its scheduled Sunrise self-call; no
frontend action invokes that hook. PR #26 adds standalone protocol tooling.

Rebuild and rehearse the unsigned release from this revision. The November 4
bundle and warm-up rehearsal are historical evidence for the superseded build;
unchanged CREATE addresses do not establish unchanged runtime bytecode.
