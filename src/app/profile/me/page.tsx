"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Save, Check, Trophy, Zap, Award } from "lucide-react";
import { BENCHMARK_TESTS, getLocalScores } from "@/lib/scoring";
import { TestScoreRecord } from "@/types/benchmark";

export default function ProfilePage() {
  const [username, setUsername] = useState<string>("Competitor");
  const [saved, setSaved] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<string, TestScoreRecord>>({});

  useEffect(() => {
    setScores(getLocalScores());
    const storedName = localStorage.getItem("neurovia_username");
    if (storedName) setUsername(storedName);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("neurovia_username", username);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Compute level, XP, and average percentile directly from local scores
  const completedRecords = Object.values(scores);
  const totalAttempts = completedRecords.reduce(
    (sum, r) => sum + (r.attempts || 1),
    0
  );
  const totalXp = completedRecords.length * 250 + totalAttempts * 50;
  const level = Math.floor(totalXp / 500) + 1;
  const avgPercentile =
    completedRecords.length > 0
      ? (
          completedRecords.reduce((sum, r) => sum + r.percentile, 0) /
          completedRecords.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen text-[#F4F7FF] pb-20">
      <header className="border-b border-[#26344C] bg-[#10182A]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#98A6BD] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="font-bold text-white text-sm tracking-wider">
            COMPETITOR PROFILE
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {/* Identity & Username Card */}
        <div className="bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3988EF] to-[#8065F5] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#3988EF]/25">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{username}</h1>
              <p className="text-xs text-[#98A6BD]">
                Level {level} Competitor · {totalXp} Total XP · {completedRecords.length}/{BENCHMARK_TESTS.length} Benchmarks Calibrated
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="space-y-4 pt-4 border-t border-[#26344C]"
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#98A6BD]">
                Competitor Username
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-[#080D1A] border border-[#26344C] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3988EF]"
                  placeholder="Enter your handle..."
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3988EF] to-[#8065F5] hover:opacity-95 text-white text-xs font-bold shadow transition-all"
                >
                  {saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saved ? "Saved!" : "Save Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Competitor Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] rounded-2xl p-5 space-y-1">
            <div className="text-xs text-[#98A6BD] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Avg Percentile
            </div>
            <div className="text-2xl font-extrabold text-white">
              {avgPercentile}%
            </div>
          </div>

          <div className="bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] rounded-2xl p-5 space-y-1">
            <div className="text-xs text-[#98A6BD] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#3988EF]" /> Total XP
            </div>
            <div className="text-2xl font-extrabold text-[#3988EF]">
              {totalXp} XP
            </div>
          </div>

          <div className="bg-[#10182A]/90 backdrop-blur-sm border border-[#26344C] rounded-2xl p-5 space-y-1">
            <div className="text-xs text-[#98A6BD] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Total Attempts
            </div>
            <div className="text-2xl font-extrabold text-white">
              {totalAttempts}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}