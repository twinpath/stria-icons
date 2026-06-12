import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { HeaderLinks } from '@/components/nav/header-links';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const options = baseOptions();
  return (
    <DocsLayout 
      tree={source.getPageTree()} 
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

