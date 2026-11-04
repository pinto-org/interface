# Auto Convert UI fork testing

This worktree ports the Auto Convert interface changes onto `pinto-org/main`
at `60f611d5bd5b6b700fa0122277c7c4e7247d0524`. The branch is
`codex/current-ui-auto-convert`. The older `codex/group-convert-ui` checkout is
preserved separately. Nothing has been pushed or deployed to Base.

Current main already contains Tractor order creation and 0x v2 AllowanceHolder
routing. This port uses those implementations instead of transplanting the
obsolete interface's transaction stack.

## Convert bonus/capacity chart loading fix — October 30, 2026

The public `https://graph.pinto.money/pintostalk` service returned HTTP 400
`indexing_error` for both gauge history and `_meta` (reported indexed block
47812470). The compact chart also incorrectly gave its never-loaded spinner
priority over errors. Current bonus/capacity statistics below the charts were
unaffected because they read contracts, not the subgraph.

- Compact charts now show a real error/empty state, display valid zero values,
  and refresh same-length datasets. Alignment no longer reverses cached input
  arrays or discards an overlapping range when one series extends further.
- The **optional local QA server only** replaces the gauge-history hook with
  read-only Anvil observations: the release start block, real Sunrise blocks,
  and the pinned latest block. Same-Season observations use the latest sample.
  Block timestamps and hashes are retained; missing intervals are not fabricated.
  This is sampled fork history, not a full Season-end production index.
- The adapter refuses non-Anvil/non-1337 nodes, bounds the block/observation
  window, rejects missing reads/reorgs, and exposes no transaction method or
  caller-selected RPC target. Reads do not advance or reset the fork.
- Both the chart heading and QA banner disclose limited local history. Week,
  Month and All show only available observations within the requested range.
  Production builds still use the real subgraph; repairing its indexing failure
  is separate from this local UI change.

Verified on the existing **18602 / 17855** rehearsal without chain writes:

| Season | Block | Bonus Stalk / PDV | Maximum capacity (PDV) |
| --- | --- | ---: | ---: |
| 17017 | 53294787 | 0.1940949367 | 51.381879 |
| 17018 | 53294798 | 0.1921539874 | 50 |
| 17019 | 53294799 | 0.1921539874 | 50 |

Evidence for this follow-up is `/tmp/pinto-chart-fix-20261030.pU6Gwc/`.
The browser shows **0.1922** bonus Stalk/PDV and **50.00** maximum PDV capacity,
including on the All tab (`charts-loaded.png`). The fork remains at block
53294799 with its previously recorded hash (`observations.json`). All **390
tests / 48 files**, TypeScript and the production Vite build pass; 21 tests are
new chart/adapter regressions. The production bundle contains neither the QA
endpoint nor its source marker. `git diff --check` passes. The scoped
`autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high
--no-web-search` closeout returned no actionable findings; this is model review,
not an independent human audit. Full command output is in `review.log`.
This does not broaden the end-to-end coverage or production sign-off below.

## Latest-release local end-to-end verification — October 30, 2026

**The scoped local end-to-end pass is complete; production sign-off is not.**
The new isolated release covers the six contract changes that made the preceding
checkpoint stale. At closeout, all **303 project Solidity source hashes** still
match `/Users/ash/pinto/protocol`. Browser tests use a mock EOA wallet and real
transactions on a disposable Anvil child—not Base transactions or real funds.
No protocol production source, commit, push or production deployment was made
in this continuation. Other chats' later contract edits are not automatically
covered by this result.

### Exact release and isolation

- Evidence/source snapshot: `/tmp/pinto-ui-latest-20261030.rgxyMO/`.
- Base pin: **53294708**, hash
  `0xe64502d9d48ba0921166a9e293d4d22f844c1661998b0fdab4a5cc65e94bb77e`.
- Parent **18601 / chain 31337**, browser child **18602 / chain 1337**, UI
  **http://127.0.0.1:17855/**. The two nodes save periodic state dumps.
- Protected 18560/18561 and the preceding 18597/18598 remain at their recorded
  heads. This new parent also remains unchanged throughout browser testing.
- Clean compile: **386 Solidity files**. A copied obsolete Hardhat cache first
  caused artifact cleanup failure; only that temporary cache was moved aside,
  then the fully clean compilation passed. The initial failure logs are retained.
- **79 deployable artifacts** pass size checks with ordinary EVM deployment and
  transaction limits enabled. Largest runtime: `PintoFeeWellUpgradeable`,
  **24,456 bytes**, only 120 below EIP-170. `SeasonFacet` is **24,325 bytes**.
- Local direct-owner upgrade: **14,554,761 gas**. The intentional failed
  initializer rolls back accounting, whitelist, Wells and selector topology.
  This is not Safe-owner signing/broadcast rehearsal.
- **67 release contracts + 10 helper contracts** pass exact runtime, linking and
  immutable checks; **199 compiler source records** and **141 UI ABI entries**
  match. Final proof: `final-runtime-parity.json`.
- `WellPlan.sourceExhausted` is included in both generated plan getters. Two
  independent wire-encoding regressions cover opposite boolean values across
  adjacent Well tuples so the extra field cannot silently shift decoding.
  The release includes the protocol's new **8-position** automatic batch limit.

### Latest-release coverage and actual gas

| Workflow | Observed result | Actual receipt gas |
| --- | --- | ---: |
| New Pinto deposit | 1 Pinto; wallet 50 → 49; deposited 50 → 51; fresh germinating crate | 674,484 |
| Stable2 USDC-LP → deposited Pinto | 0.001 LP → **0.002707 Pinto**; exact Convert event reconciled | 3,040,723 |
| New Convert Up publication | cbETH LP source, 1-PDV target, 0.2-Pinto tip, seed check disabled; signed calldata decodes seedDifference=0 and slippage=0.001 | 778,502 |
| Independent Convert Up execution | **0.001812250575306377 cbETH LP → 1 Pinto**; publisher shows 1/1 completed | 5,535,092 |
| New LP-funded Sow publication | cbETH LP source, 1 Pinto, 1% minimum Temperature, no Morning execution, 0.2-Pinto tip | 754,653 |
| Independent Sow execution | 1 Pinto Sown at 4,750%; **48.5 Pods**; completed 1/1 and new plot visible | 2,592,759 |
| Qualified LP → paired token exit | 0.001 cbETH LP → **0.000007230883293807 cbETH**, exact quoted output received | 793,216 |
| Real Sunrise 17018 | Live header/Seeds refresh; new 1-Pinto crate still germinating | 3,170,585 |
| Real Sunrise 17019 | Live header/Seeds refresh; same crate now mature, without page reload | 3,132,458 |

There are **eight successful browser transactions**, including the initial
46,365-gas Pinto approval, followed by **two fixture-driven real Sunrises**.
The Sunrises only advance the local clock and call `sunrise()`; no oracle,
deposit, token or protocol storage is fabricated. These two intervals have
incomplete Auto Convert observations (all Wells initially invalid, cbETH still
invalid in the second). Sunrise stays alive, but this does **not** establish a
successful automatic activation or a full inventory migration. The UI fixture
uses explicitly illustrative canary settings and a small indexed sample.

Receipt/accounting evidence: `browser-evidence-53294799.json`, both
`sunrise-*.json` files and `final-checkpoint.json`. Final child hash:
`0x35ee52773274587e000c1835c55ffc8699318fcb5be8a208bfb03e418c1a6c70`.
The three LP indexes reconcile their links, counts, amounts and BDV with actual
deposits. The fresh 1-Pinto crate is unchanged by either Tractor execution;
historical reads prove it is germinating in 17017/17018 and mature in 17019.
Operator tips total exactly **0.4 Pinto**, and the owner's Pod balance is exactly
**48.5 Pods**. Tiny test tips do not cover the displayed gas estimate; successful
execution is not a claim of keeper profitability. Base L1 fees are additional.

### Failures, stale state and final review fixes

- Stable2 conversion: wrong-wallet-network state disables submission; restoring
  the network preserves the request and refreshes the usable quote.
- Qualified paired exit: hold the real gas estimate, switch accounts, then
  release it. Submission is cancelled with a wallet/network/form-changed message.
  The same test with a network switch also submits nothing.
- Actual eligibility RPC failures remove the usable exit quote and disable
  submission. Restoring reads and explicitly refreshing recovers the same
  withdrawal, which then succeeds. No transaction is sent during either race or
  the failed-read test.
- The Convert Up creation summary incorrectly displayed a retained seed minimum
  while its toggle was off. It now displays **Disabled**, matching the encoded
  zero sentinel. Enabled positive/negative values retain one-atom precision.
- Modify review now recognizes seed-only edits and derives its seed value from
  the encoded struct, not retained form text. A negative constraint displays
  **At most 2 Seeds lost per PDV**, not a required gain.
- The existing slippage comparison mixed decoded ratios and form percentages.
  Review data now derives from the encoded ratio and both sides display percent.
  An unchanged order visibly says **No changes**, with signing disabled. A
  seed-only edit shows only that change and retains **0.1%** slippage. These
  browser review checks were discarded without signing/publishing replacements.
  Existing order encoding/signature rules were not changed by these display fixes.

**369 tests / 45 files**, TypeScript and production Vite build pass (existing
dependency-annotation and bundle-size warnings remain). `git diff --check` is
clean. Read-only model review used the autoreview skill with
`--mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search`.
It identified the raw-versus-effective modification seed value; that finding
was fixed and preparation-hook regressions added. The final seed/slippage review
exited 0 with no actionable findings (`seed-slippage-review.*`). The separate ABI
review is also clean. This is model review, not independent security audit.

### Coverage boundaries and production gates

- **wstETH:** the prior October 30 browser pass proved withdrawal and conversion
  out; the latest Silo still displays it alongside retired WETH/WSOL. Release
  setting `VITE_PINTO_DEWHITELIST_WSTETH=true` prevents new deposits and conversion
  destinations while preserving historical balances/metadata. Default false
  preserves current live behavior until the matching release is installed.
- Other approved flows—Pod Market create/fill/cancel, deposit transfers,
  wrapping/unwrapping, Harvest, qualified Pinto exits, referral payout and
  time-aligned 0x paths—have the prior pinned-release evidence below. They were
  **not all re-executed on this newest child**. This pass reruns the central
  deposit/convert/Tractor paths against the refreshed release and ABI.
- Production historical order reconciliation across helper cutover and external
  chart/subgraph availability remain **unverified**. The local adapter explicitly
  indexes only newly published local orders. Historical chart spinners/unavailable
  data are visible, and a new Pod plot does not invent a historical Temperature.
- Real extension/Privy wallets, EIP-7702, mobile interaction and every 0x pair or
  market-maker route are not certified by this mock-wallet fixture. The child-only
  EOA setup and standard real-deposit transfers are recorded in fixture scripts.
- Full ordered-index backfill, production policy approval, automatic activation/
  recovery economics and a final Safe rehearsal remain separate release gates.
  Fee-exempt Sow order creation is not an existing UI flow proved by ordinary Sow.
- The modified-order screen still uses upstream coarse numeric formatting for
  some non-seed/non-slippage fields (e.g. $0.001/$0.999 shown as 0/1 in its compact
  summary). The preceding detailed review preserves the exact bounds. This pass
  does not claim universal correctness of every historical display.

Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/ui-latest-2026-10-30-rgxyMO.tgz`.
It contains the frozen protocol, tested UI source/config/lockfile, manifests,
node-state dumps, tests, receipts and screenshots; dependency installations,
build caches, credentials and private repository notes are excluded. The original
UI source contains one unrelated historical credential-shaped DevTools comment;
that comment is redacted **only in the archive copy**, without changing executable
code or the repository file. The prior
archive is retained. Sections below are historical checkpoints, not the current
status of bugs subsequently fixed.

## Earlier resumed-release QA — October 30, 2026

**Historical checkpoint; superseded by the latest-release pass above.** Browser control was restored.
This run uses a frozen copy of protocol `79d4a5a` plus the then-current local
changes, at `/tmp/pinto-ui-resume-20261030.cqndsI/protocol`. All 303 project
Solidity files matched the working checkout immediately before browser testing.
This does not imply that later edits in other chats are covered.

The fresh Base pin is **53294708**, hash
`0xe64502d9d48ba0921166a9e293d4d22f844c1661998b0fdab4a5cc65e94bb77e`.
The isolated parent is **18597** (chain 31337), browser child **18598** (chain
1337), and UI **17854**. Both nodes save periodic state dumps. Existing nodes
18560/18561 and all older rehearsal evidence remain untouched. No Base write,
push, commit, or production deployment occurred.

The three-Well release (cbETH, cbBTC, USDC) compiled **386 Solidity files**.
The local direct-owner cut used **14,554,761 gas**, below the enforced
16,777,216 transaction cap; the intentional failing initializer rolled back
the whitelist, reward parameters, facet map and Wells. Exact runtime/link/
immutable checks passed for **67 release contracts and 10 helpers**, with
**199 source records** and all **141 generated UI ABI entries** matching.
Normal EVM deployment size limits were enforced. This is not a Safe signing
rehearsal or a full index backfill/automatic-activation test. Startup uses the
documented small illustrative canary caps, not newly approved production limits.

### UI release changes and coordination

- Generated Auto Convert/redemption bindings now match the frozen build.
- Qualified LP exits can select Pinto **or the paired token**. The new paired
  route checks both view/write selectors, shares the same maturity/age selection,
  preserves the exact reviewed minimum/deadline, and revalidates/simulates before
  submission. Its cache keys are route-specific; unsupported old deployments
  remain unavailable rather than silently falling back to a different output.
- Set **`VITE_PINTO_DEWHITELIST_WSTETH=true` with the matching protocol release**.
  The default is false to preserve the still-live pre-upgrade whitelist. Invalid
  values are rejected. The token/address/history stay present; wstETH uses the
  same dewhitelisted display, withdrawal and supported conversion-out paths as
  WETH/WSOL, but is excluded from new Silo deposits and conversion destinations.
  Its underlying token is no longer marked as a whitelisted LP input. Existing
  dewhitelisted empty/about copy no longer invites unsupported new deposits.
  The local QA fixture verified the actual three-Well whitelist before enabling
  this setting; do not enable it blindly against the old live deployment.

### Current browser evidence (frozen release)

| Check | Result at this checkpoint |
| --- | --- |
| New Pinto deposit | 1 Pinto deposited; 674,484 gas; wallet 50 → 49, deposited 50 → 51; new crate displays two-Season germination |
| Qualified LP → paired token | 0.001 cbETH LP → 0.000007230868462674 cbETH; 809,502 gas; exact quoted output received and matching redemption event |
| Rejected paired exit | No transaction submitted; same quote could subsequently complete |
| Historical wstETH withdrawal | 0.001 LP withdrawn; 580,386 gas; successful receipt and remaining balance refresh |
| Historical wstETH conversion out | 0.001 LP converted to deposited Pinto; 2,336,243 gas; no Deposit tab or wstETH conversion destination |
| Unsupported wstETH fee-free exit | Shows “Fee-exempt exits are not enabled for this Well”; submission disabled; ordinary withdrawal/conversion remain available |
| New Convert Up order | Published for 1 PDV, cbETH LP source, 0.2-Pinto tip; 778,514 gas; independent operator executed in 5,552,328 gas; publisher displays completed 1/1 |
| New LP-funded Sow order | Published for 1 Pinto, cbETH LP source, 1% minimum Temperature, 0.2-Pinto tip; 754,653 gas; independent operator executed in 2,592,861 gas |
| Sow receipt/display reconciliation | 1 Pinto Sown at 4,750%, 48.5 Pods; completed 1/1 order and 48.5-Pod plot visible; operator's two tips total 0.4 Pinto |
| Funding-picker USD labels | Quotes in Pinto are multiplied by Pinto USD price, as are direct Pinto deposits; missing price/quote shows unavailable; PDV display unchanged |

The wstETH test transferred 0.01 of a **real existing stem-0 deposit** from
`0x9acc596e15d9ac657c3663eeb9cdc2b55f638a7c` to the disposable QA publisher,
using standard transfer hooks on the child only. That setup transaction is
recorded separately in `wsteth-fixture.json`; it is **not** a browser transaction.
No synthetic token/oracle storage was injected. EOA wallet delegation was
cleared only on the child as documented in the fixture; extension wallets,
Privy and EIP-7702 remain outside this pass.

Nine successful browser transactions span blocks **53294790–53294799**, excluding
the fixture-only transfer at 53294793. Final child hash:
`0xf7d3ec1f9901054dcfac59901e7e8b79f25f4b5eaa15cbe78d9284a0831a1054`.
The Convert Up execution is
`0xe1b0ab8fd3781823afb4ce83b1d92ff7aded14a4ecfd76b70adb1b1a9fba15fe`;
Sow execution is
`0xbec9ba5000e9e20b6ff61e85108e62f36e7937ea7b1dd742e871daf656710d1b`.
These are **local fork hashes**, not Base transactions. The three enabled LP
indexes reconcile with the stored deposits, totals and bidirectional links.
The fresh germinating 1-Pinto deposit remains intact after both Tractor executions.
This does not establish full production backfill coverage. Sow and Convert Up
used the ordinary fee-paying route, not a fee-exempt Sow blueprint. Both tiny
operator tips were below the displayed estimated execution cost; success here
does not establish economic profitability.

The browser exposed another instance of the approved funding-unit bug: LP
withdrawal quotes were labeled as dollars, and the suggested source compared
those Pinto quantities against a dollar-valued Pinto balance. Both now use
consistent units. For example the cbBTC LP picker displays approximately **$139**,
not a dollar-prefixed **4,217.61 Pinto**. Seven regressions cover the display,
suggested source at below/above-peg prices, missing quotes/prices and unchanged
PDV mode. This does not replace the conservative execution-capacity checks.

**349 tests / 44 files**, TypeScript and the production build pass after the
funding-unit follow-up (existing bundle warnings). Scoped read-only
autoreviews used `--mode local --engine codex --model gpt-6.1-sol --thinking high
--no-web-search` and the bundled CLI. The paired-exit integration, whitelist
setting, and funding-unit/dewhitelisted-copy reviews each exited 0 with no
actionable findings. This is model review, not independent audit.

### What still prevents current-release sign-off

Other protocol work continued after the source freeze. Six of the 303 sources
now differ: `AutoConvertViewFacet`, `IAutoConvert`, `AutoConvertConstants`,
`LibAutoConvertExecution`, `LibAutoConvertPriority`, and
`LibAutoConvertWellSafety`. This includes the preview's new `sourceExhausted`
field and automatic conversion sizing/direction behavior. **Do not pair this
snapshot's generated ABI/evidence with those later artifacts and call it tested.**
After the contract work stabilizes, compile a new frozen release, regenerate the
bindings, verify actual deployed runtime/selectors, and rerun the affected UI
and controller checks on a separate local fork. The preserved UI remains paired
with the source/ABI it actually tested. `final-checkpoint.json` records the
precise source hashes and preserved fork heads; `final-runtime-parity.json`
records the final frozen-runtime verification.

Production API history across the helper cutover, real extension/Privy wallets,
EIP-7702 behavior, full mobile interaction, and historical charts/subgraphs are
not certified by this loopback fixture. Some historical charts visibly report
unavailable data, and the new Pod plot correctly declines to invent a historical
Temperature. Eligible referral payout has prior pinned-release evidence below,
but was not rerun in this snapshot. Fee-exempt Sow order creation is still a
separate feature decision, not an existing UI path proved by ordinary Sow.

Evidence directory: `/tmp/pinto-ui-resume-20261030.cqndsI/`; source pin,
release/helper manifests, parity reports, receipts, tests and screenshots are
kept together. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/ui-resume-2026-10-30-cqndsI.tgz`.
It includes frozen protocol source, local node state dumps, and the tested UI
source/config/lockfile, excluding dependency installations, build caches,
secrets and private repository notes. The older sections below are preserved historical checkpoints;
their obsolete runtime/plugin blockers do not describe this resumed session.

## Post-commit continuation — October 29, 2026

**QA is still incomplete.** The local checkpoints are protocol `c0f9a4e` and
interface `d43d6581`, authored/committed as `fordpintomoney`; neither was pushed.
Unrelated approved Pod Market changes remain outside the interface checkpoint.
The original continuation checks changed no production source or contract; the
separately approved Sow UI fix below now changes only UI source. Neither replaces
either protected fork. The Stable2 fault/recovery pass sent no transaction;
the two LP-funded Sow passes below each sent only their two documented
disposable-child transactions.

### Latest-release isolated rehearsal checkpoint — October 29, 2026

#### Current release-input gate — historical checkpoint is now stale

The saved browser checkpoint below is **no longer the latest protocol source**.
Subsequent work in the other protocol chats changed seven of its referenced
sources: `AutoConvertConstants`, `IAutoConvert`, `LibAutoConvertExecution`,
`LibAutoConvertStable2Policy`, `LibAutoConvertWellSafety`, `LibCases`, and
`AutoConvertViewFacet`. The aggregate price-guard and Seed-ratio changes were
still being validated when checked. This QA continuation does not edit or
approve those contract changes or overwrite their artifacts.

`release-input-preflight.mjs` now rejects changed/missing project sources,
unsuccessful/incomplete saved parity evidence, and mismatched UI Auto Convert
or Sow ABIs. It reads artifacts from the explicit protocol directory without
loading Hardhat's cwd-dependent configuration, tasks or providers. It neither
compiles nor makes an RPC call. Its result is explicitly **input freshness only**;
a separate live runtime/selector/topology check is still required against the
chosen fork, and both checks must be repeated after relevant edits.

Before a new latest-release browser run, obtain a fresh successful parity report
from the rebuilt isolated fixture, then run:

```sh
node scripts/qa/release-input-preflight.mjs PARITY_JSON PROTOCOL_ROOT UI_ROOT
PINTO_QA_PARITY_REPORT=PARITY_JSON PINTO_QA_PROTOCOL_ROOT=PROTOCOL_ROOT \
  PINTO_QA_RPC=http://127.0.0.1:NEW_ANVIL_PORT PINTO_QA_UI_PORT=NEW_UI_PORT \
  PINTO_QA_START_BLOCK=NEW_START_BLOCK \
  node scripts/qa/serve-redemptions.mjs NEW_FIXTURE_JSON
```

Replace the uppercase placeholders with the independently verified new fixture
paths/ports/block; do not reuse old endpoints or manifests blindly. The optional
legacy-fixture path remains available, but now prints an explicit warning that
current-release source/ABI parity was **not** checked. Startup RPC checks have a
15-second deadline instead of hanging indefinitely.

The current guard **fails as expected** on the seven changed sources above.
**336 tests / 42 files pass**, TypeScript and the production Vite build pass
(existing bundle warnings), including 17 new guard tests. A real read-only smoke check from the interface working directory read
all 11 required artifact ABIs without loading the Hardhat runtime. Browser
instructions remain missing after the app-update recheck, and the fork/UI ports
remain stopped. There is no new live-fork or browser success in this follow-up.
Scoped autoreview (`--mode local --engine codex --model gpt-6.1-sol --thinking
high --no-web-search`, explicit bundled CLI, three QA files) caught the
cwd-dependent Hardhat load. After fixing and testing it, the final helper
exited 0 with no actionable findings (`review-final.json`). This is model review.
Evidence: `/tmp/pinto-release-input-gate.0KDbAk/`; durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/release-input-gate-2026-10-29.tgz`.

#### Order access/loading follow-up and current environment

The Field page now keeps **See all Tractor Orders** and its dialog mounted
independently of the background history/forecast. Loading, empty results, an
error, or a post-execution refresh cannot remove the entry point or unmount an
open dialog. This does not bypass operator simulation or receipt validation.

Publisher cards explicitly omit the historical Soil allocation pass they do
not display. Forecast consumers retain the existing Soil query, fallback and
tip-priority allocation. Empty result sets also skip the unnecessary query.
History-only and forecast queries have distinct cache keys; a new regression
test caught the missing discriminator in the initial patch, which is fixed.
This removes a known dependency, **not all API/RPC loading delays**, and does
not validate the existing fallback forecast or production indexer behavior.

Validation: **319 tests / 41 files pass**, TypeScript passes, and the production
Vite build passes with the existing bundle-size warnings. Ten new tests cover
loading/empty/error access, dialog persistence, forecast opt-out/default behavior,
completed-order filtering and cache isolation. A read-only comparison of all
**194 contract source records** in the saved parity report found no changes
since the successful browser rehearsal. It is not a new live-chain check.

Scoped autoreview used `autoreview --mode local --engine codex --model
gpt-6.1-sol --thinking high --no-web-search` with the bundled Codex CLI and
an explicit seven-file scope. Its first finding matched the cache-isolation
regression above. After that fix, the final helper exited 0 with no actionable
findings (`review-final.json`). This is model review, not an independent audit.

**The rehearsal is not currently running.** After interruption, ports 18591–18596
and 17852–17853 have no listeners; the known active process sessions no longer
exist. No fork was reset or overwritten in this follow-up. Saved receipts,
screenshots, manifests and archives remain, but no full Anvil state dump was
found in the latest fixture directory. The in-app browser skill's supplied
`SKILL.md` is also missing. Consequently these latest loading changes have
component/unit coverage, **not a new browser pass**. The block hashes below are
last-verified historical checkpoints, not claims about a live fork today.

New evidence: `/tmp/pinto-order-access.NBlk0K/`; durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/order-access-2026-10-29.tgz`.
The earlier browser evidence and its archives below remain unchanged. QA is
still incomplete; no deployment, commit, push or additional contract change
occurred here.

#### Tractor completion-state follow-up

The approved Tractor UI cleanup now records **blueprint** completion only after
the receipt contains a `Tractor` event from the expected Diamond for that
blueprint. A transaction hash alone, or a successful wallet cancellation
replacement without execution, does not count. Pending sends remain serialized
until confirmation/error, and each send invalidates sibling gas/profit previews
without preventing their individual resimulation. Explicitly resimulating all
orders can retry recurring orders in a later Season; it still runs the contract
simulation and does not assume an order is executable.

The shared transaction hook gained two optional settings, used by this execution
screen: operation-specific receipt validation and a captured confirmation-chain
ID. Submission also passes that captured chain ID, so switching the wallet during
gas estimation cannot silently retarget the write. Other callers do not opt into
the Tractor event validator. The installed Wagmi receipt action already reports
mined reverts as errors; its behavior was checked rather than replaced.

Two additional browser-created, Pinto-deposit-funded Sow orders executed on
**18595 / UI 17853**, using the independent operator:

| Pass | Publication block / gas | Execution block / gas | Result |
| --- | --- | --- | --- |
| Initial completion fix | 53247831 / 65,468 | 53247832 / 1,881,395 | Operator row displayed Executed; another row could independently simulate and report same-Season replay rejection |
| Final event-validated, chain-pinned fix | 53247833 / 65,480 | 53247834 / 1,881,407 | Matching Tractor event accepted; operator row displayed Executed with old gas/profit preview cleared |

Final order:
`0xaaed27488a2f1be93023504f1dca05f029d5aa5feae89e45b77b5396c2cb6186`.
Each execution removed **1.2 mature deposited Pinto** at stem `2539971964`,
Sowed 1 Pinto, credited **48.37 Pods**, and paid **0.2 Pinto** to the operator.
Final on-chain totals are **145.11 publisher Pods** and **0.8 operator internal
Pinto**. The final publisher view displayed **145.11 Pods**, all three Sow orders
at **1/1 (100%)**, and the latest order Executed 1 time, without a post-execution
reload. Both nonce/replay checks, signed helper/source/amount checks and all
three LP index reconciliations pass. The newly germinating 1-Pinto crate remains
untouched through block 53247834. Final gas limit was **3,130,305**, not the gas
used, and still below the active transaction cap.

