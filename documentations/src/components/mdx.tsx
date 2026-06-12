import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PackageInstall } from './mdx/package-install';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PackageInstall,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
