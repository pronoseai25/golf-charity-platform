'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Sparkles, X, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharitySearchProps {
  onSearch: (results: any[]) => void;
  onLoading: (isLoading: boolean) => void;
}

export const CharitySearch = ({ onSearch, onLoading }: CharitySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const isFirstRender = useRef(true);

  // Debounced search logic
  const performSearch = useCallback(async () => {
    onLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (featuredOnly) params.append('featured', 'true');

      const response = await fetch(`/api/charities?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        onSearch(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      onLoading(false);
    }
  }, [searchTerm, featuredOnly, onSearch, onLoading]);

  // Handle debouncing
  useEffect(() => {
    // Skip searching on mount as initial data is fetched server-side
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto mb-12">
      {/* Search Input */}
      <div className="relative w-full group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by mission or cause..."
          className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-4.5 pl-14 pr-12 text-lg font-medium text-white placeholder-zinc-500 outline-hidden focus:border-orange-500/50 focus:bg-zinc-900 transition-all shadow-xl shadow-zinc-950/20 shadow-none ring-0 appearance-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Featured Toggle */}
      <div className="flex bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shrink-0 w-full md:w-auto">
        <button
          onClick={() => setFeaturedOnly(false)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            !featuredOnly ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          All Causes
        </button>
        <button
          onClick={() => setFeaturedOnly(true)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            featuredOnly ? "bg-orange-500 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Featured
        </button>
      </div>
    </div>
  );
};
