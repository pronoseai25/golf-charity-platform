import { Metadata } from 'next';
import HeroSection from '@/components/public/HeroSection';
import HowItWorksSection from '@/components/public/HowItWorksSection';
import PrizePoolSection from '@/components/public/PrizePoolSection';
import FeaturedCharities from '@/components/public/FeaturedCharities';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import CtaSection from '@/components/public/CtaSection';

export const metadata: Metadata = {
  title: 'Golf Charity | Play Golf. Win Prizes. Change Lives.',
  description: 'The first subscription platform connecting your game with causes that matter. Enter your Stableford scores each month to win big while supporting a charity you love.',
  keywords: ['golf', 'charity', 'prize draw', 'stableford', 'lottery', 'subscription'],
};

/**
 * Homepage - Server Component
 * Fetches featured charities and latest draw data to pass down to interactive sections.
 */
export default async function HomePage() {
  // 1. Fetch Featured Charities
  const charitiesRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/charities?featured=true`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  const charitiesData = charitiesRes.status === 200 ? await charitiesRes.json() : { data: [] };

  // 2. Fetch Latest Draw (for prize pool counter)
  const drawsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/draws`, {
    next: { revalidate: 60 } // Cache for 1 minute
  });
  const drawsData = drawsRes.status === 200 ? await drawsRes.json() : { data: [] };
  const latestDraw = drawsData.data?.[0] || null;

  return (
    <main className="flex flex-col">
      <HeroSection />
      
      <HowItWorksSection />
      
      <PrizePoolSection latestDraw={latestDraw} />
      
      <FeaturedCharities charities={charitiesData.data || []} />
      
      <TestimonialsSection />
      
      <CtaSection />
    </main>
  );
}
