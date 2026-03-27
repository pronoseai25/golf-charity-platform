'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Play, 
  Send, 
  History, 
  Users, 
  Coins, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Dice5
} from 'lucide-react';
import { Draw, DrawMode, DrawSimulationResult } from '@/types';
import { cn } from '@/lib/utils';

const MODE_LABELS: Record<DrawMode, string> = {
  'random': 'Pure Random',
  'weighted_common': 'Market Hot',
  'weighted_rare': 'Market Cold'
};

interface AdminDrawsClientProps {
  initialDraws: Draw[];
}

export default function AdminDrawsClient({ initialDraws }: AdminDrawsClientProps) {
  const [activeTab, setActiveTab] = useState<'management' | 'rollovers'>('management');
  const [draws, setDraws] = useState<Draw[]>(initialDraws);
  const [rollovers, setRollovers] = useState<any[]>([]);
  const [simulation, setSimulation] = useState<DrawSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    draw_date: new Date().toISOString().split('T')[0],
    draw_mode: 'random' as DrawMode
  });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSimulation(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/draws/admin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (result.success) {
        setSimulation(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const fetchRollovers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/draws/admin/rollover');
      const result = await res.json();
      if (result.success) {
        setRollovers(result.data);
      }
    } catch (err) {
      console.error('Fetch rollovers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: 'management' | 'rollovers') => {
    setActiveTab(tab);
    if (tab === 'rollovers') {
      fetchRollovers();
    }
  };

  const handlePublish = async () => {
    if (!simulation) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/draws/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draw_id: simulation.draw_id })
      });
      const result = await res.json();
      
      if (result.success) {
        setSuccess('Draw published successfully!');
        setSimulation(null);
        // Refresh draws list
        const refreshRes = await fetch('/api/draws');
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setDraws(refreshData.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish draw');
    } finally {
      setLoading(false);
    }
  };

  const formatPence = (pence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(pence / 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-white">
            DRAW <span className="text-emerald-500">ENGINE</span>
          </h1>
          <p className="text-zinc-500 font-medium">Manage monthly prize pools and winners.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
          <button 
            onClick={() => switchTab('management')}
            className={`px-6 py-2 font-bold rounded-xl transition-all ${
              activeTab === 'management' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Management
          </button>
          <button 
            onClick={() => switchTab('rollovers')}
            className={`px-6 py-2 font-bold rounded-xl transition-all ${
              activeTab === 'rollovers' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Rollovers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'management' ? (
          <>
            {/* Left Column: Controls */}
            <div className="lg:col-span-1 space-y-8">
              <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Play className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Simulate Draw</h2>
                </div>

                <form onSubmit={handleSimulate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Draw Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                      <input 
                        type="date" 
                        value={formData.draw_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, draw_date: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Draw Mode</label>
                    <div className="grid grid-cols-1 gap-2">
                      {(['random', 'weighted_common', 'weighted_rare'] as DrawMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, draw_mode: mode }))}
                          className={`px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all ${
                            formData.draw_mode === mode 
                              ? 'bg-zinc-800 border-zinc-600 text-white' 
                              : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800'
                          }`}
                        >
                          {MODE_LABELS[mode]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing...' : simulation ? 'Re-Simulate' : 'Run Simulation'}
                    {!loading && <Dice5 className="w-5 h-5" />}
                  </button>
                </form>
              </section>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-500"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3 text-emerald-500"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{success}</p>
                </motion.div>
              )}
            </div>

            {/* Right Column: Simulation Results or History */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {simulation ? (
                  <motion.section
                    key="simulation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-zinc-900 border-2 border-emerald-500/20 rounded-[3rem] p-10 space-y-10 relative overflow-hidden">
                      {/* Decorative background numbers */}
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                        <span className="text-9xl font-black">SIM</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            Preview Only
                          </div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Simulation Results</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {simulation.drawn_numbers.map(n => (
                            <div key={n} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-white text-lg border border-zinc-700">
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-2">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Pool</p>
                          <p className="text-2xl font-black text-white">{formatPence(simulation.total_prize_pool_pence)}</p>
                        </div>
                        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-2">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Jackpot Pool</p>
                          <p className="text-2xl font-black text-emerald-500">{formatPence(simulation.jackpot_pool_pence)}</p>
                          {simulation.carried_over_amount_pence > 0 && (
                            <p className="text-[10px] font-bold text-zinc-500 italic">Inc. {formatPence(simulation.carried_over_amount_pence)} rollover</p>
                          )}
                        </div>
                        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-2 text-zinc-500">
                          <p className="text-xs font-bold uppercase tracking-widest">Eligible Users</p>
                          <p className="text-2xl font-black text-white">{simulation.total_eligible_users}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Winner Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold">5</div>
                              <span className="text-sm font-bold text-white tracking-tight">Jackpot Level</span>
                            </div>
                            <span className="text-lg font-black text-white">{simulation.winner_counts.tier1} <span className="text-xs text-zinc-500 font-bold">winners</span></span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-400/10 flex items-center justify-center text-zinc-400 font-bold">4</div>
                              <span className="text-sm font-bold text-white tracking-tight">Tier 2 Winners</span>
                            </div>
                            <span className="text-lg font-black text-white">{simulation.winner_counts.tier2} <span className="text-xs text-zinc-500 font-bold">winners</span></span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-700/10 flex items-center justify-center text-orange-700 font-bold">3</div>
                              <span className="text-sm font-bold text-white tracking-tight">Tier 3 Winners</span>
                            </div>
                            <span className="text-lg font-black text-white">{simulation.winner_counts.tier3} <span className="text-xs text-zinc-500 font-bold">winners</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Top Winners Preview</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {simulation.top_winners.map((winner) => (
                            <div key={winner.user_id} className="p-4 bg-zinc-950/30 rounded-2xl border border-zinc-800 flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-white">{winner.name}</p>
                                <p className="text-[10px] font-black text-zinc-500 uppercase">{winner.match_count} Match</p>
                              </div>
                              <p className="font-black text-emerald-500">{formatPence(winner.prize_amount_pence)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <TrendingUp className="w-5 h-5" />
                          <p className="text-sm font-medium">Ready for publication? All results will be finalized.</p>
                        </div>
                        <button
                          onClick={handlePublish}
                          disabled={loading}
                          className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-3"
                        >
                          {loading ? 'Publishing...' : 'Finalize & Publish'}
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.section>
                ) : (
                  <motion.section
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 ml-2">
                      <History className="w-6 h-6 text-zinc-500" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recent Published Draws</h2>
                    </div>

                    <div className="space-y-4">
                      {draws.length === 0 ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-20 text-center space-y-4">
                          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                            <Trophy className="w-8 h-8" />
                          </div>
                          <p className="text-zinc-500 font-medium">No draws have been published yet.</p>
                        </div>
                      ) : (
                        draws.map((draw) => (
                          <div key={draw.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                  <div className="space-y-1">
                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{draw.draw_date}</p>
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-xl font-black text-white uppercase">{MODE_LABELS[draw.draw_mode]}</h4>
                                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded uppercase">Published</span>
                                    </div>
                                  </div>
                                  <div className="h-8 w-px bg-zinc-800 hidden md:block" />
                                  <div className="hidden md:flex items-center gap-4">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-zinc-600 uppercase">Jackpot</p>
                                      <p className="text-sm font-black text-zinc-300">{formatPence(draw.jackpot_pool_pence)}</p>
                                    </div>
                                    <div className="space-y-1 text-center px-4">
                                      <p className="text-[10px] font-bold text-zinc-600 uppercase">Numbers</p>
                                      <div className="flex gap-1 justify-center">
                                        {draw.drawn_numbers.map(n => <span key={n} className="text-[10px] font-black text-emerald-500">{n}</span>)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <button className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 space-y-8"
            >
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Rollover Chains</h2>
              </div>

              <div className="space-y-4">
                {rollovers.length === 0 ? (
                  <p className="text-zinc-500 font-medium p-10 text-center">No rollover records found.</p>
                ) : (
                  rollovers.map((r) => (
                    <div key={r.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-600 uppercase">From Draw</p>
                          <p className="font-bold text-white">{r.from_draw?.draw_date} <span className="text-[10px] text-zinc-500">[{r.from_draw?.status}]</span></p>
                        </div>
                        <div className="h-8 w-px bg-zinc-800" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-600 uppercase">Rollover Amount</p>
                          <p className="font-bold text-emerald-500">{formatPence(r.amount_pence)}</p>
                        </div>
                        <div className="h-8 w-px bg-zinc-800" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-zinc-600 uppercase">Applied To</p>
                          <p className="font-bold text-white">{r.to_draw?.draw_date || 'Pending...'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
