'use client';

import { useState, useEffect, useCallback } from 'react';
import { CharitySearch } from '@/components/charities/CharitySearch';
import { CharityGrid } from '@/components/charities/CharityGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart } from 'lucide-react';
import { ApiResponse } from '@/types';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
  upcoming_events_count?: number;
}

export const CharityDirectoryClient = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function initFetch() {
      try {
        setLoading(true);
        // 1. Fetch Charities
        const charRes = await fetch('/api/charities');
        const charData: ApiResponse<Charity[]> = await charRes.json();
        
        // 2. Fetch User Supported Charities (if logged in)
        const userCharRes = await fetch('/api/user/charities');
        if (userCharRes.status === 200) {
            const userCharData: ApiResponse<any[]> = await userCharRes.json();
            if (userCharData.success) {
                setSupportedIds(userCharData.data?.map(c => c.charity_id) || []);
            }
        }

        if (charData.success) {
            setCharities(charData.data || []);
        }
      } catch (err) {
        console.error("Initialization failed");
      } finally {
        setLoading(false);
      }
    }
    initFetch();
  }, []);

  const handleSearchResults = useCallback((results: Charity[]) => {
    setCharities(results);
  }, []);

  const handleLoadingState = useCallback((isLoading: boolean) => {
    setSearchLoading(isLoading);
  }, []);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Discovering Missions...</p>
          </div>
      );
  }

  const enhancedCharities = charities.map(c => ({
      ...c,
      isSupporting: supportedIds.includes(c.id)
  }));

  return (
    <div className="space-y-12 pb-24 relative z-10">
      <CharitySearch 
        onSearch={handleSearchResults} 
        onLoading={handleLoadingState} 
      />

      <motion.div
        initial={false}
        animate={{ opacity: searchLoading ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {enhancedCharities.length > 0 ? (
            <CharityGrid 
                charities={enhancedCharities} 
                loading={searchLoading} 
            />
        ) : (
            <div className="text-center py-20 space-y-4">
                <Heart className="w-12 h-12 text-zinc-800 mx-auto" />
                <p className="text-zinc-500 font-medium">No charities found matching your criteria.</p>
            </div>
        )}
      </motion.div>
    </div>
  );
};
