"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { Scale, Users, ShieldAlert, Award, Sparkles } from "lucide-react";

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  {
    title: "License",
    description: "ISC License and open-source terms of use for Stria Icons.",
    href: "/resources/license",
    icon: Scale,
  },
  {
    title: "Community",
    description: "Connect with us on Discord, follow on X, or discuss on GitHub.",
    href: "/resources/community",
    icon: Users,
  },
  {
    title: "Code of Conduct",
    description: "Our core principles for keeping our community welcoming and safe.",
    href: "/resources/code-of-conduct",
    icon: ShieldAlert,
  },
  {
    title: "Brand Logo Statement",
    description: "Understanding our design guidelines regarding brand mark inclusions.",
    href: "/resources/brand-logo-statement",
    icon: Award,
  },
  {
    title: "Contributing",
    description: "Submit new icon requests, optimize SVGs, or send pull requests.",
    href: "/resources/contribute",
    icon: Sparkles,
  },
];

export function ResourcesMenu({ isActive }: { isActive?: boolean }) {
  return (
    <Popover>
      <PopoverTrigger className={cn(
        "text-sm font-medium hover:text-fd-foreground transition-colors cursor-pointer outline-none",
        isActive && "text-fd-foreground"
      )}>
        Resources
      </PopoverTrigger>
      <PopoverContent align="center" className="p-4 w-[500px] sm:w-[600px] border border-border/40 bg-popover rounded-xl shadow-lg ring-1 ring-foreground/5 duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex gap-3 p-3.5 rounded-xl border border-border/30 bg-card hover:bg-accent/40 hover:border-accent-foreground/10 transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-200">
                  <Icon className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5 justify-center min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
