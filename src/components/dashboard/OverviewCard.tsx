'use client';

import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OverviewCardProps {
  title: string;
  value: string | number;
  subText: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'rose' | 'amber';
  loading?: boolean;
}

export default function OverviewCard({
  title,
  value,
  subText,
  icon: Icon,
  color = 'emerald',
  loading = false
}: OverviewCardProps) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 shadow-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10 shadow-blue-500/10',
    rose: 'text-rose-400 bg-rose-500/10 shadow-rose-500/10',
    amber: 'text-amber-400 bg-amber-500/10 shadow-amber-500/10',
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 bg-white/5 rounded-2xl" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl mb-3" />
        <div className="h-4 w-48 bg-white/5 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="group bg-[#0f172a] hover:bg-[#131d36] border border-white/5 hover:border-emerald-500/20 rounded-3xl p-6 lg:p-8 transition-all duration-300 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
        color === 'emerald' && "bg-emerald-500",
        color === 'blue' && "bg-blue-500",
        color === 'rose' && "bg-rose-500",
        color === 'amber' && "bg-amber-500"
      )} />

      <div className="flex items-center justify-between mb-8">
        <div className={cn("p-4 rounded-2xl shadow-lg", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">{title}</h3>
        <p className="text-3xl lg:text-4xl font-black tracking-tighter text-white tabular-nums leading-none mb-1">
          {value}
        </p>
        <p className="text-sm font-bold text-gray-400 tracking-tight">{subText}</p>
      </div>
    </div>
  );
}
