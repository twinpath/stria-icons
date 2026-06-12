import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PackageInstall } from './mdx/package-install';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'fumadocs-ui/components/tabs';
import { customIcons } from '../lib/custom-icons';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PackageInstall,
    Tabs,
    TabsList,
    TabList: TabsList,
    TabsTrigger,
    TabsContent,
    ...customIcons,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