No protected fork advanced. Latest disposable child head is **53247834**,
`0x417f9471557185b141a75c1f87a77e3a017d67b2f517c87d3d6e646e604bb26b`.
There were four additional status-1 browser transactions in this follow-up.
Current release parity was rechecked at block 53247833: all 65 deployments,
10 helpers, exact UI ABIs, selector topology and source/artifact freshness pass.
No contract edits, new deployment, Base write, commit or push were made here.

Validation: **309 tests / 38 files pass**, TypeScript passes, and the production
Vite build passes with existing bundle-size warnings. Regression tests cover
pending/instant receipts, preflight/signing/confirmation failures, missing or
wrong execution events, cancellation/speed-up replacements, sibling previews,
recurring retries, and network changes during and after submission. Wallet
replacement and pending-network races are component/hook tests, **not real-wallet
browser certification**. Scoped `autoreview --mode local --engine codex --model
gpt-6.1-sol --thinking high --no-web-search` closeout (explicit bundled Codex CLI,
four-file scope) accepted and fixed the receipt-event and chain-binding findings;
the final helper exited 0 with no actionable findings. This is model review,
not an independent audit.

**Order loading remains a limitation.** The first new order appeared without a
browser reload, but slowly. A separate read-only timing diagnostic used real
historical Soil RPC (no synthetic data): new publication/cancellation/completion
log reads took roughly **4–5 ms**, while the Soil log query from block 53204632
timed out after **15 seconds**, delaying the loader until its existing fallback.
This verifies one blocking dependency, not the entire cause of the longer
browser delay or correctness of the fallback Soil estimate. Browser transport,
Soil semantics and production indexer behavior were not changed to hide it.
Development hot reloads during edits disconnected the disposable wallet; those
reconnections are not evidence of seamless real-wallet session persistence.

Evidence: `/tmp/pinto-tractor-completion.fzZR1J/`, including
`completion-53247834.json`, `verify-completion.cjs`, `order-latency.json`,
`executed-row-final.png`, tests/build logs and `review-closeout.json`; related
receipt/core/parity reports remain in `/tmp/pinto-latest-ui-release.1kA0q2/`.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/tractor-completion-2026-10-29.tgz`.
The original broader coverage matrix and limits below still apply. The goal
remains active; this follow-up does not certify every UI action.

#### Browser continuation on this exact release

The fresh browser child **18595 / UI 17853** has now executed the first core
workflow pass, with no transaction on its protected parent. This section is
incremental evidence, not production approval or a full-route certification.

| Browser action | Block | Receipt gas | Verified result |
| --- | ---: | ---: | --- |
| Approve Pinto spending | 53247823 | 46,365 | Approval confirmed |
| Deposit 1 wallet Pinto | 53247824 | 697,952 | Wallet 50→49; deposited 50→51; new germinating stem 77859021751 |
| Convert 0.001 cbETH LP | 53247825 | 2,448,860 | 0.554299 deposited Pinto; 0.000693 Pinto fee burned |
| Convert 0.01 Stable2 LP | 53247826 | 3,117,334 | 0.026934 deposited Pinto; 0.000068 Pinto fee burned |
| Publish 1-PDV Convert Up order | 53247827 | 1,365,686 | Includes mature-Pinto deposit optimization; fresh germinating crate excluded |
| Operator executes Convert Up | 53247828 | 9,049,086 | 1 deposited Pinto, 0.2-Pinto tip; completed 1/1 in UI; replay rejects |
| Publish LP-funded 1-Pinto Sow order | 53247829 | 765,100 | Signed cbETH LP source; mature-Pinto optimization |
| Operator executes LP-funded Sow | 53247830 | 2,672,109 | 1 Pinto Sown; 48.37 Pods; 0.2-Pinto tip; completed 1/1 in UI |

Convert Up order
`0xd7f3a7fc1b3f0296343d28e3a7889e72f0bc0eba9bb7e2cd23ff97a22858ce17`
used the default **unchecked seed filter** without the old workaround. Decoding
the published calldata verifies `seedDifference = 0` and
`slippageRatio = 1000000000000000` (0.1%). Opening Modify showed 0.10%; changing
the advanced field to 0.25% and canceling restored 0.10% and zero seed constraint.
That edit check did not publish another order or alter the original signature.
The execution consumed cbBTC LP, with 0.2 Pinto for its tip plus 1 Pinto for the
conversion. Gas limit was 15,257,614, below the enabled 16,777,216 cap. The UI
estimated 9,579,274 gas and negative operator profit before L1 fees; these
fixture values are not a live Base gas-price quote.

`record-browser.cjs` and `verify-browser-core.cjs` reconcile historical receipts,
deposit amounts, signed targets/parameters, nonce/replay, operator payment and
all three LP indexes. The fresh 1-Pinto germinating crate is unchanged at every
checked block through 53247830. `release-parity-after-core.json` again passes
65 release deployments, 10 helpers, source freshness, selectors and both UI ABIs.

The Sow order is
`0x5d7c73229d4c5f56d8df061366163144b6218e96b273e2d35eab80ba3ac336cc`.
Publisher history eventually displayed it at 0/1, but Field orderbook loading
remained delayed. A direct historical Soil-log read timed out; a separate,
read-only diagnostic, bounding logs to local publication blocks and exercising
the loader's existing Soil fallback, discovered this order with 1 Pinto of
funding. That diagnostic is **not browser success**, does not validate historical
Soil, and changed neither the UI transport nor chain state. An explicit browser
reload/reconnection recovered the operator orderbook; no fork was reset. This
is not proof of prompt automatic refresh or a proven explanation of the stale
result. The completed publisher card subsequently refreshed to **1/1 (100%)**,
**Executed 1 time**, with **48.37 Pods** displayed, without a second reload.

Before executing Sow, the QA wallet deliberately rejected the first send.
The child stayed at block 53247829 with the same hash, no tip and no Pods added.
The row cleared its old gas/profit preview and exposed **Resimulate**. Individual
resimulation restored a fresh 2,872,151 gas estimate; retry succeeded with gas
limit 4,595,740. It consumed **0.002166528195291783 cbETH LP** from mature negative
stem **-1401600973**, burned **0.003008 Pinto** in fees, and funded the 1-Pinto Sow
plus its 0.2-Pinto operator tip. Soil decreased by exactly 1, total operator
internal Pinto became 0.4, and nonce 1 rejects same-Season replay. The upstream
Sow price-deviation tolerance remains 100%; this successful execution is not
an endorsement of that tolerance or sandwich-resistance evidence.

At the first core checkpoint, an operator-display issue was observed: after successful Sow, its
execution row stayed visible with a disabled **Resimulate** label. Source review
shows completion stores a transaction hash but row checks use the blueprint
hash; the existing global post-execution flag also disables simulated rows.
The publisher's final completion and chain receipts are correct. This pass did
not change that state machine. The separately tested follow-up above now fixes it.

Latest child head: **53247830**,
`0x2d38d10786ccaa55b19ca6f66b96458de163d003497e4a0dacebc3323ac8f6c0`.
`isolation-after-core.json` verifies both the prior parent/browser child and
the new protected parent retain their recorded hashes. Only the new disposable
child advanced, by **eight status-1 browser transactions**; rejection added none.
The initial-flow window still has zero samples and is not ready. Browser/manual
and Tractor conversion successes do not prove automatic recovery activation.

| Acceptance area | Latest-release evidence | Still unverified / limited |
| --- | --- | --- |
| New deposit | Browser deposit, wallet balance and germinating crate match historical state | Two-Season progression is prior-fixture evidence, not repeated on this child |
| Existing-deposit converts | CP2 and Stable2 LP→Pinto; exact output and fees reconciled | No new LP→LP/external-router or every-pair claim |
| New Tractor creation/execution | Convert Up and LP-funded Sow; independent operator; signed target/parameters and counters checked | Fee-exempt Sow still lacks a creation UI; ordinary Sow tolerance remains unchanged |
| Failure/recovery | Wallet rejection sends nothing; individual resimulation/retry succeeds; completed signatures reject replay | Not every transaction/failure class retested on this release |
| Displayed state | Sampled wallet/deposit/Pods/Soil/Season/order progress and tips reconcile; operator completion-label fix verified in the follow-up above | Historical charts fail or load slowly; orderbook reload was needed in the initial pass and later passes still load slowly |
| Code/ABI/isolation | 65 deployments + 10 helpers, source freshness, exact ABIs and selectors; protected hashes unchanged | No full inventory migration, successful flow activation, real-wallet/Privy/EIP-7702/mobile or production-indexer sign-off |

Evidence is in `/tmp/pinto-latest-ui-release.1kA0q2/`, including
`core-verification-53247830.json`, `order-discovery.json`, `order-read.log`,
`deposit-confirmed.png`, `convert-edit-restored.png`,
`convert-order-simulation.png`, `convert-order-completed.png`,
`sow-rejected-resimulate.png` and `sow-order-completed-visible.png`.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/latest-release-browser-core-2026-10-29.tgz`.
Only QA documentation and local evidence scripts were added in this continuation;
no production behavior, project commit, push or Base write was made.

After separate approval, a new rehearsal was created at
`/tmp/pinto-latest-ui-release.1kA0q2/`: parent **18594**, browser child **18595**,
Sunrise child **18596**, UI **17853**. It uses the same Base **53247743** pin for
comparison, not a claim to the latest Base block. The earlier forks were not
reset or upgraded. The previous active browser child remains at 53247836 after
the documented tests below; its parent remains at its original 53247820 hash.

The deployment uses the explicit local-only startup configuration from the
previous rehearsal: four Wells, quote-liquidity-weighted aggregation, the
current compiled flow policy, bounded LP/value/loss limits, zero fixed reward
and a 1-BDV position floor. These are not new approved production parameters.
The Diamond cut enables the controller and initial flow gate atomically, but
neither full inventory backfill nor successful flow activation is established.

- **Valid cut: 14,682,059 gas**, transaction
  `0x98a95a17f542352ef24f4d261d7644d180f35eda3f4c13d2675ac1ef37a1bded`.
  The 16,777,216 transaction cap and normal EVM code/initcode limits remain enabled.
- Deliberately invalid initializer: 13,846,215 gas, status 0, with Diamond map,
  Well state and reward parameters unchanged. Accounting/supply/custody are
  also unchanged by the successful cut; four Well fee/caller checks pass.
- The first valid preflight returned a reason-less call failure. The unchanged
  call then passed both with explicit gas and the original default request;
  estimation was 16,272,769. The attempt was **resumed**, not reset/redeployed,
  after verifying the exact rollback checkpoint and repeating topology, code,
  owner and simulation checks. Its initial failure cause remains undetermined.
- Exact parity passes for **65 release deployments and 10 helpers**, all
  referenced project sources, the selector map, and both UI release ABIs.
  The Auto Convert ABI now has **123 entries**: its only semantic addition is
  the read-only `getAutoConvertFlowWindow()` summary. Deposit/withdraw ABIs and
  the Sow helper ABI did not change. On both new children the getter returns
  an empty, not-ready window.
- Largest runtime remains SeasonFacet **23,909 bytes** (667 bytes below EIP-170);
  Fee Well is 23,718, SiloFacet 23,290. These margins are not an audit or proof
  that an arbitrarily larger future cut fits.
- **238 local flow tests plus 2 explicitly enabled production-fork tests pass**.
  The latter cover actual Well routes and illustrative allowance comparisons,
  not flow-enabled Sunrise activation. ABI regression tests also pass.
- Three separate-child Sunrises used **3,664,843 / 3,611,240 / 3,478,063 gas**.
  All completed, but frozen production oracle data yielded no valid opening
  baseline: zero activation credit, no ready flow window and no conversion.
  No synthetic oracle rounds or trading flow were supplied. This is fail-closed
  liveness evidence, not peg recovery or full-cohort conversion evidence.

The browser child holds real transferred mature deposits and 50 wallet Pinto;
only its disposable public-Anvil address's EIP-7702 delegation was cleared, as
explicitly labeled EOA QA. Its initial block is **53247822**,
`0x6e7e9d40b5ef9396f7113f08a9dc887d5141c2fa554af46d55d33dc3ef0accc7`.
At this initial deployment checkpoint, the UI was connected but had **not yet
rerun browser deposits/conversions/orders**. The continuation above now records
that pass. Older browser evidence below belongs to the earlier pinned release. No project
commit, push, Base broadcast or production deployment occurred.

Key evidence: `release/report.json`, `release/rollback.json`,
`release-parity-before-ui.json`, `isolation.json`, `flow-tests.log`,
`flow-fork-tests.log`, `sunrise-smoke.json`, and the preserved failed/resumed logs.

### Approved UI blockers and eligible-referral payout — October 29, 2026

This section supersedes the pending status of these specific fixes in the
historical entries below. It does **not** certify the entire interface or the
latest contract release. The user separately approved the listed UI fixes and a
new isolated latest-release rehearsal; every existing fork remains preserved.

#### Eligible referral: real pinned-chain eligibility, no manufactured rewards

On the existing browser child **18592 / UI 17852**, read-only discovery found
`0xfb7c4c283e2b7d4b96cd2c5f4fed551907b3c66c` already eligible: 9,903.151399
Pinto previously Sown versus the 1,000-Pinto threshold. Neither eligibility nor
oracle storage was fabricated. The fixed form previewed **2.42 estimated bonus
Pods** for a 1-Pinto Sow, using the current 5% referee percentage and available
reward pool. Browser signing/publication and independent-operator execution
succeeded for order
`0x968ea61c1fe436f88bc5ba19b633ae309fb124a072060a6d447eb5cb1c921b15`.

| Measured result | Amount |
| --- | ---: |
| Actual Pinto Sown | 1 |
| Base Pods credited to publisher | 48.37 |
| Additional referee Pods credited to publisher | 2.4185 |
| Additional Pods credited to referrer | 4.837 |
| Shared referral reward pool consumed | 7.2555 Pods |
| Operator tip | 0.2 Pinto |
| Publication gas, block 53247833 | 66,532 |
| Execution gas, block 53247834 | 2,061,166 |

The publisher's Pods rose from 96.74 to **147.5285**; the UI showed **147.53**
and a completed 1/1 order. The signed target/referral, `SowReferral` event,
historical account balances, shared reward counter and Soil decrement agree.
Nonce is 1; replay rejects. The fresh germinating 1-Pinto crate remains untouched,
and three LP indexes still reconcile with deposits and bidirectional links.
The execution gas limit was 3,422,472. The UI estimate was 2,156,417 gas and
−$0.023428 before L1 fees at fixture prices—not a current Base fee quote.

Evidence: `/tmp/pinto-eligible-referral.ur37Nv/`, especially
`eligible-verification.json`, the read-only scripts and before/after screenshots.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/eligible-referral-2026-10-29.tgz`.
This closes eligible-referral **Tractor payout** coverage on the pinned release;
it does not add a fee-exempt Sow creation UI or certify live indexer history.

#### Explicitly approved blocker fixes

- Modify Sow always supplies the Diamond to release validation, including when
  it intentionally skips deposit optimization; fresh funding checks remain.
- An unchecked Convert Up seed filter encodes the contract's zero sentinel.
  Existing one-atom constraints remain checked when edited. Edit hydration
  converts slippage ratios to percentages, and canceled advanced edits restore
  raw form units without another percentage conversion.
- Shared transactions and the sibling Claim flow stop after estimation failure
  or a zero estimate; neither sends using a fabricated fallback gas limit.
  Failed Tractor attempts clear stale gas previews and allow individual
  resimulation, including after wallet rejection. Simulations use the operator.
- Publish success callbacks run on confirmation, not merely receipt of a hash.
  Publish/modify/cancel refresh the actual nested Tractor query namespace;
  publication also refreshes deposits affected by optimization.
- Unavailable opening prices no longer divide by zero. Price-impact queries
  are account/chain-specific and their clear operation matches their real keys.
- Market select-all checkboxes use Radix's indeterminate state, and disconnected
  account queries cannot manually refetch with an undefined owner.

The browser modified the eligible referral order to 1.1 Pinto: atomic cancel
and replacement publication used **466,654 gas**, block **53247835**,
transaction `0x40eab5e445e3da9404e48767e99768510953e2355a3a9a00cebabf484cc03b0c`.
Replacement `0xbb3ba1e57d893428a347ab96275635543e48f4d63099c05dca478eefcb5e8e96`
appeared at 0/1.1 without reloading. A rejected cancellation sent nothing; retry
canceled it in **71,101 gas**, block **53247836**, transaction
`0xf1769c5b389a28a94dd9eeab59dafaed2af1824800bf940a93070f37a1aa8aec`.

With a positive 0.001-USDC-LP conversion quote, reporting unsupported chain 1338
now leaves the page intact, shows unavailable impact and disables Convert.
Restoring 1337 recovers the quote without reload; no transaction was sent.
The QA connector never sends outside loopback. This is not real-wallet coverage;
other unsupported-network display artifacts, such as zero USD values, remain.

Validation: **295 tests / 37 files pass; TypeScript and Vite build pass**.
The scoped `autoreview --mode local --engine codex --model gpt-6.1-sol
--thinking high --no-web-search` used a temporary pre-change snapshot and the
bundled CLI. Its accepted retry finding was verified, fixed and covered by four
component regressions. The final scoped review returned **no actionable
findings**. A mistakenly targeted retry was stopped and is not the final review.
Model review is not an independent audit. Evidence and logs are in
`/tmp/pinto-ui-blockers.3TQT4g/`. No project commit, push or Base write occurred.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/ui-blocker-fixes-2026-10-29.tgz`.

### Pinned-release continuation and approved referral preview fix — October 29, 2026

This continuation uses the existing **18592 / UI 17852** child, not another
deployment. Parent 18591 and all earlier forks are preserved. Four new browser
transactions succeeded; no Base writes or push occurred.

**Source-parity caveat:** before these transactions, the fork still matched its
release manifest and selector map, and all **ten helpers** matched current
artifacts/source. However, the working tree/artifacts had advanced since the
18:10 audit below: `AutoConvertViewFacet` executable code changed, five other
release artifacts differed without executable changes, and three flow sources
were newer than their build inputs. The UI Auto Convert ABI was still 122 entries
versus 123 in current artifacts. Thus this is evidence for the **pinned release
and unchanged Tractor helpers**, not validation of the latest flow edits. No
recompilation, redeployment or generated-ABI update was performed in this pass.

| Browser action | Verified result | Execution gas |
| --- | --- | ---: |
| Publish Convert Up | One-PDV total/min/max, least-Seeds source, explicit zero-seed workaround, 0.2-Pinto tip | 68,272 |
| Execute Convert Up as separate operator | cbBTC LP → 1 deposited Pinto; 0.2-Pinto tip; completed | 9,036,064 |
| Publish referral Sow | 1 Pinto total/min/max, pure-Pinto source, 4736% minimum, Morning off; includes optimizing 51.581233 mature Pinto | 766,184 |
| Execute referral Sow as separate operator | 1 Pinto Sown; 48.37 normal Pods; **zero bonus Pods** for the ineligible referrer; completed | 1,898,955 |

Convert Up order:
`0xa5fbee2d0c5dd8a5d2cf2fb1e55e0ddc905ed4d31b3d19e691c3acff7ce06344`.
Conversion consumed **3,282,138,256 cbBTC LP atoms / 0.201503 input BDV**;
output is **1 Pinto / 1 BDV**. Tip funding separately consumed 656,429,276 LP
atoms. Total Well fees burned were 0.003009 Pinto. Transaction gas limit was
15,279,758, below the enabled 16,777,216 limit. The operator UI estimated
9,583,617 gas and −$0.127883 profit before L1 fees at fixture prices; this is not
a live Base fee quote. Default seed-toggle behavior remains an unresolved issue.

Referral order:
`0xdf17ff7d25d05577931c57bf8194bc044bb8d9e68ed55bf4cf8dc824b2c27297`.
Its signed call targets the runtime-verified replacement `SowBlueprintReferral`.
The referral address is the disposable operator, whose on-chain referral Sown
amount is **0**, versus a **1,000-Pinto** eligibility threshold. Execution removed
1.2 mature Pinto: 1 Sown and 0.2 tipped. The publisher's total Pods rose from
48.37 to **96.74**. No `SowReferral` event or referral Pods were produced. The
operator UI estimated 1,991,631 gas and −$0.021111 profit before L1 fees.
This covers the ineligible-referral execution path, not a successful eligible
referral payout. Order discovery took several minutes, and completed orders
also appeared in the execution chooser; those existing UI issues are not fixed here.

For both orders, nonce is 1 and read-only replay rejects. The fresh 1-Pinto
germinating crate is unchanged. Three LP indexes reconcile with live deposits,
forward/backward links and indexed-amount sums. The UI shows both orders
completed. Final child block is **53247832**,
`0xd27fdc3314dbc0e4a685e370745db496ca0c68a1e92d84088c875903f80b7a40`.

#### Approved referral-only production UI fix

The unpatched form called the ineligible address a valid referral and previewed
**2.42 bonus Pods**, despite the actual zero bonus above. After explicit user
approval, both regular Sow and Tractor Sow now:

- Read eligibility, referee percentage, total rewards and reward cap at one block.
- Use the current percentage, floor bonus Pinto first, and cap estimated referee
  Pods at the remaining shared pool; no hard-coded 5% reward assumption.
- Omit bonuses for ineligible/self/invalid referrals, missing data, failed reads,
  refreshes and offline-paused refreshes, or unsupported/disconnected contexts.
- Scope cached data to chain, Diamond, wallet and referrer; label bonuses as
  estimates that can change before execution, rather than already-earned rewards.

This changes **preview/validation text only**, not signed payloads, referral
contract policy, execution rules, or fee exemptions. Ineligible codes can still
be included in an order, and the contract can Sow normally without a bonus.
The browser confirms the warning and absence of bonus in both affected forms.
Eligible/partial-pool/error/network/account-change paths have automated coverage;
an eligible-referral payout was not manufactured on the fork.

Validation: **272 tests pass in 31 files**, including **13 referral regressions**;
Vite production build passes. TypeScript still reports the same four pre-existing
Pod Market errors, with none in this patch. The structured review found a real
offline-paused-refresh gap; it was verified against TanStack Query and fixed with
a regression. The final autoreview run is **clean, no actionable findings**
(`referral-review-final.json`). It used `autoreview --mode local --engine codex
--model gpt-6.1-sol --thinking high --no-web-search`, the bundled desktop CLI,
and an isolated temporary repository containing only this scoped delta. This is
model review, not an independent human audit. An initial review attempt rejected
an invalid absolute-path finding; the same model was retried with valid paths.

Evidence: `/tmp/pinto-ui-continuation.Ocfo1p/`, including
`parity-before.json`, `order-verification.json`, the read-only discovery diagnostic,
test/build/typecheck logs and before/after screenshots. Durable copy:
`/Users/ash/.codex/state/pinto-release-evidence/ui-referral-continuation-2026-10-29.tgz`.
The diagnostic bounds
historical Soil logs and uses the existing funded-orders fallback; it is not
production historical-event coverage. The actual browser tests used the unchanged
QA server and its original event-query path. No contract storage or oracle state
was fabricated for these browser checks.

Remaining acceptance work includes latest-flow-release ABI/runtime parity,
full migration and activation, eligible-referral payout, fee-exempt-Sow creation,
the documented Modify Sow/seed/slippage/network/cache defects, and real-wallet,
mobile and production-indexer checks. This remains **not production sign-off**.

### Authorized current-release rehearsal — October 29, 2026, 18:10 UTC

The user authorized a **separate local-only rehearsal**. This pass deployed and
tested the current compiled release without upgrading or resetting the protected
forks. It is **not production sign-off**, a full inventory migration, or a Safe
execution rehearsal. Base was used only for reads. No push or Base broadcast occurred.

Final evidence root: `/tmp/pinto-final-release-ui.RFQJvr/`. Local endpoints are
parent **18591** (chain 31337), browser child **18592** (chain 1337), Sunrise child
**18593** (chain 31337), and UI **17852**. All start from Base block **53247743**,
hash `0x72d59e21e2aa264e19ab3d1fe29fb454c3ffde00ee3ba6346b53d6120718eca2`.
This deliberately reuses the earlier production-state pin for comparison; it is
not a claim to have used the latest block at the end of the pass.

The final source/artifact/runtime check passes for **65 release deployments and
10 helpers**, their links/immutables, the installed selector map, all referenced
project sources, and the **122-entry** UI Auto Convert ABI plus Sow ABI. The final
check is after the browser transactions. During an earlier attempt, three flow
sources changed after compilation; that attempt is not the current-source proof.
The final attempt rebuilt, pinned the source hashes, and verified they stayed unchanged.
An initial nested-fork transport also timed out; the final parent reads Base directly.

Startup uses the branch's current **1% liquidity / 0.1% market-valued supply /
$10,000 minimum** flow policy and the current Weather liquidity × Pod Rate wait
table. Separate **illustrative local configuration** is explicit in
`release-config.json`: quote-liquidity-weighted aggregation; four Wells; maximum
LP per Well equal to 0.1% of the pin's deposited LP; $100 value/Well and $0.10
loss/execution ceilings; zero fixed reward; 1 BDV position floor. These test
choices are not approval of production startup parameters. The controller starts
with the initial flow gate enabled. Indexes are enabled but not fully backfilled.

| Check / browser action | Result | Actual gas |
| --- | --- | ---: |
| Deliberately invalid initializer | Receipt status 0; facet map, Wells and reward settings unchanged | 13,821,755 |
| Atomic release cut | Controller configured/active, flow gate enabled; supply, Silo globals and custody unchanged | 14,657,600 |
| Approve Pinto spending | Local disposable publisher only | 46,365 |
| Deposit 1 Pinto | Wallet 50 → 49; deposits 50 → 51; new crate visibly germinating | 697,952 |
| CP2 convert | 0.001 cbETH LP → **0.554299 Pinto** | 2,448,860 |
| Stable2 convert | 0.01 USDC LP → **0.026934 Pinto**; 0.000068 Pinto fee burned | 3,117,334 |
| Publish new LP-funded Sow order | Includes UI optimization of 50.581233 mature Pinto, preserving its amount/BDV, then publication | 1,362,836 |
| Separate operator executes Sow | 1 Pinto Sown; 48.37 Pods; 0.2 Pinto operator tip | 2,688,734 |

All six browser transaction receipts succeeded. New Sow order:
`0x26782653ab2018334de9361ecb22d8306e89e118377254b1fd350bdf7de00551`.
Source is cbETH LP only, total/min/max 1 Pinto, minimum temperature 4736%,
Morning off, no referral. Execution removed **0.002166528195291783 LP / 0.221891
BDV** at stem **−1401600973**, received exactly 1.2 Pinto, and burned **0.003008
Pinto** in Well fees. Nonce is 1, replay rejects with `Blueprint already executed
this season`, and the publisher UI shows **1/1 (100%), Order Completed, 48.37 Pods**.
Indexed amounts, individual deposits and both directions of the node links
reconcile for all three LP assets held by this fixture. This is maintenance
coverage, not proof that the entire historical index has been backfilled.

Simulation estimated 2,889,040 gas and **−$0.033732 operator profit before L1
fees**, using fixture prices/gas. This is not a live Base cost estimate or a
recommendation for the tip. The upstream ordinary-Sow 100% slippage setting is
unchanged; execution success is not sandwich-safety evidence. Publication again
required a reload to appear in the operator orderbook, followed by a loading
delay. The separate known cache issue is not fixed here.

Three real Sunrises ran on the separate time-advanced child, without injected
oracle rounds, fabricated flow, or price storage changes:

| Season | Actual gas | Complete valid Well coverage | Flow / conversion result |
| --- | ---: | --- | --- |
| 16992 | 3,664,843 | None of four observations valid | Sunrise completes; no credit or conversion |
| 16993 | 3,611,240 | cbBTC and USDC valid; cbETH/wstETH invalid | Sunrise completes; no credit or conversion |
| 16994 | 3,478,063 | cbBTC and USDC valid; cbETH/wstETH invalid | Sunrise completes; no credit or conversion |

