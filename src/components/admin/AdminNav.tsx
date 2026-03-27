"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Trophy, 
  Heart, 
  LayoutDashboard, 
  BarChart3, 
  Calendar, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Winner Verification", href: "/admin/winners", icon: Trophy },
  { name: "Charity Management", href: "/admin/charities", icon: Heart },
  { name: "Draw Simulation", href: "/admin/draws", icon: Calendar },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-8 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
              isActive 
                ? "bg-white/10 text-white shadow-lg" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800/50 group-hover:bg-slate-800 text-slate-400 group-hover:text-white"
              )}>
                <Icon size={20} />
              </div>
              <span className="font-medium text-[15px]">{item.name}</span>
            </div>
            {isActive && (
              <ChevronRight size={16} className="text-white/50" />
            )}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebarFoot() {
  return (
    <div className="p-4 border-t border-white/5">
      <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
