'use client';

import { useState } from 'react';
import { ScoreForm } from '@/components/scores/ScoreForm';
import { ScoreList } from '@/components/scores/ScoreList';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Score {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
}

interface ScoreClientPageProps {
  initialScores: Score[];
  isSubscribed: boolean;
}

export const ScoreClientPage = ({ initialScores, isSubscribed }: ScoreClientPageProps) => {
  const [scores, setScores] = useState<Score[]>(initialScores);

  const handleScoreUpdate = (updatedList: Score[]) => {
    setScores(updatedList);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setScores((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error('Failed to delete score:', result.error);
        alert(result.error || 'Failed to delete score');
      }
    } catch (err) {
      console.error('Delete score error:', err);
    }
  };

  if (!isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-12 p-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] text-center space-y-8"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Locked Content</h2>
          <p className="text-zinc-500 text-lg max-w-sm mx-auto">
            Only active subscribers can track and manage their golf scores.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
        >
          <CreditCard className="w-5 h-5" />
          <span>Subscribe Now</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Page Subtitle */}
      <h3 className="text-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
        {scores.length} of 5 scores entered
      </h3>

      <div className="space-y-16">
        <section>
          <ScoreForm currentCount={scores.length} onSuccess={handleScoreUpdate} />
        </section>

        <section>
          <ScoreList scores={scores} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  );
};
