# Validation

## Repeatable checks

```sh
npm ci
npm run check
npm run build
```

`check` verifies Prettier, ESLint, TypeScript and Node behavioral tests. Optical tests cover a reference result, infinite far limits, aperture/focal-length behavior and every preset. Tests run directly against the TypeScript calculation module using Node 22's type stripping; no extra test framework is required.

CI runs these checks on pull requests and pushes to `main`, then builds production assets. It does not currently run browser automation, screenshot comparisons or an accessibility scanner. Record manual outcomes separately rather than treating a green build as browser verification.

## Manual browser checks

1. Open a production preview, check both WebGL canvases and inspect the console for errors.
2. Try focus/aperture/focal-length extremes and all three presets; verify displayed values and preview changes. Landscape should show an infinite far limit.
3. Switch viewpoints; orbit/zoom; toggle rays and plane; assemble/explode; adjust separation; reset. Separation should affect the diagram only.
4. Click viewfinder objects to focus. Capture a PNG and open the downloaded image.
5. Navigate with Tab/Shift+Tab, adjust sliders with arrows, open help, verify Tab stays in the dialog, dismiss with Escape and verify focus returns.
6. Test narrow (390 px) and desktop viewports, 200% zoom and reduced-motion preferences. Check wrapping, horizontal overflow and visible focus.
7. Disable WebGL and reload: verify fallback text and working numeric controls. Block Google Fonts and verify readable fallback typography.
8. Inspect the built document's title, description, canonical URL, Open Graph/Twitter image and image URL. Fetch `robots.txt` and `sitemap.xml` from the deployed site.

For Pages preview:

```sh
VITE_BASE_PATH=/focal/ npm run build
npm run preview
```

Open `/focal/` on the preview server. Record browser/version, viewport, commit and any known limitations when sharing verification results.

## Recorded local verification

On 2026-10-04, Node 22.22.0 completed formatting, lint, type checking, six optical tests and a production build with `/focal/` as the base path. A Chromium production-preview smoke check verified both canvas elements, canonical/home URLs, the Landscape preset's infinite far limit, help dismissal with focus restoration, PNG download and no horizontal overflow at 390 px. No page errors or HTTP error responses were observed during that check.

The README screenshot was captured from that production preview at 1440 px wide. This smoke check does not constitute cross-browser, screen reader or full WCAG testing.
