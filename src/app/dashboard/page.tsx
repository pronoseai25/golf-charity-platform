'use client';

import { useEffect, useState } from 'react';
import OverviewCard from '@/components/dashboard/OverviewCard';
import SubscriptionBanner from '@/components/dashboard/SubscriptionBanner';
import RecentDrawCard from '@/components/dashboard/RecentDrawCard';
import CharitySummaryCard from '@/components/dashboard/CharitySummaryCard';
import { 
  CreditCard, 
  Trophy, 
  Heart, 
  Ticket, 
  ChevronRight,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    me: null,
    scores: [],
    charities: [],
    draws: [],
    winner: [],
    subscription: null
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [meRes, scoresRes, charitiesRes, drawsRes, winnerRes, subRes] = await Promise.all([
        fetch('/api/auth/me').then(r => r.json()),
        fetch('/api/scores').then(r => r.json()),
        fetch('/api/user/charities').then(r => r.json()),
        fetch('/api/draws').then(r => r.json()),
        fetch('/api/winner').then(r => r.json()),
        fetch('/api/subscriptions/me').then(r => r.json()),
      ]);

      setData({
        me: meRes.success ? meRes.data : null,
        scores: scoresRes.success ? scoresRes.data : [],
        charities: charitiesRes.success ? (charitiesRes.data.charities || []) : [],
        draws: drawsRes.success ? drawsRes.data : [],
        winner: winnerRes.success ? winnerRes.data : [],
        subscription: subRes.success ? subRes.data : null
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScoreAdded = (newScores: any[]) => {
    setData((prev: any) => ({ ...prev, scores: newScores }));
  };

  // Stats Calculations
  const totalWonPence = data.winner
    ?.filter((w: any) => w.status === 'PAID')
    ?.reduce((acc: number, curr: any) => acc + (curr.draw_entry?.prize_amount_pence || 0), 0) || 0;
  
  const drawWins = data.winner?.length || 0;
  const drawEntries = data.draws?.length || 0; // Simplified for demo
  
  const subAmount = data.subscription?.price_pence || 0;
  const totalCharityAllocation = data.charities?.reduce((acc: number, curr: any) => acc + (curr.allocation_perc || 0), 0) || 0;
  // Simplified: (Sub amount * allocation %) * months (assuming 1 for now)
  const estimatedCharityContribution = (subAmount * totalCharityAllocation) / 100 / 100;

  const latestDraw = data.draws?.[0];

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          loading={loading}
          title="Subscription"
          value={data.subscription?.status === 'active' ? 'Active' : 'No Plan'}
          subText={data.subscription?.current_period_end ? `Renews on ${new Date(data.subscription.current_period_end).toLocaleDateString()}` : 'Participate in draws'}
          icon={CreditCard}
          color={data.subscription?.status === 'active' ? 'emerald' : 'amber'}
        />
        <OverviewCard
          loading={loading}
          title="Total Won"
          value={`£${(totalWonPence / 100).toFixed(2)}`}
          subText={`Across ${drawWins} claims`}
          icon={Trophy}
          color="blue"
        />
        <OverviewCard
          loading={loading}
          title="Giving Impact"
          value={`£${estimatedCharityContribution.toFixed(2)}`}
          subText={`To ${data.charities?.length || 0} missions`}
          icon={Heart}
          color="rose"
        />
        <OverviewCard
          loading={loading}
          title="Participation"
          value={drawEntries}
          subText={`${drawWins} wins recorded`}
          icon={Ticket}
          color="amber"
        />
      </div>

      {/* Middle Row: Main Banner + Latest Draw */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <SubscriptionBanner 
            loading={loading}
            subscription={data.subscription}
            scoreCount={data.scores?.length || 0}
            onScoreAdded={handleScoreAdded}
          />
        </div>
        <div className="lg:col-span-4">
          <RecentDrawCard 
            loading={loading}
            draw={latestDraw}
          />
        </div>
      </div>

      {/* Bottom Row: Charities + Score Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CharitySummaryCard 
          loading={loading}
          charities={data.charities}
          subscriptionAmount={subAmount}
        />

        <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 transition-all duration-300 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Performance</h3>
                        <h4 className="text-xl font-black tracking-tight text-white leading-none">Recent Scores</h4>
                    </div>
                </div>
                <Link 
                    href="/dashboard/scores" 
                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group/btn"
                >
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover/btn:text-emerald-400 transition-colors" />
                </Link>
            </div>

            <div className="space-y-4">
                {data.scores?.length > 0 ? (
                    data.scores.slice(0, 3).map((s: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                    <span className="text-xl font-black text-white">{s.score}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Stableford Points</p>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-xs font-bold">{new Date(s.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                            <Target className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500">Record your rounds to track performance.</p>
                    </div>
                )}
            </div>
            
            {data.scores?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Season Average</p>
                        <p className="text-lg font-black text-white">
                            {(data.scores.reduce((a: any, b: any) => a + b.score, 0) / data.scores.length).toFixed(1)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">On Target</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
