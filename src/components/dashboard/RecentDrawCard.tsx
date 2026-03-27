'use client';

import { Trophy, Calendar, Eye, ArrowRight, Ticket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RecentDrawCardProps {
  draw: any;
  loading?: boolean;
}

export default function RecentDrawCard({ draw, loading = false }: RecentDrawCardProps) {
  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 animate-pulse">
        <div className="h-6 w-32 bg-white/5 rounded-lg mb-6" />
        <div className="flex gap-2 mb-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/5" />)}
        </div>
        <div className="h-10 w-full bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!draw) {
    return (
      <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-all hover:bg-[#131d36]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
          <Calendar className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 transition-colors" />
        </div>
        <h3 className="text-xl font-black tracking-tight text-white mb-2">No draws yet</h3>
        <p className="text-sm font-medium text-gray-500 mb-6">The first draw for this period is coming soon. Stay tuned!</p>
        <Link 
            href="/dashboard/draws" 
            className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
        >
            View Schedule
        </Link>
      </div>
    );
  }

  const drawDate = new Date(draw.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const myEntry = draw.myEntry;
  const matchCount = myEntry?.match_count || 0;
  const prizeAmount = myEntry?.prize_amount_pence / 100 || 0;

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Latest Draw Result</h3>
        </div>
        <span className="text-xs font-bold text-gray-400">{drawDate}</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {draw.drawn_numbers.map((num: number, i: number) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center text-base lg:text-lg font-black shadow-lg ${
                myEntry?.matched_numbers?.includes(num)
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            {num}
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        {myEntry ? (
            <div className={`p-5 rounded-2xl border ${matchCount >= 3 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Your Result</p>
                        <p className="text-sm font-black text-white">{matchCount} Matches Found</p>
                    </div>
                    {matchCount >= 3 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Prize Won</p>
                            <p className="text-lg font-black text-emerald-400">£{prizeAmount.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-gray-500">You did not have an entry for this draw.</p>
            </div>
        )}

        <Link 
          href="/dashboard/draws"
          className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl font-bold tracking-tight text-sm transition-all group/link"
        >
          View Full Draw History
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
