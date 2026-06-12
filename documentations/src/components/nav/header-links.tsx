import Link from 'next/link';
import { ResourcesMenu } from '@/components/nav/resources-menu';

export function HeaderLinks() {
  return (
    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-fd-muted-foreground ml-4">
      <Link href="/icons" className="hover:text-fd-foreground transition-colors">
        Icons
      </Link>
      <Link href="/docs" className="hover:text-fd-foreground transition-colors">
        Docs
      </Link>
      <ResourcesMenu />
      <Link href="/packages" className="hover:text-fd-foreground transition-colors">
        Packages
      </Link>
    </div>
  );
}
