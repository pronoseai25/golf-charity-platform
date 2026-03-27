'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Check, RefreshCw, X, Heart, HeartOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

interface CharitySelectorProps {
  initialCharityId?: string | null;
  onSuccess?: () => void;
}

export const CharitySelector = ({ initialCharityId, onSuccess }: CharitySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);

  // Fetch all active charities for the list
  useEffect(() => {
    const fetchCharities = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/charities');
        const result = await response.json();
        if (result.success) {
          setCharities(result.data);
          // Find the currently selected charity object
          if (initialCharityId) {
            const current = result.data.find((c: Charity) => c.id === initialCharityId);
            if (current) setSelectedCharity(current);
          }
        }
      } catch (err) {
        console.error('Failed to fetch charities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, [initialCharityId]);

  const handleSelect = async (charity: Charity) => {
    setUpdating(charity.id);
    try {
      const response = await fetch('/api/user/select-charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId: charity.id }),
      });
      
      const result: ApiResponse = await response.json();
      if (result.success) {
        setSelectedCharity(charity);
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        alert(result.error || 'Failed to update selection');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Current selection display */}
      <div className="bg-zinc-950 border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-4 group">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/10 group-hover:border-orange-500/50 transition-all shadow-xl shadow-zinc-950/40">
            {selectedCharity ? (
              <img 
                src={selectedCharity.image_url} 
                alt={selectedCharity.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                <HeartOff className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">
              Current Support
            </span>
            <h4 className="text-base font-black text-white leading-tight">
              {selectedCharity?.name || 'No charity selected'}
            </h4>
          </div>
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5 shadow-lg group-active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Change Cause
        </button>
      </div>

      {/* Selection Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-white tracking-tight">Select Your Cause</h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Modal Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search all charities..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:border-orange-500/50 outline-hidden transition-all placeholder-zinc-600 appearance-none"
                  />
                </div>
              </div>

              {/* Modal List */}
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {loading ? (
                  <div className="py-20 text-center text-zinc-500 flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Warming the heart...</span>
                  </div>
                ) : filteredCharities.length > 0 ? (
                  filteredCharities.map(charity => (
                    <button
                      key={charity.id}
                      onClick={() => handleSelect(charity)}
                      disabled={updating !== null}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group/item",
                        selectedCharity?.id === charity.id 
                          ? "bg-orange-500/10 border-orange-500/30" 
                          : "bg-zinc-900 border-transparent hover:bg-zinc-800 hover:border-white/5"
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 flex-shrink-0 bg-zinc-800">
                        <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-sm font-bold text-white group-hover/item:text-orange-400 transition-colors leading-tight">
                          {charity.name}
                        </h5>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {charity.description}
                        </p>
                      </div>
                      {updating === charity.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                      ) : selectedCharity?.id === charity.id ? (
                        <div className="p-1.5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-zinc-600">
                     <HeartOff className="w-8 h-8 mx-auto mb-2 opacity-20" />
                     <p className="text-xs font-bold uppercase tracking-widest">No matches found</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex items-center justify-center">
                 <p className="text-[10px] font-bold text-zinc-600 flex items-center gap-1.5 uppercase tracking-widest leading-relaxed">
                   <Heart className="w-3 h-3 text-zinc-800" />
                   Selection takes effect immediately
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
