"use client";

import Link from "next/link";
import {
  Zap,
  Grid,
  Eye,
  Hash,
  BookOpen,
  Cpu,
  Box,
  Play,
  Sparkles,
} from "lucide-react";
import { BenchmarkTest, TestScoreRecord } from "@/types/benchmark";

interface GameCardProps {
  test: BenchmarkTest;
  record?: TestScoreRecord;
}

const GAME_VISUALS: Record<
  string,
  {
    icon: React.ElementType;
    gradient: string;
    borderHover: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
  }
> = {
  "reaction-time": {
    icon: Zap,
    gradient: "from-amber-500/15 via-orange-500/5 to-transparent",
    borderHover: "hover:border-amber-400/60",
    iconBg: "bg-amber-500/15 border-amber-400/30",
    iconColor: "text-amber-400",
    badgeBg: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  },
  "sequence-memory": {
    icon: Grid,
    gradient: "from-cyan-500/15 via-blue-500/5 to-transparent",
    borderHover: "hover:border-cyan-400/60",
    iconBg: "bg-cyan-500/15 border-cyan-400/30",
    iconColor: "text-cyan-400",
    badgeBg: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  },
  "chimp-test": {
    icon: Eye,
    gradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
    borderHover: "hover:border-emerald-400/60",
    iconBg: "bg-emerald-500/15 border-emerald-400/30",
    iconColor: "text-emerald-400",
    badgeBg: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  },
  "number-memory": {
    icon: Hash,
    gradient: "from-blue-500/15 via-indigo-500/5 to-transparent",
    borderHover: "hover:border-blue-400/60",
    iconBg: "bg-blue-500/15 border-blue-400/30",
    iconColor: "text-blue-400",
    badgeBg: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  },
  "verbal-memory": {
    icon: BookOpen,
    gradient: "from-pink-500/15 via-rose-500/5 to-transparent",
    borderHover: "hover:border-pink-400/60",
    iconBg: "bg-pink-500/15 border-pink-400/30",
    iconColor: "text-pink-400",
    badgeBg: "text-pink-300 bg-pink-500/10 border-pink-500/20",
  },
  "matrix-reasoning": {
    icon: Cpu,
    gradient: "from-purple-500/15 via-violet-500/5 to-transparent",
    borderHover: "hover:border-purple-400/60",
    iconBg: "bg-purple-500/15 border-purple-400/30",
    iconColor: "text-purple-400",
    badgeBg: "text-purple-300 bg-purple-500/10 border-purple-500/20",
  },
  "mental-rotation": {
    icon: Box,
    gradient: "from-indigo-500/15 via-sky-500/5 to-transparent",
    borderHover: "hover:border-indigo-400/60",
    iconBg: "bg-indigo-500/15 border-indigo-400/30",
    iconColor: "text-indigo-400",
    badgeBg: "text-indigo-300 bg-indigo-500/10 border-indigo-500/20",
  },
};

export function GameCard({ test, record }: GameCardProps) {
  const visual = GAME_VISUALS[test.slug] || {
    icon: Sparkles,
    gradient: "from-[#3988EF]/15 to-transparent",
    borderHover: "hover:border-[#3988EF]/60",
    iconBg: "bg-[#3988EF]/15 border-[#3988EF]/30",
    iconColor: "text-[#3988EF]",
    badgeBg: "text-[#3988EF] bg-[#3988EF]/10 border-[#3988EF]/20",
  };

  const IconComponent = visual.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] ${visual.borderHover} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col justify-between`}
    >
      {/* Top Radial Accent Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />

      {/* Watermark Background Icon */}
      <IconComponent
        className={`absolute -right-4 -bottom-4 w-28 h-28 ${visual.iconColor} opacity-[0.04] group-hover:opacity-[0.09] group-hover:scale-110 transition-all duration-500 pointer-events-none`}
      />

      <div className="relative z-10 space-y-4">
        {/* Top Row: Custom Game Emblem + Category & Percentile */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl border ${visual.iconBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}
          >
            <IconComponent className={`w-6 h-6 ${visual.iconColor}`} />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${visual.badgeBg}`}
            >
              {test.category}
            </span>
            {record && (
              <span className="text-[11px] font-bold text-emerald-400">
                Top {(100 - record.percentile).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-white tracking-tight">
            {test.title}
          </h3>
          <p className="text-xs text-[#98A6BD] mt-1 leading-relaxed">
            {test.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: Best Score & Play Button */}
      <div className="relative z-10 pt-5 mt-5 border-t border-[#26344C]/70 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#98A6BD]">
            Personal Best
          </div>
          <div className="font-mono font-extrabold text-base text-white">
            {record ? (
              <>
                {record.bestScore}{" "}
                <span className="text-xs font-normal text-[#98A6BD]">
                  {test.unit}
                </span>
              </>
            ) : (
              <span className="text-xs font-sans font-medium text-[#98A6BD]">
                Unranked
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/tests/${test.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#3988EF]/20 transition-all active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Play
        </Link>
      </div>
    </div>
  );
}