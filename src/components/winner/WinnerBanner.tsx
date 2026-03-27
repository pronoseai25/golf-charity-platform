'use client';

import { motion } from 'framer-motion';
import { Trophy, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface WinnerBannerProps {
  totalAmount: number;
}

export const WinnerBanner = ({ totalAmount }: WinnerBannerProps) => {
  const formatPence = (pence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(pence / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/20"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-10 -translate-y-10">
        <Sparkles className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Congratulations!</h2>
            <p className="text-emerald-50 font-medium text-lg">You have prize winnings ready for verification.</p>
          </div>
        </div>

        <div className="bg-zinc-950/20 p-6 rounded-3xl backdrop-blur-md border border-white/10 text-center space-y-1">
          <p className="text-xs font-black text-emerald-100 uppercase tracking-widest">Total Winnings</p>
          <div className="text-4xl font-black text-white">
            {formatPence(totalAmount)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
