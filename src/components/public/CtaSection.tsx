'use client';

import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-24 bg-[#0ea5e9] relative overflow-hidden">
      {/* Background Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-transparent blur-3xl opacity-50" />
      <div className="absolute inset-0 mix-blend-overlay opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-12"
        >
          {/* Main Content */}
          <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md">
                 <Rocket className="w-4 h-4" />
                 Launch your subscription
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                 Ready to play, win,<br />
                 and <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 italic">change lives?</span>
               </h2>
               <p className="text-xl text-white/80 font-medium max-w-2xl leading-relaxed">
                 Join thousands of golfers making every round count. One monthly subscription, hundreds of prize opportunities, and real charitable impact.
               </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-12 py-6 bg-white hover:bg-white/95 text-sky-600 font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3 group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/pricing" 
              className="w-full sm:w-auto px-12 py-6 bg-white/10 hover:bg-white/15 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-white/20 active:scale-95 text-center"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-12 pt-12 border-t border-white/10 w-full">
            <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" />
              Stripe Secured
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
              <CreditCard className="w-5 h-5" />
              Cancel Anytime
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                <Rocket className="w-5 h-5 fill-white" />
                Charity Verified
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
