import fs from 'fs/promises';
import path from 'path';
import { generateFonts } from 'fantasticon';
import { exists } from '../utils/file-system.mjs';

// Duotone is excluded from webfont generation because it uses multi-path SVGs.
// It is handled via SVG sprites and JS replacers instead.
const FONT_STYLES = ['solid', 'regular', 'light', 'thin', 'brands'];

/**
 * Generate webfonts from optimized SVGs.
 * @param {object} params
 * @param {string} params.DIST_DIR
 */
export async function generateWebfonts({ DIST_DIR }) {
  const SVG_DIST_DIR = path.join(DIST_DIR, 'svg');
  const WEBFONTS_DIR = path.join(DIST_DIR, 'webfonts');

  await fs.mkdir(WEBFONTS_DIR, { recursive: true });

  for (const style of FONT_STYLES) {
    const inputDir = path.join(SVG_DIST_DIR, style);
    if (!(await exists(inputDir))) {
      console.log(`Skipping style "${style}" -- no SVG directory found.`);
      continue;
    }

    const outputDir = path.join(WEBFONTS_DIR, style);
    await fs.mkdir(outputDir, { recursive: true });

    const fontName = `stria-${style}`;

    console.log(`Generating webfont for style: ${style}...`);

    try {
      await generateFonts({
        inputDir: path.relative(process.cwd(), inputDir).replace(/\\/g, '/'),
        outputDir: path.relative(process.cwd(), outputDir).replace(/\\/g, '/'),
        name: fontName,
        fontTypes: ['woff2', 'woff', 'ttf'],
        assetTypes: [],
        normalize: true,
        fontHeight: 1000,
        descent: 0,
        round: 10e12,
        formatOptions: {
          svg: {
            metadata: `Copyright (c) 2026 Stria Icons Authors. Licensed under CC BY 4.0.`,
            ascent: 850,
            descent: -150,
          },
        },
        getIconId: ({ basename }) => basename,
      });

      console.log(`  -> ${fontName}.woff2, ${fontName}.woff, ${fontName}.ttf`);
    } catch (err) {
      console.error(`Error generating webfont for style "${style}":`, err.message || err);
    }
  }
}
