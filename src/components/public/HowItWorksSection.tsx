'use client';

import { motion } from 'framer-motion';
import { CreditCard, Target, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Subscribe to play',
    description: 'Choose monthly or yearly. Cancel anytime. Instant access.',
    icon: <CreditCard className="w-8 h-8" />,
    color: 'bg-indigo-600'
  },
  {
    number: '02',
    title: 'Enter your scores',
    description: 'Log your last 5 Stableford scores each month to enter the draw.',
    icon: <Target className="w-8 h-8" />,
    color: 'bg-sky-600'
  },
  {
    number: '03',
    title: 'Win prizes. Give back.',
    description: 'Match 3, 4 or 5 numbers to win. A portion of every subscription goes to your chosen charity.',
    icon: <Trophy className="w-8 h-8" />,
    color: 'bg-emerald-600'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="space-y-4">
               <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100/50">The Process</span>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                 How It Works
               </h2>
               <p className="text-lg text-gray-500 font-medium max-w-md">
                 Three simple steps to connect your passion for golf with meaningful charitable impact.
               </p>
          </div>
          <Link 
            href="/how-it-works"
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors uppercase tracking-widest"
          >
            Learn more about mechanics
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
          {/* Subtle connecting lines (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gray-100 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 p-10 bg-white border border-gray-100 rounded-[3rem] space-y-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group"
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-gray-100 group-hover:text-indigo-50 transition-colors">
                  {step.number}
                </span>
                <div className={`p-4 rounded-2xl ${step.color} text-white shadow-xl shadow-indigo-600/10`}>
                  {step.icon}
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    {step.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                    {step.description}
                </p>
              </div>

              {/* Bottom Decorative Circle */}
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
