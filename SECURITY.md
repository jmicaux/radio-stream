# Security Policy

## Supported versions

Only the latest release (**0.3**) receives security fixes.

| Version | Supported |
| ------- | --------- |
| 0.3     | ✅        |
| < 0.3   | ❌        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately via GitHub's
[private vulnerability reporting](https://github.com/jmicaux/radio-stream/security/advisories/new)
— on the repository, go to **Security → Advisories → Report a vulnerability**. This keeps the
report private and notifies the maintainer directly (no public issue).

Include:
- a description of the issue and its impact,
- steps to reproduce (or a proof of concept),
- the affected version and browser.

You can expect an acknowledgement within a few days. Once a fix is available, a new
release will be published and the advisory disclosed.

## Scope

This extension plays public live audio streams and stores usage counts locally
(`storage.local`). It uses no third-party credentials and collects no personal data.
Reports about the radio stream providers themselves are out of scope.
