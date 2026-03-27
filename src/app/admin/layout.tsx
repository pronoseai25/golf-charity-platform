import { ReactNode } from "react";
import { AdminNav, AdminSidebarFoot } from "@/components/admin/AdminNav";
import { ShieldCheck, User } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-outfit text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0">
        {/* Sidebar Header */}
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-slate-500 text-[13px] font-medium uppercase tracking-wider">Golf Charity Ops</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1">
          <AdminNav />
        </div>

        {/* Sidebar Footer */}
        <div className="p-6">
          <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold border-2 border-slate-600">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate leading-none mb-1">Administrator</p>
              <p className="text-xs text-slate-500 truncate">System Overseer</p>
            </div>
          </div>
          <AdminSidebarFoot />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div>
            {/* Breadcrumbs or dynamic page title will go here if needed */}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-600">Server Online</span>
             </div>
             <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all rounded-full relative">
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
                <ShieldCheck size={20} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
