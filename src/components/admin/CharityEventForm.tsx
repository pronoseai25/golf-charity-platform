"use client";

import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  Check, 
  Loader2,
  Trophy,
  Type
} from "lucide-react";
import { CharityEvent, EventType } from "@/types";
import { cn } from "@/lib/utils";

const eventTypes: { value: EventType; label: string; icon: any }[] = [
  { value: 'golf_day', label: 'Golf Day', icon: Trophy },
  { value: 'fundraiser', label: 'Fundraiser', icon: Calendar },
  { value: 'tournament', label: 'Tournament', icon: Tag },
  { value: 'other', label: 'Other', icon: MapPin },
];

interface CharityEventFormProps {
  charityId: string;
  event?: CharityEvent;
  onClose: () => void;
  onSuccess: () => void;
}

export function CharityEventForm({ charityId, event, onClose, onSuccess }: CharityEventFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    event_date: event?.event_date || "",
    location: event?.location || "",
    event_type: event?.event_type || "golf_day" as EventType,
    image_url: event?.image_url || "",
    registration_url: event?.registration_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = event 
        ? `/api/admin/charity-events/${event.id}` 
        : '/api/admin/charity-events';
      
      const res = await fetch(url, {
        method: event ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, charity_id: charityId })
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                  <Calendar className="text-white" size={24} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    {event ? "Modify Event" : "Create Partnership Event"}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Event Scheduling & Outreach</p>
               </div>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                <div className="relative">
                   <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text"
                     required
                     className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                     placeholder="e.g. Annual Charity Open 2026"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                        value={formData.event_date ? formData.event_date.split('T')[0] : ""}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                        placeholder="e.g. St Andrews Links"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {eventTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, event_type: type.value })}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group",
                          formData.event_type === type.value 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                            : "bg-slate-50 border-slate-50 text-slate-500 hover:bg-white hover:border-slate-100"
                        )}
                      >
                         <type.icon size={20} className={cn(
                           "transition-transform",
                           formData.event_type === type.value ? "scale-110" : "group-hover:scale-110"
                         )} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brief Description</label>
                <textarea 
                  rows={3}
                  className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium leading-relaxed"
                  placeholder="Key event highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Media URL</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="https://imgur.com/event.jpg"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">External Registration / Info Link</label>
                   <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="https://eventbrite.com/buy"
                        value={formData.registration_url}
                        onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 px-10 border-t border-slate-100 flex items-center justify-end gap-4">
             <button 
               type="button"
               onClick={onClose}
               className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-all rounded-2xl"
             >
               Discard
             </button>
             <button 
               type="submit"
               disabled={loading}
               className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 min-w-[180px]"
             >
               {loading ? (
                 <Loader2 size={24} className="animate-spin" />
               ) : (
                 <>
                   <Check size={20} />
                   {event ? "Save Event" : "Create Event"}
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
