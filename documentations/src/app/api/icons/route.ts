import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') || 'solid';

  try {
    const stria = await import('stria-icons');
    const icons = (stria as any)[style];
    
    // Convert to an array or an object that is easy to consume on the client
    // By returning JSON, we prevent Next.js from creating thousands of client chunks
    return NextResponse.json({ icons });
  } catch (error) {
    console.error(`Failed to load icons for style: ${style}`, error);
    return NextResponse.json({ error: 'Failed to load icons' }, { status: 500 });
  }
}
