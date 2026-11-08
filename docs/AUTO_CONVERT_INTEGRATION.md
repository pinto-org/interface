# Auto Convert integration

Protocol target: `pinto-org/protocol-audit`, `auto-convert` at
`812c6c5b` (November 7, 2026 consumer refresh). This updates the current UI integration;
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
The check compares every public function, event and error shape, including argument
names and nested tuples, as well as the release Sow entry point, with the compiler
output. Generation normalizes compiler serialization order to keep ABI diffs stable.

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

PR #27 raises the automatic child limit to twelve positions. The frontend does not
cap automatic selections or reconstruct the protocol's planning budget; dynamic
position arrays and event consumers continue to retain every position. PR #30
changes reset pauses from seconds to completed Sunrises after the reset Sunrise:
`durationSunrises` defaults to 24, and `pauseUntilSeason` is a Season number.
`triggeredAt` remains a timestamp. The wire types/selectors did not change, so old
parameter names alone would not detect this semantic change. Regenerate release
startup using `resetPauseDurationSunrises`; obsolete seconds-based manifests and
calldata must not be reused. Existing timestamp-based program state needs an
explicitly reviewed migration before a protocol upgrade.

PR #31 includes Pinto once alongside each enabled whitelisted LP in the Seed-rate
mean used to seed and update redemption's EMA. The UI already reads the live policy
threshold and actual grown Stalk; it must not substitute an LP-only calculation.
PR #29 repairs repayment routing and internal-transfer checkpointing without changing
the frontend claim/transfer ABI or indexed event payloads. Existing repayment Field,
Silo and Barn reads and transaction encoders remain applicable.
The repayment planner replacement must be paired atomically with
`InitRepaymentRepair` and its refreshed route hash; do not install the new planner
against old route bytes. A prepared owner Farm may contain the release cut and a
second repair-initializer cut in one transaction. Rehearse the complete governance
envelope, including failure rollback, rather than executing its inner cuts alone.

Rebuild and rehearse the unsigned release from this revision. Earlier November
bundles and fork runs are historical evidence for their superseded builds;
unchanged CREATE addresses do not establish unchanged runtime bytecode.
