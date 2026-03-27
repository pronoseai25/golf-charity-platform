'use client';

import { useState, useCallback } from 'react';
import { CharitySearch } from '@/components/charities/CharitySearch';
import { CharityGrid } from '@/components/charities/CharityGrid';
import { motion, AnimatePresence } from 'framer-motion';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

interface CharityDirectoryClientProps {
  initialCharities: Charity[];
}

export const CharityDirectoryClient = ({ initialCharities }: CharityDirectoryClientProps) => {
  const [charities, setCharities] = useState<Charity[]>(initialCharities);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = useCallback((results: Charity[]) => {
    setCharities(results);
  }, []);

  const handleLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <div className="space-y-12 pb-24 relative z-10">
      <CharitySearch 
        onSearch={handleSearchResults} 
        onLoading={handleLoadingState} 
      />

      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <CharityGrid 
          charities={charities} 
          isLoading={isLoading} 
        />
      </motion.div>
    </div>
  );
};
