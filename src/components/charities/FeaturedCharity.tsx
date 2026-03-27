'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartPulse, ChevronRight, BadgeCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CharityCard } from './CharityCard';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export const FeaturedCharity = () => {
  const [featuredCharities, setFeaturedCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/charities?featured=true');
        const result = await response.json();
        if (result.success) {
          setFeaturedCharities(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured charities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
     return (
        <div className="py-24 max-w-6xl mx-auto px-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500/20 mx-auto" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Spotlight Loading</p>
        </div>
     );
  }

  if (featuredCharities.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[160px] pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 space-y-4 text-center">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 shadow-xl shadow-orange-500/10">
              <BadgeCheck className="w-4 h-4" />
              Charity Spotlight
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl max-w-3xl leading-tight">
             Impactful causes, driven by 
             <span className="text-orange-500 italic block md:inline md:ml-3">every score you enter.</span>
           </h2>
           <p className="text-sm md:text-lg text-zinc-500 font-medium max-w-xl leading-relaxed">
             Join thousands of players supporting non-profits selected for their direct impact on global challenges.
           </p>
        </div>

        {/* Featured List - Spotlight treatment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatePresence>
            {featuredCharities.map((charity, index) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                className="relative group h-full"
              >
                  {/* Spotlight version of charity card - directly linking profile for high impact */}
                  <Link href={`/charities/${charity.slug}`} className="block h-full cursor-pointer">
                    <div className="relative h-full bg-zinc-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-orange-500/30 group-hover:shadow-[0_40px_100px_-20px_rgba(249,115,22,0.15)] flex flex-col">
                        <div className="h-[340px] relative overflow-hidden shrink-0">
                           <img 
                             src={charity.image_url} 
                             alt={charity.name} 
                             className="w-full h-full object-cover grayscale-[0.3] transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                           
                           {/* Spotlight Detail Overlay */}
                           <div className="absolute bottom-8 left-8 right-8 space-y-2">
                             <div className="flex items-center gap-2 text-white">
                               <HeartPulse className="w-6 h-6 text-orange-500 fill-orange-500" />
                               <h3 className="text-3xl font-black tracking-tight leading-tight">{charity.name}</h3>
                             </div>
                             <p className="text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 max-w-md">
                               {charity.description}
                             </p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-8 bg-zinc-950/30 backdrop-blur-md flex-grow">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
                              Explore Mission
                           </span>
                           <div className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl group-hover:bg-orange-500 transition-all active:scale-95 group-hover:px-8">
                             Support This Cause
                             <ChevronRight className="w-4 h-4" />
                           </div>
                        </div>
                    </div>
                  </Link>
                  
                  {/* Subtle Accent Glow */}
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20 text-center">
            <Link 
              href="/charities" 
              className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors border-b border-white/5 pb-2 hover:border-orange-500/50"
            >
               View All Verified Charities
            </Link>
        </div>
      </div>
    </section>
  );
};
