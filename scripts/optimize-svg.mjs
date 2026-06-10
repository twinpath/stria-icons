import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimize } from 'svgo';
import svgoConfig from '../.svgo.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];

// Konfigurasi Jalur Folder Terpusat
const PATHS = {
  iconsSource: 'icons',
  corePackageSVG: 'packages/stria-icons-core/dist/svg'
};

const SRC_DIR = path.join(ROOT_DIR, PATHS.iconsSource);
const DIST_DIR = path.join(ROOT_DIR, PATHS.corePackageSVG);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Optimizing SVGs...');
  
  for (const style of STYLES) {
    const srcStyleDir = path.join(SRC_DIR, style);
    const distStyleDir = path.join(DIST_DIR, style);
    
    if (!(await exists(srcStyleDir))) {
      console.log(`Directory ${srcStyleDir} does not exist. Skipping.`);
      continue;
    }
    
    await fs.mkdir(distStyleDir, { recursive: true });
    
    const dirFiles = await fs.readdir(srcStyleDir);
    const files = dirFiles.filter(f => f.endsWith('.svg'));
    console.log(`Optimizing ${files.length} icons in style: ${style}`);
    
    for (const file of files) {
      const srcPath = path.join(srcStyleDir, file);
      const distPath = path.join(distStyleDir, file);
      
      const svgContent = await fs.readFile(srcPath, 'utf8');
      
      // Run SVGO
      const result = optimize(svgContent, {
        path: srcPath,
        ...svgoConfig
      });
      
      let optimizedSvg = result.data;
      
      // Ensure color properties are mapped to currentColor appropriately
      if (style === 'solid' || style === 'duotone') {
        optimizedSvg = optimizedSvg.replace(/fill="#[a-zA-Z0-9]+"/g, 'fill="currentColor"');
      } else if (style === 'regular' || style === 'light' || style === 'thin') {
        optimizedSvg = optimizedSvg.replace(/stroke="#[a-zA-Z0-9]+"/g, 'stroke="currentColor"');
      }
      
      await fs.writeFile(distPath, optimizedSvg, 'utf8');
    }
  }
  
  console.log('SVG Optimization complete.');
}

run().catch(err => {
  console.error('Error during optimization:', err);
  process.exit(1);
});
