import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PackagesPage() {
  const packages = [
    {
      name: '@stria-icons/core',
      version: '1.0.0',
      description: 'The core package containing CSS, optimized SVGs, and SVG sprites for use in any vanilla web project.',
      installCommand: 'npm install @stria-icons/core',
      tags: ['css', 'svg', 'sprite', 'vanilla'],
    },
    {
      name: '@stria-icons/react',
      version: '1.0.0',
      description: 'React components for Stria Icons. Highly optimized, tree-shakeable, and easily customizable via props.',
      installCommand: 'npm install @stria-icons/react',
      tags: ['react', 'nextjs', 'components'],
    },
    {
      name: 'stria-icons/blade',
      version: '1.0.0',
      description: 'Laravel Blade wrapper components and directives for elegant icon usage in Laravel applications.',
      installCommand: 'composer require stria-icons/blade',
      tags: ['laravel', 'php', 'blade'],
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl flex-1">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Official Packages</h1>
        <p className="text-xl text-muted-foreground">
          Install Stria Icons for your specific framework or use our core assets anywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.name} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <Badge variant="secondary">v{pkg.version}</Badge>
              </div>
              <CardDescription className="text-base">
                {pkg.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mb-6">
                {pkg.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                {pkg.installCommand}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="default">
                View Documentation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
