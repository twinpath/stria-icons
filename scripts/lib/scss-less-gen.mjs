import fs from 'fs/promises';
import path from 'path';

/**
 * Phase 4 & 5: Generate SCSS and Less templates.
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string[]} params.STYLES
 * @param {object} params.iconDataByStyle
 */
export async function generatePreprocessors({ DIST_DIR, STYLES, iconDataByStyle }) {
  // ------------------------------------------------------------------
  // Phase 4: SCSS Templates
  // ------------------------------------------------------------------
  let scssVars = `// Stria Icons - SCSS Variables (auto-generated)\n\n`;
  let scssIcons = `// Stria Icons - Icon Content Mappings (auto-generated)\n\n`;

  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons) continue;
    for (const [name, data] of Object.entries(icons)) {
      if (data.unicode) {
        scssVars += `$stria-var-${name}: "\\${data.unicode}";\n`;
      }
    }
  }

  // Mixin for easy usage
  scssIcons += `@mixin stria-icon($content) {\n`;
  scssIcons += `  &::before {\n`;
  scssIcons += `    content: $content;\n`;
  scssIcons += `    display: inline-block;\n`;
  scssIcons += `    font-style: normal;\n`;
  scssIcons += `    font-variant: normal;\n`;
  scssIcons += `    text-rendering: auto;\n`;
  scssIcons += `    -webkit-font-smoothing: antialiased;\n`;
  scssIcons += `  }\n`;
  scssIcons += `}\n`;

  let scssMain = `// Stria Icons - Main SCSS Entry\n\n`;
  scssMain += `@import 'variables';\n`;
  scssMain += `@import 'icons';\n`;

  await fs.writeFile(path.join(DIST_DIR, 'scss/_variables.scss'), scssVars, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'scss/_icons.scss'), scssIcons, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'scss/stria.scss'), scssMain, 'utf8');

  // ------------------------------------------------------------------
  // Phase 5: Less Templates
  // ------------------------------------------------------------------
  let lessVars = `// Stria Icons - Less Variables (auto-generated)\n\n`;
  
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (!icons) continue;
    for (const [name, data] of Object.entries(icons)) {
      if (data.unicode) {
        lessVars += `@stria-var-${name}: "\\${data.unicode}";\n`;
      }
    }
  }

  let lessMixins = `// Stria Icons - Less Mixins (auto-generated)\n\n`;
  lessMixins += `.stria-icon(@content) {\n`;
  lessMixins += `  &::before {\n`;
  lessMixins += `    content: @content;\n`;
  lessMixins += `    display: inline-block;\n`;
  lessMixins += `    font-style: normal;\n`;
  lessMixins += `    font-variant: normal;\n`;
  lessMixins += `    text-rendering: auto;\n`;
  lessMixins += `    -webkit-font-smoothing: antialiased;\n`;
  lessMixins += `  }\n`;
  lessMixins += `}\n`;

  await fs.writeFile(path.join(DIST_DIR, 'less/variables.less'), lessVars, 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'less/mixins.less'), lessMixins, 'utf8');
}
