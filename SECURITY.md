# Security policy

## Supported version

Security fixes target the latest code on `main` and its current GitHub Pages deployment. Historical commits and the earlier ESLint installer are not maintained release lines.

## Report a vulnerability

Use [GitHub's private vulnerability reporting form](https://github.com/Hostlife22/focal/security/advisories/new). Include reproduction steps, affected commit or URL, impact and a minimal proof of concept. Do not disclose exploit details or secrets in a public issue. If the form is unavailable, contact the maintainer privately at sima.serafim2021@mail.ru.

Reports are reviewed as maintainer availability permits; there is no guaranteed response SLA or bounty program. Fixes and disclosure timing are coordinated privately with the reporter.

## Application and privacy boundaries

Focal is a static browser application. It has no project-owned backend, authentication, analytics, cookies or application storage. Lens settings stay in React memory and reset on reload. PNG capture is a browser download, not an upload.

Google Fonts requests go to Google and expose ordinary request metadata to that provider. System fonts are used when requests fail. GitHub Pages serves the application and may process access logs under its own policies. These external services have separate privacy policies.

The app requires browser WebGL for rendering. No user-provided HTML, scripts, models or textures are loaded by the application. Dependencies still require maintenance; this policy is not evidence of a security audit.

## Maintainer practices

Use `npm ci` with the lockfile. Review dependency and workflow changes before merging. Never put credentials into `VITE_*` variables: Vite embeds client environment values in public build assets. CI receives read-only repository permissions; only the trusted Pages deployment job receives deployment permissions. Pull request code is never executed by the privileged deployment workflow.

Inspect `npm audit` findings in context rather than applying unreviewed breaking upgrades. Report ordinary rendering bugs through Issues.
