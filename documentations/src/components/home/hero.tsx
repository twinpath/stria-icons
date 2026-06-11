import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-32 sm:py-40 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-[800px] flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Beautiful, consistent icons for your next project.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-[600px]">
          A meticulously crafted collection of open-source icons. Available as SVG, React components, and Laravel Blade components.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/docs/vanilla">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/icons">Browse Icons</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
