export const appName = 'My App';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'twinpath',
  repo: 'stria-icons',
  branch: 'main',
  dir: 'documentations',
};

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 
  (typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://stria-icons.dyzulk.com'));

export const appUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
  ? rawUrl 
  : `https://${rawUrl}`;

