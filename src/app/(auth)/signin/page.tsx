import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — GolfCharity',
  description: 'Sign in to your GolfCharity account to manage your scores and draws.',
};

export default function SignInPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SignInForm />
    </div>
  );
}
