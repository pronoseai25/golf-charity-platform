'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I won the jackpot in my third month! Amazing platform that actually gives back.",
    author: "James T.",
    location: "Manchester",
    rating: 5,
    initials: "JT"
  },
  {
    quote: "Love that I can support Cancer Research while playing golf. My scores mean more now.",
    author: "Sarah M.",
    location: "Edinburgh",
    rating: 5,
    initials: "SM"
  },
  {
    quote: "The yearly plan is incredible value. Monthly draw results are always the highlight of my week.",
    author: "Paul K.",
    location: "Bristol",
    rating: 5,
    initials: "PK"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#0a0f1e] text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-24 flex flex-col items-center">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 shadow-2xl backdrop-blur-md">Trusted Community</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              Hear from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 italic">Winners.</span>
            </h2>
            <p className="text-lg text-gray-400 font-medium max-w-xl">
              Join thousands of golfers who are winning prizes and making a real difference.
            </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group relative p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-white/5 group-hover:text-indigo-500/10 transition-colors">
                  <Quote size={80} weight="fill" />
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-xl font-medium tracking-tight text-white leading-relaxed italic relative z-20">
                "{t.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-10 border-t border-white/10 group-hover:border-indigo-500/20 transition-all">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                  {t.initials}
                </div>
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-wider">{t.author}</h4>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
