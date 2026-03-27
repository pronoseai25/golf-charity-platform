import { Metadata } from 'next';
import { CharityDirectoryClient } from '@/app/(landing)/charities/CharityDirectoryClient';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Charities | GolfCharity Dashboard',
  description: 'Manage your charitable allocations and discover new missions to support.',
};

export default function CharitiesPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
          Select Charities
        </h1>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Choose up to 2 charities to support with your monthly subscription
        </p>
      </header>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex items-start gap-6 shadow-2xl">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <Info className="w-6 h-6" />
          </div>
          <div className="space-y-2">
              <p className="font-black text-emerald-400 uppercase tracking-widest text-xs">Rule Book</p>
              <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-2xl">You can select up to 2 charities. Your total allocation must be between 10% and 50% of your subscription price. You can change these at any time before the next draw.</p>
          </div>
      </div>

      <CharityDirectoryClient />
    </div>
  );
}
