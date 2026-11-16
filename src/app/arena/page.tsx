"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Search,
  Trophy,
  Zap,
  Medal,
  MapPin,
} from "lucide-react";
import { BENCHMARK_TESTS, getLocalScores } from "@/lib/scoring";
import { NeuroviaLogo } from "@/components/NeuroviaLogo";
import { TestScoreRecord } from "@/types/benchmark";

export default function WorldArenaPage() {
  const [selectedTest, setSelectedTest] = useState<string>("reaction-time");
  const [scope, setScope] = useState<"global" | "country">("global");
  const [country, setCountry] = useState<string>("India");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [scoresMap, setScoresMap] = useState<Record<string, TestScoreRecord>>({});
  const [username, setUsername] = useState<string>("Competitor");
  const [loading, setLoading] = useState<boolean>(true);

  const currentTestMeta = BENCHMARK_TESTS.find((t) => t.slug === selectedTest);

  useEffect(() => {
    const local = getLocalScores();
    setScoresMap(local);
    const storedName = localStorage.getItem("neurovia_username");
    if (storedName) setUsername(storedName);
    setLoading(false);
  }, []);

  const currentRecord = scoresMap[selectedTest];

  // Only include user entry if they have actually played this specific test (score > 0 or recorded)
  const baseEntries = currentRecord && currentRecord.bestScore > 0
    ? [
        {
          id: "local-user",
          score: currentRecord.bestScore,
          percentile: currentRecord.percentile,
          created_at: currentRecord.updatedAt,
          username: username,
          country: "India",
          isUser: true,
        },
      ]
    : [];

  // Simulated elite global competitors with realistic baseline scores
  const dummyCompetitors: Record<string, Array<{ id: string; score: number; percentile: number; created_at: string; username: string; country: string; isUser: boolean }>> = {
    "reaction-time": [
      { id: "c1", score: 142, percentile: 99.8, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
      { id: "c2", score: 165, percentile: 98.2, created_at: new Date().toISOString(), username: "SynapseX", country: "Germany", isUser: false },
      { id: "c3", score: 178, percentile: 95.0, created_at: new Date().toISOString(), username: "AeroPulse", country: "India", isUser: false },
      { id: "c4", score: 195, percentile: 91.4, created_at: new Date().toISOString(), username: "NeuralVortex", country: "Japan", isUser: false },
    ],
    "sequence-memory": [
      { id: "c1", score: 14, percentile: 99.5, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
      { id: "c2", score: 12, percentile: 97.0, created_at: new Date().toISOString(), username: "SynapseX", country: "Germany", isUser: false },
      { id: "c3", score: 10, percentile: 92.4, created_at: new Date().toISOString(), username: "AeroPulse", country: "India", isUser: false },
    ],
    "chimp-test": [
      { id: "c1", score: 18, percentile: 99.9, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
      { id: "c2", score: 15, percentile: 98.0, created_at: new Date().toISOString(), username: "SynapseX", country: "Germany", isUser: false },
    ],
    "number-memory": [
      { id: "c1", score: 16, percentile: 99.5, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
    ],
    "verbal-memory": [
      { id: "c1", score: 85, percentile: 99.2, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
    ],
    "matrix-reasoning": [
      { id: "c1", score: 18, percentile: 99.6, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
    ],
    "mental-rotation": [
      { id: "c1", score: 98, percentile: 99.8, created_at: new Date().toISOString(), username: "CyberMage", country: "United States", isUser: false },
      { id: "c2", score: 85, percentile: 98.2, created_at: new Date().toISOString(), username: "SynapseX", country: "Germany", isUser: false },
      { id: "c3", score: 74, percentile: 95.0, created_at: new Date().toISOString(), username: "AeroPulse", country: "India", isUser: false },
    ],
  };

  const testDummyList = dummyCompetitors[selectedTest] || [];
  const allEntries = [...baseEntries, ...testDummyList].sort((a, b) => {
    // Reaction time: lower is better. All other tests: higher is better.
    if (selectedTest === "reaction-time") {
      return a.score - b.score;
    }
    return b.score - a.score;
  });

  // Filter based on scope (Global vs Country) and search query
  const filteredEntries = allEntries.filter((entry) => {
    const matchesScope = scope === "global" || entry.country === country;
    const matchesSearch = searchQuery
      ? String(entry.score).toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.country.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesScope && matchesSearch;
  });

  return (
    <div className="min-h-screen text-[#F4F7FF] pb-20">
      {/* Top Header Navigation */}
      <header className="border-b border-[#26344C] bg-[#10182A]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#98A6BD] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <span className="text-[#26344C]">|</span>
            <div className="flex items-center gap-2.5">
              <NeuroviaLogo className="w-7 h-7" />
              <span className="font-extrabold text-white text-sm tracking-wider">WORLD ARENA</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#131F35] border border-[#26344C] rounded-xl px-3.5 py-1.5 text-xs text-amber-400 font-bold shadow-inner">
            <Crown className="w-3.5 h-3.5" /> Season 1 Active
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        {/* Arena Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#131F35]/90 via-[#10182A]/90 to-[#080D1A]/90 backdrop-blur-sm border border-[#26344C] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3988EF]/10 border border-[#3988EF]/30 text-xs font-semibold text-[#3988EF]">
              <Trophy className="w-3.5 h-3.5" /> GLOBAL &amp; REGIONAL LEADERBOARDS
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Cognitive Battlegrounds
            </h1>
            <p className="text-xs md:text-sm text-[#98A6BD] max-w-xl leading-relaxed">
              Compare your verified personal bests against elite competitors worldwide or within your country.
            </p>
          </div>

          {/* Scope & Country Toggle Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
            {scope === "country" && (
              <div className="flex items-center gap-2 bg-[#080D1A] border border-[#26344C] rounded-xl px-3 py-2 text-xs text-white">
                <MapPin className="w-3.5 h-3.5 text-[#3988EF]" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="India" className="bg-[#10182A]">India</option>
                  <option value="United States" className="bg-[#10182A]">United States</option>
                  <option value="Germany" className="bg-[#10182A]">Germany</option>
                  <option value="Japan" className="bg-[#10182A]">Japan</option>
                </select>
              </div>
            )}

            <div className="flex items-center bg-[#080D1A] border border-[#26344C] rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setScope("global")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  scope === "global"
                    ? "bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white shadow-md shadow-[#3988EF]/20"
                    : "text-[#98A6BD] hover:text-white"
                }`}
              >
                Global Arena
              </button>
              <button
                onClick={() => setScope("country")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  scope === "country"
                    ? "bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white shadow-md shadow-[#3988EF]/20"
                    : "text-[#98A6BD] hover:text-white"
                }`}
              >
                Country Rank
              </button>
            </div>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BENCHMARK_TESTS.map((test) => (
            <button
              key={test.slug}
              onClick={() => setSelectedTest(test.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTest === test.slug
                  ? "bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white shadow-lg shadow-[#3988EF]/20 scale-105"
                  : "bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] text-[#98A6BD] hover:text-white"
              }`}
            >
              {test.title}
            </button>
          ))}
        </div>

        {/* Leaderboard Table Section */}
        <div className="bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#26344C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3988EF]/15 border border-[#3988EF]/30 flex items-center justify-center text-[#3988EF]">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {currentTestMeta?.title} — {scope === "global" ? "Global Rankings" : `${country} Rankings`}
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#98A6BD]" />
              <input
                type="text"
                placeholder="Search competitor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080D1A] border border-[#26344C] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#98A6BD] focus:outline-none focus:border-[#3988EF]"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#98A6BD]">
              Loading rankings...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-sm font-semibold text-white">No Verified Score Recorded Yet</div>
              <p className="text-xs text-[#98A6BD] max-w-sm mx-auto leading-relaxed">
                You haven&apos;t played {currentTestMeta?.title} yet. Play the test from your dashboard to record your valid score and claim your rank!
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] text-white text-xs font-bold shadow"
                >
                  Play Test Now →
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#26344C]">
              {filteredEntries.map((entry, index) => {
                return (
                  <div
                    key={entry.id}
                    className={`px-6 py-4 flex items-center justify-between transition-colors ${
                      entry.isUser ? "bg-[#3988EF]/10 border-l-4 border-l-[#3988EF]" : "hover:bg-[#131F35]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex items-center justify-center font-mono font-extrabold text-sm">
                        {index === 0 ? (
                          <Medal className="w-5 h-5 text-amber-400" />
                        ) : index === 1 ? (
                          <Medal className="w-5 h-5 text-slate-300" />
                        ) : index === 2 ? (
                          <Medal className="w-5 h-5 text-amber-600" />
                        ) : (
                          <span className="text-[#98A6BD]">#{index + 1}</span>
                        )}
                      </div>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow ${
                        entry.isUser 
                          ? "bg-gradient-to-br from-[#3988EF] to-[#8065F5] text-white shadow-[#3988EF]/30" 
                          : "bg-[#131F35] border border-[#26344C] text-[#98A6BD]"
                      }`}>
                        {entry.username.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{entry.username}</span>
                          {entry.isUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#3988EF]/20 border border-[#3988EF]/40 text-[#3988EF] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#98A6BD] flex items-center gap-2">
                          <span>{entry.country}</span>
                          <span>·</span>
                          <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-extrabold text-white text-base">
                        {entry.score}{" "}
                        <span className="text-xs font-normal text-[#98A6BD]">
                          {currentTestMeta?.unit}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-400">
                        Top {(100 - entry.percentile).toFixed(1)}% ({entry.percentile}th pct)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}