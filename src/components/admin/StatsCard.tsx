"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  subtext?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  subtext,
  className
}: StatsCardProps) {
  return (
    <div className={cn(
      "p-5 sm:p-7 bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] shadow-sm group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden",
      className
    )}>
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-700 shadow-inner">
          <Icon size={18} className="group-hover:scale-110 transition-transform" />
        </div>
        {change && (
          <div className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-in fade-in slide-in-from-right-2 duration-700",
            changeType === "positive" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
            changeType === "negative" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-50 text-slate-500 border border-slate-100"
          )}>
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">{title}</p>
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl sm:text-4xl font-serif italic text-slate-900 tracking-tighter transition-all duration-500">{value}</h3>
          {subtext && (
            <span className="text-[10px] font-medium text-slate-400 italic opacity-80">{subtext}</span>
          )}
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50/50 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-50/50 transition-colors duration-1000" />
    </div>
  );
}
