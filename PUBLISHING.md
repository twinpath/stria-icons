# Stria Icons - Publishing and Release Guide

This document describes the package distribution channels, synchronized versioning model, and step-by-step procedures to publish new releases of Stria Icons to public registries (NPMJS, Packagist).

---

## 1. Synchronized Versioning Model

All Stria Icons packages and starter templates share the same version number to maintain parity. 
- Format: Semantic Versioning (SemVer) with format `v[Major].[Minor].[Patch]` (e.g. `v0.1.0`).
- If you make changes to one package, you must increment the version across all manifests (`package.json` in core and react, `composer.json` in blade-icons) to ensure compatibility.

---

## 2. Package Distribution Channels

| Package | Target Registry | Package Name | Publishing Source |
| :--- | :--- | :--- | :--- |
| **Core Package** | npm / jsDelivr | `stria-icons` | `packages/stria-icons-core` |
| **React Wrapper** | npm | `@stria-icons/react` | `packages/stria-icons-react` |
| **Blade Wrapper** | Packagist | `stria-icons/blade-icons` | `packages/stria-icons-blade` |

---

## 3. Automation Setup

### A. NPMJS (Core & React Packages)
We use GitHub Actions to automatically publish JavaScript packages when a Git Tag is pushed.
- **Workflow Location:** `.github/workflows/publish-npm.yml` inside `stria-icons-core` and `stria-icons-react` repositories.
- **Required Secrets:** 
  1. Generate an **Automation** type npm token in npmjs.com.
  2. Add the token to the GitHub Secrets on both `stria-icons-core` and `stria-icons-react` repositories as a secret named `NPM_TOKEN`.
- **Trigger:** Pushing a tag starting with `v` (e.g., `v0.1.0`) triggers the workflow to run `npm publish --access public`.

### B. Packagist (Laravel Blade Package)
Packagist uses a pull-based mechanism synced via GitHub webhooks.
- **Setup:**
  1. Log in to Packagist.org and submit the package URL: `https://github.com/twinpath/stria-icons-blade`.
  2. Go to your `stria-icons-blade` repository settings on GitHub -> *Webhooks*.
  3. Add a new webhook targeting Packagist API and paste your Packagist API Token. Set the trigger to *Just the push event*.
- **Trigger:** Any push or new tag on `stria-icons-blade` triggers Packagist to fetch the updated manifests and release the version.

---

## 4. Step-by-Step Release Procedure

To perform a release:

1. **Commit and Push Changes to Submodules:**
   Navigate into each package directory, commit the changes, and push to their respective remote repositories:
   ```bash
   cd packages/stria-icons-core
   git add -A && git commit -m "release: update compiled core assets"
   git push origin main

   cd ../stria-icons-react
   git add -A && git commit -m "release: update react wrappers"
   git push origin main

   cd ../stria-icons-blade
   git add -A && git commit -m "release: update blade components"
   git push origin main
   ```

2. **Commit and Push Templates:**
   Apply any template changes, commit, and push:
   ```bash
   cd ../../templates/stria-icons-react-template
   git add -A && git commit -m "release: update template"
   git push origin main
   ```

3. **Tag Submodule Repositories:**
   Apply the release tag directly on each satellite repository to trigger the automated registry publish:
   ```bash
   # In packages/stria-icons-core
   git tag v0.1.0
   git push origin v0.1.0

   # In packages/stria-icons-react
   git tag v0.1.0
   git push origin v0.1.0

   # In packages/stria-icons-blade
   git tag v0.1.0
   git push origin v0.1.0
   ```

4. **Commit Submodule Pointers in Main Monorepo:**
   In the root directory of the monorepo, add the submodule pointers, commit, and push:
   ```bash
   cd ../../
   git add packages/ templates/
   git commit -m "chore: bump submodule pointers to v0.1.0"
   git push origin main
   ```

5. **Tag Main Monorepo:**
   Create a release tag on the main monorepo for tracking:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
