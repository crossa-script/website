# Crossa Website

The official client-rendered Crossa website and documentation portal. It explains the current Crossa V0 compiler/runtime, documents the `.cra` language and Android/iOS artifacts, and presents traceable development benchmark snapshots.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS 4 with the Vite plugin
- React Router Data Mode
- Motion and Lucide React
- Local Markdown rendering with GFM

## Requirements

- Node.js 20.10+
- pnpm 11+

The project deliberately uses Vite 6.4 because this repository's validated Node runtime is 20.10. Vite 8 requires a newer Node runtime.

## Develop

```bash
pnpm install
pnpm dev
```

## Validate and build

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

Production files are emitted to `dist/`.

## Architecture

Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing routing, content, design tokens, dependencies, animation, or deployment. [AGENTS.md](AGENTS.md) contains the repository working rules.

```text
src/
  app/                 router and route metadata
  components/          shared brand, layout, and UI primitives
  content/             documentation catalog and benchmark snapshots
  features/            command search, code preview, architecture, benchmarks
  routes/              lazy route modules
  styles/              semantic tokens and responsive styles
```

## Content workflow

`src/content/docs/catalog.ts` is the single documentation registry. It supplies document metadata, routes, sidebar sections, search content, breadcrumbs, source traceability, and previous/next navigation. Each entry records the Crossa source repository, source paths, and verified core commit.

Long-form content is trusted local Markdown held in the typed catalog and rendered with GFM. Do not enable arbitrary HTML or introduce unverified Crossa claims.

Benchmark snapshots live in `src/content/benchmarks/`. They are copied from the Android and iOS example repositories and normalized by `BenchmarkRepository.ts`. Keep the raw snapshot alongside any updated presentation data; do not manually retype measured values.

## Add a route or document

1. Add a typed entry to `documentationCatalog` for documentation, including source paths and verified commit.
2. Add a route module only for a new non-document route family.
3. Keep large features route-loaded or interaction-loaded.
4. Run typecheck, lint, and production build.

## Static deployment

This is a client-side React application with build-time SEO snapshots for every public and documentation route. Serve `dist/` through a static host/CDN and rewrite unknown non-asset URLs to `/index.html`. Existing generated route files must take precedence over the fallback rewrite.

Set `SITE_URL` to the production origin when building, for example `SITE_URL=https://your-domain.example pnpm build`. Netlify's `URL` and Vercel's `VERCEL_PROJECT_PRODUCTION_URL` are also detected. The SEO generator writes absolute canonical URLs, route-specific HTML metadata, structured data, `robots.txt`, `sitemap.xml`, and `llms.txt`. A build without a deployment origin uses `http://localhost:4173` and is suitable only for local validation.
