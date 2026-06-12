# documentations

The Stria Icons documentation site, built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev). Deployed to Cloudflare Workers via the OpenNext adapter.

## Development

Run the local Next.js development server from the **repo root**:

```bash
pnpm docs:dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

| Path | Description |
|---|---|
| `src/app/(home)` | Landing page and other top-level pages |
| `src/app/docs` | Documentation layout and pages |
| `src/app/api/search/route.ts` | Route handler for Fumadocs search |
| `content/` | MDX documentation source files |
| `source.config.ts` | Fumadocs MDX configuration and frontmatter schema |
| `lib/source.ts` | Content source adapter using Fumadocs `loader()` |
| `lib/layout.shared.tsx` | Shared layout options |

## Cloudflare Deployment

This workspace is deployed to Cloudflare Workers as `stria-icons-docs` using the `@opennextjs/cloudflare` adapter.

Key configuration files:

| File | Purpose |
|---|---|
| `wrangler.jsonc` | Cloudflare Worker configuration (name, bindings, compatibility flags) |
| `open-next.config.ts` | OpenNext adapter configuration |
| `.dev.vars` | Local environment variables for `wrangler dev` / `cf:preview` |
| `cloudflare-env.d.ts` | Auto-generated TypeScript types for Cloudflare bindings |

For full deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md) at the repo root.

### Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Next.js local dev server |
| `pnpm cf:build` | Build with OpenNext for Cloudflare Workers |
| `pnpm cf:preview` | Preview built Worker locally at `localhost:8787` |
| `pnpm cf:deploy` | Deploy Worker to Cloudflare |
| `pnpm cf:upload` | Upload Worker without triggering live routing swap |
| `pnpm cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` |

> Always run `pnpm build:core && pnpm build:react` from the repo root before `cf:build`, as this workspace depends on `stria-icons` and `@stria-icons/react` via `workspace:*`.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs Documentation](https://fumadocs.dev)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
