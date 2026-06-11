---
title: Cloudflare Workers Deployment
description: How to deploy the Stria Icons documentation to Cloudflare Workers using OpenNext.
---

# Deploying to Cloudflare Workers

The Stria Icons documentation site is built using Next.js and Fumadocs. We use **OpenNext** via `@opennextjs/cloudflare` to seamlessly deploy the Next.js application to the Cloudflare Workers edge network. This provides ultra-fast global performance and edge rendering.

## Prerequisites

Before deploying, ensure you have the following installed:
- Node.js (v18+)
- `pnpm` (The package manager used in this monorepo)
- A [Cloudflare](https://dash.cloudflare.com/) account
- Wrangler CLI (installed automatically as a project dependency)

## 1. Authentication

First, log in to your Cloudflare account via the Wrangler CLI:

```bash
npx wrangler login
```

This will open your browser and prompt you to authorize Wrangler.

## 2. Configuration

Ensure that your `wrangler.toml` file at the root of the `documentations` workspace is configured correctly. It should look something like this:

```toml
name = "stria-icons-docs"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# Use the 'assets' configuration to serve static files from the Next.js build
assets = { directory = ".open-next/assets", binding = "ASSETS" }
```

## 3. Build the Project

To deploy to Cloudflare, you first need to build the Next.js application using OpenNext. OpenNext will compile the Next.js app into a Cloudflare Worker compatible bundle.

Run the build script from the `documentations` directory:

```bash
pnpm run build
```

This command executes `opennextjs-cloudflare`, which generates the `.open-next` output directory containing your Worker script and static assets.

## 4. Local Testing (Optional)

Before deploying to production, it's highly recommended to test the built worker locally using Miniflare (Cloudflare's local simulator).

```bash
pnpm run preview
```

This will spin up a local server (typically on `http://localhost:8787`). Verify that all pages, styles, and interactive components load correctly.

## 5. Deployment

Once you've verified the build locally, you can deploy the site to the Cloudflare global network.

```bash
pnpm run deploy
```

This command runs `wrangler deploy`, which uploads your Worker script and static assets to Cloudflare. 

### Success!

After a few seconds, Wrangler will output the production URL of your deployment (e.g., `https://stria-icons-docs.<your-subdomain>.workers.dev`). Your documentation is now live at the edge!

## Continuous Integration (CI/CD)

To automate deployments using GitHub Actions, you can use the official `cloudflare/wrangler-action`. Ensure you set the `CLOUDFLARE_API_TOKEN` secret in your repository settings.

```yaml
name: Deploy Docs

on:
  push:
    branches:
      - main
    paths:
      - 'documentations/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - name: Install dependencies
        run: pnpm install
      - name: Build docs
        run: cd documentations && pnpm run build
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: documentations
```
