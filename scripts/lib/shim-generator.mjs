import fs from 'fs/promises';
import path from 'path';
import { transform } from 'esbuild';
import { exists } from '../utils/file-system.mjs';

/**
 * Phase 7: Generate v4 compatibility shims (CSS + JS).
 * @param {object} params
 * @param {string} params.DIST_DIR
 * @param {string} params.SHIMS_PATH
 */
export async function generateShims({ DIST_DIR, SHIMS_PATH }) {
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
    const [oldName, , newName] = entry;
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
}
