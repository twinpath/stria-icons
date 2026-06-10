# Stria Icons - Developer Guide

Welcome to the Stria Icons developer guide. This document outlines the development workflow, project architecture, and coding standards for this monorepo.

---

## 1. Prerequisites

Before setting up the repository, ensure you have the following environments installed:
- **Node.js:** version 18.0.0 or higher (LTS recommended)
- **pnpm:** version 9.0.0 or higher (workspace package manager)
- **PHP:** version 8.1 or higher (required for Blade icon compiler & Laravel template tests)
- **Composer:** required for installing Laravel Blade dependencies

---

## 2. Initial Setup

1. Clone the repository and its Git submodules recursively:
   ```bash
   git clone --recursive https://github.com/twinpath/stria-icons.git
   cd stria-icons
   ```

2. If you already cloned the repository without submodules, initialize them:
   ```bash
   git submodule update --init --recursive
   ```

3. Install project dependencies and establish workspace links:
   ```bash
   pnpm install
   ```

---

## 3. Directory Architecture

The monorepo uses `pnpm` workspaces to manage satellite packages and starter templates:

```text
stria-icons/
├── icons/                      # Source SVG assets (source of truth)
│   ├── solid/                  # Solid style SVGs
│   ├── regular/                # Regular style SVGs
│   └── light/                  # Light style SVGs
├── metadata/                   # Catalog metadata (icons.json, categories.json)
├── packages/                   # Satellite package submodules (compiled outputs)
│   ├── stria-icons-core/       # Core assets package (CSS, Webfonts, Sprites, Vanilla JS)
│   ├── stria-icons-react/      # React wrapper components package
│   └── stria-icons-blade/      # Laravel Blade components package
├── templates/                  # Starter kit templates
│   ├── stria-icons-html-template/   # Static HTML & CDN template
│   ├── stria-icons-react-template/  # Vite + React template
│   └── stria-icons-blade-template/  # Laravel Blade template
├── scripts/                    # Compilers and optimization pipelines
└── package.json                # Root workspaces and script declarations
```

---

## 4. Development Workflow

### Step 1: Adding or Editing Icons
1. Add raw SVG files in the relevant style folder inside `icons/` (e.g. `icons/regular/user.svg`).
2. Source SVGs must adhere to the `0 0 24 24` viewBox standard (except for brand logos).
3. Do not modify optimized files directly; always work with raw SVGs.

### Step 2: SVG Optimization
Run the SVGO optimization pipeline to clean and minify the raw SVGs:
```bash
pnpm optimize
```
This script processes the SVGs and outputs optimized versions into `packages/stria-icons-core/dist/svg/`.

### Step 3: Regenerating Metadata
If you added, renamed, or deleted icons, update the metadata catalog:
```bash
pnpm metadata
```
This will rebuild `metadata/icons.json`, updating details like names, styles, and tags.

### Step 4: Building Packages
To compile all wrapper packages and assets (React, Blade, Core, Webfonts) using Turborepo, run:
```bash
pnpm build
```

Alternatively, you can target specific build steps:
- **Build Core Package:** `pnpm build:core`
- **Build Webfonts Only:** `pnpm build:webfonts`
- **Build React Wrappers:** `pnpm build:react`
- **Build Blade Wrappers:** `pnpm build:blade`

---

## 5. Local Verification & Testing

### Testing React Wrappers
The React template in `templates/stria-icons-react-template` can be used to manually verify the React package components.
1. Move to the template directory:
   ```bash
   cd templates/stria-icons-react-template
   ```
2. Start the local Vite development server:
   ```bash
   pnpm dev
   ```
3. Run the automated tests:
   ```bash
   pnpm test
   ```

### Testing Laravel Blade Wrappers
The Blade template in `templates/stria-icons-blade-template` provides a standard testing setup.
1. Move to the template directory:
   ```bash
   cd templates/stria-icons-blade-template
   ```
2. Install composer dependencies:
   ```bash
   composer install
   ```
3. Test your Laravel integration inside the Laravel app views by rendering components or directives.

---

## 6. Coding Standards & Guidelines

- **No Emojis:** Do not include emojis in source code, comments, documentation, commit messages, or configurations.
- **No Manual Wrapper Edits:** Do not manually edit files inside `packages/stria-icons-react/src/` or `packages/stria-icons-blade/resources/svg/`. These wrapper directories are completely overwritten during the compilation process. Edit compilers in `scripts/` instead.
