'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Heart, ChevronRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-[#070b14] overflow-hidden pt-20">
      {/* Background Animated Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 animate-pulse delay-700" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full lg:grid lg:grid-cols-2 lg:gap-12 items-center">
        
        {/* Left: Content */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-10"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            Monthly Prize Draws · Charity · Golf
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl"
          >
            Play Golf.<br />
            Win Prizes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 italic">Change Lives.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-gray-400 font-medium max-w-xl leading-relaxed"
          >
            Enter your Stableford scores each month for a chance to win big — while supporting a charity you love.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3 group"
            >
              Start Playing
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/how-it-works" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 active:scale-95 text-center"
            >
              How It Works
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/10"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Secure Payments
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              Cancel Anytime
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <Target className="w-4 h-4 text-sky-400" />
                2 Months free on yearly
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Abstract Graphics */}
        <div className="hidden lg:block relative h-[600px]">
             <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
             >
                {/* Abstract Glowing Rings */}
                <div className="relative">
                    <div className="w-[450px] h-[450px] rounded-full border border-indigo-500/10 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-0 w-[450px] h-[450px] rounded-full border border-sky-500/10 animate-[spin_15s_linear_infinite_reverse]" />
                    
                    {/* Floating Data Nodes */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 left-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
                    >
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-10 right-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
                    >
                        <Target className="w-8 h-8 text-indigo-500" />
                    </motion.div>
                </div>
             </motion.div>
        </div>

      </div>
    </section>
  );
}
