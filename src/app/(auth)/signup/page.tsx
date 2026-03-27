import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — GolfCharity',
  description: 'Create your GolfCharity account and start contributing while competing for prizes.',
};

export default function SignUpPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SignUpForm />
    </div>
  );
}
