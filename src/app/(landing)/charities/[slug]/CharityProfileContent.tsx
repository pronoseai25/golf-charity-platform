'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Heart, Globe, ArrowLeft, BadgeCheck, ExternalLink, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CharityProfileClient } from './CharityProfileClient';
import { CharityEventCard } from '@/components/charities/CharityEventCard';
import { ApiResponse, User, Subscription, Charity } from '@/types';

interface CharityExtended extends Charity {
  events: any[];
}

interface CharityProfileContentProps {
  slug: string;
}

export default function CharityProfileContent({ slug }: CharityProfileContentProps) {
  const [charity, setCharity] = useState<CharityExtended | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userCharities, setUserCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch Charity Details
        const charRes = await fetch(`/api/charities/${slug}`);
        const charData: ApiResponse = await charRes.json();
        
        if (!charData.success) {
          setError(charData.error || "Charity not found");
          return;
        }
        setCharity(charData.data);

        // 2. Fetch User & Support Status (if logged in)
        const userRes = await fetch('/api/auth/me');
        if (userRes.status === 200) {
          const userData: ApiResponse<User> = await userRes.json();
          if (userData.success && userData.data) {
            setUser(userData.data);
            
            // Sub status check
            const subRes = await fetch('/api/subscriptions/me');
            const subData: ApiResponse<Subscription> = await subRes.json();
            if (subData.success && subData.data?.status === 'active') {
              setIsSubscribed(true);
            }

            // User charities check
            const userCharRes = await fetch('/api/user/charities');
            const userCharData: ApiResponse<any[]> = await userCharRes.json();
            if (userCharData.success) {
              setUserCharities(userCharData.data || []);
            }
          }
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 bg-zinc-950 min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing Charity HQ...</p>
      </div>
    );
  }

  if (error || !charity) {
    return (
        <div className="min-h-screen bg-zinc-950 pt-40 px-6">
            <div className="max-w-md mx-auto p-12 bg-rose-500/10 border border-rose-500/20 rounded-[3rem] text-center space-y-6">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Profile Offline</h3>
                <p className="text-rose-400 font-medium">{error || "Could not load this mission profile."}</p>
                <Link href="/charities" className="block w-full py-4 bg-rose-500 text-white font-black rounded-2xl">
                    Back to directory
                </Link>
            </div>
        </div>
    );
  }

  const userCharityData = userCharities.find(c => c.charity_id === charity.id) || null;
  const totalAllocated = userCharities.reduce((acc, curr) => acc + curr.allocation_perc, 0);
  const currentSelectionsCount = userCharities.length;

  return (
    <main className="min-h-screen pt-40 pb-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
           <Link 
             href="/charities" 
             className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
           >
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             Impact Directory
           </Link>
           
           {userCharityData && (
              <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-2xl">
                 <BadgeCheck className="w-5 h-5 text-emerald-500" />
                 <span className="text-[12px] font-black uppercase tracking-widest text-emerald-500">
                    Supporting: {userCharityData.allocation_perc}% Allocation
                 </span>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-16">
            <div className="relative rounded-[4rem] overflow-hidden aspect-video border border-white/5 shadow-2xl group ring-1 ring-white/10 ring-inset">
              <img 
                src={charity.image_url || ''} 
                alt={charity.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              {charity.is_featured && (
                <div className="absolute top-10 left-10 px-8 py-4 bg-orange-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/20">
                  Mission-First Partner
                </div>
              )}
            </div>

            <div className="space-y-10">
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] max-w-2xl drop-shadow-2xl">
                {charity.name}
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-xl md:text-3xl text-zinc-400 leading-relaxed font-black tracking-tight italic">
                  "{charity.description}"
                </p>
                
                <div className="h-px w-full bg-gradient-to-r from-orange-500/50 to-transparent my-16 opacity-30" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6 p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/5 shadow-inner">
                      <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Core Mission</h4>
                      <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                        Digital Heroes transforms every golf round into reliable funding for {charity.name}. 
                        By selecting this mission, 10-50% of your registration fee goes straight to their programs.
                      </p>
                   </div>
                   {charity.website_url && (
                     <div className="space-y-6">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Official Presence</h4>
                        <a 
                          href={charity.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] text-sm font-black uppercase tracking-widest text-zinc-100 hover:text-orange-500 hover:border-orange-500/50 transition-all active:scale-95 group/web shadow-xl"
                        >
                          <Globe className="w-6 h-6 text-orange-500" />
                          Explore Website
                          <ExternalLink className="w-4 h-4 ml-auto opacity-40 group-hover/web:opacity-100 transition-opacity" />
                        </a>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="space-y-10 pt-16 border-t border-white/5">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                    <CalendarDays className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">Impact Events</h2>
               </div>
               
               {charity.events && charity.events.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {charity.events.map((event: any) => (
                      <CharityEventCard key={event.id} event={event} />
                   ))}
                 </div>
               ) : (
                 <div className="p-20 text-center bg-zinc-900/20 border border-white/5 border-dashed rounded-[3.5rem] flex flex-col items-center gap-4">
                    <CalendarDays className="w-12 h-12 text-zinc-800" />
                    <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">No upcoming events listed</p>
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Support Mechanism */}
          <div className="lg:col-span-5 relative mt-16 lg:mt-0">
             <div className="sticky top-40">
                <CharityProfileClient 
                   charityId={charity.id}
                   isLoggedIn={!!user}
                   isSubscribed={isSubscribed}
                   currentSupport={userCharityData}
                   totalAllocated={totalAllocated}
                   currentCount={currentSelectionsCount}
                />
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}
