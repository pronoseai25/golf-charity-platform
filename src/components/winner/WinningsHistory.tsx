'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  ChevronRight,
  ExternalLink,
  Coins
} from 'lucide-react';
import { WinnerVerification, VerificationStatus } from '@/types';

interface WinningsHistoryProps {
  verifications: WinnerVerification[];
}

export const WinningsHistory = ({ verifications }: WinningsHistoryProps) => {
  const formatPence = (pence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(pence / 100);
  };

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'awaiting_proof':
        return { 
          label: 'Awaiting Proof', 
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', 
          icon: <Clock className="w-4 h-4" /> 
        };
      case 'proof_submitted':
        return { 
          label: 'Pending Review', 
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', 
          icon: <Search className="w-4 h-4" /> 
        };
      case 'approved':
        return { 
          label: 'Approved', 
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', 
          icon: <CheckCircle2 className="w-4 h-4" /> 
        };
      case 'rejected':
        return { 
          label: 'Rejected', 
          color: 'text-red-500 bg-red-500/10 border-red-500/20', 
          icon: <AlertCircle className="w-4 h-4" /> 
        };
      case 'paid':
        return { 
          label: 'Paid', 
          color: 'text-emerald-400 bg-zinc-950 border-emerald-500/50', 
          icon: <Coins className="w-4 h-4" /> 
        };
      default:
        return { 
          label: status, 
          color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20', 
          icon: <Clock className="w-4 h-4" /> 
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between ml-2">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-zinc-500" />
          Winning History
        </h3>
        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{verifications.length} Prizes Found</span>
      </div>

      <div className="space-y-4">
        {verifications.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
               <Trophy className="w-8 h-8" />
            </div>
            <p className="text-zinc-500 font-medium">No tournament winnings found yet. Keep playing!</p>
          </div>
        ) : (
          verifications.map((v, index) => {
            const status = getStatusConfig(v.status);
            const entry = v.draw_entry;
            const draw = (entry as any)?.draws;

            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-emerald-500 transition-all" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
                      <Calendar className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                        {draw?.draw_date || 'Past Draw'}
                      </p>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter">
                        Tournament Prize
                      </h4>
                      <div className="flex flex-wrap gap-2">
                         {entry?.matched_numbers?.map(n => (
                           <span key={n} className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                             {n}
                           </span>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="space-y-1 text-left md:text-right px-4 border-l md:border-l-0 md:border-r border-zinc-800">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Prize Amount</p>
                       <p className="text-xl font-black text-white">{formatPence(entry?.prize_amount_pence || 0)}</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-widest leading-none ${status.color}`}>
                        {status.icon}
                        <span>{status.label}</span>
                      </div>
                      
                      {v.proof_url && (
                        <a 
                          href={v.proof_url} 
                          target="_blank" 
                          className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all hover:bg-zinc-900 active:scale-95"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
