import IconsPageClient from './icons-page-client';

export const revalidate = 86400; // Cache for 24 hours

export default async function IconsPage() {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/stria-icons@0.1.6/dist/icons.json', {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch icons metadata: ${res.statusText}`);
    }
    const iconsMetadata = (await res.json()) as any;
    return <IconsPageClient iconsMetadata={iconsMetadata} />;
  } catch (error) {
    console.error('Failed to load icons metadata on server:', error);
    // Return empty object as fallback to prevent crash
    return <IconsPageClient iconsMetadata={{}} />;
  }
}
