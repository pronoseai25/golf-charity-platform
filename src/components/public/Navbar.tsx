'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, LayoutDashboard, LogIn, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, ApiResponse } from '@/types';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/charities', label: 'Charities' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Scroll Detection
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Auth Check
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 200) {
          const data: ApiResponse<User> = await res.json();
          setUser(data.data ?? null);
        }
      } catch (err) {
        console.error('Auth check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Rocket className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-2xl font-black tracking-tighter transition-colors",
            isScrolled ? "text-gray-900" : "text-white"
          )}>
            GolfCharity
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-bold tracking-tight transition-colors hover:text-indigo-600",
                  isActive 
                    ? "text-indigo-600" 
                    : (isScrolled ? "text-gray-600" : "text-gray-300 hover:text-white")
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-10 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/signin"
                className={cn(
                  "text-sm font-bold tracking-tight transition-all hover:opacity-80",
                  isScrolled ? "text-gray-600" : "text-gray-300"
                )}
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            "lg:hidden p-2 rounded-xl transition-colors",
            isScrolled ? "bg-gray-100 text-gray-900" : "bg-white/10 text-white"
          )}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-gray-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                {user ? (
                   <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center font-bold text-gray-600"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center font-bold bg-indigo-600 text-white py-4 rounded-2xl shadow-lg shadow-indigo-600/20"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
