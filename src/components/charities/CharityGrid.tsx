'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SearchSlash, Sparkles } from 'lucide-react';
import { CharityCard } from './CharityCard';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

interface CharityGridProps {
  charities: Charity[];
  isLoading?: boolean;
}

export const CharityGrid = ({ charities, isLoading }: CharityGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[400px] w-full bg-zinc-900 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (charities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-900/40"
      >
        <div className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center mb-6 border border-white/5">
          <SearchSlash className="w-8 h-8 text-zinc-700" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Support Found Nothing</h3>
        <p className="max-w-xs text-zinc-500 text-sm leading-relaxed">
          We couldn't find any charities matching your current filter. Try searching for something broader.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {charities.map((charity, index) => (
          <motion.div
            key={charity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            layout
          >
            <CharityCard {...charity} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
