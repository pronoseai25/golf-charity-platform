'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Target, 
  Heart, 
  Trophy, 
  Wallet, 
  LogOut, 
  Menu, 
  X,
  CreditCard 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Overview', icon: Home, href: '/dashboard' },
  { label: 'My Scores', icon: Target, href: '/dashboard/scores' },
  { label: 'Charities', icon: Heart, href: '/dashboard/charities' },
  { label: 'Draws', icon: Trophy, href: '/dashboard/draws' },
  { label: 'Winnings', icon: Wallet, href: '/dashboard/winnings' },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    async function checkNotifications() {
      try {
        const res = await fetch('/api/winner');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const pending = data.data.some((v: any) => v.status === 'awaiting_proof' || v.status === 'rejected');
          setHasPending(pending);
        }
      } catch (err) {
        console.error('Failed to check winner notifications');
      }
    }
    checkNotifications();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/signin');
      router.refresh();
    } catch (err) {
      console.error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0f1e] border-r border-white/5 h-screen sticky top-0 py-8">
        <div className="px-8 mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">GolfCharity</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const showDot = item.label === 'Winnings' && hasPending;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="relative">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-emerald-400 transition-colors")} />
                    {showDot && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#0a0f1e]" />}
                </div>
                <span className="font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full ml-[-4px]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all duration-200 font-bold tracking-tight"
          >
            <LogOut className="w-5 h-5" />
            <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-t border-white/5 px-2 py-3 pb-safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                  isActive ? "text-emerald-400" : "text-gray-500"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-emerald-400/10")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label.split(' ')[1] || item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
