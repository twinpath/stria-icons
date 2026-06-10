import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Konfigurasi Jalur Folder Terpusat
const PATHS = {
  coreDist: 'packages/stria-icons-core/dist',
  bladePackage: 'packages/stria-icons-blade'
};

const CORE_DIST_DIR = path.join(ROOT_DIR, PATHS.coreDist);
const BLADE_DIR = path.join(ROOT_DIR, PATHS.bladePackage);
const BLADE_SVG_DIR = path.join(BLADE_DIR, 'resources/svg');

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Extract path data from SVG content
function extractPathData(svgContent) {
  const matches = [...svgContent.matchAll(/<path[^>]*d="([^"]+)"/g)];
  return matches.map(m => m[1]);
}

// Extract viewBox from SVG content
function extractViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 24 24';
}

async function run() {
  console.log('Building Laravel Blade package wrappers...');
  
  const catalogPath = path.join(CORE_DIST_DIR, 'icons.json');
  if (!(await exists(catalogPath))) {
    console.error(`Core catalog icons.json not found in ${PATHS.coreDist}. Run build-core first.`);
    process.exit(1);
  }
  
  const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];
  
  await fs.mkdir(BLADE_SVG_DIR, { recursive: true });
  
  let totalBladeViews = 0;
  
  for (const style of STYLES) {
    const styleBladeDir = path.join(BLADE_SVG_DIR, style);
    await fs.mkdir(styleBladeDir, { recursive: true });
    
    const svgStyleDir = path.join(CORE_DIST_DIR, 'svg', style);
    if (!(await exists(svgStyleDir))) continue;
    
    const files = await fs.readdir(svgStyleDir);
    for (const file of files) {
      if (file.endsWith('.svg')) {
        const name = path.basename(file, '.svg');
        
        const svgContent = await fs.readFile(path.join(svgStyleDir, file), 'utf8');
        const paths = extractPathData(svgContent);
        const viewBox = extractViewBox(svgContent);
        
        let pathElements = '';
        paths.forEach((p, index) => {
          if (style === 'duotone' && index === 0) {
            pathElements += `  <path d="${p}" class="stria-secondary" style="opacity: 0.4"/>\n`;
          } else {
            pathElements += `  <path d="${p}"/>\n`;
          }
        });
        
        const bladeCode = `<svg {{ $attributes->merge(['xmlns' => 'http://www.w3.org/2000/svg', 'viewBox' => '${viewBox}', 'fill' => 'currentColor']) }}>
${pathElements}</svg>
`;
        
        const bladeFile = path.join(styleBladeDir, `${name}.blade.php`);
        await fs.writeFile(bladeFile, bladeCode, 'utf8');
        totalBladeViews++;
      }
    }
  }
  
  console.log(`Laravel Blade wrapper views generated successfully. Total views: ${totalBladeViews}`);
}

run().catch(err => {
  console.error('Error building Laravel Blade wrappers:', err);
  process.exit(1);
});
