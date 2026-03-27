'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Info } from 'lucide-react';
import { ScoreCard } from './ScoreCard';
import { cn } from '@/lib/utils';

interface Score {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
}

interface ScoreListProps {
  scores: Score[];
  onDelete: (id: string) => Promise<void>;
}

export const ScoreList = ({ scores, onDelete }: ScoreListProps) => {
  const maxSlots = 5;
  const currentCount = scores.length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Slots Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white leading-tight">Score Slots</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {currentCount} of {maxSlots} Entered
            </p>
          </div>
        </div>

        {/* Slot Indicator Dots */}
        <div className="flex gap-2">
          {Array.from({ length: maxSlots }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < currentCount ? 1 : 0.8,
                opacity: i < currentCount ? 1 : 0.3,
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-zinc-950 transition-all duration-300",
                i < currentCount ? "bg-emerald-500 ring-emerald-500/20" : "bg-zinc-800 ring-zinc-800/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {scores.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center p-12 text-center border border-zinc-900 bg-zinc-900/40 rounded-3xl"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center mb-4 border border-zinc-800">
                <Trophy className="w-8 h-8 text-zinc-700" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">No scores yet.</h4>
              <p className="text-sm text-zinc-500 max-w-[240px] leading-relaxed">
                Add your first score above to start tracking your performance.
              </p>
            </motion.div>
          ) : (
            scores.map((score, index) => (
              <ScoreCard
                key={score.id}
                id={score.id}
                score={score.score}
                played_at={score.played_at}
                slot={scores.length - index} // Newest first, but slot 1 is oldest? 
                // Wait, requirements say: "Score 1 of 5". Let's use 1-based indexing for simple slot display.
                totalSlots={maxSlots}
                onDelete={onDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Info Tip */}
      {scores.length > 0 && (
        <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1.5 px-4 text-center">
          <Info className="w-3 h-3" />
          Only your latest 5 scores are kept to calculate your current average.
        </p>
      )}
    </div>
  );
};
