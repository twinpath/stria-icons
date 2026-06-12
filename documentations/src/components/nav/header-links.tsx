"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResourcesMenu } from '@/components/nav/resources-menu';
import { cn } from '@/lib/utils'; // asumsikan file utils.ts ada untuk classnames

export function HeaderLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-4 text-sm font-medium text-fd-muted-foreground", className)}>
      <Link 
        href="/icons" 
        className={cn(
          "hover:text-fd-foreground transition-colors",
          pathname.startsWith('/icons') && "text-fd-foreground"
        )}
      >
        Icons
      </Link>
      <Link 
        href="/docs" 
        className={cn(
          "hover:text-fd-foreground transition-colors",
          pathname.startsWith('/docs') && "text-fd-foreground"
        )}
      >
        Docs
      </Link>
      <ResourcesMenu isActive={pathname.startsWith('/resources')} />
      <Link 
        href="/packages" 
        className={cn(
          "hover:text-fd-foreground transition-colors",
          pathname.startsWith('/packages') && "text-fd-foreground"
        )}
      >
        Packages
      </Link>
    </div>
  );
}
