export const appName = 'My App';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'twinpath',
  repo: 'stria-icons',
  branch: 'main',
};

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://stria-icons.dyzulk.com');

