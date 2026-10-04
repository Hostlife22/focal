# Contributing to Focal

Read the [README](README.md) and [architecture](docs/architecture.md) before changing behavior. Bug reports and focused pull requests are welcome.

## Development

Use the Node version in `.nvmrc`, run `npm ci`, then `npm run dev`. Create a branch from `main`. Keep changes focused and explain the user-visible result, the reason for the change and how it was checked.

Before submitting:

```sh
npm run format
npm run check
npm run build
```

For UI or WebGL changes, also complete the relevant [manual checks](docs/validation.md), including a narrow viewport and keyboard use. Include before/after screenshots when changing appearance. CI does not replace browser verification.

## Code style

Prettier controls indentation, quotes and wrapping: two spaces, single quotes, semicolons and trailing commas. Keep imports first, one blank line, interfaces/types when present, one blank line, then implementation. Separate adjacent functions and components with one blank line. Use named props interfaces and `import type` for type-only dependencies.

Keep optical calculations in `src/lib/optics.ts`, renderer lifecycle in `src/scenes/`, shared resource cleanup in `src/lib/scene.ts` and application transitions in `src/state/labReducer.ts`. Keep `App.tsx` focused on page composition. Reuse CSS variables and existing components. Dispose GPU resources, cancel animation frames and remove listeners on unmount; React StrictMode deliberately exercises cleanup during development.

Do not weaken TypeScript or ESLint to hide a problem. Add behavioral tests for optical calculation changes. Document any changes to units, model assumptions, deployment URLs or accessibility behavior.

## Reports and pull requests

Use [GitHub Issues](https://github.com/Hostlife22/focal/issues) for ordinary bugs and accessibility problems. Include browser/OS, viewport, steps, expected behavior and observed behavior; include console errors when relevant. Use [SECURITY.md](SECURITY.md) for vulnerabilities.

PRs should include a short description, validation results and any remaining limitations. Contributions are distributed under the repository's [MIT license](LICENSE).
