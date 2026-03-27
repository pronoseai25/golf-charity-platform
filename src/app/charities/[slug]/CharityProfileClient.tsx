'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, CreditCard, Loader2, Sparkles, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CharityProfileClientProps {
  charityId: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  isCurrent: boolean;
}

export const CharityProfileClient = ({ 
  charityId, 
  isLoggedIn, 
  isSubscribed, 
  isCurrent 
}: CharityProfileClientProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(isCurrent);

  const handleSelect = async () => {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    if (!isSubscribed) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/select-charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId }),
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        alert(result.error || 'Failed to update selection');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
       <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-zinc-950/50 border border-white/5 space-y-4">
            <Lock className="w-8 h-8 text-zinc-700" />
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
              Login required to select your supported cause.
            </p>
          </div>
          <Link 
            href="/auth" 
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 group"
          >
            <span>Sign In to Select</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
       </div>
    );
  }

  if (!isSubscribed) {
    return (
       <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-zinc-800/50 space-y-4">
             <CreditCard className="w-8 h-8 text-orange-500/50" />
             <div className="space-y-1">
                <h4 className="text-white font-bold tracking-tight">Support Locked</h4>
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                  Only active subscribers can select and manage their supported charity. 
                </p>
             </div>
          </div>
          <Link 
            href="/dashboard" 
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 group"
          >
            <span>Upgrade to Select</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
       </div>
    );
  }

  return (
    <div className="space-y-6 relative overflow-hidden">
       {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-[2.5rem] bg-emerald-500 border border-emerald-400 text-white space-y-4 text-center shadow-2xl shadow-emerald-500/20"
          >
             <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
             <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight leading-none">Already Selection</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Supporting This Cause</p>
             </div>
             <div className="h-px w-1/3 mx-auto bg-white/20 mt-4" />
             <p className="text-[10px] font-bold tracking-widest leading-relaxed uppercase opacity-70">
                You're contributing to this mission in real-time.
             </p>
          </motion.div>
       ) : (
          <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 space-y-3">
                 <HeartPulse className="w-6 h-6 text-orange-500 fill-orange-500" />
                 <p className="text-sm font-bold text-white leading-relaxed tracking-tight group-hover:text-orange-400 transition-colors">
                    Make this your primary supported charity.
                 </p>
              </div>
              <button
                onClick={handleSelect}
                disabled={loading}
                className="w-full h-20 md:h-24 inline-flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] md:tracking-[0.4em] rounded-[2rem] shadow-2xl transition-all active:scale-95 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                   <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                   <>
                      <motion.div
                        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      />
                      <Sparkles className="w-6 h-6 shrink-0" />
                      <span>Select This Charity</span>
                   </>
                )}
              </button>
          </div>
       )}
    </div>
  );
};
