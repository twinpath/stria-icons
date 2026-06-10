import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Konfigurasi Jalur Folder Terpusat
const PATHS = {
  iconsSource: 'icons',
  corePackage: 'packages/stria-icons-core',
  metadata: 'metadata/icons.json',
  shims: 'metadata/shims.json'
};

const SRC_DIR = path.join(ROOT_DIR, PATHS.iconsSource);
const CORE_DIR = path.join(ROOT_DIR, PATHS.corePackage);
const DIST_DIR = path.join(CORE_DIR, 'dist');
const METADATA_PATH = path.join(ROOT_DIR, PATHS.metadata);
const SHIMS_PATH = path.join(ROOT_DIR, PATHS.shims);

const STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];

// Style abbreviations used in font-face CSS class naming
const STYLE_PREFIX = {
  solid: 'st-solid',
  regular: 'st-regular',
  light: 'st-light',
  thin: 'st-thin',
  duotone: 'st-duotone',
  brands: 'st-brands',
};

// FA prefix -> Stria style mapping for shims
const FA_PREFIX_MAP = {
  fas: 'solid',
  far: 'regular',
  fal: 'light',
  fat: 'thin',
  fad: 'duotone',
  fab: 'brands',
};

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function extractPathData(svgContent) {
  const matches = [...svgContent.matchAll(/<path[^>]*d="([^"]+)"/g)];
  if (matches.length === 0) return '';
  if (matches.length === 1) return matches[0][1];
  return matches.map(m => m[1]);
}

function extractViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 24 24';
}

