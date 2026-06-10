import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = path.resolve('icons');
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
  console.log('Stripping FontAwesome comments from source SVGs in icons/...');
  let count = 0;
  
  for (const style of STYLES) {
    const styleDir = path.join(SRC_DIR, style);
    if (!(await exists(styleDir))) continue;
    
    const files = await fs.readdir(styleDir);
    for (const file of files) {
      if (file.endsWith('.svg')) {
        const filePath = path.join(styleDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Match any comment containing fontawesome or Font Awesome
        const commentRegex = /<!--[\s\S]*?fontawesome[\s\S]*?-->/gi;
        if (commentRegex.test(content)) {
          content = content.replace(commentRegex, '');
          await fs.writeFile(filePath, content, 'utf8');
          count++;
        }
      }
    }
  }
  
  console.log(`Successfully removed FontAwesome comments from ${count} source SVG files.`);
}

run().catch(err => {
  console.error('Error stripping comments:', err);
  process.exit(1);
});
