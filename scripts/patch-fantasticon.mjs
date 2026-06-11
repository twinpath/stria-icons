import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const targetFile = path.join(ROOT_DIR, 'node_modules/fantasticon/lib/utils/assets.js');

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    const targetCode = 'const globPath = (0, path_1.join)(dir, `**/*.${exports.ASSETS_EXTENSION}`);';
    const patchedCode = 'const globPath = (0, path_1.join)(dir, `**/*.${exports.ASSETS_EXTENSION}`).replace(/\\\\/g, "/");';
    
    if (content.includes(targetCode)) {
      content = content.replace(targetCode, patchedCode);
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log('Successfully patched fantasticon Windows glob path bug.');
    } else if (content.includes(patchedCode)) {
      console.log('fantasticon Windows glob path bug is already patched.');
    } else {
      console.warn('Could not find target code in fantasticon assets.js to patch.');
    }
  } else {
    console.warn('fantasticon assets.js not found in node_modules.');
  }
} catch (error) {
  console.error('Failed to patch fantasticon:', error);
}
