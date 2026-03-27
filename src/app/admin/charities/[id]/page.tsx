"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Trophy, 
  Loader2,
  Heart,
  Globe,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { CharityEventForm } from "@/components/admin/CharityEventForm";
import { Charity, CharityEvent, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function CharityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [charity, setCharity] = useState<Charity | null>(null);
  const [events, setEvents] = useState<CharityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CharityEvent | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Charity Details
      const cRes = await fetch(`/api/admin/charities`);
      const cJson = await cRes.json() as ApiResponse<Charity[]>;
      const current = cJson.data?.find(c => c.id === id);
      if (current) setCharity(current);

      // Fetch Events for this charity
      const eRes = await fetch(`/api/admin/charity-events?charity_id=${id}`);
      const eJson = await eRes.json() as ApiResponse<CharityEvent[]>;
      if (eJson.success && eJson.data) {
        setEvents(eJson.data);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeactivate = async (eventId: string) => {
    if (!confirm("Are you sure you want to deactivate this event?")) return;
    try {
       const res = await fetch(`/api/admin/charity-events/${eventId}`, { method: 'DELETE' });
       if (res.ok) fetchData();
    } catch (error) {
       console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="text-indigo-600 animate-spin" size={48} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing partnership events...</p>
      </div>
    );
  }

  if (!charity) return <div>Charity not found</div>;

  return (
    <div className="space-y-10 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
         <Link 
            href="/admin/charities"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold group transition-all"
         >
            <div className="p-2 border border-slate-200 rounded-xl group-hover:bg-slate-50 transition-colors">
               <ArrowLeft size={18} />
            </div>
            Back to Partners
         </Link>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => { setSelectedEvent(undefined); setShowForm(true); }}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-indigo-100 hover:bg-indigo-600"
            >
               <Plus size={20} />
               Register New Event
            </button>
         </div>
      </div>

      {/* Charity Summary Card */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
            <div className="relative w-40 h-40 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
               {charity.image_url ? (
                  <Image src={charity.image_url} alt={charity.name} fill className="object-cover" />
               ) : (
                  <Heart size={48} className="text-indigo-200" fill="currentColor" />
               )}
            </div>
            <div className="flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit">{charity.name}</h1>
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    charity.is_active ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-100 text-slate-500 border-slate-200"
                  )}>
                    {charity.is_active ? "Active Partner" : "Inactive"}
                  </div>
                  {charity.is_featured && (
                    <div className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-2">
                       <Trophy size={10} />
                       Featured
                    </div>
                  )}
               </div>
               <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed max-w-2xl">{charity.description}</p>
               
               <div className="flex flex-wrap gap-4">
                  {charity.website_url && (
                    <a 
                      href={charity.website_url} 
                      target="_blank" 
                      className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-white hover:border-indigo-100 hover:text-indigo-600 transition-all"
                    >
                      <Globe size={18} />
                      Official Website
                      <ExternalLink size={14} className="opacity-50" />
                    </a>
                  )}
                  <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold">
                     <CalendarIcon size={18} />
                     {events.length} Events Scheduled
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-outfit">Partnership Events</h2>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Upcoming & Past</div>
         </div>

         {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {events.map((event) => (
                  <div key={event.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-indigo-600">
                     <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-4">
                              <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600 border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                 {event.event_type === 'golf_day' ? <Trophy size={24} /> : <CalendarIcon size={24} />}
                              </div>
                              <div>
                                 <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{event.title}</h4>
                                 <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                    <span className="flex items-center gap-1">
                                       <CalendarIcon size={14} />
                                       {format(new Date(event.event_date), 'PPP')}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1">
                                       <MapPin size={14} />
                                       {event.location}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <button 
                                onClick={() => { setSelectedEvent(event); setShowForm(true); }}
                                className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                              >
                                 <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeactivate(event.id)}
                                className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                              >
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </div>

                        <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                           {event.description || "Join us for this special partnership event to support our cause."}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                           <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                              {event.event_type.replace('_', ' ')}
                           </div>
                           {event.registration_url && (
                              <a 
                                 href={event.registration_url} 
                                 target="_blank" 
                                 className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                              >
                                 Open Registration
                                 <ArrowLeft className="rotate-180" size={16} />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center px-10">
               <div className="w-20 h-20 bg-white shadow-lg rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-white">
                  <CalendarIcon size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">No Events Scheduled</h3>
               <p className="text-slate-500 max-w-xs mb-8 font-medium">Create partnership events to increase donor engagement and visibility.</p>
               <button 
                  onClick={() => { setSelectedEvent(undefined); setShowForm(true); }}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
               >
                  <Plus size={18} />
                  Register Event
               </button>
            </div>
         )}
      </div>

      {showForm && (
        <CharityEventForm 
          charityId={id} 
          event={selectedEvent} 
          onClose={() => setShowForm(false)} 
          onSuccess={fetchData} 
        />
      )}
    </div>
  );
}
