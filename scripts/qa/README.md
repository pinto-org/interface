# Auto Convert UI fork testing

This worktree ports the Auto Convert interface changes onto `pinto-org/main`
at `60f611d5bd5b6b700fa0122277c7c4e7247d0524`. The branch is
`codex/current-ui-auto-convert`. The older `codex/group-convert-ui` checkout is
preserved separately. Nothing has been pushed or deployed to Base.

Current main already contains Tractor order creation and 0x v2 AllowanceHolder
routing. This port uses those implementations instead of transplanting the
obsolete interface's transaction stack.

## Post-commit continuation — October 29, 2026

**QA is still incomplete.** The local checkpoints are protocol `c0f9a4e` and
interface `d43d6581`, authored/committed as `fordpintomoney`; neither was pushed.
Unrelated approved Pod Market changes remain outside the interface checkpoint.
This continuation changes no production source or contract, sends no transaction,
and does not replace either protected fork.

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

All **65 preserved core deployment hashes** still match their original manifest,
and there are no missing linked deployments in the current comparison. The
protocol checkpoint now includes invariant caching added after the browser
release was created. Its `LibAutoConvertCurve` and `LibAutoConvertStable2Policy`
executable runtimes differ from this fork. Other changed runtimes in the report
differ only in Solidity metadata. Thus the earlier exact-current-artifact claim
below is historical: this is still a valid preserved release fixture, **not**
an execution rehearsal of the newly committed cache optimization. No silent
upgrade, reset, or substitution was made to obtain a passing comparison.

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
