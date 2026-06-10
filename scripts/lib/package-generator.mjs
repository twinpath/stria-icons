import fs from 'fs/promises';
import path from 'path';

/**
 * Phase 8: Generate ESM, CJS, and TypeScript declarations.
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.iconDataByStyle
 */
export async function generatePackageModules({ DIST_DIR, STYLES, iconDataByStyle }) {
  // Create ESM and CJS base directories
  await fs.mkdir(path.join(DIST_DIR, 'esm'), { recursive: true });
  await fs.mkdir(path.join(DIST_DIR, 'cjs'), { recursive: true });

  let esmIndexContent = '';
  let cjsIndexContent = '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n';

  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons) continue;

    const esmStyleDir = path.join(DIST_DIR, 'esm', style);
    const cjsStyleDir = path.join(DIST_DIR, 'cjs', style);

    await fs.mkdir(esmStyleDir, { recursive: true });
    await fs.mkdir(cjsStyleDir, { recursive: true });

    let esmStyleIndexContent = '';
    let cjsStyleIndexContent = '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n';

    const iconNames = Object.keys(icons);
    for (const iconName of iconNames) {
      const icon = icons[iconName];
      const dataStr = JSON.stringify(icon);

      // Write individual ESM icon file
      await fs.writeFile(
        path.join(esmStyleDir, `${iconName}.js`),
        `export default ${dataStr};\n`,
        'utf8'
      );

      // Write individual CJS icon file
      await fs.writeFile(
        path.join(cjsStyleDir, `${iconName}.js`),
        `module.exports = ${dataStr};\n`,
        'utf8'
      );

      // Make safe variable name for exports (camelCase, prepending '_' if starting with a digit)
      let safeName = iconName.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
      if (/^[0-9]/.test(safeName)) {
        safeName = `_${safeName}`;
      }

      esmStyleIndexContent += `export { default as ${safeName} } from './${iconName}.js';\n`;
      cjsStyleIndexContent += `exports.${safeName} = require('./${iconName}.js');\n`;
    }

    // Write style index files
    await fs.writeFile(path.join(esmStyleDir, 'index.js'), esmStyleIndexContent, 'utf8');
    await fs.writeFile(path.join(cjsStyleDir, 'index.js'), cjsStyleIndexContent, 'utf8');

    // Add style to main index
    esmIndexContent += `import * as ${style} from './${style}/index.js';\nexport { ${style} };\n\n`;
    cjsIndexContent += `exports.${style} = require('./${style}/index.js');\n`;
  }

  // Write main index files
  await fs.writeFile(path.join(DIST_DIR, 'esm/index.mjs'), esmIndexContent, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'cjs/index.cjs'), cjsIndexContent, 'utf8');

  // Generate TypeScript typings
  let dtsContent = `export interface IconData {\n  paths: string | string[];\n  viewBox: string;\n  unicode: string;\n}\n\n`;
  for (const style of STYLES) {
    dtsContent += `export declare const ${style}: Record<string, IconData>;\n`;
  }
  await fs.writeFile(path.join(DIST_DIR, 'types/index.d.ts'), dtsContent, 'utf8');
}
