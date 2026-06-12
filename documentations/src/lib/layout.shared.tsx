import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { ResourcesMenu } from '@/components/nav/resources-menu';

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
        type: 'custom',
        on: 'nav',
        children: <ResourcesMenu />,
      },
      {
        text: 'Resources',
        url: '/resources/license',
        on: 'menu',
      },
      {
        text: 'Packages',
        url: '/packages',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
