import { Metadata } from 'next';
import { ScoreClientPage } from '@/app/dashboard/scores/ScoreClientPage';

export const metadata: Metadata = {
  title: 'My Scores | Golf Charity Platform',
  description: 'Manage your monthly rolling-5 golf score history and tracking.',
};

export default function ScoresPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
          My Scores
        </h1>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Manage your rolling 5 score history
        </p>
      </header>

      <ScoreClientPage />
    </div>
  );
}
