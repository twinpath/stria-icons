import fs from 'fs/promises';

/**
 * Check if a file or directory exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract path data (d attribute) from SVG content.
 * @param {string} svgContent
 * @returns {string|string[]}
 */
export function extractPathData(svgContent) {
  const matches = [...svgContent.matchAll(/<path[^>]*d="([^"]+)"/g)];
  return matches.map(m => m[1]);
}

/**
 * Extract viewBox attribute from SVG content.
 * @param {string} svgContent
 * @returns {string}
 */
export function extractViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 24 24';
}
