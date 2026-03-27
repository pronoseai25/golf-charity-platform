import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CharityProfileContent from '@/app/(landing)/charities/[slug]/CharityProfileContent';
import { ApiResponse } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/charities/${slug}`);
    const data: ApiResponse = await res.json();
    const charity = data.data;

    return {
      title: `${charity?.name || 'Charity'} | Golf Charity Platform`,
      description: charity?.description || 'Learn more about this impactful cause.',
    };
  } catch (err) {
    return {
      title: 'Charity Profile | Golf Charity Platform'
    };
  }
}

export default async function CharityProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <CharityProfileContent slug={slug} />
  );
}
