import fs from 'fs/promises';
import path from 'path';
import { exists, extractPathData, extractViewBox } from '../utils/file-system.mjs';

/**
 * Phase 1: Copy optimized SVGs to dist and collect path/viewBox metadata.
 * @param {object} params
 * @param {string} params.SRC_DIR
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.catalog
 * @returns {Promise<object>} iconDataByStyle map
 */
export async function processSvgs({ SRC_DIR, DIST_DIR, STYLES, catalog }) {
  const iconDataByStyle = {};
  for (const style of STYLES) {
    iconDataByStyle[style] = {};
  }

  for (const style of STYLES) {
    const srcStyleDir = path.join(SRC_DIR, style);
    const distStyleDir = path.join(DIST_DIR, 'svg', style);
    
    if (!(await exists(srcStyleDir))) continue;
    await fs.mkdir(distStyleDir, { recursive: true });

    const files = await fs.readdir(srcStyleDir);
    
    // Process all files in parallel for the current style to speed up I/O
    await Promise.all(
      files.map(async (file) => {
        if (!file.endsWith('.svg')) return;
        
        const srcPath = path.join(srcStyleDir, file);
        const distPath = path.join(distStyleDir, file);
        
        const svgContent = await fs.readFile(srcPath, 'utf8');
        await fs.writeFile(distPath, svgContent, 'utf8');

        const name = path.basename(file, '.svg');
        iconDataByStyle[style][name] = {
          paths: extractPathData(svgContent),
          viewBox: extractViewBox(svgContent),
          unicode: catalog[name]?.unicode || '',
        };
      })
    );
  }

  return iconDataByStyle;
}
