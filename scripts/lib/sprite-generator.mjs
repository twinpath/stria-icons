import fs from 'fs/promises';
import path from 'path';

/**
 * Phase 2: Generate SVG sprite sheets (one per style).
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.iconDataByStyle
 */
export async function generateSprites({ DIST_DIR, STYLES, iconDataByStyle }) {
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons || Object.keys(icons).length === 0) continue;

    let sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n`;
    
    for (const [name, data] of Object.entries(icons)) {
      const paths = Array.isArray(data.paths) ? data.paths : [data.paths];
      sprite += `  <symbol id="${name}" viewBox="${data.viewBox}">\n`;
      
      paths.forEach((p, i) => {
        const cls = (style === 'duotone' && i === 0) ? ' class="stria-secondary" style="opacity: 0.4"' : '';
        sprite += `    <path d="${p}"${cls}/>\n`;
      });
      
      sprite += `  </symbol>\n`;
    }
    
    sprite += `</svg>\n`;
    await fs.writeFile(path.join(DIST_DIR, 'sprites', `${style}.svg`), sprite, 'utf8');
  }
}
