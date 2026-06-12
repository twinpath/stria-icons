import React from 'react';
import { resourcesSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { HeaderLinks } from '@/components/nav/header-links';

export default function Layout({ children }: { children: React.ReactNode }) {
  const options = baseOptions();
  return (
    <DocsLayout 
      tree={resourcesSource.getPageTree()} 
      {...options}
      links={[]}
      nav={{
        ...options.nav,
        children: <HeaderLinks />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
