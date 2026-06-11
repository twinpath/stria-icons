# Deployment Guide: Cloudflare Workers

This guide explains how to deploy the Fumadocs documentation site (`documentations/`) to Cloudflare Workers using Cloudflare's built-in Git Integration (Workers Builds) and the OpenNext adapter.

## Prerequisites

1. A Cloudflare account.
2. The monorepo pushed to a GitHub or GitLab repository.
3. The `.gitmodules` file correctly configured with public URLs (this is already set up in the monorepo).

## Why Cloudflare Workers?

Fumadocs requires Node.js APIs to perform server-side MDX processing and search indexing. Standard Cloudflare Pages forces Next.js into the Edge Runtime, which Fumadocs does not support. 

To bypass this, we use the `@opennextjs/cloudflare` adapter. OpenNext wraps the Next.js Node.js server into a Cloudflare Worker compatible format using the `nodejs_compat` compatibility flag, allowing the documentation to run seamlessly on Cloudflare's global network.

## Deployment Steps

Follow these steps in your Cloudflare Dashboard to set up automatic CI/CD:

### 1. Connect Git Repository
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** -> **Create application**.
3. Select the **Workers** tab and click **Connect to Git** (Workers Builds).
4. Connect your GitHub/GitLab account and select the `stria-icons` repository.

### 2. Configure the Build Settings
When prompted for the build configuration, enter the following details:

- **Production branch**: `main` (or your default branch).
- **Framework preset**: `None`
- **Build command**: `npm run docs:deploy`
- **Build output directory**: `documentations/.open-next`

*(Note: The `docs:deploy` script in the root `package.json` will automatically filter down to the `documentations` folder and run the OpenNext build process).*

### 3. Add Compatibility Flags
Since OpenNext requires Node.js APIs, you must enable the compatibility flag in the Cloudflare Dashboard before the worker can run correctly.

1. Once the project is created (even if the first build fails), go to your Worker's settings.
2. Navigate to **Settings** -> **Runtime**.
3. Under **Compatibility flags**, add: `nodejs_compat`.
4. Ensure the **Compatibility date** is set to a recent date (e.g., `2024-09-23` or newer).

### 4. Deploy
1. Trigger a new deployment from the Cloudflare Dashboard, or simply push a new commit to your `main` branch.
2. Cloudflare's build system will automatically:
   - Clone the repository.
   - Recursively clone all submodules (e.g., `packages/stria-icons-react`), ensuring the `workspace:*` dependencies resolve correctly.
   - Run `pnpm install`.
   - Execute the OpenNext build.
   - Deploy the generated Worker to the global edge network.

## Troubleshooting

### "Cannot find module '@stria-icons/react'" during build
This means the Git submodules were not cloned properly. Ensure that your `.gitmodules` file contains public URLs that Cloudflare's build runner can access without authentication. 

### "Edge Runtime is not supported"
This error indicates the application was accidentally deployed as a standard Cloudflare Pages project rather than a Cloudflare Worker via OpenNext. Ensure you are using the **Workers -> Connect to Git** flow and that your build command executes `opennextjs-cloudflare`.
