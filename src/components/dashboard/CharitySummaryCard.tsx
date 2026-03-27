'use client';

import { Heart, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface CharitySummaryCardProps {
  charities: any[];
  subscriptionAmount: number; // in pence
  loading?: boolean;
}

export default function CharitySummaryCard({
  charities,
  subscriptionAmount,
  loading = false,
}: CharitySummaryCardProps) {
  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 animate-pulse">
        <div className="h-6 w-48 bg-white/5 rounded-lg mb-6" />
        <div className="space-y-4 mb-10">
            {[1,2].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-10 w-full bg-white/5 rounded-xl" />
      </div>
    );
  }

  const hasCharities = charities && charities.length > 0;

  return (
    <div className="bg-[#0f172a] border border-white/5 hover:border-rose-500/20 rounded-[2rem] p-8 lg:p-10 transition-all duration-300 relative overflow-hidden group shadow-2xl h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl pointer-events-none transition-all group-hover:bg-rose-500/10" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-rose-400/10" />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Impact Summary</h3>
            <h4 className="text-xl font-black tracking-tight text-white leading-none">Your Charities</h4>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {hasCharities ? (
          charities.map((item, i) => {
            const amount = (subscriptionAmount * item.allocation_perc) / 100 / 100;
            return (
              <div key={i} className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-rose-500/10 rounded-2xl p-5 flex items-center justify-between group/item transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <div>
                    <h5 className="text-sm font-black text-white mb-1 group-hover/item:text-rose-400 transition-colors uppercase tracking-tight line-clamp-1">{item.charity?.name || 'Assigned Charity'}</h5>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Allocation: {item.allocation_perc}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-rose-400 tracking-tight">£{amount.toFixed(2)}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Per Month</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 border border-dashed border-white/10 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                <Heart className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 px-6">You haven't selected any charities to support yet.</p>
          </div>
        )}
      </div>

      <Link 
        href="/dashboard/charities"
        className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 text-white px-6 py-4 rounded-xl font-black tracking-tight text-sm transition-all shadow-lg shadow-rose-500/20 group/link"
      >
        {hasCharities ? 'Manage Allocations' : 'Select Charities'}
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
