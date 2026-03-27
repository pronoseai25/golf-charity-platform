'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { LogOut, User as UserIcon, Bell, ChevronDown, Loader2 } from 'lucide-react';
import { User, ApiResponse } from '@/types';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data: ApiResponse<User> = await res.json();
        
        if (!data.success) {
          router.push('/signin');
          return;
        }
        
        setUser(data.data ?? null);
      } catch (err) {
        console.error('Session check failed');
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded bg-emerald-500/20 blur-xl animate-pulse" />
                </div>
            </div>
          <span className="text-gray-400 font-bold tracking-tight animate-pulse underline decoration-emerald-500 underline-offset-4 decoration-2">Authorizing Access...</span>
        </div>
      </div>
    );
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';
  const pageTitle = pathname.split('/').pop();
  const formattedTitle = pageTitle && pageTitle !== 'dashboard' 
    ? pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1) 
    : 'Overview';

  return (
    <div className="flex min-h-screen bg-[#070b14] text-white">
      {/* Sidebar - DashboardNav */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#070b14]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tighter text-white">
                {formattedTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors group">
              <Bell className="w-6 h-6 group-hover:fill-emerald-400 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#070b14]" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/5" />

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end hidden sm:block">
                <span className="text-sm font-black tracking-tight text-white leading-none mb-1">{user?.name}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] leading-none">PLAYER</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 pb-32 lg:pb-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}
