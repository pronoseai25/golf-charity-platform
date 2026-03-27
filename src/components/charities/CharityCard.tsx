'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Globe, ChevronRight, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharityCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_featured?: boolean;
}

export const CharityCard = ({
  name,
  slug,
  description,
  image_url,
  is_featured,
}: CharityCardProps) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      layout
      className="group relative flex flex-col h-full bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-orange-500/20"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image_url || fallbackImage}
          alt={name}
          className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/90 text-white rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-orange-500/20">
            <BadgeCheck className="w-3.5 h-3.5" />
            Spotlight
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6 space-y-3">
        <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-orange-400 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
          <Link
            href={`/charities/${slug}`}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
          >
            Learn More
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Globe className="w-4 h-4 text-zinc-600 group-hover:text-orange-500/50 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};
