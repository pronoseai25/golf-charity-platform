'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  id: string;
  score: number;
  played_at: string;
  slot: number;
  totalSlots: number;
  onDelete: (id: string) => Promise<void>;
}

export const ScoreCard = ({
  id,
  score,
  played_at,
  slot,
  totalSlots,
  onDelete,
}: ScoreCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getScoreColors = (s: number) => {
    if (s >= 36) return 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400';
    if (s >= 25) return 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400';
    if (s >= 15) return 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400';
    return 'from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-400';
  };

  const getBadgeColors = (s: number) => {
    if (s >= 36) return 'bg-emerald-500/20 text-emerald-400';
    if (s >= 25) return 'bg-blue-500/20 text-blue-400';
    if (s >= 15) return 'bg-amber-500/20 text-amber-400';
    return 'bg-rose-500/20 text-rose-400';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(played_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        'relative group overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300',
        getScoreColors(score)
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Slot & Date */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Score {slot} of {totalSlots}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Calendar className="w-3.5 h-3.5 opacity-50" />
            {formattedDate}
          </div>
        </div>

        {/* Right: Large Score */}
        <div className="flex flex-col items-end">
          <span className="text-4xl font-bold tracking-tighter leading-none">
            {score}
          </span>
          <span className={cn('mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest', getBadgeColors(score))}>
            Points
          </span>
        </div>
      </div>

      {/* Hover Overlay with Delete Button */}
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-3 rounded-full bg-rose-500 text-white shadow-xl transform scale-75 group-hover:scale-100 transition-all active:scale-95 translate-y-2 group-hover:translate-y-0"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <span className="text-xs font-medium text-white">Delete this score?</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-rose-500 rounded text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
