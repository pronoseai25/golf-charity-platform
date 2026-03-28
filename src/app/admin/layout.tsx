"use client";

import { ReactNode, useState } from "react";
import { AdminNav, AdminSidebarFoot } from "@/components/admin/AdminNav";
import { ShieldCheck, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-serif italic text-white tracking-widest leading-none mb-0.5">Admin.</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] truncate italic opacity-80">Ops Console</p>
        </div>
      </div>

      {/* Sidebar Nav */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 ml-3 italic opacity-50">Menu</p>
        <AdminNav onNavClick={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar Footer */}
      <div className="p-5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-serif italic text-base border border-indigo-500/30 shrink-0">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate tracking-tight text-white mb-0.5">Administrator</p>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic opacity-70">Overseer</p>
          </div>
        </div>
        <AdminSidebarFoot />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] bg-[#050810] text-slate-100 flex-col border-r border-white/5 shrink-0 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-[260px] bg-[#050810] text-slate-100 flex flex-col border-r border-white/5 z-50 transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-[260px] relative z-10 min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#050810] border-b border-white/5 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-400" />
            <span className="text-sm font-serif italic text-white tracking-widest">Admin.</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

