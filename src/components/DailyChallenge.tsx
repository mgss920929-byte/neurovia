"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Play, Sparkles, Timer } from "lucide-react";
import { BENCHMARK_TESTS } from "@/lib/scoring";

export function DailyChallenge() {
  const [timeLeft, setTimeLeft] = useState<string>("24h 00m");

  // Pick a deterministic daily test based on the current date
  const todayIndex = new Date().getDate() % BENCHMARK_TESTS.length;
  const dailyTest = BENCHMARK_TESTS[todayIndex];

  useEffect(() => {
    // Calculate time remaining until midnight UTC
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1
      );
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#131F35] via-[#10182A] to-[#131F35] border border-[#8065F5]/40 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#8065F5]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8065F5]/20 border border-[#8065F5]/40 flex items-center justify-center text-[#C4B5FD] shadow-inner">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#8065F5]/20 text-[#C4B5FD] border border-[#8065F5]/30">
                Daily Challenge
              </span>
              <span className="text-xs text-[#98A6BD] flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> {timeLeft}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {dailyTest.title} Mastery
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-[#98A6BD]">Bonus Reward</div>
            <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +150 XP
            </div>
          </div>
          <Link
            href={`/tests/${dailyTest.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#3988EF]/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Play Daily
          </Link>
        </div>
      </div>
    </div>
  );
}