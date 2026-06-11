# Claude Agent Instructions - Stria Icons

This file contains rules and instructions for Claude when editing, modifying, or reviewing the Stria Icons project.

## Documentation References

- For detailed developer setup, directory structure, and contribution guides, read [DEVELOPMENT.md](DEVELOPMENT.md).
- For release pipelines, automatic registry publishing, and tagging sequences, read [PUBLISHING.md](PUBLISHING.md).

<rules>
- NEVER add emojis to any file, code, comments, documentation, logs, or commit messages.
- Do not edit files in the `dist` directory or auto-generated resources manually. Always use the build scripts in `scripts/`.
- Ensure all SVG source files maintain the `0 0 24 24` viewBox standard (except brand icons).
- NEVER run build commands (e.g., `pnpm build`, `pnpm build:*`). The user must run these commands manually due to execution time.
- Template packages (under `templates/`) do not follow core package versioning. Keep templates versioned statically at 1.0.0.
</rules>

## Commands Reference

Use the following commands during development:
- `pnpm optimize`: Optimize SVGs.
- `pnpm metadata`: Regenerate metadata index.
- `pnpm build`: Run complete turborepo build.
- `pnpm lint:icons`: Run SVG structure lint checks.

