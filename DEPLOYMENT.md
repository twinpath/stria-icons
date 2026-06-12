# Deployment Guide: Cloudflare Workers

This guide explains how to deploy the Fumadocs documentation site (`documentations/`) to Cloudflare Workers using Cloudflare's native GitHub integration (Workers Builds) and the OpenNext adapter.

## Why Cloudflare Workers (not Pages)?

Fumadocs requires Node.js APIs for server-side MDX processing and search indexing. Standard Cloudflare Pages forces Next.js into the Edge Runtime, which Fumadocs does not support.

The `@opennextjs/cloudflare` adapter wraps the Next.js server into a format compatible with Cloudflare Workers using the `nodejs_compat` compatibility flag. This allows the documentation to run on Cloudflare's global network without Edge Runtime restrictions.

## CDN Integrations

The `documentations` workspace fetches SVGs and metadata directly from the jsdelivr CDN at build time and runtime. Therefore, it does NOT require the workspace packages to be built before deployment.

Correct build command from the repo root:

```
pnpm docs:cf:build ->  documentations/.open-next/
```

## Cloudflare Dashboard Setup (Workers Builds via GitHub Connection)

### 1. Connect Repository

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create**.
3. Select the **Workers** tab and click **Connect to Git**.
4. Connect your GitHub account and select the `twinpath/stria-icons` repository.

### 2. Configure Build Settings

| Setting | Value |
|---|---|
| Project name | `stria-icons-docs` |
| Production branch | `main` |
| Root directory | *(leave empty — repo root)* |
| Build command | `pnpm install && pnpm docs:cf:build` |
| Build output directory | `documentations/.open-next` |

> Root directory is left empty so that `pnpm install` runs from the monorepo root where `pnpm-workspace.yaml` is located. The build output path `documentations/.open-next` is relative to the repo root.

### 3. Add Environment Variable

Under **Settings > Variables & Secrets**, add:

```
NEXTJS_ENV=production
```

### 4. Deploy

Click **Save and Deploy**. Cloudflare will immediately trigger the first build from the latest commit on `main`.

Preview deployments are created automatically for every pull request and non-main branch push.

## Local Preview

To test the Worker locally before deploying:

```bash
# From the repo root
pnpm docs:cf:build

# Start local preview server at http://localhost:8787
pnpm docs:cf:preview
```

## Troubleshooting

### CDN Fetch Fails

Ensure that the internet connection is active during the build and runtime, and the version specified in the CDN URLs (`0.1.6`) is published and available on npm.

### "Edge Runtime is not supported"

The application was deployed as a Cloudflare Pages project rather than a Worker. Use the **Workers > Connect to Git** flow (not Pages), and ensure the build command executes `opennextjs-cloudflare build`.

### Compatibility flags missing

The `wrangler.jsonc` already declares `nodejs_compat` and `global_fetch_strictly_public`. These are applied automatically on deploy — no manual configuration in the Dashboard is needed.
