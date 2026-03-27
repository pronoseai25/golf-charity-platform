'use client';

import { useState } from 'react';
import { Plus, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickScoreEntryProps {
  onScoreAdded: (scores: any[]) => void;
}

export default function QuickScoreEntry({ onScoreAdded }: QuickScoreEntryProps) {
  const [score, setScore] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '') return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            score: Number(score), 
            played_at: new Date().toISOString().split('T')[0] 
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to add score');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setScore('');
      onScoreAdded(data.data);
      
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 group">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="number"
            min="1"
            max="45"
            placeholder="Score (1-45)"
            value={score}
            onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || score === ''}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-4 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"
          >
            Score recorded successfully!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
