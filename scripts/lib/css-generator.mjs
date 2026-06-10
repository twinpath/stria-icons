import fs from 'fs/promises';
import path from 'path';
import { transform } from 'esbuild';

/**
 * Phase 3: Generate CSS stylesheets (per-style + all + base).
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.STYLE_PREFIX
 * @param {object} params.iconDataByStyle
 */
export async function generateCss({ DIST_DIR, STYLES, STYLE_PREFIX, iconDataByStyle }) {
  // Base stylesheet with @font-face rules
  let baseCss = `/* Stria Icons - Base Styles & Font Face Rules */\n\n`;
  
  for (const style of STYLES) {
    if (style === 'duotone') continue; // No webfont for duotone
    
    baseCss += `@font-face {\n`;
    baseCss += `  font-family: 'Stria ${style.charAt(0).toUpperCase() + style.slice(1)}';\n`;
    baseCss += `  font-style: normal;\n`;
    baseCss += `  font-weight: 400;\n`;
    baseCss += `  font-display: block;\n`;
    baseCss += `  src: url('../webfonts/${style}/stria-${style}.woff2') format('woff2'),\n`;
    baseCss += `       url('../webfonts/${style}/stria-${style}.woff') format('woff'),\n`;
    baseCss += `       url('../webfonts/${style}/stria-${style}.ttf') format('truetype');\n`;
    baseCss += `}\n\n`;
  }

  // Icon base class
  baseCss += `.stria,\n[class^="st-"],\n[class*=" st-"] {\n`;
  baseCss += `  display: inline-block;\n`;
  baseCss += `  font-style: normal;\n`;
  baseCss += `  font-variant: normal;\n`;
  baseCss += `  text-rendering: auto;\n`;
  baseCss += `  line-height: 1;\n`;
  baseCss += `  -webkit-font-smoothing: antialiased;\n`;
  baseCss += `  -moz-osx-font-smoothing: grayscale;\n`;
  baseCss += `}\n\n`;

  // Per-style font family assignments
  for (const style of STYLES) {
    if (style === 'duotone') continue;
    baseCss += `.${STYLE_PREFIX[style]} {\n`;
    baseCss += `  font-family: 'Stria ${style.charAt(0).toUpperCase() + style.slice(1)}';\n`;
    baseCss += `}\n\n`;
  }

  await fs.writeFile(path.join(DIST_DIR, 'css/stria.css'), baseCss, 'utf8');

  // Per-style CSS files (containing ::before content rules for that style)
  let allCss = baseCss; // all.css starts with the base

  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons || Object.keys(icons).length === 0) continue;

    let styleCss = `/* Stria Icons - ${style.charAt(0).toUpperCase() + style.slice(1)} */\n\n`;

    // CSS Mask approach (works for all styles including duotone)
    styleCss += `.stria-${style} {\n`;
    styleCss += `  display: inline-block;\n`;
    styleCss += `  width: 1em;\n`;
    styleCss += `  height: 1em;\n`;
    styleCss += `  background-color: currentColor;\n`;
    styleCss += `  -webkit-mask-size: contain;\n`;
    styleCss += `  mask-size: contain;\n`;
    styleCss += `  -webkit-mask-repeat: no-repeat;\n`;
    styleCss += `  mask-repeat: no-repeat;\n`;
    styleCss += `  -webkit-mask-position: center;\n`;
    styleCss += `  mask-position: center;\n`;
    styleCss += `}\n\n`;

    for (const [name, data] of Object.entries(icons)) {
      // CSS mask class
      styleCss += `.stria-${style}.stria-${name} {\n`;
      styleCss += `  -webkit-mask-image: url('../svg/${style}/${name}.svg');\n`;
      styleCss += `  mask-image: url('../svg/${style}/${name}.svg');\n`;
      styleCss += `}\n`;

      // Font-face class (only if style has a webfont)
      if (style !== 'duotone' && data.unicode) {
        styleCss += `.${STYLE_PREFIX[style]}.st-${name}::before {\n`;
        styleCss += `  content: "\\${data.unicode}";\n`;
        styleCss += `}\n`;
      }
    }

    await fs.writeFile(path.join(DIST_DIR, `css/${style}.css`), styleCss, 'utf8');
    const minifiedStyleCss = (await transform(styleCss, { loader: 'css', minify: true })).code;
    await fs.writeFile(path.join(DIST_DIR, `css/${style}.min.css`), minifiedStyleCss, 'utf8');
    allCss += `\n` + styleCss;
  }

  await fs.writeFile(path.join(DIST_DIR, 'css/all.css'), allCss, 'utf8');

  // Minified versions using esbuild transform
  const minifiedAllCss = (await transform(allCss, { loader: 'css', minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'css/all.min.css'), minifiedAllCss, 'utf8');

  const minifiedBaseCss = (await transform(baseCss, { loader: 'css', minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'css/stria.min.css'), minifiedBaseCss, 'utf8');
}
