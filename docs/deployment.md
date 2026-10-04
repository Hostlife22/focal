# Deployment and SEO

## GitHub Pages

Production URL: https://hostlife22.github.io/focal/

`.github/workflows/ci.yml` checks pull requests and pushes to `main`. `.github/workflows/pages.yml` listens for successful CI runs originating from a push to this repository's `main` branch. It checks out the successful run's exact SHA, builds with the repository base path and publishes `dist/` with the official Pages actions. Failed checks and pull requests do not deploy.

Pages must use **GitHub Actions** as its build source. The `github-pages` environment holds the deployment URL. A manual CI run on `main` is available to check code, but only successful push-triggered CI runs publish. Use a new push or rerun its CI to retry a deployment.

The workflows follow the official [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact) and [deploy-pages](https://github.com/actions/deploy-pages) interfaces.

## URL configuration

Vite reads `VITE_BASE_PATH` and defaults to `/` locally. Pages sets `/focal/`; application home links and bundled asset URLs honor that base. No client-side routing is used.

The canonical production URL is deliberately explicit in `index.html`, `public/robots.txt` and `public/sitemap.xml`. If the repository name, account or domain changes, update all three, the Open Graph/Twitter image URLs, the Pages workflow base path, README links and GitHub homepage together. Local previews retain the production canonical URL to avoid duplicate indexing.

## Metadata

`index.html` includes a descriptive title, description, canonical link, robots directive, theme color, Open Graph and Twitter card metadata. The social preview is a committed 1200 × 630 PNG at `public/social-preview.png`. Its editable vector source is `public/social-preview.svg`; it requires no runtime image service. The root page is the only sitemap entry.

GitHub serves `robots.txt` at this project's subpath. Crawlers normally request a robots file from the origin root, so this project's file alone cannot control indexing of the whole `hostlife22.github.io` domain. Meta robots and the canonical link apply to the actual page. Social crawlers can read the static head without executing React; the interactive body still requires JavaScript.
