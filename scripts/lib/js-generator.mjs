import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

/**
 * Phase 6: Generate per-style JS bundles, all.js, and stria.js.
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.iconDataByStyle
 */
export async function generateJsBundles({ DIST_DIR, STYLES, iconDataByStyle }) {
  // Read client-side template files
  const templateStyle = await fs.readFile(path.join(TEMPLATES_DIR, 'replacer-style.js'), 'utf8');
  const templateAll = await fs.readFile(path.join(TEMPLATES_DIR, 'replacer-all.js'), 'utf8');
  const templateApi = await fs.readFile(path.join(TEMPLATES_DIR, 'stria-api.js'), 'utf8');

  // Write the JSON database for each style to dist/data/
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons) continue;
    await fs.writeFile(
      path.join(DIST_DIR, `data/${style}.json`),
      JSON.stringify(icons),
      'utf8'
    );
  }

  // Per-style JS bundles
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons || Object.keys(icons).length === 0) continue;
    
    // Inject style name into the template
    const jsContent = templateStyle.replace('{{STYLE_NAME}}', style);
    await fs.writeFile(path.join(DIST_DIR, `js/${style}.js`), jsContent, 'utf8');
    
    const minifiedStyleJs = (await transform(jsContent, { minify: true })).code;
    await fs.writeFile(path.join(DIST_DIR, `js/${style}.min.js`), minifiedStyleJs, 'utf8');
  }

  // all.js -- combines all styles dynamically
  const allJs = templateAll;
  await fs.writeFile(path.join(DIST_DIR, 'js/all.js'), allJs, 'utf8');
  const minifiedAllJs = (await transform(allJs, { minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'js/all.min.js'), minifiedAllJs, 'utf8');

  // stria.js -- the namespace object with manual replace() method
  const striaJs = templateApi;
  await fs.writeFile(path.join(DIST_DIR, 'js/stria.js'), striaJs, 'utf8');
  const minifiedStriaJs = (await transform(striaJs, { minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'js/stria.min.js'), minifiedStriaJs, 'utf8');
}
