# Deployment Guide: Cloudflare Workers

This guide explains how to deploy the Fumadocs documentation site (`documentations/`) to Cloudflare Workers using Cloudflare's native GitHub integration (Workers Builds) and the OpenNext adapter.

## Why Cloudflare Workers (not Pages)?

Fumadocs requires Node.js APIs for server-side MDX processing and search indexing. Standard Cloudflare Pages forces Next.js into the Edge Runtime, which Fumadocs does not support.

The `@opennextjs/cloudflare` adapter wraps the Next.js server into a format compatible with Cloudflare Workers using the `nodejs_compat` compatibility flag. This allows the documentation to run on Cloudflare's global network without Edge Runtime restrictions.

## Workspace Dependencies

This is a pnpm monorepo. The `documentations` workspace depends on:

- `stria-icons` (`packages/stria-icons-core/`) via `workspace:*`
- `@stria-icons/react` (`packages/stria-icons-react/`) via `workspace:*`

Both packages must be built before `opennextjs-cloudflare build` can succeed, because they must have a `dist/` directory for bundling.

Correct build order from the repo root:

```
pnpm build:core    ->  packages/stria-icons-core/dist/
pnpm build:react   ->  packages/stria-icons-react/dist/
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
| Build command | `pnpm install && pnpm build:core && pnpm build:react && pnpm docs:cf:build` |
| Build output directory | `documentations/.open-next` |

> Root directory is left empty so that `pnpm install` and all `pnpm build:*` scripts run from the monorepo root where `pnpm-workspace.yaml` is located. The build output path `documentations/.open-next` is relative to the repo root.

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
pnpm build:core && pnpm build:react && pnpm docs:cf:build

# Start local preview server at http://localhost:8787
pnpm docs:cf:preview
```

## Troubleshooting

### "Cannot find module '@stria-icons/react'" during build

The workspace packages were not built before `opennextjs-cloudflare build`. Ensure `pnpm build:core && pnpm build:react` runs first in the build command.

### "Edge Runtime is not supported"

The application was deployed as a Cloudflare Pages project rather than a Worker. Use the **Workers > Connect to Git** flow (not Pages), and ensure the build command executes `opennextjs-cloudflare build`.

### Compatibility flags missing

The `wrangler.jsonc` already declares `nodejs_compat` and `global_fetch_strictly_public`. These are applied automatically on deploy — no manual configuration in the Dashboard is needed.
