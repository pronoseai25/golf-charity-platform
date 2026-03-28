"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  CreditCard, 
  Trophy, 
  Heart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart, SubscriberChart } from "@/components/admin/Charts";
import { ApiResponse } from "@/types";

interface AdminStats {
  users: {
    total: number;
    active_subscribers: number;
    new_this_month: number;
    churn_this_month: number;
  };
  revenue: {
    total_this_month_pence: number;
    total_all_time_pence: number;
    prize_pool_distributed_pence: number;
    charity_distributed_pence: number;
  };
  draws: {
    total_published: number;
    last_draw_date: string | null;
    next_draw_date: string;
    next_draw_status: string;
    current_jackpot_pence: number;
  };
  winners: {
    pending_verification: number;
    pending_payment: number;
    paid_this_month: number;
  };
  charts: {
    revenue: { month: string; revenue: number }[];
    subscribers: { date: string; subscribers: number }[];
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json() as ApiResponse<AdminStats>;
        if (json.success && json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Countdown clock effect
  useEffect(() => {
    if (!stats?.draws.next_draw_date) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(stats.draws.next_draw_date);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("DRAWING...");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [stats?.draws.next_draw_date]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="text-indigo-600 animate-spin" size={40} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Powering Up Metrics...</p>
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats</div>;

  const currentRevenuePounds = stats.revenue.total_this_month_pence / 100;
  const jackpotPounds = stats.draws.current_jackpot_pence / 100;
  const charityPounds = stats.revenue.charity_distributed_pence / 100;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif text-slate-900 italic tracking-tighter">Dashboard Overview.</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic mt-1">Platform performance at a glance.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all shrink-0">
           <Calendar size={16} className="text-slate-300" />
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-0.5 italic">Next Draw In</p>
              <p className="text-sm font-serif italic text-slate-900 leading-none">{countdown || 'Calculating...'}</p>
           </div>
        </div>
      </div>

      {/* Main Stats Row — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatsCard 
          title="Subscribers" 
          value={stats.users.active_subscribers} 
          change={`+${stats.users.new_this_month}`}
          changeType="positive"
          icon={Users}
          subtext={`of ${stats.users.total} total`}
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Revenue" 
          value={`$${currentRevenuePounds.toLocaleString()}`} 
          change="8.2%"
          changeType="positive"
          icon={CreditCard}
          subtext="This month"
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Charity Impact" 
          value={`$${charityPounds.toLocaleString()}`} 
          change="12%"
          changeType="positive"
          icon={Heart}
          subtext="Donated"
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Jackpot" 
          value={`$${jackpotPounds.toLocaleString()}`} 
          changeType="neutral"
          icon={Trophy}
          subtext="Next draw"
          className="border-slate-100 bg-white"
        />
      </div>

      {/* Charts Row — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
         <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="text-lg font-serif italic text-slate-900 flex items-center gap-2">
                    Revenue Trend
                    <TrendingUp className="text-indigo-400" size={16} />
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Monthly growth</p>
               </div>
               <select className="bg-slate-50 border-none rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest outline-none px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer">
                  <option>6 Months</option>
                  <option>1 Year</option>
               </select>
            </div>
            <div className="h-[240px] w-full">
                <RevenueChart data={stats.charts.revenue} />
            </div>
         </div>

         <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="text-lg font-serif italic text-slate-900">User Growth.</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Subscription tracking</p>
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  Subscribers
               </div>
            </div>
            <div className="h-[240px] w-full">
                <SubscriberChart data={stats.charts.subscribers} />
            </div>
         </div>
      </div>

      {/* Bottom Section — stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Winners Queue */}
          <div className="lg:col-span-8 bg-[#050810] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                     <Trophy size={20} />
                   </div>
                   <h3 className="text-xl font-serif italic tracking-tight">Winners Queue.</h3>
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 italic">
                  <span className="text-white font-bold">{stats.winners.pending_verification + stats.winners.pending_payment} entries</span> require verification.
                </p>
                
                <div className="flex gap-3 mb-6">
                   <div className="bg-white/5 border border-white/5 px-4 py-4 rounded-2xl flex-1">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 italic">
                         <Clock size={11} /> Awaiting Proof
                      </div>
                      <p className="text-2xl font-serif italic">{stats.winners.pending_verification}</p>
                   </div>
                   <div className="bg-white/5 border border-white/5 px-4 py-4 rounded-2xl flex-1">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 italic">
                         <CheckCircle2 size={11} className="text-emerald-400" /> Approved
                      </div>
                      <p className="text-2xl font-serif italic text-emerald-400">{stats.winners.pending_payment}</p>
                   </div>
                </div>

                <Link 
                  href="/admin/winners"
                  className="flex items-center justify-center gap-3 bg-white text-slate-900 font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto sm:inline-flex"
                >
                  Go to Queue
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                </Link>
             </div>
          </div>

          {/* Operations */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink size={18} className="text-slate-300" />
                <div>
                  <h3 className="text-base font-serif italic text-slate-900">Operations.</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Management modules</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                 <Link href="/admin/users" className="w-full py-4 px-5 bg-white border border-slate-100 hover:border-indigo-100 rounded-xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Manage Users</span>
                    <Users size={15} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                 </Link>
                 <Link href="/admin/charities" className="w-full py-4 px-5 bg-white border border-slate-100 hover:border-rose-100 rounded-xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Charity Impact</span>
                    <Heart size={15} className="text-slate-300 group-hover:text-rose-600 transition-all" />
                 </Link>
                 <Link href="/admin/draws" className="w-full py-4 px-5 bg-white border border-slate-100 hover:border-amber-100 rounded-xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Draw Engine</span>
                    <TrendingUp size={15} className="text-slate-300 group-hover:text-amber-600 transition-all" />
                 </Link>
              </div>
          </div>
      </div>
    </div>
  );
}
