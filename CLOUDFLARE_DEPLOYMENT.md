---
title: Cloudflare Workers Deployment
description: How to deploy the Stria Icons documentation to Cloudflare Workers using OpenNext.
---

# Deploying to Cloudflare Workers

The Stria Icons documentation site (`documentations/`) is built with Next.js and Fumadocs. It uses `@opennextjs/cloudflare` to compile the Next.js application into a Cloudflare Worker-compatible bundle.

> This is a **pnpm monorepo**. The `documentations` workspace depends on `stria-icons` and `@stria-icons/react` via `workspace:*`. Workspace packages must be built before the documentation can be deployed.

## Prerequisites

- Node.js (v18+)
- pnpm (see `packageManager` field in root `package.json`)
- A [Cloudflare](https://dash.cloudflare.com/) account
- Wrangler CLI — installed automatically as a dev dependency, no global install needed

## Required Configuration Files

The following files must exist in the `documentations/` directory. If they are missing (e.g. after a failed `migrate` command on Windows), create them manually.

### `documentations/wrangler.jsonc`

```jsonc
{
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "stria-icons-docs",
    "main": ".open-next/worker.js",
    "compatibility_date": "2026-06-12",
    "compatibility_flags": [
        "nodejs_compat",
        "global_fetch_strictly_public"
    ],
    "assets": {
        "binding": "ASSETS",
        "directory": ".open-next/assets"
    },
    "images": {
        "binding": "IMAGES"
    },
    "services": [
        {
            "binding": "WORKER_SELF_REFERENCE",
            "service": "stria-icons-docs"
        }
    ],
    "observability": {
        "enabled": true
    },
    "upload_source_maps": true
}
```

The `"name"` and `"services[0].service"` fields must be identical. Both use `"stria-icons-docs"`.

### `documentations/open-next.config.ts`

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

### `documentations/next.config.mjs`

Append two lines at the end of the existing file:

```javascript
// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

### `documentations/.dev.vars`

```ini
# Load .env.development* files when running `wrangler dev`
NEXTJS_ENV=development
```

## Scripts

### In `documentations/package.json`

```json
"cf:build":   "opennextjs-cloudflare build",
"cf:preview": "opennextjs-cloudflare preview",
"cf:deploy":  "opennextjs-cloudflare deploy",
"cf:upload":  "opennextjs-cloudflare upload",
"deploy":     "opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts"
```

### In root `package.json`

```json
"docs:cf:build":   "pnpm --filter documentations run cf:build",
"docs:cf:preview": "pnpm --filter documentations run cf:preview",
"docs:cf:deploy":  "pnpm --filter documentations run cf:deploy"
```

## Local Development

Run the standard Next.js dev server:

```bash
pnpm docs:dev
```

To preview the Worker locally using the Cloudflare Workers runtime (Miniflare):

```bash
# From repo root — builds workspace packages first, then OpenNext
pnpm build:core && pnpm build:react && pnpm docs:cf:build

# Then preview at http://localhost:8787
pnpm docs:cf:preview
```

## Build Order

Because `documentations` uses `workspace:*` dependencies, the correct build order is:

```
1. pnpm build:core    ->  packages/stria-icons-core/dist/
2. pnpm build:react   ->  packages/stria-icons-react/dist/
3. pnpm docs:cf:build ->  documentations/.open-next/
4. pnpm docs:cf:deploy
```

Skipping steps 1 or 2 will cause `opennextjs-cloudflare build` to fail with a module resolution error.

## Deployment via GitHub Connection (Cloudflare Dashboard)

Deployment is handled by **Cloudflare Workers CI** — the native GitHub integration in the Cloudflare Dashboard. No GitHub Actions workflow file is required.

### Setup

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**
2. Click **Create** > **Import a repository**
3. Connect your GitHub account and select the `stria-icons` repository
4. Configure the build settings:

| Setting | Value |
|---|---|
| Project name | `stria-icons-docs` |
| Production branch | `main` |
| Root directory | *(leave empty — repo root)* |
| Build command | `pnpm install && pnpm build:core && pnpm build:react && pnpm docs:cf:build` |
| Build output directory | `documentations/.open-next` |

5. Under **Settings > Variables**, add the production environment variable:

```
NEXTJS_ENV=production
```

### Preview Deployments

Cloudflare Workers CI automatically creates a preview deployment for every pull request and non-production branch push. No additional configuration is needed.

## Generate TypeScript Types for Bindings

After `wrangler.jsonc` is in place, run this once to generate `cloudflare-env.d.ts`:

```bash
# From documentations/
pnpm cf-typegen
```

The generated file provides type-safe access to Cloudflare bindings (`ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`) in your Next.js code.
