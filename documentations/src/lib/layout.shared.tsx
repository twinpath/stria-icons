import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        text: 'Icons',
        url: '/icons',
        active: 'nested-url',
      },
      {
        text: 'Docs',
        url: '/docs/vanilla',
        active: 'nested-url',
      },
      {
        text: 'Resources',
        url: '/resources',
      },
      {
        text: 'Packages',
        url: '/packages',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
