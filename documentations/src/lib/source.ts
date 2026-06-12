import { docs, resources } from 'collections/server';
import { loader, type LoaderPlugin } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { createElement } from 'react';
import { customIcons } from './custom-icons';

function customIconsPlugin(): LoaderPlugin {
  const replaceIcon = (node: any) => {
    if (typeof node.icon === 'string' && node.icon in customIcons) {
      node.icon = createElement(customIcons[node.icon]);
    }
    return node;
  };

  return {
    name: 'custom-icons',
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [customIconsPlugin(), lucideIconsPlugin()],
});

export const resourcesSource = loader({
  baseUrl: '/resources',
  source: resources.toFumadocsSource(),
  plugins: [customIconsPlugin(), lucideIconsPlugin()],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