The flow counter remains uninitialized with zero eligibility: no complete
baseline is fabricated from this frozen-oracle scenario. This verifies liveness
and the missing-data gate, **not successful activation, a full waiting period,
or an automatically converted cohort**. Full-history/oracle and migration tests
remain separate requirements. The largest runtime is SeasonFacet at **23,909
bytes**, leaving **667 bytes** below EIP-170. Fee Well is 23,718 bytes and SiloFacet
23,290 bytes. Normal EVM runtime/initcode and transaction-gas limits stayed enabled.

Verification and scoped cleanup:

- Hardhat compiled the updated snapshot successfully; final exact parity passed.
- UI suite rerun: **259 passed**, 29 files. This pass does not imply a new full UI build.
- Flow suite initially had **221 passes / 1 failure**: its 20,000-Pinto sale creates
  $17,764.029785 adverse flow against a $19,069.841798 opening allowance, so the
  old debit expectation was stale after the allowance increase.
- **Test-only** cleanup retains that inside-allowance scenario and adds a
  40,000-Pinto excessive-flow scenario. Both assert positive actual emitted flow,
  the frozen opening allowance and the corresponding counter direction. The
  rerun passed **223 tests**, zero failures/skips, with 256 fuzz runs. No
  production policy or contract code was changed by this cleanup.
- The autoreview skill's read-only `gpt-6.1-sol` review of this isolated test delta
  returned no actionable findings. It is model review, not independent audit.
  Command used `--mode local --engine codex --model gpt-6.1-sol --thinking high
  --no-web-search` with the bundled desktop CLI and a temporary excerpt repository.

The new parent remains at block **53247820**, hash
`0x3fb65d611d1d7d9a90dd3cb9911c94ab9167f7a111108d5da45e20e6f4eb1caf`.
Final browser child: **53247828**, recorded in `browser-evidence-53247828.json`.
No writes/reset were sent to old **18584/18585**. The old child head was rechecked
unchanged; the old parent timed out on the post-run read, so its final head was
not independently reverified. Its last verified head remains in the earlier audit.

Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/current-release-ui-rehearsal-2026-10-29.tgz`.
Key files: `release/report.json`, `release-parity-final.json`, `source-pin.json`,
`browser-evidence-53247828.json`, `order-verification.json`, `sunrise-observations.json`,
`flow-tests-corrected.log`, `test-review.json`, and `sow-completed-visible.png`.

**Still open:** the separately identified Modify Sow preparation bug, known
network-switch/cache/seed/slippage issues, current-source Convert Up order
execution, referral-order and fee-exempt-Sow UI coverage, full migration/activation
rehearsal, and real-wallet/mobile/production-indexer checks. A compatible referral
helper was deployed and runtime-verified, but no referral order was exercised.
The successful sampled routes above do not establish universal UI correctness.

### Earlier acceptance audit — October 29, 2026, 17:22 UTC

**Not complete; no production sign-off.** A fresh read-only audit revalidated
all **16 recorded browser receipts** from blocks **53247822–53247837**, including
their status, block and gas. This is revalidation of earlier actions, not 16 new
executions. All **65 core** and **nine helper** runtime hashes still match the
preserved deployment manifests; the Diamond selector map also matches. Neither
child **53247837** nor parent **53247819** changed during the audit.

The current artifacts' referenced project Solidity sources are fresh, but their
executable code differs from the preserved fork in **nine** contracts/libraries:
`LibAutoConvertCurve`, `LibAutoConvertFlowOracle`, `LibAutoConvertFlowTransition`,
`LibAutoConvertFlowActivation`, `SeasonFacet`, `LibAutoConvertStable2Policy`,
`AutoConvertAdminFacet`, `AutoConvertViewFacet`, and `InitAutoConvertRelease`.
There are no missing linked deployments in the comparison. This supersedes the
earlier **two-executable-differences** observation below, not its saved evidence.
The generated UI Auto Convert ABI remains **122 entries, semantically equal**
to current artifacts, and the Sow entry-point ABI is also equal. ABI equality
does not establish runtime-behavior equality.

| Goal requirement | Evidence and current disposition | What remains |
| --- | --- | --- |
| Browser deposits and conversions | Pinto and LP deposit, CP2 and Stable2 conversion, exemptions and accounting have successful receipts on the preserved release | Rerun affected paths against a separately authorized current-code fixture; sampled pairs do not cover every route |
| New Tractor creation/execution | Convert Up, Pinto-funded Sow and LP-funded Sow succeed with separate operators; corrected funding form's 1-Pinto order executes | Modify Sow preparation is blocked by the missing address below; known seed/slippage/preflight defects remain |
| Balances, deposits, Seasons and orders | Sampled displayed values reconcile with historical state; two-Season maturity and output-lock evidence exists on older fixtures | New flow/Sunrise behavior is absent from this browser fixture; history/cache/chart findings remain |
| Failure and stale-state behavior | Deposit-read failure/recovery, stale inventory atomic rollback, replay, account switches and rejection paths exercised | Network-switch crash and other documented UI defects await scoped fixes; QA connector is not real-wallet coverage |
| Complete route/setup coverage | Explicit limitations retained in the historical matrix | Referral requires a compatible local helper; fee-exempt Sow lacks a creation UI; Privy/mobile and production-indexer reconciliation remain unverified |
| Preservation and no live writes | Runtime/selector/receipt/head assertions pass, with no transactions in this audit | No fork was reset/upgraded, no deployment or Base write occurred, nothing pushed |

Approvals are outstanding for the scoped Modify Sow fix and for a **separate
local-only current-release rehearsal**. The latter must use explicit reviewed
startup parameters, preserve existing forks, and must not infer authority for a
Base deployment. Older requests for unrelated production fixes/setup remain
separate; a passing sampled route does not waive them. The current preserved
controller remains deliberately unconfigured/inactive, so this audit supplies
no new flow-activation or automatic-conversion behavior evidence.

Evidence: `/tmp/pinto-ui-acceptance-audit.gZjeH5/audit.json` and `abi.json`, with
their read-only scripts. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/ui-acceptance-audit-2026-10-29.tgz`.
No production source was changed or compiled, no ABI was regenerated, and no
test rerun is implied. Latest full UI test/build results remain the **259-test**
pass below; the separate new Modify regression is intentionally red.

### Approved Sow funding-unit fix — October 29, 2026

The user approved the scoped upstream unit fix in both the new and modified
Sow-order forms. They now compare Pinto with Pinto: a single-block read of the
deployed Silo helper's eligible withdrawal inventory followed by each selected
Well's fee-paying `getRemoveLiquidityOneTokenOut` quote. Pure Pinto uses its
unlocked token amount. Wallet balances and LP dollar prices do not count as
funding. The ordinary encoder's max-grown-Stalk filter is shared with the quote;
ordinary germinating withdrawals remain allowed. This does not change Auto
Convert eligibility, output locks, contracts, ABIs, or signed order structures.

Account, chain, source strategy and configured helper addresses scope the query.
Failed or pending refreshes cannot reuse successful funding approval. Preparation
performs a fresh read. Validation reserves one operator tip for every minimum-sized
fill, rounded upward; this is a conservative **current-state** check, not a promise
of future price, Soil, available deposits or successful execution. Existing unsupported
`MULTI_TOKENS` encoding is not added here; that selection fails closed.

The same capacity calculation drives the amount slider. Both initial forms expose
the tip editor before the funding gate so an excessive default can be lowered.
Default minimum and maximum amounts retain all six token decimals, rather than
display-rounding to two decimals. Inputs such as `.5` and `.2` remain accepted.

| Check | Result |
| --- | --- |
| Current child cbETH inventory | **0.019254790211655960 LP → 10.664835 Pinto**, net of the Well fee |
| New and modified LP-funded forms | **1 Pinto + 0.2 tip** reaches review; **11 Pinto** is rejected; neither order was signed/published in this pass |
| Excessive tip recovery | A **20-Pinto** tip blocks funding but its first-step editor remains accessible; lowering to **0.2** restores Next |
| Decimal/default boundary | `.5` accepted; **10.464835 + 0.2 = 10.664835** reaches review; editable min/max fields both retain **10.464835** |
| Read-only helper plan for 1 + 0.2 | **0.002166527935135902 LP** across fresh and mature stems quotes exactly **1.200000 Pinto**; no execution was sent |
| Empty operator account | Selected LP capacity is zero; external wallet balances do not substitute |
| Existing Convert account switch | Switching publisher → operator clears the old positive Convert quote/input; returning does not revive it; no transaction |

There are **21 focused tests**, including exact funding/tip boundaries, missing
reads, source/account/network changes, late responses, and failed refreshes.
Full current dirty-tree suite: **259/259 tests in 29 files pass**, including seven
separate pre-existing Market tests. `vite build` passes with the existing chunk-size
warning. `tsc --noEmit` still reports four unrelated upstream Market errors:
`MyListingsTable.tsx:222`, `MyOrdersTable.tsx:236`, `useMyPodListings.ts:31`, and
`useMyPodOrders.ts:26`. This is not a clean full TypeScript or production sign-off.

Structured closeout used `autoreview --mode local --engine codex --model
gpt-6.1-sol --thinking high --no-web-search` with the approved scoped prompt and
bundled Codex binary. Four findings were verified and fixed: tip-editor reachability,
multi-fill slider tips, rounded form defaults, and leading-dot inputs. The final
run exited 0 with **no accepted/actionable findings**. This is model review, not
an independent human audit.

Both chain heads remained unchanged throughout these fix checks: child **53247835**
and protected parent **53247819**, with the hashes recorded below. No deployment,
push or new chain transaction occurred. Evidence: `/tmp/pinto-sow-capacity.1BddBq/`
(read-only fork plan, screenshots/AX captures, test/build/typecheck logs and all
structured review results). Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/sow-capacity-fix-2026-10-29.tgz`.
Broader QA remains incomplete; the separate network-change crash and release
identity qualification below still apply.

### Corrected form: 1-Pinto LP-funded Sow executed end to end

After the funding-unit fix, the previously rejected **1-Pinto** request was
created, reviewed, signed and published in UI **17849**, then simulated and
executed by the separate QA operator on disposable child **18585**. No helper
or protocol upgrade was made; runtime hashes match the preserved manifests.
Source was cbETH LP only, total/minimum/maximum **1 Pinto**, minimum temperature
**4737%**, Morning OFF, tip **0.2 Pinto**, no referral. This is an ordinary
fee-paying withdrawal/Sow, not Auto Convert or a fee-exempt redemption.

Order: `0x26c568b33ff5b8aaf1559fd7641c74403633ba559ce0d62f8e43fa6ab9a13a2e`.

| Browser action | Transaction | Block | Actual gas |
| --- | --- | ---: | ---: |
| Publish (no deposit optimization needed) | `0x0134129d28c735d7da73ef94dacfeb3a7f580159ae67885cd29a183914708d03` | 53247836 | 65,492 |
| Separate operator executes | `0x930017e954fdb3470f01de57904f424bd45f93d43cf0fbb936e7d42ddd2ada9b` | 53247837 | 2,694,450 |

Both receipts have status 1. Browser simulation estimated **3,009,742 gas** and
**−$0.035429 operator profit before L1 fees**, at fixture gas/token prices.
This is not a live Base cost estimate or an economically viable tip recommendation.
The signed upstream **100% Sow slippage** remains unchanged; success is not
sandwich-safety evidence.

The execution withdrew **0.002166527935135902 cbETH LP / 0.790111 BDV**:
all **0.001254790211655960 LP / 0.696733 BDV** at fresh stem **28480204044**,
and **0.000911737723479942 LP / 0.093378 BDV** at mature stem **−1401600973**.
It received **1.200000 Pinto**, sowed **1.000000 Pinto** for **48.370000 Pods**,
and credited **0.200000 Pinto** to the operator's internal balance (**0.6 → 0.8**).
The Well burned **0.003008 Pinto** in fees. Publisher external/internal Pinto
stayed **48.555270 / 0**. Soil fell **265.328350 → 264.328350** and publisher
Pods rose **53.207000 → 101.577000**.

The fresh node was completely removed and the mature node partially withdrawn.
Read-only assertions verify node count **2 → 1**, the remaining mature node's
amount **0.017088262276520058 LP / 1.750136 BDV**, matching `getDeposit`, head
equal to tail, zero previous/next links, and exactly **2166527935135902 LP atoms**
removed from both indexed and total deposited balances. Index completeness
remains false; this is maintenance coverage, not full migration certification.
No execution `Convert` event occurred. Completion counter and nonce match;
read-only replay reverts with `Blueprint already executed this season`.

The publisher UI eventually displays **1/1 (100%), Order Completed, executed
once**, and **101.58 Pods**. The new publication again required a reload to
appear in the operator orderbook, and history had a visible loading delay.
The operator panel retained the completed row with a disabled Resimulate button;
these checks do not establish timely cache refresh.

One separate upstream display/filter boundary was observed and left unchanged:
`SoilOrderbook.tsx` uses strict `reqTemp < temperature.max` for its current-temperature
summary and filter, although the contract accepts equality. The published
**4737%** order was excluded from the summary at **4737%**, yet simulated and
executed successfully. Those comparisons are unchanged from upstream `60f611d5`;
this is outside the approved funding-unit fix.

Final child: **53247837**,
`0xb9ab81458a1bb1cd24a24de026fae7f950d2b25539da1dbc49b04c40f5eafce5`.
Protected parent remains **53247819**,
`0x5d806c26d0d416f7dae6d7e25aadcf8a4b16fdf481ebe8f6a9f6c92a191d1bac`.
Evidence: `/tmp/pinto-sow-fixed-execution.NOinq6/` (read-only before/after
assertions, signed parameters, receipts, browser simulation and completion).
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/sow-fixed-execution-2026-10-29.tgz`.
The preserved release still lacks the newer Auto Convert invariant-cache
bytecode. No deployment, push, mainnet write or new production-source change
was made in this follow-up.

### Modify Sow: preparation blocker confirmed, separate fix awaiting approval

A subsequent browser check opened Modify on completed local order
`0x26c568b33ff5b8aaf1559fd7641c74403633ba559ce0d62f8e43fa6ab9a13a2e`,
changed its total to **1.234567 Pinto** and retained the cbETH source and
**0.2-Pinto** tip. Funding validation passed and the review displayed the exact
six-decimal amount. **Submit did not advance to signing or replacement.** No
signature, cancellation, publication or execution was sent in this pass.

The cause is separate from the funding-unit fix:

1. `ModifySowOrderDialog` calls `handleCreateBlueprint(form, undefined, ...)`,
   intentionally omitting optional deposit-optimization inputs.
2. The shared hook passes `protocolAddress: deposits ? protocolAddress : undefined`
   to `createSowTractorData`, incorrectly treating protocol identity as optional
   alongside optimization.
3. The existing release guard immediately rejects a missing protocol address.
   Both the conditional argument and the guard are present in committed `d43d6581`;
   this is not introduced by the current funding-unit delta.

An isolated mounted-hook regression executes both paths. The no-optimization
Modify case **fails** its required-protocol-address assertion; the new-order case
with optimization inputs **passes**. It uses mocked funding/encoding boundaries
and does not claim full browser or onchain execution. It is kept outside the
repository while the production fix awaits approval. The proposed change is to
always pass the protocol address, keep optimization optional, and retain the
release guard. No guard bypass or production change was made.

Child **53247837** and protected parent **53247819** remain byte-for-byte at their
previous heads. Source digests, no-write assertions, the failing regression and
browser evidence are in `/tmp/pinto-modify-sow.LZeIlZ/`; durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/modify-sow-preparation-blocker-2026-10-29.tgz`.
The two earlier unit/form and new-order execution passes do **not** prove the
Modify signing/publication/execution path. Overall QA remains incomplete.

### Current-fork LP-funded Sow, completion display and index accounting

UI **17849**, child **18585**, Season **16991**: a new cbETH-LP-only Sow order
was created, signed and published with the QA publisher, then simulated and
executed by the separate QA operator. Total/minimum/maximum were **0.1 Pinto**,
minimum temperature **4737%**, Morning OFF, tip **0.2 Pinto**, no referral.
The deployed SowBlueprint runtime was checked against its existing manifest;
no helper was deployed or upgraded for this check.

Order: `0xf115b04816519c9ef584e621398a7b1a5ad010ec040292e32e69973f8c9a1f25`.

| Browser action | Transaction | Block | Actual gas |
| --- | --- | ---: | ---: |
| Publish, including preparatory Pinto deposit combination | `0xa5f48cbdee48693c09576fa3bb4f73b561157a4c4d4827715eb9bdbae3422310` | 53247834 | 736,056 |
| Independent operator executes | `0xc889b12867f14b55768d49ac9a053ef3013f70f07bd68f0c336a9ad26a03cfeb` | 53247835 | 2,636,977 |

Both receipts have status 1. The operator simulation estimated **2,853,833 gas**
and **−$0.033237 profit before L1 fees**, using the fixture's displayed 0.006-gwei
gas price and token prices. This tiny test and its tip are not an economic
recommendation or a current Base gas quote. The signed Sow tolerance remains
the upstream hard-coded **100%**; success here does not validate sandwich safety.

The execution withdrew **0.000541631638138314 cbETH LP / 0.300747 BDV** from
fresh stem **28480204044**, returned **0.300000 Pinto**, sowed **0.100000 Pinto**
for **4.837000 Pods**, and credited **0.200000 Pinto** to the operator's Farm
Wallet (**0.4 → 0.6**). `PintoFeeBurned` records **0.000752 Pinto**. This is the
ordinary fee-paying withdrawal/Sow route, not a qualified fee-exempt redemption.

The default ordinary-Sow helper explicitly permits germinating withdrawals and
prefers least-grown Stalk. It is therefore expected to use fresh LP before the
mature crate. Auto Convert's separate two-Season eligibility rule is unchanged.
The surviving fresh crate is **0.001254790211655960 LP / 0.696733 BDV**; mature
stem **−1401600973** remains **0.018 LP / 1.843514 BDV**. No `Convert` event
occurred in the execution itself. Publication separately combined mature Pinto
deposits to stem **2556057491**; it did not withdraw LP.

Read-only assertions check both current node amounts/BDVs against `getDeposit`,
reciprocal next/previous links, zero endpoint links, unchanged node count **2**,
and exactly **541631638138314 LP atoms** removed from both `indexedAmount` and
total deposited LP. The index remains globally incomplete; this is partial
withdrawal maintenance evidence, not migration certification. The completed
order counter/nonce are checked, and a read-only replay rejects completion.

| Display/check | Result |
| --- | --- |
| Publisher order history | After a visible loading delay, **0.1/0.1 (100%), Order Completed, executed once**, cbETH LP source and 0.2-Pinto tip |
| Publisher Pods | **48.37 + 4.84 = 53.21** displayed; exact chain total **53.207000**; Plot temperature metadata unavailable |
| Remaining LP | Silo shows **$0.37** total; fresh detail shows **0.70 recorded/current PDV**, zero grown Stalk, still germinating |
| External publisher Pinto / internal Pinto | Exact unchanged **48.555270 / 0** during execution; wallet rounds external amount to **48.55** |
| New publication refresh | Order initially absent from cached operator orderbook; reload recovered it; not timely-refresh sign-off |
| Protected parent / read-only follow-up | Parent unchanged; no chain transactions during completion-display and index follow-up |

**Original upstream unit mismatch (subsequently fixed with approval above):** asking to Sow **1 Pinto** from the
selected cbETH LP disabled Next with “Total amount cannot exceed your available
deposits.” The initial LP inventory was **0.019796421849794274**, valued by the
form at about **$0.381983**. Its **0.018 mature LP alone quoted 9.969837 Pinto**
through the fee-paying Well removal, ample for 1 Pinto plus the 0.2-Pinto tip.
`SowOrderDialog.tsx` and `Tractor/form/SowOrderV0Fields.tsx` multiply LP amount
by `tokenPrices.instant` (which `usePriceData.ts` supplies as USD/LP), then
compare that USD value directly with requested Pinto. At discovery all three files
were unchanged from upstream `60f611d5`. The successful 0.1-Pinto test exercised
an accepted smaller input; it did not fix or disprove this defect. Approval was
requested and subsequently granted for the separate scoped fix documented above.

Final child: **53247835**,
`0xdf5d9b1397674ac78871b18631228c182e2aca4f75d4c5e2144ca8a294d5eeb3`.
Parent remains **53247819**,
`0x5d806c26d0d416f7dae6d7e25aadcf8a4b16fdf481ebe8f6a9f6c92a191d1bac`.
Evidence: `/tmp/pinto-ui-lp-sow.ccSNnF/`, including before/after receipts and
state, read-only `index-proof.json`, the rejected 1-Pinto form, simulation,
completed order, publisher Plots and remaining-deposit screenshots. Durable
archive: `/Users/ash/.codex/state/pinto-release-evidence/lp-funded-sow-ui-2026-10-29.tgz`.
The release-identity qualification below still applies: this preserved fork does
not execute the newer Auto Convert invariant-cache bytecode. Overall QA remains
incomplete; the network-change crash, unresolved upstream issues and explicitly
unverified routes below are not waived by this successful transaction.

### Stable2 conversion fault/recovery matrix

The browser uses UI 17849 and child RPC 18585. The starting publisher owns
**0.019 PINTOUSDC LP**, in stem `629222512`, with **0.019 BDV**. The displayed
deposit summary rounds to 0.02 LP, while the conversion form correctly shows
0.019 available. A fresh 0.001-LP-to-Pinto quote resolves through the explicitly
configured replacement Stable2 loader; the tiny output is displayed as `<0.01`.
This pass checks the form, not a new conversion receipt.

| Sequence | Observed result | Acceptance |
| --- | --- | --- |
| Healthy 0.001 Stable2 LP quote | Positive output preview and enabled Convert; correct 0.019-LP availability | Pass for quote readiness |
| Fail actual deposit RPC reads, including retries | Four failed reads; input resets to 0, output clears, Convert disables; ownership stays visible; explicit unavailable-data alert | Pass; unavailable data is not described as an Auto Convert lock |
| Restore successful reads | Available balance returns to 0.019; input stays 0; no old positive output returns; Convert stays disabled | Pass; no recovered-zero/old-quote mismatch |
| Enter a fresh 0.001 quote, then report unsupported wallet chain 1338 | Entire React page goes blank; console reports `RangeError: Division by zero` from `calculatePriceImpact` | Fail; recorded upstream UI defect, not fixed |
| Reload after recording the failure | App renders again with local wallet chain 1337, no quote, fault injection off and QA wallet disconnected | Recovery requires reload; not graceful network-change handling |

The network test changes only the QA connector's reported chain. All RPC traffic
remains on the loopback child, and the QA signer independently prohibits sending
on the simulated unsupported chain. It is **not** a real-wallet/Privy test or
evidence of a transaction being sent to another network. Neither Convert nor any
other submission action was clicked in this pass.

Source inspection confirms the crashing `src/hooks/wells/usePriceImpactSummary.ts`
is unchanged from the upstream base `60f611d5`. Its calculator guards a missing
post-conversion price but divides by the opening price without checking for zero.
`usePriceData` represents unavailable opening data as zero. The conversion form
can still hold a price result during the network transition, exposing this
combination. The shared price-impact query also lacks explicit account/chain
fields in its key; that deserves a scoped check, but this pass does not claim it
proved cross-account execution. Approval was requested for a separate guarded
unavailable-price fix, context-scope checks and regressions. No production fix
was inferred from the testing goal.

### Release identity qualification

In the earlier post-commit comparison, all **65 preserved core deployment hashes**
matched their original manifest and there were no missing linked deployments. The
protocol checkpoint now includes invariant caching added after the browser
release was created. Its `LibAutoConvertCurve` and `LibAutoConvertStable2Policy`
executable runtimes differed from this fork. Other changed runtimes in that report
differ only in Solidity metadata. Thus the earlier exact-current-artifact claim
below is historical: this is still a valid preserved release fixture, **not**
an execution rehearsal of the newly committed cache optimization. No silent
upgrade, reset, or substitution was made to obtain a passing comparison. The
17:22 UTC acceptance audit above records the subsequent nine-contract drift.

The commit-time checks separately passed 659 Auto Convert tests, 231 tests on
the exact staged UI tree, both builds, and runtime/initcode limits for all 78
checked contracts. The staged UI intentionally omits seven unrelated Market tests;
its TypeScript check reports five upstream Market errors, including the missing
`MarketplacePodListing` export supplied by an uncommitted Market change. Those
checks do not cover or dismiss the new browser crash above.

### Isolation and evidence

Read-only before/after assertions confirm that both heads, Season 16991,
the publisher's Stable2 deposit and replacement Stable2 runtime hash are unchanged:

- Child: **53247833**, `0xdb5821419e8e48ef365229c3b93a08cb94aae4f200e97cc1ff3981f6b0c99e93`.
- Protected parent: **53247819**, `0x5d806c26d0d416f7dae6d7e25aadcf8a4b16fdf481ebe8f6a9f6c92a191d1bac`.

Evidence directory: `/tmp/pinto-ui-continuation.afHVb7/`. It contains the read-only
assertion scripts, `before.json`, `after.json`, `release-drift.json`, the captured
console stack, accessibility snapshots and screenshots for the quote, read failure,
safe recovery and blank-page failure. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/stable2-network-fault-2026-10-29.tgz`.
It does not replace any earlier evidence. Referral helper configuration, missing
fee-exempt Sow creation UI, real-wallet/mobile testing and production-indexer
reconciliation remain unresolved as detailed below.

## Release acceptance summary — October 29, 2026 (before commit checkpoint)

**The current-release rehearsal and affected browser regressions pass, but overall
UI QA remains incomplete. This is not production sign-off.** The October 28 release
drift below is now resolved by a new isolated release, not by rewriting the older
evidence. No production activation, Base broadcast, push, or repository commit
was performed.

### Current release, ABI and isolation

- Fresh Base snapshot: **53247743**, hash
  `0x72d59e21e2aa264e19ab3d1fe29fb454c3ffde00ee3ba6346b53d6120718eca2`.
- New parent RPC: **18584**, chain 31337. New browser child: **18585**, chain
  1337, UI **17849**. Both enforce Osaka's transaction gas cap and ordinary EVM
  contract-size restrictions; no unlimited-size setting was used.
- **65 core release deployments** match the current linked artifacts exactly,
  including metadata. Their artifact digests and referenced project-source hashes
  match. **Nine standalone helpers** also match their expected runtimes, with
  their actual immutable values checked. The Diamond selector map matches.
- The successful Diamond cut used **12,761,096 gas**. An intentionally invalid
  cut reverted after **13,818,461 gas**, preserving the Well state, selector map,
  accounting and reward parameters. This is a direct-owner local rehearsal, not
  a production Safe-execution sign-off or a completed deposit-inventory migration.
- Largest runtime: **SeasonFacet, 23,860 bytes**, leaving **716 bytes** below
  EIP-170's 24,576-byte limit. PintoFeeWellUpgradeable is 23,718 bytes; SiloFacet
  is 23,290 bytes. These are measured release artifacts, not estimates.
- Regenerated `autoConvertABI.ts`: **122 entries**, including flow state/enable
  functions, `AutoConvertInsufficientOracleGas`, and the Well-parameterized
  `getAutoConvertPriority(address)` selector **0xefb1aef5**. The obsolete
  no-argument selector **0xad1c8f90** is absent on the new fork. The standalone
  Sow ABI remains semantically unchanged. Three regression tests cover the ABI.
- Auto Convert is deliberately **unconfigured and inactive**. LP indexes are
  enabled but incomplete; Pinto's ordered index is not enabled. This UI fixture
  does not certify the complete inventory or exercise automatic activation.
