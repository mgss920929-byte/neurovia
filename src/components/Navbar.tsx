"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Globe, LayoutDashboard, Trophy } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "World Arena", href: "/arena", icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#26344C] bg-[#080D1A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3988EF] to-[#8065F5] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider text-[#F4F7FF] font-sans">
            NEURO<span className="text-[#3988EF]">VIA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#131F35] text-[#3988EF] border border-[#26344C]"
                    : "text-[#98A6BD] hover:text-[#F4F7FF] hover:bg-[#10182A]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10182A] border border-[#26344C] text-xs text-[#98A6BD]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Season 1 Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}