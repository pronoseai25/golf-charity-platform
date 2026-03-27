'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const faqs = [
  {
    question: "How does the monthly draw work?",
    answer: "Every month, you enter your last 5 Stableford scores into the platform. On the final day of the month, a winning set of 5 numbers is drawn. If your scores match 3, 4, or 5 of the drawn numbers, you win a share of the monthly prize pool."
  },
  {
    question: "When is the draw published?",
    answer: "The draw is published on the last day of each month. You'll receive an email notification as soon as the results are finalized, and you can check your winnings directly in your dashboard."
  },
  {
    question: "How do I claim my prize?",
    answer: "If you win, you'll need to upload a screenshot or proof of your verified Stableford score from your official golf tracking app. Once an admin verifies the proof, your payment is processed via Stripe within 48-72 hours."
  },
  {
    question: "Which charities can I support?",
    answer: "You can support any charity in our verified directory. We partner with dozens of organizations across research, mental health, and community sports. A minimum of 10% of your subscription goes to your selected cause, but you can increase this up to 50%."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, 100%. We use Stripe, the world's leading payment processor, to handle all transactions. Your payment details never touch our servers, and you can cancel your subscription at any time with a single click."
  },
  {
    question: "What happens if the jackpot isn't won?",
    answer: "If no one matches all 5 numbers in a given month, the jackpot pool 'rolls over' to the following month. This means the prize pool can grow significantly, sometimes reaching five or six figures until someone wins."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20 flex flex-col items-center">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100/50">Questions</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
              Common <span className="text-indigo-600 italic">Queries.</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              Everything you need to know about the platform mechanics, prize distributions, and charitable giving.
            </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={cn(
                  "border-b border-gray-100 last:border-0 overflow-hidden transition-all duration-300",
                  openIndex === idx ? "bg-gray-50 rounded-[2rem] p-4" : "p-4"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-6">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        openIndex === idx ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-gray-100 text-gray-400 group-hover:text-indigo-600"
                    )}>
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className={cn(
                        "text-lg font-black tracking-tight transition-colors",
                        openIndex === idx ? "text-gray-900" : "text-gray-600 group-hover:text-indigo-600"
                    )}>
                        {faq.question}
                    </span>
                </div>
                <div className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                    openIndex === idx ? "bg-white border-white text-indigo-600 rotate-180" : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600"
                )}>
                    {openIndex === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: 'auto', marginBottom: 24 },
                      collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="pl-16 pr-10">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center p-8 bg-indigo-50 border border-indigo-100/50 rounded-[2.5rem]">
            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                Still have questions? <Link href="/contact" className="text-indigo-600 hover:text-indigo-500 underline decoration-2 underline-offset-4">Get in touch with our team</Link>
            </p>
        </div>

      </div>
    </section>
  );
}
