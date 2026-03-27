'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApiResponse } from '@/types';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        // Rule: Password never stored in state after submission
        setPassword('');
        
        const data: ApiResponse = await res.json();
      
      if (!data.success) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-10 p-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-black tracking-tighter text-white">Sign In</h2>
        <p className="text-gray-400 font-medium">Welcome back! Sign in to manage your scores and draws.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5 ring-offset-background transition-all focus-within:ring-2 focus-within:ring-emerald-500/50 rounded-xl overflow-hidden">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5 ring-offset-background transition-all focus-within:ring-2 focus-within:ring-emerald-500/50 rounded-xl overflow-hidden">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/auth/forgot-password" title="Feature coming soon" className="text-sm font-bold text-gray-500 hover:text-emerald-400 transition-colors">
            Forgot password?
          </Link>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white py-4 rounded-xl font-black tracking-tight text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Sign In
              <div className="group-hover:translate-x-1 transition-transform">→</div>
            </>
          )}
        </button>
      </form>

      <p className="text-center font-bold text-gray-500">
        Don't have an account?{' '}
        <Link href="/signup" className="text-emerald-400 hover:underline decoration-2 underline-offset-4 decoration-emerald-500/30 font-black">
          Sign up
        </Link>
      </p>
    </div>
  );
}