- Parent remains **53247819**, hash
  `0x5d806c26d0d416f7dae6d7e25aadcf8a4b16fdf481ebe8f6a9f6c92a191d1bac`.
  Final browser child is **53247833**, hash
  `0xdb5821419e8e48ef365229c3b93a08cb94aae4f200e97cc1ff3981f6b0c99e93`.
  Read-only evidence scripts assert the parent is unchanged.

The previously used RPC services (18564/18565/18569/18580/18581/18582/18583)
were unreachable when this session resumed. They were not restarted, reset or
overwritten; their saved evidence and archives remain preserved. Their live heads
were **not revalidated this session**.

### Browser transactions on the current release

Every action below was performed through the UI, with public Anvil test wallets
and no real funds. Receipts are status 1; a separate read-only script verifies
events and historical balances. These are **execution gas**, not current Base
dollar costs or L1-data-inclusive fees.

| Action | Verified result | Execution gas |
| --- | --- | ---: |
| Deposit 1 wallet Pinto | New 1-Pinto germinating deposit; wallet 50 → 49 Pinto | 691,591 |
| Fee-free sale of 1 mature deposited Pinto via Stable2 | Wallet receives 0.034840 USDC; no Well fee-burn event; fresh Pinto untouched | 931,791 |
| Direct conversion of 0.001 mature cbETH LP | 0.554299 Pinto deposited | 2,432,982 |
| Deposit LP funded with 1 wallet Pinto | 0.001796421849794274 cbETH LP; 0.997480 BDV; new germinating node | 2,008,563 |
| Publish new Convert Up order | Targets new helper; includes mature-Pinto deposit optimization | 760,917 |
| Independent operator executes Convert Up | 1 Pinto output deposited, 0.2-Pinto tip, order completes | 9,037,000 |
| Publish new Pinto-funded Sow order | Targets new helper; includes mature-Pinto deposit optimization | 736,068 |
| Independent operator executes Sow | 1 Pinto sown, 48.37 Pods, 0.2-Pinto tip, order completes | 1,889,337 |
| Fee-free exit of 0.001 mature cbETH LP | 0.555270 wallet Pinto; correct indexed-amount decrease | 776,099 |
| Stable2 LP conversion after production-config fix | 0.001 USDC LP → 0.002694 deposited Pinto; correct index and deposit balances | 3,115,301 |

The two prerequisite wallet approvals each used 46,365 gas and are additional
to the action costs above. Publication includes deposit optimization in these
specific accounts; it is not a fixed publishing cost.

Convert Up order:
`0x7d6ddc5da63e8fc12a36e4916f5cefd6688dd6e0b8d03a12c17e2f8652af75dc`.
The least-Seeds strategy selected **cbBTC LP**, not the cbETH LP used by the
manual conversion test. Execution converted **3,282,138,256 LP atoms** into
1 Pinto and separately consumed **656,429,276 LP atoms** to fund the tip.
The explicit zero-seed workaround remains in use; the pending seed-toggle bug
was not silently fixed. Its UI gas estimate was 9,566,402, versus 9,037,000 used.

Sow order:
`0xb8647fa2dde389ff969d128a6aa0ad25181e3ad35a8680442df9328ef4e3adc0`.
It uses deposited Pinto only, 1 Pinto total/minimum/maximum, 4737% minimum
temperature, Morning OFF and a 0.2-Pinto tip. It removed **1.2 mature Pinto**,
reduced Soil by **1 Pinto**, and increased the publisher's Pods by **48.37**.
The UI gas estimate was 1,981,868. The signed upstream **100% slippage ratio**
is still present; this Pinto-only success does not validate that tolerance for LP.

Both orders display **1/1 (100%) / Order Completed**. Both helper counters contain
the terminal sentinel, and their nonces are 1. A read-only replay of Convert Up
rejects as already completed; a replay of Sow rejects as already executed this
Season. No time-forwarded replay was performed in this fixture. New publications
required a page reload before appearing in the all-publishers order book; this
is **not** a live-cache-refresh pass. Some history/graph API requests still fail.

The fresh 1-Pinto and fresh LP deposits remained unchanged through both order
executions. Both fee-exemption quotes reject them with
`SiloRedemptionIneligibleDeposit`. After the mature LP exit, the UI shows eligible
LP of **0.018** and disables a **0.019** request, rather than using the fresh LP
to fill the difference. The cbETH index retains two nodes and decreases its
indexed amount by exactly 0.001 LP; the fresh node's links and balances are intact.

### Approved and implemented: replacement Stable2 release configuration

The production interface recognizes Stable2 by the legacy Well-function address
in `WELL_FUNCTION_ADDRESSES`. The fresh release uses **PintoStable2** at
`0xdea2f49B2db14C1bC30685529fF09251eF342397` on this local fork. Without an override,
`ExchangeWell.loadWells` rejects that unknown address and even a cbETH conversion
quote fails, because it loads every Well. This was reproduced in the browser.

A **QA-only** transform first allowed testing to proceed. After explicit user
approval, it was removed and replaced by production configuration shared by the
QA harness. There is no remaining Stable2 source-replacement transform.

Set both public Vite build variables from the **same verified production release
manifest**, after confirming its deployment on the intended chain:

- `VITE_PINTO_STABLE2_ADDRESS`: the replacement **Well-function** contract address,
  not the Well proxy, LP-token address, or implementation of the fee Well.
- `VITE_PINTO_STABLE2_RUNTIME_HASH`: `keccak256` of that contract's complete deployed
  runtime, including metadata; not initcode, an artifact-file digest, or an unlinked
  bytecode hash.

Both empty preserves legacy operation. A partial pair, invalid/zero address, an
address already reserved for legacy Stable2/CP2, or an invalid/zero hash rejects.
When configured, `ExchangeWell.loadWells` captures the selected RPC chain and a
fresh block, then checks runtime code identity at **that same chain and block**
as its Well metadata. Missing code, a code mismatch or an unavailable RPC fails
closed. Unknown function addresses remain unknown: there is no curve autodetection
or catch-all Stable2 fallback. Known legacy Stable2 and CP2 remain recognized.
Local chains 1337/41337 intentionally use Base identities but read their own RPC.

The runtime check adds `eth_blockNumber` and `eth_getCode` reads when loading Wells
with a configured replacement; it adds **no onchain gas**. It is a frontend release
identity check, not a replacement for contract safety checks or per-transaction
simulation. The loader's existing cache behavior is unchanged.

The local app was restarted with the manifest pair through this production path.
Both **cbETH LP→Pinto and USDC Stable2 LP→Pinto quotes** succeed. A browser-driven
Stable2 conversion also executed: transaction
`0x30bc3939a71102c41816309846f44d455f45b125882ff85ea093ab73f0c55cdd`,
block **53247833**, status 1, **3,115,301 gas**. It removes 0.001 LP (0.001 input
BDV), creates 0.002694 Pinto/BDV at stem 60464955455, and leaves 0.019 USDC LP
deposited. Receipt, indexed amount, output deposit and parent isolation checks pass.

No production address has been invented or written into defaults. `.env.example`
documents the blank pair. **Do not ship the local rehearsal address above.** The
configured production-bundle test writes only to
`/tmp/pinto-current-ui.CMetck/stable2-configured-dist`, separate from ordinary
release output; it is a local test artifact, not a deployment candidate.

### Automated checks and limits

- **657 Auto Convert tests pass** across 20 suites.
- Additional flow-activation run: **218 pass, 2 RPC-gated production-fork tests
  skipped**. Some suites inherit shared tests; do not add these counts and call
  them distinct security properties. No new production-flow activation is claimed.
- **238 UI tests / 27 files pass**, including the ABI regressions, 31 new Stable2
  configuration/Well-loader cases, and the QA production-config wiring test.
  Both the current default build and the replacement-configured Vite production
  build pass with warnings. The 35-test focused configuration run also passes.
- TypeScript still reports **four pre-existing Pod Market errors** (unsupported
  `indeterminate` in the two table components and possibly undefined strings in
  `useMyPodListings`/`useMyPodOrders`). These are not new ABI failures and are not
  fixed by this rehearsal.
- Structured autoreview of the initial QA wiring/ABI regressions and a separate
  review of the approved production Stable2 configuration returned no actionable
  findings. Command: `autoreview --mode local --engine codex --model
  gpt-6.1-sol --thinking high --no-web-search`, using the scoped private review
  bundles and the installed Codex binary. No findings were accepted/rejected;
  the reviewer inspected read-only and did not run tests. This is model review,
  not an independent audit. Our test results above are separate evidence.
- The child uses a one-second block interval to retain genuine pinned oracle
  timestamps. This is not live-feed freshness or elapsed-hour behavior coverage.
  The public Anvil publisher had an EIP-7702 delegation at the Base snapshot;
  it was explicitly cleared **only on the child** for EOA QA. Neither EIP-7702,
  Privy, mobile wallets nor the production indexer is covered.
- Referral setup, fee-exempt Sow UI, real-wallet/mobile coverage and the older
  documented Tractor/preflight/cache/display issues remain open. No claim that
  all UI functions or data displays are correct is made.

Evidence: `/tmp/pinto-current-ui.CMetck/`, particularly `release/report.json`,
`release-parity-evidence.json`, `current-browser-evidence.json`,
`lp-exit-evidence.json`, `stable2-config-evidence.json`, `stable2-ui-tests.log`,
`stable2-build.log`, `stable2-default-build.log`, `stable2-typecheck.log`, `auto-convert-tests.log`,
`flow-tests.log`, `stable2-review.md`, the two `stable2-config-*-quote.ax.txt` captures, and
`current-sow-completed-proof.png`. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/current-ui-stable2-config-2026-10-29.tgz`.
The earlier pre-approval archive `current-ui-release-2026-10-29.tgz` and all
sealed reports are retained without replacement. The new archive excludes the
configured test bundle to avoid confusing a locally addressed bundle with a
production release artifact.

## Historical acceptance summary — October 28, 2026

**QA is incomplete; this is not production sign-off.** The detailed sections
below are chronological evidence, not repeated assertions that every route is
ready. Their earlier test totals and intermediate balances are historical.

**Historical release drift (resolved by the October 29 rehearsal above):** the preserved 18583 fork
still exactly matches its saved release, but the current protocol checkout now
has five different executable contracts and one new linked-library dependency.
The UI's generated Auto Convert ABI is also behind the current artifacts.
Earlier sections labelled “latest-release” describe the release tested at that
time, **not verification of today's entire checkout**. See the parity audit below.

The original browser fixture is the existing upgraded child at port 18569, based
on Base block 53178491. It is not a fresh latest-release rehearsal: it retains
the older reward configuration and synthetic oracle setup, is time-forwarded
into November, and does not include the separate flow-activation integration.
An additional, explicitly authorized **time-aligned** fixture now runs at 18582
(UI 17846), from Base **53225919**, with the local release compiled for that rehearsal applied through
parent 18581. All older forks remain intact. The new controller is deliberately
unconfigured; no pending flow-policy decision or new automatic activation was inferred.

| Requirement / workflow | Evidence established | Remaining limitation |
| --- | --- | --- |
| New deposits | Browser Pinto and existing-LP deposits; Pinto-funded LP creation; receipts, balances and ordered-index accounting | Not every input asset or external route tested |
| Deposit maturity | Two actual Sunrises; fresh LP excluded until the second Season passes | Fixture oracle/reward assumptions are not production forecasts |
| Existing-deposit conversion | Direct CP2 and Stable2 LP→Pinto; new cbETH LP→wstETH LP through real 0x; accounting and live refresh; recovered-input fix verified | Not every LP pair; cbBTC route encountered external-pool failures; dust quotes may have no liquidity |
| New Tractor orders | Browser creation/publication and independent-operator execution of Convert Up, Pinto-funded Sow and LP-funded Sow; all three also executed against the latest release on a valid-oracle frozen child | Seed-toggle encoding, edit-slippage drift, failed-estimate fallback and upstream Sow's hard-coded 100% price tolerance remain unresolved; explicit zero-seed workaround used; referral and fee-exempt Sow creation/execution unverified |
| Stale Tractor funding | Actual deposit removal causes an atomic revert; restoring funding lets the same signature execute; completion cannot replay | Cached execute controls can still submit after a failed fresh estimate |
| Partial Tractor fill / cancellation | Latest-release browser order fills 1 of 2 Pinto; UI shows 50%; same-Season replay and non-publisher cancellation reject; publisher cancellation prevents further execution | Verified upstream cache-key mismatch leaves cancelled card visible until refresh; fix approval pending |
| Withdrawals / exemptions | Ordinary LP withdrawal, qualified LP exit and qualified Pinto sale; latest-release CP2 exit and Stable2 Pinto sale also verified; rejection, eligibility boundaries, output locks and exact expiry; RPC failures no longer fabricate locks | Other withdrawal routes are not comprehensively covered |
| Transfers / wrapper / Harvest | Deposit transfer, small Send Everything, Silo/wallet wrapping and redemption, successful and empty Harvest | Recipient cache, wrapper minimum/labels/preview and persistent-toast issues remain |
| Pod Market | Order/listing creation, partial/full fills and cancellation; two authorized UI fixes retested | Plot selection, eligibility and cache issues remain; local event adapter is not production-indexer validation |
| Ordinary swaps | Direct Pinto→cbETH; successful real 0x Pinto→USDC and USDC→Pinto on time-aligned upgraded fork; failed slippage rollback; shared balance validation fix | Only sampled amounts/routes; live fee-free quote differs from upgraded fork's fee |
| Displayed data | Sampled balances, deposits, Stalk, Seeds, Seasons, order progress and tips reconciled | Not all displays correct: missing estimates, misleading labels, stale recipient caches and unavailable charts are documented |
| Account/network/read failures | Empty-account selection reset, fee-exit wallet-context guards and RPC blocking exercised | QA connector is not Privy, a browser wallet, EIP-7702 or mobile coverage |
| Isolation | All writes confined to disposable local test state; protected parent heads unchanged | No Base broadcast, production deployment or push authorized/performed |

The latest acceptance audit re-read **34 historical receipts** on the current
child: 32 status-1 transactions and two expected status-0 failures. Their methods,
blocks and gas match the recorded evidence. This includes 23 core/Tractor/fault
receipts and 11 Market/Send Everything receipts; it is not a claim that all 34
actions were newly performed or that receipts prove every UI display correct.
Referenced screenshots and state reports for the core scenarios remain present.

Latest automated run: **203 tests / 24 files pass**, Vite production build passes
with warnings, and TypeScript still fails on **four existing Pod Market errors**.
The approved amount/display synchronization and RPC-vs-lock fixes are implemented.
Eight mounted component regressions cover the shared input, including token resets
and computed quote outputs. The browser reproduced the fault/recovery sequence:
zero stays zero, no stale positive quote returns, and Convert remains disabled.

Both newly approved work items now have positive evidence: the UI safety fix and
successful 0x/LP-to-LP execution on the additional local-only release fixture.
This does **not** finish overall QA. Real wallet/Privy/mobile, referral configuration,
fee-exempt Sow UI, production data sources, and the previously documented unrelated
Tractor/preflight/display issues remain open. No Base deployment or push occurred.

Original child (18569, preserved): **53179892** /
`0xbc50482424b4c1ef04651db32e1d12056a0aee03c2f283ce7bf8c66cab8b7c25`.
Protected parents remain 53178793 / 53178878 with the hashes recorded below.

### Historical release parity audit — checkout was ahead of the tested fork

A read-only audit at child **18583, block 53226018**, verified all **64 deployed
release code hashes** against the sealed rehearsal manifest and checked the
Diamond's complete selector-to-facet map. Both match. The fork itself has not
silently drifted or been replaced.

The current compiled artifacts differ from that release:

| Comparison against the preserved fork | Count | Interpretation |
| --- | ---: | --- |
| Exact linked runtime match | 25 | Same bytes, including metadata |
| Difference confined to Solidity metadata | 33 | Same executable bytes after metadata removal |
| Executable bytes differ | 5 | Previous fork tests do not exercise the current versions |
| Cannot construct current linked runtime from the old deployment graph | 1 | A newly required library has no address in that release |

The five executable differences are **LibAutoConvertPriority,
LibAutoConvertSunrise, LibAutoConvertWellSafety, AutoConvertViewFacet, and
LibAutoConvertExecution**. **LibAutoConvert** now requires
`LibAutoConvertOracle`, which is not in the old deployment graph. The comparison
does not fill in invented library addresses or mask these changes. The 39 changed
artifact digests therefore must not be described as 39 behavioral changes.

All **nine standalone helper deployments** retain matching executable bytes;
four also match metadata exactly. These include the tested Sow and Convert Up
helpers. Expected runtimes use the known Diamond/token/helper addresses for
immutable values, rather than ignoring immutable bytes. The compiled metadata's
**192 referenced project source files** all match current local files, so this
is not explained by stale build input for those sources. Vendor-source freshness
was not revalidated. This audit does not prove unchanged linked behavior where
the Diamond release itself differs.

The generated UI Auto Convert ABI has **119 entries**, versus **122** currently
produced by its generator. Semantic comparison, ignoring formatting/key order,
finds:

- Missing `enableAutoConvertFlow` and `getAutoConvertFlowState` entries.
- Missing `AutoConvertInsufficientOracleGas` error.
- Old `getAutoConvertPriority()` instead of current
  `getAutoConvertPriority(address well)`; the returned rate label also changes
  from `highestLpRate` to `lpRate`.

On the preserved fork, selector **0xad1c8f90** (no argument) is installed and
**0xefb1aef5** (Well argument) is not. This independently confirms the getter
version mismatch. The seven lock/redemption entries actually used by current UI
actions are unchanged, and the standalone Sow entry-point ABI matches. Thus the
ABI comparison alone does **not** establish that the already-tested deposit,
redemption or Sow transactions are broken; it does establish that the ABI file
is not synchronized with the current release.

No ABI regeneration, source compilation, source change, upgrade, or deployment
was performed. Approval was requested for a **new isolated local fork/release
rehearsal and ABI synchronization**, retaining every existing fork and keeping
activation policy unchanged. A new rehearsal is a completion gate for claims
about the current checkout, not an optional second confirmation of an unchanged
release.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/verify-ui-release-parity.cjs` and
`release-parity-evidence.json`. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-release-parity-2026-10-28.tgz`.
The script performs only local file reads and read-only fork calls, checks the
active head is unchanged, and preserves the existing reports.

### Latest-release partial Sow, cancellation and stale-card finding

A new browser-created Pinto-funded Sow order requested **2 Pinto total**, with
**1 Pinto minimum/maximum per execution**, minimum temperature **4731%**, Morning
OFF and **0.2 Pinto tip**. The existing new-release helper was used; no additional
deployment or contract change was needed. The signed order hash is
`0x5abbdcee1503f8584c19897ff66e2a08a3dd85584b6a45b289f0e0c4585c2ca2`.

| Browser action | Transaction | Block | Execution gas |
| --- | --- | ---: | ---: |
| Publisher signs/publishes | `0x6ae5bcf37733fc21e57a8f9cdcfe220198e300f6e412c795b14a2344d6a546a1` | 53226016 | 65,480 |
| Independent operator fills 1 Pinto | `0x48b9faa79730e9a625541d8314e962a86786b2926f8b11ce5a9c17526b0960c2` | 53226017 | 1,872,831 |
| Publisher cancels the remainder | `0xc40bd6903feea13d9f06e0760395636ad9f968a31c84aab8cfa697f429c7e62c` | 53226018 | 53,468 |

All receipts succeeded. The partial fill removes **1.2 Pinto / 1.200059 BDV** from
mature stem **1702175052**, sows **1 Pinto for 48.31 Pods**, and pays the operator
**0.2 Pinto**. Mature deposited Pinto falls **43.8 → 42.6**; the separate fresh
1-Pinto crate is unchanged. Publisher Pods rise **386.48 → 434.79**, operator
Farm Wallet **0.6 → 0.8 Pinto**. The UI correctly shows **1/2 (50%)**, executed
once, not complete. The contract's remaining counter is **1,000,000** atoms;
no `SowOrderComplete` event fires. The zero counter before the first fill is the
uninitialized sentinel, not completion.

The browser estimates **1,965,100 gas** and **−$0.020319** profit before L1 fees
at fixture prices. This is not a current Base gas-dollar quote. The new order
still carries the upstream 100% price-deviation tolerance, pending the separate
approval discussed below; testing it does not endorse that parameter.

Read-only calls at the relevant blocks verify three distinct rejection paths:

- Before cancellation, a second execution in Season **16979** reverts with
  `Blueprint already executed this season`.
- The operator cannot cancel the publisher's order: `TractorFacet: not publisher`.
- After publisher cancellation, execution reverts at `TractorFacet: maxNonce reached`.
  The cancellation nonce is `uint256.max`; remaining-counter history stays at
  1 Pinto. Deposits, Pods and operator balance do not change on cancellation.

**Verified upstream UI bug: cancellation does not invalidate the order cache.**
The completed cancellation leaves the previous **1/2 (50%)** card and enabled
Cancel button visible. `TractorOrdersPanel` invalidates the flat `["TRACTOR"]`
prefix, but the actual query keys begin with the nested `[["TRACTOR"], ...]`.
An isolated probe using the installed TanStack Query library confirms the flat
prefix does not invalidate the real-shaped key and the nested prefix does.
Baseline `60f611d5bd5b6b700fa0122277c7c4e7247d0524` has the same callback. This
is a stale-display problem, not a failure to revoke the signed order on-chain.
After a manual reload/reconnection and completion of the historical reads, the
cancelled card disappears and only the earlier **2/2** and **6/6** completed orders
remain. The page shows **434.79 Pods**, matching the contract. Automatic removal
without a reload is therefore not a passing result.
Approval was requested for a narrowly scoped invalidation fix and regression;
no production fix was applied in this pass. Historical Soil reads also delayed
orderbook and publisher-history loading, independently of this cache-key bug.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/partial-sow-evidence.json`,
`record-partial-sow.cjs`, `latest-release-partial-sow.png`,
`latest-release-cancel-stale.png`, `latest-release-cancel-refreshed.png`,
`reproduce-cancel-cache.cjs` and
`cancellation-cache-evidence.json`. The receipt script asserts exact accounting,
partial counter semantics, cancellation nonce, callers, all three reverts, and
preservation of the other six fork heads. Active child head:
**53226018 / 0x1bc6d9ce3bd0ffeb76c0fcccf66706d27c7906fca4161c4fb194d50fb345cca1**.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-partial-sow-2026-10-28.tgz`.
No application behavior or contract changes were made. The preceding 203-test
run and successful Vite build remain the latest automated results; this pass
adds browser/receipt evidence rather than new automated application coverage.

### Remaining coverage audit — referral, fee-exempt Sow and narrow layout

A read-only continuation checked the remaining test setup rather than treating
plain Sow coverage as proof of every order variant. All seven fork heads stayed
unchanged; active child 18583 remains at **53226015 /
0x70b74b1e04c48febde03fc56dd2fed9a02f8f61cc2dcd65e69a97904cf752a42**.

**Referral orders need a new-release fixture helper.** The legacy referral target
`0xD9DF9C4C0160401702de1771AAAaD886e2375F65` has 11,521 bytes of runtime code,
but reports the old Silo helper `0xE145082A7C5EDd1767f8148A6c29a17488d1eb31`
and Tractor helper `0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6`.
Its `beanstalk()` read also reverts. These do not meet the current UI's release
validation, which requires explicit configuration and matching helper bindings
after the Diamond upgrade. Reusing the old address is not a valid test workaround.
The current fixture has no new referral deployment. The compiled new helper has
11,419 bytes of runtime and selector `0xd3936ead`, matching the UI selector;
compilation and selector agreement do not prove referral execution. Approval was
requested to deploy/configure it **only on local Anvil** and test the actual UI
order path. No deployment was performed in this pass.

**Fee-exempt Sow has no UI creation path in this checkout.** The fixture contains
`SowRedemptionBlueprint`, but the current UI encoder selects ordinary Sow or
referral Sow. The successful LP-funded Sow test above paid the ordinary Well fee.
Adding a fee-exempt order-creation option is application work, not just a missing
test address; the existing contract deployment is not evidence that this UI
feature works. No new feature was inferred or added during this audit.

**Narrow-screen observation is not mobile-wallet coverage.** A temporary,
loopback-only wrapper at port 17848 renders UI 17847 in a 390px iframe. The
disconnected Silo displays its narrow navbar, hamburger and token list. Browser
automation could read and capture the frame but could not target its controls
through either accessibility or screenshot coordinates. No connected workflow
was exercised there. This is a test-tool limitation, not an established app bug;
real device, touch, Privy and browser-wallet behavior remain unverified. The QA
control overlay itself also obscures part of the narrow page.

Fresh automated checks: **203 tests / 24 files passed** in 1.73 seconds;
`vite build` succeeded in 9.73 seconds with dependency/chunk-size warnings.
`tsc --noEmit` still fails on the same four Pod Market errors: unsupported
`indeterminate` props in `MyListingsTable.tsx:222` / `MyOrdersTable.tsx:236`,
and optional account arguments in `useMyPodListings.ts:31` /
`useMyPodOrders.ts:26`. `git diff --check` passes. The shell's `yarn` command
was unavailable, so the installed `node_modules/.bin` executables were used.
No application source or contract was changed by this pass.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/remaining-coverage-evidence.json`,
`record-remaining-coverage.cjs`, `narrow-layout-observation.png`, and the
temporary `narrow-viewport.cjs` wrapper. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-remaining-coverage-2026-10-28.tgz`.

### Latest-release fee-free exits and eligibility boundary

Both fee-free exit forms were exercised through UI **17847**, against the latest
release on frozen child **18583**, using genuine pinned feeds and normal protocol
eligibility. No contract policy, oracle, production source or signature was altered.

| Browser action | Actual fee-exempt receipt | Ordinary fee-paying quote at the preceding block | Gas |
| --- | --- | --- | ---: |
| Withdraw 0.001 cbETH LP as external-wallet Pinto | **0.554021 Pinto** | 0.552635 Pinto | **769,689** |
| Sell 1 mature deposited Pinto through the USDC Stable2 Well | **0.034255 USDC** | 0.034169 USDC | **926,080** |

These are exact token amounts and receipt execution gas, not current gas-dollar
quotes. The normal quotes are comparisons, not additional transactions. Each
transaction has status 1 and no `PintoFeeBurned` event. Call traces confirm the
Diamond invoked `removePintoLiquidityFromProtocol` and `swapPintoFromProtocol`,
respectively; they did not use the ordinary fee-paying route or public exemption flags.

- LP exit: `0x30bde77c186811a6a613afad14a767c808443954a7cecc509df1dde1b37dc987`,
  block **53226014**. It removes **0.001 LP / 0.554023 historical BDV** from mature
  stem **22969959634**. Eligible LP and the indexed amount both decrease from
  **1.015648146022248106** to **1.014648146022248106**. The publisher's external
  Pinto balance increases **47 → 47.554021**, and the input clears to zero.
- Pinto sale: `0xc27bdc6c521ab49e51d290319e358d55f71305e09bab97891e784435fc49696a`,
  block **53226015**. Mature deposited Pinto decreases **44.8 → 43.8**, USDC wallet
  **0.034136 → 0.068391**, and external Pinto stays **47.554021**. The 1-Pinto fresh
  germinating deposit remains unchanged, leaving **44.8 total / 43.8 eligible**.
  UI balances, deposit rows and eligibility refresh; input clears to zero and the
  old quote disappears. Stalk decreases as expected for a withdrawal.

Before the Pinto sale, **Max** selected **44.8**, excluding the fresh 1 Pinto from
45.8 owned. Manually entering **45.8** produced `Amount exceeds your eligible,
unlocked deposits`, removed the previous quote and disabled submission. This
negative case sent no transaction. Independently, a read-only contract quote using
the fresh stem **77764025979** reverts with `SiloRedemptionIneligibleDeposit`.
Entering 1 afterwards restored a valid quote and enabled the successful sale.

The fixture's actual policy view reports a required grown-Stalk/stem difference
of **24 raw units**, reference cbETH LP, configured in Season **16979**. This is
the calibrated on-chain threshold, not a claim that every token must have spent
24 wall-clock hours in this wallet. Germination is separately enforced. These
checks do not replace the earlier output-lock and account/network-change tests.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/exemptions-evidence.json`,
`record-exemptions.cjs`, `latest-release-exemption-ineligible.png`, and
`latest-release-exemption-sale-result.png`. The evidence script asserts receipt
success, exact wallet/deposit/index deltas, fresh-crate preservation, Well caller
identity, absence of fee burns, ineligible-deposit rejection and preserved fork heads.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-exemptions-2026-10-28.tgz`.
Final child head **53226015 /
0x70b74b1e04c48febde03fc56dd2fed9a02f8f61cc2dcd65e69a97904cf752a42**.
All six other recorded fork heads remain unchanged. No new application changes;
203 passing tests and the prior successful Vite build remain the latest automated
application results, with four known TypeScript errors still open.

### Latest-release LP-funded Sow and index removal

A new order created, signed and published through UI **17847** selected only
**deposited cbETH LP**, to sow **2 Pinto** total/minimum/maximum, at minimum
temperature **4731%**, Morning OFF, with a **0.2-Pinto** tip and no referral.
It targets the new SowBlueprint at `0xc396EF69582127D55E974C59CFf2d0fa364494ce`.
Order hash: `0x77a5aed1e95f444e53561f7471089f74ae4add160226854409824bd33eff2646`.

| Action | Receipt | Block | Gas |
| --- | --- | ---: | ---: |
| Publish | `0xb4771929350cb8e0fa1aa4478c7c54bd6c40a0844d75268e8367563fbd348918` | 53226012 | 65,480 |
| Independent operator executes | `0x0722a82070cb50a45dd4fc4271dc34d272a5250368944cc854751ad9a4a3e6cd` | 53226013 | 2,694,429 |

Both receipts have status 1. Publication needed no further deposit combination.
The browser first simulated successfully, estimating **2,975,587 gas** and
**−$0.034256 profit before L1 fees** at its displayed fixture prices. As with the
other examples, this tip is insufficient at that estimate; it is not an operator
profitability recommendation or a current Base fee quote.

The actual withdrawal plan and receipt agree:

- Fresh stem **28480204032**: **0.001800469133211492 LP / 0.997500 BDV**, entirely spent.
- Mature stem **22969959634**: **0.002180445073430900 LP / 1.208016 BDV**, partially spent.
- Total: **0.003980914206642392 LP / 2.205516 historical BDV**.
- Normal Well removal returns **2.200000 Pinto**. The same LP has a fee-exempt quote
  of **2.205514 Pinto** at the preceding block; the actual fee event burns the
  **0.005514-Pinto** difference. This was the ordinary fee-paying Sow route, **not**
  the separate qualified-redemption Sow blueprint.
- **2 Pinto** is sown for **96.62 Pods**; **0.2 Pinto** goes to the operator's Farm Wallet.

This voluntary withdrawal/Sow can consume a germinating deposit. That does **not**
permit automatic conversion of germinating deposits: Auto Convert's two-Season
eligibility is a separate rule. The fresh Pinto crate remains untouched.

Index accounting is checked before/after the transaction: cbETH LP count **2 → 1**;
indexed amount and total deposited LP both decrease by exactly
**3980914206642392** atoms. The consumed node now returns
`OrderedDepositsUnknownNode`. The remaining node is both head and tail, has zero
previous/next links, and agrees with the surviving mature deposit:
**1.015648146022248106 LP / 562.691789 BDV**. The index is still incomplete globally;
these checks do not certify the full migration.

The completion event reports 2 Pinto sown and zero unfulfilled, with the completed
counter sentinel and last execution Season **16979**. The UI removes the active
order after refresh. Operator Farm Wallet shows **0.6 Pinto**; available Soil
**258.42**; Pod Line **43,280,931.97**. The publisher's two Plots show **289.86 +
96.62 = 386.48 Pods**; their temperature metadata remains unavailable. Publisher
history eventually recovers and correctly shows **2/2 (100%)** and **6/6 (100%)**,
each **Order Completed!** and executed once. The long loading delay and unavailable
charts remain data-source limitations; eventual correctness is not timely refresh.

**Newly verified upstream issue — Sow's price-deviation tolerance:** the published
calldata explicitly encodes **`slippageRatio = 1000000000000000000`**. The encoder
hard-codes that value in `src/lib/Tractor/sowOrder/tractor-sow.ts`; the same line
exists in baseline `60f611d5bd5b6b700fa0122277c7c4e7247d0524`. In the actual
`PriceManipulation.isValidSlippage` implementation, this permits current Pinto-per-
quote-asset price from zero to **2 × the instantaneous/EMA reference**, with a
separate nonzero-price check. It is **100% reference-price deviation**, not a 1%
tolerance and not a proof of a 100% realized loss or a profitable exploit.
SowBlueprintBase's **1%** fallback applies only when the supplied ratio is zero,
so the explicit UI value bypasses that fallback. Read-only calls at this snapshot
pass with either 1% or 100%; no manipulated-price exploit was run in this pass.

Approval was requested to correct **new** Sow orders to the existing 1% default
and add regressions. No encoder, signature, production configuration or contract
was changed pending that answer. Tightening this check may postpone execution
during volatile conditions, and would not change already signed orders.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/lp-sow-evidence.json` (receipt/quote/index
assertions), `record-lp-sow.cjs`, `latest-release-lp-sow-pods.png`, and
`latest-release-sow-completed-history.png`. Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-lp-sow-2026-10-28.tgz`.
Final child head **53226013 /
0x275e6dc32f0ca5e69c1a922f76d99dcb1c4f2539e09b046d4f957933d9f5a86f**;
all six other recorded fork heads remain unchanged. This pass changed only QA
documentation/evidence, not application or contract behavior. Latest automated
application evidence remains 203 tests passing and the preceding successful Vite
build, with four known TypeScript errors. No live-chain write, push or deployment.

### Latest-release deposit and Sow continuation

Further browser actions on the frozen valid-oracle child **18583 / UI 17847**
succeeded with the same release, genuine pinned feeds, and one-second-per-block
test clock. This pass changed no production code or protocol configuration.

| Browser action | Actual result | Gas (excluding separate approval) |
| --- | --- | ---: |
| New Pinto deposit | 1 Pinto deposited; wallet 49 → 48; Silo total 51 → 52 | 691,591 |
| Pinto-funded cbETH LP creation/deposit | 1 Pinto → 0.001800469133211492 LP, 0.997500 BDV; wallet 48 → 47 | 1,831,579 |
| Publish new Sow order | 6 Pinto total/minimum/maximum; 4731% minimum temperature; 0.2-Pinto tip; Morning OFF; no referral | 757,968 |
| Independent operator executes Sow | 6 Pinto sown, 289.86 Pods minted, 0.2 Pinto paid to operator | 1,889,337 |

Receipts, respectively:

- `0xe137f511fe82bdb01546e18eecdf2c62aff638584ddb5156c7c79b81547e7c83` — block 53226007.
- `0x7a72184beab09deac207170382fea56a4f12b0aa1accadff2618f31b515ea6e4` — block 53226009.
- `0xac92cc1f626acffa28587447ddf4d502974281a500b8cd4e4c4e31e274169dad` — block 53226010.
- `0xd2ca9b04b91ad92faf88cc1069c49d41c9c207786bb019d063e4dd59d292512a` — block 53226011.

All four have status 1. Deposit inputs clear after success. The new LP deposit
at stem **28480204032** is automatically indexed without hints: count 1 → 2,
indexed amount increases by exactly **1800469133211492**, and its node's account,
stem, amount and BDV match the Silo deposit. Node ID:
`0x48c3129d7506b68d648beaa840d9b9e10fe4834cf06223d3d10888a6547cbe4c`.
Pinto's index is deliberately **disabled** in this LP-only fixture, not missing
an expected entry. Full backfill and automatic-controller activation remain untested here.

Both new crates are shown as germinating. The Sow execution consumes **6.2 Pinto**
and **6.200305 historical BDV** from mature stem **1702175052**, not either fresh
crate. The new Pinto stem **77764025979** still holds 1 Pinto / 1 BDV afterwards;
the fresh LP crate is also intact. This demonstrates the chosen mature source in
this example, not exhaustive germination testing.

Sow order hash:
`0x6c582146d67d91820d88ddd5b1fe07fcc8b43b805d40d24210e90ce527503bff`.
It targets the new SowBlueprint `0xc396EF69582127D55E974C59CFf2d0fa364494ce`
using selector `0x271ecf12`. Its completion event reports **6,000,000** atoms sown
and zero unfulfilled; counter is the completed `uint256.max` sentinel, last
execution Season **16979**. A subsequent read-only replay reverts with
`Blueprint already executed this season`; no failed replay transaction was sent.
The minted Plot starts at **46436088761157** and holds **289860000** Pod atoms.

The operator UI estimated **1,981,868 gas** and **−$0.020550 profit before L1 fees**
at its displayed prices. These are fixture estimates, not a current Base fee quote.
The 0.2-Pinto tip is not economically adequate at that estimate. After execution,
the displayed operator Farm Wallet increases 0.2 → **0.4 Pinto**, available Soil
266.42 → **260.42**, Pod Line → **43,280,835.35**, and publisher Pods → **289.86**.
The publisher's order-history loading/refresh remains impaired by the data-source
issue below; do not equate receipt success with clean end-to-end history display.
My Pods does show the new **289.86 Pods** at **43,280,545.49 in Line**, but explicitly
reports that temperature data is unavailable. Screenshot:
`/tmp/pinto-aligned-ui.LtKzYX/latest-release-sow-pods.png`.

**Historical-data limitation:** the primary RPC returned `-32011 / request limit
reached` for even a one-block `eth_getLogs` request. The Sow orderbook's Soil query
crosses the fork pin; nested Anvil requests therefore stalled. It eventually
recovered through the existing catch/fallback, after which browser simulation and
execution succeeded. An independent read from `base-rpc.publicnode.com` returned
the actual Season-16979 Soil event at block **53224966**, with **266419323** atoms,
and matched the pinned Base block **53225919** hash. That external result was **not**
injected into the UI, no events were fabricated, and no RPC/fork was reconfigured.
Production charts/history and prompt orderbook refresh are still not certified.
Temporary visible query diagnostics used to investigate the stall were removed.

Automated tests rerun: **203 / 24 files pass**. No production source changed in this
pass; the prior successful build and four known TypeScript errors remain the latest
build evidence. Report: `/tmp/pinto-aligned-ui.LtKzYX/deposit-sow-evidence.json`.
Durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-deposit-sow-2026-10-28.tgz`.
Child head: **53226011 / 0xfb79d53dc3b43b4357a53c5ff256a21e3d0c3c4c555b0583f8833286e8c19b08**.
All six other recorded forks retain their preceding heads, including the separate
flow fork. No live-chain writes, deployment, push or original-repository commit.

