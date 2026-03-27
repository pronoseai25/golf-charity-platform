import Link from 'next/link';
import { Rocket, Globe, Share2, Heart, Search } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              GolfCharity
            </span>
          </Link>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            Play Golf. Win Prizes. Change Lives. The first subscription platform connecting your game with causes that matter.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links: Platform */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Platform</h4>
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Home</Link>
            <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">How It Works</Link>
            <Link href="/charities" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Charities</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Pricing</Link>
          </nav>
        </div>

        {/* Links: Account */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Account</h4>
          <nav className="flex flex-col gap-4">
            <Link href="/signin" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Sign In</Link>
            <Link href="/signup" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Sign Up</Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Dashboard</Link>
          </nav>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Legal</h4>
          <nav className="flex flex-col gap-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Terms of Service</Link>
          </nav>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Heart className="w-5 h-5 fill-indigo-400" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Charity Verified</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs font-black text-gray-600 uppercase tracking-widest">
            <span>Powered by Stripe</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>&copy; {currentYear} GolfCharity</span>
        </div>
        <p className="text-[10px] text-gray-600 font-medium italic text-center md:text-right max-w-sm">
            This platform is for entertainment. Every subscription contributes to verified charities. Please play responsibly.
        </p>
      </div>
    </footer>
  );
}
