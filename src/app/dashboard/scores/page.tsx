import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ScoreClientPage } from '@/app/dashboard/scores/ScoreClientPage';
    
export default async function ScoresPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Pre-fetch initial scores
  const { data: scores } = await supabase
    .from('golf_scores')
    .select('id, score, played_at, created_at')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false });

  // Check subscription status
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            My Scores
          </h1>
          <p className="text-sm md:text-base font-bold text-zinc-500 uppercase tracking-widest">
            Enter your 5 latest Stableford points
          </p>
        </header>

        <ScoreClientPage 
          initialScores={scores || []} 
          isSubscribed={!!sub} 
        />
      </div>
    </div>
  );
}
