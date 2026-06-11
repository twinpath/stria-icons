import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { IconStyle } from '@/types/icon';

export function useIconFilter() {
  const { resolvedTheme } = useTheme();
  const [style, setStyle] = useState<IconStyle>('solid');
  const [size, setSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [search, setSearch] = useState('');
  const [color, setColor] = useState('currentColor');
  const [secondaryColor, setSecondaryColor] = useState('currentColor');
  const [category, setCategory] = useState('All');

  // Set explicit default hex colors once the theme is resolved
  useEffect(() => {
    if (resolvedTheme) {
      const defaultHex = resolvedTheme === 'dark' ? '#e2e8f0' : '#334155';
      if (color === 'currentColor') {
        setColor(defaultHex);
      }
      if (secondaryColor === 'currentColor') {
        setSecondaryColor(defaultHex);
      }
    }
  }, [resolvedTheme]); // Only run when resolvedTheme changes

  return {
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
    setCategory
  };
}
