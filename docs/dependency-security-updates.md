# Dependency security maintenance — 2026-10-30

This update addresses registry advisories in the interface's browser, build, test,
and code-generation dependencies. It is not an exhaustive application or protocol
security audit. Source review of dependency consumers did not establish a working
production exploit; that does not make the remaining advisory matches harmless.

## Audit result

Run with the checked-in Yarn release:

```sh
node .yarn/releases/yarn-4.5.0.cjs npm audit --all --recursive --json
```

| Registry severity | Before | After |
| --- | ---: | ---: |
| Critical | 6 | 0 |
| High | 70 | 5 |
| Moderate | 62 | 6 |
| Low | 10 | 1 |
| Total | 148 | 12 |

Counts are Yarn advisory/version matches with numeric advisory IDs; deprecation
notices are excluded. They include development dependencies and are not counts of
independently confirmed application vulnerabilities. Registry results can change.

## Included updates

- Vite 6.4.5, Vitest 4.1.12, and React plugin 4.7.0 replace vulnerable build/test
  versions. Vitest uses the same patched Vite 6 release through a scoped resolution.
- Lodash 4.18.1, PostCSS 8.5.32, and React Router DOM 6.30.6 update direct consumers.
  Router 6 still has two advisories; see the migration recommendations below.
- Compatible lockfile refreshes update affected transitive dependencies, including
  archive, process, cryptographic, HTTP, and parsing helpers. GraphQL schema and
  merge helpers are refreshed together to preserve codegen compatibility.
- Remove unused `@netlify/functions`, `@privy-io/wagmi`, and
  `@privy-io/wagmi-connector`. The site publishes static assets and uses its own
  Privy connector; no imports or configured handlers use these packages.

The additional resolutions address parent-package pins without replacing unrelated
major versions throughout the tree:

| Resolution | Reason |
| --- | --- |
| `brace-expansion` 2.1.7 | Raise the existing resolution to a patched version. |
| `node-gyp` 11.5.0 | Replace Yarn's injected old native build helper and its vulnerable tar dependency; retain Node 20 compatibility. |
| `@graphql-codegen/plugin-helpers/lodash` | Parent's tilde range otherwise retains vulnerable Lodash. |
| `@ardatan/relay-compiler/immutable` | Patch the existing Immutable 3 consumer. |
| `styled-components/postcss` | Replace the parent's exact vulnerable PostCSS pin. |
| `@tailwindcss/typography/postcss-selector-parser` | Replace the parent's exact vulnerable parser pin. |
| `viem/ws`, `engine.io-client/ws` | Patch pinned WebSocket 8 consumers while preserving WebSocket 7 consumers. |

Revisit these resolutions when upgrading the parent packages; remove them when
normal upstream ranges resolve to supported patched versions.

## Recommended follow-up upgrades

1. **Wallet dependencies:** upgrade Privy, wagmi/connectors, WalletConnect/Reown,
   and their compatible viem/ox versions together. Current candidates include
   Privy 3.51.0 and wagmi 3.7.9; this requires wallet-flow regression testing.
   Remaining matches include
   [decode-uri-component denial of service](https://github.com/advisories/GHSA-qr28-fpjm-wq7f),
   [uuid buffer bounds](https://github.com/advisories/GHSA-w5hq-g745-h8pq), and
   [Zod collection validation](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
   Update `@wagmi/cli` alongside its Zod consumer. Do not force Zod 4 or a new
   uuid major into packages expecting older APIs.
2. **GraphQL codegen:** migrate the CLI and client preset together (current
   candidates: CLI 7.4.6 and client preset 6.2.3), then verify generated output.
   The existing CLI retains `@graphql-tools/utils` 10.11.0 with
   [mergeDeep](https://github.com/advisories/GHSA-7mx3-vvmw-hjmv) and
   [mergeIncrementalResult](https://github.com/advisories/GHSA-c4qx-w738-7hr3)
   prototype-pollution advisories. Its interactive editor chain also retains
   [tmp path traversal](https://github.com/advisories/GHSA-ph9p-34f9-6g65).
   These are developer/CI tooling paths; a production-browser exploit was not established.
3. **React Router 7.18 or later:** plan a routing migration for the remaining
   [backslash redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) and
   [SSR hydration](https://github.com/advisories/GHSA-337j-9hxr-rhxg) advisories.
   This application uses BrowserRouter, not SSR; reviewed navigation did not
   establish an attacker-controlled redirect path.

Two MetaMask advisory matches reference the historical
[debug 4.4.2 incident](https://github.com/advisories/GHSA-qj3p-xc97-xw74).
The resulting lockfile selects debug 4.3.6, 4.4.1, and 4.4.3, not 4.4.2. Those
package-level matches alone are not evidence that this checkout contains the
malicious release. Keep the wallet-stack upgrade on the follow-up list.

## Validation and limits

- Immutable Yarn installation, all 108 tests, and the production build pass.
- A minimal offline GraphQL schema/query generates successfully. Live generation
  succeeds for the Pinto and Exchange schemas. The cache endpoint returns an
  internal-server error and the pintostalk endpoint returns an indexing error on
  both the baseline and updated tree, so full generation cannot currently pass.
- TypeScript reports the same 15 pre-existing diagnostics as the baseline.
- Local browser smoke testing covers loading Silo data and rendering the wallet
  selection dialog. No wallet signing, authenticated flows, or transactions were tested.
- The main checkout and the separate Silo-value fix are outside this change.

The follow-up versions are migration candidates, not versions validated by this
PR. Re-audit after each parent upgrade and test actual wallet/codegen behavior
before removing overrides or treating an advisory as resolved.
