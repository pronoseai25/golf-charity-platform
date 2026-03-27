import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Heart, Globe, ArrowLeft, BadgeCheck, Lock, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CharityProfileClient } from './CharityProfileClient';
  
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: charity } = await supabase.from('charities').select('name, description').eq('slug', slug).single();

  return {
    title: `${charity?.name || 'Charity'} | Golf Charity Platform`,
    description: charity?.description || 'Learn more about this impactful cause.',
  };
}

export default async function CharityProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Charity Details
  const { data: charity, error } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !charity) notFound();

  // 2. Fetch User & Subscription Status
  const { data: { user } } = await supabase.auth.getUser();
  
  let isSubscribed = false;
  let isCurrentCharity = false;

  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    isSubscribed = !!sub;

    const { data: userData } = await supabase
      .from('users')
      .select('selected_charity_id')
      .eq('id', user.id)
      .single();
    
    isCurrentCharity = userData?.selected_charity_id === charity.id;
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Back Link */}
        <Link 
          href="/charities" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-[3rem] overflow-hidden aspect-video border border-white/5 shadow-2xl">
              <img 
                src={charity.image_url} 
                alt={charity.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
              
              {charity.is_featured && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-orange-500/20">
                  <BadgeCheck className="w-4 h-4" />
                  Featured Partner
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {charity.name}
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-medium">
                  {charity.description}
                </p>
                <div className="h-px w-full bg-white/5 my-8" />
                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Impact Mission</h4>
                <p className="text-zinc-500 leading-relaxed">
                  Every month, our community contributes to {charity.name} through their subscription engagement. 
                  These funds are directed towards critical mission programs that drive real, measurable change 
                  in the areas this charity services.
                </p>
              </div>

              {charity.website_url && (
                <a 
                  href={charity.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-sm font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
                >
                  <Globe className="w-5 h-5 text-orange-500" />
                  Visit Official Website
                </a>
              )}
            </div>
          </div>

          {/* Right: Selection Card */}
          <div className="lg:col-span-5 sticky top-32">
             <div className="p-8 md:p-12 bg-zinc-900 border border-white/5 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] pointer-events-none rounded-full" />
                
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white tracking-tight leading-none">Your Support</h2>
                   <p className="text-sm text-zinc-500 font-medium">Drive your membership impact here.</p>
                </div>

                <div className="h-px w-full bg-white/5" />

                <CharityProfileClient 
                   charityId={charity.id}
                   isLoggedIn={!!user}
                   isSubscribed={isSubscribed}
                   isCurrent={isCurrentCharity}
                />

                <div className="pt-8 flex flex-col items-center gap-4 text-center">
                   <div className="p-4 rounded-full bg-zinc-950 border border-white/5 text-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Heart className="w-8 h-8 fill-orange-500" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 leading-relaxed max-w-[200px]">
                      Your choice directly funds this mission.
                   </p>
                </div>
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}
