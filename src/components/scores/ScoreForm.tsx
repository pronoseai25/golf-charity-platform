'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Calendar, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoreSchema } from '@/lib/validators/scores';

interface ScoreFormProps {
  currentCount: number;
  onSuccess: (updatedScores: any[]) => void;
  disabled?: boolean;
}

export const ScoreForm = ({ currentCount, onSuccess, disabled }: ScoreFormProps) => {
  const [score, setScore] = useState<number | ''>('');
  const [playedAt, setPlayedAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ score?: string; played_at?: string }>({});

  const validate = () => {
    const result = ScoreSchema.safeParse({ score, played_at: playedAt });
    if (!result.success) {
      const errors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: Number(score), played_at: playedAt }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to add score');
        return;
      }

      // Success
      setScore('');
      setPlayedAt(new Date().toISOString().split('T')[0]);
      onSuccess(result.data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl overflow-hidden relative group">
        {/* Decorative background target icon */}
        <Target className="absolute -right-12 -top-12 w-48 h-48 text-zinc-800/20 rotate-12 transition-transform duration-500 group-hover:rotate-45" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Score Input */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Stableford Points
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={45}
                value={score}
                onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0-45"
                className={cn(
                  "w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 outline-hidden rounded-xl px-4 py-3.5 text-xl font-bold transition-all text-white",
                  fieldErrors.score && "border-rose-500/50 bg-rose-500/5"
                )}
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Played At
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="date"
                max={maxDate}
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                className={cn(
                  "w-full bg-zinc-950/50 border border-zinc-800 focus:border-emerald-500/50 outline-hidden rounded-xl pl-11 pr-4 py-3.5 font-medium transition-all text-white appearance-none",
                  fieldErrors.played_at && "border-rose-500/50 bg-rose-500/5"
                )}
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading || disabled}
              className="w-full h-[58px] bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:opacity-50 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Score</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation Messages */}
        <AnimatePresence>
          {(fieldErrors.score || fieldErrors.played_at || error) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-zinc-800 space-y-1"
            >
              {fieldErrors.score && <p className="text-xs text-rose-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {fieldErrors.score}</p>}
              {fieldErrors.played_at && <p className="text-xs text-rose-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {fieldErrors.played_at}</p>}
              {error && <p className="text-xs text-rose-500 flex items-center gap-1.5 font-bold"><AlertTriangle className="w-3 h-3" /> {error}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rolling Over Warning */}
      {currentCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-500"
        >
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Slot Full</p>
            <p className="text-xs opacity-80">Adding this score will permanently remove your oldest score record.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
