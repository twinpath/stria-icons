import { NextResponse } from 'next/server';

function toCamelCase(str: string) {
  let safeName = str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
  if (/^[0-9]/.test(safeName)) {
    safeName = `_${safeName}`;
  }
  return safeName;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') || 'solid';

  try {
    const res = await fetch(`https://cdn.jsdelivr.net/npm/stria-icons@0.1.6/dist/data/${style}.json`, {
      next: { revalidate: 86400 } // cache on CDN / edge for 24 hours
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${style} icons from CDN: ${res.statusText}`);
    }
    const rawIcons = await res.json() as Record<string, unknown>;
    
    // Convert kebab-case keys to camelCase to match ESM module export naming
    const icons: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawIcons)) {
      icons[toCamelCase(key)] = value;
    }
    
    // Convert to an array or an object that is easy to consume on the client
    // By returning JSON, we prevent Next.js from creating thousands of client chunks
    return NextResponse.json({ icons });
  } catch (error) {
    console.error(`Failed to load icons for style: ${style}`, error);
    return NextResponse.json({ error: 'Failed to load icons' }, { status: 500 });
  }
}
