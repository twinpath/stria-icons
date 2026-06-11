import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Code2, Paintbrush, Zap } from 'lucide-react';

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Why Stria Icons?</h2>
        <p className="text-muted-foreground">Designed for modern workflows and developer experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-background">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Paintbrush className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Consistent Design</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Built on a strict 24x24 grid with consistent stroke widths and corner radii for a cohesive look.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Developer First</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              First-class support for React and Laravel Blade. TypeScript definitions included out of the box.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Optimized & Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              SVGs are aggressively optimized with SVGO to ensure the smallest possible footprint.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Multiple Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Use the core CSS package, React components, or Blade directives. Choose what fits your stack.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
