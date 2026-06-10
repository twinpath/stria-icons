import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT_DIR, 'icons');
const METADATA_DIR = path.join(ROOT_DIR, 'metadata');
const SOURCE_METADATA_DIR = METADATA_DIR;

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Generating Stria Icons metadata...');
  
  const sourceIconsPath = path.join(SOURCE_METADATA_DIR, 'icons.json');
  const sourceCategoriesPath = path.join(SOURCE_METADATA_DIR, 'categories.json');
  
  if (!(await exists(sourceIconsPath)) || !(await exists(sourceCategoriesPath))) {
    console.error('Source metadata files categories.json or icons.json are missing in FontAwesome-6-PRO/pro/metadata/.');
    process.exit(1);
  }
  
  console.log('Reading source metadata files...');
  const sourceIcons = JSON.parse(await fs.readFile(sourceIconsPath, 'utf8'));
  const sourceCategories = JSON.parse(await fs.readFile(sourceCategoriesPath, 'utf8'));
  
  // Map icons to categories
  const iconToCategories = {};
  for (const [catId, catVal] of Object.entries(sourceCategories)) {
    if (catVal.icons && Array.isArray(catVal.icons)) {
      for (const iconName of catVal.icons) {
        if (!iconToCategories[iconName]) {
          iconToCategories[iconName] = [];
        }
        iconToCategories[iconName].push(catId);
      }
    }
  }
  
  // Scan icons directory to find which icons actually exist
  const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];
  const actualIcons = new Set();
  const iconStyles = {}; // iconName -> Set of styles it exists in
  
  for (const style of STYLES) {
    const styleDir = path.join(SRC_DIR, style);
    if (await exists(styleDir)) {
      const files = await fs.readdir(styleDir);
      for (const file of files) {
        if (file.endsWith('.svg')) {
          const iconName = path.basename(file, '.svg');
          actualIcons.add(iconName);
          
          if (!iconStyles[iconName]) {
            iconStyles[iconName] = new Set();
          }
          iconStyles[iconName].add(style);
        }
      }
    }
  }
  
  console.log(`Found ${actualIcons.size} actual icons in workspace icons/ folder.`);
  
  // Build clean metadata catalog
  const catalog = {};
  for (const iconName of actualIcons) {
    const sourceData = sourceIcons[iconName] || {};
    
    catalog[iconName] = {
      name: iconName,
      styles: Array.from(iconStyles[iconName] || []),
      categories: iconToCategories[iconName] || [],
      tags: sourceData.search?.terms || [],
      unicode: sourceData.unicode || ''
    };
  }
  
  await fs.mkdir(METADATA_DIR, { recursive: true });
  const outputPath = path.join(METADATA_DIR, 'icons.json');
  await fs.writeFile(outputPath, JSON.stringify(catalog, null, 2), 'utf8');
  
  console.log(`Metadata generated successfully at ${outputPath}`);
}

run().catch(err => {
  console.error('Error generating metadata:', err);
  process.exit(1);
});
