import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

interface PackageInstallProps {
  type: 'npm' | 'composer';
  packageName: string;
}

export function PackageInstall({ type, packageName }: PackageInstallProps) {
  if (type === 'npm') {
    return (
      <Tabs items={['npm', 'pnpm', 'yarn', 'bun']} groupId="package-manager" persist>
        <Tab value="npm">
          <CodeBlock keepBackground>
            <Pre>{`npm install ${packageName}`}</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="pnpm">
          <CodeBlock keepBackground>
            <Pre>{`pnpm add ${packageName}`}</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="yarn">
          <CodeBlock keepBackground>
            <Pre>{`yarn add ${packageName}`}</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="bun">
          <CodeBlock keepBackground>
            <Pre>{`bun add ${packageName}`}</Pre>
          </CodeBlock>
        </Tab>
      </Tabs>
    );
  }

  if (type === 'composer') {
    return (
      <Tabs items={['composer']} groupId="php-manager">
        <Tab value="composer">
          <CodeBlock keepBackground>
            <Pre>{`composer require ${packageName}`}</Pre>
          </CodeBlock>
        </Tab>
      </Tabs>
    );
  }

  return null;
}
