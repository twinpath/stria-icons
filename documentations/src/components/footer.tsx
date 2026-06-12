import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { gitConfig } from '@/lib/shared';
import { customIcons } from '@/lib/custom-icons';

export function Footer() {
  return (
    <footer className="w-full border-t border-fd-border bg-fd-background/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
            target="_blank"
            rel="noreferrer"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <customIcons.SiGithub className="h-6 w-6" />
          </Link>
          <Link
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/issues`}
            target="_blank"
            rel="noreferrer"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <span className="sr-only">Report an Issue</span>
            <customIcons.VscIssues className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2 mb-4">
            <Logo />
          </div>
          <p className="text-center text-sm leading-5 text-fd-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Stria Icons. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 text-sm text-fd-muted-foreground">
            <Link href="/icons" className="hover:text-fd-foreground transition-colors">
              Icons
            </Link>
            <Link href="/docs" className="hover:text-fd-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/packages" className="hover:text-fd-foreground transition-colors">
              Packages
            </Link>
            <Link href="/resources/license" className="hover:text-fd-foreground transition-colors">
              License
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