### Additional browser buy and latest-release Tractor verification

The ordinary buy succeeded through the browser on 18582: **0.030000 USDC →
0.909984 Pinto**, with explicit 0.5% tolerance, transaction
`0x366e612e33b94bc8d2f12eedf6f7c21cad8285afa50c58494a1403e76e7b3e72`,
block 53226004, status 1, **1,317,060 gas**. The UI quote had been 0.905169 Pinto;
execution used a refreshed route through 0x and the wstETH Well. Wallet balances
refreshed to **49.909984 Pinto / 0.004136 USDC** (rounded visually). Input cleared.
The first approval attempt had been rejected by the QA wallet's token allowlist,
not by the protocol. The harness now permits USDC `approve` to the Diamond only;
selected account, local chain, zero native value, method and spender checks remain.
Approval transaction: `0xaaa22996c9887e243885ba95937846731cd2ab3d5d4cc506fedd06d0e7457a87`.

A new cbETH-source Convert Up order was published on 18582 in
`0xb6e45cd7ebb12eb1a4e5d6bca5980655effd00afd4b268db764b7c17e2f06d0a`,
block 53226005, **2,024,731 gas**. Its simulation correctly failed with
`Well: USD Oracle call failed`; no execution transaction was sent. The real pinned
cbETH feed last updated at **1793241157**, with its existing **1,800-second** timeout.
The publication block timestamp was **1793243693**, past expiry **1793242957**.
The same oracle returned a valid price at the earlier snapshot. This is pinned-fork
aging, not evidence that the upgrade created an oracle defect.

The old UI price reader (`0x13D25ABCB6a19948d35654715c729c6501230b49`) also panicked
with division by zero when cbETH became unavailable, hiding the orderbook. The new
release reader returned usable data for the remaining Wells. The optional QA server
now reads `deployments.BeanstalkPrice` from its explicit fixture, checks deployed
code, and transforms only the served address constants/generated hooks in memory.
It does **not** modify production source or the actual oracle. **Production reader
address cutover/configuration remains a release requirement**, and aggregate display
availability must not be mistaken for permission to bypass conversion oracle checks.

To verify real execution without falsifying feed data, a separate child **18583**
forked 18582 at block **53226002**, timestamp **1793242708**. Its test-only clock
advances **one second per block**, using `anvil_setBlockTimestampInterval(1)`.
UI **17847** uses that child and the newly deployed reader/helpers. No oracle values,
timeouts, signatures or safety checks were changed. This is a valid-snapshot test,
**not a live-price or elapsed-time test**. The time-aligned 18582 and all older forks
were preserved, not reset or rewound.

Browser order parameters: cbETH LP only; total/minimum/maximum **1 Pinto**; 0.2-Pinto
tip; $0.001–$0.999 price bounds; 0.1 minimum Stalk bonus; 0.1% slippage. The seed
toggle was deliberately enabled and its threshold entered as **zero**, avoiding the
known OFF→1 encoding issue without fixing or concealing it. UI still labels the
amount PDV; the contract's amount is Pinto, not historical BDV.

| Frozen-child browser action | Receipt / outcome | Gas |
| --- | --- | ---: |
| Publisher signs and publishes | `0x56b1d23062acbf1530beb7ac25ca6d22e82de96795b71a97d8cddf710ea69aa9`, block 53226003, status 1 | 1,994,280 |
| Separate operator simulates | Execute enabled; estimated gas 6,576,563; estimated profit negative before L1 fees | Read-only |
| Separate operator executes | `0x00ee4c88932f3236a9a2949fcfe4a433b367c56ef600c7ff0ac88e1be7835e26`, block 53226004, status 1 | 6,229,694 |
| Replay after one further second/block | `Order has already been completed` | Read-only |

Order hash: `0xf37104bb319ccaa6c9f5617461c6bad7f9a4ac64704050446c0b69070bf01c6a`.
Execution converts **0.001809506672163116 cbETH LP**, **1.002508 historical BDV**, into
a **1.000000 Pinto** deposit at stem **70312832214**, retaining **1.002508 BDV**.
Separately, **0.000361902232157878 LP / 0.200502 BDV** funds the **0.200000 Pinto** tip.
Both removals use the post-publication combined source stem **22969959634**.
The operator Farm Wallet refreshes to 0.2 Pinto; the publisher sees **1/1 (100%) —
Order Completed!**; the active operator orderbook becomes empty. On-chain completion
sentinel is `uint256.max`; replay after the minimum interval cannot run again.
The example tip does not cover the displayed gas estimate; this is functionality
evidence, not an assertion that the order is economically attractive to operators.

Latest validation: **203 tests / 24 files**, Vite build and `git diff --check` pass.
TypeScript still reports the same four existing Pod Market errors. A production
bundle scan finds no QA wallet mnemonic, harness label or local RPC URLs. Scoped
`autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search`
returned no actionable findings for the five changed QA/test files (model review,
not independent security sign-off). No production code was changed in this pass.

Evidence: `/tmp/pinto-aligned-ui.LtKzYX/buy-tractor-evidence.json`,
`ordinary-buy-success.png`, `latest-release-tractor-completed.png`, test/build logs,
and `review-buy-tractor.json`. New durable archive:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-buy-tractor-2026-10-28.tgz`.
Final heads: 18582 **53226005 / 0xbb7238b901df992157136454f18825938cb1bc2a5ed5c348c1f6b94b7e442196**;
18583 **53226005 / 0x47dca96dfef873112c60baa5b54bd6acfc1d6c78ed23b7c9b86779f56beb4f3e**.
Heads of 18564, 18565, 18569, 18580 and 18581 match their preserved values.

### Approved continuation: amount synchronization and time-aligned 0x

The shared field previously changed its display/internal amount on a balance clamp
without notifying the parent's transaction/quote state. Balance and minimum clamps
now publish the same amount immediately and cancel pending typing state. Minimums
cannot undo a zero-balance clamp. Balance changes also revalidate unclamped inputs.
Token changes retain the existing zero reset, without an old amount overwriting it.
Swap's computed Buy field opts out of balance clamping; Deposit's computed secondary
field already did. Normal typing debounce and the existing withdrawal policy remain.

Deposit ownership, actual output locks, and temporarily unavailable spending are
separate. A failed RPC read still makes spendable amounts zero, but no longer turns
all ownership into a reported protocol lock. The existing availability error is
shown instead. No lock or eligibility rule changed in the contracts.

Browser fault test on 18569: enter **0.001 LP**, observe **0.55 Pinto** quote, fail
deposit reads, then restore. Ownership remains **4.188987274126349636 LP**; recovered
input is **0**, quote is absent, Convert disabled, and submitted count stays **0**.
The head remains 53179892, proving no test transaction was sent during this check.

New fixture: Base block **53225919**, hash
`0x3b52f53f10b0d558f276b396ee20cd323c1287d052e85ea1c317196a500bb4c4`.
The latest full release cut succeeded locally using **12,781,053 gas**, with runtime
hash/size checks and deliberately failing atomic-cut rollback. This used local
owner impersonation, not Safe signer approval. Standalone helper contracts were
also deployed locally. Parent 18581 stopped at 53225992; child 18582 is chain 1337.
No days-long time warp, fabricated quotes, or oracle replacement was used.
Indexes are enabled but not fully backfilled; Auto Convert is unconfigured/inactive.
This fixture proves selected manual routes, not a full new activation rehearsal.

Real mature deposits were transferred from fork account
`0x32a0d4eb7f312916473ea9bafb8db6b6f1b4c32e` to the public Anvil test publisher.
The old QA observer had no deposits at this real Base snapshot. Local fixture
funding used transfers/withdrawal, not invented deposit ages; publisher is explicitly
a plain EOA. No real private keys or funds were used.

| Browser action on 18582 | Receipt / result | Execution gas |
| --- | --- | ---: |
| Approve Pinto spending | `0x1c9ee5c1ced865cc23184688a1f2a95c108d8227dfec147bdef58e84e835a8af` | Approval only |
| 1 Pinto→USDC, default 0.1% tolerance | `0x9e09e5d5528b7434edd7ebe3686d99d9c815cdedf71b28a05d471e72bdd28905`, status 0; 0x `TooMuchSlippage` | 1,024,794 |
| 1 Pinto→USDC, explicit 0.5% tolerance | `0x10c527621d625729cee0052209dc9c3b68cc4fb7a3ab1f03df0a7bb87a67eba0`, status 1, **0.034136 USDC** | 1,375,342 |
| 1 cbETH LP→wstETH LP, default Convert tolerance 0.25% | `0xd0aceed2b6a44909c35d69fe7dcea2811dff1293810ee4516911acc84c1ce676`, status 1, **0.956749452983830460 wstETH LP** | 3,351,608 |

The swap quote was **0.034221 USDC**; the failed 0.1% route required **0.034187**,
but execution returned **0.034136**. The live API quotes the live fee-free Well,
whereas this fork has the new 0.25% fee. The successful tolerance was selected
explicitly in the UI; production defaults were **not** changed. Receipt transfers
prove the publisher spent exactly 1 Pinto and received exactly 34,136 USDC atoms.
Trace proves execution reached the actual 0x AllowanceHolder.

The LP conversion removed stem **-1942082883**, **1 LP**, **100.342431 BDV**;
it deposited **0.956749452983830460 wstETH LP**, stem **74164047799**, **566.229745 BDV**.
The output's fresh BDV increase is not a dollar profit claim. The source UI refreshed
from **2.02** to **1.02 LP**, and reset the input/output selection after success.
Trace shows successful 0x calls inside the conversion; no routing-source exclusions
were added to force success. Quote/receipt screenshots and exact fixture manifests
are under `/tmp/pinto-aligned-ui.LtKzYX/`.
Durable evidence archive outside Git:
`/Users/ash/.codex/state/pinto-release-evidence/aligned-ui-2026-10-28.tgz`.

Limits observed: 0x returned HTTP 200 with `liquidityAvailable: false` for the
0.001/0.01 cbETH LP-sized pair-token trades. Current UI misreports that as a generic
quote/slippage failure (internally `Invalid value parameter`), which is a separate
cleanup item. A larger cbBTC route encountered `inactive pair` from an external
contract reached through 0x; a later read-only replay succeeded, so this is not
established as a permanent protocol defect. That pair was not broadcast or certified.
Pinned fork state and live market-maker routes can diverge even with valid time.

Validation: 201 Vitest tests in 24 files pass; Vite build passes; `git diff --check`
passes. TypeScript has only the same four untouched Pod Market errors. Structured
review accepted the token-reset and computed-output edge cases; both were fixed.
A follow-up duplicate JSX attribute was removed. Final command:
`autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search`
returned **no actionable findings**. Review ran against a scoped temporary snapshot;
all 15 reviewed files byte-match this checkout. This is model review, not an audit.

To launch a separate QA UI without repointing the original server, explicit
`PINTO_QA_RPC`, `PINTO_QA_UI_PORT`, and `PINTO_QA_START_BLOCK` overrides are now
supported by the optional harness. RPC overrides reject non-IPv4-loopback URLs;
startup also verifies Anvil and chain 1337. Both the wallet and public reads use
the same endpoint. Defaults preserve the original 18569/17845 fixture. These
test-wallet modules are not imported by the production build.

## Ported behavior

- Owned deposits and spendable deposits are separate. Output locks and deposits
  are read at the same block, including supported dewhitelisted tokens. Failed
  lock reads do not make locked assets available.
- Withdrawal, transfer, wrapping, Sow and conversion pickers respect availability.
  Selected deposits are reconciled after refresh; new crates are not silently
  added to an existing selection. Consumed selections cannot crash the next step.
- Season changes invalidate live protocol reads. Conversion quote keys include
  the account, deployment, season and deposit fingerprint.
- A separate **Fee-free exit** tab supports qualified LP-to-Pinto redemption and
  Pinto-deposit sales. It shows forfeited Stalk/Seeds, uses the protocol's grown
  Stalk threshold, excludes germinating/locked crates, refreshes eligibility and
  simulates the exact call before signing. Gas uses a measured estimate plus margin.
- Optional conversion routes fail independently. A failed aggregator route does
  not hide a successful direct route. Missing price estimates display unavailable,
  not a misleading zero-dollar result.
- New Tractor orders require explicit release helper addresses after upgrade.
  Historical chain-order progress is read from the blueprint target embedded in
  that order, not the replacement creation address. Completion sentinels are
  interpreted as zero remaining inventory.
- The release Sow helper's entry point is `sowBlueprint`, not `sowBlueprintv0`.
  New configured-release orders use the compiled release ABI. Decoders retain
  support for both selectors; decoding an old order is not a guarantee it executes.
- Operator execution-gas USD estimates no longer divide the human ETH price by
  an additional million. They are explicitly labeled before L1 fees.
- Successful Tractor executions invalidate live protocol reads, not just the
  order list, so Soil, Pods, deposits and token balances can refresh immediately.
  Separate Tractor order-progress and execution-history caches are invalidated
  too; their nested query-key prefix must be matched correctly.
- Fee-free submission supports Viem's `wallet_sendTransaction` fallback with the
  same fresh account/network checks as `eth_sendTransaction`; it never requests
  a chain switch or new account permission during submission.

## Production configuration

Set these **public addresses** to the verified release manifest, not the local
test addresses below:

```text
VITE_TRACTOR_HELPERS_ADDRESS
VITE_SILO_HELPERS_ADDRESS
VITE_CONVERT_UP_BLUEPRINT_ADDRESS
VITE_SOW_BLUEPRINT_ADDRESS
VITE_SOW_REFERRAL_BLUEPRINT_ADDRESS
```

The referral address is needed if referral orders are enabled. Without the
relevant explicit configuration, signing new orders on an upgraded Diamond fails
closed. Pre-upgrade deployments retain their legacy defaults.

The UI checks the blueprint's public protocol/helper bindings and nonempty
helper code. Private immutable bindings and exact deployed runtime hashes must
also be verified by the release/deployment procedure. These UI checks are not
code-hash attestation or a substitute for a security audit.

Regenerate ABI entries after compiling the sibling protocol:

```sh
node scripts/sync-auto-convert-abi.mjs ../protocol
```

## Isolated test environment

Only the disposable child at `http://127.0.0.1:18569` is modified. Chain ID is
1337; the harness refuses a non-Anvil client. It was forked from the existing
upgraded rehearsal child at block 53178878, ultimately based on Base block
53178491. The original rehearsal nodes at ports 18564/18565 are not modified.

```sh
anvil --fork-url http://127.0.0.1:18565 --fork-block-number 53178878 \
  --port 18569 --chain-id 1337 --hardfork osaka --enable-tx-gas-limit \
  --gas-limit 30000000 --silent
node scripts/qa/prepare-tractor.cjs /absolute/path/to/parent-helper-manifest.json /new/path/to/fixture.json
node scripts/qa/serve-redemptions.mjs /new/path/to/fixture.json
```

The UI is served at `http://127.0.0.1:17845`. The optional QA entry is not imported
by the production build. It uses the publicly known Anvil mnemonic and a
restricted loopback-only wallet; never fund it on a public network. No browser
extension wallet, real credentials or real funds are used. The harness limits
order history to new fork orders starting at block 53178878, and supplies helper
addresses from the verified local fixture. Charts still rely on external data
services, so a local transaction does not appear in production subgraph history.

The public test address inherited EIP-7702 delegation code from the source fork.
That caused an initial signed-order publication to fail through contract-signature
validation. The fixture explicitly clears code on that disposable local address
to test a plain EOA, and records the inherited code. This is **not** evidence of
EIP-7702 or smart-wallet support.

The fixture is time-forwarded into November 2026, ahead of the October test date.
It retains the parent rehearsal's `baseReward=1`; the later Sunrise reward
initializer is not applied here. This is UI/ABI evidence, not a fresh latest-block
production rehearsal or a benchmark of the final reward configuration.

## Browser transactions verified against receipts

Gas below is receipt execution gas, not an all-in Base dollar fee quote.

| Action | Result | Receipt gas |
| --- | --- | ---: |
| New 1-Pinto deposit | New germinating crate and updated wallet/deposit balances | 664,877 |
| Fee-exempt sale of 1 deposited Pinto | Approximately 0.035164 USDC received | 998,131 |
| Direct Stable2 convert of 1 PINTOUSDC LP | 2.686359 deposited Pinto; 2.695290 stored BDV preserved | 3,216,625 |
| New Convert Up order | Signed and published using the release helper | See publication receipt |
| Execute that Convert Up order | 10 Pinto output; 10.039612 input/output BDV; UI shows 10/10 completed | 9,656,301 |
| Fee-exempt exit of 1 PINTOUSDC LP | 2.693087 wallet Pinto; LP and Stalk/Seeds balances decrease | 1,059,683 |
| Reject ordinary LP withdrawal | Rejection displayed; no transaction broadcast; input retained | None |
| Retry ordinary 1-LP withdrawal | Wallet receives 1 LP; deposited LP decreases by 1 | 689,391 |
| New Sow order and execution | 6 Pinto sown, 294.54 Pods minted, 0.2-Pinto operator tip | 1,887,247 execution |

