"use client";

import Link from "next/link";
import { CategoryPerformance } from "@/lib/analytics";
import { BarChart3 } from "lucide-react";

interface PerformanceChartProps {
  categories: CategoryPerformance[];
}

export function PerformanceChart({ categories }: PerformanceChartProps) {
  const hasAnyData = categories.some((c) => c.averagePercentile !== null);

  return (
    <div className="bg-[#10182A] border border-[#26344C] rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3988EF]" /> Cognitive Domain Breakdown
          </h3>
          <p className="text-xs text-[#98A6BD] mt-0.5">
            Average percentile standing across Speed, Memory, Logic, and Spatial tasks
          </p>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="bg-[#080D1A]/70 border border-[#26344C] rounded-xl p-6 text-center space-y-2">
          <div className="text-sm font-semibold text-white">No Domain Data Recorded Yet</div>
          <p className="text-xs text-[#98A6BD] max-w-md mx-auto">
            Complete at least one benchmark in Speed, Memory, Logic, or Spatial to unlock your cognitive domain comparison chart.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const pct = cat.averagePercentile ?? 0;
            return (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{cat.category}</span>
                    <span className="text-[#98A6BD]">
                      ({cat.completedTests}/{cat.totalTests} tests · {cat.totalAttempts} attempts)
                    </span>
                  </div>
                  {cat.averagePercentile !== null ? (
                    <span className="font-mono font-bold text-emerald-400">
                      {cat.averagePercentile}th pct
                    </span>
                  ) : (
                    <span className="text-[#98A6BD]">Unplayed</span>
                  )}
                </div>

                <div className="h-2.5 w-full bg-[#080D1A] rounded-full overflow-hidden border border-[#26344C]/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#3988EF] to-[#8065F5] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2 border-t border-[#26344C] flex items-center justify-between text-[11px] text-[#98A6BD]">
        <span>Reference scores reflect task-specific distributions, not clinical IQ.</span>
        <Link href="/arena" className="text-[#3988EF] hover:underline font-medium">
          Compare in World Arena →
        </Link>
      </div>
    </div>
  );
}