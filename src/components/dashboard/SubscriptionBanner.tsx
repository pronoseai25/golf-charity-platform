'use client';

import { CheckCircle2, XCircle, AlertTriangle, Calendar, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import QuickScoreEntry from '@/components/dashboard/QuickScoreEntry';
import { motion } from 'framer-motion';

interface SubscriptionBannerProps {
  subscription: any;
  scoreCount: number;
  onScoreAdded: (scores: any[]) => void;
  loading?: boolean;
}

export default function SubscriptionBanner({
  subscription,
  scoreCount,
  onScoreAdded,
  loading = false
}: SubscriptionBannerProps) {
  if (loading) {
      return (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 animate-pulse">
              <div className="h-8 w-64 bg-white/5 rounded-xl mb-6" />
              <div className="h-24 bg-white/5 rounded-2xl" />
          </div>
      );
  }

  const isActive = subscription?.status === 'active';
  const isPastDue = subscription?.status === 'past_due';
  const isCancelled = subscription?.status === 'cancelled';
  const renewalDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group shadow-2xl">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-700 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isActive ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-none mb-1">
                {isActive ? 'Subscription Active' : 'Action Required'}
              </h2>
              <p className="text-sm font-bold text-gray-500 tracking-tight">
                {isActive 
                  ? `Next renewal on ${renewalDate}` 
                  : isPastDue ? 'Payment failed — update your billing' : 'Subscribe to enter draws'
                }
              </p>
            </div>
          </div>

          {!isActive ? (
            <div className="space-y-4 max-w-md">
              <p className="text-gray-400 font-medium">To participate in the monthly prize draws and support your chosen charities, you need an active subscription.</p>
              <Link 
                href="/pricing"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-2xl font-black tracking-tight transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group/btn"
              >
                View Plans
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Price Plan</p>
                        <p className="text-sm font-black text-white">Monthly Member</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Billed via</p>
                        <p className="text-sm font-black text-white">Stripe Secure</p>
                    </div>
                </div>
            </div>
          )}
        </div>

        {isActive && (
          <div className="lg:w-[400px]">
             <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Quick Score Entry</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{scoreCount}/5 Slots</span>
             </div>
             <QuickScoreEntry onScoreAdded={onScoreAdded} />
          </div>
        )}
      </div>
    </div>
  );
}