Receipt hashes on **local Anvil only**, in the same order excluding rejection:

```text
0x1dc5d353362a0eed5e861efc83b8dd858e955db0771307c823a686e39a6aae59
0xd70a004228f6002afee96cd388f3c2353ea44a7dfa3eca29738274e59174d290
0x9122b20177da6183703010c5acf74c778e8379af418562e195daa416cf087f73
0x5765b8b116b28c4cd333feb953ff5c21996b47c8bbc132f444f683a8ee95ebfa
0xa9118b62faa4cb0d189ad8ed3e85e5185a819ed6d541644f189ed7b53d8c2f25
0x456f20c870765173bc197c44f826c7700e823b20777d4a2fc734725d04d01824
0x10ea68d928d5d2dc2e99a3da150ecee630eef6ccd769d8aba2018cbb7b96be69
0x3a6a00c156e70e070c90bb1f4e9362b1dd80571429b07acd45b1941f5f0f3ce9
```

Convert Up consumed 0.000000033054725985 cbBTC LP. Its transaction gas limit was
16,423,604, below the 16,777,216 transaction cap. The test used the same disposable
EOA as publisher and operator; independent-operator behavior remains separate.

An initial fee-exempt sale ran out of gas. The form now estimates the actual
transaction and supplies 130% plus 50,000 gas, rejecting amounts above the
transaction cap. The successful receipt above is the retest, not the failed run.

The first Sow test used the wrong legacy selector and reverted in simulation.
That local test order was cancelled. The replacement was published in
`0x5565e0fe467a6cc11d7348f1884b8c153cab8574643c172975c5a894a14b2215`.
It first refused simulation with `Not enough blocks since sunrise`, matching
its signed 300-block waiting condition. After mining 300 blocks on the disposable
child only, simulation and execution succeeded at block 53179196. The contract
withdrew 6.2 deposited Pinto: 6 for sowing and 0.2 for the operator tip. Publisher
and operator were the same EOA, so this does not establish independent-operator
tip delivery.

Two additional browser executions checked post-receipt refresh, without reloading
the page:

| Test | Execution hash (local only) | Gas | Visible results |
| --- | --- | ---: | --- |
| 2-Pinto Sow | `0x2d71f457bb31560e2e9a675e935b844eb18920ce4f0b4640cd1b10a3c2397ec2` | 1,872,947 | Soil 260.37 → 258.37; total account Pods 294.54 → 392.72; internal Pinto 0.4 → 0.6 |
| 1-Pinto Sow, after progress-cache fix | `0xab391a2e44dc3f6718dbbf7ca9974a16f4b8fe4b78ed14722e7d7cf3e915848e` | 1,872,935 | Soil 258.37 → 257.37; Pods 392.72 → 441.81; internal Pinto 0.6 → 0.8; order 1/1 completed, executed once |

Field/wallet reads update promptly; the historical order scan takes longer in
this fixture, so order cards update when that background refetch finishes, not
synchronously with the receipt. Final chain state was checked at block 53179200:
Soil 257.366933 and Pod Line 43,280,987.301630, matching rounded UI values.

## Automated checks and remaining coverage

That earlier run passed 167 tests across 19 files and built the production bundle.
Run `yarn test`, `yarn build` and `yarn tsc --noEmit` separately: Vite build does
not perform a full TypeScript check. The baseline main branch had 15 type errors;
the scoped Tractor fixes remove 10. Five existing Pod Market errors remain
(a wrong type import, two Checkbox props and two optional-account arguments).
They are not represented as a clean typecheck.

Regression tests cover unlocked selection/proration, stale and consumed transfer
rows, dewhitelisted deposit enumeration/value fallback, exact-block lock reads,
RPC failure, redemption qualification and guarded submission, season refresh,
optional route failure, release-helper configuration, renamed Sow ABI round trips,
historical blueprint targets, completion sentinels and execution-gas USD units.
The wallet regression test exercises the installed Viem fallback implementation,
including a network/account change between the initial attempt and its retry.
The cache regression test uses a real QueryClient with Wagmi's BigInt-safe hash
function and the actual nested Tractor query keys. Live protocol invalidation is
deployment-scoped and skips pinned historical reads; Tractor invalidation spans
its existing shared cache namespace.

The structured read-only review finished with exit code 0 and no actionable
findings (`gpt-6.1-sol`, high reasoning). Accepted findings were fixed and covered
by regressions: retained dewhitelisted deposits, alternative-route selection,
consumed deposit selections, lock-aware Sow previews, historical blueprint
progress targets, dewhitelisted valuation, failed per-order reads and Viem wallet
fallback compatibility. Browser tests additionally caught the renamed Sow entry
point, insufficient redemption gas margin and stale post-execution data.
This is model review, not an independent human audit.

Final verification commands (run from this worktree):

```sh
node_modules/.bin/vitest run
node_modules/.bin/vite build
node_modules/.bin/tsc --noEmit
git diff --check
/Users/ash/.codex/skills/autoreview/scripts/autoreview --mode local --engine codex \
  --codex-bin /Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex \
  --model gpt-6.1-sol --thinking high --no-web-search \
  --output /tmp/pinto-current-ui-review-refresh.md \
  --json-output /tmp/pinto-current-ui-review-refresh.json
```

The review also received a read-only scope prompt explaining the current-main
port, the progress-cache regression and the documented baseline type errors.

## Independent operators, real Sunrise and live output locks

The next pass added fixed QA account selection: the publisher is the first public
Anvil EOA, the operator is the second, and an existing fork depositor can be
selected for local impersonation. Signing is restricted to the two test EOAs;
the impersonated depositor cannot sign orders. Sends still require the selected
allowlisted account, chain 1337, zero native value, and an allowed Diamond call
or token approval. The production bundle contains neither this entry point nor
the test mnemonic/RPC. Two regression tests cover the account/send restrictions.

`advance-season.cjs` advances time and calls the actual `sunrise()` on port 18569.
It snapshots first, asserts Anvil/chain 1337, preserves existing report paths and
records receipts/events. It does not inject an observation or modify protocol
storage. The inherited oracle fixture is synthetic: these prices and conversions
are UI scenarios, not predictions for the next production Sunrises.

| Season | Real Sunrise outcome | Whole-transaction gas | Auto Convert attempt gas |
| --- | --- | ---: | ---: |
| 17135 | Invalid observation; conversion skipped, Sunrise completed | 4,484,646 | 134,756 |
| 17136 | Four Wells; 44.465492 input BDV converted | 10,862,841 | 6,461,473 |
| 17137 | Four Wells; 161.371287 input BDV converted | 9,308,341 | 5,184,224 |

Corresponding local transaction hashes:

```text
0x2d3872e52765a7c74790e83912ba5696ed0367d25345df2748feac453e9bc65e
0x8f5256a8d2b09849edbcc1a408d1d2d5e2c30dc19f00e9e28dbc0eda79c11c3c
0x9088867da3be1cccfd5c300230381f1ac72a8736fc1eafa60697ba34899d45aa
```

The cbETH depositor's open withdrawal form was tested across both successful
Sunrises. The first exposed a display-only clamp: the input showed the smaller
balance while the parent transaction amount was still the old Max. Submission
was blocked, but the mismatch was confusing. Withdrawal now preserves the
requested amount, derives insufficiency from the parent amount/unlocked balance,
and lets the user explicitly press Max. The next real Sunrise reduced
12.478196796257508490 LP to 12.041163308502248054 LP: the old requested amount
remained visible and disabled, then Max selected the exact new balance and
cleared the error. No withdrawal was sent during this check.

For the first output lock, the UI showed 571.753224 Pinto owned, including
69.889541 locked, and Max withdrawal of 501.863683. The deposit table displayed
the locked amount and unlock time. At chain timestamp 1793819592 (one second
before expiry), the lock remained. At 1793819593, without Sunrise or reload,
the warning disappeared and Max became 571.753224. Ownership did not change.
The new 1-Pinto deposit also ceased to be marked germinating after two Sunrises.

Independent-operator receipts:

| Action | Publisher result | Operator result | Receipt gas |
| --- | --- | --- | ---: |
| 3-Pinto Sow | 147.30 Pods; total Pods 441.81 → 589.11 | Internal Pinto 0 → 0.20; no Pods | 1,907,321 |
| 4-Pinto Convert Up | 4 deposited Pinto; UI order 4/4 completed | Internal Pinto 0.20 → 0.40 | 9,575,546 |
| 2-Pinto Sow funded only by USDC LP | 98.21 Pods; UI order 2/2 completed | Internal Pinto 0.40 → 0.60 | 3,057,683 |

Publisher: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`.
Operator: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.

```text
Sow publication: 0x0b0a2f1579c29b42ae287be029626f710b2cf6e94ff54a9149a95d5bfb892767
Sow execution:   0x03442b3cab8b9876f44f8f626034eb9ae14218e1411ce4a3f1f7020043ba4b73
Convert publish: 0x752c681653d892a01527e91ae576ec30d0b28570113d27837eed476db6bf324a
Convert execute: 0x01c38f158f17a0b734cd842ef02b0f14f04f4201db80f6c2c8cc2e2aa499c61b
LP Sow publish:  0x64bbc547a4cfb6ce9f6256f42ca506fe512bafb3025f178fe61ce72e5a39dc7b
LP Sow execute:  0x494a79bc00012fa7b4ed587bf6328785e5840e08df5de052fd879c35aa3fc743
```

The Convert Up transaction limit was 16,129,729, below the 16,777,216 cap.
Its signed 0.20-Pinto tip was negative-profit at the displayed test gas/price;
execution proves functionality, not sufficient keeper incentives.
The LP-funded Sow used the normal release Sow blueprint, not the separate
qualified-redemption blueprint; it does not establish a fee-exempt Sow route.
New LP-order discovery also waited for the global orderbook refresh even while
the publisher's order card was already visible. After refresh, browser simulation
and execution succeeded, and the publisher card showed completion.

Further UI findings to resolve separately from the ABI port:

- Convert Up eligibility uses the existing five-minute orderbook cache. After
  capacity replenished, the operator panel still showed no active orders until
  a fresh load. Simulation/execution then passed; immediate eligibility refresh
  is not established by that test.
- The existing Sow funding-source dialog labels LP-to-Pinto quote amounts as
  dollars without multiplying by the Pinto price. For example, 113.50 USDC LP
  appeared as approximately `$304.83` in that dialog versus about `$10.72` in
  the Silo. The dialog's LP branch uses `swapResults` directly; this is not an
  Auto Convert valuation change. Do not treat that display as verified USD value.

The final scoped withdrawal review returned exit code 0 with no actionable
findings. Evidence for this pass is in `/tmp/pinto-ui-state-qa.g0biTJ`: three
Sunrise reports, independent-operator receipts, exact lock-boundary reports,
screenshots, passing tests/build, unchanged five-error typecheck, and the
read-only `gpt-6.1-sol` review. No protocol sources were changed in this UI pass.

## Deposit transfer, wrapping and unwrapping follow-up

The disposable child was revalidated as Anvil/chain 1337 before this pass. The
protected parent block hashes remained unchanged at 53178793 (18564) and
53178878 (18565). No protocol sources, live chain, deployment or production UI
behavior were changed in this follow-up. The only harness extension allows
self-receiving `depositFromSilo` (at most 1 Pinto, 1–16 nonzero crate amounts)
and self-owned `redeemToSilo` (at most 1 sPinto), at the fixed wrapper address.
The chain/client restrictions, zero-native-value requirement and selected-account
checks remain. Arbitrary wrapper calls and third-party recipients are rejected.

| Browser scenario | Verified result | Local receipt gas |
| --- | --- | ---: |
| Transfer form switches to an account with no deposits | Returns to asset selection, clears stale selection, disables Continue; no send | None |
| Transfer 0.1 deposited Pinto, publisher to operator | Recipient gets 0.1 Pinto, 0.100058 stored BDV and 0.3266986120873034 Stalk | 907,357 |
| Wrap Max with 0.1 deposited Pinto and 0.6 wallet Pinto | Max is 0.1; entering 0.2 disables submission despite the wrong balance label | None |
| Wrap 0.05 deposited Pinto | Reverts with wrapper `MinPdvViolation`; deposits, Stalk and approval remain intact | 995,142 (failed) |
| Wrap 1 deposited Pinto from publisher | Receives 0.972184802110370929 external sPinto; UI refreshes without reload | 1,056,425 |
| Unwrap all those shares to Silo | Receives 0.999999 deposited Pinto; external sPinto becomes zero; UI refreshes | 729,839 |

Local receipt hashes:

```text
Transfer:          0xe86d5e617234d86d354a0e144a1b80f07d5df0b44adbe8b7a83ff503a76eff5e
Approve 0.05:      0x719d3f0d390f1ac7519a921fcbfac9add89ca47afd863d6694103a7b99770499
Sub-minimum wrap:  0xe8d9b2ece214ba2fc7a8ffa29cc96c3dfd372c46ca5f7005dbe8e496421bfc41
Approve 1 Pinto:   0x3911ab71c044fafda46122dc087459bd7ddc0f1b40e87725bc0c5c374d251e75
Successful wrap:  0x96bcc61aecbfe6ac7d8c5c553102936a41b3a6af619f38ccbcec07245fca93b4
Successful unwrap:0x60197a5a613560762bf9ab13f39e904c5182d3959e446792620dbf0a20647fbe
```

The two approvals used 504,680 and 504,692 gas. Wrapper `minSize()` returned
1,000,000 raw units. The failed wrap trace ended with `0x6a189f80`, decoded by
the wrapper ABI as `MinPdvViolation()`. Its UI toast instead reported
`Silo: insufficient allowance`; direct reads confirmed the 50,000 allowance
and original 100,000-unit deposit remained. This is not a successful wrap or
evidence that a protocol allowance check failed. The successful wrap/unwrap
used the existing public ABI with no ordered-index hints.

At block 53179817 the publisher held 89.269190 deposited Pinto (one raw Pinto
unit less than before wrapping) and zero sPinto. Its Stalk was
3208.9306323160610909. The operator still held 0.1 deposited Pinto and
0.3266986120873034 Stalk. Existing wallet/internal Pinto balances were unchanged.

Additional findings, **not fixed or signed off**:

- Recipient Stalk cache: after the transfer, the recipient's deposit and Seeds
  refreshed but cached Stalk stayed zero until reload. The chain already had
  0.3266986120873034 Stalk. `useFarmerSilo`'s Stalk reads retain the older
  20-minute query policy; the transfer refresh targets the sending account.
- Wrap balance label: `WrapToken` supplies the correct `customMaxAmount`, but
  does not select deposit display mode in `ComboInputField`. It labeled 0.6
  Farm Wallet Pinto as "Deposited Balance" when actual deposits were 0.1.
  Maximum and insufficiency enforcement used deposits correctly.
- Minimum wrap/preflight: the UI offered the sub-minimum wrap. The generic
  transaction hook catches estimation errors and proceeds with a 3-million-gas
  fallback; this let a known-invalid call be mined. The minimum should be
  checked and the actual call simulated before sending; failed estimation
  must not be treated as proof a call is valid. Production fixes need separate
  authorization; the question to the user is outstanding.
- Unwrap Stalk preview: it displayed "1.00 Stalk" but the successful redemption
  increased Stalk by 3.2669665303188302, including carried growth. The current
  preview computes base Stalk only; it needs an explicit base-only label or an
  accurate total, rather than being described as verified total Stalk.
- The local dev landing route failed to load its dynamic `Landing.tsx` module
  in an earlier pass; direct Silo/sPinto navigation and the production Vite
  build work. The cause is not established. Historical sPinto charts also
  remain unavailable locally; successful transactions do not certify them.

Evidence: `/tmp/pinto-ui-transfers-qa.9EMZuz` contains transfer/recipient and
wrap/unwrap screenshots plus the full passing Vitest JSON report. State reports
are in `/tmp/pinto-current-ui-qa.pmpWUM`, with labels
`transfer-publisher-before`, `transfer-operator-before`, `wrap-operator-before`,
`wrap-publisher-after`, `unwrap-publisher-after`, and `failed-wrap-operator-after`.
Full tests: **152 passed in 17 files**. Vite production build passed; the same
five baseline Pod Market TypeScript errors remain. Production bundle search
found no QA entry marker, test mnemonic or port-18569 RPC.

The balance-label wiring, absent minimum-wrap check, estimate-failure gas fallback,
20-minute Stalk query policy and base-only unwrap Stalk calculation were also
present in upstream baseline `60f611d5bd5b6b700fa0122277c7c4e7247d0524`.
They are separate from the new Auto Convert ABI compatibility work.

Scoped autoreview finished with exit code 0 and no actionable findings. It used
`autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high
--no-web-search` with the configured desktop Codex binary and a read-only scope
prompt. The byte-matched review copy covered the QA transaction policy, its
regression tests and this record, with dependencies read from the actual worktree.
Artifacts: `/tmp/pinto-ui-wrap-review.BF6el1/review.txt` and `review.json`.
No findings needed acceptance or rejection. The review inspected tests; the
separate Vitest run above establishes execution. This is not human security
sign-off. No source commit, push or deployment was performed.

## Rendered RPC and wallet-context failures

QA-only controls now inject deposit/lock read failures and hold one fee-exit gas
estimate until explicitly released. The failure control covers direct Diamond
reads and Viem's `aggregate3` batches. An aggregate containing a selected read
fails as a whole; unrelated calls in the same batch may fail too. It never
fabricates successful data, blocks a send, or changes production client behavior.
The initial direct-only injector did not intercept the actual batched path; it
was corrected before treating the browser result as failure-path evidence.

A separate wallet control reports unsupported chain 1338 without changing any
RPC URL or node chain ID. Public reads stay on the fixed 18569 child; the QA
wallet refuses signing/sending while the mismatch is active. This exercises
the rendered app's connector-context handling, not a real external-wallet switch.

| Browser scenario | Result | Transactions sent |
| --- | --- | ---: |
| Valid cached Pinto exit quote, then failed deposit/lock reads | After query retries, explicit eligibility error and disabled submission; old quote remains visible | 0 |
| Restore reads and refresh | Error clears; real eligible balance and quote usable again | 0 |
| Hold estimate, change publisher to operator, release | Production form reports wallet/network/form cancellation; operator's smaller balance is shown | 0 |
| Hold estimate, change away and back, release | Pending attempt stays cancelled even though the original account is restored | 0 |
| Hold estimate, report unsupported network, release | Production form cancels before wallet submission | 0 |
| Attempt again while wrong network is reported | Cancels again; no chain-switch request or send | 0 |
| Operator with no USDC LP deposits: Max, then enter 1 LP | Zero eligible balance, insufficiency error and disabled exit; ordinary Withdraw/Convert/Send tabs also unavailable | 0 |

The first account-change attempt was stopped by a different real check: estimation
returned `SiloRedemptionExpired()` (`0x3d0cb5c4`). The latest block timestamp was
1793824002, so the reviewed deadline was 1793825202, while Anvil's pending block
had advanced to 1793825271. That attempt is evidence of expiry rejection, not
of the account guard. One empty block was mined on the disposable child, then
the account/network tests above were repeated successfully at block 53179818.
Its timestamp is 1793825287 and hash is
`0x8bf7f644f909d48793befbeea82ebfc8da320c2dd61fdb9852547b8538a601ba`.
No transaction was submitted in this pass. Both protected parent head hashes
remained unchanged. No production UI or protocol source was changed.

One additional **unresolved display issue** surfaced under the simulated wrong
network: cached deposits remained visible while protocol-derived price became
$0 and the per-token Stalk display became negative (publisher: -414.14).
The exit button also remained visually enabled, although submitting was blocked
by the context guard. Restoring the wallet's reported network restored the
display. Unsupported-network rendering needs a separate production fix/review;
these tests do not certify that data display or real Privy/extension behavior.

Screenshots and full Vitest JSON are in `/tmp/pinto-ui-failure-qa.2hChBC`:
`deposit-read-failure.png`, `account-change-cancelled.png`,
`account-return-still-cancelled.png`, `network-change-cancelled.png`, and
`empty-lp-selection.png`. **156 tests passed in 18 files**. Vite production build
passed; TypeScript still reports only the five previously documented Pod Market
errors. The production bundle contains no QA entry marker, public test mnemonic,
failure-injection message or port-18569 RPC. The new four unit tests cover fault
scoping, actual batched calls, restoration and one-shot estimate holds.

Scoped autoreview completed with exit code 0 and no actionable findings:

```sh
autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search \
  --codex-bin /Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex \
  --prompt 'Review only local QA controls, wallet changes, tests and evidence; production fixes are separate' \
  --output /tmp/pinto-ui-failure-review.oCYELD/review.txt \
  --json-output /tmp/pinto-ui-failure-review.oCYELD/review.json
```

The actual prompt also specified dependency paths, fixed-local-RPC restrictions
and the tested scope. The review used byte-matched copies of `read-controls.ts`,
`wallet.ts`, `main.tsx`, the new test and this record; no findings were accepted
or rejected. It inspected but did not execute tests. This is model review, not
independent human sign-off. No project source commit, push or deployment occurred.

## Ordinary withdrawal reads and referral preparation

This pass used the same disposable child at block **53179818**, Season 17137,
hash `0x8bf7f644f909d48793befbeea82ebfc8da320c2dd61fdb9852547b8538a601ba`.
No transaction was sent or block mined; the parent forks were not modified.
All failure controls were restored, the test referral was cleared through the
visible input, and the page was reloaded before the plain-order comparison.

| Browser scenario | Observed result |
| --- | --- |
| Publisher prepares withdrawal of 1 USDC LP; deposit reads then fail | After retries, an explicit read-error alert appears, spendable balance becomes zero, the input and submit button disable, and last-known ownership of 112.680940417570489686 LP remains visible |
| Switch to previously uncached fork depositor during read failure | No spending is offered, but the holdings panel says zero and “nothing Deposited” despite unavailable data; the separate error alert appears after retries |
| Restore reads and revisit that depositor | Without a reload, 349.870448390378232186 USDC LP in two crates returns (UI: 349.87 LP, $33.05, 2,214.16 Stalk and 50.66 Seeds) |
| Prepare 6-Pinto Sow order with public test operator referral | Form shows 294.6 Pods plus 14.73 bonus Pods; submission fails before the sign/publish review, with zero submitted transactions |
| Clear referral in that same form and retry | Bonus disappears, but creation still fails; the internal form retains the old referral |
| Reload after clearing referral, prepare the same plain order | Reaches “Review and Publish Sow Order,” with Sign Order enabled and Publish Order disabled; neither was clicked |

The observer's exact LP balance and two crates were independently read from the
local Diamond at the unchanged block. The withdrawal guard correctly prevents
spending stale crates, but two **unresolved presentation defects** remain:

- `useFarmerSilo` sets availability to zero on read error, then calculates the
  token-level `lockedAmount` as ownership minus availability. `SiloActions`
  consequently describes all cached USDC LP as unavailable “following Auto
  Convert.” No actual output lock caused this. Unknown availability must not be
  reported as an authenticated lock.
- Without cached deposits, `DepositsTable` and holdings totals render an empty
  balance instead of an unavailable/loading state. The error alert is present,
  but does not make “nothing Deposited” accurate.

The local fixture intentionally has no configured referral release blueprint.
`createSowTractorData` requires the referral-specific explicit address when a
referral is present, and `assertTractorDeploymentReady` rejects absent release
configuration on the upgraded Diamond. Browser evidence establishes rejection
before the signing-review stage, not successful referral execution. The hook
swallows the detailed exception, leaving only “Failed to create order”; the
missing-helper explanation is established by the source/configuration path,
not exposed by the rendered toast.

Clearing the referral exposes an additional **upstream form bug**:
`SowOrderDialog` synchronizes only valid, nonempty hook values into its form.
An empty string removes the visible bonus and stored code but never clears
the old form value passed to blueprint creation. The same effect is present
in baseline `60f611d5bd5b6b700fa0122277c7c4e7247d0524`. A reload removes that
stale form state; the plain-order comparison then succeeds. This pass did not
sign or publish the stale referral, nor modify production code to fix it.

Screenshots: `/tmp/pinto-ui-read-referral-qa.A2BT9L/withdraw-read-failure.png`,
`uncached-depositor-read-failure.png`, `uncached-depositor-restored.png`,
`referral-missing-helper-blocked.png`, `cleared-referral-still-fails.png` and
`fresh-plain-order-ready.png`. Production fixes for error-state presentation,
referral clearing and actionable configuration errors were requested separately.

## Wallet-funded wrap/redemption and empty Harvest

This pass started from the unchanged child block 53179818 and used only the
public QA publisher on Anvil port 18569. Snapshot `0x5` was taken before the
transactions. No production contract, deployment, or UI implementation changed.
The test-wallet policy now additionally permits `redeemAdvanced`, restricted to
at most one sPinto, the selected account as both owner and receiver, valid balance
modes, chain 1337 and zero native value. A regression covers the bounds and rejects
other accounts, invalid modes, excess/zero shares, wrong chain and native value.

| Browser action | Verified result | Receipt gas |
| --- | --- | ---: |
| Approve wallet Pinto spending | Approval to the Diamond | 46,365 |
| Wrap 1 Pinto from combined wallet balances | Uses 0.8 Farm Wallet + 0.2 external Pinto; receives 0.972184802099517132 external sPinto | 1,760,992 |
| Unwrap all those shares to external wallet Pinto | Receives 0.999999 Pinto; sPinto balance returns to zero | 937,056 |

Local-only transaction hashes, respectively:

```text
0x05c0df3f18a88a0a25fe903603fa6953a05014f10069e35dae891b65aa1efe10
0x6c7237a4bc2dc5afec3f187d12f70e46b41da74079f25e1e2df0416e00b50efc
0x3ff7bef49992572f1114df1ffcb3daf01761816c2507cbc6a6f6e1b9a125bff1
```

The final block is **53179821**, hash
`0xa2442f98a05071462e7438815d27745ede33c29a7b989cbe0418de336595dc80`.
Publisher external Pinto moved from 863.118063 to 863.918062, internal Pinto
from 0.8 to zero, and sPinto from zero through the quoted shares back to zero.
The combined balance therefore loses one raw Pinto unit to round-trip rounding.
Publisher Stalk stayed exactly 3208.9306323160610909. Account balances and wrapper
deposited totals refreshed after each successful receipt without a page reload.
The wrapper route does not use 0x; it does not establish aggregator coverage.

One additional **unresolved upstream display defect** was reproduced: total
sPinto supply did not refresh after either transaction. After redemption the UI
still showed 87,080.47 sPinto, while the contract returned
87,079.502033748142871327. Reloading corrected the display to 87,079.50.
`useSiloWrappedTokenTotalSupply` has its own query, and the wrap/unwrap success
callbacks invalidate account/wrapper deposits and balances but not that query.
The same hook and invalidation omission exist in upstream baseline
`60f611d5bd5b6b700fa0122277c7c4e7247d0524`. This is not a transaction or conservation
failure, and no production fix was made in this QA pass.

The Field page's five publisher plots and places in line were compared with
`getPlotsFromAccount` and `harvestableIndex(0)` at the same unchanged final block.
The first plot has 294.54 Pods and is 43,280,545.491630 places from harvest;
the UI displays 294.54 and 43,280,545.49. Harvest is correctly disabled with the
next-plot explanation. All three allowlisted QA accounts have **zero harvestable
Pods**. This proves the no-harvestable-input state only, not successful harvesting.
Historical temperatures are explicitly unavailable for the local-only plots.

Evidence screenshots are in `/tmp/pinto-ui-wallet-wrap-qa.EabcrX`, including
`wallet-wrap-success.png`, `wallet-unwrap-stale-supply.png` and
`wrapper-supply-after-reload.png`. The full suite passed **157 tests in 18 files**,
Vite production build passed, and TypeScript still has the same five documented
Pod Market errors. No new TypeScript error was introduced by the QA permission.
The production bundle contains no QA marker, loopback RPC, injected failure text
or public test mnemonic. Both protected parent head hashes remained unchanged.
`field-no-harvestable-pods.png` and `harvest-disabled.png` record the Field checks;
the latter also shows the already-unresolved historical-chart error.

Scoped autoreview returned exit code zero and no actionable findings using:

```sh
autoreview --mode local --engine codex --model gpt-6.1-sol --thinking high \
  --no-web-search --codex-bin /Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex \
  --prompt 'Review only bounded QA redeemAdvanced permission, its test and evidence; production fixes are separate' \
  --output /tmp/pinto-ui-wallet-wrap-review.CdqDEW/review.txt \
  --json-output /tmp/pinto-ui-wallet-wrap-review.CdqDEW/review.json
