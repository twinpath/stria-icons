# AI Agent Instructions - Stria Icons

This document provides system guidelines and instructions for AI agents working in the Stria Icons monorepo.

## Documentation References

- For detailed developer setup, directory structure, and contribution guides, read [DEVELOPMENT.md](DEVELOPMENT.md).
- For release pipelines, automatic registry publishing, and tagging sequences, read [PUBLISHING.md](PUBLISHING.md).

## Architectural Constraints

1. Core First: Raw SVG assets in `icons/{style}/*.svg` are the root source of truth.
2. Automate Wrapper Updates: Never edit React components or Laravel Blade view files manually. Edit the build scripts in `scripts/` instead and run the build command.
3. No Emojis: Under no circumstances should emojis be added to any file in the project.

## Development Scripts

- `pnpm optimize`: Runs SVGO on raw SVGs in `icons/`.
- `pnpm metadata`: Generates `metadata/icons.json` scanning the SVG directory.
- `pnpm build`: Performs a full rebuild of all distribution packages using Turbo.
- `pnpm build:core`: Rebuilds the core assets package only.
- `pnpm build:react`: Rebuilds the React wrapper package only.
- `pnpm build:blade`: Rebuilds the Blade wrapper package only.

