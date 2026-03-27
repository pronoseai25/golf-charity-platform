"use client";

import { useState } from "react";
import { 
  Heart, 
  X, 
  Paperclip, 
  Globe, 
  Image as ImageIcon, 
  Type,
  Layout,
  Check,
  Loader2
} from "lucide-react";
import { Charity } from "@/types";
import { cn } from "@/lib/utils";

interface CharityFormProps {
  charity?: Charity;
  onClose: () => void;
  onSuccess: () => void;
}

export function CharityForm({ charity, onClose, onSuccess }: CharityFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: charity?.name || "",
    slug: charity?.slug || "",
    description: charity?.description || "",
    image_url: charity?.image_url || "",
    website_url: charity?.website_url || "",
    is_featured: charity?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = charity 
        ? `/api/admin/charities/${charity.id}` 
        : '/api/admin/charities';
      
      const res = await fetch(url, {
        method: charity ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                  <Heart className="text-white" size={24} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {charity ? "Edit Charity" : "Register New Charity"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Configure partnership details and branding.</p>
               </div>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Charity Name</label>
                   <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                        placeholder="e.g. Save the Ocean"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({ ...formData, name, slug: charity ? formData.slug : autoSlug(name) });
                        }}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug (URL Fragment)</label>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-mono font-bold"
                        placeholder="save-the-ocean"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mission Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium leading-relaxed"
                  placeholder="Tell the community about this charity's impact..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logo / Cover Image URL</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="https://imgur.com/logo.png"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Website</label>
                   <div className="relative">
                      <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="https://charity.org"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                <div 
                  onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                  className={cn(
                    "w-14 h-8 rounded-full transition-all flex items-center px-1 cursor-pointer",
                    formData.is_featured ? "bg-indigo-600" : "bg-slate-300"
                  )}
                >
                   <div className={cn(
                     "w-6 h-6 bg-white rounded-full shadow-md transition-all",
                     formData.is_featured ? "translate-x-6" : "translate-x-0"
                   )} />
                </div>
                <div>
                   <p className="text-sm font-black text-indigo-900 leading-none mb-1">Feature on Homepage</p>
                   <p className="text-xs text-indigo-600/70 font-medium uppercase tracking-wider">Highlight this cause to all users.</p>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 px-10 border-t border-slate-100 flex items-center justify-end gap-4">
             <button 
               type="button"
               onClick={onClose}
               className="px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-all rounded-2xl"
             >
               Discard
             </button>
             <button 
               type="submit"
               disabled={loading}
               className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 disabled:opacity-50"
             >
               {loading ? (
                 <>
                   <Loader2 size={20} className="animate-spin" />
                   Processing...
                 </>
               ) : (
                 <>
                   <Check size={20} />
                   {charity ? "Update Charity" : "Register Charity"}
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