```

The actual prompt also identified the byte-matched review copy, real dependency
paths and read-only restrictions. No findings needed acceptance or rejection.
The reviewer inspected code but did not execute tests or transactions; those
results are independently recorded above. This is model review, not human
security sign-off. No source-repository commit, push or deployment occurred.

## Germinating wrapper input, active output locks and expiry

This pass resumed the disposable child at block 53179823, with a fresh 1-Pinto
publisher deposit created through the browser at stem **79016868808**. Its
germinating threshold was **79008913867**. The wrap approval and execution were
also browser-driven; no deposit/lock storage was injected.

| Browser action | Verified result | Receipt gas |
| --- | --- | ---: |
| Deposit 1 wallet Pinto | Creates the fresh germinating crate | 663,312 |
| Approve Silo wrapping | Approves deposit spending by the wrapper | 504,692 |
| Wrap that exact 1-Pinto crate | Receives 0.972184802088663334 sPinto; source crate removed from publisher | 754,946 |

The wrapping call decoded as `depositFromSilo([79016868808], [1000000],
publisher, 0)`. Receipt events transfer 1e16 germinating Stalk from publisher to
wrapper and preserve the stem. The wrapper's crate becomes 1.000001 Pinto,
including its existing one-atom remainder. This demonstrates supported voluntary
wrapping of germinating deposits, **not** eligibility for automatic conversion.

Local transaction hashes:

```text
Deposit:       0x79f8686cd2723a7a4bcd4a6654cb196a3452332e928ccaca3a3b23cad743c887
Silo approval: 0x9861f4b89210d891aacd2fe740473f24cdc4dabff8a3150a84bc3d6110bb11b5
Wrap:          0xd0716cff1c2062c9d16a5461b30a96022083522b2d704d508c81e0982b2e5b6c
```

Ordinary Sunrise then rebuilt the existing history, without bypassing its gates:
Season 17138 skipped conversion for `AutoConvertObservationInvalid`; Seasons
17139–17162 skipped for `AutoConvertDailyHistoryUnavailable`; all completed.
Season **17163** converted **159.661320 input BDV across four Wells**, consuming
10,738,103 gas for the whole Sunrise and 6,520,396 for its conversion attempt.
Its hash is `0x29ef3b1cffa695eafe27ce3a09a01438e4b1aad058f4d839b1e4fbdc27e0bbca`.
These remain synthetic inherited-oracle UI scenarios, not production forecasts.

The allowlisted fork depositor received **241.186557 locked Pinto** at stem
**48801805065**, unlocking at timestamp **1793922029**. It owned 1,054.226295
deposited Pinto, with exactly **813.039738 unlocked**. Two additional wrapper
UI defects were demonstrated, both with source behavior present upstream:

- With only 3.940162 wallet Pinto, deposit-mode Max incorrectly selected
  **3.940162**, not 813.039738. The same wallet value is mislabeled as deposited
  balance. `WrapToken` supplies an unlocked maximum, but `ComboInputField`
  limits that maximum by the ordinary wallet balance unless it is zero.
- After the lock expires, the parent correctly stops displaying "Insufficient
  funds", but the button remains disabled by stale `inputError`. The shared
  input's error effect omits `maxAmount` from its dependencies and returns early
  for user-originated/unchanged amounts; the availability change does not revalidate
  that input. Re-entering the identical amount clears the error without a reload. No production fix was
  made; approval for a separate scoped fix was requested.

To isolate output-lock enforcement from the first bug, the publisher used the
normal browser wallet-management form to move 850 test Pinto into its Farm
Wallet, then the normal transfer form to send it to the fork depositor's external
wallet. All funds and writes were confined to the disposable fork. Approval,
internalization and recipient transfer consumed 46,377 / 532,548 / 610,022 gas.

```text
Approval:      0x5a219f723a54ff516bbe99fcdccccc6dfea4f3575e2c551849015e71e3f89d83
Internalize:   0x3f3cbf6453da98e0b5cd4a808124715a29a95afae997ff487fa49dc0c2ccddc3
Transfer:      0x32d3321026792cb40cdd496e67e59e5fa36dfcb485bd29f1860003440748c1a0
```

The recipient wallet became **853.940162 Pinto** and the publisher's internal
balance returned to zero. Deposit-mode Max then selected the exact unlocked
813.039738. Entering **820**, below both wallet balance and total deposit ownership
but above unlocked deposits, disabled submission. At timestamp 1793922028 the
onchain lock remained; at **1793922029** it became zero without Sunrise. The same
820 input became approvable only after re-entry, confirming the stale-validation
bug above. Neither the 820-Pinto approval nor wrap was submitted. This tests the
rendered eligibility guard, not execution of an oversized wrapper transaction.

Evidence is in `/tmp/pinto-ui-maturity-qa.4T3Zwj`: `germinating-deposit.png`,
`germinating-wrap-success.png`, the three `sunrise-*.json` reports, and
`wrap-active-lock-blocked.png`, `wrap-active-lock-disabled.png`,
`wrap-expired-lock-stale-disabled.png`. All **157 tests in 18 files passed**.
Only this QA report changed; no production implementation, deployment, push or
commit was made. Final child block is **53179856**, hash
`0xabc9a5243ca0569ca245fa08bcd9e5df30648ec12477c14e8fd96c76d30a17e0`.
Both protected parent head hashes remain unchanged.

## Pod Market orders: creation, partial/full fills and cancellation

This pass used only the existing disposable child, first at block 53179856 and
finally at **53179861**. All five market transactions below were submitted through
the unchanged production forms in the browser. The buyer was the allowlisted
fork depositor `0xa0AA5f404664A175Cd84e29B36840556f1C888E4`; the seller was the
public QA publisher `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`.

### QA indexing, not a production subgraph

Production indexing cannot know about local transactions. The QA server now
redirects exactly six existing market query hooks to its loopback-only
`/__qa/market` endpoint. `market-orders.mjs` replays **new local Field-0 orders
after block 53178878** from actual creation/fill/cancellation events. It checks
event block hashes, pinned final order escrow and final block continuity;
historical fill positions use the relevant block's harvestable index. It handles
partial/full fills, cancellation, ID recreation and account filters without
floating-point conversion of raw amounts. Fork rollback triggers a fresh scan.

Wrong chain/client, inconsistent escrow, missing data, unsupported queries and
local listing creation return errors rather than a fabricated empty market.
**Listing indexing is intentionally not implemented yet.** The QA banner states
this is new-local-order coverage, not production subgraph history/reconciliation.
No market production source or transaction encoding was changed.

### Browser and receipt results

Both orders spend 2 external Pinto for up to 200 Pods at 0.01 Pinto per Pod, with
a 1-Pod minimum fill. The first maximum place is **43,281,233**, the second
**43,281,000**. A rejected first submission sent no transaction and retained the
form input; the retry succeeded.

| Action | Exact result | Execution gas |
| --- | --- | ---: |
| Create first order | 2 Pinto escrowed; 200 Pods requested | 638,475 |
| Create second order | Another 2 Pinto escrowed; 200 Pods requested | 638,463 |
| Partially fill first order | 100 Pods transferred; 1 Pinto paid to seller's Farm Wallet; UI shows 100 remaining and 50% filled | 782,530 |
| Cancel remainder of first order | 1 Pinto returned to buyer's external wallet; escrow zero; order removed from open table | 498,377 |
| Fully fill second order | 194.54 + 5.46 Pods from two plots; total 2 Pinto to seller's Farm Wallet; escrow zero | 1,031,888 |

Local-only transaction hashes in the same order:

```text
0x56dc85f7025425a1f2ebcffa823d22216ef988fc13ff2390b2dad6fd7463c1d0
0x3464696561c79cf057df7289ed266e913bf7fc4c0defe0dffb1a8b4af43b7ac5
0xe83f4fddf36a88be56744c681b319d91312d2f922171fd5eebf3a4ed45f6a6fd
0x987cf1a14326ddeef3c825d977d8d064347b22572ba0c779a794a550a099928a
0x535d044678620aa3384bb5ca00ab60dac1a7dbf2cf83ee780aa869edc88e98fb
```

Order IDs:

```text
First:  0xbc3953bdad1a9ae6b015158bb63682e909162882ce39cbd1d440c81f4fdf6aff
Second: 0x739a0f1f2ccf5fa0d96867c87dcd0a82d745ff0122ac624d9169bfc9e57c4a1c
```

Final conservation: buyer wallet **850.940162 Pinto** (853.940162 before the two
orders), buyer **300 Pods**; seller wallet unchanged at **527.418178 Pinto**,
seller Farm Wallet **3 Pinto**, seller **387.32 Pods** (687.32 before fills).
The buyer's three plot amounts are exactly 100, 194.54 and 5.46 Pods. The history
table shows the original order cancelled at 50%, the second filled at 100%, and
three fill events. Displayed amounts round to whole Pods/Pinto in that table;
exact conservation was checked from receipts and contract getters, not inferred
from the rounded table. Once all orders fill, the empty-order early return hides
the final success panel, though the table and balances update.

### Confirmed upstream defects, not fixed in this QA pass

1. **Clipped small-plot selection.** The 687.32-Pod publisher position was at the
   end of a 43,281,232.811630-Pod line. `computeGroupLayout` increases marker
   width to a minimum but does not move its left edge inside the container.
   The 4px marker begins at x869.984375 in a graph ending at x870; only about
   0.016px remains visible. The form graph leaves about 0.008px visible. The
   overflow-hidden container clips the rest, with no accessible keyboard
   selection alternative. The normal listing path is consequently blocked for
   these plots; we did not inject a DOM selection or bypass this defect.
2. **Valid order rejected by eligibility filtering.** The create form's integer
   arithmetic permits maximum place 43,281,233, slightly above the actual line.
   `isOrderEligible` incorrectly requires order maximum place <= current line.
   With only that order, the fill form reports no eligible orders. A second
   eligible order makes the form render; the URL-selected first order can then
   be filled successfully, as its receipt proves. Contract eligibility limits
   the selected plot's endpoint, not the buyer's maximum to current line length.
   The early return also hides cancellation when no order passes that filter.
3. **Stale buyer plots after fills.** The buyer's first 100-Pod balance was cached
   before the second fill. Switching from seller back to buyer then visiting
   Field showed only that 100-Pod plot, despite 300 Pods onchain. Reloading and
   reconnecting displayed all three plots correctly. The plot query has a
   20-minute stale/refetch interval; the fill callback invalidates only the
   connected seller's plot key, not recipient buyers' cached plot keys.

All three source behaviors exist in upstream baseline
`60f611d5bd5b6b700fa0122277c7c4e7247d0524`. Separate production-fix approval was
requested; no production edits were made to address them.

Evidence screenshots are in `/tmp/pinto-ui-market-qa.yMwNT5`, including
`clipped-pod-selection.png`, `order-eligibility-mismatch.png`,
`buyer-stale-pods.png`, `buyer-refreshed-pods.png` and
`market-filled-cancelled-history.png`.

The QA adapter's 10 tests cover real query documents, replay boundaries,
partial/full fills, cancellation/recreation, account filters, missing data,
escrow mismatch and changed-fork rejection. Full verification: **167 tests in
19 files passed**, production Vite build passed, and TypeScript still reports
the same five documented upstream market errors. The built bundle excludes the
QA banner, child RPC, local market endpoint and public test mnemonic.

The prior scoped structured review of the four QA implementation/test files
completed cleanly (`gpt-6.1-sol`, high reasoning, read-only). All four files still
byte-match that reviewed copy at `/tmp/pinto-market-review.cyArhG`; evidence is
`review.txt` and `review.json`. The reviewer inspected tests, while the executions
above were independently run. This is not human audit or production-indexer
sign-off. This report was expanded after that review.

Final child block hash:
`0x2fc791c615e65d4d02794bfa397b592b55fc66eb165efb021ef5003e97081ad2`.
Both protected parent heads were rechecked unchanged. No contract deployment,
mainnet write, production UI fix, source commit or push occurred.

## Successful Harvest — October 28, 2026

This continuation closes the successful-Harvest gap on the disposable child at
`http://127.0.0.1:18569`, chain 1337. It does not deploy contracts, change global
harvestability, mint a test claim or spend any live funds. The earlier empty-Harvest
test remains separate evidence of that state.

### Real input, local-only preparation

Read-only discovery found an existing harvestable Field-0 plot at index
`3120854575045`, owned by `0x32548f83cadb8c5b91001f0ad9979b04fa75ceb4`.
Its 115.929402 Pods and lack of an active listing were verified on the child.
The native `transferPlot` method moved exactly **1 Pod** to the QA publisher.
The source retained 114.929402 Pods at index `3120855575045`. Global harvested
and harvestable amounts, the harvestable index and recipient Pinto balances
were unchanged by preparation.

`prepare-harvest.cjs` is a one-use QA helper pinned to the original child head
`53179861 / 0x2fc791c615e65d4d02794bfa397b592b55fc66eb165efb021ef5003e97081ad2`.
It checks the local chain/client, plot, listing, existing harvestability, gas
funding and simulated transfer before sending. A preflight sidecar retains the
input/accounting evidence before mutation; phase logs identify where an RPC
failure occurs. It never retries a send automatically. Earlier timed-out attempts
were reconciled against the unchanged head, empty transaction pool and unchanged
source/recipient plots before retrying. They did not transfer the Pod.

Successful preparation: transaction
`0x4990d6f7f0c940f0ee00bd0acb06baa51e14896a31441941b4d404bce10032fd`,
block **53179862**, **629,268 gas**. Recovery snapshot `0xc` was taken before it;
it has not been reverted. Impersonation was stopped after the local transfer.

### Browser result and accounting

| Check | Verified result |
| --- | --- |
| Initial Field / Harvest preview | 1.00 claimable Pod; 1 Pinto to the Silo, 1 Stalk and 7.97 Seeds |
| Reject next transaction, then Harvest | No submitted transaction; head stayed at preparation block; form remained usable |
| Retry Harvest | Success notification; exactly one submitted transaction |
| Field after success, without reload | Claimable row disappears; remaining Pods 387.32; Harvest disabled with next-plot explanation |
| Navigate to Silo, without reload | Pinto deposits show 90.27; new 1.00-Pinto crate and germination notice appear |

Harvest transaction:
`0xc8c6eadabfc3c37dc40da0bc1d5e631b2d6f2cbb9d02ecacfc77ce5b0955fe86`.
It succeeded at block **53179863**, using **1,034,766 gas** on this upgraded local
fork. This is not a current Base-dollar fee estimate. Calldata decodes to one
`advancedFarm` containing `harvest(0, [3120854575045], INTERNAL)` followed by
`deposit(Pinto, 1000000, INTERNAL)`.

Read-only post-transaction assertions verified:

- The 1-Pod plot is gone. `totalHarvested` rose by 1 Pinto and
  `totalHarvestable` fell by 1 Pinto; `harvestableIndex` stayed `3155543269527`.
- Publisher deposited Pinto rose **89.269190 → 90.269190**. The new crate at
  stem `79224092164` has exactly **1 Pinto / 1 BDV**.
- External Pinto stayed **527.418178**, and Farm Wallet Pinto stayed **3**.
  Harvest credited and deposit consumed the same internal 1 Pinto atomically.
- Germinating Stalk rose from zero to **1 Stalk** (`10^16` native Stalk units,
  consistent with `internalTokens.ts` and six-decimal BDV × `C.STALK_PER_BEAN`).
- Pinto total supply stayed **10,657,167.250195**. Harvest claims existing
  harvestable backing; despite the UI's “freshly minted” wording, this transaction
  did not mint additional supply. Deposit preparation also mowed existing growth,
  as shown by the separate `StalkBalanceChanged` event.

Evidence directory: `/tmp/pinto-ui-harvest-qa.0g4F73`. It contains the successful
`fixture.json`, its preflight sidecar and screenshots `harvest-preview.png`,
`harvest-complete.png` (post-success disabled state), `harvest-silo-deposit.png`
and `harvest-silo-crate.png` (new crate, balance and germination visible together).
The Field's historical chart still shows its separately documented data-source
error; successful Harvest does not validate chart/subgraph availability.

### Verification and boundaries

`node --check scripts/qa/prepare-harvest.cjs` passed. Attempts to reuse the same
evidence filename and to run at the now-changed child head both correctly failed
before submission. `npm test -- --reporter=dot`: **167 tests in 19 files passed**.
No production source changed in this continuation; production build/typecheck
results remain the earlier results, not newly rerun claims.

The autoreview skill checked a byte-matched copy of the helper, read-only, with
`--mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search`
and `/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex`.
It returned **no actionable findings**; none accepted or rejected. Artifacts:
`/tmp/pinto-harvest-review-final.AlBfEb/review.txt` and `review.json`. It did not
execute the script or tests; the browser and RPC assertions above are separate
execution evidence. This is model review, not independent audit.

Final child hash:
`0x51e9f2dbbbcd4f722c055947ff0c32328b297cbf1c8a71937ff322f4aa211082`.
Protected parent heads remain **53178793** on port 18564 and **53178878** on
port 18565, with their previously recorded hashes unchanged. No mainnet write,
contract deployment, production UI fix, source commit or push occurred.

## Pod listings and the two approved Market fixes — October 28

The user explicitly authorized these two upstream UI fixes, independently of Auto Convert:

- Initialize the numeric buy-listing price filter from the same `"0.01"` default shown in
  the input. No price edit should be necessary to discover listings at that price.
- Expose owner-only **Cancel Listing** in Activity / My Activity with an explicit confirmation.
  Activity no longer applies purchase-value filtering that hides tiny remainders. Canonical
  owner/index/Field IDs exclude other marketplaces and historical versions. The action checks
  wallet context before submission, estimates without a fallback send, prevents duplicate
  submission, and invalidates market/account query variants after success. It does not change
  contracts, fees, or list/fill/order transaction encoders.

Cancellation success requires a matching `PodListingCancelled` event from the Diamond for
the exact owner, Field and index. The structured review identified that Viem 2.33.1 can skip
`onReplaced` while waiting for a replacement's second confirmation. Receipt status alone was
insufficient. The event check fixes this case; unit coverage rejects successful unrelated
receipts, wrong emitters, owners, Fields, indices and reverted receipts.

### Earlier listing lifecycle, now reconciled

The isolated child received 200 existing mid-line Pods through the guarded
`prepare-market-listing.cjs` fixture (not minted): transaction
`0x4cd021e7a8e0cbe92e9343c39cc34f4564b9c6b1933afb3c17d51b95b7635947`,
block 53179864, 629,268 gas. Browser transactions then exercised:

| Operation | Block | Gas | Transaction |
| --- | ---: | ---: | --- |
| Create 200-Pod listing at 0.01 Pinto/Pod | 53179865 | 615,253 | `0x8fd0796b6c487060c34eedc0437f08bd91821273e90f7d9982b91cc598abf0a8` |
| Fill 50 Pods for 0.5 Pinto | 53179866 | 782,210 | `0x2244f0de806c7fb2d3540ced9c607beb57e5fcab4118900adb15c5a12d0b34c3` |
| Fill remaining 150 Pods for 1.5 Pinto | 53179867 | 711,048 | `0xb960a39e6189fa5487aefc1abb2b84f06c8c2db3713eaf9e5cacf7d94ce9ebcb` |

The buyer (`0xa0AA…88E4`) held 500 Pods afterward, including the exact 50/150-Pod plots at
indices 17861597363077 and 17861647363077. Both listing hashes were zero after the final fill.
Seller external Pinto was 529.418178; buyer external Pinto was 848.940162. The buyer's
activity and Field plot table were checked against those reads. A rejected full-fill attempt
did not advance the head. Evidence: `/tmp/pinto-ui-listings-qa.2TqObZ`, including
`buyer-pod-plots-after-full-fill.png`.

### Final-code browser retest

Using the buyer's existing 50-Pod plot (no new funding), the browser listed 50 Pods at
0.01 Pinto/Pod. On entering Buy/Fill without touching the price, **50 purchasable Pods**
appeared. Switching to another wallet produced **zero cancellation buttons**. Returning
to the owner exposed the confirmation in My Activity. Wallet rejection left the listing
unchanged, the dialog retryable, and the child head unchanged.

Two create/cancel passes were executed; the second used the final event-checking code:

| Operation | Block | Gas | Transaction |
| --- | ---: | ---: | --- |
| First create | 53179869 | 615,265 | `0x6c64ea5d8ce552a4d9bf267f92b7602862151823a137ce0b9d6345e6dd9e5eb5` |
| First cancellation | 53179870 | 484,571 | `0x9341249c4908d7441e38871eec3a708242f91759e01c1344207777481d5b0be6` |
| Final-code recreate | 53179871 | 615,265 | `0xf0801986a119800c275fa356c43ce68d9686f2c42d65c2e40df0a70ab6ef4f0d` |
| Final-code cancellation | 53179872 | 484,571 | `0x6cb200fd468ff1733e2b20f7b2ae55b226e734378dc30ee26ad89faa92d155ac` |

The final cancellation called `cancelPodListing(0, 17861597363077)` directly. Receipt status
was successful, the listing hash became zero, and the owner retained all 50 Pods and exactly
848.940162 external Pinto. My Activity changed to CANCELLED without reloading. Buy/Fill
settled to zero purchasable Pods after its refetch. Cached inventory can briefly appear
while refetching; this is not a claim of synchronous or outage-proof subgraph consistency.
All gas numbers are isolated-fork gas, not current Base dollar costs.

Evidence: `/tmp/pinto-market-fixes-qa.AX4BFn/` — `default-price-includes-50-pods.png`,
`cancel-confirmation.png`, `final-rejection.png`, `final-cancelled-history.png`, and
`cancelled-empty-inventory.png`. Intermediate screenshots whose names imply cancellation
can still show the stale ACTIVE row; the named **final** screenshots are the settled evidence.

### QA provider recovery and validation

Anvil retained historical storage but lost the Field facet's bytecode at older event blocks
(first observed at 53179859), causing the first post-cancellation refresh to fail. Latest
onchain reads and cancellation remained valid. The QA-only historical-read helper now:

1. Handles only the explicit missing-bytecode error on Anvil chain 1337.
2. Resolves the historical selector's facet at that same block.
3. Requires the available bytecode's keccak hash to equal the exact missing hash.
4. Retries **eth_call only**, overriding that code alone while retaining the original block
   and historical storage. It never substitutes current state, a fabricated value, or writes
   node code/state. Mismatches and failed retries fail closed.

Only the Vite QA server was restarted to load its middleware change. No Anvil fork was reset
or restarted. This is not a production RPC workaround or live-subgraph test.

Final validation: **190 tests in 22 files passed**; `npm run build` passed;
`git diff --check` passed. Type-checking still reports four existing errors: unsupported
`indeterminate` props in MyListingsTable/MyOrdersTable and optional accounts in
useMyPodListings/useMyPodOrders. No new type errors remain in the touched code. The missing
MarketplacePodListing type export was restored in the now-wired cancellation module.

The autoreview skill checked a byte-matched scoped snapshot with
`--mode local --engine codex --model gpt-6.1-sol --thinking high --no-web-search`, using
`/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex`.
One receipt-replacement finding was accepted and fixed; the final rerun returned **no
actionable findings**. Outputs: `/tmp/pinto-market-fixes-reviewed.txt` and `.json`.
Review inspected source, not executed tests; this is model review, not independent audit.

Final child head is 53179872, hash
`0x0d2e8ca9e8ca06a0de9c38ba2a0f2c0efe7e2674f7852a964fc99c560a164166`.
Protected parents on ports 18564/18565 retain heads 53178793/53178878 and their recorded
hashes. No mainnet transaction, contract deployment, source commit or push occurred.

## Small Send Everything case

Before the two Market fixes, the browser transferred the QA operator's entire remaining
protocol inventory to the publisher: **0.6 Farm-Wallet Pinto plus a 0.1-Pinto Silo deposit**.
Transaction `0xa482e83b820b73a4e77ffeb155c408cb7ae2a627ce2ebf8b6e766debc0adc66b`,
block 53179868, status 1, **942,264 gas**, contained `transferToken` and `transferDeposits`
in one farm. Operator internal Pinto, deposits and Stalk became zero. Publisher internal
Pinto became 3.6 and total deposited Pinto 90.369190, including 1 germinating Pinto.
External balances and LP deposits were unchanged.

A QA deposit-read failure toggle was enabled immediately before submission, but it did not
invalidate already-cached data. The transaction used valid cached inputs and succeeded;
the failures occurred on post-success refresh. This is **not** evidence that failed reads
blocked Send Everything. Restoring reads recovered the zero balance display. The existing
"Transferring..." toast persisted after success; that separate upstream UX issue is not fixed
by the two approved Market changes. Evidence: `/tmp/pinto-ui-send-all-qa.RsOQyK`.

## Direct LP deposits, liquidity routing and two-season maturity — October 28

This continuation used the existing disposable UI child on port **18569**, chain **1337**,
starting at block **53179872**. It did not upgrade or reset that node. In particular, this
is the earlier UI release fixture, **not** the separate newer flow-activation fork on 18580.
The publisher used existing wallet assets; no funding, minting or new contract deployment
was needed. Both protected parent heads/hashes were verified unchanged before and after.

| Browser scenario | Verified result | Receipt gas |
| --- | --- | ---: |
| Approve 0.25 existing PINTOUSDC LP | Exact Diamond allowance; separate approval transaction | 53,939 |
| Reject LP deposit at the QA wallet, then retry | Rejection consumed the toggle but submitted nothing; head stayed at the approval block and 0.25 input remained retryable | None for rejection |
| Deposit 0.25 LP directly | Wallet 1 → 0.75 LP; a new 0.25-LP crate with 0.673091 BDV; ordered index count 127 → 128, complete coverage | 1,332,657 |
| Convert Max in deposit Season 17163 | Exactly 112.680940417570489686 mature LP, excluding the new 0.25 LP | Read-only |
| First real Sunrise → Season 17164 | Crate still germinating; same conversion Max; page updates without reload | 4,456,016 |
| Second real Sunrise → Season 17165 | Crate no longer germinating; balance becomes 112.930940417570489686 LP; existing input stays unchanged until explicit Max | 9,519,256 |
| Approve 1 external-wallet Pinto | Exact Diamond allowance | 46,365 |
| Create and deposit LP using that Pinto | Direct Pinto Exchange route succeeds; 0.370535332975439727 LP / 0.997566 BDV enters a new germinating crate | 2,197,370 |

The first deposit called the unchanged `deposit(address,uint256,uint8)` entry point
directly: **no insertion locator or hint was supplied**. Pool reserves and total LP supply
were unchanged, as expected for depositing existing LP into the Silo. The second deposit
used `advancedFarm` with the direct Well `sync` liquidity route. It consumed exactly 1
external-wallet Pinto, emitted `PintoFeeBurned(2500)` (**0.0025 Pinto**, the configured 0.25%
fee), and increased LP supply by exactly the new deposited amount. The existing 0.75 wallet
LP and Farm-Wallet Pinto were not the input. No live 0x route was exercised.

