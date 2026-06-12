import { Tabs, TabsList, TabsTrigger, TabsContent } from 'fumadocs-ui/components/tabs';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { SiNpm, SiPnpm, SiYarn, SiBun, SiComposer } from 'react-icons/si';

interface PackageInstallProps {
  type: 'npm' | 'composer';
  packageName: string;
}

export function PackageInstall({ type, packageName }: PackageInstallProps) {
  if (type === 'npm') {
    return (
      <Tabs defaultValue="npm" groupId="package-manager" persist>
        <TabsList>
          <TabsTrigger value="npm" className="flex items-center gap-1.5">
            <SiNpm className="size-3.5 text-[#CB3837]" />
            npm
          </TabsTrigger>
          <TabsTrigger value="pnpm" className="flex items-center gap-1.5">
            <SiPnpm className="size-3.5 text-[#F69220]" />
            pnpm
          </TabsTrigger>
          <TabsTrigger value="yarn" className="flex items-center gap-1.5">
            <SiYarn className="size-3.5 text-[#2C8EBB]" />
            yarn
          </TabsTrigger>
          <TabsTrigger value="bun" className="flex items-center gap-1.5">
            <SiBun className="size-3.5 text-[#4A4A4A] dark:text-[#F9F1E1]" />
            bun
          </TabsTrigger>
        </TabsList>
        <TabsContent value="npm">
          <ServerCodeBlock code={`npm install ${packageName}`} lang="bash" />
        </TabsContent>
        <TabsContent value="pnpm">
          <ServerCodeBlock code={`pnpm add ${packageName}`} lang="bash" />
        </TabsContent>
        <TabsContent value="yarn">
          <ServerCodeBlock code={`yarn add ${packageName}`} lang="bash" />
        </TabsContent>
        <TabsContent value="bun">
          <ServerCodeBlock code={`bun add ${packageName}`} lang="bash" />
        </TabsContent>
      </Tabs>
    );
  }

  if (type === 'composer') {
    return (
      <Tabs defaultValue="composer" groupId="php-manager">
        <TabsList>
          <TabsTrigger value="composer" className="flex items-center gap-1.5">
            <SiComposer className="size-3.5 text-[#885630]" />
            composer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="composer">
          <ServerCodeBlock code={`composer require ${packageName}`} lang="bash" />
        </TabsContent>
      </Tabs>
    );
  }

  return null;
}
