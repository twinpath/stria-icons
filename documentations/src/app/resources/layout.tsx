import React from 'react';
import { resourcesSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { HeaderLinks } from '@/components/nav/header-links';
import { Logo } from '@/components/Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const options = baseOptions();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom Desktop Topbar yang benar-benar terpisah dari Sidebar */}
      <header className="hidden md:flex fixed top-0 inset-x-0 h-14 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center">
          <HeaderLinks className="hidden md:flex ml-4" />
        </div>
      </header>

      {/* Docs Layout utama */}
      <div className="md:pt-14 flex-1 flex flex-col">
        <DocsLayout 
          tree={resourcesSource.getPageTree()} 
          {...options}
          links={[]}
          sidebar={{
            ...options.sidebar,
            banner: <HeaderLinks className="md:hidden flex-col items-start px-4 py-4 gap-4 border-b border-border/50" />
          }}
          nav={{
            ...options.nav,
            title: <span className="md:hidden"><Logo /></span>,
            children: undefined,
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </div>
  );
}
