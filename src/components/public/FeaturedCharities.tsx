'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Search, Info } from 'lucide-react';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
}

interface FeaturedCharitiesProps {
  charities: Charity[];
}

export default function FeaturedCharities({ charities }: FeaturedCharitiesProps) {
  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden">
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100/50 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
                 <Heart className="w-4 h-4 fill-indigo-600" />
                 Choose your cause
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                 Support a mission<br />
                 that matters <span className="text-rose-500 italic">to you.</span>
               </h2>
               <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
                 A portion of every subscription goes directly to your chosen charity. We partner with verified, high-impact missions across the UK.
               </p>
          </div>
          <Link 
            href="/charities"
            className="group inline-flex items-center gap-2 px-10 py-5 bg-white border border-gray-100 rounded-2xl text-base font-black text-gray-900 hover:text-indigo-600 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all active:scale-95"
          >
            <Search className="w-5 h-5" />
            View all 45+ charities
          </Link>
        </div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {charities.length > 0 ? (
            charities.map((charity, index) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-100 rounded-[3rem] p-4 flex flex-col space-y-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                {/* Image Area */}
                <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden">
                  {charity.image_url ? (
                    <img 
                      src={charity.image_url} 
                      alt={charity.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <Link 
                        href={`/charities/${charity.slug}`}
                        className="text-white text-sm font-black flex items-center gap-2"
                      >
                        Read Their Story
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    {charity.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed flex-1">
                    {charity.description}
                  </p>
                  <Link 
                    href={`/charities/${charity.slug}`}
                    className="w-full text-center py-4 bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
                  >
                    Select Mission
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            // Empty / Loading Placeholder State
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[400px] w-full bg-gray-100 rounded-[3rem] animate-pulse" />
            ))
          )}
        </div>

        {/* Impact Note at bottom */}
        <div className="mt-24 p-10 bg-indigo-600/5 border border-indigo-100/50 rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex items-start gap-6 max-w-2xl">
                <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/10">
                    <Info className="w-8 h-8" />
                </div>
                <div className="space-y-2 text-center lg:text-left">
                    <h4 className="text-xl font-black text-gray-900 leading-none">Subscription Impact Model</h4>
                    <p className="text-gray-500 font-medium">For every £9.99 subscription, a minimum of £1.00 (10%) is donated directly to your chosen charities. You can adjust this up to 50% from your dashboard.</p>
                </div>
            </div>
            <Link 
              href="/signup" 
              className="w-full lg:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-center"
            >
              Start Giving Today
            </Link>
        </div>

      </div>
    </section>
  );
}
