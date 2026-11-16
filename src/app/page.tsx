"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BENCHMARK_TESTS, getLocalScores } from "@/lib/scoring";
import { CognitiveCategory, TestScoreRecord } from "@/types/benchmark";
import { Brain, Trophy, Globe, User } from "lucide-react";
import { NeuroviaLogo } from "@/components/NeuroviaLogo";
import { GameCard } from "@/components/GameCard";

const CATEGORIES: ("All" | CognitiveCategory)[] = [
  "All",
  "Speed",
  "Memory",
  "Logic",
  "Spatial",
];

export default function DashboardPage() {
  const [scores, setScores] = useState<Record<string, TestScoreRecord>>({});
  const [selectedCategory, setSelectedCategory] = useState<"All" | CognitiveCategory>("All");

  useEffect(() => {
    setScores(getLocalScores());
  }, []);

  const filteredTests =
    selectedCategory === "All"
      ? BENCHMARK_TESTS
      : BENCHMARK_TESTS.filter((t) => t.category === selectedCategory);

  const completedList = Object.values(scores);
  const avgPercentile =
    completedList.length > 0
      ? (
          completedList.reduce((acc, item) => acc + item.percentile, 0) /
          completedList.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen text-[#F4F7FF] pb-20">
      {/* Top Header Navigation Bar */}
      <header className="border-b border-[#26344C] bg-[#10182A]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <NeuroviaLogo />
            <div>
              <span className="font-extrabold tracking-wider text-white text-lg">
                NEUROVIA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#131F35] border border-[#26344C] text-[#98A6BD]">
                Global Beta
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/arena"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#98A6BD] hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-[#3988EF]" />
              <span>World Arena</span>
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#98A6BD] hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-[#3988EF]" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/profile/me"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131F35] hover:bg-[#1B2A47] border border-[#26344C] text-xs font-semibold text-white transition-colors"
            >
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero Section */}
        <section className="rounded-3xl border border-[#26344C] bg-gradient-to-br from-[#131F35]/90 via-[#10182A]/90 to-[#080D1A]/90 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3988EF]/10 border border-[#3988EF]/30 text-[#3988EF] text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              Cognitive Benchmarking Suite • Phase 1
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Measure Your Mind&apos;s True Potential
            </h1>
            <p className="text-[#98A6BD] text-sm md:text-base leading-relaxed">
              Benchmark your reflexes, working memory, pattern logic, and spatial reasoning against global distributions.
            </p>
          </div>

          <div className="bg-[#080D1A]/80 border border-[#26344C] rounded-2xl p-5 min-w-[230px] space-y-1 shadow-inner">
            <div className="text-xs uppercase tracking-wider text-[#98A6BD] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Cognitive Percentile
            </div>
            <div className="text-3xl font-extrabold text-white">
              {avgPercentile ? `${avgPercentile}%` : "Unranked"}
            </div>
            <div className="text-xs text-[#98A6BD]">
              {completedList.length} of {BENCHMARK_TESTS.length} benchmarks completed
            </div>
          </div>
        </section>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white shadow-lg shadow-[#3988EF]/20"
                    : "bg-[#10182A] text-[#98A6BD] hover:text-white border border-[#26344C]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Game Cards Grid (Using Upgraded GameCard Component) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map((test) => (
            <GameCard key={test.id} test={test} record={scores[test.slug]} />
          ))}
        </div>
      </main>
    </div>
  );
}