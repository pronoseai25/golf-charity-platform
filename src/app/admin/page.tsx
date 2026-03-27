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
    next_draw_status: string;
    current_jackpot_pence: number;
  };
  winners: {
    pending_verification: number;
    pending_payment: number;
    paid_this_month: number;
  };
}

// Mock historical data for charts
const revenueChartData = [
  { month: "Oct", revenue: 4200 },
  { month: "Nov", revenue: 4800 },
  { month: "Dec", revenue: 5600 },
  { month: "Jan", revenue: 5100 },
  { month: "Feb", revenue: 6200 },
  { month: "Mar", revenue: 7400 },
];

const subscriberChartData = [
  { date: "Oct 1", subscribers: 120 },
  { date: "Nov 1", subscribers: 145 },
  { date: "Dec 1", subscribers: 180 },
  { date: "Jan 1", subscribers: 210 },
  { date: "Feb 1", subscribers: 245 },
  { date: "Mar 1", subscribers: 288 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 font-outfit">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Platform performance at a glance. Updated today.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
           <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
             <Calendar size={18} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Next Draw In</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-1 uppercase">12D 04H 22M</p>
           </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Subscribers" 
          value={stats.users.active_subscribers} 
          change={`+${stats.users.new_this_month}`}
          changeType="positive"
          icon={Users}
          subtext={`of ${stats.users.total} users total`}
          className="border-indigo-100/50 bg-indigo-50/5"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`£${currentRevenuePounds.toLocaleString()}`} 
          change="8.2%"
          changeType="positive"
          icon={CreditCard}
          subtext="Pence converted to GBP"
          className="border-green-100/50 bg-green-50/5"
        />
        <StatsCard 
          title="Charity Impact" 
          value="£12,450" 
          change="12%"
          changeType="positive"
          icon={Heart}
          subtext="Donated all-time"
          className="border-rose-100/50 bg-rose-50/5"
        />
        <StatsCard 
          title="Current Jackpot" 
          value={`£${jackpotPounds.toLocaleString()}`} 
          changeType="neutral"
          icon={Trophy}
          subtext="Available next draw"
          className="border-amber-100/50 bg-amber-50/5"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    Revenue Trend
                    <TrendingUp className="text-green-500" size={20} />
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">Track your platform's revenue growth month-by-month.</p>
               </div>
               <select className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 outline-none p-2 pr-6">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            <RevenueChart data={revenueChartData} />
         </div>

         <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-black text-slate-900">User Growth</h3>
                  <p className="text-sm text-slate-400 font-medium">Total active subscriptions lifecycle track.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest">
                     <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                     Subscribers
                  </div>
               </div>
            </div>
            <SubscriberChart data={subscriberChartData} />
         </div>
      </div>

      {/* Bottom Section: Verification Queue & Recent Winners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Verification Panel */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                        <Trophy className="text-amber-400" size={28} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">Winners Queue</h3>
                   </div>
                   <p className="text-slate-400 font-medium mb-6 max-w-md">There are <span className="text-white font-bold">{stats.winners.pending_verification + stats.winners.pending_payment} items</span> in the verification queue that require review or payment processing.</p>
                   
                   <div className="flex flex-wrap gap-4">
                      <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl flex-1 min-w-[150px]">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <Clock size={12} />
                            Pending Proof
                         </div>
                         <p className="text-2xl font-black">{stats.winners.pending_verification}</p>
                      </div>
                      <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl flex-1 min-w-[150px]">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <CheckCircle2 size={12} className="text-green-400" />
                            Approved
                         </div>
                         <p className="text-2xl font-black">{stats.winners.pending_payment}</p>
                      </div>
                   </div>
                </div>

                <div className="shrink-0">
                  <Link 
                    href="/admin/winners"
                    className="group bg-white text-slate-900 font-black px-10 py-5 rounded-3xl transition-all flex items-center gap-3 hover:translate-x-1 hover:-translate-y-1 shadow-xl hover:shadow-white/10"
                  >
                    Go to Queue
                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
             </div>
          </div>

          {/* Quick Actions / Activity Callout */}
          <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                <ExternalLink size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2 font-outfit">Management Panel</h3>
              <p className="text-sm text-slate-400 font-medium mb-8">Access specific management modules to configure the platform.</p>
              
              <div className="w-full flex flex-col gap-3">
                 <Link href="/admin/users" className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 text-sm font-bold flex items-center justify-between group transition-all">
                    <span>Manage Users</span>
                    <Users size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                 </Link>
                 <Link href="/admin/charities" className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 text-sm font-bold flex items-center justify-between group transition-all">
                    <span>Charity Dashboard</span>
                    <Heart size={18} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                 </Link>
                 <Link href="/admin/draws" className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 text-sm font-bold flex items-center justify-between group transition-all">
                    <span>Simulate Draws</span>
                    <TrendingUp size={18} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                 </Link>
              </div>
          </div>
      </div>
    </div>
  );
}
