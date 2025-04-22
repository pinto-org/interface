# Contributing to Pinto

- If your PR is still under development, open it as a draft and prefix your PR title with [WIP]:
- Ensure all checks pass before requesting a PR review.
- Clearly summarize the purpose of your PR. Include screenshots or videos whenever applicable.

## Setup

```shell
yarn
yarn generate
yarn dev
```

Refer to the [README](/README.md) for more details regarding setup.

Don't forget to setup your IDE with `biome` for formatting and linting.

## Project structure

- **classes**: Generic classes used throughout the application (e.g., number handling, clipboard utilities).
- **components**: Generic components shared across pages.
- **constants**: Contains constants, configuration values, and ABIs.
- **encoders**: Functions for encoding contract function data.
- **hooks**: Reusable hooks for common functionalities.
- **lib**: Specialized classes related to specific actions (e.g., swaps, conversions).
- **pages**: Individual page components and their associated non-generic components.
- **state**: State management via Wagmi and Jotai hooks.
- **utils**: General-purpose utility functions.

## Tests

Run tests with `yarn test`.

## Issue reports

When submitting an issue, please follow these guidelines to ensure clarity and efficiency:

1. **Search existing issues:** Use the GitHub issue search to verify whether your issue has already been reported.

2. **Verify against the latest version:** Confirm the issue persists in the latest main or active development branch.

3. **Clearly identify the issue:** Simplify and isolate the issue to determine the specific conditions causing it.

4. **Add attachments:** Attach relevant screenshots or screen recordings to illustrate the issue clearly.

A thorough bug report minimizes the need for follow-up questions. Please include detailed information such as your environment details, precise reproduction steps, affected browsers and operating systems, and the expected outcome.

Use the following template for reporting issues:

Template:

```
**Issue Summary:**

**Steps to reproduce:**
1.
2.
3.

**Expected result:**
```

A good bug report shouldn't leave others needing to chase you up for more.

If you run into issues not covered here, or have questions about contributing, feel free to ask in our [#frontend](https://discord.com/channels/1308123512216748105/1348517965997412374) channel on Discord. We're happy to help troubleshoot, clarify edge cases, review PRs, and answer any questions!