Pinned reads verified both new nodes' owner, amount, BDV and germination status, and checked
`indexedAmount == depositedAmount` with complete coverage at every sampled block. The first
crate's stem is **42269132827**. The germinating-stem boundary was 42269078988 when deposited,
equalled its stem after one Sunrise, and became 42269186666 after two; equality is correctly
still germinating. The second crate's stem is **42269240508** and is still germinating at
the final head. The page shows all three LP crates, matching the onchain results.

The first Sunrise completed with an unsuccessful Auto Convert child because observations
were invalid. The second Sunrise successfully ran automatic conversion against other
eligible deposits; it left the publisher's tested quarter-LP crate intact. This is not proof
that the fresh crate was automatically selected or that this is a forecast of production
Sunrise behavior. The fixture retains its earlier synthetic-oracle/reward configuration.

Local transaction hashes:

- Existing-LP deposit, block 53179874:
  `0x6688e3fdf4204b37262ffae564f5c16e5702f3e36fa3dab70fb016620f29c223`.
- First Sunrise, block 53179875:
  `0x7150123319a8b9565433f52ef62f7f316eaeda7edff59031001772ce85fd1281`.
- Second Sunrise, block 53179876:
  `0xb21fc9623c0a890064578fd8c8d5176c8e8f6309ac480df39ca89e0091f7b6bc`.
- Pinto-to-LP deposit, block 53179878:
  `0x627164f698be51c8376e9104f72377cf7a9cdd9f39499fe81acf2c123acf9cf1`.

Evidence: `/tmp/pinto-ui-lp-deposit.AXGDoK/`, including `pinned-chain-proof.json`, both real
Sunrise reports, and screenshots before/after maturity. `final-crates-clear.png` shows the
mature 0.25-LP crate and newly germinating 0.37-LP crate without the wallet overlay. Earlier
screenshots include partial viewport framing; the final clear screenshot is the presentation
evidence. The pinned proof's assertions passed. A first read-only probe correctly reverted
with `OrderedDepositsUnknownNode` for a pre-insertion node; the final proof explicitly handles
only that expected absence rather than treating arbitrary read failures as zero balances.

Final child head: **53179878**,
`0x954bd6021e5ffda5345f81ca074bdc842acf011e9bbd62ef07ca052a03e48bed`.
Parent 18564 remains 53178793 / `0xb00c10034c9c47037863344ae895cf439d6ad230f503d9e8302ce2ca63f89502`;
parent 18565 remains 53178878 / `0xc7d358f1fdd81bab446be422349a4e2898a4ce66a7e0d548fc916cfa40452e7a`.
Only QA evidence/documentation changed in the interface checkout during this continuation.
No mainnet writes, deployment, production source fix, source commit or push occurred.
Earlier automated-suite/build/typecheck results are not represented as rerun here.

## Tractor stale inventory, restore and execution — October 28

This pass used only child port 18569 and the existing release helpers. The new
order was created/modified, simulated and executed through the browser. Temporary
funding removal/restoration used genuine `transferDeposit` transactions between
the two disposable QA accounts, not storage edits. No production source was
changed in this pass; the upstream findings below await separate approval.

### New order and form findings

The publisher selected only PINTOWSTETH (source index 6), total/minimum/maximum
1 Pinto, a 0.2-Pinto operator tip, 0.1 minimum Stalk bonus, $0.001–$0.999 price
bounds, and 0.1% slippage. The UI labels the order amount "PDV", but the signed
`totalBeanAmountToConvert` and completion counter use six-decimal Pinto amounts;
the actual historical BDV moved below is a different quantity.

- Initial publication, block 53179879, transaction
  `0xc54830168806a14b4f4907fb87378d02187e794edeef9a6594028667d9bc2606`,
  used 1,813,116 gas. Order hash:
  `0x456e03a30eb952872ccc5491712efae2448689cae244302102847912f6326ffe`.
  The seed-difference toggle was OFF, but the signed value was **1**, not zero.
  A full read-only Tractor call rejected this with
  `Convert Up Blueprint: Invalid Seed difference.` The helper defines zero as
  no seed check. `convertUp.schema.ts` substitutes `MICRO_SEED` when the toggle
  is off; this behavior also exists in upstream HEAD.
- Opening Modify loaded the original **0.1%** slippage as **0.001%**. The edit
  context hydrates the decimal ratio directly into a percentage form, whose
  serializer divides by 100 again. This is also upstream behavior. The test
  manually restored 0.1%, enabled the seed check and explicitly entered zero.
  Neither production bug was patched to make this test pass.
- Browser Modify atomically canceled the initial order and published replacement
  `0x31653115a9c6b37b788e1402785810e2ec7e9460d9e8bae13a418748290b9feb`
  in transaction
  `0x8783cec4ab9cad71f060c9656597d7d573fa1dc5720f4a63050aeb9b88d3de7f`,
  block 53179880, 485,937 gas. Decoded calldata confirms seed difference zero,
  unchanged price bounds, and slippage ratio `1000000000000000` (0.1%).

Publication also performed the existing preparatory crate combination for Pinto
and mature USDC LP. This explains why the separate quarter-LP node from the
previous section no longer exists at the latest block; that earlier maturity
evidence remains pinned to its original blocks. The wstETH funding crate was
unchanged by publication.

### Stale funding and recovery matrix

| Browser / fixture step | Verified result | Gas |
| --- | --- | ---: |
| Browser simulation with funding | Execute enabled; estimated 6,820,669 gas, negative estimated profit before L1 fees | Read-only |
| Transfer the entire funding crate to QA operator | Publisher has no wstETH deposits; signed order remains open | 1,023,745 |
| Click cached Execute | Transaction reverts `No beans available`; zero logs, nonce and token/deposit state unchanged | 2,487,355 |
| Resimulate All without funding | Row shows Reverted and `No beans available`; no additional transaction | Read-only |
| Transfer funding back to publisher | Original amount, stem and BDV restored | 904,141 |
| Resimulate the same signature | Execute enabled; estimated 6,806,632 gas | Read-only |
| Browser Execute | Status 1; converts 1 Pinto, pays 0.2 Pinto, completes order | 6,445,338 |
| Publisher history and active orderbook | 1/1, 100%, one execution, 0.2 tips; active row removed without reload | Read-only |
| Replay after its one-second minimum interval | `Order has already been completed`; nonce stays 1 | Read-only |

The temporary funding crate was stem `48972950850`, amount
`0.019446554497880579` LP and 11.233205 historical BDV. Outbound transfer:
`0xaaa7bd1a5620ad099112f8dc22c29722dcfa701e5a01ae827c1f6151e55ec33a`
(block 53179881). Restoration:
`0xc19fd960d7600d8645715b90ebaaf605aa7b2ae69cbd55b1fdcd2f952d0c020c`
(block 53179883).

The reverted browser transaction was
`0x21e2ea190c03ab022afd7ab544ef504ec9dccd4f39f5ab401b2f63bf26321d49`
(block 53179882, status 0). Historical calls at blocks 53179881/82 compared both
accounts' Pinto/wstETH external balances, internal balances and complete deposit
arrays, plus the blueprint nonce: all matched. Native gas was spent, but no tip,
deposit mutation or order progress survived. The call trace confirms the same
`No beans available` revert, not an out-of-gas failure.

The successful browser transaction was
`0xe7e7b94a62f90291f1081130d82bcb1453f9a11d1cab1dfb963281643b738a9b`
(block 53179884). Receipt and state reconciliation:

- Main conversion: `0.001739624889126107` LP / 1.004886 historical BDV becomes
  **1 Pinto**, deposited at stem `43822440621` with preserved 1.004886 BDV.
- Tip funding: a separate `0.000347894891292245` LP / 0.200960 BDV withdrawal
  produces the **0.2-Pinto** tip. The operator's Farm Wallet increases from zero
  to 0.2 Pinto; publisher Farm Wallet stays at 3.6 Pinto.
- Remaining funding crate: `0.017359034717462227` LP / 10.027359 BDV.
- `ConvertUpOrderComplete` reports 1,000,000 converted, zero unfulfilled; nonce
  advances from 0 to 1. The execution history points to this exact transaction.

### Transaction handling findings, still unresolved

The stale Execute request **did broadcast despite a failed fresh estimate**:
the shared `useTransaction.writeWithEstimateGas` catches estimation failure and
falls back to 3,000,000 gas. Contract rollback protects state, not operator gas.
The pre-existing fallback was already noted in the wrapper QA; this pass adds
a concrete Tractor reproduction.

The post-attempt row retained its old gas/profit values and disabled "Resimulate";
the separate "Resimulate All" button recovered it. Do not infer success from
the row style. Approval was requested for a focused Tractor preflight fix, with
regressions. The seed-toggle and edit-slippage fixes are also pending approval.

**Correction from the subsequent ordinary-swap pass:** the initially reported
shared receipt-status bug is **withdrawn**. Although `useTransaction` itself
tests `receipt.isSuccess`, the installed
`@wagmi/core/src/actions/waitForTransactionReceipt.ts` explicitly checks
`receipt.status === 'reverted'` and throws before returning. A real reverted
ordinary swap produced an error toast and retained the input. Thus the proposed
extra receipt-status check is not needed to fix this case. The failed-estimate
fallback and stale row state are still real; they must not be conflated with a
false successful-receipt result. No production fix was made.

Evidence screenshots: `/tmp/pinto-ui-tractor-stale.yKKXB6/`, especially
`baseline-ready.png`, `no-funding-reverted.png`, `orderbook-completed.png` and
`restored-order-completed-history.png`. `modify-slippage-drift.png` records the
edit-form discrepancy. The final child head is 53179885,
`0x7d603f06ce2f530700fd07fe853ffef336ff6b0e4ea714f6f92f6476c12bdbc4`;
the last empty block advances the local timestamp two seconds solely to test
completion rejection beyond the order's one-second interval. Protected parents
18564/18565 retained their prior block numbers and hashes. No deploy, push,
source fix, new build or full UI test-suite rerun is claimed by this pass.

## Ordinary swaps, live-quote expiry and account validation — October 28

Browser testing on the unchanged QA service exercised ordinary wallet/Farm Wallet
swaps against child port 18569. This is separate from the earlier aged-deposit
fee exemptions. No route was substituted in code, no quote was fabricated and
no clock or protected parent was reset. No production code changed.

### Results

| Browser action | Receipt / state result | Gas |
| --- | --- | ---: |
| Approve 1 external Pinto for Diamond spending | Status 1, block 53179886 | 46,365 |
| Sell 1 external Pinto for Farm Wallet USDC using selected Well + 0x route | Status 0; expired 0x signature, all token/reserve changes rolled back | 912,000 |
| Change output to cbETH; selected route is direct Pinto-Exchange | Status 1; exact quoted cbETH credited internally | 1,174,577 |
| Reverse pair, choose internal cbETH and Max, external Pinto output | Exact full internal amount selected; no token approval requested | Read-only |
| Submit selected 0x reverse route | Status 0; expired signature, internal cbETH retained | 619,563 |

Transactions in the same order:

```text
Approval:       0xf2a3dd541ee7b7b6da7f40afe77f0c92724eab8e6941a7b625f39a17a3672dbf
USDC attempt:   0x45ea98e243e25cbf6ff9fea71e69a22f050b6c6fe235502d9e64c6b21940136b
Direct cbETH:   0xff59f016493af8ccb3392a3e13037b3ed459fed8b2079501a8635008a861dff4
Reverse attempt:0x1ce0acb5481a77f5747b3b2c82ef3db8401253ce7d9f1a1a7eae2f0937ea7db8
```

The successful direct trade, block 53179888, spent exactly **1 Pinto** from the
external wallet (567.995110 → 566.995110) and received exactly
**0.000013103449182068 cbETH** in the Farm Wallet, matching the displayed quote.
`PintoFeeBurned(2500)` and the total-supply delta both prove **0.0025 Pinto** was
burned: the ordinary 0.25% fee applies. Publisher internal Pinto stayed at 3.6;
its Pinto and all four supported LP deposit arrays were unchanged. The UI cleared
the successful form and refreshed both wallet balances without a reload.

### 0x boundary: measured limitation, not a successful aggregator test

The first route displayed 0.035274 USDC; the reverse displayed 1.010962 Pinto.
Both reached the 0x AllowanceHolder at
`0x0000000000001ff3684f28c67538d4d072c22734`, then a downstream execution reverted
with selector `0xcd21db4f`, matching `SignatureExpired(uint256)`. The encoded
expiries were **2026-10-28 23:51:30 UTC** and **23:56:15 UTC**. The first attempted
transaction's local timestamp was **2026-11-06 04:00:56 UTC**. The existing
future-dated fixture therefore cannot establish that these live quotes execute.
The trace identifies the expiry failure; it does not prove that every subsequent
call, minimum output or price assumption would succeed on an aligned fork.

Both failed receipts had zero logs. Historical state assertions compared publisher
external/internal balances for Pinto, USDC, cbETH, cbBTC and wstETH and the reserves
of all four supported Wells before/after each failure: all were identical. Only
native gas was spent. The cbETH from the successful direct sale remains available.

The UI displayed `Swap failed. Try increasing slippage.` for the first failure
and retained the input. Increasing slippage does **not** address signature expiry;
the generic error lacks that distinction. This also supplies the real-browser
counterexample to the withdrawn receipt-success finding in the preceding section:
the installed Wagmi action rejects status-0 receipts before the shared hook's
success handler. The confirmed failed-estimate fallback remains a separate issue.

### Account-switch validation: existing shared-input defect

With the reverse quote still entered, switching from the funded publisher to
the QA operator updated cbETH Farm Wallet balance to **zero**, but left **Swap
enabled**. No transaction was submitted. Re-entering the identical amount changed
the button to disabled **Insufficient Funds**. Switching back to the funded
publisher restored the displayed balance but left the insufficient-funds state
stuck; another identical amount edit cleared it.

`Swap.tsx` relies on `inputError` supplied by `ComboInputField`. The input's
balance-change effect only clamps when clamping is enabled, while its error
recalculation follows amount edits rather than every balance change. Swap sets
`disableClamping=true`. These files are unchanged from upstream HEAD. This extends
the previously documented shared stale-validation finding; no fix was silently
included. The form was cleared to zero after testing. QA submitted count remained
four throughout these account switches; child head remained 53179889.

Evidence: `/tmp/pinto-ui-ordinary-swap.F6fk5j/` contains
`selected-route-before.png`, `failed-swap-ui.png`, `direct-sale-success.png`,
`reverse-0x-quote.png`, `zero-balance-account-enabled.png` and
`funded-account-stale-insufficient.png`. `reverse-expired-error.png` was captured
after its toast disappeared and proves retained input, not the error message.
Final child hash:
`0xaef86644253f4bfb47b2a74c62ee01f12d0a611e8565c2c50f75db7caa1c8ccd`.
Protected parent blocks/hashes remained unchanged. No new build, automated-suite
rerun, deployment or push is claimed. A successful ordinary buy and successful
live 0x execution on time/state-aligned upgraded conditions remain unverified.

## Manual CP2 conversion, accounting and account changes — October 28

Two browser-submitted ordinary cbETH-LP→Pinto conversions succeeded on the same
isolated child. These are public Silo `convert` calls, not Auto Convert executions
or the separate Fee-free exit route. Neither transaction supplied an insertion
hint or used a Farm wrapper. The current public conversion path deliberately
uses the fee-paying one-token Well exit (`LibWellConvert`); the fee observed here
is not evidence that automatic conversions lost their exemption.

| Input LP | Pinto deposited | Historical input BDV | Fee burned, Pinto | Receipt gas |
| ---: | ---: | ---: | ---: | ---: |
| 0.01 | 5.504347 | 1.003425 | 0.013796 | 2,642,421 |
| 0.001 | 0.550432 | 0.100343 | 0.001380 | 2,639,000 |

Both receipts have status 1:

```text
53179890: 0xf2862b0c23c18772dd5def01695d89432b73dbd8fce2f4c9951a87707522633b
53179891: 0x126a9489851727c9e9de90321ae24229b9a8742e5252e2605ee41a54ca68fdd5
```

The first attempt was rejected through the QA wallet before the successful
retry; its input remained and no block was mined for the rejection. The prior
browser tab subsequently closed, so this pass verified that first success from
the receipt and reopened UI, **not** an observed live success refresh. The second
smaller conversion explicitly covered live refresh without reloading: input and
destination cleared, the source table updated, and both destination deposits
appeared when navigating to Pinto.

### Accounting assertions

Both conversions partially consumed the publisher's existing LP deposit at stem
`-1942082883`; the newer `22186103930` deposit was unchanged. Across the two calls,
the old deposit changed from 3.695715972300296975 LP / 370.837122 BDV to
3.684715972300296975 LP / 369.733354 BDV. The total LP balance became
4.189987274126349636. The LP index remained complete, its 126-node count stayed
unchanged, and indexed/deposited totals matched after each call, decreasing by
exactly the LP consumed. New Pinto deposits were created at stems `71810845851`
and `71810791012`, respectively; final deposited Pinto totaled **97.423969**.
External and Farm Wallet Pinto balances did not change in either transaction.
The fixture's Pinto ordered index is disabled; this is evidence of LP-index
maintenance and correct output deposit accounting, **not** Pinto-index coverage.

The first call increased active Stalk by 5.5375583644055836, including
0.0000020157600332 of previously unmown source Stalk. The second added
0.5537519263732224. At the unchanged Season's token settings, net Seeds increased
by 43.873101316491 and 4.387288610953. These reconcile with the preview's rounded
5.54 / 0.55 Stalk and 43.87 / 4.39 Seeds. The destination table showed both new
amounts (5.50 / 0.55 Pinto), total 97.42 Pinto, and 776.98 total Pinto Seeds.
Historical BDV, Pinto amounts and current USD value are distinct quantities.

### Stale-account behavior and display limits

With another 0.001 LP→Pinto quote ready, switching to the operator (independently
verified to own no cbETH LP deposits) cleared the conversion form, selected the
Deposit tab and disabled Convert. Switching back restored the publisher's LP
balance without restoring the obsolete quote. No transaction was submitted by
either switch. This path does not reproduce the ordinary Swap input-validation
defect documented above; it is not a test of a real wallet change while its
confirmation modal is open.

The direct conversion preview still displayed **USD estimate unavailable**,
post-conversion price **Unavailable**, and no numeric price impact. The output,
Stalk and Seeds quote remained usable and reconciled with execution; the missing
USD/impact estimates remain explicit coverage gaps, not fabricated zero values.
No production source change was made to hide or repair them in this pass.

Screenshots in `/tmp/pinto-ui-cp2-convert.ecHXwH/` include `second-quote.png`,
`second-success-refresh.png`, `pinto-output-deposits.png` and
`empty-account-clears-convert.png`. Final child head: 53179891,
`0x405738ffcfb56441953ed3dee3fc4d98619608911116d05a1b8f2ef5fda9b8bb`.
Both protected parent heads/hashes remain unchanged. No mainnet broadcast,
deployment, push or fresh full UI automated-suite/build run is claimed here.

## LP-to-LP quote failure and recovered-input mismatch — October 28

This pass tested the browser's 0.001 cbETH LP→cbBTC LP route, then injected a
deposit-read failure into a previously healthy direct LP→Pinto form. Only the
existing disposable child was used; neither protected parent changed. No
production source was edited. The earlier pass established normal successful
conversions; it did **not** establish safe recovery from this fault sequence.

### LP-to-LP remains blocked by the fixture clock

The selected `pipelineConvert` simulation failed before wallet submission. A
read-only `debug_traceCall` replay of the exact browser-logged `advancedFarm`
calldata reached 0x AllowanceHolder and its downstream settlement, returning
`0xcd21db4f` (`SignatureExpired(uint256)`). The encoded expiration was
**2026-10-29 00:15:51 UTC**, versus the unchanged child timestamp
**2026-11-06 04:18:24 UTC**. No transaction was sent for this route.

Both Wells are below peg. The current strategizer consequently chooses the
equal-proportion LP-to-LP route, including an external pair-token swap; the
Pinto-only strategy is conditional on the source/target imbalance directions
(or an explicitly aggregator-disabled token). This is not evidence that the
optional-route isolation discarded a healthy direct alternative. No route or
quote was fabricated to force a passing result.

The input remained, with no output and Convert disabled. The quote-error hook
contains a generic slippage suggestion; this does not diagnose signature expiry,
and the form has no persistent explanation after the toast disappears. Successful
LP-to-LP execution remains unverified. Approval was requested for a **separate,
current-time, locally upgraded QA fork**, preserving all existing forks; no new
fork or local deployment was performed while that decision was pending.

### Confirmed input/transaction mismatch after RPC recovery

1. With a valid 0.001 cbETH LP→Pinto quote, enable **Fail deposit RPC reads**.
2. After actual failed requests/retries, Convert and the input become disabled.
   The last-known 4.19 LP ownership is preserved. The UI incorrectly describes
   all 4.189987274126349636 LP as unavailable **following Auto Convert**, although
   this is an RPC failure, not a lock.
3. Restore reads. Availability recovers, but the displayed input becomes **0**;
   the previous **0.55 Pinto** output reappears and Convert becomes enabled.
4. Click Convert on the disposable fork. It actually spends the prior **0.001 LP**,
   not the displayed zero, and deposits **0.550432 Pinto**.

Concrete receipt: block **53179892**, status 1, gas **2,583,853**, transaction
`0x33e2cd139993ee29fcac4104bc377e0da14ccd0311e8b1f7168ee488c058b5ed`.
Decoded top-level `convert` arguments include stem `-1942082883` and amount
`1000000000000000` (18-decimal LP). `RemoveDeposits` and `Convert` confirm the
same input; `AddDeposit` records 550432 Pinto atoms at stem `71810791012`.
The successful call then clears the form. All of this is local test state,
not an unauthorized real-funds transaction.

The shared `ComboInputField` balance-clamping effect changes `internalAmount`
and `displayValue`, but only user-input changes propagate through its debounced
parent `setAmount` callback. A programmatic clamp can therefore leave the parent
Convert amount/quote at 0.001 while the visible field is 0. The unchanged upstream
component has this behavior; the port's fail-closed availability exposes it during
RPC recovery. The submit handler uses the selected quote's crate amounts. This
is a verified UI correctness/safety issue, not a contract accounting discrepancy.

Approval was requested for a shared amount-synchronization fix with regressions
and an explicit distinction between RPC-unavailable deposits and actual locks.
Neither fix is included yet. The successful normal-form tests and green unit
suite must not be used to dismiss this browser reproduction.

Evidence: `/tmp/pinto-ui-lp-route-fault.ptr90s/lp-route-no-quote.png`,
`deposit-read-failure.png`, and `recovered-zero-with-old-quote.png`.
Fault injection was restored to off; the failure count ended at 8. Only the
intentional reproduction submitted a transaction (QA session count 1→2).
Child final hash:
`0xbc50482424b4c1ef04651db32e1d12056a0aee03c2f283ce7bf8c66cab8b7c25`.

### Withdrawal control: the mismatch is not universal

A subsequent no-send control used ordinary cbETH-LP withdrawal of **0.001 LP**.
Actual deposit-read failures disabled the input and changed the action to
**Insufficient Balance**, while keeping **0.001** visible. Restoring successful
reads re-enabled Withdraw with that same amount; it did **not** reproduce the
Convert form's displayed-zero mismatch. `Withdraw.tsx` already disables automatic
input clamping and computes insufficiency from its parent amount, following the
earlier Sunrise regression fix. The incorrect Auto Convert-lock explanation does
still appear during the outage.

Screenshots in the same evidence directory: `withdraw-fault-preserves-request.png`
and `withdraw-read-restored.png`. The form was then explicitly cleared to 0 and
Withdraw became disabled. Fault injection is off (20 cumulative failed reads),
QA submitted count stayed 2, and the chain head did not change. This is a positive
control for this withdrawal path, not proof every `ComboInputField` consumer is safe.

### Refreshed automated verification

- `node_modules/.bin/vitest run`: **190 tests / 22 files passed**.
- `node_modules/.bin/vite build`: passed, with dependency annotation and large
  bundle warnings; not a clean-warning claim.
- `node_modules/.bin/tsc --noEmit`: failed with the same **four existing Pod Market
  errors**: unsupported `indeterminate` Checkbox props in `MyListingsTable.tsx`
  and `MyOrdersTable.tsx`, plus optional-account arguments in `useMyPodListings.ts`
  and `useMyPodOrders.ts`. Those files remain unchanged from this branch's HEAD.

These commands do not cover the newly reproduced recovered-input bug or establish
successful live 0x routing. No commit, push, deployment or production fix occurred.

## Outstanding release coverage

**Historical list, superseded by the October 29/30 checkpoints at the top.**
In particular eligible-referral payout, seed-toggle/edit-slippage handling,
failed-estimate sending, receipt/cache refresh, and Market TypeScript issues
were subsequently addressed and verified as recorded there. The bullets below
retain the original investigation context; they are not all current blockers.

- Successful referral creation/execution and a fee-exempt Sow route. Missing
  referral configuration now has browser rejection evidence, with the form and
  error-display issues above still unresolved. Plain Pinto-source Sow,
  USDC-LP-source Sow and Convert Up have executed with separate publishers and operators.
- Broader empty/stale selections and failures outside the fee-exit form, plus
  real connector network/account changes while a wallet confirmation is open.
  Rendered fee-exit RPC failures, mid-preparation account/network changes and
  empty LP selections were exercised above. Ordinary withdrawal read failures
  also fail closed. The approved continuation fixes fabricated lock presentation;
  empty-balance wording on some individual actions can still be improved.
  External Sunrise and exact output-lock expiry were exercised previously.
  Tractor inventory removal/restoration now has browser execution and atomic
  rollback evidence, but the seed-toggle, edit-slippage and failed-estimate
  sending defects above remain unresolved. The receipt-status finding was
  withdrawn after checking the installed Wagmi action and a real reverted swap.
- Additional transfer/wrapper routes and fixes for the verified Max, balance-label
  and stale-validation defects. Germinating Silo wrapping, active-lock exclusion,
  exact expiry and a Farm-Wallet-to-recipient transfer are now exercised above.
  An ordinary deposit transfer, direct Silo wrap/unwrap and wallet-funded
  wrap/redemption round trips are also verified, with unresolved display/preflight
  findings. Successful Harvest and its new germinating deposit are now verified
  above. Pod Market listing creation, partial/full fills and owner cancellation, buy-order
  creation, partial/full order fills and order cancellation are now verified above.
  Default listing price and missing owner cancellation are fixed; other documented
  selection/filtering/cache defects and coarse activity-value rounding remain open.
  The no-harvestable-input Field state is verified above.
- Broader live 0x routing, real connector/Privy login and mobile layouts.
  The approved continuation now establishes successful real 0x swap and LP-to-LP
  paths on a time-aligned fork, not every asset pair or market-maker route.
  Ordinary direct Pinto→cbETH sale now has exact fee/balance/receipt evidence;
  two selected 0x routes demonstrably hit expired signatures on the future-dated
  child. The shared stale-validation and recovered-zero-input defects are fixed
  in the approved continuation, with mounted regressions and browser recovery
  evidence. Older expired-signature and mismatch examples above remain historical
  reproduction evidence, not the current acceptance status.
- API-indexed historical Tractor orders across the helper cutover. The local
  chain-only fixture deliberately does not validate production API reconciliation.
  The existing Sow operator screen can list completed published orders; simulation
  and contract checks remain necessary. Its full filtering/UX is not signed off.
- External chart/subgraph availability and fork-history presentation. Several
  historical chart requests fail locally; not all data displays are verified.

This is a functional port and an expanding QA record, **not production sign-off**.
