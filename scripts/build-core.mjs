import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exists } from './utils/file-system.mjs';
import { processSvgs } from './lib/svg-processor.mjs';
import { generateSprites } from './lib/sprite-generator.mjs';
import { generateCss } from './lib/css-generator.mjs';
import { generatePreprocessors } from './lib/scss-less-gen.mjs';
import { generateJsBundles } from './lib/js-generator.mjs';
import { generateShims } from './lib/shim-generator.mjs';
import { generatePackageModules } from './lib/package-generator.mjs';
import { generateWebfonts } from './lib/webfont-generator.mjs';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Konfigurasi Jalur Folder Terpusat
const PATHS = {
  iconsSource: 'icons',
  corePackage: 'packages/stria-icons-core',
  metadata: 'metadata/icons.json',
  shims: 'metadata/shims.json'
};

const SRC_DIR = path.join(ROOT_DIR, PATHS.iconsSource);
const CORE_DIR = path.join(ROOT_DIR, PATHS.corePackage);
const DIST_DIR = path.join(CORE_DIR, 'dist');
const METADATA_PATH = path.join(ROOT_DIR, PATHS.metadata);
const SHIMS_PATH = path.join(ROOT_DIR, PATHS.shims);

const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];

// Style abbreviations used in font-face CSS class naming
const STYLE_PREFIX = {
  solid: 'st-solid',
  regular: 'st-regular',
  light: 'st-light',
  thin: 'st-thin',
  duotone: 'st-duotone',
  brands: 'st-brands',
};

async function run() {
  console.log(`Building core ${PATHS.corePackage}...`);

  if (!(await exists(METADATA_PATH))) {
    console.error('metadata/icons.json not found. Run "pnpm metadata" first.');
    process.exit(1);
  }

  const catalog = JSON.parse(await fs.readFile(METADATA_PATH, 'utf8'));

  // Clean output directory
  console.log(`Cleaning output directory: ${DIST_DIR}...`);
  await fs.rm(DIST_DIR, { recursive: true, force: true });

  // Create all output directories
  const dirs = [
    'svg', 'sprites', 'webfonts', 'scss', 'less',
    'css', 'js', 'esm', 'cjs', 'types', 'data',
  ];
  for (const d of dirs) {
    await fs.mkdir(path.join(DIST_DIR, d), { recursive: true });
  }

  await fs.writeFile(path.join(DIST_DIR, 'icons.json'), JSON.stringify(catalog, null, 2), 'utf8');

  // ------------------------------------------------------------------
  // Phase 1: Copy optimized SVGs and collect path data
  // ------------------------------------------------------------------
  console.log('Processing SVGs and extracting metadata...');
  const iconDataByStyle = await processSvgs({ SRC_DIR, DIST_DIR, STYLES, catalog });

  // ------------------------------------------------------------------
  // Phase 1b: Webfonts generation from optimized SVGs
  // ------------------------------------------------------------------
  console.log('Generating webfonts...');
  await generateWebfonts({ DIST_DIR });

  // ------------------------------------------------------------------
  // Phase 2: SVG Sprites (one per style)
  // ------------------------------------------------------------------
  console.log('Generating SVG sprite sheets...');
  await generateSprites({ DIST_DIR, STYLES, iconDataByStyle });

  // ------------------------------------------------------------------
  // Phase 3: CSS Stylesheets (per-style + all + base)
  // ------------------------------------------------------------------
  console.log('Generating CSS stylesheets...');
  await generateCss({ DIST_DIR, STYLES, STYLE_PREFIX, iconDataByStyle });

  // ------------------------------------------------------------------
  // Phase 4 & 5: SCSS & Less Templates
  // ------------------------------------------------------------------
  console.log('Generating SCSS and Less templates...');
  await generatePreprocessors({ DIST_DIR, STYLES, iconDataByStyle });

  // ------------------------------------------------------------------
  // Phase 6: Per-style JS bundles + all.js
  // ------------------------------------------------------------------
  console.log('Generating per-style JS bundles...');
  await generateJsBundles({ DIST_DIR, STYLES, iconDataByStyle });

  // ------------------------------------------------------------------
  // Phase 7: v4-shims (CSS + JS)
  // ------------------------------------------------------------------
  console.log('Generating v4-shims...');
  await generateShims({ DIST_DIR, SHIMS_PATH });

  // ------------------------------------------------------------------
  // Phase 8: ESM, CJS, TypeScript Declarations
  // ------------------------------------------------------------------
  console.log('Generating ESM, CJS, and TypeScript declarations...');
  await generatePackageModules({ DIST_DIR, STYLES, iconDataByStyle });

  const totalIcons = Object.values(iconDataByStyle).reduce((sum, s) => sum + Object.keys(s).length, 0);
  console.log(`Core build complete. Total icon entries across all styles: ${totalIcons}`);
}

run().catch(err => {
  console.error('Error in core build:', err);
  process.exit(1);
});
