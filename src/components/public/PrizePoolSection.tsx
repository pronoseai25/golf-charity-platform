'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Trophy, Coins, TrendingUp, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PrizePoolSectionProps {
  latestDraw: any;
}

export default function PrizePoolSection({ latestDraw }: PrizePoolSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  const totalPool = latestDraw?.total_prize_pool_pence || 100000; // Fallback £1,000 for demo
  const target = totalPool / 100;

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  const tiers = [
    { label: 'Jackpot (5 Match)', amount: latestDraw?.jackpot_pool_pence || (totalPool * 0.4), color: 'text-amber-500 bg-amber-500/10' },
    { label: '4 Match Prize', amount: latestDraw?.tier2_pool_pence || (totalPool * 0.35), color: 'text-gray-400 bg-gray-400/10' },
    { label: '3 Match Prize', amount: latestDraw?.tier3_pool_pence || (totalPool * 0.25), color: 'text-orange-700 bg-orange-700/10' },
  ];

  return (
    <section ref={ref} className="py-32 bg-[#0f172a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center space-y-4 mb-20 flex flex-col items-center">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">Live Rewards</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              This Month's Prize Pool
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              Our pool grows with every subscriber. Play your game to support charity and win your share of the monthly total.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Main Visual Counter */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
          >
            <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 justify-center lg:justify-start">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Current Cumulative Pool
                </p>
                <div className="text-7xl md:text-9xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                    £{count.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    Live Potential
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-start gap-4 max-w-md w-full backdrop-blur-md">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Info className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-left">
                    <p className="text-sm font-black text-white uppercase tracking-tight">Jackpot Rollover</p>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">If no one matches all 5 numbers this month, the jackpot pool rolls over to next month's draw, creating massive life-changing prizes.</p>
                </div>
            </div>

            <Link 
              href="/signup" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 group flex items-center gap-2"
            >
              Enter This Month's Draw
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Tier Breakdown */}
          <div className="grid grid-cols-1 gap-4 w-full">
            {tiers.map((tier, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="group relative flex items-center justify-between p-8 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-[2.5rem] transition-all duration-300"
                >
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${tier.color} transition-transform group-hover:scale-110`}>
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{tier.label}</p>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Tier {idx + 1} distribution</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
                            £{(tier.amount / 100).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Guaranteed minimum</p>
                    </div>
                </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
