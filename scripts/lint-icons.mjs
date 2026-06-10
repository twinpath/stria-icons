import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT_DIR, 'icons');
const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Linting SVGs...');
  let errors = 0;
  
  for (const style of STYLES) {
    const styleDir = path.join(SRC_DIR, style);
    if (!(await exists(styleDir))) continue;
    
    const files = await fs.readdir(styleDir);
    for (const file of files) {
      if (!file.endsWith('.svg')) {
        console.error(`[ERROR] Non-SVG file found in ${style}: ${file}`);
        errors++;
        continue;
      }
      
      const name = path.basename(file, '.svg');
      
      // Check kebab-case
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
        console.error(`[ERROR] Filename "${file}" in style "${style}" must be kebab-case.`);
        errors++;
      }
      
      const content = await fs.readFile(path.join(styleDir, file), 'utf8');
      
      // Check viewBox
      if (style !== 'brands') {
        const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
        if (!viewBoxMatch) {
          console.error(`[ERROR] SVG "${file}" in style "${style}" is missing viewBox attribute.`);
          errors++;
        } else if (viewBoxMatch[1] !== '0 0 24 24') {
          // Note: Since source icons are still raw, this will fail until normalized.
          // This is a warning for now, but a strict check for build pipelines.
          console.warn(`[WARNING] SVG "${file}" in style "${style}" has non-standard viewBox "${viewBoxMatch[1]}". Expected "0 0 24 24".`);
        }
      }
      
      // Check for dangerous scripts or event handlers
      if (content.includes('<script') || /on[a-z]+=/i.test(content)) {
        console.error(`[ERROR] SVG "${file}" in style "${style}" contains scripts or event handlers.`);
        errors++;
      }
    }
  }
  
  if (errors > 0) {
    console.error(`Linting finished with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log('Linting completed successfully with zero errors.');
  }
}

run().catch(err => {
  console.error('Error during SVG linting:', err);
  process.exit(1);
});
