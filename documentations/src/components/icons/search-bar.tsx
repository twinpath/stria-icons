import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  count: number;
}

export function SearchBar({ search, setSearch, count }: SearchBarProps) {
  return (
    <div className="flex-none py-4 mb-4 border-b">
      <Input 
        type="search" 
        placeholder={`Search ${count} icons...`} 
        className="w-full max-w-md bg-muted/50 border-muted"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
