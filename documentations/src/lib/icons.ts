import { IconStyle } from '@/types/icon';

/**
 * Fetches the icon definitions for a specific style from the local API Route.
 * This avoids bundling 2800+ icons into the Next.js client chunks.
 */
export async function loadIconsForStyle(style: IconStyle) {
  try {
    const res = await fetch(`/api/icons?style=${style}`);
    if (!res.ok) throw new Error('Failed to fetch icons');
    const data = await res.json();
    return data.icons;
  } catch (error) {
    console.error(`Failed to load stria-icons for style: ${style}`, error);
    return null;
  }
}

