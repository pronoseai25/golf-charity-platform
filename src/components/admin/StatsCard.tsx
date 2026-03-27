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
      "p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
          <Icon className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={24} />
        </div>
        {change && (
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold font-outfit",
            changeType === "positive" ? "bg-green-50 text-green-700" : 
            changeType === "negative" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"
          )}>
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 font-outfit">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {subtext && <span className="text-xs font-medium text-slate-400">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}
