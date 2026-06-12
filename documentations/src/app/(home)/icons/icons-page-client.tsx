'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SidebarControls } from '@/components/icons/sidebar';
import { SearchBar } from '@/components/icons/search-bar';
import { IconGrid } from '@/components/icons/icon-grid';
import { useIconFilter } from '@/hooks/use-icon-filter';

interface IconsPageClientProps {
  iconsMetadata: Record<
    string,
    {
      name: string;
      styles: string[];
      categories: string[];
      unicode: string;
    }
  >;
}

export default function IconsPageClient({ iconsMetadata }: IconsPageClientProps) {
  const {
    style,
    setStyle,
    size,
    setSize,
    strokeWidth,
    setStrokeWidth,
    search,
    setSearch,
    color,
    setColor,
    secondaryColor,
    setSecondaryColor,
    category,
    setCategory,
  } = useIconFilter();

  const [iconsModule, setIconsModule] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(100);

  // Reset pagination when search, style or category changes
  useEffect(() => {
    setVisibleCount(100);
  }, [search, style, category]);

  // Load the core JS module dynamically from the API route whenever the style changes
  useEffect(() => {
    let isMounted = true;
    setIconsModule(null); // Reset to trigger skeleton loader
    import('@/lib/icons').then(({ loadIconsForStyle }) => {
      loadIconsForStyle(style).then((mod) => {
        if (isMounted) setIconsModule(mod);
      });
    });
    return () => {
      isMounted = false;
    };
  }, [style]);

  // Convert metadata object into array and filter by search & category
  const filteredMetadata = useMemo(() => {
    const arr = Object.values(iconsMetadata);
    return arr.filter((meta) => {
      const matchStyle = meta.styles.includes(style);
      const matchSearch = meta.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === 'All' || (meta.categories && meta.categories.includes(category));
      return matchStyle && matchSearch && matchCategory;
    });
  }, [iconsMetadata, style, search, category]);

  // Extract all unique categories and sort alphabetically
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    Object.values(iconsMetadata).forEach((meta: any) => {
      meta.categories?.forEach((cat: string) => allCategories.add(cat));
    });
    return Array.from(allCategories).sort();
  }, [iconsMetadata]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden container mx-auto py-8 px-4 gap-8">
      {/* Sidebar - Fixed width, independent scroll */}
      <SidebarControls
        style={style}
        setStyle={setStyle}
        size={size}
        setSize={setSize}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        color={color}
        setColor={setColor}
        secondaryColor={secondaryColor}
        setSecondaryColor={setSecondaryColor}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
        {/* Fixed Search Bar at the top of main content */}
        <SearchBar search={search} setSearch={setSearch} count={filteredMetadata.length} />

        {/* Icon Grid with its own scroll area */}
        <IconGrid
          iconsModule={iconsModule}
          filteredMetadata={filteredMetadata}
          style={style}
          size={size}
          strokeWidth={strokeWidth}
          color={color}
          secondaryColor={secondaryColor}
          search={search}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
        />
      </div>
    </div>
  );
}
