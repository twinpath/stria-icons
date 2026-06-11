import React, { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox';
import { IconStyle } from '@/types/icon';
import iconsMetadata from '../../../../metadata/icons.json';

interface SidebarProps {
  style: IconStyle;
  setStyle: (val: IconStyle) => void;
  size: number;
  setSize: (val: number) => void;
  strokeWidth: number;
  setStrokeWidth: (val: number) => void;
  color: string;
  setColor: (val: string) => void;
  secondaryColor: string;
  setSecondaryColor: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
}

export function SidebarControls({ 
  style, setStyle, 
  size, setSize, 
  strokeWidth, setStrokeWidth,
  color, setColor,
  secondaryColor, setSecondaryColor,
  category, setCategory
}: SidebarProps) {
  
  // Extract all unique categories and sort alphabetically
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    Object.values(iconsMetadata).forEach((meta: any) => {
      meta.categories?.forEach((cat: string) => allCategories.add(cat));
    });
    return Array.from(allCategories).sort();
  }, []);

  const SidebarContent = (
    <div className="flex flex-col gap-6 lg:gap-8 lg:pr-4 pb-4 lg:pb-12">
      
      {/* Style Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Style</Label>
        <Tabs value={style} onValueChange={(val) => setStyle(val as IconStyle)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="solid">Solid</TabsTrigger>
            <TabsTrigger value="regular">Regular</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="thin">Thin</TabsTrigger>
            <TabsTrigger value="duotone">Duotone</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Size Slider */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-sm font-semibold">Size</Label>
            <span className="text-xs text-muted-foreground">{size}px</span>
          </div>
          <Slider 
            value={[size]} 
            min={12} 
            max={48} 
            step={2}
            onValueChange={(vals) => setSize(vals[0])}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
        {/* Primary Color Picker */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={color === 'currentColor' ? '#000000' : color} 
              onChange={(e) => setColor(e.target.value)} 
              className="w-12 p-1 h-9 cursor-pointer shrink-0"
            />
            <Input 
              type="text" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="flex-1 font-mono text-xs h-9 min-w-0"
              placeholder="currentColor or #Hex"
            />
          </div>
        </div>

        {/* Secondary Color Picker (Only for Duotone) */}
        {style === 'duotone' && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-fd-primary/80">Secondary Color</Label>
            <div className="flex gap-2">
              <Input 
                type="color" 
                value={secondaryColor === 'currentColor' ? '#000000' : secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
                className="w-12 p-1 h-9 cursor-pointer shrink-0"
              />
              <Input 
                type="text" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
                className="flex-1 font-mono text-xs h-9 min-w-0"
                placeholder="currentColor or #Hex"
              />
            </div>
          </div>
        )}

        {/* Categories Combobox */}
        <div className="space-y-3 flex flex-col">
          <Label className="text-sm font-semibold">Category</Label>
          <Combobox value={category} onValueChange={(val) => setCategory(val as string)}>
            <ComboboxInput placeholder="Select category..." className="h-9 w-full" />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxItem value="All">All Icons</ComboboxItem>
                {categories.map(cat => (
                  <ComboboxItem key={cat} value={cat} className="capitalize">
                    {cat.replace(/-/g, ' ')}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

    </div>
  );

  return (
    <div className="w-full lg:w-64 shrink-0 lg:h-full">
      <ScrollArea className="h-auto max-h-[40vh] lg:max-h-none lg:h-full">
        {SidebarContent}
      </ScrollArea>
    </div>
  );
}