async function run() {
  console.log(`Building core ${PATHS.corePackage}...`);

  if (!(await exists(METADATA_PATH))) {
    console.error('metadata/icons.json not found. Run "pnpm metadata" first.');
    process.exit(1);
  }

  const catalog = JSON.parse(await fs.readFile(METADATA_PATH, 'utf8'));

  // Create all output directories
  const dirs = [
    'svg', 'sprites', 'webfonts', 'scss', 'less',
    'css', 'js', 'esm', 'cjs', 'types',
  ];
  for (const d of dirs) {
    await fs.mkdir(path.join(DIST_DIR, d), { recursive: true });
  }

  await fs.writeFile(path.join(DIST_DIR, 'icons.json'), JSON.stringify(catalog, null, 2), 'utf8');

  // ------------------------------------------------------------------
  // Phase 1: Copy optimized SVGs and collect path data
  // ------------------------------------------------------------------
  const iconDataByStyle = {};
  for (const style of STYLES) iconDataByStyle[style] = {};

  for (const style of STYLES) {
    const srcStyleDir = path.join(SRC_DIR, style);
    const distStyleDir = path.join(DIST_DIR, 'svg', style);
    if (!(await exists(srcStyleDir))) continue;
    await fs.mkdir(distStyleDir, { recursive: true });

    const files = await fs.readdir(srcStyleDir);
    for (const file of files) {
      if (!file.endsWith('.svg')) continue;
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
    }
  }

  // ------------------------------------------------------------------
  // Phase 2: SVG Sprites (one per style)
  // ------------------------------------------------------------------
  console.log('Generating SVG sprite sheets...');
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (Object.keys(icons).length === 0) continue;

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

  // ------------------------------------------------------------------
  // Phase 3: CSS Stylesheets (per-style + all + base)
  // ------------------------------------------------------------------
  console.log('Generating CSS stylesheets...');

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
    if (Object.keys(icons).length === 0) continue;

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

  // ------------------------------------------------------------------
  // Phase 4: SCSS Templates
  // ------------------------------------------------------------------
  console.log('Generating SCSS templates...');

  let scssVars = `// Stria Icons - SCSS Variables (auto-generated)\n\n`;
  let scssIcons = `// Stria Icons - Icon Content Mappings (auto-generated)\n\n`;

  for (const style of STYLES) {
    for (const [name, data] of Object.entries(iconDataByStyle[style])) {
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
  console.log('Generating Less templates...');

  let lessVars = `// Stria Icons - Less Variables (auto-generated)\n\n`;
  for (const style of STYLES) {
    for (const [name, data] of Object.entries(iconDataByStyle[style])) {
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

  // ------------------------------------------------------------------
  // Phase 6: Per-style JS bundles (SVG-with-JS) + all.js
  // ------------------------------------------------------------------
  console.log('Generating per-style JS bundles...');

  function buildReplacerJs(styleName, iconData) {
    return `(function () {
  'use strict';
  var icons = ${JSON.stringify(iconData)};
  var style = '${styleName}';

  function replaceIcons() {
    var selectors = [
      '.stria-' + style,
      '[class*="st-' + style + '"]'
    ];
    var elements = document.querySelectorAll(selectors.join(','));

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var classList = el.className.split(' ');
      var iconName = null;

      for (var j = 0; j < classList.length; j++) {
        var cls = classList[j].trim();
        if (cls.startsWith('stria-') && cls !== 'stria-' + style) {
          iconName = cls.replace('stria-', '');
        } else if (cls.startsWith('st-') && cls !== 'st-' + style) {
          iconName = cls.replace('st-', '');
        }
      }

      if (!iconName || !icons[iconName]) continue;
      var icon = icons[iconName];

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('class', el.className);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '1em';
      svg.style.height = '1em';
      svg.style.verticalAlign = '-0.125em';

      var paths = Array.isArray(icon.paths) ? icon.paths : [icon.paths];
      for (var k = 0; k < paths.length; k++) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', paths[k]);
        svg.appendChild(p);
      }

      el.parentNode.replaceChild(svg, el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceIcons);
  } else {
    replaceIcons();
  }
})();
`;
  }

  // Per-style JS bundles
  for (const style of STYLES) {
    const icons = iconDataByStyle[style];
    if (Object.keys(icons).length === 0) continue;
    const jsContent = buildReplacerJs(style, icons);
    await fs.writeFile(path.join(DIST_DIR, `js/${style}.js`), jsContent, 'utf8');
    const minifiedStyleJs = (await transform(jsContent, { minify: true })).code;
    await fs.writeFile(path.join(DIST_DIR, `js/${style}.min.js`), minifiedStyleJs, 'utf8');
  }

  // all.js -- combines all styles
  let allJs = `(function () {
  'use strict';
  var iconsByStyle = ${JSON.stringify(iconDataByStyle)};

  function replaceIcons() {
    var elements = document.querySelectorAll('[class*="stria-"], [class*="st-"], [data-stria]');

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var iconName = el.getAttribute('data-stria');
      var styleName = el.getAttribute('data-stria-style') || 'solid';

      if (!iconName) {
        var classList = el.className.split(' ');
        for (var j = 0; j < classList.length; j++) {
          var cls = classList[j].trim();
          if (cls.startsWith('stria-') && ['solid','regular','light','thin','duotone','brands'].indexOf(cls.replace('stria-','')) !== -1) {
            styleName = cls.replace('stria-', '');
          } else if (cls.startsWith('st-') && ['solid','regular','light','thin','duotone','brands'].indexOf(cls.replace('st-','')) !== -1) {
            styleName = cls.replace('st-', '');
          } else if (cls.startsWith('stria-')) {
            iconName = cls.replace('stria-', '');
          } else if (cls.startsWith('st-') && cls !== 'st-solid' && cls !== 'st-regular' && cls !== 'st-light' && cls !== 'st-thin' && cls !== 'st-duotone' && cls !== 'st-brands') {
            iconName = cls.replace('st-', '');
          }
        }
      }

      if (!iconName) continue;
      var styleIcons = iconsByStyle[styleName];
      if (!styleIcons || !styleIcons[iconName]) continue;
      var icon = styleIcons[iconName];

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('class', el.className);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '1em';
      svg.style.height = '1em';
      svg.style.verticalAlign = '-0.125em';

      var paths = Array.isArray(icon.paths) ? icon.paths : [icon.paths];
      for (var k = 0; k < paths.length; k++) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', paths[k]);
        if (styleName === 'duotone' && k === 0) {
          p.setAttribute('class', 'stria-secondary');
          p.style.opacity = '0.4';
        }
        svg.appendChild(p);
      }

      el.parentNode.replaceChild(svg, el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceIcons);
  } else {
    replaceIcons();
  }
})();
`;
  await fs.writeFile(path.join(DIST_DIR, 'js/all.js'), allJs, 'utf8');
  const minifiedAllJs = (await transform(allJs, { minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'js/all.min.js'), minifiedAllJs, 'utf8');

  // stria.js -- the namespace object with manual replace() method
  const striaJs = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stria = {}));
})(this, (function (exports) { 'use strict';

  var icons = ${JSON.stringify(iconDataByStyle)};

  function replace(options) {
    var opts = options || {};
    var attribute = opts.attribute || 'data-stria';
    var styleAttribute = opts.styleAttribute || 'data-stria-style';
    var defaultStyle = opts.defaultStyle || 'regular';

    var elements = document.querySelectorAll('[' + attribute + ']');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var name = el.getAttribute(attribute);
      var style = el.getAttribute(styleAttribute) || defaultStyle;
      var icon = icons[style] && icons[style][name];
      if (!icon) continue;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '1em';
      svg.style.height = '1em';

      for (var j = 0; j < el.attributes.length; j++) {
        var attr = el.attributes[j];
        if (attr.name !== attribute && attr.name !== styleAttribute) {
          svg.setAttribute(attr.name, attr.value);
        }
      }

      var paths = Array.isArray(icon.paths) ? icon.paths : [icon.paths];
      for (var k = 0; k < paths.length; k++) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', paths[k]);
        if (style === 'duotone' && k === 0) {
          p.setAttribute('class', 'stria-secondary');
          p.style.opacity = '0.4';
        }
        svg.appendChild(p);
      }

      el.parentNode.replaceChild(svg, el);
    }
  }

  exports.icons = icons;
  exports.replace = replace;
  Object.defineProperty(exports, '__esModule', { value: true });
}));
`;
  await fs.writeFile(path.join(DIST_DIR, 'js/stria.js'), striaJs, 'utf8');
  const minifiedStriaJs = (await transform(striaJs, { minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'js/stria.min.js'), minifiedStriaJs, 'utf8');

  // ------------------------------------------------------------------
  // Phase 7: v4-shims (CSS + JS)
  // ------------------------------------------------------------------
  console.log('Generating v4-shims...');

  let shimsData = [];
  if (await exists(SHIMS_PATH)) {
    shimsData = JSON.parse(await fs.readFile(SHIMS_PATH, 'utf8'));
  }

  let shimsCss = `/* Stria Icons - v4 Compatibility Shims (auto-generated) */\n\n`;
  let shimsJs = `/* Stria Icons - v4 Shims JS (auto-generated) */\n`;
  shimsJs += `(function () {\n`;
  shimsJs += `  'use strict';\n`;
  shimsJs += `  var shims = {\n`;

  for (const entry of shimsData) {
    const [oldName, prefixHint, newName] = entry;
    const resolvedName = newName || oldName;

    // CSS shim: alias old class to new
    shimsCss += `.stria-${oldName} { /* alias for ${resolvedName} */ }\n`;

    // JS shim entry
    shimsJs += `    '${oldName}': '${resolvedName}',\n`;
  }

  shimsJs += `  };\n\n`;
  shimsJs += `  document.addEventListener('DOMContentLoaded', function () {\n`;
  shimsJs += `    var elements = document.querySelectorAll('[class*="stria-"]');\n`;
  shimsJs += `    for (var i = 0; i < elements.length; i++) {\n`;
  shimsJs += `      var el = elements[i];\n`;
  shimsJs += `      var classes = el.className.split(' ');\n`;
  shimsJs += `      for (var j = 0; j < classes.length; j++) {\n`;
  shimsJs += `        var cls = classes[j].replace('stria-', '');\n`;
  shimsJs += `        if (shims[cls]) {\n`;
  shimsJs += `          el.classList.remove('stria-' + cls);\n`;
  shimsJs += `          el.classList.add('stria-' + shims[cls]);\n`;
  shimsJs += `        }\n`;
  shimsJs += `      }\n`;
  shimsJs += `    }\n`;
  shimsJs += `  });\n`;
  shimsJs += `})();\n`;

  await fs.writeFile(path.join(DIST_DIR, 'css/v4-shims.css'), shimsCss, 'utf8');
  const minifiedShimsCss = (await transform(shimsCss, { loader: 'css', minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'css/v4-shims.min.css'), minifiedShimsCss, 'utf8');

  await fs.writeFile(path.join(DIST_DIR, 'js/v4-shims.js'), shimsJs, 'utf8');
  const minifiedShimsJs = (await transform(shimsJs, { minify: true })).code;
  await fs.writeFile(path.join(DIST_DIR, 'js/v4-shims.min.js'), minifiedShimsJs, 'utf8');

  // ------------------------------------------------------------------
  // Phase 8: ESM, CJS, TypeScript Declarations
  // ------------------------------------------------------------------
  console.log('Generating ESM, CJS, and TypeScript declarations...');

  let esmContent = '';
  for (const style of STYLES) {
    esmContent += `export const ${style} = ${JSON.stringify(iconDataByStyle[style])};\n\n`;
  }
  await fs.writeFile(path.join(DIST_DIR, 'esm/index.mjs'), esmContent, 'utf8');

  let cjsContent = '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n';
  for (const style of STYLES) {
    cjsContent += `exports.${style} = ${JSON.stringify(iconDataByStyle[style])};\n\n`;
  }
  await fs.writeFile(path.join(DIST_DIR, 'cjs/index.cjs'), cjsContent, 'utf8');

  let dtsContent = `export interface IconData {\n  paths: string | string[];\n  viewBox: string;\n  unicode: string;\n}\n\n`;
  for (const style of STYLES) {
    dtsContent += `export declare const ${style}: Record<string, IconData>;\n`;
  }
  await fs.writeFile(path.join(DIST_DIR, 'types/index.d.ts'), dtsContent, 'utf8');

  // ------------------------------------------------------------------
  // Done
  // ------------------------------------------------------------------
  const totalIcons = Object.values(iconDataByStyle).reduce((sum, s) => sum + Object.keys(s).length, 0);
  console.log(`Core build complete. Total icon entries across all styles: ${totalIcons}`);
}

run().catch(err => {
  console.error('Error in core build:', err);
  process.exit(1);
});
