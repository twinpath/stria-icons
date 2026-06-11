import React, { useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";
import { IconStyle } from '@/types/icon';

interface IconGridProps {
  iconsModule: any;
  filteredMetadata: Array<{name: string, styles: string[]}>;
  style: IconStyle;
  size: number;
  strokeWidth: number;
  color: string;
  secondaryColor: string;
  search: string;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

// Helper to format icon component name
function getComponentName(name: string, style: string) {
  const baseName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const styleSuffix = style.charAt(0).toUpperCase() + style.slice(1);
  return `${baseName}${styleSuffix}`;
}

export function IconGrid({ 
  iconsModule, filteredMetadata, style, size, strokeWidth, color, secondaryColor, search, visibleCount, setVisibleCount 
}: IconGridProps) {
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (!iconsModule || filteredMetadata.length <= visibleCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 100);
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [iconsModule, filteredMetadata.length, visibleCount, setVisibleCount]);

  return (
    <ScrollArea className="flex-1 min-h-0 w-full rounded-md border p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {!iconsModule ? (
          Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 border rounded-lg aspect-square">
              <Skeleton className="w-8 h-8 mb-3" />
              <Skeleton className="w-16 h-3" />
            </div>
          ))
        ) : (
          filteredMetadata.slice(0, visibleCount).map((meta) => {
            const exportName = meta.name.match(/^\d/) 
              ? `_${meta.name}`
              : meta.name.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
            
            const iconData = iconsModule[exportName] || iconsModule.default?.[exportName];
            
            if (!iconData) return null;

            const componentName = getComponentName(meta.name, style);

            return (
              <button 
                key={meta.name} 
                onClick={() => {
                  navigator.clipboard.writeText(`<${componentName} />`);
                  toast(`Copied <${componentName} /> to clipboard`);
                }}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors aspect-square"
              >
                <div className="flex-1 flex items-center justify-center mb-3 text-foreground">
                  <svg 
                    width={size} 
                    height={size} 
                    viewBox={iconData.viewBox || "0 0 24 24"} 
                    className="transition-all duration-200"
                  >
                    {Array.isArray(iconData.paths) 
                      ? iconData.paths.map((d: string, i: number) => {
                          const isSecondary = style === 'duotone' && i === 0;
                          const pathFill = isSecondary ? secondaryColor : color;
                          const pathClass = isSecondary && secondaryColor === 'currentColor' ? 'opacity-40' : '';
                          return (
                            <path 
                              key={i} 
                              d={d} 
                              fill={pathFill}
                              className={pathClass} 
                            />
                          );
                        })
                      : <path d={iconData.paths} fill={color} />
                    }
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center" title={meta.name}>
                  {meta.name}
                </span>
              </button>
            );
          })
        )}
        {iconsModule && filteredMetadata.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No icons found for "{search}"
          </div>
        )}
      </div>
      
      {/* Intersection Observer Target */}
      {iconsModule && visibleCount < filteredMetadata.length && (
        <div ref={observerTarget} className="h-10 w-full mt-4 flex items-center justify-center">
            <Skeleton className="w-full h-8" />
        </div>
      )}
    </ScrollArea>
  );
}
